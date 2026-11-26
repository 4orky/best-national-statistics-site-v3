"use strict";
/* Hand-rolled SVG charts. No library: three small builders — a line chart,
   a vertical bar chart and a horizontal bar chart — each returning an SVG
   string. Axes use plain numbers, and the line chart zooms its vertical
   axis when the values sit far from zero, so a slow decline stays visible
   instead of drawing as a flat line. */

const CHART_W = 760;
const CHART_H = 300;
const PAD = { left: 56, right: 14, top: 14, bottom: 30 };

/* Pick a round step for axis ticks from the size of the range. */
function niceStep(span, want) {
  const raw = span / want;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  if (norm < 1.5) return mag;
  if (norm < 3.5) return 2 * mag;
  if (norm < 7.5) return 5 * mag;
  return 10 * mag;
}

/* Vertical axis bounds. When every value is positive and the spread is
   small next to the level, zoom in to round numbers around the data. */
function axisBounds(values) {
  let lo = Math.min.apply(null, values);
  let hi = Math.max.apply(null, values);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  if (lo > 0 && (hi - lo) / hi < 0.2) {
    const step = niceStep(hi - lo, 4);
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
  } else if (lo >= 0) {
    lo = 0;
    const step = niceStep(hi, 4);
    hi = Math.ceil(hi / step) * step;
  } else {
    const step = niceStep(hi - lo, 4);
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
  }
  return { lo: lo, hi: hi, step: niceStep(hi - lo, 4) };
}

function axisTicks(bounds) {
  const out = [];
  for (let v = bounds.lo; v <= bounds.hi + 1e-9; v += bounds.step) {
    out.push(Math.round(v * 1000) / 1000);
  }
  return out;
}

function axisLabel(v) {
  if (Math.abs(v) >= 1000) return fmtInt(v);
  if (Math.abs(v) >= 100) return String(Math.round(v));
  return String(Math.round(v * 10) / 10);
}

function chartFrame(bounds, labelEvery) {
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const ticks = axisTicks(bounds);
  let grid = "";
  for (const t of ticks) {
    const y = PAD.top + innerH - ((t - bounds.lo) / (bounds.hi - bounds.lo)) * innerH;
    grid += '<line x1="' + PAD.left + '" y1="' + y.toFixed(1) + '" x2="' + (PAD.left + innerW) + '" y2="' + y.toFixed(1) + '" class="grid"/>';
    grid += '<text x="' + (PAD.left - 8) + '" y="' + (y + 4).toFixed(1) + '" class="tick" text-anchor="end">' + axisLabel(t) + "</text>";
  }
  return { innerW: innerW, innerH: innerH, grid: grid, labelEvery: labelEvery || 1 };
}

function lineChart(series, opts) {
  const options = opts || {};
  const years = series.years;
  const values = series.values;
  const bounds = axisBounds(values);
  const frame = chartFrame(bounds);
  const n = values.length;
  const xAt = function (i) {
    return PAD.left + (frame.innerW * i) / (n - 1);
  };
  const yAt = function (v) {
    return PAD.top + frame.innerH - ((v - bounds.lo) / (bounds.hi - bounds.lo)) * frame.innerH;
  };
  let points = "";
  for (let i = 0; i < n; i++) {
    points += xAt(i).toFixed(1) + "," + yAt(values[i]).toFixed(1) + " ";
  }
  let dots = "";
  let labels = "";
  for (let i = 0; i < n; i++) {
    dots += '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(values[i]).toFixed(1) + '" r="4" class="dot"/>';
    if (i % 2 === 0 || i === n - 1) {
      labels += '<text x="' + xAt(i).toFixed(1) + '" y="' + (CHART_H - 8) + '" class="tick" text-anchor="middle">' + years[i] + "</text>";
    }
  }
  const last = values[n - 1];
  const lastLabel = options.formatLast ? options.formatLast(last) : String(last);
  return (
    '<svg viewBox="0 0 ' + CHART_W + " " + CHART_H + '" role="img" aria-label="' + esc(series.title) + " " + esc(series.unit) + '">' +
    frame.grid +
    '<polyline points="' + points.trim() + '" class="line"/>' +
    dots + labels +
    '<text x="' + (PAD.left + frame.innerW) + '" y="' + (yAt(last) - 10).toFixed(1) + '" class="lastval" text-anchor="end">' + esc(lastLabel) + "</text>" +
    "</svg>"
  );
}

function barChart(series, opts) {
  const options = opts || {};
  const years = series.years;
  const values = series.values;
  const signed = !!options.signed;
  const bounds = axisBounds(values);
  const frame = chartFrame(bounds);
  const n = values.length;
  const slot = frame.innerW / n;
  const barW = Math.min(44, slot * 0.62);
  let bars = "";
  let labels = "";
  for (let i = 0; i < n; i++) {
    const v = values[i];
    const x = PAD.left + slot * i + (slot - barW) / 2;
    const yZero = PAD.top + frame.innerH - ((0 - bounds.lo) / (bounds.hi - bounds.lo)) * frame.innerH;
    const yVal = PAD.top + frame.innerH - ((v - bounds.lo) / (bounds.hi - bounds.lo)) * frame.innerH;
    const top = Math.min(yZero, yVal);
    const height = Math.abs(yVal - yZero);
    const cls = v < 0 ? "bar neg" : "bar";
    bars += '<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(height, 1).toFixed(1) + '" class="' + cls + '"/>';
    const shown = signed ? fmtSigned(v, 1) : axisLabel(v);
    const labelY = v < 0 ? yVal + 14 : yVal - 6;
    bars += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + labelY.toFixed(1) + '" class="barval" text-anchor="middle">' + shown + "</text>";
    labels += '<text x="' + (PAD.left + slot * i + slot / 2).toFixed(1) + '" y="' + (CHART_H - 8) + '" class="tick" text-anchor="middle">' + years[i] + "</text>";
  }
  return (
    '<svg viewBox="0 0 ' + CHART_W + " " + CHART_H + '" role="img" aria-label="' + esc(series.title) + " " + esc(series.unit) + '">' +
    frame.grid + bars + labels +
    "</svg>"
  );
}

function hbarChart(rows, opts) {
  const options = opts || {};
  const width = options.width || CHART_W;
  const rowH = 44;
  const height = 14 + rows.length * rowH + 8;
  const max = Math.max.apply(null, rows.map(function (r) { return r.share; }));
  const labelW = 110;
  const trackW = width - labelW - 70;
  let body = "";
  rows.forEach(function (r, i) {
    const y = 14 + i * rowH;
    const w = (r.share / max) * trackW;
    body += '<text x="0" y="' + (y + 16) + '" class="hbar-label">' + esc(r.band) + "</text>";
    body += '<rect x="' + labelW + '" y="' + y + '" width="' + w.toFixed(1) + '" height="24" rx="4" class="hbar"/>';
    body += '<text x="' + (labelW + w + 8).toFixed(1) + '" y="' + (y + 17) + '" class="hbar-val">' + fmtFixed(r.share, 1) + "%</text>";
  });
  return '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Age structure">' + body + "</svg>";
}
