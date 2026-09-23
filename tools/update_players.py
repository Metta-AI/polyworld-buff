"""Build a bounded replay snapshot for the GOTA Players page."""

import argparse
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
import hashlib
import gzip
import json
import math
import os
from pathlib import Path
import struct
import subprocess
import time

import httpx

ROOT = Path(__file__).resolve().parent.parent
DIVISION = "div_a4534073-c5d2-4193-a94a-93d9c5e2e443"
API = "https://softmax.com/api/observatory"


class PlayersError(Exception):
    """A replay collection, attribution, or extraction failed."""


def stamp(value):
    """Parse an explicit UTC or offset timestamp."""
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None:
        raise PlayersError("Timestamps must include a timezone")
    return result.astimezone(timezone.utc)


def saveJson(path, data):
    """Write JSON atomically without publishing a partially built report."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(data, indent=2, allow_nan=False) + "\n")
    temporary.replace(path)


def requestJson(client, path, **params):
    """Read public league metadata, retrying temporary server failures."""
    for attempt in range(4):
        response = client.get(API + path, params=params)
        if response.status_code not in (429, 502, 503, 504):
            response.raise_for_status()
            return response.json()
        time.sleep(2 ** attempt)
    raise PlayersError(f"Metadata request failed: {path} ({response.status_code})")


def pages(client, path, **params):
    """Read every result page, detecting a broken repeating cursor."""
    seen = set()
    while True:
        page = requestJson(client, path, limit=100, **params)
        yield page["entries"]
        cursor = page.get("next_cursor")
        if not cursor:
            return
        if cursor in seen:
            raise PlayersError("Server repeated a pagination cursor")
        seen.add(cursor)
        params["cursor"] = cursor


def inWindow(episode, start, end):
    """Use episode creation time, with a half-open recent window."""
    return start <= stamp(episode["created_at"]) < end


def collect(client, start, end, division):
    """Collect all participants and episodes in the requested window."""
    players = {
        row["player_id"]: {"id": row["player_id"], "name": row["player_name"]}
        for row in requestJson(client, f"/v2/divisions/{division}/leaderboard") or []
    }
    episodes = {}
    for batch in pages(client, "/v2/rounds", division_id=division, status="completed"):
        for roundInfo in batch:
            # Include a round straddling the cutoff, then filter each episode.
            if stamp(roundInfo["completed_at"]) < start:
                return players, list(episodes.values())
            attribution = {
                row["policy_version_id"]: row["subject_id"]
                for row in roundInfo["round_config"]["entrant_attributions"]
            }
            if any(playerId not in players for playerId in attribution.values()):
                detail = requestJson(client, f'/v2/rounds/{roundInfo["id"]}')
                for row in detail["results"]:
                    player = row.get("player")
                    if player:
                        players.setdefault(player["id"], {"id": player["id"], "name": player["name"]})
            for group in pages(client, f'/v2/rounds/{roundInfo["id"]}/episode-requests'):
                for episode in group:
                    if not inWindow(episode, start, end):
                        continue
                    episode["round"] = roundInfo["round_number"]
                    episode["attribution"] = attribution
                    episodes[episode["id"]] = episode
        if not batch:
            break
    return players, list(episodes.values())


def replayVersion(data):
    """Check the portable header before dispatching to a matching engine."""
    magic = b"POLYWORLDREPLAY"
    if not data.startswith(magic) or len(data) < len(magic) + 6:
        raise PlayersError("Invalid Polyworld replay header")
    version, gameVersion, length = struct.unpack_from("<HHH", data, len(magic))
    game = data[len(magic) + 6:len(magic) + 6 + length]
    if version not in (1, 2) or length != len(game) or game != b"gods_of_the_arena":
        raise PlayersError("Unsupported replay format or game")
    return str(gameVersion)


def parseRows(output):
    """Require exactly ten complete and finite, uniquely attributed seats."""
    rows = {}
    required = {"class", "minutes", "orders_pm", "rejected_share", "xp", "won",
                "cpu_pct", "attack_targets", "alive_ticks"}
    for line in output.splitlines():
        if not line.startswith("row "):
            continue
        try:
            fields = line.split()
            seat = int(fields[1])
            values = {key: float(value) for key, value in
                      (field.split("=", 1) for field in fields[2:])}
        except (ValueError, IndexError) as error:
            raise PlayersError("Malformed extractor row") from error
        if seat in rows or seat not in range(10) or not required <= values.keys():
            raise PlayersError("Incomplete or duplicate extractor seat")
        if not all(math.isfinite(value) for value in values.values()):
            raise PlayersError("Non-finite replay statistic")
        if values["class"] not in range(10) or values["minutes"] <= 0:
            raise PlayersError("Invalid hero class or game length")
        if values["cpu_pct"] < 0:
            values["cpu_pct"] = None
        if values["attack_targets"] == 0:
            for key in ("target_hero", "target_creep", "target_building", "target_god"):
                values[key] = None
        rows[seat] = values
    if set(rows) != set(range(10)):
        raise PlayersError("Replay did not yield all ten heroes")
    return rows


def buildExtractors(versions, cache, polyworld, dependencies):
    """Compile the same extractor against each pinned replay engine."""
    source = ROOT / "tools/players/extract.nim"
    engines = json.loads((ROOT / "tools/players/engines.json").read_text())
    binaries = {}
    for version in sorted(versions):
        if version not in engines:
            raise PlayersError(f"No pinned engine for replay v{version}; update engines.json")
        commit = engines[version]
        digest = hashlib.sha256(source.read_bytes() + commit.encode()).hexdigest()[:16]
        binary = cache / "bin" / f"extract-{version}-{digest}"
        binaries[version] = binary
        if binary.exists():
            continue
        engine = cache / "engines" / commit
        if not engine.exists():
            engine.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(["git", "-C", str(polyworld), "worktree", "add", "--detach",
                            str(engine), commit], check=True, capture_output=True)
        paths = [engine / "src", engine / "examples/gods_of_the_arena"]
        for line in (engine / "coworld/dependencies.lock").read_text().splitlines():
            fields = line.split()
            if fields:
                dep = dependencies / fields[0]
                paths.append(dep / "src" if (dep / "src").is_dir() else dep)
        binary.parent.mkdir(parents=True, exist_ok=True)
        flags = [f"--path:{path}" for path in paths]
        flags += ["-d:headless", "-d:replayEvents", "-d:release", "-d:flatty64",
                  "-d:nimTypeNames", f"--nimcache:{cache / 'nimcache' / digest}"]
        for command in ("check", "c"):
            result = subprocess.run(["nim", command, *flags, f"-o:{binary}", str(source)],
                                    text=True, capture_output=True)
            (cache / f"build-{version}-{command}.log").write_text(result.stdout + result.stderr)
            if result.returncode:
                raise PlayersError(f"Engine v{version} failed {command}: see {cache}/build-{version}-{command}.log")
        print(f"Built replay extractor v{version}", flush=True)
    return binaries


def summarize(rows, reasons):
    """Summarize one player's or policy version's hero-game observations."""
    keys = {key for row in rows for key in row} | set(reasons)
    means, samples = {}, {}
    for key in sorted(keys):
        values = [row.get(key, 0 if key.startswith("rej_") else None) for row in rows]
        values = [value for value in values if value is not None]
        samples[key] = len(values)
        means[key] = sum(values) / len(values) if values else None
    for hero in range(10):
        key = f"draft_{hero}"
        means[key] = sum(row["class"] == hero for row in rows) / len(rows) if rows else None
        samples[key] = len(rows)
    return {"games": len(rows),
            "record": {"wins": sum(row["won"] == 1 for row in rows),
                       "losses": sum(row["lost"] for row in rows),
                       "draws": sum(row["drawn"] for row in rows)},
            "values": means, "samples": samples}


def aggregate(players, games):
    """Average hero-games by player and exact policy-version identity."""
    observations = defaultdict(list)
    policies = defaultdict(Counter)
    versions = defaultdict(Counter)
    policyRows = defaultdict(lambda: defaultdict(list))
    policyDetails = defaultdict(dict)
    policyEngines = defaultdict(lambda: defaultdict(Counter))
    for episode, rows, policyInfo in games:
        seats = {row["position"]: row for row in policyInfo["policy_stats"]}
        if len(episode["policy_version_ids"]) != 10 or set(seats) != set(range(10)):
            raise PlayersError("Episode metadata does not describe all ten seats")
        playedAt = stamp(episode["created_at"]).isoformat()
        hasWinner = any(row["won"] == 1 for row in rows.values())
        for seat, row in rows.items():
            policyId = episode["policy_version_ids"][seat]
            info = seats[seat]
            if str(info["policy_version_id"]) != policyId:
                raise PlayersError("Replay seat and policy metadata disagree")
            playerId = episode["attribution"].get(policyId, "policy_" + policyId)
            name = info["policy_name"]
            players.setdefault(playerId, {"id": playerId, "name": name,
                                         "baseline": playerId.startswith("policy_")})
            row = dict(row)
            row["score"] = info.get("avg_reward")
            row["lost"] = int(hasWinner and row["won"] == 0)
            row["drawn"] = int(not hasWinner)
            row["glory"] = row["score"] if row["won"] == 1 else 0
            observations[playerId].append(row)
            policies[playerId][f'{name}:v{info["policy_version"]}'] += 1
            versions[playerId][episode["version"]] += 1
            policyRows[playerId][policyId].append(row)
            policyEngines[playerId][policyId][episode["version"]] += 1
            detail = policyDetails[playerId].setdefault(policyId, {
                "id": policyId, "name": name, "version": info["policy_version"],
                "firstGameAt": playedAt, "lastGameAt": playedAt,
            })
            detail["firstGameAt"] = min(detail["firstGameAt"], playedAt)
            detail["lastGameAt"] = max(detail["lastGameAt"], playedAt)
    reasons = sorted({key for rows in observations.values() for row in rows
                      for key in row if key.startswith("rej_")})
    result = []
    for player in sorted(players.values(), key=lambda value: (value["name"].casefold(), value["id"])):
        playerId = player["id"]
        policyVersions = []
        for policyId, detail in policyDetails[playerId].items():
            policyVersions.append({**detail,
                "engines": dict(policyEngines[playerId][policyId]),
                **summarize(policyRows[playerId][policyId], reasons)})
        policyVersions.sort(key=lambda value: (value["lastGameAt"], value["version"], value["id"]), reverse=True)
        result.append({**player, **summarize(observations[playerId], reasons),
                       "policies": dict(policies[playerId]), "engines": dict(versions[playerId]),
                       "policyVersions": policyVersions})
    return result, reasons


def main():
    """Refresh public aggregates from at most the specified recent hours."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--hours", type=float, default=8)
    parser.add_argument("--end", help="Fixed ISO timestamp for reproducible refreshes")
    parser.add_argument("--division", default=DIVISION)
    parser.add_argument("--cache", type=Path, default=ROOT / ".cache/players")
    parser.add_argument("--polyworld", type=Path, default=ROOT.parent / "polyworld")
    parser.add_argument("--dependencies", type=Path, default=Path(os.environ.get("POLYWORLD_DEPS", ROOT.parent)))
    parser.add_argument("--softmax", default="softmax")
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    if not 0 < args.hours <= 8 or not 1 <= args.workers <= 8:
        parser.error("Use a window of 0–8 hours and 1–8 workers")
    end = stamp(args.end) if args.end else datetime.now(timezone.utc)
    start = end - timedelta(hours=args.hours)
    cache = args.cache.resolve()
    cache.mkdir(parents=True, exist_ok=True)
    token = subprocess.run([args.softmax, "get-token"], check=True,
                           capture_output=True, text=True).stdout.strip()
    headers = {"Authorization": "Bearer " + token}
    with httpx.Client(headers=headers, timeout=60) as client:
        players, episodes = collect(client, start, end, args.division)
        saveJson(cache / "collection.json", {"start": start.isoformat(), "end": end.isoformat(),
                                             "players": players, "episodes": episodes})
        selected = [e for e in episodes if e["status"] == "completed" and e.get("replay_url")]
        print(f"{len(selected)} available replays, {len(players)} league players; {start.isoformat()} to {end.isoformat()}", flush=True)
        if not selected:
            raise PlayersError("No recent completed replays; existing report preserved")

        def download(episode):
            """Cache public replay bytes and public per-seat metadata."""
            directory = cache / "episodes" / episode["id"]
            directory.mkdir(parents=True, exist_ok=True)
            replay = directory / "game.replay"
            if not replay.exists():
                # Replay URLs are public: never forward the API bearer token.
                response = httpx.get(episode["replay_url"], timeout=90, follow_redirects=True)
                response.raise_for_status()
                data = response.content
                if data.startswith(b"\x1f\x8b"):
                    data = gzip.decompress(data)
                replayVersion(data)
                temporary = replay.with_suffix(".tmp")
                temporary.write_bytes(data)
                temporary.replace(replay)
            episode["version"] = replayVersion(replay.read_bytes()[:100])
            metadata = directory / "stats.json"
            if not metadata.exists():
                saveJson(metadata, requestJson(client, f'/v2/episode-requests/{episode["id"]}/episode-stats'))
            return episode

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            selected = list(pool.map(download, selected))
        print("Downloaded recent replays", flush=True)
        binaries = buildExtractors({e["version"] for e in selected}, cache,
                                   args.polyworld.resolve(), args.dependencies.resolve())

    def extract(episode):
        """Verify deterministic playback before admitting a game's rows."""
        directory = cache / "episodes" / episode["id"]
        binary = binaries[episode["version"]]
        output = directory / (binary.name + ".txt")
        if not output.exists():
            completed = subprocess.run([str(binary), str(directory / "game.replay")],
                                       text=True, capture_output=True, timeout=180)
            if completed.returncode:
                (directory / "error.log").write_text(completed.stdout + completed.stderr)
                raise PlayersError(f'Hash-verified extraction failed for {episode["id"]}; see its cache/error.log')
            parseRows(completed.stdout)
            output.write_text(completed.stdout)
        return episode, parseRows(output.read_text()), json.loads((directory / "stats.json").read_text())

    games = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for game in pool.map(extract, selected):
            games.append(game)
            if len(games) % 24 == 0:
                print(f"Verified {len(games)}/{len(selected)} replays", flush=True)
    columns, reasons = aggregate(players, games)
    report = {
        "schema": 1, "generatedAt": datetime.now(timezone.utc).isoformat(),
        "windowStart": start.isoformat(), "windowEnd": end.isoformat(), "hours": args.hours,
        "division": args.division, "episodes": len(games), "heroGames": len(games) * 10,
        "unavailableEpisodes": len(episodes) - len(games),
        "rounds": sorted({e["round"] for e in selected}),
        "engines": dict(sorted(Counter(e["version"] for e in selected).items())),
        "firstEpisodeAt": min(e["created_at"] for e in selected),
        "lastEpisodeAt": max(e["created_at"] for e in selected),
        "rejections": reasons, "players": columns,
        "source": "andre_von_auto/games/gods-of-the-arena/tools/gota_stats.nim",
    }
    saveJson(ROOT / "GOTA/players/data.json", report)
    print(f"Published snapshot: {len(columns)} players, {len(games)} replays, {len(reasons)} rejection reasons", flush=True)


if __name__ == "__main__":
    main()
