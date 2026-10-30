/**
 * Pictures for worksheet questions — clocks, ten-frames, arrays, fraction
 * bars, labelled shapes, bar graphs, coins and so on.
 *
 * Each picture is a small list of drawing primitives so the same picture can
 * be rendered as SVG on screen/print and drawn with jsPDF in the PDF.
 * Pictures are derived only from the question text (no randomness), so a
 * worksheet always looks the same for the same seed, and a picture can never
 * disagree with the question it illustrates.
 *
 * Units are CSS pixels (1 unit ≈ 0.2646 mm in the PDF).
 */

import { ICONS, iconFor, placeIcon, type Icon } from "./icons";

export type Shape =
  | { k: "rect"; x: number; y: number; w: number; h: number; r?: number; fill?: string; stroke?: string; sw?: number; dash?: boolean }
  | { k: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; stroke?: string; sw?: number; dash?: boolean }
  | { k: "poly"; pts: [number, number][]; closed?: boolean; fill?: string; stroke?: string; sw?: number; dash?: boolean }
  | { k: "text"; x: number; y: number; t: string; size?: number; anchor?: "start" | "middle" | "end"; bold?: boolean; fill?: string };

export type Visual = {
  w: number;
  h: number;
  shapes: Shape[];
  /** Short alt text for screen readers. */
  alt: string;
  /** Replaces the question wording on the worksheet when the picture carries the information (e.g. "What time does the clock show?"). */
  prompt?: string;
};

// Print-friendly palette: dark outlines, soft fills.
export const INK = "#1e293b";
const SOFT = "#94a3b8";
const FILL_A = "#bfdbfe"; // blue
const FILL_B = "#fde68a"; // amber
const FILL_C = "#bbf7d0"; // green
const FILL_D = "#fbcfe8"; // pink
const PALE = "#f8fafc";
const BAR_FILLS = [FILL_A, FILL_B, FILL_C, FILL_D, "#ddd6fe", "#fed7aa"];

const n = (s: string) => parseFloat(s.replace(/,/g, ""));
const fmt = (x: number) => String(Math.round(x * 100) / 100);

// ---------------------------------------------------------------- builders

function tenFrame(x: number, y: number, filled: number, color: string, crossedFrom = Infinity): Shape[] {
  const c = 22, out: Shape[] = [{ k: "rect", x, y, w: c * 5, h: c * 2, fill: "#fff", stroke: INK, sw: 1.5 }];
  for (let i = 1; i < 5; i++) out.push({ k: "line", x1: x + i * c, y1: y, x2: x + i * c, y2: y + c * 2, stroke: INK, sw: 1 });
  out.push({ k: "line", x1: x, y1: y + c, x2: x + c * 5, y2: y + c, stroke: INK, sw: 1 });
  for (let i = 0; i < filled; i++) {
    const cx = x + (i % 5) * c + c / 2, cy = y + Math.floor(i / 5) * c + c / 2;
    out.push({ k: "circle", cx, cy, r: 7.5, fill: color, stroke: INK, sw: 1 });
    if (i >= crossedFrom) {
      out.push({ k: "line", x1: cx - 7, y1: cy - 7, x2: cx + 7, y2: cy + 7, stroke: "#dc2626", sw: 1.8 });
      out.push({ k: "line", x1: cx + 7, y1: cy - 7, x2: cx - 7, y2: cy + 7, stroke: "#dc2626", sw: 1.8 });
    }
  }
  return out;
}

export function clock(hour: number | null, minute: number, size = 120): Visual["shapes"] {
  const r = size / 2 - 4, cx = size / 2, cy = size / 2;
  const out: Shape[] = [
    { k: "circle", cx, cy, r, fill: "#fff", stroke: INK, sw: 2.5 },
  ];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, big = i % 5 === 0;
    const r1 = big ? r - 7 : r - 3.5;
    out.push({ k: "line", x1: cx + Math.sin(a) * r1, y1: cy - Math.cos(a) * r1, x2: cx + Math.sin(a) * (r - 1), y2: cy - Math.cos(a) * (r - 1), stroke: big ? INK : SOFT, sw: big ? 1.6 : 0.8 });
  }
  for (let h = 1; h <= 12; h++) {
    const a = (h / 12) * Math.PI * 2;
    out.push({ k: "text", x: cx + Math.sin(a) * (r - 15), y: cy - Math.cos(a) * (r - 15) + 4.5, t: String(h), size: 12, anchor: "middle", bold: true, fill: INK });
  }
  const hand = (frac: number, len: number, w: number, color: string): Shape => {
    const a = frac * Math.PI * 2;
    return { k: "line", x1: cx, y1: cy, x2: cx + Math.sin(a) * len, y2: cy - Math.cos(a) * len, stroke: color, sw: w };
  };
  if (hour !== null) out.push(hand(((hour % 12) + minute / 60) / 12, r * 0.42, 4, INK));
  out.push(hand(minute / 60, r * 0.64, 2.5, "#2563eb"));
  out.push({ k: "circle", cx, cy, r: 3.5, fill: INK });
  return out;
}

function fractionBar(x: number, y: number, w: number, num: number, den: number, color: string, label = true): Shape[] {
  const h = 22, out: Shape[] = [];
  const cw = w / den;
  for (let i = 0; i < den; i++) out.push({ k: "rect", x: x + i * cw, y, w: cw, h, fill: i < num ? color : "#fff", stroke: INK, sw: 1.2 });
  if (label) out.push({ k: "text", x: x + w + 8, y: y + 15.5, t: `${num}/${den}`, size: 13, bold: true, fill: INK });
  return out;
}

export function sectorPts(cx: number, cy: number, r: number, a0: number, a1: number): [number, number][] {
  const pts: [number, number][] = [[cx, cy]];
  const steps = Math.max(4, Math.ceil(((a1 - a0) / (Math.PI * 2)) * 48));
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps;
    pts.push([cx + Math.sin(a) * r, cy - Math.cos(a) * r]);
  }
  return pts;
}

function dimLabel(x: number, y: number, t: string, anchor: "start" | "middle" | "end" = "middle"): Shape {
  return { k: "text", x, y, t, size: 12, anchor, bold: true, fill: "#1d4ed8" };
}

/** Scales two side lengths into a box no bigger than maxW × maxH, keeping some shape. */
function fit(a: number, b: number, maxW: number, maxH: number) {
  let w = a, h = b;
  const ratio = Math.min(Math.max(w / h, 0.45), 2.6); // avoid needle-thin shapes
  h = Math.min(maxH, maxW / ratio); w = h * ratio;
  if (w > maxW) { w = maxW; h = w / ratio; }
  return { w, h };
}

function rectangleVisual(lenLabel: string, widLabel: string, lenVal: number, widVal: number, inside?: string, square = false): Visual {
  const { w, h } = square ? { w: 96, h: 96 } : fit(lenVal || 1, widVal || 1, 170, 96);
  const x = 14, y = 10;
  const shapes: Shape[] = [
    { k: "rect", x, y, w, h, fill: FILL_C, stroke: INK, sw: 2 },
    dimLabel(x + w / 2, y + h + 18, lenLabel),
    dimLabel(x + w + 8, y + h / 2 + 4, widLabel, "start"),
  ];
  if (inside) shapes.push({ k: "text", x: x + w / 2, y: y + h / 2 + 4, t: inside, size: 11.5, anchor: "middle", fill: INK, bold: true });
  return { w: x + w + 14 + Math.max(widLabel.length, 4) * 7, h: y + h + 26, shapes, alt: `Rectangle labelled ${lenLabel} by ${widLabel}` };
}

function prismVisual(l: string, w: string, h: string, lv: number, wv: number, hv: number): Visual {
  const s = 120 / Math.max(lv, wv * 0.6, hv, 1);
  const L = Math.max(46, Math.min(130, lv * s)), H = Math.max(36, Math.min(90, hv * s)), D = Math.max(18, Math.min(42, wv * s * 0.5));
  const x = 10, y = 10 + D;
  const shapes: Shape[] = [
    { k: "poly", pts: [[x, y], [x + D, y - D], [x + L + D, y - D], [x + L, y]], closed: true, fill: "#dbeafe", stroke: INK, sw: 1.6 },
    { k: "poly", pts: [[x + L, y], [x + L + D, y - D], [x + L + D, y + H - D], [x + L, y + H]], closed: true, fill: "#93c5fd", stroke: INK, sw: 1.6 },
    { k: "rect", x, y, w: L, h: H, fill: FILL_A, stroke: INK, sw: 1.6 },
    dimLabel(x + L / 2, y + H + 17, l),
    dimLabel(x + L + D / 2 + 8, y + H - D / 2 + 10, w, "start"),
    dimLabel(x - 4, y + H / 2 + 4, h, "end"),
  ];
  // shift right so the height label (anchored end) has room
  const pad = Math.max(h.length * 7, 20);
  for (const sh of shapes) shift(sh, pad, 0);
  return { w: pad + x + L + D + 14 + w.length * 7, h: y + H + 26, shapes, alt: `Rectangular prism ${l} long, ${w} wide, ${h} high` };
}

export function shift(s: Shape, dx: number, dy: number) {
  switch (s.k) {
    case "rect": s.x += dx; s.y += dy; break;
    case "circle": s.cx += dx; s.cy += dy; break;
    case "line": s.x1 += dx; s.x2 += dx; s.y1 += dy; s.y2 += dy; break;
    case "poly": s.pts = s.pts.map(([a, b]) => [a + dx, b + dy]); break;
    case "text": s.x += dx; s.y += dy; break;
  }
}

function rightTriangle(base: string, height: string, hyp: string, extra?: Shape[]): Visual {
  const x = 40, y = 10, W = 150, H = 96;
  const shapes: Shape[] = [
    { k: "poly", pts: [[x, y + H], [x + W, y + H], [x, y]], closed: true, fill: FILL_B, stroke: INK, sw: 2 },
    { k: "poly", pts: [[x, y + H - 12], [x + 12, y + H - 12], [x + 12, y + H]], stroke: INK, sw: 1.2 },
    dimLabel(x + W / 2, y + H + 18, base),
    dimLabel(x - 6, y + H / 2 + 4, height, "end"),
    dimLabel(x + W / 2 + 8, y + H / 2 - 4, hyp, "start"),
    ...(extra || []),
  ];
  return { w: x + W + 50, h: y + H + 26, shapes, alt: `Right triangle with sides ${base}, ${height} and ${hyp}` };
}

function numberLine(min: number, max: number, step: number, labelEvery = 1, fracDen = 0, marks: number[] = []): Visual {
  const W = 300, x0 = 14, y = 24, count = Math.round((max - min) / step);
  const dx = (W - x0 * 2) / count;
  const shapes: Shape[] = [
    { k: "line", x1: x0 - 8, y1: y, x2: W - x0 + 8, y2: y, stroke: INK, sw: 1.8 },
    { k: "poly", pts: [[x0 - 12, y], [x0 - 5, y - 4], [x0 - 5, y + 4]], closed: true, fill: INK },
    { k: "poly", pts: [[W - x0 + 12, y], [W - x0 + 5, y - 4], [W - x0 + 5, y + 4]], closed: true, fill: INK },
  ];
  for (let i = 0; i <= count; i++) {
    const v = min + i * step, x = x0 + i * dx;
    const whole = Math.abs(v - Math.round(v)) < 1e-9;
    shapes.push({ k: "line", x1: x, y1: y - (whole ? 7 : 5), x2: x, y2: y + (whole ? 7 : 5), stroke: INK, sw: whole ? 1.6 : 1 });
    if (fracDen) {
      if (whole) shapes.push({ k: "text", x, y: y + 22, t: String(Math.round(v)), size: 11, anchor: "middle", bold: true, fill: INK });
    } else if (i % labelEvery === 0) {
      shapes.push({ k: "text", x, y: y + 22, t: String(Math.round(v)), size: 10.5, anchor: "middle", fill: INK });
    }
  }
  for (const m of marks) {
    const x = x0 + ((m - min) / step) * dx;
    shapes.push({ k: "circle", cx: x, cy: y, r: 4.5, fill: "#2563eb", stroke: INK, sw: 1 });
  }
  return { w: W, h: 52, shapes, alt: `Number line from ${min} to ${max}` };
}

