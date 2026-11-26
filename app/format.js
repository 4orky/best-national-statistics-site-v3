"use strict";
/* Number formatting helpers. One job: turn raw numbers into the strings
   the pages show, the same way on every page. */

function fmtInt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmtFixed(n, digits) {
  return Number(n).toFixed(digits);
}

function fmtSigned(n, digits) {
  const digitsNow = digits === undefined ? 1 : digits;
  const body = Math.abs(n).toFixed(digitsNow);
  if (n > 0) return "+" + body;
  if (n < 0) return "−" + body;
  return body;
}

/* 14.18 (millions) -> "14.18m"; 5.22 -> "5.22m". */
function fmtMillions(n) {
  return Number(n).toFixed(2) + "m";
}

/* People per square kilometre, from millions of people and km². */
function densityOf(popMillions, areaKm2) {
  return (popMillions * 1000000) / areaKm2;
}

/* Escape the five characters that would break out of HTML text. */
function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
