import std/[base64, os, strutils]

const
  SiteRoot = currentSourcePath().parentDir.parentDir
  Assets = [
    "fonts/Rubik-Regular.ttf", "fonts/Rubik-Bold.ttf",
    "themes/gota/gota_logo.png", "icons/victory.png",
    "icons/experience.png", "icons/chalice.png", "icons/champion.png",
    "icons/stats.png", "icons/day.png"
  ]

type StandingsError = object of CatchableError

proc update(reportPath: string) =
  ## Copies a saved tournament report and its assets into the static site.
  let dataRoot = getEnv("POLYWORLD_DATA", SiteRoot.parentDir / "polyworld_data")
  var
    html = readFile(reportPath)
    contents: seq[string]
  if "id=\"report-data\"" notin html or "class=ladder-stability" notin html:
    raise newException(StandingsError, "Expected a GotA tournament report")
  for path in Assets:
    let
      bytes = readFile(dataRoot / path)
      mime = if path.endsWith(".ttf"): "font/ttf" else: "image/png"
      embedded = "data:" & mime & ";base64," & encode(bytes)
    if embedded notin html:
      raise newException(StandingsError, "Report asset does not match " & path)
    html = html.replace(embedded, "../assets/" & path)
    contents.add(bytes)
  html = html.replace(
    "<nav aria-label=\"Report sections\">",
    "<nav aria-label=\"Report sections\"><a href=\"../\">GotA guide</a>"
  )
  html = html.replace(
    "nav{display:flex;gap:",
    "nav{display:flex;flex-wrap:wrap;gap:"
  )
  for i, path in Assets:
    let destination = SiteRoot / "GOTA/assets" / path
    createDir(destination.parentDir)
    writeFile(destination, contents[i])
  let destination = SiteRoot / "GOTA/standings/index.html"
  createDir(destination.parentDir)
  var tidy = ""
  for line in html.splitLines():
    let trimmed = line.strip(leading = false, chars = {' ', '\t'})
    var indent = 0
    while indent < trimmed.len and trimmed[indent] in {' ', '\t'}:
      inc indent
    tidy.add(trimmed[0 ..< indent].replace("\t", "  "))
    tidy.add(trimmed[indent .. ^1] & "\n")
  writeFile(destination, tidy.strip(leading = false) & "\n")
  echo "Updated ", destination
  echo "Copied ", Assets.len, " fonts and images into GOTA/assets."

proc main() =
  ## Requires an explicit saved HTML report before updating public standings.
  if paramCount() != 1:
    raise newException(StandingsError,
      "Usage: update_standings <saved tournament report.html>")
  try:
    update(absolutePath(paramStr(1)))
  except IOError, OSError:
    raise newException(StandingsError,
      "Cannot update standings: " & getCurrentExceptionMsg())

try:
  main()
except StandingsError as error:
  stderr.writeLine(error.msg)
  quit(1)
