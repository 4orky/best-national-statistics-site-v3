# Japan in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/4orky/best-national-statistics-site-v3/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/4orky/best-national-statistics-site-v3/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

A national statistics site for Japan that runs entirely from static files — no network requests, no framework, no build step. Nine hash-routed pages (Overview, Population, Economy, Work, Prices, Society, Regions, Indicators A–Z, About) with hand-rolled SVG charts, sortable and searchable tables, and every figure carrying its source and year.

Built for the [make.fun best national statistics site bounty](https://make.fun/c/best-national-statistics-site-20261126-0539).

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Layout

- `app/` — the site: `index.html`, `style.css`, `data.js` (every figure), `format.js` (number formatting), `charts.js` (SVG line/bar charts), `views.js` (page templates), `main.js` (hash router + controls)
- `screenshots/` — real renders of the site
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
- `vendor/makefun-frontend.ts` — make.fun's dossier library, copied from the kit unchanged

## Figures

All figures are 2024 unless a different year is noted, from the World Bank, ILO, IMF, MHLW, JNTO, OECD, UNDP and the Statistics Bureau of Japan. See the About page in the site for the full source list.
