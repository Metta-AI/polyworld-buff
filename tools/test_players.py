"""Exercise time boundaries, every-player attribution and missing-data means."""

from copy import deepcopy
from datetime import timedelta
import struct

from update_players import PlayersError, aggregate, inWindow, parseRows, replayVersion, stamp

print('Checking the exact eight-hour boundary')
end = stamp('2026-09-22T17:45:00Z')
start = end - timedelta(hours=8)
assert inWindow({'created_at': start.isoformat()}, start, end)
assert not inWindow({'created_at': end.isoformat()}, start, end)
assert not inWindow({'created_at': (start - timedelta(seconds=1)).isoformat()}, start, end)
try:
    stamp('2026-09-22T17:45:00')
    raise AssertionError('A timezone is required')
except PlayersError:
    pass

print('Checking engine header dispatch and malformed replays')
assert replayVersion(b'POLYWORLDREPLAY' + struct.pack('<HHH', 1, 57, 17) + b'gods_of_the_arena') == '57'
try:
    replayVersion(b'not a replay')
    raise AssertionError('Invalid header was accepted')
except PlayersError:
    pass

print('Checking all ten seats and unknown telemetry')
line = 'class=0 minutes=1 orders_pm=5 rejected_share=0 xp=100 won=0 cpu_pct=-1 attack_targets=0 alive_ticks=100 target_hero=0'
rows = parseRows('\n'.join(f'row {i} {line}' for i in range(10)))
assert rows[0]['cpu_pct'] is None and rows[0]['target_hero'] is None
try:
    parseRows(f'row 0 {line}\nrow 0 {line}')
    raise AssertionError('Duplicate or incomplete seats were accepted')
except PlayersError:
    pass
try:
    parseRows('\n'.join(f'row {i} {line.replace("xp=100", "xp=nan")}' for i in range(10)))
    raise AssertionError('Non-finite telemetry was accepted')
except PlayersError:
    pass

print('Checking player identities, baseline seats, versions and means')
players = {'alice': {'id': 'alice', 'name': 'Alice'}, 'bob': {'id': 'bob', 'name': 'Bob'},
           'absent': {'id': 'absent', 'name': 'No recent games'}}
episode = {'policy_version_ids': [f'p{i}' for i in range(10)],
           'attribution': {'p0': 'alice', 'p1': 'bob'}, 'version': '51'}
metadata = {'policy_stats': [{'position': i, 'policy_version_id': f'p{i}', 'policy_name': f'Bot{i}',
                            'policy_version': 1, 'avg_reward': i * 3.5} for i in range(10)]}
rows[0].update(cpu_pct=10, rej_ActionNoRoute=2)
secondRows = deepcopy(rows)
secondRows[0].update(cpu_pct=None, **{'class': 1})
del secondRows[0]['rej_ActionNoRoute']
secondEpisode = deepcopy(episode)
secondEpisode['version'] = '57'
secondMetadata = deepcopy(metadata)
secondMetadata['policy_stats'][0]['policy_version'] = 2
columns, reasons = aggregate(players, [(episode, rows, metadata), (secondEpisode, secondRows, secondMetadata)])
byId = {player['id']: player for player in columns}
assert len(columns) == 11
assert byId['alice']['games'] == 2 and len(byId['alice']['policies']) == 2
assert byId['alice']['values']['cpu_pct'] == 10 and byId['alice']['samples']['cpu_pct'] == 1
assert byId['alice']['values']['rej_ActionNoRoute'] == 1
assert byId['alice']['values']['draft_0'] == .5 and byId['alice']['values']['draft_1'] == .5
assert byId['bob']['values']['score'] == 3.5
assert byId['absent']['games'] == 0 and byId['absent']['values']['draft_0'] is None
assert byId['policy_p9']['baseline']
assert reasons == ['rej_ActionNoRoute']
bad = deepcopy(metadata)
bad['policy_stats'][0]['policy_version_id'] = 'wrong'
try:
    aggregate(players, [(episode, rows, bad)])
    raise AssertionError('Mismatched seat attribution was accepted')
except PlayersError:
    pass
print('Player report checks passed')
