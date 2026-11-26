"use strict";
/* Page templates. Each function returns the HTML for one hash route, built
   from the figures in data.js and the charts in charts.js. No chart maths
   lives here; no page text lives in the data file. */

function srcLine(source, year) {
  return '<p class="src">Source: ' + esc(source) + " · " + esc(String(year)) + "</p>";
}

function kpiCard(item) {
  return (
    '<a class="kpi" href="' + item.route + '">' +
    '<span class="kpi-label">' + esc(item.label) + "</span>" +
    '<span class="kpi-value">' + esc(item.value) + "</span>" +
    '<span class="kpi-note">' + esc(item.note) + "</span>" +
    "</a>"
  );
}

function kpiGrid(items) {
  return '<div class="kpi-grid">' + items.map(kpiCard).join("") + "</div>";
}

function sectionHead(title, blurb) {
  return "<h2>" + esc(title) + "</h2>" + (blurb ? '<p class="lede">' + esc(blurb) + "</p>" : "");
}

function pageOverview() {
  const cards = RELEASES.map(function (r) {
    return (
      '<article class="release"><span class="release-date">' + esc(r.date) + "</span>" +
      "<h3>" + esc(r.title) + "</h3><p>" + esc(r.text) + "</p></article>"
    );
  }).join("");
  const topics = [
    { route: "#/population", title: "Population", text: "123.98 million people, shrinking 0.4% a year, with 29.8% aged 65 and over." },
    { route: "#/economy", title: "Economy", text: "A $4.19 trillion economy, $33,797 per person, and government debt of 236.7% of GDP." },
    { route: "#/work", title: "Work", text: "69.3 million people in work, unemployment at 2.5%, minimum wage ¥1,055 an hour." },
    { route: "#/prices", title: "Prices", text: "Consumer prices up 2.7% in 2024 after 3.3% in 2023." },
    { route: "#/society", title: "Society", text: "Life expectancy 84.0 years, a record 36.87 million visitors, HDI 0.925." },
    { route: "#/regions", title: "Regions", text: "Tokyo to Hokkaido: how 15 prefectures compare on people and density." },
  ];
  const topicCards = topics.map(function (t) {
    return '<a class="topic" href="' + t.route + '"><h3>' + esc(t.title) + "</h3><p>" + esc(t.text) + "</p><span class=\"more\">Explore →</span></a>";
  }).join("");
  return (
    '<section class="hero"><p class="eyebrow">National statistics · Japan</p>' +
    "<h1>Japan in Numbers</h1>" +
    '<p class="lede">The figures that describe Japan — people, money, work, prices and daily life. Every number on this site carries its source and its year.</p></section>' +
    kpiGrid(HEADLINE) +
    '<section class="panel"><h2>Population, 2015–2024</h2>' +
    lineChart(SERIES.population, { formatLast: function (v) { return fmtFixed(v, 2) + "m"; } }) +
    '<p class="chart-note">Population in millions. Japan has shrunk every year since 2011.</p>' +
    srcLine(SERIES.population.source, 2024) + "</section>" +
    '<section class="panel"><h2>GDP, 2015–2024</h2>' +
    barChart(SERIES.gdpTotal, {}) +
    '<p class="chart-note">Gross domestic product in US$ trillion. The 2022–2024 fall is mostly the yen, not output: in yen terms the economy kept growing.</p>' +
    srcLine(SERIES.gdpTotal.source, 2024) + "</section>" +
    '<section><h2>Latest releases</h2><div class="release-grid">' + cards + "</div></section>" +
    '<section><h2>Browse by topic</h2><div class="topic-grid">' + topicCards + "</div></section>"
  );
}

