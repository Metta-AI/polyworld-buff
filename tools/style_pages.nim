import
  std/os,
  layouts

const Root = currentSourcePath().parentDir.parentDir

for page in SitePage:
  let file = Root / "GOTA" /
    (case page
    of Guide: "index.html"
    of HeroStats: "heros/index.html"
    of Standings: "standings/index.html"
    of Players: "players/index.html")
  writeFile(file, stylePage(readFile(file), page))
  echo "Styled ", file
