import
  std/os,
  heroreports

const Root = currentSourcePath().parentDir.parentDir

proc main() =
  ## Accepts one generated HTML path without starting a local server.
  let arguments = commandLineParams()
  if arguments.len notin 1 .. 2 or
    (arguments.len == 2 and arguments[1] != "--refresh-source"):
      raise newException(HeroReportError,
        "Usage: update_hero_stats GENERATED_REPORT_HTML [--refresh-source]")
  publishHeroReport(arguments[0], Root, arguments.len == 2)

try:
  main()
except CatchableError as error:
  stderr.writeLine("Hero report error: " & error.msg)
  quit(1)