function regularPolygon(sides: number, size = 90, fill = FILL_A): Shape {
  const r = size / 2 - 4, c = size / 2, pts: [number, number][] = [];
  const rot = sides === 4 ? Math.PI / 4 : sides % 2 === 0 ? Math.PI / sides : 0;
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2;
    pts.push([c + Math.sin(a) * r, c - Math.cos(a) * r + (sides === 3 ? 6 : 0)]);
  }
  return { k: "poly", pts, closed: true, fill, stroke: INK, sw: 2 };
}

export function coin(x: number, y: number, label: string, r: number, fill: string): Shape[] {
  return [
    { k: "circle", cx: x, cy: y, r, fill, stroke: INK, sw: 1.4 },
    { k: "circle", cx: x, cy: y, r: r - 3.5, stroke: "#64748b", sw: 0.6 },
    { k: "text", x, y: y + 4, t: label, size: r > 15 ? 11 : 9.5, anchor: "middle", bold: true, fill: INK },
  ];
}


function star(cx: number, cy: number, r: number): Shape {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return { k: "poly", pts, closed: true, fill: FILL_B, stroke: "#b45309", sw: 1 };
}

/** A hundreds flat (10 × 10 grid). */
function flat(x: number, y: number): Shape[] {
  const out: Shape[] = [{ k: "rect", x, y, w: 40, h: 40, fill: FILL_A, stroke: INK, sw: 1.3 }];
  for (let i = 1; i < 10; i++) out.push({ k: "line", x1: x + i * 4, y1: y, x2: x + i * 4, y2: y + 40, stroke: "#60a5fa", sw: 0.5 }, { k: "line", x1: x, y1: y + i * 4, x2: x + 40, y2: y + i * 4, stroke: "#60a5fa", sw: 0.5 });
  return out;
}

/** A tens rod (1 × 10). */
function rod(x: number, y: number): Shape[] {
  const out: Shape[] = [{ k: "rect", x, y, w: 8, h: 40, fill: FILL_C, stroke: INK, sw: 1.2 }];
  for (let i = 1; i < 10; i++) out.push({ k: "line", x1: x, y1: y + i * 4, x2: x + 8, y2: y + i * 4, stroke: "#16a34a", sw: 0.5 });
  return out;
}

function fractionGrid(x: number, y: number, size: number, parts: number, shaded: number): Shape[] {
  const out: Shape[] = [];
  const cols = parts === 4 ? 2 : parts, rows = parts === 4 ? 2 : 1;
  const w = size / cols, h = size / rows;
  for (let i = 0; i < parts; i++) out.push({ k: "rect", x: x + (i % cols) * w, y: y + Math.floor(i / cols) * h, w, h, fill: i < shaded ? FILL_B : "#fff", stroke: INK, sw: 1.6 });
  return out;
}

/** Arc marking an angle from a0 to a1 degrees (counter-clockwise, 0° = east). */
export function angleArc(cx: number, cy: number, r: number, a0: number, a1: number, color: string): Shape {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 16; i++) { const a = ((a0 + ((a1 - a0) * i) / 16) * Math.PI) / 180; pts.push([cx + Math.cos(a) * r, cy - Math.sin(a) * r]); }
  return { k: "poly", pts, stroke: color, sw: 1.8 };
}

/** Two angles making a straight line (180) or a right angle (90); the known one labelled, the other "?". */
function anglePair(total: 90 | 180, known: number): Visual {
  const cx = total === 180 ? 100 : 30, cy = 85, r = 75, shapes: Shape[] = [];
  const ray = (deg: number): Shape => ({ k: "line", x1: cx, y1: cy, x2: cx + Math.cos((deg * Math.PI) / 180) * r, y2: cy - Math.sin((deg * Math.PI) / 180) * r, stroke: INK, sw: 2 });
  if (total === 180) shapes.push({ k: "line", x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: INK, sw: 2 });
  else { shapes.push(ray(0), ray(90)); shapes.push({ k: "poly", pts: [[cx, cy - 10], [cx + 10, cy - 10], [cx + 10, cy]], stroke: "#94a3b8", sw: 1 }); }
  shapes.push(ray(known));
  const mid = (known / 2) * Math.PI / 180, mid2 = ((known + total) / 2) * Math.PI / 180;
  shapes.push(angleArc(cx, cy, 22, 0, known, "#2563eb"), angleArc(cx, cy, 30, known, total, "#dc2626"));
  shapes.push({ k: "text", x: cx + Math.cos(mid) * 40, y: cy - Math.sin(mid) * 40 + 4, t: `${known}°`, size: 11, bold: true, anchor: "middle", fill: "#1d4ed8" });
  shapes.push({ k: "text", x: cx + Math.cos(mid2) * 46, y: cy - Math.sin(mid2) * 46 + 5, t: "?", size: 14, bold: true, anchor: "middle", fill: "#dc2626" });
  return { w: total === 180 ? 200 : 120, h: 96, shapes, alt: total === 180 ? `Two angles on a straight line, one ${known}°` : `A right angle split in two, one part ${known}°` };
}

function solid(kind: "cylinder" | "cone" | "sphere", rLabel: string, hLabel: string): Visual {
  const shapes: Shape[] = [];
  const ell = (cx: number, cy: number, rx: number, ry: number, fill?: string, dash = false): Shape => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return { k: "poly", pts, closed: true, fill, stroke: INK, sw: 1.6, dash };
  };
  if (kind === "sphere") {
    shapes.push({ k: "circle", cx: 55, cy: 55, r: 45, fill: FILL_A, stroke: INK, sw: 1.8 }, ell(55, 55, 45, 12, undefined, true));
    shapes.push({ k: "line", x1: 55, y1: 55, x2: 100, y2: 55, stroke: "#1d4ed8", sw: 1.6 }, dimLabel(78, 72, rLabel));
    return { w: 140, h: 110, shapes, alt: `A sphere with radius ${rLabel}` };
  }
  const cx = 55, top = 18, bot = 110, rx = 38, ry = 10;
  if (kind === "cylinder") {
    shapes.push({ k: "rect", x: cx - rx, y: top, w: rx * 2, h: bot - top, fill: FILL_A, stroke: FILL_A, sw: 0 });
    shapes.push({ k: "line", x1: cx - rx, y1: top, x2: cx - rx, y2: bot, stroke: INK, sw: 1.6 }, { k: "line", x1: cx + rx, y1: top, x2: cx + rx, y2: bot, stroke: INK, sw: 1.6 });
    shapes.push(ell(cx, bot, rx, ry, FILL_A), ell(cx, top, rx, ry, "#dbeafe"));
  } else {
    shapes.push({ k: "poly", pts: [[cx - rx, bot], [cx, top - 6], [cx + rx, bot]], closed: true, fill: FILL_A, stroke: INK, sw: 1.6 }, ell(cx, bot, rx, ry, FILL_A));
  }
  shapes.push({ k: "line", x1: cx, y1: bot, x2: cx + rx, y2: bot, stroke: "#1d4ed8", sw: 1.6 }, dimLabel(cx + rx / 2, bot + 24, rLabel));
  shapes.push({ k: "line", x1: cx + rx + 12, y1: kind === "cone" ? top - 6 : top, x2: cx + rx + 12, y2: bot, stroke: "#1d4ed8", sw: 1.2, dash: true }, dimLabel(cx + rx + 18, (top + bot) / 2, hLabel, "start"));
  return { w: cx + rx + 30 + hLabel.length * 7, h: bot + 30, shapes, alt: `A ${kind} with ${rLabel} and ${hLabel}` };
}

// ---------------------------------------------------------------- matchers

const UNIT = "(?:cm|mm|m|km|in|ft|yd|units?)";
const SHAPE_SIDES: Record<string, number> = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, rhombus: 4 };

/** Returns a picture for a question, or null when none fits. */
export function visualFor(subject: string, topic: string, grade: number, q: string, pic?: string): Visual | null {
  if (pic) { const v = picVisual(pic); if (v) return v; }
  if (subject === "math") { const v = earlyMathPicture(topic, grade, q); if (v) return v; return mathVisual(topic, grade, q); }
  if (subject === "science") return scienceVisual(topic, q);
  return null;
}

