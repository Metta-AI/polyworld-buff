# Sync Softmax wikis

The game guides are the source for three Markdown wiki snapshots. GOTA also
exports the dated hero statistics and all six tournament standings tables.
The tournament snapshot also includes the site's player statistics table.
Interactive controls and replay browsing remain on the website.
Match facts, hero and unit stats, mechanics references, and ability properties
are exported as Markdown tables. CTA ability kits use one row per ability.
Titles follow `Game Name — Page Name` across the three game wikis.

GOTA targets three active wiki pages: Game Guide, Hero Statistics, and Player
Standings. The earlier Overview, Mechanics, and Policy and Host Surface pages
describe an older game revision. Their last published text and revision IDs
are preserved in `wiki/GOTA/archive/`. Removing them from the active wiki is
pending: Softmax requires the game owner or a Softmax team member, and the
current publishing account received HTTP 403 when requesting removal.
Routine sync only updates the five pages listed below and never removes pages.

Install `tools/wiki_requirements.txt` in a Python environment. Preview with:

```sh
python tools/sync_wikis.py
```

Review the generated Markdown in `wiki/`, then publish using an authenticated
Softmax CLI session:

```sh
python tools/sync_wikis.py --publish --softmax /path/to/softmax
```

Add `--game GOTA` to update only the GOTA wiki. Reviewed community reference
sections in `wiki/references/<game>/<page>.md` are preserved above the generated
content. They include character attributes, scoring guidance, and source credits.
Further remote edits still require review and merging before publishing.

The tool can also use a `SOFTMAX_TOKEN` environment variable. It never stores
credentials in the repository. Run it after publishing updated site content.
This is a manual, one-way snapshot sync, with no scheduled background job.

Softmax renders Markdown images only from its `post-media` storage. The tool
uploads named guide images through the media API and reuses their URLs from
`wiki/media.json`, indexed by image content hash. Decorative icons are omitted.
No forum posts or messages are created.

The tool owns only `game-guide` in each game wiki and `hero-statistics` and
`player-standings` in GOTA. It records prior body hashes in `wiki/state.json`,
refuses to overwrite intervening wiki edits, and uses revision checks and
idempotency keys. Repeating an unchanged sync creates no new revisions.

The GOTA pages share `GOTA/site.css` and navigation from `tools/layouts.nim`.
Both report import tools apply that layout automatically. To apply it again:

```sh
nim r -o:/tmp/polyworld-buff-style-pages tools/style_pages.nim
```
