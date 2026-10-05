import
  std/[os, strutils],
  layouts

const Root = currentSourcePath().parentDir.parentDir

echo "Checking every page and preserving tournament content"
for page in SitePage:
  let
    file = Root / "GOTA" /
      (case page
      of Guide: "index.html"
      of HeroStats: "heros/index.html"
      of Standings: "standings/index.html"
      of Players: "players/index.html")
    html = readFile(file)
    styled = stylePage(html, page)
  doAssert html == styled
  doAssert styled.count("aria-current=\"page\"") == 1
  doAssert ">Latest Tournament</a>" in styled
  doAssert ">Players</a>" in styled
  doAssert styled.count("<!-- GOTA navigation. -->") == 1
  if page == Standings:
    doAssert html.split("<!-- End GOTA navigation. -->")[1] ==
      styled.split("<!-- End GOTA navigation. -->")[1]

echo "Navigation checks passed"