function mathVisual(topic: string, grade: number, q: string): Visual | null {
  let m: RegExpMatchArray | null;

  // ---- Clocks (read the hands)
  if ((m = q.match(/^The hour hand points to (\d+) and the minute hand points to 12\. What time is it\?$/))) {
    return { w: 120, h: 120, shapes: clock(+m[1], 0), alt: "A clock face", prompt: "What time does the clock show?" };
  }
  if ((m = q.match(/^The minute hand points to 6 and the hour hand is halfway between (\d+) and (\d+)\. What time is it\?$/))) {
    return { w: 120, h: 120, shapes: clock(+m[1], 30), alt: "A clock face", prompt: "What time does the clock show?" };
  }
  if ((m = q.match(/^The minute hand points to the (\d+)\. How many minutes past the hour is that\?$/))) {
    return { w: 120, h: 120, shapes: clock(null, (+m[1] % 12) * 5), alt: "A clock face showing only the minute hand", prompt: "How many minutes past the hour does the minute hand show?" };
  }
  if ((m = q.match(/^The minute hand is (\d+) small marks? past the (\d+)\. How many minutes past the hour is it\?$/))) {
    return { w: 120, h: 120, shapes: clock(null, ((+m[2] % 12) * 5 + +m[1]) % 60), alt: "A clock face showing only the minute hand", prompt: "How many minutes past the hour does the minute hand show?" };
  }
  if (/time|elapsed/.test(topic) && grade <= 4 && (m = q.match(/\b(\d{1,2}):(\d{2})\b/)) && /after|before|starts at|begins at|leaves at/.test(q)) {
    return { w: 110, h: 110, shapes: clock(+m[1], +m[2], 110), alt: `A clock showing ${m[0]}` };
  }

  // ---- Ten frames for early addition / subtraction
  if (grade <= 2 && (m = q.match(/^(\d+) \+ (\d+) = \?$/)) && +m[1] <= 10 && +m[2] <= 10 && +m[1] + +m[2] > 0) {
    const a = +m[1], b = +m[2];
    return { w: 250, h: 50, shapes: [...tenFrame(2, 2, a, FILL_A), { k: "text", x: 124, y: 29, t: "+", size: 18, anchor: "middle", bold: true, fill: INK }, ...tenFrame(136, 2, b, FILL_B)], alt: `Ten frames showing ${a} and ${b}` };
  }
  if (grade <= 2 && (m = q.match(/^(\d+) - (\d+) = \?$/)) && +m[1] <= 10 && +m[2] <= +m[1]) {
    return { w: 116, h: 50, shapes: tenFrame(2, 2, +m[1], FILL_A, +m[1] - +m[2]), alt: `Ten frame with ${m[1]} counters, ${m[2]} crossed out` };
  }

  // ---- Arrays
  if (grade <= 3 && ((m = q.match(/^(\d+) × (\d+) = \?$/)) || (m = q.match(/\b(\d+) rows of (\d+)\b/)))) {
    const r = +m[1], c = +m[2];
    if (r >= 1 && c >= 1 && r <= 10 && c <= 10 && r * c <= 50) {
      const s = 17, shapes: Shape[] = [];
      for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) shapes.push({ k: "circle", cx: 10 + j * s, cy: 10 + i * s, r: 6, fill: i % 2 ? FILL_D : FILL_A, stroke: INK, sw: 1 });
      return { w: 20 + (c - 1) * s, h: 20 + (r - 1) * s, shapes, alt: `An array of ${r} rows of ${c}` };
    }
  }

  // ---- Base-ten blocks
  if (grade <= 2 && (m = q.match(/^How many tens and ones are in (\d+)\?$/)) && +m[1] < 100) {
    const t = Math.floor(+m[1] / 10), o = +m[1] % 10, shapes: Shape[] = [];
    for (let i = 0; i < t; i++) {
      shapes.push({ k: "rect", x: 4 + i * 16, y: 4, w: 11, h: 100, fill: FILL_A, stroke: INK, sw: 1.2 });
      for (let k = 1; k < 10; k++) shapes.push({ k: "line", x1: 4 + i * 16, y1: 4 + k * 10, x2: 15 + i * 16, y2: 4 + k * 10, stroke: INK, sw: 0.6 });
    }
    const ox = 4 + t * 16 + 10;
    for (let i = 0; i < o; i++) shapes.push({ k: "rect", x: ox + (i % 3) * 14, y: 66 + Math.floor(i / 3) * 13 - (o > 3 ? 13 * Math.floor((o - 1) / 3) - 26 : -26), w: 11, h: 11, fill: FILL_B, stroke: INK, sw: 1.2 });
    return { w: ox + 46, h: 108, shapes, alt: `Base-ten blocks: ${t} tens and ${o} ones` };
  }

  // ---- Coins
  if ((m = q.match(/^How much money is (.+)\?$/))) {
    const parts = [...m[1].matchAll(/(\d+) (dollar bills?|quarters?|dimes?|nickels?|pennies|penny)/g)];
    const total = parts.reduce((s, p) => s + +p[1], 0);
    if (parts.length && total <= 12) {
      const shapes: Shape[] = [];
      let x = 6;
      for (const p of parts) for (let i = 0; i < +p[1]; i++) {
        const kind = p[2];
        if (kind.startsWith("dollar")) { shapes.push({ k: "rect", x, y: 8, w: 52, h: 28, r: 3, fill: FILL_C, stroke: INK, sw: 1.4 }, { k: "text", x: x + 26, y: 27, t: "$1", size: 12, anchor: "middle", bold: true, fill: INK }); x += 58; }
        else {
          const [label, r, fill] = kind.startsWith("quarter") ? ["25¢", 17, "#e2e8f0"] : kind.startsWith("dime") ? ["10¢", 12.5, "#e2e8f0"] : kind.startsWith("nickel") ? ["5¢", 15, "#cbd5e1"] : ["1¢", 13, "#fdba74"];
          shapes.push(...coin(x + (r as number), 22, label as string, r as number, fill as string)); x += (r as number) * 2 + 5;
        }
      }
      return { w: x + 2, h: 44, shapes, alt: "Coins and bills", prompt: "How much money is shown?" };
    }
  }

  // ---- Fraction bars
  if (/fraction/.test(topic) && grade <= 5) {
    if ((m = q.match(/^How many jumps of 1\/(\d+) do you make from 0 to reach (\d+)\/(\d+) on a number line\?$/)) && +m[1] === +m[3] && +m[2] <= +m[3] * 2) {
      const den = +m[1], max = Math.max(1, Math.ceil(+m[2] / den));
      return numberLine(0, max, 1 / den, 1, den);
    }
    const fr = [...q.matchAll(/\b(\d{1,2})\/(\d{1,2})\b/g)].map((x) => [+x[1], +x[2]]);
    if (fr.length >= 1 && fr.length <= 2 && fr.every(([a, b]) => b >= 2 && b <= 12 && a <= b && a >= 0)) {
      const shapes: Shape[] = [];
      fr.forEach(([a, b], i) => shapes.push(...fractionBar(4, 4 + i * 32, 200, a, b, i ? FILL_B : FILL_A)));
      return { w: 250, h: 4 + fr.length * 32, shapes, alt: `Fraction bars showing ${fr.map((f) => f.join("/")).join(" and ")}` };
    }
  }
  if ((m = q.match(/^A (circle|rectangle) is cut into (\d+) equal parts/)) && +m[2] <= 12) {
    const parts = +m[2], shapes: Shape[] = [];
    if (m[1] === "circle") {
      for (let i = 0; i < parts; i++) shapes.push({ k: "poly", pts: sectorPts(45, 45, 40, (i / parts) * Math.PI * 2, ((i + 1) / parts) * Math.PI * 2), closed: true, fill: FILL_B, stroke: INK, sw: 1.5 });
      return { w: 90, h: 90, shapes, alt: `A circle cut into ${parts} equal parts` };
    }
    for (let i = 0; i < parts; i++) shapes.push({ k: "rect", x: 4 + i * (160 / parts), y: 4, w: 160 / parts, h: 50, fill: FILL_B, stroke: INK, sw: 1.5 });
    return { w: 168, h: 58, shapes, alt: `A rectangle cut into ${parts} equal parts` };
  }

  // ---- Shapes: sides / corners / symmetry
  if ((m = q.match(/^How many (?:sides|corners(?: \(vertices\))?|vertices(?: \(corners\))?|lines of symmetry) does an? (triangle|square|rectangle|pentagon|hexagon|heptagon|octagon|rhombus) have\?$/))) {
    const k = m[1];
    const shape: Shape = k === "rectangle" ? { k: "rect", x: 4, y: 18, w: 120, h: 62, fill: FILL_A, stroke: INK, sw: 2 } : regularPolygon(SHAPE_SIDES[k], 96);
    return { w: k === "rectangle" ? 128 : 96, h: 96, shapes: [shape], alt: `A ${k}` };
  }

  // ---- Rectangles
  const U = UNIT;
  if ((m = q.match(new RegExp(`rectangle (?:with |that is )?(?:length )?(\\d+(?:\\.\\d+)?) (${U})(?: long)?,? (?:and )?(?:width )?(\\d+(?:\\.\\d+)?) \\2(?: wide)?`))) ||
      (m = q.match(new RegExp(`rectangle with length (\\d+(?:\\.\\d+)?) (${U}) and width (\\d+(?:\\.\\d+)?) \\2`)))) {
    return rectangleVisual(`${m[1]} ${m[2]}`, `${m[3]} ${m[2]}`, n(m[1]), n(m[3]));
  }
  if ((m = q.match(new RegExp(`^A (?:garden|room|field|yard|playground|rug|patio|pool) is (\\d+) (${U}) long and (\\d+) \\2 wide`)))) {
    return rectangleVisual(`${m[1]} ${m[2]}`, `${m[3]} ${m[2]}`, +m[1], +m[3]);
  }
  if ((m = q.match(new RegExp(`^A rectangle has an? (area|perimeter) of (\\d+(?:\\.\\d+)?) (${U})²?\\. Its length is (\\d+(?:\\.\\d+)?) \\3\\. What is its width\\?`)))) {
    const inside = m[1] === "area" ? `Area = ${m[2]} ${m[3]}²` : `Perimeter = ${m[2]} ${m[3]}`;
    return rectangleVisual(`${m[4]} ${m[3]}`, "?", n(m[4]), n(m[4]) * 0.6, inside);
  }
  if ((m = q.match(new RegExp(`^A square has sides of (\\d+(?:\\.\\d+)?) (${U})`)))) {
    return rectangleVisual(`${m[1]} ${m[2]}`, `${m[1]} ${m[2]}`, 1, 1, undefined, true);
  }

  // ---- Parallelogram / triangle / trapezoid with base and height
  if ((m = q.match(new RegExp(`area of a parallelogram with base (\\d+(?:\\.\\d+)?) (${U}) and height (\\d+(?:\\.\\d+)?) \\2`)))) {
    const sk = 34, x = 10, y = 10, W = 140, H = 80;
    return { w: x + W + sk + 16, h: y + H + 26, alt: "Parallelogram", shapes: [
      { k: "poly", pts: [[x, y + H], [x + W, y + H], [x + W + sk, y], [x + sk, y]], closed: true, fill: FILL_C, stroke: INK, sw: 2 },
      { k: "line", x1: x + sk, y1: y, x2: x + sk, y2: y + H, stroke: "#1d4ed8", sw: 1.2, dash: true },
      dimLabel(x + W / 2, y + H + 18, `${m[1]} ${m[2]}`), dimLabel(x + sk + 6, y + H / 2 + 4, `${m[3]} ${m[2]}`, "start"),
    ] };
  }
  if ((m = q.match(new RegExp(`area of a triangle with base (\\d+(?:\\.\\d+)?) (${U}) and height (\\d+(?:\\.\\d+)?) \\2`)))) {
    const x = 10, y = 10, W = 150, H = 86, apex = 60;
    return { w: x + W + 20, h: y + H + 26, alt: "Triangle", shapes: [
      { k: "poly", pts: [[x, y + H], [x + W, y + H], [x + apex, y]], closed: true, fill: FILL_B, stroke: INK, sw: 2 },
      { k: "line", x1: x + apex, y1: y, x2: x + apex, y2: y + H, stroke: "#1d4ed8", sw: 1.2, dash: true },
      dimLabel(x + W / 2, y + H + 18, `${m[1]} ${m[2]}`), dimLabel(x + apex + 6, y + H / 2 + 14, `${m[3]} ${m[2]}`, "start"),
    ] };
  }
  if ((m = q.match(new RegExp(`trapezoid with bases (\\d+(?:\\.\\d+)?) (${U}) and (\\d+(?:\\.\\d+)?) \\2 and height (\\d+(?:\\.\\d+)?) \\2`)))) {
    const a = n(m[1]), b = n(m[3]), big = Math.max(a, b), W = 170, top = Math.max(50, (Math.min(a, b) / big) * W), x = 10, y = 10, H = 76, off = (W - top) / 2;
    return { w: x + W + 20, h: y + H + 44, alt: "Trapezoid", shapes: [
      { k: "poly", pts: [[x, y + H + 14], [x + W, y + H + 14], [x + off + top, y + 14], [x + off, y + 14]], closed: true, fill: FILL_D, stroke: INK, sw: 2 },
      { k: "line", x1: x + off, y1: y + 14, x2: x + off, y2: y + H + 14, stroke: "#1d4ed8", sw: 1.2, dash: true },
      dimLabel(x + W / 2, y + 8, `${fmt(Math.min(a, b))} ${m[2]}`), dimLabel(x + W / 2, y + H + 32, `${fmt(big)} ${m[2]}`),
      dimLabel(x + off + 5, y + H / 2 + 18, `${m[4]} ${m[2]}`, "start"),
    ] };
  }

  // ---- Prisms
  if ((m = q.match(new RegExp(`rectangular prism (?:with )?length (\\d+(?:\\.\\d+)?) (${U}), width (\\d+(?:\\.\\d+)?) \\2,? and height (\\d+(?:\\.\\d+)?) \\2`))) ||
      (m = q.match(new RegExp(`rectangular prism (\\d+(?:\\.\\d+)?) (${U}) long, (\\d+(?:\\.\\d+)?) \\2 wide,? and (\\d+(?:\\.\\d+)?) \\2 high`)))) {
    return prismVisual(`${m[1]} ${m[2]}`, `${m[3]} ${m[2]}`, `${m[4]} ${m[2]}`, n(m[1]), n(m[3]), n(m[4]));
  }
  if ((m = q.match(new RegExp(`cube with edges of (\\d+(?:\\.\\d+)?) (${U})`)))) {
    const e = `${m[1]} ${m[2]}`;
    return prismVisual(e, e, e, 1, 1.6, 1);
  }

  // ---- Circles
  if ((m = q.match(new RegExp(`circle with (radius|diameter) (\\d+(?:\\.\\d+)?) (${U})`)))) {
    const r = 46, c = 52, isR = m[1] === "radius";
    return { w: 150, h: 104, alt: `Circle with ${m[1]} ${m[2]} ${m[3]}`, shapes: [
      { k: "circle", cx: c, cy: c, r, fill: FILL_A, stroke: INK, sw: 2 },
      isR ? { k: "line", x1: c, y1: c, x2: c + r, y2: c, stroke: "#1d4ed8", sw: 2 } : { k: "line", x1: c - r, y1: c, x2: c + r, y2: c, stroke: "#1d4ed8", sw: 2 },
      { k: "circle", cx: c, cy: c, r: 2.5, fill: INK },
      dimLabel(isR ? c + r / 2 : c, c - 7, `${m[2]} ${m[3]}`),
    ] };
  }

  // ---- Right triangles
  if ((m = q.match(new RegExp(`^A right triangle has legs of (\\d+(?:\\.\\d+)?) (${U}) and (\\d+(?:\\.\\d+)?) \\2\\.`)))) {
    return rightTriangle(`${m[3]} ${m[2]}`, `${m[1]} ${m[2]}`, "?");
  }
  if ((m = q.match(new RegExp(`^A right triangle has a hypotenuse of (\\d+(?:\\.\\d+)?) (${U}) and one leg of (\\d+(?:\\.\\d+)?) \\2\\.`)))) {
    return rightTriangle(`${m[3]} ${m[2]}`, "?", `${m[1]} ${m[2]}`);
  }
  if ((m = q.match(new RegExp(`^A (\\d+(?:\\.\\d+)?) (${U}) ladder leans against a wall with its foot (\\d+(?:\\.\\d+)?) \\2 from the wall`)))) {
    const v = rightTriangle(`${m[3]} ${m[2]}`, "?", `${m[1]} ${m[2]}`);
    v.shapes.unshift({ k: "rect", x: 30, y: 4, w: 10, h: 104, fill: "#e2e8f0", stroke: SOFT, sw: 1 });
    v.alt = "A ladder leaning against a wall";
    return v;
  }
  if ((m = q.match(/the side opposite angle A is (\d+), the side adjacent to A is (\d+), and the hypotenuse is (\d+)/))) {
    // Right angle at C (bottom-left), A at the far end of the base.
    const v = rightTriangle(m[2], m[1], m[3], [
      { k: "text", x: 32, y: 116, t: "C", size: 12, bold: true, fill: INK, anchor: "end" },
      { k: "text", x: 196, y: 116, t: "A", size: 12, bold: true, fill: INK },
      { k: "text", x: 34, y: 12, t: "B", size: 12, bold: true, fill: INK, anchor: "end" },
    ]);
    return v;
  }

  // ---- Bar graph from survey data
  if ((m = q.match(/favou?rite (\w+): ((?:[A-Za-z ]+ \d+(?:, |,? and )?){2,6})\.\s*(.*)$/))) {
    const items = [...m[2].matchAll(/([A-Za-z][A-Za-z ]*?) (\d+)/g)].map((x) => [x[1].replace(/^and /, "").trim(), +x[2]] as [string, number]);
    if (items.length >= 2 && items.length <= 6) {
      const max = Math.max(...items.map((i) => i[1]));
      const top = Math.ceil(max / 5) * 5 || 5, step = top <= 10 ? 2 : top <= 30 ? 5 : 10;
      const W = 64 * items.length, H = 110, x0 = 30, y0 = 18;
      const shapes: Shape[] = [];
      for (let v = 0; v <= top; v += step) {
        const y = y0 + H - (v / top) * H;
        shapes.push({ k: "line", x1: x0, y1: y, x2: x0 + W, y2: y, stroke: "#e2e8f0", sw: 0.8 });
        shapes.push({ k: "text", x: x0 - 5, y: y + 3.5, t: String(v), size: 9.5, anchor: "end", fill: "#475569" });
      }
      items.forEach(([label, v], i) => {
        const h = (v / top) * H, x = x0 + 12 + i * 64;
        shapes.push({ k: "rect", x, y: y0 + H - h, w: 40, h, fill: BAR_FILLS[i % BAR_FILLS.length], stroke: INK, sw: 1.2 });
        shapes.push({ k: "text", x: x + 20, y: y0 + H + 15, t: label, size: 10.5, anchor: "middle", fill: INK, bold: true });
        shapes.push({ k: "text", x: x + 20, y: y0 + H - h - 4, t: String(v), size: 10, anchor: "middle", fill: "#475569", bold: true });
      });
      shapes.push({ k: "line", x1: x0, y1: y0, x2: x0, y2: y0 + H, stroke: INK, sw: 1.4 }, { k: "line", x1: x0, y1: y0 + H, x2: x0 + W, y2: y0 + H, stroke: INK, sw: 1.4 });
      const lead = q.slice(0, q.indexOf(m[0])) + `favorite ${m[1]}.`;
      return { w: x0 + W + 6, h: y0 + H + 22, shapes, alt: `Bar graph of favorite ${m[1]}`, prompt: m[3] ? `${lead} Use the bar graph. ${m[3]}` : undefined };
    }
  }

  // ---- Spinner
  if ((m = q.match(/spinner has (\d+) equal sections worth ([\d, ]+) points/))) {
    const vals = m[2].split(",").map((s) => s.trim()).filter(Boolean);
    if (vals.length === +m[1] && vals.length <= 10) {
      const c = 50, r = 44, shapes: Shape[] = [];
      vals.forEach((v, i) => {
        const a0 = (i / vals.length) * Math.PI * 2, a1 = ((i + 1) / vals.length) * Math.PI * 2, am = (a0 + a1) / 2;
        shapes.push({ k: "poly", pts: sectorPts(c, c, r, a0, a1), closed: true, fill: BAR_FILLS[i % BAR_FILLS.length], stroke: INK, sw: 1.4 });
        shapes.push({ k: "text", x: c + Math.sin(am) * r * 0.62, y: c - Math.cos(am) * r * 0.62 + 4.5, t: v, size: 12.5, anchor: "middle", bold: true, fill: INK });
      });
      shapes.push({ k: "poly", pts: [[c - 3, c + 4], [c + 3, c + 4], [c + 16, c - 26]], closed: true, fill: INK }, { k: "circle", cx: c, cy: c, r: 4, fill: INK });
      return { w: 100, h: 100, shapes, alt: `A spinner with sections ${vals.join(", ")}` };
    }
  }

  // ---- Magic square grid
  if ((m = q.match(/^(In this magic square every row, column and diagonal (?:adds up to \d+|has the same sum))\. Row 1: ([^|]+) \| Row 2: ([^|]+) \| Row 3: ([^.]+)\. (What .+)$/))) {
    const rows = [m[2], m[3], m[4]].map((r) => r.split(",").map((s) => s.trim()));
    if (rows.every((r) => r.length === 3)) {
      const s = 38, shapes: Shape[] = [];
      rows.forEach((row, i) => row.forEach((v, j) => {
        const blank = v === "__";
        shapes.push({ k: "rect", x: 2 + j * s, y: 2 + i * s, w: s, h: s, fill: blank ? FILL_B : "#fff", stroke: INK, sw: 1.6 });
        if (!blank) shapes.push({ k: "text", x: 2 + j * s + s / 2, y: 2 + i * s + s / 2 + 5.5, t: v, size: 15, anchor: "middle", bold: true, fill: INK });
      }));
      return { w: s * 3 + 4, h: s * 3 + 4, shapes, alt: "A 3 by 3 magic square with missing numbers", prompt: `${m[1]}. ${m[5]}` };
    }
  }

  // ---- Coordinate grid for points within ±10
  if (/coordinate|^slope$|transformations/.test(topic)) {
    const pts = [...q.matchAll(/\((-?\d+), (-?\d+)\)/g)].map((x) => [+x[1], +x[2]]);
    if (pts.length >= 1 && pts.length <= 3 && pts.every(([x, y]) => Math.abs(x) <= 10 && Math.abs(y) <= 10)) {
      const firstQ = topic === "coordinate_plane_q1" || (topic !== "transformations" && pts.every(([x, y]) => x >= 0 && y >= 0));
      const lo = firstQ ? 0 : -10, hi = 10, cell = firstQ ? 12 : 7, size = (hi - lo) * cell, o = 14;
      const X = (v: number) => o + (v - lo) * cell, Y = (v: number) => o + (hi - v) * cell;
      const shapes: Shape[] = [];
      for (let v = lo; v <= hi; v++) {
        shapes.push({ k: "line", x1: X(v), y1: Y(lo), x2: X(v), y2: Y(hi), stroke: "#e2e8f0", sw: 0.6 });
        shapes.push({ k: "line", x1: X(lo), y1: Y(v), x2: X(hi), y2: Y(v), stroke: "#e2e8f0", sw: 0.6 });
      }
      shapes.push({ k: "line", x1: X(lo), y1: Y(0), x2: X(hi), y2: Y(0), stroke: INK, sw: 1.4 }, { k: "line", x1: X(0), y1: Y(lo), x2: X(0), y2: Y(hi), stroke: INK, sw: 1.4 });
      const ticks = firstQ ? [0, 2, 4, 6, 8, 10] : [-10, -5, 5, 10];
      for (const t of ticks) {
        shapes.push({ k: "text", x: X(t), y: Y(0) + 11, t: String(t), size: 8, anchor: "middle", fill: "#475569" });
        if (t !== 0) shapes.push({ k: "text", x: X(0) - 3, y: Y(t) + 3, t: String(t), size: 8, anchor: "end", fill: "#475569" });
      }
      shapes.push({ k: "text", x: X(hi) + 6, y: Y(0) + 4, t: "x", size: 10, bold: true, fill: INK }, { k: "text", x: X(0), y: Y(hi) - 4, t: "y", size: 10, bold: true, anchor: "middle", fill: INK });
      pts.forEach(([x, y], i) => {
        shapes.push({ k: "circle", cx: X(x), cy: Y(y), r: 3.5, fill: "#dc2626", stroke: INK, sw: 0.8 });
        shapes.push({ k: "text", x: X(x) + 5, y: Y(y) - 4, t: String.fromCharCode(65 + i), size: 10, bold: true, fill: "#dc2626" });
      });
      return { w: size + o * 2 + 8, h: size + o * 2, shapes, alt: "A coordinate grid with the points plotted" };
    }
  }

  // ---- Picture graph (pictograph)
  if ((m = q.match(/^In a picture graph of (favorite [\w ]+), each ★ means (\d+) votes: ((?:[\w ]+ \d+★(?:, )?)+)\. (.+)$/))) {
    const rows = m[3].split(", ").map((r) => { const mm = r.match(/^([\w ]+) (\d+)★$/)!; return [mm[1], +mm[2]] as [string, number]; });
    const shapes: Shape[] = [];
    const lw = Math.max(...rows.map(([n]) => n.length)) * 7 + 14, rh = 26;
    shapes.push({ k: "text", x: 4, y: 14, t: m[1].replace(/^./, (c) => c.toUpperCase()), size: 12, bold: true, fill: INK });
    rows.forEach(([name, n], i) => {
      const y = 22 + i * rh;
      shapes.push({ k: "rect", x: 2, y, w: lw + 10 * 22 + 8, h: rh, fill: i % 2 ? "#fff" : PALE, stroke: "#cbd5e1", sw: 0.8 });
      shapes.push({ k: "text", x: 8, y: y + 17, t: name, size: 11.5, fill: INK });
      for (let k = 0; k < n; k++) shapes.push(star(lw + 14 + k * 22, y + rh / 2, 8.5));
    });
    const yk = 22 + rows.length * rh + 18;
    shapes.push(star(12, yk - 4, 7), { k: "text", x: 24, y: yk, t: `= ${m[2]} votes`, size: 11, bold: true, fill: INK });
    return { w: lw + 10 * 22 + 12, h: yk + 6, shapes, alt: `A picture graph of ${m[1]}`, prompt: m[4] };
  }

  // ---- Base-ten blocks (place value, grades 1–3)
  if (grade <= 3 && /placevalue|expanded_form|comparing|compare/.test(topic)) {
    const nums = [...q.matchAll(/\b(\d{1,3})\b/g)].map((x) => +x[1]);
    const target = (m = q.match(/digit \d in (\d{2,3})\b/)) ? [+m[1]] : /^Compare: \d+ ___ \d+/.test(q) && nums.every((v) => v <= 60) ? nums.slice(0, 2) : null;
    if (target && target.every((v) => v >= 1 && v <= 999)) {
      const shapes: Shape[] = [];
      let x = 4;
      target.forEach((v, idx) => {
        const start = x;
        const H = Math.floor(v / 100), T = Math.floor((v % 100) / 10), O = v % 10;
        for (let i = 0; i < H; i++) { shapes.push(...flat(x, 6)); x += 46; }
        for (let i = 0; i < T; i++) { shapes.push(...rod(x, 6)); x += 11; }
        if (T) x += 4;
        for (let i = 0; i < O; i++) shapes.push({ k: "rect", x: x + (i % 2) * 10, y: 6 + 40 - Math.floor(i / 2) * 10 - 10 + 2, w: 8, h: 8, fill: FILL_B, stroke: INK, sw: 1 });
        if (O) x += 22;
        if (target.length > 1) shapes.push({ k: "text", x: (start + x) / 2, y: 64, t: String(v), size: 12, bold: true, anchor: "middle", fill: "#1d4ed8" });
        if (idx === 0 && target.length > 1) x += 26;
      });
      return { w: Math.max(x + 4, 60), h: target.length > 1 ? 70 : 52, shapes, alt: `Base-ten blocks showing ${target.join(" and ")}` };
    }
  }

  // ---- Halves and quarters
  if ((m = q.match(/^An? (pizza|cake|pie|sandwich|square|circle|pancake) is cut into (2|4) equal parts/))) {
    const den = +m[2], round = !/sandwich|square/.test(m[1]);
    const shapes: Shape[] = [];
    if (round) for (let i = 0; i < den; i++) shapes.push({ k: "poly", pts: sectorPts(40, 40, 34, (i / den) * Math.PI * 2, ((i + 1) / den) * Math.PI * 2), closed: true, fill: i === 0 ? FILL_B : "#fff", stroke: INK, sw: 1.6 });
    else shapes.push(...fractionGrid(6, 6, 68, den, 1));
    return { w: 84, h: 82, shapes, alt: `A ${m[1]} cut into ${den} equal parts` };
  }

  // ---- Hundred grid for percents
  if (/percent/.test(topic) && (m = q.match(/^Write (?:(\d+)\/(\d+)|(0\.\d+)) as a percent\.$/))) {
    const pct = m[3] ? Math.round(+m[3] * 100) : (100 * +m[1]) / +m[2];
    if (Number.isInteger(pct) && pct > 0 && pct <= 100) {
      const c = 9, shapes: Shape[] = [];
      for (let i = 0; i < 100; i++) shapes.push({ k: "rect", x: 2 + (i % 10) * c, y: 2 + Math.floor(i / 10) * c, w: c, h: c, fill: i < pct ? FILL_A : "#fff", stroke: "#94a3b8", sw: 0.6 });
      shapes.push({ k: "rect", x: 2, y: 2, w: c * 10, h: c * 10, stroke: INK, sw: 1.5 });
      return { w: c * 10 + 4, h: c * 10 + 4, shapes, alt: `A hundred grid with ${pct} squares shaded` };
    }
  }

  // ---- Angles on a line / in a right angle
  if ((m = q.match(/^Two angles sit side by side on a straight line\. One is (\d+)°/)) || (m = q.match(/^What is the supplement of an? (\d+)° angle\?$/))) {
    const a = +m[1];
    return anglePair(180, a);
  }
  if ((m = q.match(/^Two angles together make a right angle\. One is (\d+)°/)) || (m = q.match(/^What is the complement of an? (\d+)° angle\?$/))) {
    return anglePair(90, +m[1]);
  }
  if ((m = q.match(/^Two lines cross\. One angle is (\d+)°\. What is the angle vertically opposite it\?$/))) {
    const a = (+m[1] * Math.PI) / 180, cx = 90, cy = 55, r = 70, shapes: Shape[] = [];
    shapes.push({ k: "line", x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: INK, sw: 2 });
    shapes.push({ k: "line", x1: cx - Math.cos(a) * r * 0.75, y1: cy + Math.sin(a) * r * 0.75, x2: cx + Math.cos(a) * r * 0.75, y2: cy - Math.sin(a) * r * 0.75, stroke: INK, sw: 2 });
    shapes.push(angleArc(cx, cy, 18, 0, +m[1], "#2563eb"), { k: "text", x: cx + 26 * Math.cos(a / 2) + 6, y: cy - 26 * Math.sin(a / 2) + 2, t: `${m[1]}°`, size: 11, bold: true, fill: "#1d4ed8" });
    shapes.push(angleArc(cx, cy, 18, 180, 180 + +m[1], "#dc2626"), { k: "text", x: cx - 26 * Math.cos(a / 2) - 10, y: cy + 26 * Math.sin(a / 2) + 8, t: "?", size: 13, bold: true, anchor: "middle", fill: "#dc2626" });
    return { w: 180, h: 110, shapes, alt: "Two crossing lines with one angle marked" };
  }

  // ---- Parallel lines cut by a transversal
  if ((m = q.match(/^Two parallel lines are cut by a transversal\. One angle is (\d+)°/))) {
    const d = +m[1], shapes: Shape[] = [];
    const ang = ((d > 90 ? 180 - d : d) * Math.PI) / 180;
    const y1 = 35, y2 = 95, x1 = 110, dx = (y2 - y1) / Math.tan(ang);
    shapes.push({ k: "line", x1: 10, y1, x2: 230, y2: y1, stroke: INK, sw: 2 }, { k: "line", x1: 10, y1: y2, x2: 230, y2: y2, stroke: INK, sw: 2 });
    shapes.push({ k: "poly", pts: [[118, y1 - 4], [126, y1], [118, y1 + 4]], stroke: INK, sw: 1.4 }, { k: "poly", pts: [[118, y2 - 4], [126, y2], [118, y2 + 4]], stroke: INK, sw: 1.4 });
    const tx = (y: number) => x1 + (y1 - y) / (y2 - y1) * dx;
    shapes.push({ k: "line", x1: tx(10), y1: 10, x2: tx(120), y2: 120, stroke: INK, sw: 2 });
    const acute = 90 - Math.abs(90 - d) === d && d <= 90, a0 = acute ? 0 : 180 - d, a1 = acute ? d : 180;
    shapes.push(angleArc(tx(y1), y1, 14, a0, a1, "#2563eb"));
    shapes.push({ k: "text", x: tx(y1) + (acute ? 20 : -20), y: y1 - 6, t: `${d}°`, size: 11, bold: true, anchor: acute ? "start" : "end", fill: "#1d4ed8" });
    return { w: 240, h: 128, shapes, alt: `Two parallel lines cut by a transversal, with a ${d}° angle marked` };
  }

  // ---- Triangle with two known angles
  if ((m = q.match(/^Two angles of a triangle are (\d+)° and (\d+)°\. Find the third angle\.$/)) || (m = q.match(/^A triangle has interior angles (\d+)° and (\d+)°\. What is the exterior angle at the third vertex\?$/))) {
    const A = +m[1], B = +m[2], ext = /exterior/.test(q);
    if (A + B < 175) {
      const base = 170, ra = (A * Math.PI) / 180, rb = (B * Math.PI) / 180;
      const h = base / (1 / Math.tan(ra) + 1 / Math.tan(rb));
      const sc = Math.min(1, 95 / h), bw = base * sc, H = h * sc;
      const px = 20 + (H / Math.tan(ra)), py = 110 - H;
      const shapes: Shape[] = [{ k: "poly", pts: [[20, 110], [20 + bw, 110], [px, py]], closed: true, fill: FILL_D, stroke: INK, sw: 2 }];
      const lab = (vx: number, ang: number, dir: 1 | -1, t: string): Shape => ({ k: "text", x: vx + dir * Math.cos(ang / 2) * 30, y: 110 - Math.sin(ang / 2) * 30 + 8, t, size: 10.5, bold: true, anchor: "middle", fill: "#1d4ed8" });
      shapes.push(lab(20, ra, 1, `${A}°`), lab(20 + bw, rb, -1, `${B}°`));
      if (ext) {
        const ux = (px - 20) / Math.hypot(px - 20, py - 110), uy = (py - 110) / Math.hypot(px - 20, py - 110);
        shapes.push({ k: "line", x1: px, y1: py, x2: px + ux * 40, y2: py + uy * 40, stroke: INK, sw: 1.6, dash: true });
        shapes.push({ k: "text", x: px + 14, y: py - 2, t: "?", size: 14, bold: true, fill: "#dc2626" });
      } else shapes.push({ k: "text", x: px, y: py + 22, t: "?", size: 14, bold: true, anchor: "middle", fill: "#dc2626" });
      const minY = Math.min(py - (ext ? 40 : 4), 10);
      for (const sh of shapes) shift(sh, 0, 10 - minY);
      return { w: bw + 50 + (ext ? 30 : 0), h: 130 - minY, shapes, alt: `A triangle with angles ${A}° and ${B}° marked` };
    }
  }

  // ---- Right-triangle trigonometry
  if ((m = q.match(/^In a right triangle, angle A = (\d+)° and the hypotenuse is (\d+(?:\.\d+)?)\. Find the side (adjacent to|opposite) A/))) {
    const adj = m[3] === "adjacent to";
    return rightTriangle(adj ? "x" : "", adj ? "" : "x", m[2], [
      { k: "text", x: 40 + 150 - 30, y: 10 + 96 - 6, t: `A = ${m[1]}°`, size: 10.5, bold: true, anchor: "end", fill: "#be185d" },
    ]);
  }
  if ((m = q.match(/^A 45-45-90 triangle has legs of length (\d+)\. How long is the hypotenuse\?$/))) return rightTriangle(m[1], m[1], "?");
  if ((m = q.match(/^In a 30-60-90 triangle the shorter leg is (\d+)\./))) return rightTriangle("?", m[1], "?");

  // ---- Circles: sectors and arcs
  if ((m = q.match(/^Find the (area of a sector|length of an arc) with central angle (\d+)° in a circle of radius (\d+)/))) {
    const deg = +m[2], r = 46, cx = 56, cy = 56, shapes: Shape[] = [];
    shapes.push({ k: "circle", cx, cy, r, fill: "#fff", stroke: INK, sw: 1.8 });
    shapes.push({ k: "poly", pts: sectorPts(cx, cy, r, Math.PI / 2, Math.PI / 2 + (deg * Math.PI) / 180), closed: true, fill: /area/.test(m[1]) ? FILL_A : "#fff", stroke: INK, sw: 1.5 });
    if (/arc/.test(m[1])) { const pts = sectorPts(cx, cy, r, Math.PI / 2, Math.PI / 2 + (deg * Math.PI) / 180).slice(1); shapes.push({ k: "poly", pts, stroke: "#dc2626", sw: 4 }); }
    shapes.push({ k: "text", x: cx + 4, y: cy - 6, t: `${deg}°`, size: 10.5, bold: true, fill: "#be185d" });
    shapes.push({ k: "text", x: cx + r / 2, y: cy + 14, t: `r = ${m[3]}`, size: 10.5, bold: true, anchor: "middle", fill: "#1d4ed8" });
    return { w: 116, h: 114, shapes, alt: `A circle of radius ${m[3]} with a ${deg}° sector` };
  }

  // ---- Regular polygons
  if ((m = q.match(/(?:regular )?(\d+)-sided polygon/)) && +m[1] >= 3 && +m[1] <= 20) {
    return { w: 90, h: 90, shapes: [regularPolygon(+m[1], 90, FILL_C)], alt: `A ${m[1]}-sided polygon` };
  }

  // ---- Solids: cylinders, cones, spheres
  if ((m = q.match(/volume of an? (cylinder|cone) with radius (\d+(?:\.\d+)?) ?(\w+) and height (\d+(?:\.\d+)?) ?(\w+)/))) {
    return solid(m[1] as "cylinder" | "cone", `r = ${m[2]} ${m[3]}`, `h = ${m[4]} ${m[5]}`);
  }
  if ((m = q.match(/volume of a sphere with radius (\d+(?:\.\d+)?) ?(\w+)/))) return solid("sphere", `r = ${m[1]} ${m[2]}`, "");

  // ---- Marbles in a bag
  if ((m = q.match(/^A bag has (\d+) (red|blue|green|yellow) marbles?(?:,| and) (\d+) (red|blue|green|yellow) marbles?(?:,? and (\d+) (red|blue|green|yellow) marbles?)?/))) {
    const groups: [number, string][] = [[+m[1], m[2]], [+m[3], m[4]]];
    if (m[5]) groups.push([+m[5], m[6]]);
    const total = groups.reduce((a, [n]) => a + n, 0);
    if (total <= 24) {
      const col: Record<string, string> = { red: "#f87171", blue: "#60a5fa", green: "#4ade80", yellow: "#facc15" };
      const shapes: Shape[] = [{ k: "poly", pts: [[20, 30], [10, 110], [150, 110], [140, 30]], closed: true, fill: "#fef3c7", stroke: INK, sw: 1.8 }, { k: "line", x1: 14, y1: 30, x2: 146, y2: 30, stroke: INK, sw: 3 }];
      let i = 0;
      for (const [n, c] of groups) for (let k = 0; k < n; k++, i++) shapes.push({ k: "circle", cx: 30 + (i % 7) * 17, cy: 98 - Math.floor(i / 7) * 17, r: 7.5, fill: col[c], stroke: INK, sw: 1 });
      return { w: 160, h: 116, shapes, alt: `A bag of marbles: ${groups.map(([n, c]) => `${n} ${c}`).join(", ")}` };
    }
  }

  // ---- Triangles described by their sides
  if ((m = q.match(/^A triangle has sides of (\d+) (cm|m|in|ft), (\d+) \2 and (\d+) \2\./))) {
    const [a, b, c] = [+m[1], +m[3], +m[4]];
    if (a + b > c && a + c > b && b + c > a) {
      // place side c as base, solve for apex
      const sc = 150 / Math.max(a, b, c), C = c * sc, A = a * sc, B = b * sc;
      const px = (C * C + B * B - A * A) / (2 * C), py = Math.sqrt(Math.max(0, B * B - px * px));
      const ox = 30, oy = 20 + py;
      const shapes: Shape[] = [{ k: "poly", pts: [[ox, oy], [ox + C, oy], [ox + px, oy - py]], closed: true, fill: FILL_B, stroke: INK, sw: 2 }];
      shapes.push(dimLabel(ox + C / 2, oy + 16, `${c} ${m[2]}`), dimLabel(ox + px / 2 - 6, oy - py / 2, `${b} ${m[2]}`, "end"), dimLabel(ox + (px + C) / 2 + 6, oy - py / 2, `${a} ${m[2]}`, "start"));
      return { w: ox + C + 70, h: oy + 24, shapes, alt: `A triangle with sides ${a}, ${b} and ${c} ${m[2]}` };
    }
  }

  // ---- Line graph for y = mx + b
  if (/slope_intercept|linear|functions_intro|point_slope/.test(topic) && (m = q.match(/y = (-?\d*)x(?: ([+-]) (\d+))?\b/))) {
    const mm = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1], b = m[2] ? (m[2] === "-" ? -1 : 1) * +m[3] : 0;
    if (Math.abs(mm) <= 6 && Math.abs(b) <= 10) {
      const lo = -10, hi = 10, cell = 7, o = 14, size = (hi - lo) * cell;
      const X = (v: number) => o + (v - lo) * cell, Y = (v: number) => o + (hi - v) * cell;
      const shapes: Shape[] = [];
      for (let v = lo; v <= hi; v++) shapes.push({ k: "line", x1: X(v), y1: Y(lo), x2: X(v), y2: Y(hi), stroke: "#e2e8f0", sw: 0.6 }, { k: "line", x1: X(lo), y1: Y(v), x2: X(hi), y2: Y(v), stroke: "#e2e8f0", sw: 0.6 });
      shapes.push({ k: "line", x1: X(lo), y1: Y(0), x2: X(hi), y2: Y(0), stroke: INK, sw: 1.4 }, { k: "line", x1: X(0), y1: Y(lo), x2: X(0), y2: Y(hi), stroke: INK, sw: 1.4 });
      for (const t of [-10, -5, 5, 10]) shapes.push({ k: "text", x: X(t), y: Y(0) + 11, t: String(t), size: 8, anchor: "middle", fill: "#475569" }, { k: "text", x: X(0) - 3, y: Y(t) + 3, t: String(t), size: 8, anchor: "end", fill: "#475569" });
      // clip the line to the grid
      const xs = [lo, hi].map((x) => [x, mm * x + b]).concat([lo, hi].map((y) => [(y - b) / mm, y])).filter(([x, y]) => x >= lo - 1e-9 && x <= hi + 1e-9 && y >= lo - 1e-9 && y <= hi + 1e-9);
      if (xs.length >= 2) {
        xs.sort((p1, p2) => p1[0] - p2[0]);
        const [p1, p2] = [xs[0], xs[xs.length - 1]];
        shapes.push({ k: "line", x1: X(p1[0]), y1: Y(p1[1]), x2: X(p2[0]), y2: Y(p2[1]), stroke: "#2563eb", sw: 2.2 });
        return { w: size + o * 2, h: size + o * 2, shapes, alt: `Graph of the line ${m[0]}` };
      }
    }
  }

  // ---- Dot plot for a small data set
  if (/stats|central_tendency|mad_iqr|range/.test(topic) && (m = q.match(/(?:of|data|set)[^:]*: ((?:-?\d+(?:\.\d+)?, ){3,11}-?\d+(?:\.\d+)?)\.?$/))) {
    const vals = m[1].split(", ").map(Number);
    if (vals.every(Number.isInteger)) {
      const lo = Math.min(...vals), hi = Math.max(...vals), span = Math.max(hi - lo, 1);
      const step = span <= 12 ? 1 : span <= 30 ? 2 : span <= 60 ? 5 : 10;
      const a = Math.floor(lo / step) * step, z = Math.ceil(hi / step) * step;
      const n = (z - a) / step, W = 300, x0 = 12, dx = (W - 2 * x0) / Math.max(n, 1);
      const counts = new Map<number, number>();
      const shapes: Shape[] = [];
      const maxStack = Math.max(...vals.map((v) => vals.filter((u) => u === v).length));
      const base = 16 + maxStack * 12;
      shapes.push({ k: "line", x1: x0 - 6, y1: base, x2: W - x0 + 6, y2: base, stroke: INK, sw: 1.6 });
      for (let i = 0; i <= n; i++) {
        const x = x0 + i * dx;
        shapes.push({ k: "line", x1: x, y1: base - 4, x2: x, y2: base + 4, stroke: INK, sw: 1.1 });
        if (n <= 15 || i % 2 === 0) shapes.push({ k: "text", x, y: base + 16, t: String(a + i * step), size: 9, anchor: "middle", fill: "#475569" });
      }
      for (const v of vals) {
        const c = counts.get(v) || 0; counts.set(v, c + 1);
        shapes.push({ k: "circle", cx: x0 + ((v - a) / step) * dx, cy: base - 8 - c * 12, r: 4.6, fill: "#60a5fa", stroke: INK, sw: 0.9 });
      }
      return { w: W, h: base + 22, shapes, alt: `A dot plot of ${vals.join(", ")}` };
    }
  }

  // ---- A die
  if (/probab/.test(topic) && /six-sided die|number cube/.test(q) && !/two dice|both dice|twice/.test(q)) {
    const shapes: Shape[] = [];
    const face = (x: number, n: number) => {
      shapes.push({ k: "rect", x, y: 4, w: 38, h: 38, r: 7, fill: "#fff", stroke: INK, sw: 1.6 });
      const P: Record<number, [number, number][]> = { 1: [[19, 19]], 2: [[10, 10], [28, 28]], 3: [[10, 10], [19, 19], [28, 28]], 4: [[10, 10], [28, 10], [10, 28], [28, 28]], 5: [[10, 10], [28, 10], [19, 19], [10, 28], [28, 28]], 6: [[10, 9], [28, 9], [10, 19], [28, 19], [10, 29], [28, 29]] };
      for (const [px, py] of P[n]) shapes.push({ k: "circle", cx: x + px, cy: 4 + py, r: 3.3, fill: INK });
    };
    for (let i = 1; i <= 6; i++) face(4 + (i - 1) * 46, i);
    return { w: 6 * 46 + 6, h: 48, shapes, alt: "The six faces of a die" };
  }

  // ---- Rounding on a number line
  if ((m = q.match(/^Round (\d{1,3}(?:,\d{3})?|\d{2,4}) to the nearest (10|100)\.$/))) {
    const v = +m[1].replace(/,/g, ""), step = +m[2], a = Math.floor(v / step) * step;
    if (v !== a) {
      const tick = step / 10, shapes: Shape[] = [], W = 300, x0 = 14, dx = (W - 2 * x0) / 10;
      shapes.push({ k: "line", x1: x0 - 6, y1: 22, x2: W - x0 + 6, y2: 22, stroke: INK, sw: 1.6 });
      for (let i = 0; i <= 10; i++) {
        const x = x0 + i * dx, big = i % 5 === 0;
        shapes.push({ k: "line", x1: x, y1: 22 - (big ? 8 : 4), x2: x, y2: 22 + (big ? 8 : 4), stroke: INK, sw: big ? 1.6 : 1 });
        if (i === 0 || i === 10 || i === 5) shapes.push({ k: "text", x, y: 42, t: String(a + i * tick), size: 10.5, anchor: "middle", bold: i !== 5, fill: INK });
      }
      const pos = x0 + ((v - a) / tick) * dx;
      shapes.push({ k: "poly", pts: [[pos, 20], [pos - 5, 8], [pos + 5, 8]], closed: true, fill: "#dc2626" }, { k: "text", x: pos, y: 6, t: String(v), size: 10, bold: true, anchor: "middle", fill: "#dc2626" });
      return { w: W, h: 48, shapes, alt: `Number line from ${a} to ${a + step} with ${v} marked` };
    }
  }

  // ---- Cube trains for measuring length (grades 1–2)
  if (grade <= 2 && /compare_length/.test(topic)) {
    const items = [...q.matchAll(/an? (\w+) is (\d+) (cubes|paper clips)/gi)].map((x) => [x[1], +x[2], x[3]] as [string, number, string]);
    if (items.length >= 2 && items.every(([, n]) => n <= 15)) {
      const shapes: Shape[] = [];
      const c = 14;
      items.forEach(([name, n, unit], r) => {
        const y = 4 + r * 22;
        shapes.push({ k: "text", x: 54, y: y + 11, t: name.toLowerCase(), size: 10.5, anchor: "end", bold: true, fill: INK });
        for (let i = 0; i < n; i++) {
          if (unit === "cubes") shapes.push({ k: "rect", x: 60 + i * c, y, w: c, h: c, fill: BAR_FILLS[r % BAR_FILLS.length], stroke: INK, sw: 1 });
          else shapes.push({ k: "rect", x: 61 + i * c, y: y + 3, w: c - 2, h: 8, r: 4, stroke: "#475569", sw: 1.2 });
        }
      });
      return { w: 60 + 15 * c + 6, h: 8 + items.length * 22, shapes, alt: items.map(([a, n, u]) => `${a}: ${n} ${u}`).join(", ") };
    }
  }

  // ---- Integer number line
  if (/integers|absolute_value/.test(topic) && grade <= 8) {
    const nums = [...q.matchAll(/(?<![\d.])-?\d+(?![\d.])/g)].map((x) => +x[0]);
    if (nums.length >= 1 && nums.length <= 3 && nums.every((v) => Math.abs(v) <= 10) && !/[×÷]/.test(q)) {
      return numberLine(-10, 10, 1, 2);
    }
  }

  return null;
}

