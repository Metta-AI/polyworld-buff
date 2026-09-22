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
           'attribution': {'p0': 'alice', 'p1': 'bob'}, 'version': '51',
           'created_at': '2026-09-22T10:00:00Z'}
metadata = {'policy_stats': [{'position': i, 'policy_version_id': f'p{i}', 'policy_name': f'Bot{i}',
                            'policy_version': 1, 'avg_reward': i * 3.5} for i in range(10)]}
rows[0].update(cpu_pct=10, rej_ActionNoRoute=2)
secondRows = deepcopy(rows)
secondRows[0].update(cpu_pct=None, **{'class': 1})
del secondRows[0]['rej_ActionNoRoute']
secondEpisode = deepcopy(episode)
secondEpisode['version'] = '57'
secondEpisode['created_at'] = '2026-09-22T12:00:00Z'
secondEpisode['policy_version_ids'][0] = 'p0-v2'
secondEpisode['attribution']['p0-v2'] = 'alice'
secondMetadata = deepcopy(metadata)
secondMetadata['policy_stats'][0]['policy_version_id'] = 'p0-v2'
secondMetadata['policy_stats'][0]['policy_version'] = 2
secondMetadata['policy_stats'][0]['avg_reward'] = 20
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

print('Checking exact policy versions and version-specific denominators')
latest, earlier = byId['alice']['policyVersions']
assert latest['id'] == 'p0-v2' and latest['version'] == 2
assert latest['lastGameAt'] == '2026-09-22T12:00:00+00:00'
assert latest['games'] == earlier['games'] == 1
assert latest['values']['score'] == 20 and earlier['values']['score'] == 0
assert byId['alice']['values']['score'] == 10
assert latest['values']['cpu_pct'] is None and latest['samples']['cpu_pct'] == 0
assert earlier['values']['cpu_pct'] == 10 and earlier['samples']['cpu_pct'] == 1
assert latest['values']['rej_ActionNoRoute'] == 0
assert earlier['values']['rej_ActionNoRoute'] == 2
assert latest['values']['draft_1'] == earlier['values']['draft_0'] == 1
assert latest['engines'] == {'57': 1} and earlier['engines'] == {'51': 1}
assert byId['absent']['policyVersions'] == []
assert len(byId['bob']['policyVersions']) == 1
assert byId['bob']['policyVersions'][0]['games'] == 2
sameNumber = deepcopy(secondMetadata)
sameNumber['policy_stats'][0]['policy_version'] = 1
sameNumber['policy_stats'][0]['policy_name'] = 'DifferentPolicy'
sameColumns, _ = aggregate(players, [(episode, rows, metadata),
                                    (secondEpisode, secondRows, sameNumber)])
sameAlice = next(p for p in sameColumns if p['id'] == 'alice')
assert len(sameAlice['policyVersions']) == 2
assert sameAlice['policyVersions'][0]['name'] == 'DifferentPolicy'

print('Checking win/loss counts and per-game glory, including draws and missing scores')
winRows, lossRows, drawRows = deepcopy(rows), deepcopy(rows), deepcopy(rows)
for seat in range(10):
    winRows[seat]['won'] = int(seat < 5)
    lossRows[seat]['won'] = int(seat >= 5)
    drawRows[seat]['won'] = 0
winMetadata, lossMetadata, drawMetadata = deepcopy(metadata), deepcopy(metadata), deepcopy(metadata)
for info, score in [(winMetadata, 10), (lossMetadata, 90), (drawMetadata, 100)]:
    info['policy_stats'][0]['avg_reward'] = score
winMetadata['policy_stats'][1]['avg_reward'] = None
winMetadata['policy_stats'][6]['avg_reward'] = None
lossMetadata['policy_stats'][6]['avg_reward'] = 0
columns, _ = aggregate(players, [(episode, winRows, winMetadata),
                                (episode, lossRows, lossMetadata),
                                (episode, drawRows, drawMetadata)])
byId = {player['id']: player for player in columns}
assert byId['alice']['record'] == {'wins': 1, 'losses': 1, 'draws': 1}
assert byId['alice']['values']['score'] == 200 / 3
assert byId['alice']['values']['glory'] == 10 / 3
assert byId['alice']['samples']['glory'] == 3
assert byId['bob']['values']['glory'] == 0
assert byId['bob']['samples']['glory'] == 2
assert byId['policy_p6']['values']['glory'] == 0
assert byId['policy_p6']['samples']['glory'] == 3
assert byId['absent']['record'] == {'wins': 0, 'losses': 0, 'draws': 0}
assert byId['absent']['values'].get('glory') is None

bad = deepcopy(metadata)
bad['policy_stats'][0]['policy_version_id'] = 'wrong'
try:
    aggregate(players, [(episode, rows, bad)])
    raise AssertionError('Mismatched seat attribution was accepted')
except PlayersError:
    pass
print('Player report checks passed')
