"use strict";
/* Router and controls. Hash routes pick a page template from views.js;
   the buttons and search boxes on each page then do their own work —
   range switches and the GDP toggle re-draw one chart, the Regions table
   sorts and filters in place, the A–Z list filters as you type. */

const ROUTES = {
  "/": { title: "Japan in Numbers — Overview", render: pageOverview },
  "/population": { title: "Population — Japan in Numbers", render: function () { return pagePopulation(state.popRange); } },
  "/economy": { title: "Economy — Japan in Numbers", render: function () { return pageEconomy(state.gdpMode); } },
  "/work": { title: "Work — Japan in Numbers", render: pageWork },
  "/prices": { title: "Prices — Japan in Numbers", render: pagePrices },
  "/society": { title: "Society — Japan in Numbers", render: pageSociety },
  "/regions": { title: "Regions — Japan in Numbers", render: pageRegions },
  "/indicators": { title: "Indicators A–Z — Japan in Numbers", render: pageIndicators },
  "/about": { title: "About — Japan in Numbers", render: pageAbout },
};

const NAV = [
  ["/", "Overview"],
  ["/population", "Population"],
  ["/economy", "Economy"],
  ["/work", "Work"],
  ["/prices", "Prices"],
  ["/society", "Society"],
  ["/regions", "Regions"],
  ["/indicators", "Indicators A–Z"],
  ["/about", "About"],
];

const state = {
  popRange: "10",
  gdpMode: "total",
  regionSort: { key: "pop", dir: -1 },
};

function currentPath() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";
  return path.charAt(0) === "/" ? path : "/" + path;
}

function popSeriesFor(range) {
  const span = range === "5" ? 5 : 10;
  return {
    title: SERIES.population.title,
    unit: SERIES.population.unit,
    years: SERIES.population.years.slice(-span),
    values: SERIES.population.values.slice(-span),
  };
}

function redrawPopChart() {
  const box = document.getElementById("pop-chart");
  if (box) {
    box.innerHTML = lineChart(popSeriesFor(state.popRange), {
      formatLast: function (v) { return fmtFixed(v, 2) + "m"; },
    });
  }
}

function redrawGdpChart() {
  const box = document.getElementById("gdp-chart");
  if (box) {
    box.innerHTML = barChart(state.gdpMode === "capita" ? SERIES.gdpCapita : SERIES.gdpTotal, {});
  }
  const note = document.getElementById("gdp-note");
  if (note) {
    note.textContent = state.gdpMode === "capita"
      ? "GDP per person in US dollars."
      : "Gross domestic product in US$ trillion.";
  }
}

function sortPrefectures(key, dir) {
  const rows = PREFECTURES.slice();
  rows.sort(function (a, b) {
    let av = a[key];
    let bv = b[key];
    if (key === "density") {
      av = densityOf(a.pop, a.area);
      bv = densityOf(b.pop, b.area);
    }
    if (key === "name") return dir * (av < bv ? -1 : av > bv ? 1 : 0);
    return dir * (av - bv);
  });
  return rows;
}

function applyPrefFilter() {
  const input = document.getElementById("pref-search");
  const query = input ? input.value.trim().toLowerCase() : "";
  const rows = document.querySelectorAll("#pref-body tr");
  let shown = 0;
  rows.forEach(function (row) {
    const hit = !query || row.getAttribute("data-name").indexOf(query) !== -1;
    row.style.display = hit ? "" : "none";
    if (hit) shown += 1;
  });
  const count = document.getElementById("pref-count");
  if (count) count.textContent = "Showing " + shown + " of " + PREFECTURES.length + " prefectures. Density is computed from population and land area.";
}

function applyIndFilter() {
  const input = document.getElementById("ind-search");
  const query = input ? input.value.trim().toLowerCase() : "";
  const cards = document.querySelectorAll("#ind-grid .indicator");
  let shown = 0;
  cards.forEach(function (card) {
    const hit = !query || card.getAttribute("data-name").indexOf(query) !== -1;
    card.style.display = hit ? "" : "none";
    if (hit) shown += 1;
  });
  const count = document.getElementById("ind-count");
  if (count) count.textContent = "Showing " + shown + " of " + INDICATORS.length + " indicators.";
}

function render() {
  const path = currentPath();
  const app = document.getElementById("app");
  const route = ROUTES[path];
  if (route) {
    document.title = route.title;
    app.innerHTML = route.render();
  } else {
    document.title = "Page not found — Japan in Numbers";
    app.innerHTML = pageNotFound(path);
  }
  document.querySelectorAll("nav a").forEach(function (a) {
    const target = a.getAttribute("href").slice(1) || "/";
    a.classList.toggle("current", target === path);
    if (target === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

document.addEventListener("click", function (event) {
  const rangeBtn = event.target.closest("[data-range]");
  if (rangeBtn) {
    state.popRange = rangeBtn.getAttribute("data-range");
    document.querySelectorAll("[data-range]").forEach(function (b) {
      const on = b === rangeBtn;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    redrawPopChart();
    return;
  }
  const gdpBtn = event.target.closest("[data-gdpmode]");
  if (gdpBtn) {
    state.gdpMode = gdpBtn.getAttribute("data-gdpmode");
    document.querySelectorAll("[data-gdpmode]").forEach(function (b) {
      const on = b === gdpBtn;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    redrawGdpChart();
    return;
  }
  const sortBtn = event.target.closest("[data-sort]");
  if (sortBtn) {
    const key = sortBtn.getAttribute("data-sort");
    if (state.regionSort.key === key) state.regionSort.dir *= -1;
    else state.regionSort = { key: key, dir: key === "name" ? 1 : -1 };
    const body = document.getElementById("pref-body");
    if (body) {
      body.innerHTML = sortPrefectures(state.regionSort.key, state.regionSort.dir).map(regionRow).join("");
      applyPrefFilter();
    }
  }
});

document.addEventListener("input", function (event) {
  if (event.target.id === "pref-search") applyPrefFilter();
  if (event.target.id === "ind-search") applyIndFilter();
});

window.addEventListener("hashchange", render);
render();
