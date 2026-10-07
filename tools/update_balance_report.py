"""Refresh the dated GotA balance report from fully verified replay evidence."""

import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path
from statistics import mean, median

ROOT = Path(__file__).resolve().parents[1]
ROLES = {
    'Vanguard Knight': 'FL', 'Death Knight': 'FL',
    'Demon Hunter': 'F', 'Berserker': 'F',
    'Arcanist': 'M', 'Lich': 'M',
    'Druid Warden': 'S', 'Warlock': 'S',
    'Ranger': 'C', 'Crossbowman': 'C',
}


def load(path):
    """Read one complete analysis record."""
    return json.loads(path.read_text())


def stamp(value):
    """Parse the API's UTC timestamps without dropping subsecond precision."""
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def aggregate(rows):
    """Calculate appearance-based farming, progression and result measures."""
    wins = sum(row['win'] == 1 for row in rows)
    draws = sum(row['draw'] for row in rows)
    losses = len(rows) - wins - draws
    return {
        'picks': len(rows), 'wins': wins, 'losses': losses, 'draws': draws,
        'win_rate': wins / len(rows),
        'decisive_rate': wins / (wins + losses) if wins + losses else None,
        'decisive_picks': wins + losses,
        'avg_level': mean(row['level'] for row in rows),
        'median_level': median(row['level'] for row in rows),
        'level12': sum(row['level'] >= 12 for row in rows) / len(rows),
        'level18': sum(row['level'] >= 18 for row in rows) / len(rows),
        'avg_xp': mean(row['xp'] for row in rows),
        'avg_kills': mean(row['kills'] for row in rows),
        'avg_deaths': mean(row['deaths'] for row in rows),
        'avg_assists': mean(row['assists'] for row in rows),
        'avg_last_hits': mean(row['last_hits'] for row in rows),
        'avg_neutral_kills': mean(row['neutral_kills'] for row in rows),
        'avg_buildings': mean(row['tower_kills'] for row in rows),
        'players': len({row['player_id'] for row in rows}),
        'policies': len({row['policy_version_id'] for row in rows}),
        'top_policy_share': Counter(
            row['policy_version_id'] for row in rows).most_common(1)[0][1]
            / len(rows),
        'manual_picks': sum(row['pick_cause'] == 'Command' for row in rows),
        'auto_picks': sum(row['pick_cause'] == 'TimeLimit' for row in rows),
    }


