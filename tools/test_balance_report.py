"""Check duplicate-pick denominators and publication's verification boundary."""

import json
from pathlib import Path
from tempfile import TemporaryDirectory

from update_balance_report import ROLES, aggregate, build, write


with TemporaryDirectory() as directory:
    root = Path(directory)
    for name in ('stats', 'drafts'):
        (root / name).mkdir()
    matches = []
    for index, outcome in enumerate(('RedTeam', 'BlueTeam', 'time_limit')):
        identity = 'private-match-' + str(index)
        matches.append({'id': identity, 'round_number': index + 1})
        heroes = []
        for slot, name in enumerate(ROLES):
            team = 'RedTeam' if slot < 5 else 'BlueTeam'
            heroes.append({
                'slot': slot, 'hero': name if index < 2 else 'Crossbowman',
                'class': slot if index < 2 else 6, 'team': team,
                'win': int(outcome == team), 'draw': outcome == 'time_limit',
                'level': 12, 'xp': 5000, 'kills': 4, 'deaths': 2, 'assists': 1,
                'last_hits': 80, 'neutral_kills': 10, 'tower_kills': 2,
                'player_id': 'private-player-' + str(slot),
                'policy_version_id': 'private-policy-' + str(slot),
            })
        game = {'id': identity, 'verified': True, 'hash_mismatches': 0,
                'game_version': 'test-release', 'replay_version': 68,
                'completed_at': '2026-10-06T01:00:00Z',
                'ticks': 28824, 'outcome': outcome, 'heroes': heroes}
        draft = {'id': identity, 'draft_ticks': 24, 'max_battle_ticks': 28800,
                 'draft_mode': 'OpenDraft', 'picks': [dict(slot=row['slot'],
                 **{'class': row['class']}, cause='Command') for row in heroes]}
        (root / 'stats' / (identity + '.json')).write_text(json.dumps(game))
        (root / 'drafts' / (identity + '.json')).write_text(json.dumps(draft))
    manifest = {'matches': matches, 'start': '2026-10-06T00:00:00Z',
                'end': '2026-10-06T02:00:00Z', 'release_version': 'test-release'}
    (root / 'manifest.json').write_text(json.dumps(manifest))
    (root / 'catalog.json').write_text('{}')
    (root / 'report.html').write_text('<script id="report-data" '
        'type="application/json">{"summary":{"verified_games":3,'
        '"excluded_count":0},"catalog":{}}</script>')
    public, report = build(root)
    crossbow = next(row for row in report['heroes'] if row['hero'] == 'Crossbowman')
    assert report['appearances'] == 30
    assert report['replay_version'] == 68
    assert crossbow['picks'] == 12 and crossbow['games'] == 3
    assert crossbow['seat_share'] == 0.4 and crossbow['game_presence'] == 1
    assert crossbow['wins'] == 1 and crossbow['losses'] == 1
    assert crossbow['draws'] == 10 and crossbow['decisive_rate'] == 0.5
    assert crossbow['win_rate'] == 1 / 12
    assert report['median_battle_minutes'] == 20
    assert sum(row['wins'] for row in report['heroes']) == 10
    assert sum(row['losses'] for row in report['heroes']) == 10
    assert sum(row['draws'] for row in report['heroes']) == 10
    target = root / 'index.html'
    target.write_text('<script id="report-data" type="application/json">{}</script>')
    write(root, target)
    before = target.read_text()
    assert 'private-match' not in before and 'private-player' not in before
    assert 'private-policy' not in before
    write(root, target)
    assert target.read_text() == before
    full = root / 'full'
    full.mkdir()
    combined = {
        'summary': {'start': manifest['start'], 'end': manifest['end'],
                    'verified_games': 4, 'excluded_count': 1,
                    'versions': [{'version': 'test-release', 'games': 3},
                                 {'version': 'older-release', 'games': 1}]},
        'catalog': {},
    }
    fullReport = full / 'report.html'
    fullReport.write_text('<script id="report-data" type="application/json">'
                         + json.dumps(combined) + '</script>')
    write(root, target, full)
    assert 'older-release' in target.read_text()
    combined['summary']['versions'][0]['games'] = 2
    fullReport.write_text('<script id="report-data" type="application/json">'
                         + json.dumps(combined) + '</script>')
    before = target.read_text()
    try:
        write(root, target, full)
    except ValueError:
        pass
    else:
        raise AssertionError('A mismatched release scope was accepted')
    assert target.read_text() == before
    game['replay_version'] = 67
    (root / 'stats' / (identity + '.json')).write_text(json.dumps(game))
    try:
        build(root)
    except ValueError:
        pass
    else:
        raise AssertionError('Mixed gameplay versions entered the overview')
    game['replay_version'] = 68
    game['hash_mismatches'] = 1
    (root / 'stats' / (identity + '.json')).write_text(json.dumps(game))
    try:
        write(root, target)
    except ValueError:
        pass
    else:
        raise AssertionError('A divergent replay was accepted')
    assert target.read_text() == before
    draw_rows = [dict(row, win=0, draw=True, pick_cause='Command')
                 for row in heroes]
    assert aggregate(draw_rows)['decisive_rate'] is None

print('Balance report checks passed')
