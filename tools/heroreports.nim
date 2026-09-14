import
  std/[os, strutils],
  layouts

const SiteUrl = "https://metta-ai.github.io/polyworld-buff/"

type HeroReportError* = object of CatchableError

proc styleHeroReport*(html: string, standalone = false): string =
  ## Applies the shared website layout with links for disk or GitHub Pages.
  if "@@" in html or "id=\"report-data\"" notin html:
    raise newException(HeroReportError,
      "Pass the generated report, not the HTML template")
  result = html.replace(
    "<link rel=\"stylesheet\" href=\"hero_assets/site.css\">",
    "<link rel=\"stylesheet\" href=\"../site.css\">"
  )
  result = stylePage(result, HeroStats)
  for link in ["index.html", "../index.html", SiteUrl & "GOTA/"]:
    result = result.replace(
      "<a href=\"" & link & "\">GOTA guide</a> · ", ""
    )
  result = result.replace(
    "Static hero report · Works offline",
    "<a href=\"../index.html\">GOTA guide</a> · " &
      "Static hero report · Works offline"
  )
  if standalone:
    result = result.multiReplace(
      ("href=\"../site.css\"", "href=\"hero_assets/site.css\""),
      ("src=\"../assets/themes/gota/gota_logo.png\"",
        "src=\"hero_assets/logo.png\""),
      ("href=\"../../\"", "href=\"" & SiteUrl & "\""),
      ("href=\"../index.html\"", "href=\"" & SiteUrl & "GOTA/\""),
      ("href=\"../heros/\"", "href=\"#\""),
      ("href=\"../standings/\"",
        "href=\"" & SiteUrl & "GOTA/standings/\"")
    )

proc writeReport(path, html: string) =
  ## Replaces the report after the full HTML has been written successfully.
  writeFile(path & ".tmp", html)
  moveFile(path & ".tmp", path)

proc publishHeroReport*(source, root: string, refreshSource = false) =
  ## Copies only the report and artwork into the dedicated hero folder.
  let
    sourcePath = absolutePath(source)
    sourceAssets = sourcePath.parentDir / "hero_assets"
    target = absolutePath(root / "GOTA/heros/index.html")
    targetAssets = target.parentDir / "hero_assets"
    stylesheet = root / "GOTA/site.css"
  try:
    let html = styleHeroReport(readFile(sourcePath))
    if not dirExists(sourceAssets):
      raise newException(HeroReportError,
        "Missing hero_assets folder beside " & sourcePath)
    if not fileExists(stylesheet):
      raise newException(HeroReportError, "Missing stylesheet: " & stylesheet)
    createDir(target.parentDir)
    if sourceAssets != targetAssets:
      copyDir(sourceAssets, targetAssets)
    writeReport(target, html)
    if refreshSource and sourcePath != target:
      copyFile(stylesheet, sourceAssets / "site.css")
      writeReport(sourcePath, styleHeroReport(html, standalone = true))
    echo "Updated ", target
  except OSError, IOError:
    raise newException(HeroReportError,
      "Cannot update hero report: " & getCurrentExceptionMsg())
