"use strict";
/* Every figure on this site, in one place. Figures are 2024 unless a
   different year is noted next to them. Sources: World Bank WDI, ILO,
   IMF, MHLW, JNTO, OECD and UNDP, as named on each page. */

const SITE = {
  country: "Japan",
  tagline: "Japan in Numbers",
  blurb: "The figures that describe Japan — people, money, work, prices and daily life — each with its source and year.",
  updated: "26 November 2026",
  currency: "¥",
};

const HEADLINE = [
  { label: "Population", value: "123.98m", note: "2024 · World Bank", route: "#/population" },
  { label: "GDP", value: "$4.19tn", note: "2024 · World Bank", route: "#/economy" },
  { label: "GDP per capita", value: "$33,797", note: "2024 · World Bank", route: "#/economy" },
  { label: "Inflation (CPI)", value: "+2.7%", note: "2024 · World Bank", route: "#/prices" },
  { label: "Unemployment", value: "2.5%", note: "2024 · ILO modelled", route: "#/work" },
  { label: "Life expectancy", value: "84.0 years", note: "2024 · World Bank", route: "#/society" },
  { label: "Visitors", value: "36.87m", note: "2024 · JNTO, record", route: "#/society" },
  { label: "Government debt", value: "236.7% of GDP", note: "2024 · IMF", route: "#/economy" },
];

/* Yearly series, 2015–2024. The 2024 point of each series is the headline
   figure above; earlier points trace how Japan got there. */
const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const SERIES = {
  population: {
    title: "Population",
    unit: "million people",
    years: YEARS,
    values: [127.09, 126.93, 126.71, 126.44, 126.17, 125.84, 125.50, 125.12, 124.52, 123.98],
    source: "World Bank, World Development Indicators",
  },
  gdpTotal: {
    title: "Gross domestic product",
    unit: "US$ trillion",
    years: YEARS,
    values: [4.44, 5.00, 4.93, 5.04, 5.12, 5.04, 5.03, 4.26, 4.23, 4.19],
    source: "World Bank, World Development Indicators",
  },
  gdpCapita: {
    title: "GDP per capita",
    unit: "US$",
    years: YEARS,
    values: [34900, 39400, 38900, 39700, 40400, 39800, 39900, 33800, 33900, 33797],
    source: "World Bank, World Development Indicators",
  },
  cpi: {
    title: "Consumer price inflation",
    unit: "% change on a year earlier",
    years: YEARS,
    values: [0.8, -0.1, 0.5, 1.0, 0.5, 0.0, -0.2, 2.5, 3.3, 2.7],
    source: "World Bank, World Development Indicators",
  },
  unemployment: {
    title: "Unemployment rate",
    unit: "% of labour force",
    years: YEARS,
    values: [3.4, 3.1, 2.8, 2.4, 2.4, 2.8, 2.8, 2.6, 2.6, 2.5],
    source: "ILO modelled estimate, via World Bank",
  },
  visitors: {
    title: "International visitors",
    unit: "million arrivals",
    years: YEARS,
    values: [19.74, 24.04, 28.69, 31.19, 31.88, 4.12, 0.25, 3.83, 25.07, 36.87],
    source: "Japan National Tourism Organization (JNTO)",
  },
  births: {
    title: "Births",
    unit: "thousand",
    years: YEARS,
    values: [1006, 977, 946, 918, 865, 841, 812, 772, 727, 721],
    source: "Ministry of Health, Labour and Welfare (MHLW)",
  },
};

/* Age structure, 2024. The three shares add to 100%. */
const AGE_BANDS = [
  { band: "Under 15", share: 11.4, note: "11.4% of the population" },
  { band: "15 to 64", share: 58.8, note: "58.8% of the population" },
  { band: "65 and over", share: 29.8, note: "29.8% of the population" },
];

/* Prefectures by population, 2024 estimates. Density is computed from
   population and land area, so the table can never disagree with itself. */
const PREFECTURES = [
  { name: "Tokyo", pop: 14.18, area: 2194 },
  { name: "Kanagawa", pop: 9.24, area: 2416 },
  { name: "Osaka", pop: 8.81, area: 1905 },
  { name: "Aichi", pop: 7.53, area: 5173 },
  { name: "Saitama", pop: 7.34, area: 3798 },
  { name: "Chiba", pop: 6.28, area: 5158 },
  { name: "Hyogo", pop: 5.45, area: 8401 },
  { name: "Hokkaido", pop: 5.22, area: 83424 },
  { name: "Fukuoka", pop: 5.11, area: 4987 },
  { name: "Shizuoka", pop: 3.62, area: 7777 },
  { name: "Ibaraki", pop: 2.87, area: 6097 },
  { name: "Hiroshima", pop: 2.79, area: 8479 },
  { name: "Kyoto", pop: 2.56, area: 4612 },
  { name: "Miyagi", pop: 2.29, area: 7282 },
  { name: "Niigata", pop: 2.19, area: 12584 },
];

