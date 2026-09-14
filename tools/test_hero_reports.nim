import
  std/[os, strutils, tempfiles],
  heroreports

const
  Root = currentSourcePath().parentDir.parentDir
  Source = """<!DOCTYPE html><html><head></head><body>
<header class="mast"><nav>Old navigation</nav></header>
<footer>Static hero report · Works offline</footer>
<script id="report-data" type="application/json">{"games":540}</script>
</body></html>"""

echo "Testing shared hero styling and nested navigation"
block:
  let html = styleHeroReport(Source)
  doAssert html == styleHeroReport(html)
  doAssert html.count("GOTA navigation. -->") == 2
  doAssert "href=\"../site.css\"" in html
  doAssert "href=\"../heros/\" aria-current=\"page\"" in html
  doAssert "href=\"../index.html\"" in html
  doAssert "href=\"../standings/\"" in html
  doAssert "src=\"../assets/themes/gota/gota_logo.png\"" in html
  doAssert "{\"games\":540}" in html
  let local = styleHeroReport(html, standalone = true)
  doAssert local == styleHeroReport(local, standalone = true)
  doAssert "href=\"hero_assets/site.css\"" in local
  doAssert "src=\"hero_assets/logo.png\"" in local
  doAssert "href=\"#\" aria-current=\"page\"" in local
  doAssert "href=\"../" notin local
  doAssert styleHeroReport(local) == html

echo "Testing publishing, asset copies, and source refresh"
block:
  let
    directory = createTempDir("hero reports ", "")
    source = directory / "analysis/report.html"
    site = directory / "website"
    target = site / "GOTA/heros/index.html"
  try:
    createDir(source.parentDir / "hero_assets")
    createDir(site / "GOTA")
    writeFile(source, Source)
    writeFile(source.parentDir / "hero_assets/logo.png", "artwork")
    writeFile(source.parentDir / "private-replay.json", "private")
    copyFile(Root / "GOTA/site.css", site / "GOTA/site.css")
    publishHeroReport(source, site, refreshSource = true)
    let html = readFile(target)
    doAssert html == styleHeroReport(Source)
    doAssert readFile(target.parentDir / "hero_assets/logo.png") == "artwork"
    doAssert readFile(source.parentDir / "hero_assets/site.css") ==
      readFile(Root / "GOTA/site.css")
    doAssert not fileExists(target.parentDir / "private-replay.json")
    doAssert "hero_assets/site.css" in readFile(source)
    publishHeroReport(source, site, refreshSource = true)
    doAssert readFile(target) == html
    publishHeroReport(target, site, refreshSource = true)
    doAssert readFile(target) == html
    writeFile(source, "@@data@@")
    var rejected = false
    try:
      publishHeroReport(source, site)
    except HeroReportError:
      rejected = true
    doAssert rejected
    doAssert readFile(target) == html
  finally:
    removeDir(directory)

echo "Hero report publishing tests passed"