function scienceVisual(topic: string, q: string): Visual | null {
  let m: RegExpMatchArray | null;
  // Empty Punnett square with the parents' alleles on the edges
  if (/punnett/.test(topic) && (m = q.match(/\b([A-Za-z])([A-Za-z]) × ([A-Za-z])([A-Za-z])\b/))) {
    const s = 40, x = 26, y = 26, shapes: Shape[] = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) shapes.push({ k: "rect", x: x + j * s, y: y + i * s, w: s, h: s, fill: "#fff", stroke: INK, sw: 1.6 });
    shapes.push(
      { k: "text", x: x + s / 2, y: y - 8, t: m[1], size: 15, bold: true, anchor: "middle", fill: "#1d4ed8" },
      { k: "text", x: x + s * 1.5, y: y - 8, t: m[2], size: 15, bold: true, anchor: "middle", fill: "#1d4ed8" },
      { k: "text", x: x - 10, y: y + s / 2 + 5, t: m[3], size: 15, bold: true, anchor: "middle", fill: "#be185d" },
      { k: "text", x: x - 10, y: y + s * 1.5 + 5, t: m[4], size: 15, bold: true, anchor: "middle", fill: "#be185d" },
    );
    return { w: x + s * 2 + 6, h: y + s * 2 + 6, shapes, alt: "An empty Punnett square to fill in" };
  }
  return null;
}