/* The A–Z index: every indicator on the site in one searchable list. */
const INDICATORS = [
  { name: "Births", value: "720,988", year: 2024, source: "MHLW", route: "#/population" },
  { name: "Birth rate", value: "5.7 per 1,000 people", year: 2024, source: "World Bank", route: "#/population" },
  { name: "Consumer price inflation", value: "+2.7%", year: 2024, source: "World Bank", route: "#/prices" },
  { name: "Death rate", value: "13.3 per 1,000 people", year: 2024, source: "World Bank", route: "#/population" },
  { name: "Exports of goods", value: "$707.4bn", year: 2024, source: "World Bank", route: "#/economy" },
  { name: "Fertility rate", value: "1.15 children per woman", year: 2024, source: "World Bank / MHLW", route: "#/population" },
  { name: "GDP", value: "$4.19tn", year: 2024, source: "World Bank", route: "#/economy" },
  { name: "GDP per capita", value: "$33,797", year: 2024, source: "World Bank", route: "#/economy" },
  { name: "Government debt", value: "236.7% of GDP", year: 2024, source: "IMF", route: "#/economy" },
  { name: "Hospital beds", value: "12.6 per 1,000 people", year: 2022, source: "OECD", route: "#/society" },
  { name: "Human Development Index", value: "0.925", year: 2023, source: "UNDP", route: "#/society" },
  { name: "Imports of goods", value: "$742.7bn", year: 2024, source: "World Bank", route: "#/economy" },
  { name: "Infant mortality", value: "1.9 per 1,000 live births", year: 2024, source: "World Bank", route: "#/society" },
  { name: "Labour force", value: "69.3m people", year: 2024, source: "World Bank", route: "#/work" },
  { name: "Labour force participation", value: "63.3%", year: 2024, source: "World Bank", route: "#/work" },
  { name: "Land area", value: "377,975 km²", year: 2024, source: "World Bank", route: "#/regions" },
  { name: "Life expectancy at birth", value: "84.0 years", year: 2024, source: "World Bank", route: "#/society" },
  { name: "Life expectancy, men", value: "81.1 years", year: 2024, source: "World Bank", route: "#/society" },
  { name: "Life expectancy, women", value: "87.1 years", year: 2024, source: "World Bank", route: "#/society" },
  { name: "Median age", value: "49.9 years", year: 2024, source: "UN estimate", route: "#/population" },
  { name: "Minimum wage", value: "¥1,055 per hour", year: "Oct 2024", source: "MHLW", route: "#/work" },
  { name: "Nikkei 225", value: "39,895", year: "end-2024", source: "Nikkei", route: "#/economy" },
  { name: "Population", value: "123.98m", year: 2024, source: "World Bank", route: "#/population" },
  { name: "Population aged 65+", value: "29.8%", year: 2024, source: "World Bank", route: "#/population" },
  { name: "Population density", value: "342 per km²", year: 2024, source: "World Bank", route: "#/regions" },
  { name: "Population under 15", value: "11.4%", year: 2024, source: "World Bank", route: "#/population" },
  { name: "Real GDP growth", value: "−0.2%", year: 2024, source: "World Bank", route: "#/economy" },
  { name: "Tertiary attainment, age 25–34", value: "65%", year: 2023, source: "OECD", route: "#/society" },
  { name: "Unemployment rate", value: "2.5%", year: 2024, source: "ILO modelled", route: "#/work" },
  { name: "Urban population", value: "92.2%", year: 2024, source: "World Bank", route: "#/society" },
  { name: "Visitors, international", value: "36.87m", year: 2024, source: "JNTO", route: "#/society" },
  { name: "Yen per US dollar", value: "¥157", year: "Dec 2024", source: "Bank of Japan", route: "#/economy" },
];

/* Short explainers shown on the overview page. */
const RELEASES = [
  { date: "2024", title: "Record visitor year", text: "36.87 million international visitors arrived in 2024, the most ever recorded, passing the pre-pandemic peak of 31.88 million in 2019." },
  { date: "2024", title: "Population falls below 124 million", text: "Japan's population fell 0.4% to 123.98 million. Births dropped to 720,988 while deaths outnumbered births by more than two to one." },
  { date: "Oct 2024", title: "Minimum wage passes ¥1,000 everywhere", text: "The national weighted-average minimum wage rose to ¥1,055 an hour, the largest increase on record." },
  { date: "2024", title: "Prices rise for a third year", text: "Consumer prices rose 2.7% after 3.3% in 2023 — the fastest sustained inflation Japan has seen in three decades." },
];
