import std/[os, strutils]

const Root = currentSourcePath().parentDir.parentDir

type HeroReportError = object of CatchableError

proc publish(source: string) =
  ## Copies a generated hero report and its artwork into the GOTA site.
  let
    sourcePath = absolutePath(source)
    sourceAssets = sourcePath.parentDir / "hero_assets"
    target = Root / "GOTA" / "hero_stats.html"
  var html = readFile(sourcePath)
  if "@@" in html or "id=\"report-data\"" notin html:
    raise newException(HeroReportError,
      "Pass the generated report, not the HTML template")
  if not dirExists(sourceAssets):
    raise newException(HeroReportError,
      "Missing hero_assets folder beside " & sourcePath)
  if "<a href=\"index.html\">Game guide</a>" notin html:
    html = html.replace(
      "<a href=\"#methods\">Methodology</a>",
      "<a href=\"index.html\">Game guide</a>" &
        "<a href=\"#methods\">Methodology</a>"
    )
  if "<a href=\"index.html\">GOTA guide</a>" notin html:
    html = html.replace(
      "Static hero report · Works offline",
      "<a href=\"index.html\">GOTA guide</a> · " &
        "Static hero report · Works offline"
    )
  copyDir(sourceAssets, target.parentDir / "hero_assets")
  writeFile(target & ".tmp", html)
  moveFile(target & ".tmp", target)
  echo "Updated ", target

proc main() =
  ## Accepts one generated HTML path without starting a local server.
  let arguments = commandLineParams()
  if arguments.len != 1:
    raise newException(HeroReportError,
      "Usage: update_hero_stats GENERATED_REPORT_HTML")
  publish(arguments[0])

try:
  main()
except CatchableError as error:
  stderr.writeLine("Hero report error: " & error.msg)
  quit(1)