// ---------------------------------------------------------------- pictures from the icon library

const COUNT_ICONS = ["apple", "star", "fish", "cookie", "ball", "duck", "flower", "car", "cherry", "bee", "egg", "heart", "kite", "pear", "bug", "cup"];

function iconRow(words: string[], size: number, gap: number, y = 0, x0 = 0): Shape[] {
  const out: Shape[] = [];
  words.forEach((w, i) => { const ic = ICONS[w]; if (ic) out.push(...placeIcon(ic, x0 + i * (size + gap), y, size)); });
  return out;
}

/** n copies of an icon in rows of `perRow`; the last `crossed` get a red X. */
function iconGroup(icon: Icon, n: number, size: number, perRow: number, x0: number, y0: number, crossed = 0): { shapes: Shape[]; w: number; h: number } {
  const shapes: Shape[] = [];
  const g = size * 0.18;
  for (let i = 0; i < n; i++) {
    const x = x0 + (i % perRow) * (size + g), y = y0 + Math.floor(i / perRow) * (size + g);
    shapes.push(...placeIcon(icon, x, y, size));
    if (i >= n - crossed) shapes.push({ k: "line", x1: x + 2, y1: y + 2, x2: x + size - 2, y2: y + size - 2, stroke: "#dc2626", sw: 2.4 }, { k: "line", x1: x + size - 2, y1: y + 2, x2: x + 2, y2: y + size - 2, stroke: "#dc2626", sw: 2.4 });
  }
  const cols = Math.min(n, perRow), rows = Math.ceil(n / perRow);
  return { shapes, w: cols * (size + g) - g, h: rows * (size + g) - g };
}

