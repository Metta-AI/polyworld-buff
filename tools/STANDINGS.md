# Update tournament standings

The public standings page is `GOTA/standings/index.html`. It shows the most
recently published tournament report. Visitors refresh the page manually.

From this repository, copy a saved report using Nim:

```sh
nim r -o:../polyworld/tmp/gota/tools/update_standings tools/update_standings.nim ../polyworld/tmp/gota/tournaments/top10-100-20260914/report.html
```

Use the path to the desired run's `report.html`. The tool replaces embedded
images and fonts with relative links and copies the actual assets into
`GOTA/assets/`. It reads the sibling `polyworld_data` repository, or the directory
specified by `POLYWORLD_DATA`. Assets must match those embedded in the report.

Review the changed files, then commit and push them to `main`. GitHub Pages
publishes the updated standings at `/polyworld-buff/GOTA/standings/`.