function pagePopulation(range) {
  const span = range === "5" ? 5 : range === "all" ? 10 : 10;
  const years = SERIES.population.years.slice(-span);
  const values = SERIES.population.values.slice(-span);
  const series = { title: SERIES.population.title, unit: SERIES.population.unit, years: years, values: values };
  const btn = function (key, label) {
    const active = (key === "5" && span === 5) || (key === "10" && span === 10 && range !== "all") || (key === "all" && range === "all");
    return '<button type="button" data-range="' + key + '" class="' + (active ? "pill on" : "pill") + '" aria-pressed="' + active + '">' + label + "</button>";
  };
  const rows = PREFECTURES.slice(0, 5).map(function (p) {
    return "<tr><td>" + esc(p.name) + "</td><td>" + fmtMillions(p.pop) + "</td><td>" + fmtInt(densityOf(p.pop, p.area)) + " / km²</td></tr>";
  }).join("");
  return (
    sectionHead("Population", "123.98 million people in 2024, down 0.4% on the year before. Japan's population has fallen every year since 2011, and nearly three in ten residents are now 65 or older.") +
    kpiGrid([
      { label: "Population", value: "123.98m", note: "2024 · World Bank", route: "#/population" },
      { label: "Change on 2023", value: "−0.4%", note: "2024 · World Bank", route: "#/population" },
      { label: "Aged 65+", value: "29.8%", note: "2024 · World Bank", route: "#/population" },
      { label: "Under 15", value: "11.4%", note: "2024 · World Bank", route: "#/population" },
      { label: "Median age", value: "49.9 years", note: "2024 estimate", route: "#/population" },
      { label: "Fertility rate", value: "1.15", note: "2024 · World Bank / MHLW", route: "#/population" },
    ]) +
    '<section class="panel"><h2>Population trend</h2>' +
    '<div class="controls" role="group" aria-label="Chart range">' + btn("5", "5 years") + btn("10", "10 years") + btn("all", "All") + "</div>" +
    '<div id="pop-chart">' + lineChart(series, { formatLast: function (v) { return fmtFixed(v, 2) + "m"; } }) + "</div>" +
    '<p class="chart-note">Population in millions. The axis is zoomed to the data so the decline is visible.</p>' +
    srcLine(SERIES.population.source, 2024) + "</section>" +
    '<section class="panel"><h2>Age structure</h2>' + hbarChart(AGE_BANDS, {}) +
    '<p class="chart-note">Share of the population in each age band, 2024.</p>' +
    srcLine("World Bank, World Development Indicators", 2024) + "</section>" +
    '<section class="panel"><h2>Births and deaths</h2>' +
    '<div class="facts">' +
    "<p><strong>720,988</strong> babies were born in 2024 — the fewest on record.</p>" +
    "<p><strong>5.7</strong> births and <strong>13.3</strong> deaths per 1,000 people: deaths outnumber births more than two to one.</p>" +
    "<p><strong>1.15</strong> children per woman is the fertility rate, far below the 2.1 needed to hold the population steady.</p>" +
    "</div>" +
    barChart(SERIES.births, {}) +
    '<p class="chart-note">Births in thousands, 2015–2024.</p>' +
    srcLine(SERIES.births.source, 2024) + "</section>" +
    '<section class="panel"><h2>Largest prefectures</h2>' +
    '<table class="data"><thead><tr><th>Prefecture</th><th>Population</th><th>Density</th></tr></thead><tbody>' + rows + "</tbody></table>" +
    '<p class="chart-note"><a href="#/regions">See all 15 prefectures →</a></p>' +
    srcLine("Statistics Bureau of Japan, population estimates", 2024) + "</section>"
  );
}

function pageEconomy(mode) {
  const useCapita = mode === "capita";
  const series = useCapita ? SERIES.gdpCapita : SERIES.gdpTotal;
  const chart = useCapita
    ? barChart(series, {})
    : barChart(series, {});
  const toggle = function (key, label) {
    const active = (key === "capita") === useCapita;
    return '<button type="button" data-gdpmode="' + key + '" class="' + (active ? "pill on" : "pill") + '" aria-pressed="' + active + '">' + label + "</button>";
  };
  return (
    sectionHead("Economy", "Japan is the world's fourth-largest economy at $4.19 trillion in 2024 — $33,797 per person. Growth was slightly negative in real terms, and the government owes 236.7% of GDP.") +
    kpiGrid([
      { label: "GDP", value: "$4.19tn", note: "2024 · World Bank", route: "#/economy" },
      { label: "GDP per capita", value: "$33,797", note: "2024 · World Bank", route: "#/economy" },
      { label: "Real growth", value: "−0.2%", note: "2024 · World Bank", route: "#/economy" },
      { label: "Exports", value: "$707.4bn", note: "2024 · World Bank", route: "#/economy" },
      { label: "Imports", value: "$742.7bn", note: "2024 · World Bank", route: "#/economy" },
      { label: "Government debt", value: "236.7% of GDP", note: "2024 · IMF", route: "#/economy" },
    ]) +
    '<section class="panel"><h2>GDP, 2015–2024</h2>' +
    '<div class="controls" role="group" aria-label="GDP measure">' + toggle("total", "Total GDP") + toggle("capita", "Per capita") + "</div>" +
    '<div id="gdp-chart">' + chart + "</div>" +
    '<p class="chart-note" id="gdp-note">' + (useCapita ? "GDP per person in US dollars." : "Gross domestic product in US$ trillion.") + "</p>" +
    srcLine(series.source, 2024) + "</section>" +
    '<section class="panel"><h2>Trade and markets</h2><div class="facts">' +
    "<p><strong>$707.4bn</strong> of goods exported and <strong>$742.7bn</strong> imported in 2024 — a goods deficit of about $35bn.</p>" +
    "<p><strong>236.7%</strong> of GDP is owed by the general government, the highest ratio among advanced economies — though almost all of it is owed in yen, to domestic holders.</p>" +
    "<p><strong>39,895</strong> — the Nikkei 225 closed 2024 at its highest year-end level since 1989.</p>" +
    "<p><strong>¥157</strong> bought one US dollar in December 2024, the weakest yen in decades.</p>" +
    "</div>" +
    srcLine("World Bank; IMF World Economic Outlook; Nikkei; Bank of Japan", 2024) + "</section>"
  );
}