/** Draws the picture described by a question's `pic` spec. */
export function picVisual(pic: string): Visual | null {
  const [kind, ...restParts] = pic.split(":");
  const rest = restParts.join(":");
  if (kind === "count") {
    const [word, nStr] = rest.split(":");
    const icon = ICONS[word], n = +nStr;
    if (!icon || !n) return null;
    const per = n <= 10 ? 5 : 5;
    const size = n <= 10 ? 36 : 30;
    // Two blocks of five per row make counting easier (like a ten-frame).
    const shapes: Shape[] = [];
    let w = 0, h = 0;
    for (let i = 0; i < n; i++) {
      const blockRow = Math.floor(i / 10), inTen = i % 10;
      const x = 6 + (inTen % per) * (size + 6) + (inTen >= per ? 0 : 0);
      const y = 6 + blockRow * 2 * (size + 6) + Math.floor(inTen / per) * (size + 6);
      shapes.push(...placeIcon(icon, x, y, size));
      w = Math.max(w, x + size + 6); h = Math.max(h, y + size + 6);
    }
    return { w, h, shapes, alt: `${n} ${n === 1 ? icon.word : icon.plural}`, prompt: `How many ${icon.plural} are there? Count them.` };
  }
  if (kind === "pattern") {
    const words = rest.split(",");
    const size = 36, gap = 8;
    const shapes = iconRow(words, size, gap, 4, 4);
    const x = 4 + words.length * (size + gap);
    shapes.push({ k: "rect", x, y: 4, w: size, h: size, r: 6, stroke: "#64748b", sw: 1.6, dash: true }, { k: "text", x: x + size / 2, y: 4 + size / 2 + 6, t: "?", size: 18, bold: true, anchor: "middle", fill: "#dc2626" });
    return { w: x + size + 6, h: size + 10, shapes, alt: `A pattern: ${words.join(", ")}, then a gap`, prompt: "What comes next in the pattern? Write its name." };
  }
  if (kind === "pics") {
    const words = rest.split(",");
    const size = 52, gap = 30;
    return { w: words.length * (size + gap), h: size + 8, shapes: iconRow(words, size, gap, 4, 8), alt: words.join(", ") };
  }
  if (kind === "rhyme") {
    const [target, optStr] = rest.split("|");
    const opts = optStr.split(",");
    const size = 48;
    const shapes: Shape[] = [...iconRow([target], 56, 0, 2, 2)];
    shapes.push({ k: "rect", x: 0, y: 0, w: 60, h: 60, r: 8, stroke: "#be185d", sw: 2 });
    shapes.push({ k: "line", x1: 68, y1: 30, x2: 88, y2: 30, stroke: "#64748b", sw: 2 }, { k: "poly", pts: [[94, 30], [86, 25], [86, 35]], closed: true, fill: "#64748b" });
    shapes.push(...iconRow(opts, size, 24, 6, 104));
    return { w: 104 + opts.length * (size + 24), h: 62, shapes, alt: `${target} and three pictures: ${opts.join(", ")}` };
  }
  if (kind === "icon") {
    const ic = ICONS[rest];
    return ic ? { w: 48, h: 48, shapes: placeIcon(ic, 0, 0, 48), alt: ic.word } : null;
  }
  return null;
}

