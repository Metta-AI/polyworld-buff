# Updating GOTA hero statistics

The published report is `GOTA/heros/index.html`. Its fonts, portraits, and
icons are copied into `GOTA/heros/hero_assets/`. Both the guide and report open
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

The analyzer automatically updates this checkout when it is beside
`polyworld`, or when selected with `--site /path/to/polyworld-buff` or the
`POLYWORLD_BUFF` environment variable. It uses this repository's shared
`GOTA/site.css` and `tools/layouts.nim` for both the published page and its
local report. Use `--no-site` to keep an analysis local.

To rebuild the HTML from an existing analysis without downloading replays:

```sh
cd ../polyworld
nim r -o:tmp/gota/hero_report \
  examples/gods_of_the_arena/tools/hero_report.nim \
  /path/to/analysis --site ../polyworld-buff
```

To import a generated report directly from this repository:

```sh
nim r -o:/tmp/polyworld-buff-update-hero-stats \
  tools/update_hero_stats.nim /path/to/report.html --refresh-source
```

The copy tool preserves the analysis dates and adds links back to the game
guide. It also copies the report's adjacent `hero_assets/` folder. The
optional `--refresh-source` applies identical styling to the local report
and copies the shared stylesheet there. It does
not publish replay files, player records, or individual match pages.

Review the page, commit `GOTA/heros/`, then
push to `main`. GitHub Pages publishes the repository root automatically.
The previous `GOTA/hero_stats.html` address redirects to `GOTA/heros/` and
preserves hero profile links.

Base-stat progression charts follow Explore the roster as the final content
section in the hero report, with five tabs:
Health, DPS, Burst, Mana, and Speed. Mana shows the maximum pool, and speed
uses tiles per second. Both exclude equipment and temporary effects.
The Health and Burst tabs include gray benchmarks for one full lane wave:
its sustained DPS and combined HP, respectively. A wave contains six melee
creeps and two casters. The DPS line represents damage over one second.
`hero_assets/progression.js` contains the dated snapshot and SVG renderer,
and `hero_assets/progression.css` uses the report's fonts and colors.
The importer preserves these assets when refreshing match statistics.
Update the chart data and snapshot date together for new balance data.
The October 5 balance patch uses fixed hero-specific variations within 5% of its
role targets. The chart labels display the actual resulting values.

Carry health uses an accelerating integer curve, keeping its level-20
endpoint. Carry spells have explicit damage per rank, with weaker early
ranks and unchanged final damage. Frontline health is roughly 25% higher.
Burst values maximize damage over all legal rank allocations at each level.