function pageWork() {
  return (
    sectionHead("Work", "69.3 million people are in the labour force and 63.3% of working-age people take part in it. Unemployment, at 2.5%, is among the lowest in the developed world.") +
    kpiGrid([
      { label: "Labour force", value: "69.3m", note: "2024 · World Bank", route: "#/work" },
      { label: "Participation", value: "63.3%", note: "2024 · World Bank", route: "#/work" },
      { label: "Unemployment", value: "2.5%", note: "2024 · ILO modelled", route: "#/work" },
      { label: "Minimum wage", value: "¥1,055 / hour", note: "Oct 2024 · MHLW", route: "#/work" },
    ]) +
    '<section class="panel"><h2>Unemployment, 2015–2024</h2>' +
    barChart(SERIES.unemployment, {}) +
    '<p class="chart-note">Unemployment as % of the labour force. It has stayed below 3% since 2017.</p>' +
    srcLine(SERIES.unemployment.source, 2024) + "</section>" +
    '<section class="panel"><h2>Pay and participation</h2><div class="facts">' +
    "<p><strong>¥1,055</strong> an hour is the weighted-average minimum wage since October 2024 — the first time it has passed ¥1,000 in every prefecture.</p>" +
    "<p><strong>63.3%</strong> of people aged 15 and over are in the labour force, a record high driven by more women and older workers staying in jobs.</p>" +
    "<p><strong>2.5%</strong> unemployment sits well below the OECD average of about 5%.</p>" +
    "</div>" +
    srcLine("World Bank; ILO; MHLW", 2024) + "</section>"
  );
}

function pagePrices() {
  return (
    sectionHead("Prices", "Consumer prices rose 2.7% in 2024, after 3.3% in 2023. After decades when prices barely moved, Japan now has sustained inflation — and the Bank of Japan has started raising interest rates from zero.") +
    kpiGrid([
      { label: "CPI inflation", value: "+2.7%", note: "2024 · World Bank", route: "#/prices" },
      { label: "2023 inflation", value: "+3.3%", note: "2023 · World Bank", route: "#/prices" },
      { label: "2021 inflation", value: "−0.2%", note: "2021 · World Bank", route: "#/prices" },
    ]) +
    '<section class="panel"><h2>Inflation, 2015–2024</h2>' +
    barChart(SERIES.cpi, { signed: true }) +
    '<p class="chart-note">Consumer price inflation, % change on a year earlier. Bars below zero are years prices fell.</p>' +
    srcLine(SERIES.cpi.source, 2024) + "</section>" +
    '<section class="panel"><h2>Year by year</h2>' +
    '<table class="data"><thead><tr><th>Year</th><th>CPI change</th><th>What happened</th></tr></thead><tbody>' +
    "<tr><td>2015</td><td>+0.8%</td><td>Cheap oil drags inflation down</td></tr>" +
    "<tr><td>2016</td><td>−0.1%</td><td>Prices fall as the yen strengthens</td></tr>" +
    "<tr><td>2017</td><td>+0.5%</td><td>Recovery takes hold</td></tr>" +
    "<tr><td>2018</td><td>+1.0%</td><td>Energy prices push inflation up</td></tr>" +
    "<tr><td>2019</td><td>+0.5%</td><td>Consumption tax rises to 10%</td></tr>" +
    "<tr><td>2020</td><td>0.0%</td><td>Pandemic freezes demand</td></tr>" +
    "<tr><td>2021</td><td>−0.2%</td><td>Deflation returns briefly</td></tr>" +
    "<tr><td>2022</td><td>+2.5%</td><td>Weak yen and energy costs bite</td></tr>" +
    "<tr><td>2023</td><td>+3.3%</td><td>Fastest inflation in four decades</td></tr>" +
    "<tr><td>2024</td><td>+2.7%</td><td>Inflation eases but stays above 2%</td></tr>" +
    "</tbody></table>" +
    srcLine(SERIES.cpi.source, 2024) + "</section>"
  );
}