/** Picture sums for Grade 1–2: groups of objects for small additions and subtractions and simple word problems. */
function earlyMathPicture(topic: string, grade: number, q: string): Visual | null {
  if (grade > 2) return null;
  let m: RegExpMatchArray | null;
  const pickIcon = (seed: string) => ICONS[COUNT_ICONS[hashStr(seed) % COUNT_ICONS.length]];
  const plus = (a: number, b: number, icon: Icon): Visual => {
    const size = a + b > 12 ? 20 : 26;
    const A = iconGroup(icon, a, size, 5, 8, 8), B = iconGroup(icon, b, size, 5, 0, 8);
    const bx = 8 + A.w + 40;
    const shapes: Shape[] = [
      { k: "rect", x: 2, y: 2, w: A.w + 12, h: Math.max(A.h, B.h) + 12, r: 8, fill: "#f0f9ff", stroke: "#93c5fd", sw: 1.4 },
      ...A.shapes,
      { k: "text", x: 8 + A.w + 20, y: 10 + Math.max(A.h, B.h) / 2 + 6, t: "+", size: 20, bold: true, anchor: "middle", fill: INK },
      { k: "rect", x: bx - 6, y: 2, w: B.w + 12, h: Math.max(A.h, B.h) + 12, r: 8, fill: "#fdf2f8", stroke: "#f9a8d4", sw: 1.4 },
      ...B.shapes.map((sh) => { shift(sh, bx, 0); return sh; }),
    ];
    return { w: bx + B.w + 10, h: Math.max(A.h, B.h) + 16, shapes, alt: `${a} ${icon.plural} and ${b} more ${icon.plural}` };
  };
  const minus = (a: number, b: number, icon: Icon): Visual => {
    const size = a > 12 ? 20 : 26;
    const G = iconGroup(icon, a, size, 10, 4, 4, b);
    return { w: G.w + 8, h: G.h + 8, shapes: G.shapes, alt: `${a} ${icon.plural}, ${b} crossed out` };
  };
  if (/add_within|doubles|addsub|three_addends|add_2d_1d/.test(topic) || topic === "add_within_10" || topic === "add_within_20") {
    if ((m = q.match(/^(\d+) \+ (\d+) = \?$/)) && +m[1] >= 1 && +m[2] >= 1 && +m[1] <= 10 && +m[2] <= 10) return plus(+m[1], +m[2], pickIcon(q));
  }
  if (/sub_within|addsub/.test(topic)) {
    if ((m = q.match(/^(\d+) - (\d+) = \?$/)) && +m[1] <= 20 && +m[2] >= 1) return minus(+m[1], +m[2], pickIcon(q));
  }
  if (/wordproblems|word/.test(topic)) {
    if ((m = q.match(/has (\d+) ([a-z]+(?: [a-z]+)?) and (?:gives away|eats|loses|uses) (\d+)/)) && iconFor(m[2]) && +m[1] <= 20) return minus(+m[1], +m[3], iconFor(m[2])!);
    if ((m = q.match(/has (\d+) ([a-z]+(?: [a-z]+)?)\. .*?(\d+) more/)) && iconFor(m[2]) && +m[1] <= 10 && +m[3] <= 10) return plus(+m[1], +m[3], iconFor(m[2])!);
  }
  return null;
}

function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Words with other everyday meanings ("the key idea", "a big fan") — never added as decoration. */
const AMBIGUOUS = new Set(["key", "fan", "ring", "heart", "card", "rock", "bead", "pan", "box"]);

/** A small picture for an early-grade question that names one thing we can draw ("What is a baby cat called?"). */
export function questionIcon(subject: string, grade: number, q: string): Visual | null {
  if (grade > 3 || subject === "math") return null;
  const found = new Set<string>();
  for (const w of q.toLowerCase().match(/[a-z]+/g) || []) {
    const ic = iconFor(w);
    if (ic && !AMBIGUOUS.has(ic.word)) found.add(ic.word);
  }
  if (found.size !== 1) return null;
  const ic = ICONS[[...found][0]];
  return { w: 48, h: 48, shapes: placeIcon(ic, 0, 0, 48), alt: ic.word };
}

