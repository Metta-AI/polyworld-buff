# Update tournament standings

The public standings page is `GOTA/standings/index.html`. It shows the most
recently published tournament report. Visitors refresh the page manually.
It includes six leaderboards and one player statistics table. The table replaces
the match-history list and combines outcomes, gold, XP, levels, K/D/A, tower
kills and footman last hits from the saved tournament and verified replays.

The Polyworld tournament runner now updates this exact path automatically when
this checkout is beside the Polyworld repository. It uses `GOTA/site.css` for
both the site page and its standalone local report. To rebuild saved standings
from Polyworld without running more games:

```sh
tmp/gota/tools/tournament --run top10-100-20260914 --report-only
```

Use `--site PATH` for a different checkout or `--no-site` for local reports only.
Report updates replace the site page atomically and retain the shared styling.

Alternatively, from this repository, copy an existing HTML report using Nim:

```sh
nim r -o:../polyworld/tmp/gota/tools/update_standings tools/update_standings.nim ../polyworld/tmp/gota/tournaments/top10-100-20260914/report.html
```

Use the path to the desired run's `report.html`. The tool replaces embedded
images and fonts with relative links and copies the actual assets into
`GOTA/assets/`. It reads the sibling `polyworld_data` repository, or the directory
specified by `POLYWORLD_DATA`. Assets must match those embedded in the report.

Review the changed files, then commit and push them to `main`. GitHub Pages
publishes the updated standings at `/polyworld-buff/GOTA/standings/`.