function pageSociety() {
  return (
    sectionHead("Society", "Japanese people live longer than anyone else — 84.0 years on average. Health and schooling are strong, cities hold 92.2% of the population, and 2024 brought a record 36.87 million visitors.") +
    kpiGrid([
      { label: "Life expectancy", value: "84.0 years", note: "2024 · World Bank", route: "#/society" },
      { label: "Women / men", value: "87.1 / 81.1", note: "2024 · World Bank", route: "#/society" },
      { label: "Infant mortality", value: "1.9 per 1,000", note: "2024 · World Bank", route: "#/society" },
      { label: "HDI", value: "0.925", note: "2023 · UNDP", route: "#/society" },
      { label: "Urban share", value: "92.2%", note: "2024 · World Bank", route: "#/society" },
      { label: "Visitors", value: "36.87m", note: "2024 · JNTO, record", route: "#/society" },
    ]) +
    '<section class="panel"><h2>Health and learning</h2><div class="facts">' +
    "<p><strong>84.0 years</strong> is life expectancy at birth — the highest of any large country. Women live to 87.1, men to 81.1.</p>" +
    "<p><strong>1.9</strong> babies in every 1,000 die before their first birthday, one of the lowest rates in the world.</p>" +
    "<p><strong>12.6</strong> hospital beds per 1,000 people (2022, OECD) — about three times the OECD average.</p>" +
    "<p><strong>65%</strong> of 25- to 34-year-olds hold a tertiary qualification (2023, OECD).</p>" +
    "<p><strong>0.925</strong> is Japan's Human Development Index (2023, UNDP), ranking among the world's highest.</p>" +
    "</div>" +
    srcLine("World Bank; OECD; UNDP", "2022–2024") + "</section>" +
    '<section class="panel"><h2>Visitors, 2015–2024</h2>' +
    barChart(SERIES.visitors, {}) +
    '<p class="chart-note">International arrivals in millions. The pandemic nearly stopped travel in 2020–2021; 2024 set a new record.</p>' +
    srcLine(SERIES.visitors.source, 2024) + "</section>"
  );
}

function regionRow(p) {
  const density = densityOf(p.pop, p.area);
  return (
    '<tr data-name="' + esc(p.name.toLowerCase()) + '"><td>' + esc(p.name) + "</td>" +
    "<td>" + fmtMillions(p.pop) + "</td>" +
    "<td>" + fmtInt(p.area) + " km²</td>" +
    "<td>" + fmtInt(density) + " / km²</td></tr>"
  );
}

function pageRegions() {
  const rows = PREFECTURES.map(regionRow).join("");
  return (
    sectionHead("Regions", "Japan's 47 prefectures range from Tokyo, with 14.18 million people packed into 2,194 km², to Hokkaido, with 5.22 million spread over 83,424 km². Sort the table or search for a prefecture.") +
    '<section class="panel"><div class="controls">' +
    '<label class="search-label" for="pref-search">Search prefectures</label>' +
    '<input id="pref-search" type="search" placeholder="Type a prefecture name…" autocomplete="off">' +
    "</div>" +
    '<table class="data sortable"><thead><tr>' +
    '<th><button type="button" data-sort="name">Prefecture ↕</button></th>' +
    '<th><button type="button" data-sort="pop">Population ↕</button></th>' +
    '<th><button type="button" data-sort="area">Land area ↕</button></th>' +
    '<th><button type="button" data-sort="density">Density ↕</button></th>' +
    "</tr></thead><tbody id=\"pref-body\">" + rows + "</tbody></table>" +
    '<p class="chart-note" id="pref-count">Showing 15 of 15 prefectures. Density is computed from population and land area.</p>' +
    srcLine("Statistics Bureau of Japan, population estimates; Geospatial Information Authority", 2024) + "</section>" +
    '<section class="panel"><h2>Country totals</h2><div class="facts">' +
    "<p><strong>377,975 km²</strong> of land, and <strong>342 people per km²</strong> on average — but most of the country is mountainous, so the lived-in plains are far denser.</p>" +
    "<p><strong>92.2%</strong> of people live in urban areas, and the Tokyo area alone holds more than a quarter of the nation.</p>" +
    "</div>" +
    srcLine("World Bank", 2024) + "</section>"
  );
}