// ---------------------------------------------------------------- decorations

/** Small subject doodle for the worksheet header. */
export function subjectDoodle(subject: string): Visual {
  const shapes: Shape[] = [];
  if (subject === "math") {
    shapes.push(
      { k: "rect", x: 4, y: 26, w: 26, h: 26, r: 3, fill: FILL_A, stroke: INK, sw: 1.5 },
      { k: "circle", cx: 46, cy: 20, r: 14, fill: FILL_B, stroke: INK, sw: 1.5 },
      { k: "poly", pts: [[38, 54], [62, 54], [50, 32]], closed: true, fill: FILL_D, stroke: INK, sw: 1.5 },
      { k: "text", x: 17, y: 44, t: "+", size: 16, bold: true, anchor: "middle", fill: INK },
      { k: "text", x: 46, y: 25, t: "÷", size: 14, bold: true, anchor: "middle", fill: INK },
    );
  } else if (subject === "english") {
    shapes.push(
      { k: "poly", pts: [[4, 14], [32, 20], [32, 54], [4, 48]], closed: true, fill: FILL_A, stroke: INK, sw: 1.5 },
      { k: "poly", pts: [[60, 14], [32, 20], [32, 54], [60, 48]], closed: true, fill: FILL_C, stroke: INK, sw: 1.5 },
      { k: "line", x1: 10, y1: 26, x2: 26, y2: 29, stroke: INK, sw: 1 }, { k: "line", x1: 10, y1: 33, x2: 26, y2: 36, stroke: INK, sw: 1 },
      { k: "line", x1: 54, y1: 26, x2: 38, y2: 29, stroke: INK, sw: 1 }, { k: "line", x1: 54, y1: 33, x2: 38, y2: 36, stroke: INK, sw: 1 },
      { k: "text", x: 46, y: 12, t: "Aa", size: 12, bold: true, anchor: "middle", fill: INK },
    );
  } else {
    shapes.push(
      { k: "poly", pts: [[22, 6], [34, 6], [34, 24], [46, 50], [10, 50], [22, 24]], closed: true, fill: FILL_C, stroke: INK, sw: 1.5 },
      { k: "line", x1: 19, y1: 6, x2: 37, y2: 6, stroke: INK, sw: 2 },
      { k: "circle", cx: 24, cy: 40, r: 3, fill: "#fff", stroke: INK, sw: 1 }, { k: "circle", cx: 32, cy: 34, r: 2, fill: "#fff", stroke: INK, sw: 1 },
      { k: "circle", cx: 54, cy: 22, r: 4, fill: FILL_B, stroke: INK, sw: 1.2 },
      { k: "circle", cx: 54, cy: 22, r: 11, stroke: INK, sw: 1 },
    );
  }
  return { w: 64, h: 56, shapes, alt: "" };
}


/** Header picture chosen by topic family, falling back to the subject doodle. */
export function topicDoodle(subject: string, topic: string): Visual {
  const S: Shape[] = [];
  const done = (): Visual => ({ w: 64, h: 56, shapes: S, alt: "" });
  const t = topic;
  if (subject === "math") {
    if (/time|clock|elapsed/.test(t)) { S.push(...clock(10, 10, 52).map((x) => { shift(x, 6, 2); return x; })); return done(); }
    if (/fraction|halves|quarter|mixed_numbers/.test(t)) {
      for (let i = 0; i < 4; i++) S.push({ k: "poly", pts: sectorPts(32, 28, 24, (i / 4) * Math.PI * 2, ((i + 1) / 4) * Math.PI * 2), closed: true, fill: i < 3 ? FILL_B : "#fff", stroke: INK, sw: 1.5 });
      return done();
    }
    if (/money|coin/.test(t)) { S.push(...coin(22, 32, "25¢", 17, "#e2e8f0"), ...coin(46, 22, "10¢", 13, FILL_B)); return done(); }
    if (/data|stats|graph|tally|probab|mad_iqr|two_way|std_dev/.test(t)) {
      [[8, 30], [22, 18], [36, 36], [50, 10]].forEach(([x, y], i) => S.push({ k: "rect", x, y, w: 11, h: 50 - y, fill: BAR_FILLS[i], stroke: INK, sw: 1.3 }));
      S.push({ k: "line", x1: 4, y1: 50, x2: 62, y2: 50, stroke: INK, sw: 1.5 });
      return done();
    }
    if (/angle|triangle|quadrilateral|polygon|geometry|area|perimeter|volume|surface|shape|circle|arc_sector|transform|pythag|similar|trig|unit_circle|law_sines/.test(t)) {
      S.push({ k: "poly", pts: [[6, 50], [40, 50], [6, 12]], closed: true, fill: FILL_B, stroke: INK, sw: 1.5 }, { k: "rect", x: 6, y: 42, w: 8, h: 8, stroke: INK, sw: 1 });
      S.push({ k: "circle", cx: 48, cy: 22, r: 13, fill: FILL_A, stroke: INK, sw: 1.5 });
      return done();
    }
    if (/algebra|equation|expression|linear|slope|quadratic|polynom|factor|system|inequal|function|exponent|radical|log|matri|vector|complex|sequence|series|limit|deriv|integral/.test(t)) {
      S.push({ k: "rect", x: 4, y: 8, w: 56, h: 40, r: 6, fill: FILL_A, stroke: INK, sw: 1.5 });
      S.push({ k: "text", x: 32, y: 34, t: "x = ?", size: 15, bold: true, anchor: "middle", fill: INK });
      return done();
    }
  }
  if (subject === "english") {
    if (/phonics|vowel|digraph|syllable|sight|spelling|abc|anagram|rhyme/.test(t)) {
      ["A", "B", "C"].forEach((l, i) => { S.push({ k: "rect", x: 4 + i * 20, y: 20 - (i % 2) * 8, w: 18, h: 18, r: 2, fill: BAR_FILLS[i], stroke: INK, sw: 1.4 }, { k: "text", x: 13 + i * 20, y: 34 - (i % 2) * 8, t: l, size: 12, bold: true, anchor: "middle", fill: INK }); });
      return done();
    }
    if (/punctuation|comma|capital|quotes/.test(t)) {
      S.push({ k: "circle", cx: 32, cy: 28, r: 24, fill: FILL_D, stroke: INK, sw: 1.5 }, { k: "text", x: 32, y: 38, t: "? ! ,", size: 18, bold: true, anchor: "middle", fill: INK });
      return done();
    }
    if (/poetry|figurative|literary|idiom|rhetoric|tone|theme|story|point_of_view/.test(t)) {
      S.push({ k: "poly", pts: [[10, 52], [50, 6], [56, 12], [16, 54]], closed: true, fill: FILL_B, stroke: INK, sw: 1.4 });
      S.push({ k: "poly", pts: [[24, 40], [48, 14], [54, 6], [44, 28]], closed: true, fill: "#fff", stroke: INK, sw: 1 });
      return done();
    }
    if (/synonym|antonym|vocabulary|context|roots|prefix|shades|analog|homophone|confused|compound|contraction/.test(t)) {
      S.push({ k: "rect", x: 4, y: 6, w: 40, h: 28, r: 8, fill: FILL_A, stroke: INK, sw: 1.4 }, { k: "poly", pts: [[12, 34], [10, 44], [22, 34]], closed: true, fill: FILL_A, stroke: INK, sw: 1.4 });
      S.push({ k: "rect", x: 24, y: 24, w: 36, h: 24, r: 8, fill: FILL_C, stroke: INK, sw: 1.4 });
      S.push({ k: "text", x: 24, y: 25, t: "Aa", size: 12, bold: true, anchor: "middle", fill: INK }, { k: "text", x: 42, y: 41, t: "Bb", size: 11, bold: true, anchor: "middle", fill: INK });
      return done();
    }
  }
  if (subject === "science") {
    if (/solar|moon|planet|star|universe|kepler|gravit|sky/.test(t)) {
      S.push({ k: "circle", cx: 30, cy: 30, r: 16, fill: "#fdba74", stroke: INK, sw: 1.5 }, { k: "poly", pts: Array.from({ length: 33 }, (_, i) => { const a = (i / 32) * Math.PI * 2; return [30 + Math.cos(a) * 28, 30 + Math.sin(a) * 7] as [number, number]; }), closed: true, stroke: INK, sw: 1.3 });
      S.push({ k: "circle", cx: 56, cy: 10, r: 3, fill: FILL_B, stroke: INK, sw: 1 });
      return done();
    }
    if (/plant|animal|life|cell|body|food|ecosystem|habitat|adapt|genetic|dna|bio|reproduction|selection|classification|senses|living|offspring|pollination|microscope|survival/.test(t)) {
      S.push({ k: "line", x1: 32, y1: 54, x2: 32, y2: 22, stroke: "#16a34a", sw: 3 });
      S.push({ k: "poly", pts: [[32, 34], [12, 22], [8, 8], [26, 16]], closed: true, fill: FILL_C, stroke: INK, sw: 1.4 }, { k: "poly", pts: [[32, 28], [52, 14], [58, 2], [40, 8]], closed: true, fill: FILL_C, stroke: INK, sw: 1.4 });
      return done();
    }
    if (/weather|water|earth|rock|fossil|landform|hazard|climate|geolog|atmosphere|ocean|sustain/.test(t)) {
      S.push({ k: "poly", pts: [[2, 52], [22, 18], [34, 36], [44, 24], [62, 52]], closed: true, fill: FILL_C, stroke: INK, sw: 1.4 });
      S.push({ k: "circle", cx: 50, cy: 10, r: 7, fill: FILL_B, stroke: "#d97706", sw: 1.3 });
      return done();
    }
    if (/force|motion|energy|electric|circuit|magnet|wave|light|sound|heat|machine|speed|kinemat|momentum|work_power|newton|physics/.test(t)) {
      S.push({ k: "poly", pts: [[34, 2], [12, 32], [28, 32], [22, 54], [50, 20], [34, 20]], closed: true, fill: FILL_B, stroke: INK, sw: 1.5 });
      return done();
    }
  }
  return subjectDoodle(subject);
}

/** Three faces for the "How did I do?" self-check. */
export function selfCheckFaces(): Visual {
  const shapes: Shape[] = [];
  const face = (cx: number, mood: 0 | 1 | 2, fill: string) => {
    shapes.push({ k: "circle", cx, cy: 16, r: 13, fill, stroke: INK, sw: 1.3 });
    shapes.push({ k: "circle", cx: cx - 4.5, cy: 12.5, r: 1.6, fill: INK }, { k: "circle", cx: cx + 4.5, cy: 12.5, r: 1.6, fill: INK });
    const y = 21;
    if (mood === 0) shapes.push({ k: "poly", pts: [[cx - 6, y - 1], [cx - 3, y + 2], [cx, y + 3], [cx + 3, y + 2], [cx + 6, y - 1]], stroke: INK, sw: 1.4 });
    if (mood === 1) shapes.push({ k: "line", x1: cx - 5, y1: y + 1, x2: cx + 5, y2: y + 1, stroke: INK, sw: 1.4 });
    if (mood === 2) shapes.push({ k: "poly", pts: [[cx - 6, y + 3], [cx - 3, y], [cx, y - 1], [cx + 3, y], [cx + 6, y + 3]], stroke: INK, sw: 1.4 });
  };
  face(16, 0, FILL_C); face(52, 1, FILL_B); face(88, 2, FILL_D);
  return { w: 104, h: 32, shapes, alt: "Happy, okay and unsure faces" };
}

export const VISUAL_PALE = PALE;
