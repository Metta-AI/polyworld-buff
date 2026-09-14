# Updating GOTA hero statistics

The published report is `GOTA/hero_stats.html`. Its fonts, portraits, and
icons are copied into `GOTA/hero_assets/`. Both the guide and the report open
directly from disk and work on GitHub Pages without a local server.

The report is a dated snapshot. Refreshing the browser does not download
new matches. To publish a new last-24-hours snapshot, first run the analyzer
in the sibling `polyworld` checkout with a new output directory:

```sh
cd ../polyworld
nim c -d:headless -o:tmp/gota/hero_stats \
  examples/gods_of_the_arena/tools/hero_stats.nim
tmp/gota/hero_stats --hours 24 --jobs 4
```

The analyzer prints the generated `report.html` path. From this repository,
copy that report into the site:

```sh
nim r -o:/tmp/polyworld-buff-update-hero-stats \
  tools/update_hero_stats.nim /path/printed/by/analyzer/report.html
```

The copy tool preserves the analysis dates and adds links back to the game
guide. It also copies the report's adjacent `hero_assets/` folder. It does
not publish replay files, player records, or individual match pages.

Review the page, commit `GOTA/hero_stats.html` and `GOTA/hero_assets/`, then
push to `main`. GitHub Pages publishes the repository root automatically.
