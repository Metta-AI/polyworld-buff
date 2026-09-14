import std/strutils

type
  SitePage* = enum
    Guide, HeroStats, Standings
  SiteLayoutError* = object of CatchableError

proc navigation(page: SitePage): string =
  ## Builds the shared GOTA header with paths relative to each page.
  let
    prefix = if page == Guide: "" else: "../"
    links = ["index.html", "heros/", "standings/"]
    labels = ["Game guide", "Hero statistics", "Player standings"]
  result = "<!-- GOTA navigation. -->\n" &
    "<header class=\"site-header wrap\">\n" &
    "  <a class=\"site-brand\" href=\"" & prefix & "../\" " &
    "aria-label=\"Polyworld Buff home\">\n" &
    "    <img src=\"" & prefix & "assets/themes/gota/gota_logo.png\" " &
    "alt=\"Gods of the Arena\">\n  </a>\n" &
    "  <nav class=\"site-nav\" aria-label=\"GOTA pages\">\n"
  for i, link in links:
    result.add("    <a href=\"" & prefix & link & "\"")
    if i == ord(page):
      result.add(" aria-current=\"page\"")
    result.add(">" & labels[i] & "</a>\n")
  result.add(
    "    <a href=\"https://softmax.com/gods-of-the-arena/wiki/game-guide\">" &
    "Softmax wiki</a>\n  </nav>\n</header>\n<!-- End GOTA navigation. -->"
  )

proc stylePage*(html: string, page: SitePage): string =
  ## Applies shared navigation without changing report data or behavior.
  result = html
  let
    prefix = if page == Guide: "" else: "../"
    stylesheet = "<link rel=\"stylesheet\" href=\"" & prefix &
      "site.css\">"
    marker = "<!-- GOTA navigation. -->"
    ending = "<!-- End GOTA navigation. -->"
    embedded = result.find("<style id=\"gota-site-style\">")
  if embedded >= 0:
    let finish = result.find("</style>", embedded)
    if finish < 0:
      raise newException(SiteLayoutError, "Incomplete embedded GOTA style")
    result = result[0 ..< embedded] & stylesheet &
      result[finish + "</style>".len .. ^1]
  if stylesheet notin result:
    result = result.replace("<link rel=\"stylesheet\" href=\"site.css\">", "")
    result = result.replace("</head>", stylesheet & "\n</head>")
  var
    start = result.find(marker)
    finish = -1
  if start >= 0:
    finish = result.find(ending, start)
    if finish >= 0:
      finish += ending.len
  else:
    case page
    of Guide:
      start = result.find("  <div class=\"wrap\">", result.find("<body>"))
      if start >= 0:
        finish = result.find("</div>", start) + "</div>".len
    of HeroStats:
      start = result.find("<header class=\"mast\">")
      if start >= 0:
        finish = result.find("</header>", start) + "</header>".len
    of Standings:
      start = result.find("<header class=wrap>")
      if start >= 0:
        finish = result.find("</header>", start) + "</header>".len
  if start < 0 or finish <= start:
    raise newException(SiteLayoutError, "Cannot find the GOTA page header")
  result = result[0 ..< start] & navigation(page) & result[finish .. ^1]
  case page
  of Guide:
    result = result.replace(
      "        <a href=\"standings/\">Player standings</a>\n",
      ""
    )
    result = result.replace(
      "        <a href=\"hero_stats.html\">Hero balance</a>\n",
      ""
    )
    result = result.replace(
      "      <nav>",
      "      <nav aria-label=\"Guide sections\">"
    )
  of HeroStats:
    result = result.replace("site-header wrap", "site-header")
  of Standings:
    result = result.replace("<a href=\"../\">GotA guide</a>", "")