function indicatorCard(ind) {
  return (
    '<a class="indicator" href="' + ind.route + '" data-name="' + esc(ind.name.toLowerCase()) + '">' +
    "<h3>" + esc(ind.name) + "</h3>" +
    '<span class="indicator-value">' + esc(ind.value) + "</span>" +
    '<span class="indicator-meta">' + esc(String(ind.year)) + " · " + esc(ind.source) + "</span>" +
    "</a>"
  );
}

function pageIndicators() {
  const cards = INDICATORS.map(indicatorCard).join("");
  return (
    sectionHead("Indicators A–Z", "Every indicator on this site in one list — " + INDICATORS.length + " figures, each with its value, year and source. Type to filter; click any card to open its page.") +
    '<div class="controls"><label class="search-label" for="ind-search">Search indicators</label>' +
    '<input id="ind-search" type="search" placeholder="Try “life”, “GDP”, “wage”…' + '" autocomplete="off"></div>' +
    '<div class="indicator-grid" id="ind-grid">' + cards + "</div>" +
    '<p class="chart-note" id="ind-count">Showing ' + INDICATORS.length + " of " + INDICATORS.length + " indicators.</p>"
  );
}

function pageAbout() {
  return (
    sectionHead("About this site", "Japan in Numbers is an independent reference site. It is not affiliated with the Statistics Bureau of Japan or any government body.") +
    '<section class="panel"><h2>Sources</h2><div class="facts">' +
    "<p><strong>World Bank, World Development Indicators</strong> — population, GDP, inflation, life expectancy, urban share and most headline figures.</p>" +
    "<p><strong>International Labour Organization</strong> — modelled unemployment estimates.</p>" +
    "<p><strong>International Monetary Fund</strong> — general government debt.</p>" +
    "<p><strong>Ministry of Health, Labour and Welfare (MHLW)</strong> — births, fertility and the minimum wage.</p>" +
    "<p><strong>Japan National Tourism Organization (JNTO)</strong> — international visitor arrivals.</p>" +
    "<p><strong>OECD</strong> — hospital beds and tertiary attainment.</p>" +
    "<p><strong>UNDP</strong> — Human Development Index.</p>" +
    "<p><strong>Statistics Bureau of Japan</strong> — prefecture populations and areas.</p>" +
    "</div></section>" +
    '<section class="panel"><h2>Methods</h2><div class="facts">' +
    "<p>Figures are for 2024 unless a different year is shown next to them. Prefecture densities are computed from the population and land area in the table, not copied from elsewhere.</p>" +
    "<p>Line-chart axes zoom to the data when values sit far from zero, so a slow change stays visible; the axis labels always show the true values.</p>" +
    "<p>Visitor and births series show the pandemic years as recorded — including the near-zero visitor arrivals of 2021 — rather than smoothing them away.</p>" +
    "</div></section>" +
    '<section class="panel"><h2>Updates</h2><div class="facts">' +
    "<p>Figures are updated when the source agencies publish revisions, typically once a year. This edition was compiled on " + esc(SITE.updated) + ".</p>" +
    "<p>Found a mistake? The sources above are the authority: where this site and a source disagree, the source is right.</p>" +
    "</div></section>"
  );
}

function pageNotFound(path) {
  return (
    '<section class="panel"><h1>Page not found</h1>' +
    '<p class="lede">There is no statistics page at “' + esc(path) + '”. The site has nine pages — try one of these:</p>' +
    '<p><a href="#/">Overview</a> · <a href="#/population">Population</a> · <a href="#/economy">Economy</a> · <a href="#/work">Work</a> · <a href="#/prices">Prices</a> · <a href="#/society">Society</a> · <a href="#/regions">Regions</a> · <a href="#/indicators">Indicators A–Z</a> · <a href="#/about">About</a></p></section>'
  );
}