def build(analysis):
    """Require complete coverage before publishing aggregate-only evidence."""
    manifest = load(analysis / 'manifest.json')
    matches = manifest['matches']
    ids = {match['id'] for match in matches}
    if len(ids) != len(matches) or not matches:
        raise ValueError('The manifest has duplicate IDs or no games')
    games = []
    for match in matches:
        game = load(analysis / 'stats' / (match['id'] + '.json'))
        draft = load(analysis / 'drafts' / (match['id'] + '.json'))
        if game['id'] != match['id'] or draft['id'] != match['id']:
            raise ValueError('Evidence IDs differ from the manifest')
        if not game['verified'] or game['hash_mismatches']:
            raise ValueError('Every replay must verify before publication')
        if game['game_version'] != manifest['release_version']:
            raise ValueError('A different release entered the snapshot')
        if not stamp(manifest['start']) <= stamp(game['completed_at']) < stamp(
                manifest['end']):
            raise ValueError('A game completed outside the snapshot window')
        if len(game['heroes']) != 10 or len(draft['picks']) != 10:
            raise ValueError('Every game must have ten final heroes and picks')
        picks = {pick['slot']: pick for pick in draft['picks']}
        if set(picks) != set(range(10)):
            raise ValueError('A draft has missing or duplicate seats')
        for hero in game['heroes']:
            pick = picks[hero['slot']]
            if pick['class'] != hero['class'] or pick['cause'] not in (
                    'Command', 'TimeLimit'):
                raise ValueError('Draft picks differ from verified final heroes')
            hero['pick_cause'] = pick['cause']
        game['round'] = match['round_number']
        game['battle_minutes'] = (game['ticks'] - draft['draft_ticks']) / 1440
        game['battle_cap'] = draft['max_battle_ticks'] / 1440
        game['draft_mode'] = draft['draft_mode']
        if game['outcome'] == 'time_limit' and abs(
                game['battle_minutes'] - game['battle_cap']) > 1 / 1440:
            raise ValueError('A timeout did not reach its recorded battle cap')
        games.append(game)
    rows = [hero for game in games for hero in game['heroes']]
    heroes = []
    for name, role in ROLES.items():
        selected = [row for row in rows if row['hero'] == name]
        if not selected:
            raise ValueError('No appearances for ' + name)
        result = dict(hero=name, role=role, **aggregate(selected))
        result['seat_share'] = len(selected) / len(rows)
        result['games'] = sum(any(row['hero'] == name for row in game['heroes'])
                              for game in games)
        result['game_presence'] = result['games'] / len(games)
        result['mirror_games'] = sum(all(any(row['hero'] == name
            and row['team'] == team for row in game['heroes'])
            for team in ('RedTeam', 'BlueTeam')) for game in games)
        heroes.append(result)
    heroes.sort(key=lambda row: (-row['picks'], row['hero']))
    roles = [dict(role=role, **aggregate([
        row for row in rows if ROLES[row['hero']] == role]))
        for role in ('FL', 'F', 'M', 'S', 'C')]
    teams = [[row for row in game['heroes'] if row['team'] == team]
             for game in games for team in ('RedTeam', 'BlueTeam')]
    lineups = Counter(tuple(sorted(row['hero'] for row in team))
                      for team in teams)
    rounds = sorted({game['round'] for game in games})
    trends = []
    for index in range(3):
        subset = rounds[index * len(rounds) // 3:
                        (index + 1) * len(rounds) // 3]
        selected = [game for game in games if game['round'] in subset]
        picks = [hero for game in selected for hero in game['heroes']]
        trends.append({
            'first_round': subset[0], 'last_round': subset[-1],
            'games': len(selected),
            'draw_rate': mean(game['outcome'] == 'time_limit'
                              for game in selected),
            'carry_share': mean(ROLES[hero['hero']] == 'C' for hero in picks),
            'carry_level': mean(hero['level'] for hero in picks
                                if ROLES[hero['hero']] == 'C'),
        })
    payload = re.search(
        r'<script id="report-data" type="application/json">(.*?)</script>',
        (analysis / 'report.html').read_text(), re.S)
    public = json.loads(payload.group(1))
    public['catalog'] = load(analysis / 'catalog.json')
    names = {'FL': 'Frontline', 'F': 'Fighter', 'M': 'Mage',
             'S': 'Support', 'C': 'Carry'}
    for hero, role in ROLES.items():
        if hero in public['catalog']:
            public['catalog'][hero]['role'] = names[role]
    if public['summary']['verified_games'] != len(games) or (
            public['summary']['excluded_count'] != 0):
        raise ValueError('The public summary does not cover the whole window')
    outcomes = Counter(game['outcome'] for game in games)
    if set(outcomes) - {'time_limit', 'RedTeam', 'BlueTeam'}:
        raise ValueError('Unexpected outcome in the snapshot')
    replayVersions = {game['replay_version'] for game in games}
    if len(replayVersions) != 1:
        raise ValueError('The balance overview must use one gameplay version')
    balance = {
        'start': manifest['start'], 'end': manifest['end'],
        'release': manifest['release_version'],
        'replay_version': next(iter(replayVersions)),
        'league': 'Gods of the Arena', 'games': len(games), 'rounds': len(rounds),
        'first_round': rounds[0], 'last_round': rounds[-1],
        'appearances': len(rows), 'players': len({r['player_id'] for r in rows}),
        'verified_ticks': sum(game['ticks'] for game in games),
        'policies': len({r['policy_version_id'] for r in rows}),
        'outcomes': dict(outcomes), 'heroes': heroes, 'roles': roles,
        'battle_caps': sorted({game['battle_cap'] for game in games}),
        'avg_battle_minutes': mean(game['battle_minutes'] for game in games),
        'median_battle_minutes': median(game['battle_minutes'] for game in games),
        'avg_decisive_minutes': mean(game['battle_minutes'] for game in games
                                    if game['outcome'] != 'time_limit'),
        'auto_picks': sum(row['pick_cause'] == 'TimeLimit' for row in rows),
        'draft_modes': sorted({game['draft_mode'] for game in games}),
        'duplicate_teams': sum(len({row['hero'] for row in team}) < 5
                               for team in teams),
        'all_roles_teams': sum(len({ROLES[row['hero']] for row in team}) == 5
                               for team in teams),
        'role_presence': {role: mean(any(ROLES[row['hero']] == role
            for row in team) for team in teams) for role in ('FL','F','M','S','C')},
        'top_lineups': [{'heroes': list(lineup), 'teams': count}
                       for lineup, count in lineups.most_common(3)],
        'trends': trends,
        'source': 'https://softmax.com/gods-of-the-arena',
    }
    return public, balance


def write(analysis, target, publicAnalysis=None):
    """Replace embedded aggregates without overwriting the page or charts."""
    public, balance = build(analysis)
    if publicAnalysis is not None:
        payload = re.search(
            r'<script id="report-data" type="application/json">(.*?)</script>',
            (publicAnalysis / 'report.html').read_text(), re.S)
        combined = json.loads(payload.group(1))
        scope = next((row for row in combined['summary']['versions']
                      if row['version'] == balance['release']), None)
        if scope is None or scope['games'] != balance['games']:
            raise ValueError('The overview differs from the full release scope')
        if any(combined['summary'][key] != balance[key]
               for key in ('start', 'end')):
            raise ValueError('The overview and full report windows differ')
        combined['catalog'] = public['catalog']
        public = combined
    html = target.read_text()
    for name, payload in [('report-data', public), ('balance-data', balance)]:
        tag = '<script id="' + name + '" type="application/json">' + (
            json.dumps(payload, separators=(',', ':')).replace('<', '\\u003c')
            .replace('&', '\\u0026')) + '</script>'
        pattern = r'<script id="' + name + r'" type="application/json">.*?</script>'
        if re.search(pattern, html, re.S):
            html = re.sub(pattern, lambda match: tag, html, flags=re.S)
        else:
            html = html.replace('  <script id="report-data"',
                                '  ' + tag + '\n  <script id="report-data"')
    target.write_text(html)
    print('Published aggregate data for', balance['games'], 'verified games')


if __name__ == '__main__':
    write(Path(sys.argv[1]), ROOT / 'GOTA/heros/index.html',
          Path(sys.argv[2]) if len(sys.argv) > 2 else None)
