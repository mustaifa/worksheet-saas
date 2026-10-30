/**
 * "Remember" boxes: small anchor charts shown at the top of a worksheet, the
 * way a teacher pins a reference chart on the wall — a place-value chart, a
 * fraction wall, the story mountain, parts of speech, the speed triangle…
 *
 * Charts explain a method or vocabulary; they are chosen so they support the
 * questions without simply answering them. Fixed per topic and grade band,
 * drawn from the shared primitives so they render on screen, in print and in
 * the PDF.
 */
import type { Shape, Visual } from "./worksheetVisuals";
import { clock, coin, sectorPts, angleArc } from "./worksheetVisuals";
import { ICONS, placeIcon } from "./icons";

export type AnchorChart = { title: string; visual: Visual };

const INK = "#1e293b", MUTED = "#475569", BLUE = "#1d4ed8", RED = "#dc2626";
const F = ["#bfdbfe", "#fde68a", "#bbf7d0", "#fbcfe8", "#ddd6fe", "#fed7aa", "#a5f3fc", "#fecaca"];
const W = 520;

// ---------------------------------------------------------------- helpers

const T = (x: number, y: number, t: string, size = 11, anchor: "start" | "middle" | "end" = "middle", bold = false, fill = INK): Shape => ({ k: "text", x, y, t, size, anchor, bold, fill });
const R = (x: number, y: number, w: number, h: number, fill: string, r = 6, stroke = INK, sw = 1.3): Shape => ({ k: "rect", x, y, w, h, r, fill, stroke, sw });
/** Font size that keeps `t` inside `maxW` px. */
const fit = (t: string, maxW: number, base: number, bold = false) => Math.min(base, maxW / (Math.max(1, t.length) * (bold ? 0.64 : 0.57)));
const Ln = (x1: number, y1: number, x2: number, y2: number, stroke = INK, sw = 1.4, dash = false): Shape => ({ k: "line", x1, y1, x2, y2, stroke, sw, dash });

function arrow(x1: number, y1: number, x2: number, y2: number, color = MUTED, sw = 1.6, head = 6): Shape[] {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (d: number, s: number): [number, number] => [x2 - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s, y2 - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s];
  return [Ln(x1, y1, x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6, color, sw), { k: "poly", pts: [[x2, y2], p(head, head * 0.55), p(head, -head * 0.55)], closed: true, fill: color, stroke: color, sw: 1 }];
}

/** Grid of cards: a bold heading and up to three short lines each. */
function cards(items: { head: string; lines?: string[]; fill?: string; headColor?: string }[], cols: number, cardH = 58): Visual {
  const gap = 8, cw = (W - gap * (cols - 1)) / cols, shapes: Shape[] = [];
  items.forEach((it, i) => {
    const x = (i % cols) * (cw + gap), y = Math.floor(i / cols) * (cardH + gap);
    shapes.push(R(x, y, cw, cardH, it.fill || F[i % F.length]));
    shapes.push(T(x + cw / 2, y + 17, it.head, fit(it.head, cw - 10, 12, true), "middle", true, it.headColor || INK));
    (it.lines || []).forEach((l, k) => shapes.push(T(x + cw / 2, y + 33 + k * 13, l, fit(l, cw - 8, 10), "middle", false, MUTED)));
  });
  const rows = Math.ceil(items.length / cols);
  return { w: W, h: rows * cardH + (rows - 1) * gap, shapes, alt: items.map((i) => i.head).join(", ") };
}

/** Boxes joined by arrows, in a row (or a loop back to the start). */
function flow(steps: { head: string; sub?: string }[], cycle = false, boxH = 46): Visual {
  const gap = 22, n = steps.length, bw = (W - gap * (n - 1)) / n, shapes: Shape[] = [];
  steps.forEach((s, i) => {
    const x = i * (bw + gap);
    shapes.push(R(x, 4, bw, boxH, F[i % F.length]));
    const words = s.head.split(" ");
    const two = s.head.length * 6.4 > bw - 6 && words.length > 1;
    if (two) {
      const mid = Math.ceil(words.length / 2);
      const a = words.slice(0, mid).join(" "), b = words.slice(mid).join(" ");
      shapes.push(T(x + bw / 2, 4 + (s.sub ? 16 : 21), a, fit(a, bw - 8, 11, true), "middle", true), T(x + bw / 2, 4 + (s.sub ? 28 : 34), b, fit(b, bw - 8, 11, true), "middle", true));
    } else shapes.push(T(x + bw / 2, 4 + (s.sub ? 20 : 28), s.head, fit(s.head, bw - 8, 11.5, true), "middle", true));
    if (s.sub) shapes.push(T(x + bw / 2, 4 + boxH - 8, s.sub, fit(s.sub, bw - 6, 9), "middle", false, MUTED));
    if (i < n - 1) shapes.push(...arrow(x + bw + 3, 4 + boxH / 2, x + bw + gap - 3, 4 + boxH / 2));
  });
  let h = boxH + 8;
  if (cycle) {
    const y = boxH + 16;
    shapes.push(Ln(W - bw / 2, boxH + 6, W - bw / 2, y, MUTED, 1.6), Ln(W - bw / 2, y, bw / 2, y, MUTED, 1.6), ...arrow(bw / 2, y, bw / 2, boxH + 8));
    h = y + 4;
  }
  return { w: W, h, shapes, alt: steps.map((s) => s.head).join(" → ") };
}

/** Formula triangle: cover the one you want. */
function formulaTriangle(top: string, left: string, right: string, notes: string[]): Visual {
  const shapes: Shape[] = [
    { k: "poly", pts: [[90, 6], [176, 140], [4, 140]], closed: true, fill: F[1], stroke: INK, sw: 1.8 },
    Ln(36, 92, 144, 92, INK, 1.6), Ln(90, 92, 90, 140, INK, 1.6),
    T(90, 72, top, 20, "middle", true), T(56, 124, left, 18, "middle", true), T(124, 124, right, 18, "middle", true),
  ];
  notes.forEach((n, i) => shapes.push(T(200, 34 + i * 24, n, 13, "start", i === 0, i === 0 ? BLUE : INK)));
  return { w: W, h: 146, shapes, alt: `Formula triangle: ${notes.join("; ")}` };
}

function icon(word: string, x: number, y: number, size: number): Shape[] {
  const ic = ICONS[word];
  return ic ? placeIcon(ic, x, y, size) : [];
}

// ---------------------------------------------------------------- math charts

function placeValue(grade: number, decimal: boolean): AnchorChart {
  const cols = decimal ? ["Tens", "Ones", ".", "Tenths", "Hundredths", "Thousandths"]
    : grade <= 1 ? ["Tens", "Ones"] : grade <= 3 ? ["Thousands", "Hundreds", "Tens", "Ones"] : ["Hundred thousands", "Ten thousands", "Thousands", "Hundreds", "Tens", "Ones"];
  const digits = decimal ? ["2", "3", ".", "4", "7", "5"] : grade <= 1 ? ["4", "7"] : grade <= 3 ? ["5", "3", "8", "2"] : ["7", "4", "6", "3", "1", "9"];
  const shapes: Shape[] = [];
  const dotW = 16, n = cols.length, cw = (W - (decimal ? dotW : 0)) / (n - (decimal ? 1 : 0));
  let x = 0;
  cols.forEach((c, i) => {
    if (c === ".") { shapes.push(T(x + dotW / 2, 74, ".", 26, "middle", true)); x += dotW; return; }
    shapes.push(R(x, 4, cw - 4, 34, F[i % F.length], 4), R(x, 42, cw - 4, 40, "#fff", 4));
    const words = c.split(" ");
    if (words.length > 1 && c.length > 11) { shapes.push(T(x + (cw - 4) / 2, 18, words[0], 10, "middle", true), T(x + (cw - 4) / 2, 31, words.slice(1).join(" "), 10, "middle", true)); }
    else shapes.push(T(x + (cw - 4) / 2, 26, c, 11, "middle", true));
    shapes.push(T(x + (cw - 4) / 2, 72, digits[i], 22, "middle", true, BLUE));
    x += cw;
  });
  const num = digits.join("").replace(/^0+/, "");
  const shown = decimal ? num : Number(num).toLocaleString("en-US");
  shapes.push(T(W / 2, 104, `${shown}: each place is worth ten times the place to its right`, 11, "middle", false, MUTED));
  return { title: "Place value", visual: { w: W, h: 110, shapes, alt: `Place-value chart showing ${shown}` } };
}

function fractionWall(): AnchorChart {
  const shapes: Shape[] = [];
  const dens = [1, 2, 3, 4, 6, 8], rowH = 22;
  dens.forEach((d, r) => {
    const y = r * (rowH + 3), cw = W / d;
    for (let i = 0; i < d; i++) {
      shapes.push({ k: "rect", x: i * cw, y, w: cw, h: rowH, fill: F[r], stroke: INK, sw: 1.1 });
      shapes.push(T(i * cw + cw / 2, y + 15, d === 1 ? "1 whole" : `1/${d}`, 10.5, "middle", true));
    }
  });
  return { title: "Fraction wall", visual: { w: W, h: dens.length * (rowH + 3), shapes, alt: "A fraction wall showing wholes, halves, thirds, quarters, sixths and eighths" } };
}

function orderOps(grade: number): AnchorChart {
  return {
    title: "Order of operations",
    visual: flow([
      { head: "( ) Brackets", sub: "inside first" },
      ...(grade >= 6 ? [{ head: "x² Exponents", sub: "powers & roots" }] : []),
      { head: "× ÷", sub: "left to right" },
      { head: "+ −", sub: "left to right" },
    ]),
  };
}

function anglesOnLine(): AnchorChart {
  const shapes: Shape[] = [];
  const kinds: [string, number, string][] = [["acute", 50, "less than 90°"], ["right", 90, "exactly 90°"], ["obtuse", 130, "between 90° and 180°"], ["straight", 180, "exactly 180°"]];
  kinds.forEach(([name, deg, note], i) => {
    const cx = 30 + i * 130, cy = 70, r = 50;
    shapes.push(Ln(cx, cy, cx + r, cy, INK, 2), Ln(cx, cy, cx + Math.cos((deg * Math.PI) / 180) * r, cy - Math.sin((deg * Math.PI) / 180) * r, INK, 2));
    if (deg === 90) shapes.push(R(cx, cy - 10, 10, 10, "none", 0, BLUE, 1.2));
    else shapes.push(angleArc(cx, cy, 16, 0, deg, BLUE));
    if (deg === 180) shapes.push(Ln(cx - r * 0.6, cy, cx, cy, INK, 2));
    shapes.push(T(cx + 18, cy + 22, name, 12, "middle", true), T(cx + 18, cy + 36, note, 9.5, "middle", false, MUTED));
  });
  return { title: "Types of angles", visual: { w: W, h: 112, shapes, alt: "Acute, right, obtuse and straight angles" } };
}

function anglePairs(): AnchorChart {
  return {
    title: "Angle pairs",
    visual: cards([
      { head: "Complementary", lines: ["add up to 90°", "30° + 60° = 90°"] },
      { head: "Supplementary", lines: ["add up to 180°", "120° + 60° = 180°"] },
      { head: "Vertical", lines: ["opposite when lines cross", "they are equal"] },
    ], 3),
  };
}

function parallelAngles(): AnchorChart {
  return {
    title: "Parallel lines and a transversal",
    visual: cards([
      { head: "Corresponding", lines: ["same position", "equal"] },
      { head: "Alternate interior", lines: ["inside, opposite sides", "equal"] },
      { head: "Same-side interior", lines: ["inside, same side", "add up to 180°"] },
    ], 3),
  };
}

function triangleSum(): AnchorChart {
  const shapes: Shape[] = [{ k: "poly", pts: [[10, 100], [170, 100], [60, 14]], closed: true, fill: F[3], stroke: INK, sw: 1.8 }];
  shapes.push(T(34, 94, "a", 13, "middle", true, BLUE), T(150, 94, "b", 13, "middle", true, BLUE), T(62, 40, "c", 13, "middle", true, BLUE));
  shapes.push(T(200, 44, "a + b + c = 180°", 15, "start", true, BLUE), T(200, 68, "The three angles of any triangle", 11, "start"), T(200, 84, "always add up to 180°.", 11, "start"));
  shapes.push(T(200, 104, "Exterior angle = sum of the two far angles", 11, "start", false, MUTED));
  return { title: "Angles in a triangle", visual: { w: W, h: 110, shapes, alt: "The angles of a triangle add up to 180 degrees" } };
}

function areaFormulas(grade: number): AnchorChart {
  const shapes: Shape[] = [];
  const items: [string, string, Shape[]][] = [
    ["Rectangle", "A = l × w", [R(20, 10, 80, 50, F[0], 0)]],
    ["Perimeter", "P = add all sides", [R(150, 10, 80, 50, "none", 0, BLUE, 2.4)]],
    ["Triangle", "A = ½ × b × h", [{ k: "poly", pts: [[280, 60], [360, 60], [300, 10]], closed: true, fill: F[1], stroke: INK, sw: 1.4 }, Ln(300, 10, 300, 60, RED, 1.2, true)]],
  ];
  if (grade >= 6) items.push(["Parallelogram", "A = b × h", [{ k: "poly", pts: [[410, 60], [490, 60], [510, 10], [430, 10]], closed: true, fill: F[2], stroke: INK, sw: 1.4 }, Ln(430, 10, 430, 60, RED, 1.2, true)]]);
  items.forEach(([name, f, sh], i) => {
    shapes.push(...sh);
    const cx = [60, 190, 320, 460][i];
    shapes.push(T(cx, 80, name, 11.5, "middle", true), T(cx, 96, f, 11.5, "middle", false, BLUE));
  });
  return { title: "Area and perimeter", visual: { w: W, h: 102, shapes, alt: "Area formulas for rectangles, triangles and parallelograms" } };
}

function volumeFormulas(grade: number): AnchorChart {
  const items = [{ head: "Rectangular prism", lines: ["V = l × w × h"] }];
  if (grade >= 7) items.push({ head: "Cylinder", lines: ["V = πr²h"] });
  if (grade >= 8) items.push({ head: "Cone", lines: ["V = ⅓πr²h"] }, { head: "Sphere", lines: ["V = 4⁄3πr³"] });
  if (grade <= 6) items.push({ head: "Cubic units", lines: ["volume = cubes that fill it", "cm³, m³, in³"] });
  return { title: "Volume", visual: cards(items, items.length, 48) };
}

function circleParts(): AnchorChart {
  const cx = 70, cy = 62, r = 54, shapes: Shape[] = [{ k: "circle", cx, cy, r, fill: F[0], stroke: INK, sw: 1.8 }, { k: "circle", cx, cy, r: 2.5, fill: INK }];
  shapes.push(Ln(cx, cy, cx + r, cy, RED, 2), T(cx + r / 2, cy - 5, "r", 12, "middle", true, RED));
  shapes.push(Ln(cx - r * 0.7, cy + r * 0.7, cx + r * 0.7, cy - r * 0.7, BLUE, 1.6), T(cx - 22, cy + 30, "d", 12, "middle", true, BLUE));
  ["Radius r: centre to edge", "Diameter d = 2r", "Circumference C = 2πr = πd", "Area A = πr²", "Sector = (angle ÷ 360) × πr²"].forEach((t, i) => shapes.push(T(150, 20 + i * 21, t, 12, "start", i >= 2)));
  return { title: "Circles", visual: { w: W, h: 120, shapes, alt: "Parts of a circle with formulas" } };
}

function coordinatePlane(q1Only: boolean): AnchorChart {
  const shapes: Shape[] = [];
  if (q1Only) {
    const o = 20, s = 14;
    for (let i = 0; i <= 6; i++) shapes.push(Ln(o + i * s, 6, o + i * s, 6 + 6 * s, "#e2e8f0", 0.8), Ln(o, 6 + i * s, o + 6 * s, 6 + i * s, "#e2e8f0", 0.8));
    shapes.push(Ln(o, 6 + 6 * s, o + 6 * s + 6, 6 + 6 * s, INK, 1.6), Ln(o, 6 + 6 * s, o, 0, INK, 1.6));
    shapes.push(...arrow(o, 6 + 6 * s - 2, o + 4 * s, 6 + 6 * s - 2, RED, 2), ...arrow(o + 4 * s, 6 + 6 * s, o + 4 * s, 6 + 3 * s + 2, BLUE, 2), { k: "circle", cx: o + 4 * s, cy: 6 + 3 * s, r: 4, fill: INK });
    shapes.push(T(o + 4 * s + 8, 6 + 3 * s - 6, "(4, 3)", 12, "start", true));
    shapes.push(T(150, 30, "(x, y): go ACROSS first, then UP.", 13, "start", true, BLUE), T(150, 54, "x = how far across (along the bottom)", 11.5, "start"), T(150, 74, "y = how far up", 11.5, "start"), T(150, 94, "Start every point at the origin (0, 0).", 11.5, "start", false, MUTED));
    return { title: "Plotting points", visual: { w: W, h: 100, shapes, alt: "Plotting the point (4, 3)" } };
  }
  const cx = 70, cy = 60;
  shapes.push(Ln(10, cy, 130, cy, INK, 1.6), Ln(cx, 2, cx, 118, INK, 1.6));
  [["II", "(−, +)", 38, 34], ["I", "(+, +)", 102, 34], ["III", "(−, −)", 38, 92], ["IV", "(+, −)", 102, 92]].forEach(([q, s, x, y]) => { shapes.push(T(+x, +y, String(q), 13, "middle", true, BLUE), T(+x, +y + 14, String(s), 10, "middle", false, MUTED)); });
  ["Quadrants are numbered anticlockwise from I.", "Reflect over the x-axis: (x, y) → (x, −y)", "Reflect over the y-axis: (x, y) → (−x, y)", "Translate: add to x (right) and y (up)"].forEach((t, i) => shapes.push(T(150, 26 + i * 22, t, 11.5, "start", i === 0)));
  return { title: "The coordinate plane", visual: { w: W, h: 120, shapes, alt: "The four quadrants of the coordinate plane" } };
}

function slopeChart(): AnchorChart {
  const shapes: Shape[] = [];
  const o = 10, s = 13;
  for (let i = 0; i <= 8; i++) shapes.push(Ln(o + i * s, 4, o + i * s, 4 + 8 * s, "#e2e8f0", 0.8), Ln(o, 4 + i * s, o + 8 * s, 4 + i * s, "#e2e8f0", 0.8));
  const P = (x: number, y: number): [number, number] => [o + x * s, 4 + (8 - y) * s];
  shapes.push(Ln(...P(0, 1), ...P(7, 8), BLUE, 2.2));
  shapes.push(Ln(...P(1, 2), ...P(5, 2), RED, 1.6, true), Ln(...P(5, 2), ...P(5, 6), RED, 1.6, true));
  shapes.push(T(P(3, 2)[0], P(3, 2)[1] + 13, "run", 10, "middle", true, RED), T(P(5, 4)[0] + 6, P(5, 4)[1], "rise", 10, "start", true, RED));
  ["slope m = rise ÷ run", "m = (y₂ − y₁) ÷ (x₂ − x₁)", "y = mx + b   (b = y-intercept)", "Parallel: same slope", "Perpendicular: slopes multiply to −1"].forEach((t, i) => shapes.push(T(140, 22 + i * 21, t, 12, "start", i < 3, i < 3 ? BLUE : INK)));
  return { title: "Slope and lines", visual: { w: W, h: 112, shapes, alt: "A line with rise and run marked, and slope formulas" } };
}

function integerRules(): AnchorChart {
  const shapes: Shape[] = [];
  const y = 24, x0 = 10, step = 22;
  shapes.push(Ln(x0 - 6, y, x0 + 10 * step + 6, y, INK, 1.6));
  for (let v = -5; v <= 5; v++) {
    const x = x0 + (v + 5) * step;
    shapes.push(Ln(x, y - 5, x, y + 5, INK, 1.2), T(x, y + 18, String(v).replace("-", "−"), 10, "middle", v === 0, v < 0 ? RED : v > 0 ? BLUE : INK));
  }
  shapes.push(T(x0 + 2.5 * step, y - 10, "negative", 10, "middle", false, RED), T(x0 + 7.5 * step, y - 10, "positive", 10, "middle", false, BLUE));
  ["+ × + = +     − × − = +", "+ × − = −     − × + = −", "a − (−b) = a + b", "|−5| = 5 (distance from 0)"].forEach((t, i) => shapes.push(T(270, 20 + i * 22, t, 12, "start", i < 2, i < 2 ? BLUE : INK)));
  return { title: "Integers", visual: { w: W, h: 100, shapes, alt: "Number line from −5 to 5 and sign rules" } };
}

function percentStrip(): AnchorChart {
  const rows: [string, string, string, number][] = [["1/2", "0.5", "50%", 0.5], ["1/4", "0.25", "25%", 0.25], ["3/4", "0.75", "75%", 0.75], ["1/5", "0.2", "20%", 0.2], ["1/10", "0.1", "10%", 0.1]];
  const shapes: Shape[] = [];
  rows.forEach(([f, d, p, v], i) => {
    const y = i * 20;
    shapes.push({ k: "rect", x: 0, y, w: 200, h: 15, fill: "#fff", stroke: INK, sw: 1 }, { k: "rect", x: 0, y, w: 200 * v, h: 15, fill: F[i], stroke: INK, sw: 1 });
    shapes.push(T(240, y + 12, f, 12, "middle", true), T(310, y + 12, "=", 12), T(370, y + 12, d, 12, "middle", true), T(420, y + 12, "=", 12), T(475, y + 12, p, 12, "middle", true, BLUE));
  });
  return { title: "Fractions, decimals and percents", visual: { w: W, h: rows.length * 20, shapes, alt: "Equivalent fractions, decimals and percents" } };
}

function statsChart(): AnchorChart {
  const data = [2, 3, 3, 5, 7];
  const shapes: Shape[] = [];
  data.forEach((v, i) => { shapes.push(R(i * 36, 4, 30, 30, i === 2 ? F[1] : F[0], 4), T(i * 36 + 15, 25, String(v), 15, "middle", true)); });
  shapes.push(T(90, 52, "in order, smallest to largest", 10, "middle", false, MUTED));
  ["Mean = total ÷ count = 20 ÷ 5 = 4", "Median = middle value = 3", "Mode = most often = 3", "Range = largest − smallest = 7 − 2 = 5"].forEach((t, i) => shapes.push(T(200, 18 + i * 20, t, 11.5, "start", false)));
  return { title: "Mean, median, mode and range", visual: { w: W, h: 92, shapes, alt: "Data 2, 3, 3, 5, 7 with mean 4, median 3, mode 3, range 5" } };
}

function unitLadder(grade: number): AnchorChart {
  const steps = grade <= 3
    ? [{ head: "1 m", sub: "= 100 cm" }, { head: "1 kg", sub: "= 1,000 g" }, { head: "1 L", sub: "= 1,000 mL" }, { head: "1 hour", sub: "= 60 minutes" }]
    : [{ head: "km", sub: "× 1,000 → m" }, { head: "m", sub: "× 100 → cm" }, { head: "cm", sub: "× 10 → mm" }, { head: "1 ft = 12 in", sub: "1 yd = 3 ft" }, { head: "1 lb = 16 oz", sub: "1 gal = 4 qt" }];
  return { title: grade <= 3 ? "Units to remember" : "Converting units: big → small, multiply", visual: grade <= 3 ? cards(steps.map((s) => ({ head: s.head, lines: [s.sub] })), 4, 46) : flow(steps) };
}

function exponentRules(): AnchorChart {
  return {
    title: "Exponent rules",
    visual: cards([
      { head: "aᵐ × aⁿ = aᵐ⁺ⁿ", lines: ["same base: add powers"] },
      { head: "aᵐ ÷ aⁿ = aᵐ⁻ⁿ", lines: ["same base: subtract"] },
      { head: "(aᵐ)ⁿ = aᵐⁿ", lines: ["power of a power"] },
      { head: "a⁰ = 1", lines: ["any non-zero base"] },
      { head: "a⁻ⁿ = 1 ÷ aⁿ", lines: ["negative = reciprocal"] },
      { head: "3.2 × 10⁴", lines: ["scientific notation", "1 ≤ number < 10"] },
    ], 3, 50),
  };
}

function trigChart(withPythag: boolean): AnchorChart {
  const shapes: Shape[] = [{ k: "poly", pts: [[10, 110], [170, 110], [170, 14]], closed: true, fill: F[1], stroke: INK, sw: 1.8 }, R(158, 98, 12, 12, "none", 0, INK, 1)];
  shapes.push(angleArc(10, 110, 26, 0, 31, RED), T(44, 104, "θ", 13, "middle", true, RED));
  shapes.push(T(90, 126, withPythag ? "a (adjacent)" : "adjacent", 11, "middle", true, BLUE), T(178, 66, withPythag ? "b (opposite)" : "opposite", 11, "start", true, BLUE), T(78, 54, withPythag ? "c (hypotenuse)" : "hypotenuse", 11, "end", true, BLUE));
  const lines = withPythag
    ? ["a² + b² = c²", "c is the longest side,", "opposite the right angle.", "sin θ = opp ÷ hyp   (SOH)", "cos θ = adj ÷ hyp   (CAH)", "tan θ = opp ÷ adj   (TOA)"]
    : ["SOH  sin θ = opposite ÷ hypotenuse", "CAH  cos θ = adjacent ÷ hypotenuse", "TOA  tan θ = opposite ÷ adjacent"];
  lines.forEach((t, i) => shapes.push(T(296, 22 + i * 19, t, withPythag ? 11.5 : 10.8, "start", i === 0)));
  const moved = shapes.map((sh): Shape => sh.k === "text" && sh.x >= 296 ? sh : sh.k === "text" ? { ...sh, x: sh.x + 34 } : sh.k === "poly" ? { ...sh, pts: sh.pts.map(([a, b]) => [a + 34, b] as [number, number]) } : sh.k === "rect" ? { ...sh, x: sh.x + 34 } : sh);
  return { title: withPythag ? "Right triangles" : "SOH CAH TOA", visual: { w: W, h: 132, shapes: moved, alt: "A right triangle with sides labelled and trig ratios" } };
}

function clockChart(): AnchorChart {
  const shapes: Shape[] = [...clock(3, 0, 120)];
  const cx = 60;
  shapes.push(T(cx + 72, 36, "o'clock", 10, "start", true, BLUE), T(cx + 72, 64, "quarter past", 10, "start", true, BLUE), T(cx + 40, 132, "half past", 10, "start", true, BLUE), T(cx - 72, 64, "quarter to", 10, "end", true, BLUE));
  ["The short hand shows the hour.", "The long hand shows the minutes.", "Each number on the clock = 5 minutes.", "60 minutes = 1 hour"].forEach((t, i) => shapes.push(T(250, 30 + i * 22, t, 12, "start", i < 2)));
  return { title: "Telling the time", visual: { w: W, h: 138, shapes, alt: "A clock face with o'clock, quarter past, half past and quarter to" } };
}

function coinsChart(): AnchorChart {
  const shapes: Shape[] = [];
  const cs: [string, string, number, string][] = [["1¢", "penny", 15, "#fdba74"], ["5¢", "nickel", 18, "#e2e8f0"], ["10¢", "dime", 13, "#e2e8f0"], ["25¢", "quarter", 21, "#e2e8f0"], ["$1", "dollar", 0, ""]];
  cs.forEach(([v, n, r, f], i) => {
    const x = 50 + i * 105;
    if (r) shapes.push(...coin(x, 30, v, r, f)); else shapes.push(R(x - 34, 12, 68, 36, "#bbf7d0", 4), T(x, 36, "$1", 14, "middle", true));
    shapes.push(T(x, 70, n, 12, "middle", true), T(x, 86, n === "dollar" ? "= 100¢" : `= ${v}`, 11, "middle", false, MUTED));
  });
  return { title: "Coins", visual: { w: W, h: 92, shapes, alt: "Penny, nickel, dime, quarter and dollar values" } };
}

function parabolaChart(): AnchorChart {
  const shapes: Shape[] = [];
  const o = 10, s = 12, P = (x: number, y: number): [number, number] => [o + (x + 1) * s, 6 + (6 - y) * s];
  shapes.push(Ln(o, P(0, 0)[1], o + 9 * s, P(0, 0)[1], INK, 1.3), Ln(P(0, 0)[0], 2, P(0, 0)[0], 6 + 9 * s, INK, 1.3));
  const pts: [number, number][] = [];
  for (let x = -0.6; x <= 6.6; x += 0.2) pts.push(P(x, (x - 3) ** 2 / 1.5 - 3 + 0.0));
  shapes.push({ k: "poly", pts: pts.filter(([, y]) => y >= 0 && y <= 6 + 9 * s), stroke: BLUE, sw: 2.2 });
  shapes.push(Ln(P(3, 0)[0], 2, P(3, 0)[0], 6 + 9 * s, RED, 1.2, true), { k: "circle", cx: P(3, -3)[0], cy: P(3, -3)[1], r: 3.5, fill: RED });
  const root = 3 - Math.sqrt(4.5);
  shapes.push({ k: "circle", cx: P(root, 0)[0], cy: P(root, 0)[1], r: 3.5, fill: "#16a34a" }, { k: "circle", cx: P(6 - root, 0)[0], cy: P(6 - root, 0)[1], r: 3.5, fill: "#16a34a" });
  [["vertex (lowest point)", RED], ["axis of symmetry (dashed)", RED], ["roots / zeros (green)", "#16a34a"], ["x = (−b ± √(b² − 4ac)) ÷ 2a", BLUE], ["discriminant b² − 4ac: how many roots", INK]].forEach(([t, c], i) => shapes.push(T(150, 22 + i * 20, t, 11.5, "start", i === 3, c)));
  return { title: "Quadratics", visual: { w: W, h: 118, shapes, alt: "A parabola with vertex, axis of symmetry and roots, and the quadratic formula" } };
}

function arrayChart(): AnchorChart {
  const shapes: Shape[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) shapes.push({ k: "circle", cx: 20 + c * 26, cy: 18 + r * 26, r: 9, fill: F[r], stroke: INK, sw: 1.1 });
  shapes.push(T(58, 98, "3 rows of 4", 11, "middle", true));
  ["3 × 4 = 12", "4 × 3 = 12", "12 ÷ 3 = 4", "12 ÷ 4 = 3"].forEach((t, i) => shapes.push(T(150 + (i % 2) * 130, 34 + Math.floor(i / 2) * 30, t, 15, "start", true, i < 2 ? BLUE : RED)));
  shapes.push(T(150, 96, "A fact family: multiplication and division undo each other.", 10.5, "start", false, MUTED));
  return { title: "Multiplication and division", visual: { w: W, h: 104, shapes, alt: "An array of 3 rows of 4 and its fact family" } };
}

function longDivision(): AnchorChart {
  return { title: "Long division steps", visual: flow([{ head: "Divide", sub: "how many times?" }, { head: "Multiply", sub: "write it below" }, { head: "Subtract", sub: "find what's left" }, { head: "Bring down", sub: "the next digit" }], true) };
}

function roundingChart(): AnchorChart {
  const shapes: Shape[] = [];
  const x0 = 10, y = 30, step = 46;
  shapes.push(Ln(x0, y, x0 + 10 * step, y, INK, 1.6));
  for (let i = 0; i <= 10; i++) shapes.push(Ln(x0 + i * step, y - (i % 5 ? 5 : 9), x0 + i * step, y + (i % 5 ? 5 : 9), INK, 1.3), T(x0 + i * step, y + 22, String(60 + i), 10.5, "middle", i % 10 === 0 || i === 5));
  shapes.push(...arrow(x0 + 7 * step, y - 14, x0 + 10 * step - 4, y - 14, BLUE, 1.8), { k: "circle", cx: x0 + 7 * step, cy: y, r: 5, fill: BLUE });
  shapes.push(T(W / 2, 72, "67 is closer to 70 than to 60, so 67 rounds to 70.", 11.5, "middle", true), T(W / 2, 90, "Look at the digit to the right: 5 or more → round up; 4 or less → round down.", 10.5, "middle", false, MUTED));
  return { title: "Rounding", visual: { w: W, h: 96, shapes, alt: "Number line from 60 to 70 showing 67 rounding to 70" } };
}

function probabilityLine(): AnchorChart {
  const shapes: Shape[] = [];
  shapes.push({ k: "rect", x: 10, y: 20, w: 500, h: 14, r: 7, fill: "#e0f2fe", stroke: INK, sw: 1.2 });
  [[0, "0", "impossible"], [0.25, "1/4", "unlikely"], [0.5, "1/2", "even chance"], [0.75, "3/4", "likely"], [1, "1", "certain"]].forEach(([v, f, w]) => {
    const x = 10 + +v * 500;
    const anc = +v === 0 ? "start" : +v === 1 ? "end" : "middle";
    shapes.push(Ln(x, 14, x, 40, INK, 1.4), T(x, 54, String(f), 11.5, anc, true, BLUE), T(x, 70, String(w), 10, anc, false, MUTED));
  });
  shapes.push(T(W / 2, 92, "P(event) = favourable outcomes ÷ total outcomes", 12, "middle", true));
  return { title: "Probability", visual: { w: W, h: 98, shapes, alt: "Probability scale from 0 impossible to 1 certain" } };
}

function ratioTable(): AnchorChart {
  const shapes: Shape[] = [];
  const cols = [["2", "3"], ["4", "6"], ["6", "9"], ["8", "12"]];
  shapes.push(R(0, 4, 90, 26, F[0], 3), R(0, 34, 90, 26, F[1], 3), T(45, 22, "cups flour", 10.5, "middle", true), T(45, 52, "cups milk", 10.5, "middle", true));
  cols.forEach(([a, b], i) => { shapes.push(R(96 + i * 54, 4, 50, 26, "#fff", 3), R(96 + i * 54, 34, 50, 26, "#fff", 3), T(121 + i * 54, 22, a, 13, "middle", true), T(121 + i * 54, 52, b, 13, "middle", true)); });
  ["Equivalent ratios: multiply or divide", "both numbers by the same number.", "2 : 3 = 4 : 6 = 6 : 9", "Unit rate = amount for 1"].forEach((t, i) => shapes.push(T(330, 18 + i * 17, t, 10.5, "start", i === 2, i === 2 ? BLUE : INK)));
  return { title: "Ratios", visual: { w: W, h: 76, shapes, alt: "A ratio table of equivalent ratios 2:3, 4:6, 6:9, 8:12" } };
}

function comparingSymbols(): AnchorChart {
  return { title: "Comparing numbers", visual: cards([{ head: "<", lines: ["less than", "3 < 8"] }, { head: ">", lines: ["greater than", "9 > 4"] }, { head: "=", lines: ["equal to", "5 = 5"] }, { head: "Tip", lines: ["the open mouth faces", "the bigger number"] }], 4, 56) };
}

function inequalityLine(): AnchorChart {
  const shapes: Shape[] = [];
  const line = (y: number, x: number, closed: boolean, right: boolean, label: string) => {
    shapes.push(Ln(10, y, 230, y, INK, 1.4));
    shapes.push(Ln(x, y, right ? 226 : 14, y, BLUE, 4));
    shapes.push({ k: "circle", cx: x, cy: y, r: 6, fill: closed ? BLUE : "#fff", stroke: BLUE, sw: 2 });
    shapes.push(T(250, y + 4, label, 12, "start", true));
  };
  line(18, 100, false, true, "x > 3   open circle: 3 is not included");
  line(52, 100, true, false, "x ≤ 3   closed circle: 3 is included");
  shapes.push(T(10, 86, "Flip the sign if you multiply or divide both sides by a negative number.", 11, "start", false, RED));
  return { title: "Inequalities", visual: { w: W, h: 92, shapes, alt: "Open and closed circles on number lines" } };
}

function functionMachine(): AnchorChart {
  const shapes: Shape[] = [R(0, 20, 70, 40, F[0]), T(35, 45, "input x", 11, "middle", true), ...arrow(74, 40, 120, 40), R(124, 8, 140, 64, F[1], 10), T(194, 36, "rule", 11, "middle", false, MUTED), T(194, 56, "f(x) = 2x + 1", 13, "middle", true, BLUE), ...arrow(268, 40, 314, 40), R(318, 20, 80, 40, F[2]), T(358, 45, "output", 11, "middle", true)];
  shapes.push(T(410, 34, "x = 3 → 7", 11.5, "start"), T(410, 54, "x = 5 → 11", 11.5, "start"));
  return { title: "Functions", visual: { w: W, h: 80, shapes, alt: "A function machine: input, rule f(x) = 2x + 1, output" } };
}

function balanceChart(): AnchorChart {
  const shapes: Shape[] = [{ k: "poly", pts: [[110, 100], [130, 70], [150, 100]], closed: true, fill: F[1], stroke: INK, sw: 1.4 }, Ln(30, 70, 230, 70, INK, 3)];
  shapes.push(R(40, 44, 70, 26, F[0], 4), T(75, 62, "x + 4", 13, "middle", true), R(150, 44, 70, 26, F[2], 4), T(185, 62, "10", 13, "middle", true));
  ["An equation is a balance.", "Do the same to both sides:", "x + 4 = 10", "x + 4 − 4 = 10 − 4", "x = 6     Check: 6 + 4 = 10 ✓"].forEach((t, i) => shapes.push(T(260, 20 + i * 20, t, 12, "start", i < 2, i >= 2 ? BLUE : INK)));
  return { title: "Solving equations", visual: { w: W, h: 106, shapes, alt: "A balance scale: x + 4 balances 10" } };
}

function makeTen(): AnchorChart {
  const shapes: Shape[] = [];
  const c = 24;
  for (let i = 0; i < 10; i++) {
    const x = 6 + (i % 5) * c, y = 6 + Math.floor(i / 5) * c;
    shapes.push({ k: "rect", x, y, w: c, h: c, fill: "#fff", stroke: INK, sw: 1.2 }, { k: "circle", cx: x + c / 2, cy: y + c / 2, r: 8, fill: i < 8 ? F[0] : F[3], stroke: INK, sw: 1 });
  }
  shapes.push(T(160, 26, "8 + 5 = ?", 14, "start", true), T(160, 46, "8 + 2 = 10 (fill the ten)", 12, "start", false, BLUE), T(160, 66, "10 + 3 = 13", 12, "start", true, BLUE));
  return { title: "Make a ten", visual: { w: W, h: 70, shapes, alt: "A ten frame with 8 and 2 filling it" } };
}

// ---------------------------------------------------------------- English charts

function storyMountain(grade: number): AnchorChart {
  if (grade <= 3) {
    return { title: "Parts of a story", visual: cards([{ head: "Characters", lines: ["who is in it"] }, { head: "Setting", lines: ["where and when"] }, { head: "Problem", lines: ["what goes wrong"] }, { head: "Solution", lines: ["how it is fixed"] }], 4, 50) };
  }
  const shapes: Shape[] = [{ k: "poly", pts: [[10, 112], [110, 112], [260, 18], [380, 92], [510, 92]], stroke: BLUE, sw: 3 }];
  const pts: [number, number, string, string][] = [[60, 112, "Exposition", "characters, setting"], [185, 66, "Rising action", "problems build"], [260, 18, "Climax", "turning point"], [320, 56, "Falling action", "things settle"], [455, 92, "Resolution", "how it ends"]];
  const lab: [number, number][] = [[60, 132], [120, 52], [260, -4], [400, 34], [455, 112]];
  pts.forEach(([x, y, a, b], i) => { const [lx, ly] = lab[i]; shapes.push({ k: "circle", cx: x, cy: y, r: 4.5, fill: RED }, T(lx, ly, a, 11.5, "middle", true), T(lx, ly + 13, b, 9.5, "middle", false, MUTED)); });
  const down = shapes.map((sh): Shape => sh.k === "text" ? { ...sh, y: sh.y + 24 } : sh.k === "circle" ? { ...sh, cy: sh.cy + 24 } : sh.k === "poly" ? { ...sh, pts: sh.pts.map(([px, py]) => [px, py + 24] as [number, number]) } : sh);
  return { title: "The story mountain (plot)", visual: { w: W, h: 162, shapes: down, alt: "Plot diagram: exposition, rising action, climax, falling action, resolution" } };
}

function partsOfSpeech(grade: number): AnchorChart {
  const items = [
    { head: "Noun", lines: ["person, place, thing", "dog, school, Mia"] },
    { head: "Verb", lines: ["action or being", "run, eat, is"] },
    { head: "Adjective", lines: ["describes a noun", "red, tall, happy"] },
  ];
  if (grade >= 3) items.push({ head: "Adverb", lines: ["describes a verb", "quickly, often"] });
  if (grade >= 2) items.push({ head: "Pronoun", lines: ["takes a noun's place", "he, she, they, it"] });
  if (grade >= 4) items.push({ head: "Preposition", lines: ["where or when", "under, after, on"] });
  return { title: "Parts of speech", visual: cards(items, items.length > 4 ? 3 : items.length, 54) };
}

function punctuationChart(grade: number): AnchorChart {
  const items = [
    { head: ".", lines: ["full stop / period", "ends a statement"] },
    { head: "?", lines: ["question mark", "ends a question"] },
    { head: "!", lines: ["exclamation mark", "shows strong feeling"] },
    { head: ",", lines: ["comma", "lists, pauses"] },
  ];
  if (grade >= 3) items.push({ head: "“ ”", lines: ["quotation marks", "around spoken words"] }, { head: "’", lines: ["apostrophe", "don't, Sam's"] });
  if (grade >= 8) items.push({ head: ";", lines: ["semicolon", "joins two sentences"] }, { head: ":", lines: ["colon", "introduces a list"] });
  return { title: "Punctuation marks", visual: cards(items, items.length > 4 ? (items.length > 6 ? 4 : 3) : 4, 52) };
}

function capitalsChart(): AnchorChart {
  return { title: "Capital letters", visual: cards([{ head: "Sentence start", lines: ["The dog ran."] }, { head: "Names", lines: ["Mia, London, Nile"] }, { head: "The word I", lines: ["Mum and I went."] }, { head: "Days & months", lines: ["Monday, July"] }], 4, 50) };
}

function pointOfView(): AnchorChart {
  return {
    title: "Point of view",
    visual: cards([
      { head: "First person", lines: ["the narrator is in the story", "I, me, my, we, us"] },
      { head: "Second person", lines: ["talks to the reader", "you, your"] },
      { head: "Third person", lines: ["an outside narrator", "he, she, they, it"] },
    ], 3, 60),
  };
}

function textStructures(): AnchorChart {
  const shapes: Shape[] = [];
  const cw = 100, xs = [0, 105, 210, 315, 420];
  const names = ["Sequence", "Compare", "Cause → effect", "Problem → solution", "Description"];
  xs.forEach((x, i) => { shapes.push(R(x, 0, cw, 96, "#f8fafc", 6, "#cbd5e1", 1)); shapes.push(T(x + cw / 2, 88, names[i], 10, "middle", true)); });
  // sequence
  [0, 1, 2].forEach((k) => { shapes.push(R(8 + k * 30, 22, 24, 24, F[k], 4), T(20 + k * 30, 39, String(k + 1), 12, "middle", true)); });
  // compare (Venn)
  shapes.push({ k: "circle", cx: 140, cy: 40, r: 24, fill: "none", stroke: BLUE, sw: 1.6 }, { k: "circle", cx: 170, cy: 40, r: 24, fill: "none", stroke: RED, sw: 1.6 });
  // cause effect
  shapes.push(R(218, 26, 30, 26, F[1], 4), ...arrow(250, 39, 272, 39), R(274, 26, 30, 26, F[2], 4));
  // problem solution
  shapes.push(T(340, 44, "?", 22, "middle", true, RED), ...arrow(352, 39, 382, 39), T(398, 46, "✓", 20, "middle", true, "#16a34a"));
  // description web
  shapes.push({ k: "circle", cx: 470, cy: 40, r: 10, fill: F[0], stroke: INK, sw: 1.2 });
  [[-28, -18], [28, -18], [-28, 18], [28, 18]].forEach(([dx, dy]) => shapes.push(Ln(470, 40, 470 + dx * 0.75, 40 + dy * 0.75, MUTED, 1.2), { k: "circle", cx: 470 + dx, cy: 40 + dy, r: 6, fill: F[3], stroke: INK, sw: 1 }));
  return { title: "Text structures", visual: { w: W, h: 96, shapes, alt: "Five text structures: sequence, compare, cause and effect, problem and solution, description" } };
}

function figurativeChart(): AnchorChart {
  return {
    title: "Figurative language",
    visual: cards([
      { head: "Simile", lines: ["compares using like / as", "as busy as a bee"] },
      { head: "Metaphor", lines: ["says one thing IS another", "the classroom was a zoo"] },
      { head: "Personification", lines: ["human traits for things", "the wind whispered"] },
      { head: "Hyperbole", lines: ["huge exaggeration", "I could sleep for a year"] },
      { head: "Alliteration", lines: ["same first sound", "slippery silver snakes"] },
      { head: "Onomatopoeia", lines: ["a word that is a sound", "buzz, crash, pop"] },
    ], 3, 52),
  };
}

function sentenceTypes(): AnchorChart {
  return {
    title: "Sentence types",
    visual: cards([
      { head: "Simple", lines: ["one complete idea", "The dog barked."] },
      { head: "Compound", lines: ["two ideas + FANBOYS", "for, and, nor, but, or, yet, so"] },
      { head: "Complex", lines: ["idea + dependent clause", "because, when, although…"] },
      { head: "Fragment ✗", lines: ["missing a subject or verb", "Ran to the park."] },
      { head: "Run-on ✗", lines: ["two ideas, no joining", "I ran I fell."] },
      { head: "Clause", lines: ["has a subject and a verb", "phrase: no subject + verb"] },
    ], 3, 52),
  };
}

function mainIdeaTable(): AnchorChart {
  const shapes: Shape[] = [R(60, 6, 400, 34, F[1], 6), T(260, 28, "Main idea: what the whole text is mostly about", 12, "middle", true)];
  [100, 230, 360].forEach((x, i) => { shapes.push(R(x, 40, 60, 54, F[0], 2), T(x + 30, 64, "Detail", 10.5, "middle", true), T(x + 30, 80, String(i + 1), 11, "middle", false, MUTED)); });
  shapes.push(T(260, 110, "Details hold up the main idea, like legs hold up a table.", 10.5, "middle", false, MUTED));
  return { title: "Main idea and details", visual: { w: W, h: 116, shapes, alt: "A table: the main idea is the top, details are the legs" } };
}

function factOpinion(): AnchorChart {
  return { title: "Fact or opinion?", visual: cards([{ head: "Fact", lines: ["can be checked or proved", "Paris is in France."], fill: F[2] }, { head: "Opinion", lines: ["what someone thinks/feels", "clue words: best, I think, should"], fill: F[3] }], 2, 56) };
}

function authorPurpose(): AnchorChart {
  const shapes: Shape[] = [];
  const parts: [string, string][] = [["Persuade", "make you agree or act"], ["Inform", "teach facts"], ["Entertain", "tell a story, make you smile"]];
  parts.forEach(([, ], i) => shapes.push({ k: "poly", pts: sectorPts(60, 56, 50, (i * 2 * Math.PI) / 3, ((i + 1) * 2 * Math.PI) / 3), closed: true, fill: F[i + 1], stroke: INK, sw: 1.4 }));
  shapes.push(T(60, 30, "P", 16, "middle", true), T(84, 76, "I", 16, "middle", true), T(36, 76, "E", 16, "middle", true));
  parts.forEach(([a, b], i) => { shapes.push(T(140, 30 + i * 28, a, 13, "start", true, BLUE), T(230, 30 + i * 28, b, 11.5, "start")); });
  return { title: "Author's purpose: PIE", visual: { w: W, h: 112, shapes, alt: "PIE: persuade, inform, entertain" } };
}

function argumentChart(): AnchorChart {
  return { title: "Building an argument", visual: flow([{ head: "Claim", sub: "what you argue" }, { head: "Reasons", sub: "why" }, { head: "Evidence", sub: "facts & data" }, { head: "Counterclaim", sub: "other side" }, { head: "Rebuttal", sub: "answer it" }]) };
}

function rhetoricChart(): AnchorChart {
  return { title: "Rhetorical appeals", visual: cards([{ head: "Ethos", lines: ["credibility: trust me", "“As a doctor, I…”"] }, { head: "Pathos", lines: ["emotion: feel this", "“Imagine being alone…”"] }, { head: "Logos", lines: ["logic: facts and reasons", "“90% of tests show…”"] }], 3, 54) };
}

function tenseTimeline(): AnchorChart {
  const shapes: Shape[] = [...arrow(10, 30, 510, 30, MUTED, 2)];
  [[80, "Past", "walked, ran"], [260, "Present", "walk(s), run(s)"], [440, "Future", "will walk, will run"]].forEach(([x, a, b], i) => {
    shapes.push({ k: "circle", cx: +x, cy: 30, r: 6, fill: [F[0], F[1], F[2]][i], stroke: INK, sw: 1.2 }, T(+x, 16, String(a), 12, "middle", true, BLUE), T(+x, 52, String(b), 11, "middle"));
  });
  shapes.push(T(260, 76, "Irregular verbs change shape: go → went, eat → ate, see → saw", 10.5, "middle", false, MUTED));
  return { title: "Verb tenses", visual: { w: W, h: 82, shapes, alt: "A timeline of past, present and future tense" } };
}

function wordParts(grade: number): AnchorChart {
  if (grade <= 3) {
    const shapes: Shape[] = [R(10, 10, 60, 34, F[0], 4), T(40, 32, "un", 14, "middle", true), T(84, 32, "+", 14), R(98, 10, 90, 34, F[1], 4), T(143, 32, "help", 14, "middle", true), T(202, 32, "+", 14), R(216, 10, 60, 34, F[2], 4), T(246, 32, "ful", 14, "middle", true), T(290, 32, "=", 14), T(300, 32, "unhelpful", 14, "start", true, BLUE)];
    shapes.push(T(40, 60, "prefix", 10, "middle", false, MUTED), T(143, 60, "base word", 10, "middle", false, MUTED), T(246, 60, "suffix", 10, "middle", false, MUTED), T(300, 60, "un = not · re = again · -ful = full of", 10, "start", false, MUTED));
    return { title: "Prefixes and suffixes", visual: { w: W, h: 66, shapes, alt: "un + help + ful = unhelpful" } };
  }
  return { title: "Greek and Latin roots", visual: cards([{ head: "bio", lines: ["life"] }, { head: "graph", lines: ["write"] }, { head: "tele", lines: ["far"] }, { head: "port", lines: ["carry"] }, { head: "aud", lines: ["hear"] }, { head: "spect", lines: ["look"] }, { head: "geo", lines: ["earth"] }, { head: "micro", lines: ["small"] }], 4, 42) };
}

function transitionsChart(): AnchorChart {
  return { title: "Transition words", visual: cards([{ head: "Order", lines: ["first, next, finally"] }, { head: "Add", lines: ["also, in addition"] }, { head: "Contrast", lines: ["however, but, instead"] }, { head: "Cause / effect", lines: ["because, so, therefore"] }, { head: "Example", lines: ["for example, such as"] }, { head: "Conclude", lines: ["in conclusion, overall"] }], 3, 44) };
}

function comparativesChart(): AnchorChart {
  const shapes: Shape[] = [];
  [["tall", 40], ["taller", 60], ["tallest", 80]].forEach(([w, h], i) => {
    const x = 30 + i * 70;
    shapes.push(R(x, 90 - +h, 40, +h, F[i], 4), T(x + 20, 106, String(w), 12, "middle", true, BLUE));
  });
  ["-er compares two things:", "Sam is taller than Ali.", "-est compares three or more:", "Mia is the tallest.", "good → better → best"].forEach((t, i) => shapes.push(T(260, 22 + i * 19, t, 11.5, "start", i % 2 === 0)));
  return { title: "Comparing words", visual: { w: W, h: 112, shapes, alt: "Bars for tall, taller and tallest" } };
}

function vowelChart(): AnchorChart {
  const pairs: [string, string, string][] = [["a", "cat", "cake"], ["e", "hen", "bee"], ["i", "pig", "kite"], ["o", "fox", "boat"], ["u", "bug", "spoon"]];
  const shapes: Shape[] = [];
  pairs.forEach(([v, s, l], i) => {
    const x = i * 104;
    shapes.push(R(x, 0, 98, 112, "#f8fafc", 6, "#cbd5e1", 1), T(x + 49, 16, v, 15, "middle", true, RED));
    shapes.push(...icon(s, x + 6, 24, 40), ...icon(l, x + 52, 24, 40));
    shapes.push(T(x + 26, 80, s, 10.5, "middle", true), T(x + 72, 80, l, 10.5, "middle", true), T(x + 26, 96, "short", 9, "middle", false, MUTED), T(x + 72, 96, "long", 9, "middle", false, MUTED));
  });
  return { title: "Short and long vowels", visual: { w: W, h: 112, shapes, alt: "Short and long vowel pictures for a, e, i, o, u" } };
}

function syllableChart(): AnchorChart {
  const items: [string, string, number][] = [["cat", "cat", 1], ["pencil", "pen · cil", 2], ["banana", "ba · na · na", 3], ["umbrella", "um · brel · la", 3]];
  const shapes: Shape[] = [];
  items.forEach(([w, split, n], i) => {
    const x = i * 130;
    shapes.push(...icon(w, x + 41, 0, 48), T(x + 65, 64, split, 12, "middle", true));
    for (let k = 0; k < n; k++) shapes.push({ k: "circle", cx: x + 65 + (k - (n - 1) / 2) * 16, cy: 80, r: 5, fill: BLUE });
  });
  shapes.push(T(W / 2, 102, "Clap each part of the word: one clap = one syllable.", 10.5, "middle", false, MUTED));
  return { title: "Syllables", visual: { w: W, h: 108, shapes, alt: "Words split into syllables with a dot for each clap" } };
}

function alphabetStrip(): AnchorChart {
  const shapes: Shape[] = [];
  "abcdefghijklmnopqrstuvwxyz".split("").forEach((c, i) => {
    const x = (i % 13) * 40, y = Math.floor(i / 13) * 36;
    shapes.push(R(x, y, 36, 32, "aeiou".includes(c) ? F[3] : F[0], 4), T(x + 18, y + 22, c, 15, "middle", true));
  });
  shapes.push(T(W / 2, 92, "Same first letter? Look at the second letter, then the third.", 10.5, "middle", false, MUTED));
  return { title: "ABC order", visual: { w: W, h: 98, shapes, alt: "The alphabet" } };
}

function compoundChart(): AnchorChart {
  const rows: [string, string, string][] = [["sun", "flower", "sunflower"], ["cup", "cake", "cupcake"], ["star", "fish", "starfish"]];
  const shapes: Shape[] = [];
  rows.forEach(([a, b, w], i) => {
    const x = i * 175;
    shapes.push(...icon(a, x, 4, 40), T(x + 50, 30, "+", 16, "middle", true), ...icon(b, x + 60, 4, 40), T(x + 80, 64, `${a} + ${b} =`, 10.5, "middle"), T(x + 80, 80, w, 12.5, "middle", true, BLUE));
  });
  return { title: "Compound words", visual: { w: W, h: 86, shapes, alt: "sun + flower = sunflower, cup + cake = cupcake, star + fish = starfish" } };
}

function pluralRules(): AnchorChart {
  return { title: "Making plurals", visual: cards([{ head: "+ s", lines: ["cat → cats"] }, { head: "+ es", lines: ["after s, x, ch, sh", "box → boxes"] }, { head: "y → ies", lines: ["consonant + y", "baby → babies"] }, { head: "Special", lines: ["child → children", "mouse → mice"] }], 4, 52) };
}

function contractionsChart(): AnchorChart {
  return { title: "Contractions", visual: cards([{ head: "do + not = don't", lines: ["the ’ replaces o"] }, { head: "I + am = I'm", lines: ["the ’ replaces a"] }, { head: "we + will = we'll", lines: ["the ’ replaces wi"] }, { head: "it + is = it's", lines: ["its = belongs to it"] }], 4, 46) };
}

function rhymeScheme(): AnchorChart {
  const lines: [string, string][] = [["The cat sat on the mat,", "A"], ["she wore a little hat.", "A"], ["The sun began to glow,", "B"], ["and melted all the snow.", "B"]];
  const shapes: Shape[] = [R(0, 0, 330, 96, "#f8fafc", 6, "#cbd5e1", 1)];
  lines.forEach(([t, l], i) => { shapes.push(T(12, 22 + i * 21, t, 12, "start", false), T(312, 22 + i * 21, l, 13, "middle", true, l === "A" ? BLUE : RED)); });
  shapes.push(T(350, 34, "Lines that rhyme get the", 11, "start"), T(350, 52, "same letter: AABB", 11, "start", true, BLUE), T(350, 76, "stanza = a group of lines", 10.5, "start", false, MUTED));
  return { title: "Rhyme scheme", visual: { w: W, h: 98, shapes, alt: "A four-line stanza with rhyme scheme AABB" } };
}

function contextClues(): AnchorChart {
  return { title: "Context clue types", visual: cards([{ head: "Definition", lines: ["the meaning is given", "“…arid, or very dry…”"] }, { head: "Synonym", lines: ["a word that means the same"] }, { head: "Antonym", lines: ["an opposite: unlike, but"] }, { head: "Example", lines: ["such as, for example"] }], 4, 52) };
}

// ---------------------------------------------------------------- science charts

function sciMethod(): AnchorChart {
  return { title: "The scientific method", visual: flow([{ head: "Question" }, { head: "Hypothesis", sub: "a testable guess" }, { head: "Experiment", sub: "test one change" }, { head: "Data", sub: "observe & record" }, { head: "Conclusion", sub: "was I right?" }], true) };
}

function labTools(): AnchorChart {
  const shapes: Shape[] = [];
  // ruler
  shapes.push(R(4, 26, 90, 18, "#fde68a", 2)); for (let i = 0; i <= 9; i++) shapes.push(Ln(8 + i * 9, 26, 8 + i * 9, 26 + (i % 5 ? 5 : 9), INK, 1));
  // balance
  shapes.push(Ln(140, 50, 220, 50, INK, 2), { k: "poly", pts: [[172, 66], [180, 50], [188, 66]], closed: true, fill: F[0], stroke: INK, sw: 1.2 }, R(140, 38, 26, 10, F[2], 2), R(194, 38, 26, 10, F[2], 2));
  // graduated cylinder
  shapes.push({ k: "poly", pts: [[268, 6], [268, 64], [292, 64], [292, 6]], fill: "#e0f2fe", stroke: INK, sw: 1.4 }, R(269, 36, 22, 27, "#60a5fa", 0, "#60a5fa", 0.1));
  for (let i = 0; i < 6; i++) shapes.push(Ln(268, 12 + i * 9, 276, 12 + i * 9, INK, 0.9));
  // thermometer
  shapes.push(R(365, 4, 12, 52, "#fff", 6), { k: "circle", cx: 371, cy: 60, r: 9, fill: RED, stroke: INK, sw: 1.3 }, R(368, 26, 6, 32, RED, 3, RED, 0.1));
  // stopwatch
  shapes.push({ k: "circle", cx: 470, cy: 38, r: 22, fill: "#fff", stroke: INK, sw: 1.6 }, R(465, 10, 10, 6, F[1], 1), Ln(470, 38, 470, 22, INK, 1.8), Ln(470, 38, 482, 44, INK, 1.4));
  const lab: [number, string, string][] = [[49, "Ruler", "length: cm, mm"], [180, "Balance", "mass: g, kg"], [280, "Cylinder", "volume: mL"], [371, "Thermometer", "temperature: °C"], [470, "Stopwatch", "time: s"]];
  lab.forEach(([x, a, b]) => shapes.push(T(x, 86, a, 10.5, "middle", true), T(x, 100, b, 9.5, "middle", false, MUTED)));
  return { title: "Measuring tools", visual: { w: W, h: 104, shapes, alt: "Ruler, balance, graduated cylinder, thermometer and stopwatch" } };
}

function thermometerChart(): AnchorChart {
  const shapes: Shape[] = [R(40, 4, 22, 112, "#fff", 11), { k: "circle", cx: 51, cy: 118, r: 14, fill: RED, stroke: INK, sw: 1.4 }, R(46, 50, 12, 68, RED, 5, RED, 0.1)];
  [[16, "100°C", "212°F", "water boils"], [56, "37°C", "98.6°F", "body temperature"], [96, "0°C", "32°F", "water freezes"]].forEach(([y, c, f, n]) => {
    shapes.push(Ln(62, +y, 74, +y, INK, 1.4), T(80, +y + 4, String(c), 11.5, "start", true, BLUE), T(130, +y + 4, `= ${f}`, 11.5, "start", true), T(200, +y + 4, String(n), 10.5, "start", false, MUTED));
  });
  shapes.push(T(320, 40, "°F = °C × 9/5 + 32", 12.5, "start", true, BLUE), T(320, 64, "°C = (°F − 32) × 5/9", 12.5, "start", true, BLUE), T(320, 88, "K = °C + 273", 12.5, "start", true, BLUE));
  return { title: "Temperature scales", visual: { w: W, h: 134, shapes, alt: "Thermometer with Celsius and Fahrenheit reference points" } };
}

function rockCycle(): AnchorChart {
  const shapes: Shape[] = [];
  const box = (x: number, y: number, t: string, f: string) => shapes.push(R(x, y, 120, 34, f, 8), T(x + 60, y + 22, t, 12, "middle", true));
  box(200, 0, "Igneous", F[7]); box(20, 96, "Sedimentary", F[1]); box(380, 96, "Metamorphic", F[4]);
  shapes.push(...arrow(210, 34, 100, 94), T(110, 56, "weathering & erosion,", 9.5, "end", false, MUTED), T(110, 68, "compaction", 9.5, "end", false, MUTED));
  shapes.push(...arrow(140, 113, 378, 113), T(260, 106, "heat & pressure", 9.5, "middle", false, MUTED));
  shapes.push(...arrow(430, 94, 320, 34), T(410, 56, "melting, then cooling", 9.5, "start", false, MUTED));
  return { title: "The rock cycle", visual: { w: W, h: 132, shapes, alt: "Rock cycle: igneous, sedimentary and metamorphic rocks" } };
}

function stateChanges(): AnchorChart {
  const shapes: Shape[] = [];
  const box = (x: number, t: string, f: string) => shapes.push(R(x, 30, 110, 40, f, 8), T(x + 55, 55, t, 13, "middle", true));
  box(0, "Solid", F[0]); box(205, "Liquid", F[6]); box(410, "Gas", F[4]);
  shapes.push(...arrow(114, 40, 200, 40, RED), T(157, 30, "melting", 10, "middle", true, RED), ...arrow(200, 62, 114, 62, BLUE), T(157, 82, "freezing", 10, "middle", true, BLUE));
  shapes.push(...arrow(319, 40, 405, 40, RED), T(362, 30, "evaporation", 10, "middle", true, RED), ...arrow(405, 62, 319, 62, BLUE), T(362, 82, "condensation", 10, "middle", true, BLUE));
  shapes.push(T(W / 2, 104, "Adding heat (red) speeds particles up; removing heat (blue) slows them down.", 10, "middle", false, MUTED));
  return { title: "Changes of state", visual: { w: W, h: 110, shapes, alt: "Solid, liquid and gas with melting, freezing, evaporation and condensation" } };
}

function phScale(): AnchorChart {
  const shapes: Shape[] = [];
  const cols = ["#dc2626", "#ef4444", "#f97316", "#fb923c", "#facc15", "#fde047", "#a3e635", "#4ade80", "#2dd4bf", "#38bdf8", "#60a5fa", "#6366f1", "#8b5cf6", "#7c3aed", "#6d28d9"];
  cols.forEach((c, i) => { shapes.push({ k: "rect", x: i * 34, y: 10, w: 34, h: 28, fill: c, stroke: INK, sw: 0.8 }, T(i * 34 + 17, 29, String(i), 11, "middle", true, i > 11 || i < 2 ? "#fff" : INK)); });
  [[2 * 34, "lemon juice ~2", "strong acid"], [7 * 34 + 17, "water 7", "neutral"], [12 * 34, "soap ~12", "strong base"]].forEach(([x, a, b]) => shapes.push(T(+x, 56, String(a), 10.5, "middle", true), T(+x, 70, String(b), 9.5, "middle", false, MUTED)));
  shapes.push(T(W / 2, 90, "Below 7 = acid · 7 = neutral · above 7 = base (alkaline)", 11, "middle", true));
  return { title: "The pH scale", visual: { w: W, h: 96, shapes, alt: "pH scale from 0 to 14" } };
}

function genetics(): AnchorChart {
  return { title: "Genetics words", visual: cards([{ head: "B  dominant", lines: ["shows if present", "capital letter"] }, { head: "b  recessive", lines: ["shows only as bb", "lower-case letter"] }, { head: "BB, bb", lines: ["homozygous", "two the same"] }, { head: "Bb", lines: ["heterozygous", "one of each"] }, { head: "Genotype", lines: ["the letters: Bb"] }, { head: "Phenotype", lines: ["what you see: brown"] }], 3, 50) };
}

function mitosis(): AnchorChart {
  const shapes: Shape[] = [];
  const names = ["Interphase", "Prophase", "Metaphase", "Anaphase", "Telophase"];
  names.forEach((n, i) => {
    const cx = 50 + i * 104, cy = 40;
    if (i < 4) shapes.push({ k: "circle", cx, cy, r: 32, fill: "#f0fdf4", stroke: INK, sw: 1.4 });
    else shapes.push({ k: "circle", cx: cx - 18, cy, r: 22, fill: "#f0fdf4", stroke: INK, sw: 1.4 }, { k: "circle", cx: cx + 18, cy, r: 22, fill: "#f0fdf4", stroke: INK, sw: 1.4 });
    const X = (x: number, y: number, c: string) => shapes.push(Ln(x - 4, y - 6, x + 4, y + 6, c, 2.4), Ln(x + 4, y - 6, x - 4, y + 6, c, 2.4));
    if (i === 0) shapes.push({ k: "circle", cx, cy, r: 14, fill: F[4], stroke: INK, sw: 1 });
    if (i === 1) { X(cx - 8, cy - 6, RED); X(cx + 8, cy + 6, BLUE); }
    if (i === 2) { shapes.push(Ln(cx, cy - 26, cx, cy + 26, "#94a3b8", 1, true)); X(cx, cy - 9, RED); X(cx, cy + 9, BLUE); }
    if (i === 3) { [[-16, RED], [16, RED]].forEach(([dx, c]) => shapes.push(Ln(cx + +dx - 3, cy - 10, cx + +dx + 3, cy - 4, String(c), 2.4))); [[-16, BLUE], [16, BLUE]].forEach(([dx, c]) => shapes.push(Ln(cx + +dx - 3, cy + 4, cx + +dx + 3, cy + 10, String(c), 2.4))); }
    if (i === 4) { shapes.push({ k: "circle", cx: cx - 18, cy, r: 8, fill: F[4], stroke: INK, sw: 1 }, { k: "circle", cx: cx + 18, cy, r: 8, fill: F[4], stroke: INK, sw: 1 }); }
    shapes.push(T(cx, 90, n, 10.5, "middle", true));
  });
  return { title: "Mitosis", visual: { w: W, h: 96, shapes, alt: "The stages of mitosis" } };
}

function dnaChart(): AnchorChart {
  const shapes: Shape[] = [];
  const pairs = [["A", "T"], ["C", "G"], ["T", "A"], ["G", "C"], ["A", "T"]];
  pairs.forEach(([a, b], i) => {
    const x = 20 + i * 44;
    shapes.push(Ln(x, 12, x, 92, INK, 0.1), R(x, 14, 28, 24, F[0], 3), R(x, 62, 28, 24, F[2], 3), Ln(x + 14, 38, x + 14, 62, MUTED, 1.4), T(x + 14, 31, a, 12, "middle", true), T(x + 14, 79, b, 12, "middle", true));
  });
  shapes.push(T(260, 32, "A pairs with T", 13, "start", true, BLUE), T(260, 54, "C pairs with G", 13, "start", true, BLUE), T(260, 78, "DNA → RNA → protein", 12, "start"), T(260, 96, "(in RNA, U replaces T)", 10.5, "start", false, MUTED));
  return { title: "DNA base pairs", visual: { w: W, h: 100, shapes, alt: "DNA base pairs A-T and C-G" } };
}

function periodicTrends(): AnchorChart {
  const shapes: Shape[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) shapes.push({ k: "rect", x: 10 + c * 22, y: 10 + r * 22, w: 20, h: 20, fill: c === 0 ? F[7] : c === 7 ? F[4] : c === 6 ? F[1] : "#f1f5f9", stroke: INK, sw: 0.8 });
  shapes.push(...arrow(10, 104, 186, 104, BLUE, 2), T(98, 118, "across a period →", 9.5, "middle", false, BLUE), ...arrow(198, 10, 198, 96, RED, 2), T(206, 56, "down a group ↓", 9.5, "start", false, RED));
  ["Atomic radius: grows ↓ and ←", "Electronegativity: grows ↑ and →", "Ionization energy: grows ↑ and →", "Group 1: alkali metals", "Group 17: halogens · 18: noble gases"].forEach((t, i) => shapes.push(T(290, 18 + i * 21, t, 10.5, "start", i < 3)));
  return { title: "Periodic table trends", visual: { w: W, h: 122, shapes, alt: "Periodic trends across periods and down groups" } };
}

function energyResources(): AnchorChart {
  return { title: "Energy resources", visual: cards([{ head: "Renewable", lines: ["won't run out", "solar, wind, water, geothermal"], fill: F[2] }, { head: "Non-renewable", lines: ["will run out", "coal, oil, natural gas, uranium"], fill: F[7] }], 2, 56) };
}

function halfLife(): AnchorChart {
  const shapes: Shape[] = [];
  const o = 30, base = 100, s = 46;
  shapes.push(Ln(o, 4, o, base, INK, 1.4), Ln(o, base, o + 4.4 * s, base, INK, 1.4));
  const pts: [number, number][] = [];
  for (let t = 0; t <= 4.2; t += 0.1) pts.push([o + t * s, base - 90 * Math.pow(0.5, t)]);
  shapes.push({ k: "poly", pts, stroke: BLUE, sw: 2.2 });
  [100, 50, 25, 12.5].forEach((v, i) => { shapes.push({ k: "circle", cx: o + i * s, cy: base - 90 * v / 100, r: 3.5, fill: RED }, T(o + i * s + 6, base - 90 * v / 100 - 4, `${v}%`, 9.5, "start", true)); shapes.push(T(o + i * s, base + 14, String(i), 9.5, "middle")); });
  shapes.push(T(o + 2 * s, base + 28, "half-lives", 9.5, "middle", false, MUTED));
  ["After each half-life, half is left.", "amount left = start × (½)ⁿ", "n = time ÷ half-life"].forEach((t, i) => shapes.push(T(260, 30 + i * 24, t, 12, "start", i > 0, i > 0 ? BLUE : INK)));
  return { title: "Half-life", visual: { w: W, h: 132, shapes, alt: "A decay curve halving each half-life" } };
}

function atmosphereLayers(): AnchorChart {
  const layers: [string, string, string][] = [["Thermosphere", "80–600 km", "auroras, space station"], ["Mesosphere", "50–80 km", "meteors burn up"], ["Stratosphere", "12–50 km", "ozone layer"], ["Troposphere", "0–12 km", "weather happens here"]];
  const shapes: Shape[] = [];
  layers.forEach(([n, h, d], i) => { shapes.push({ k: "rect", x: 0, y: i * 26, w: W, h: 26, fill: ["#c7d2fe", "#bfdbfe", "#bae6fd", "#e0f2fe"][i], stroke: INK, sw: 0.8 }, T(10, i * 26 + 17, n, 11.5, "start", true), T(170, i * 26 + 17, h, 11, "start", false, BLUE), T(290, i * 26 + 17, d, 11, "start", false, MUTED)); });
  return { title: "Layers of the atmosphere", visual: { w: W, h: 104, shapes, alt: "Troposphere, stratosphere, mesosphere and thermosphere" } };
}

function relationships(): AnchorChart {
  return { title: "Relationships in an ecosystem", visual: cards([{ head: "Mutualism  + / +", lines: ["both benefit", "bee and flower"] }, { head: "Commensalism  + / 0", lines: ["one benefits, other unaffected", "barnacle on a whale"] }, { head: "Parasitism  + / −", lines: ["one benefits, one harmed", "tick on a dog"] }, { head: "Predation  + / −", lines: ["one eats the other", "owl and mouse"] }, { head: "Competition  − / −", lines: ["both want the same thing", "lions and hyenas"] }, { head: "Producer → consumer", lines: ["energy flows up", "food chains and webs"] }], 3, 52) };
}

function digestive(): AnchorChart {
  return { title: "Path of food (digestive system)", visual: flow([{ head: "Mouth", sub: "chew" }, { head: "Esophagus", sub: "swallow" }, { head: "Stomach", sub: "acid mixes" }, { head: "Small intestine", sub: "absorbs nutrients" }, { head: "Large intestine", sub: "absorbs water" }]) };
}

function circulatory(): AnchorChart {
  return { title: "Path of blood (circulatory system)", visual: flow([{ head: "Heart", sub: "pumps" }, { head: "Lungs", sub: "picks up oxygen" }, { head: "Heart", sub: "pumps again" }, { head: "Arteries", sub: "to the body" }, { head: "Veins", sub: "back to heart" }], true) };
}

function respiratory(): AnchorChart {
  return { title: "Path of air (respiratory system)", visual: flow([{ head: "Nose / mouth" }, { head: "Trachea", sub: "windpipe" }, { head: "Bronchi", sub: "into each lung" }, { head: "Alveoli", sub: "O₂ in, CO₂ out" }]) };
}

function nervous(): AnchorChart {
  return { title: "Nervous system", visual: flow([{ head: "Senses", sub: "detect a stimulus" }, { head: "Nerves", sub: "carry the signal" }, { head: "Brain", sub: "decides" }, { head: "Spinal cord", sub: "message highway" }, { head: "Muscles", sub: "respond" }]) };
}

function bodySystems(): AnchorChart {
  return { title: "Body systems", visual: cards([{ head: "Skeletal", lines: ["support, protect"] }, { head: "Muscular", lines: ["movement"] }, { head: "Circulatory", lines: ["moves blood"] }, { head: "Respiratory", lines: ["breathing"] }, { head: "Digestive", lines: ["breaks down food"] }, { head: "Nervous", lines: ["control, signals"] }], 3, 40) };
}

function classification(): AnchorChart {
  const levels = ["Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"];
  const shapes: Shape[] = [];
  levels.forEach((l, i) => { const w = 280 - i * 32; shapes.push(R(10 + (280 - w) / 2, i * 15, w, 14, F[i % F.length], 2, INK, 0.8), T(150, i * 15 + 11, l, 9.5, "middle", true)); });
  ["Broad → specific.", "King Philip Came Over", "For Good Soup", "Scientific name = Genus species", "Homo sapiens"].forEach((t, i) => shapes.push(T(310, 18 + i * 19, t, 11, "start", i === 0 || i === 3, i === 1 || i === 2 ? BLUE : INK)));
  return { title: "Classifying living things", visual: { w: W, h: 106, shapes, alt: "Kingdom, phylum, class, order, family, genus, species" } };
}

function newtonsLaws(): AnchorChart {
  return { title: "Newton's laws", visual: cards([{ head: "1st: Inertia", lines: ["objects keep doing what", "they're doing unless pushed"] }, { head: "2nd: F = m × a", lines: ["more force → more acceleration", "more mass → less"] }, { head: "3rd: Action–reaction", lines: ["every push has an", "equal, opposite push"] }], 3, 58) };
}

function physChem(): AnchorChart {
  return { title: "Physical or chemical change?", visual: cards([{ head: "Physical", lines: ["same substance, new form", "melting, cutting, dissolving"], fill: F[0] }, { head: "Chemical", lines: ["a new substance forms", "rusting, burning, baking"], fill: F[7] }, { head: "Signs of chemical", lines: ["gas, colour change,", "light/heat, new smell"], fill: F[1] }], 3, 56) };
}

function kineticPotential(): AnchorChart {
  const shapes: Shape[] = [];
  const pts: [number, number][] = [];
  for (let x = 0; x <= 300; x += 6) pts.push([x + 10, 70 - Math.cos((x / 300) * Math.PI * 2) * 50]);
  shapes.push({ k: "poly", pts, stroke: INK, sw: 2.4 });
  shapes.push({ k: "circle", cx: 10, cy: 20, r: 8, fill: F[1], stroke: INK, sw: 1.4 }, { k: "circle", cx: 160, cy: 120, r: 8, fill: F[7], stroke: INK, sw: 1.4 });
  shapes.push(T(26, 18, "top: most potential", 10, "start", true, BLUE), T(176, 118, "bottom: most kinetic", 10, "start", true, RED));
  ["PE = m × g × h  (height)", "KE = ½ × m × v²  (speed)", "Energy changes form but", "the total stays the same."].forEach((t, i) => shapes.push(T(330, 30 + i * 22, t, 11.5, "start", i < 2, i < 2 ? BLUE : INK)));
  return { title: "Potential and kinetic energy", visual: { w: W, h: 130, shapes, alt: "A roller coaster: most potential energy at the top, most kinetic at the bottom" } };
}

function gasLaws(): AnchorChart {
  return { title: "Gas laws", visual: cards([{ head: "Boyle: P₁V₁ = P₂V₂", lines: ["more pressure → less volume"] }, { head: "Charles: V₁/T₁ = V₂/T₂", lines: ["hotter → bigger (T in K)"] }, { head: "Ideal: PV = nRT", lines: ["R = 0.0821 L·atm/(mol·K)"] }], 3, 46) };
}

function chemFormulas(): AnchorChart {
  return { title: "Chemistry tool kit", visual: cards([{ head: "Molar mass", lines: ["add atomic masses", "H₂O = 2(1) + 16 = 18 g/mol"] }, { head: "moles = mass ÷ molar mass", lines: ["n = m ÷ M"] }, { head: "Molarity M = mol ÷ L", lines: ["concentration of a solution"] }], 3, 52) };
}

function balancingChart(): AnchorChart {
  const shapes: Shape[] = [T(10, 26, "2H₂  +  O₂   →   2H₂O", 16, "start", true, BLUE)];
  [["H", "4", "4"], ["O", "2", "2"]].forEach(([el, l, r], i) => { shapes.push(T(10 + i * 125, 58, `${el}: ${l} on the left`, 10.5, "start"), T(10 + i * 125, 76, `${el}: ${r} on the right ✓`, 10.5, "start", true, "#16a34a")); });
  ["Atoms are never made or lost:", "change the big numbers in front", "(coefficients), never the small ones."].forEach((t, i) => shapes.push(T(270, 24 + i * 20, t, 11.5, "start", i === 0)));
  return { title: "Balancing equations", visual: { w: W, h: 84, shapes, alt: "2H2 + O2 → 2H2O with atoms counted on each side" } };
}

function reactionTypes(): AnchorChart {
  return { title: "Types of reactions", visual: cards([{ head: "Synthesis", lines: ["A + B → AB"] }, { head: "Decomposition", lines: ["AB → A + B"] }, { head: "Single replacement", lines: ["A + BC → AC + B"] }, { head: "Double replacement", lines: ["AB + CD → AD + CB"] }, { head: "Combustion", lines: ["fuel + O₂ → CO₂ + H₂O"] }, { head: "Neutralization", lines: ["acid + base → salt + water"] }], 3, 42) };
}

function electricityChart(grade: number): AnchorChart {
  if (grade <= 5) return { title: "Circuits", visual: cards([{ head: "Closed circuit", lines: ["a complete loop", "the bulb lights"] }, { head: "Open circuit", lines: ["a gap in the loop", "no current flows"] }, { head: "Conductors", lines: ["let electricity through", "copper, iron"] }, { head: "Insulators", lines: ["block electricity", "plastic, rubber, wood"] }], 4, 54) };
  return { title: "Ohm's law", visual: formulaTriangle("V", "I", "R", ["V = I × R", "I = V ÷ R", "R = V ÷ I", "volts, amps, ohms (Ω)"]) };
}

function seasons(): AnchorChart {
  return { title: "Day, year and seasons", visual: cards([{ head: "1 day", lines: ["Earth spins once", "on its axis"] }, { head: "1 year", lines: ["Earth orbits", "the Sun once"] }, { head: "Seasons", lines: ["Earth's tilt: the half", "tilted to the Sun has summer"] }, { head: "Moon", lines: ["orbits Earth", "about once a month"] }], 4, 54) };
}

function wavesChart(): AnchorChart {
  return { title: "Light and sound", visual: cards([{ head: "Reflect", lines: ["bounces off", "mirror, echo"] }, { head: "Refract", lines: ["bends passing through", "straw in water"] }, { head: "Absorb", lines: ["taken in", "dark clothes get hot"] }, { head: "Sound", lines: ["vibrations through", "solids, liquids, gases"] }], 4, 54) };
}

function speedTriangle(): AnchorChart {
  return { title: "Speed, distance and time", visual: formulaTriangle("d", "s", "t", ["speed = distance ÷ time", "distance = speed × time", "time = distance ÷ speed", "Cover what you want to find."]) };
}

function densityTriangle(): AnchorChart {
  return { title: "Density", visual: formulaTriangle("m", "D", "V", ["density = mass ÷ volume", "mass = density × volume", "volume = mass ÷ density", "Water is 1 g/cm³: denser things sink."]) };
}

function physicsKit(): AnchorChart {
  return { title: "Physics formulas", visual: cards([{ head: "v = d ÷ t", lines: ["velocity"] }, { head: "a = Δv ÷ t", lines: ["acceleration"] }, { head: "F = m × a", lines: ["force (N)"] }, { head: "p = m × v", lines: ["momentum"] }, { head: "W = F × d", lines: ["work (J)"] }, { head: "P = W ÷ t", lines: ["power (W)"] }], 3, 42) };
}

// ---------------------------------------------------------------- topic map

type Maker = (grade: number) => AnchorChart | null;
const MATH: Record<string, Maker> = {
  tens_ones: (g) => placeValue(g, false), placevalue: (g) => placeValue(g, false), expanded_form: (g) => placeValue(g, false), large_numbers: (g) => placeValue(g, false), compare_large: (g) => placeValue(g, false),
  decimal_place_value: (g) => placeValue(g, true), decimals_intro: (g) => placeValue(g, true), decimals_compare: (g) => placeValue(g, true), powers_of_10: (g) => placeValue(g, true),
  decimals_round: () => roundingChart(),
  fractions_intro: () => fractionWall(), equivalent_fractions: () => fractionWall(), fractions_compare_same: () => fractionWall(), fractions_compare: () => fractionWall(), fractions_simplify: () => fractionWall(), add_like_fractions: () => fractionWall(), mixed_numbers: () => fractionWall(), fractions_add_sub: () => fractionWall(), fractions: () => fractionWall(), fraction_times_whole: () => fractionWall(),
  order: (g) => orderOps(g), expressions_evaluate: (g) => orderOps(g), exponents_whole: (g) => orderOps(g),
  angles_measure: () => anglesOnLine(), angle_relationships: () => anglePairs(), parallel_lines_angles: () => parallelAngles(), triangle_angles: () => triangleSum(),
  area_perimeter: (g) => areaFormulas(g), geometry_area_rect: (g) => areaFormulas(g), geometry_area_triangle: (g) => areaFormulas(g), polygon_area: (g) => areaFormulas(g), geometry: (g) => areaFormulas(g),
  geometry_volume: (g) => volumeFormulas(g), volume_prisms_cylinders: (g) => volumeFormulas(g), volume_cones_spheres: (g) => volumeFormulas(g), surface_area: (g) => volumeFormulas(g), surface_area_solids: (g) => volumeFormulas(g),
  circle_geo: () => circleParts(), arc_sector: () => circleParts(), circle_equation: () => circleParts(),
  coordinate_plane_q1: () => coordinatePlane(true), coordinate_four_quadrants: () => coordinatePlane(false), transformations: () => coordinatePlane(false), coordinate_geo: () => coordinatePlane(false),
  slope: () => slopeChart(), slope_intercept: () => slopeChart(), linear: () => slopeChart(), point_slope: () => slopeChart(), parallel_perpendicular: () => slopeChart(),
  integers: () => integerRules(), integers_add_sub: () => integerRules(), integers_mul_div: () => integerRules(), rational_ops: () => integerRules(), absolute_value: () => integerRules(), compare_rationals: () => integerRules(),
  percent: () => percentStrip(), percent_convert: () => percentStrip(), percent_find: () => percentStrip(), percent_word_problems: () => percentStrip(), decimal_fraction_convert: () => percentStrip(), fraction_to_decimal: () => percentStrip(),
  stats: () => statsChart(), stats_central_tendency: () => statsChart(), stats_range: () => statsChart(), mad_iqr: () => statsChart(),
  unit_conversion: (g) => unitLadder(g), mass_volume: (g) => unitLadder(g),
  exponents: () => exponentRules(), scientific_notation: () => exponentRules(),
  pythagorean: () => trigChart(true), special_right_triangles: () => trigChart(true), trig_ratios: () => trigChart(false), trig_solve: () => trigChart(false),
  time_5min: () => clockChart(), time_minute: () => clockChart(), elapsed_time: () => clockChart(),
  money: () => coinsChart(),
  quadratics: () => parabolaChart(), quadratic_formula: () => parabolaChart(), completing_square: () => parabolaChart(),
  arrays: () => arrayChart(), mult_facts: () => arrayChart(), div_facts: () => arrayChart(), mult_missing: () => arrayChart(), multdiv: () => arrayChart(),
  long_division: () => longDivision(),
  probability: (g) => (g >= 7 ? probabilityLine() : null), probability_compound: () => probabilityLine(),
  ratios: () => ratioTable(), ratios_simplify: () => ratioTable(), ratios_equivalent: () => ratioTable(), ratios_unit_rate: () => ratioTable(), proportions: () => ratioTable(), constant_proportionality: () => ratioTable(),
  comparing: () => comparingSymbols(),
  inequalities_intro: () => inequalityLine(), inequalities_solve: () => inequalityLine(),
  functions_intro: () => functionMachine(), function_ops: () => functionMachine(),
  algebra_solve: () => balanceChart(), two_step_equations: () => balanceChart(), expressions_one_step: () => balanceChart(), multi_step_equations: () => balanceChart(), literal_equations: () => balanceChart(),
  make_ten: () => makeTen(),
};
const ENGLISH: Record<string, Maker> = {
  story_elements: (g) => storyMountain(g), themes: (g) => (g >= 4 ? storyMountain(g) : null),
  nouns_verbs: (g) => partsOfSpeech(g), parts_of_speech: (g) => partsOfSpeech(g), pos_adjectives_adverbs: (g) => partsOfSpeech(g), pos_prepositions: (g) => partsOfSpeech(g),
  punctuation: (g) => punctuationChart(g), commas_quotes: (g) => punctuationChart(g), punctuation_adv: (g) => punctuationChart(g), capitalization: () => capitalsChart(),
  point_of_view: () => pointOfView(), text_structure: () => textStructures(),
  figurative_language: () => figurativeChart(), literary_devices: () => figurativeChart(),
  sentence_types: () => sentenceTypes(), fragments_runons: () => sentenceTypes(), phrases_clauses: () => sentenceTypes(),
  main_idea: () => mainIdeaTable(), fact_opinion: () => factOpinion(), author_purpose: () => authorPurpose(),
  argument_claims: () => argumentChart(), rhetoric: () => rhetoricChart(),
  grammar_tenses: () => tenseTimeline(), verb_tenses_adv: () => tenseTimeline(), irregular_verbs: () => tenseTimeline(),
  prefix_suffix: (g) => wordParts(g), roots: (g) => wordParts(g),
  transitions: () => transitionsChart(), comparatives: () => comparativesChart(),
  vowel_sounds: () => vowelChart(), syllables: () => syllableChart(), abc_order: () => alphabetStrip(),
  compound_words: () => compoundChart(), plural_nouns: () => pluralRules(), contractions: () => contractionsChart(),
  rhyme_scheme: () => rhymeScheme(), poetry_terms: () => rhymeScheme(), context_clues: () => contextClues(),
};
const SCIENCE: Record<string, Maker> = {
  sci_method: () => sciMethod(), lab_measurement: () => labTools(), temperature_scales: () => thermometerChart(),
  rocks_erosion: () => rockCycle(), heat_changes: () => stateChanges(), phys_chem_changes: () => physChem(), substances_mixtures: () => physChem(),
  acids_bases: () => phScale(), genetics_basics: () => genetics(), genetics_vocabulary: () => genetics(), genetics_punnett: () => genetics(),
  bio_cell_division: () => mitosis(), dna_protein: () => dnaChart(), periodic_trends: () => periodicTrends(), electron_config: () => periodicTrends(),
  energy_resources: () => energyResources(), sustainability: () => energyResources(), protect_earth: () => energyResources(),
  half_life: () => halfLife(), atmosphere_oceans: () => atmosphereLayers(), earth_weather: () => atmosphereLayers(),
  ecosystem_relationships: () => relationships(), ecosystems: () => relationships(),
  body_digestive: () => digestive(), body_circulatory: () => circulatory(), body_respiratory: () => respiratory(), body_nervous: () => nervous(), human_body_systems: () => bodySystems(), body_skeletal_muscular: () => bodySystems(),
  classification: () => classification(), forces_laws: () => newtonsLaws(), kinetic_potential: () => kineticPotential(),
  gas_laws: () => gasLaws(), molar_mass: () => chemFormulas(), molarity: () => chemFormulas(), balancing_equations: () => balancingChart(), reaction_types: () => reactionTypes(), chemistry_reactions: () => reactionTypes(),
  electricity: (g) => electricityChart(g), circuits: () => electricityChart(11),
  earth_patterns: () => seasons(), gravity_orbits: () => seasons(),
  light_sound: () => wavesChart(), sound_vibrations: () => wavesChart(),
  forces_speed: () => speedTriangle(), kinematics: () => physicsKit(), physics_formulas: () => physicsKit(), work_power: () => physicsKit(), momentum: () => physicsKit(),
  density: () => densityTriangle(),
};


// ---------------------------------------------------------------- round 2: more math

function hundredChart(highlight: "tens" | "fives" | "none"): AnchorChart {
  const shapes: Shape[] = [];
  const c = 26;
  for (let i = 0; i < 50; i++) {
    const v = i + 1, x = (i % 10) * (c + 1), y = Math.floor(i / 10) * (c + 1);
    const on = highlight === "tens" ? v % 10 === 0 : highlight === "fives" ? v % 5 === 0 : false;
    shapes.push({ k: "rect", x, y, w: c, h: c, fill: on ? F[1] : i % 10 === 4 ? "#f8fafc" : "#fff", stroke: "#94a3b8", sw: 0.8 }, T(x + c / 2, y + 17, String(v), 10.5, "middle", on));
  }
  shapes.push(...arrow(275, 20, 300, 20, BLUE), T(306, 24, "+1 → one step right", 11, "start", true, BLUE), ...arrow(287, 44, 287, 72, RED), T(306, 62, "+10 → one row down", 11, "start", true, RED));
  shapes.push(T(306, 100, "−1 left · −10 up", 11, "start", false, MUTED));
  return { title: "Hundred chart (1–50)", visual: { w: W, h: 5 * (c + 1), shapes, alt: "Numbers 1 to 50 in rows of ten" } };
}

function numberLineHops(): AnchorChart {
  const shapes: Shape[] = [];
  const x0 = 14, step = 34, y = 60;
  shapes.push(Ln(x0 - 6, y, x0 + 14 * step, y, INK, 1.6));
  for (let i = 0; i <= 14; i++) shapes.push(Ln(x0 + i * step, y - 5, x0 + i * step, y + 5, INK, 1.1), T(x0 + i * step, y + 18, String(i), 10, "middle", i === 5 || i === 13));
  for (let i = 5; i < 13; i++) shapes.push({ k: "poly", pts: Array.from({ length: 9 }, (_, k) => [x0 + i * step + (k / 8) * step, y - 4 - Math.sin((k / 8) * Math.PI) * 18] as [number, number]), stroke: BLUE, sw: 1.6 });
  shapes.push(T(x0 + 9 * step, 18, "5 + ? = 13 → count the hops: 8", 12, "middle", true, BLUE));
  return { title: "Counting on with a number line", visual: { w: W, h: 84, shapes, alt: "Number line with hops from 5 to 13" } };
}

function columnRegroup(sub: boolean): AnchorChart {
  const shapes: Shape[] = [];
  const cw = 26, X = (i: number) => 60 + i * cw;
  const top = sub ? ["", "5", "¹2"] : ["", "4", "7"], bot = sub ? ["−", "1", "8"] : ["+", "3", "6"], ans = sub ? ["", "3", "4"] : ["", "8", "3"];
  if (sub) shapes.push(T(X(1) + 10, 10, "4", 11, "middle", true, RED), Ln(X(1) - 2, 22, X(1) + 8, 14, RED, 1.4));
  else shapes.push(T(X(1), 12, "1", 11, "middle", true, RED));
  [top, bot, ans].forEach((row, r) => row.forEach((d, i) => shapes.push(T(X(i), 34 + r * 24, d, 18, "middle", true, r === 2 ? BLUE : INK))));
  shapes.push(Ln(40, 66, 120, 66, INK, 1.8), T(X(1), 104, "tens", 9.5, "middle", false, MUTED), T(X(2), 104, "ones", 9.5, "middle", false, MUTED));
  const lines = sub ? ["Start with the ones.", "Not enough ones? Trade 1 ten", "for 10 ones (regroup).", "52 − 18 = 34"] : ["Start with the ones: 7 + 6 = 13.", "Write 3, carry the 1 ten.", "Then the tens: 1 + 4 + 3 = 8.", "47 + 36 = 83"];
  lines.forEach((t, i) => shapes.push(T(170, 26 + i * 22, t, 12, "start", i === 3, i === 3 ? BLUE : INK)));
  return { title: sub ? "Subtracting with regrouping" : "Adding with regrouping", visual: { w: W, h: 108, shapes, alt: sub ? "52 minus 18 with regrouping" : "47 plus 36 with carrying" } };
}

function areaModel(): AnchorChart {
  const shapes: Shape[] = [R(40, 20, 160, 60, F[0], 0), R(200, 20, 50, 60, F[1], 0), R(40, 80, 160, 26, F[2], 0), R(200, 80, 50, 26, F[3], 0)];
  shapes.push(T(120, 14, "20", 11, "middle", true, BLUE), T(225, 14, "3", 11, "middle", true, BLUE), T(32, 54, "10", 11, "end", true, BLUE), T(32, 97, "4", 11, "end", true, BLUE));
  shapes.push(T(120, 55, "200", 13, "middle", true), T(225, 55, "30", 13, "middle", true), T(120, 98, "80", 13, "middle", true), T(225, 98, "12", 13, "middle", true));
  ["23 × 14", "= 200 + 30 + 80 + 12", "= 322", "Split each number into tens and ones,", "multiply each part, then add."].forEach((t, i) => shapes.push(T(280, 26 + i * 20, t, 12, "start", i < 3, i < 3 ? BLUE : INK)));
  return { title: "Area model for multiplication", visual: { w: W, h: 110, shapes, alt: "Area model for 23 × 14 = 322" } };
}

function factorTree(): AnchorChart {
  const shapes: Shape[] = [];
  const node = (x: number, y: number, t: string, prime = false) => { shapes.push({ k: "circle", cx: x, cy: y, r: 13, fill: prime ? F[2] : F[0], stroke: INK, sw: 1.3 }, T(x, y + 4.5, t, 12, "middle", true)); };
  shapes.push(Ln(80, 16, 50, 50, MUTED), Ln(80, 16, 110, 50, MUTED), Ln(110, 50, 85, 86, MUTED), Ln(110, 50, 135, 86, MUTED));
  node(80, 16, "36"); node(50, 50, "2", true); node(110, 50, "18"); node(85, 86, "2", true); node(135, 86, "9");
  shapes.push(Ln(135, 86, 120, 118, MUTED), Ln(135, 86, 150, 118, MUTED)); node(120, 118, "3", true); node(150, 118, "3", true);
  ["36 = 2 × 2 × 3 × 3", "Prime: exactly 2 factors (2, 3, 5, 7, 11…)", "Composite: more than 2 factors", "GCF: biggest factor both share", "LCM: smallest multiple both share"].forEach((t, i) => shapes.push(T(200, 22 + i * 22, t, 11.5, "start", i === 0, i === 0 ? BLUE : INK)));
  return { title: "Factors and primes", visual: { w: W, h: 134, shapes, alt: "Factor tree of 36" } };
}

function decimalAlign(): AnchorChart {
  const shapes: Shape[] = [];
  [["", "1", "2", ".", "5"], ["+", "", "3", ".", "7", "5"], ["", "1", "6", ".", "2", "5"]].forEach((row, r) => row.forEach((d, i) => shapes.push(T(40 + i * 18, 26 + r * 24, d, 17, "middle", true, r === 2 ? BLUE : d === "." ? RED : INK))));
  shapes.push(T(40 + 5 * 18, 26, "0", 17, "middle", true, "#94a3b8"), Ln(20, 58, 160, 58, INK, 1.8));
  ["Line up the decimal points.", "Fill gaps with zeros (12.5 = 12.50).", "Multiplying: count decimal places", "in both numbers: 0.3 × 0.2 = 0.06"].forEach((t, i) => shapes.push(T(190, 22 + i * 22, t, 12, "start", i === 0)));
  return { title: "Working with decimals", visual: { w: W, h: 96, shapes, alt: "12.50 + 3.75 = 16.25 with decimal points lined up" } };
}

function wordsToSymbols(): AnchorChart {
  return { title: "Words into maths", visual: cards([{ head: "+", lines: ["sum, more than,", "increased by, total"] }, { head: "−", lines: ["difference, less than,", "fewer, decreased by"] }, { head: "×", lines: ["product, times,", "of, twice (2×)"] }, { head: "÷", lines: ["quotient, per,", "shared equally, half"] }, { head: "=", lines: ["is, equals, gives"] }, { head: "x", lines: ["a number, an", "unknown amount"] }], 3, 50) };
}

function likeTerms(): AnchorChart {
  const shapes: Shape[] = [];
  const tile = (x: number, t: string, f: string) => { shapes.push(R(x, 6, 40, 30, f, 4), T(x + 20, 26, t, 13, "middle", true)); };
  tile(14, "3x", F[0]); tile(60, "+2", F[1]); tile(106, "+x", F[0]); tile(152, "+5", F[1]);
  shapes.push(T(204, 27, "=  4x + 7", 15, "start", true, BLUE), T(330, 27, "same letter & power: like terms", 10.5, "start", false, MUTED));
  shapes.push(R(30, 58, 40, 40, F[2], 0), R(70, 58, 80, 40, F[3], 0), T(50, 82, "3x", 11, "middle", true), T(110, 82, "12", 11, "middle", true));
  shapes.push(T(50, 54, "x", 11, "middle", true, BLUE), T(110, 54, "4", 11, "middle", true, BLUE), T(24, 82, "3", 11, "end", true, BLUE));
  shapes.push(T(170, 84, "3(x + 4) = 3x + 12   (multiply each part)", 12.5, "start", true, BLUE));
  return { title: "Like terms and distributing", visual: { w: W, h: 102, shapes, alt: "Combining like terms and the distributive property" } };
}

function percentChange(): AnchorChart {
  return { title: "Percent change and interest", visual: cards([{ head: "% change", lines: ["(new − old) ÷ old × 100"] }, { head: "Increase by 20%", lines: ["multiply by 1.20"] }, { head: "Decrease by 20%", lines: ["multiply by 0.80"] }, { head: "Simple interest", lines: ["I = P × r × t"] }], 4, 46) };
}

function scaleChart(): AnchorChart {
  const shapes: Shape[] = [R(10, 30, 60, 40, F[0], 0), R(150, 10, 120, 80, F[1], 0), ...arrow(80, 50, 140, 50, BLUE)];
  shapes.push(T(40, 84, "3 cm", 10.5, "middle", true), T(210, 104, "6 cm", 10.5, "middle", true), T(110, 40, "× 2", 12, "middle", true, BLUE));
  ["Scale factor = new ÷ original", "Scale 1 : 100 → 1 cm on paper", "is 100 cm in real life.", "Similar shapes: same angles,", "sides in proportion."].forEach((t, i) => shapes.push(T(290, 20 + i * 19, t, 11, "start", i === 0)));
  return { title: "Scale and similar figures", visual: { w: W, h: 108, shapes, alt: "A rectangle enlarged by a scale factor of 2" } };
}

function numberSets(): AnchorChart {
  const shapes: Shape[] = [R(0, 0, 330, 120, F[4], 12), R(10, 22, 220, 92, F[0], 10), R(20, 44, 150, 64, F[1], 10), R(30, 66, 90, 36, F[2], 8), R(244, 22, 78, 92, F[3], 10)];
  shapes.push(T(165, 15, "Real numbers", 11, "middle", true), T(120, 37, "Rational: −2, ½, 0.75", 10, "middle", true), T(95, 59, "Integers: −3, 0, 4", 10, "middle", true), T(75, 88, "Whole: 0, 1, 2", 10, "middle", true), T(283, 54, "Irrational", 10, "middle", true), T(283, 74, "√2, π", 11, "middle", false, BLUE), T(283, 92, "never ends,", 9, "middle", false, MUTED), T(283, 104, "never repeats", 9, "middle", false, MUTED));
  ["Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100", "Perfect cubes: 1, 8, 27, 64, 125", "√50 = √(25 × 2) = 5√2"].forEach((t, i) => shapes.push(T(340, 22 + i * 40, t.split(": ")[0] + (t.includes(": ") ? ":" : ""), 10.5, "start", true), T(340, 38 + i * 40, t.split(": ")[1] || "", 10, "start", false, BLUE)));
  return { title: "Number sets, squares and roots", visual: { w: W, h: 122, shapes, alt: "Nested number sets with irrational numbers, and perfect squares" } };
}

function systemsChart(): AnchorChart {
  const shapes: Shape[] = [];
  const o = 8, s = 12, P = (x: number, y: number): [number, number] => [o + (x + 1) * s, 4 + (8 - y) * s];
  for (let i = 0; i <= 9; i++) shapes.push(Ln(o + i * s, 4, o + i * s, 4 + 9 * s, "#e2e8f0", 0.7), Ln(o, 4 + i * s, o + 9 * s, 4 + i * s, "#e2e8f0", 0.7));
  shapes.push(Ln(...P(-1, -1), ...P(7, 7), BLUE, 2), Ln(...P(-1, 7), ...P(7, -1), RED, 2), { k: "circle", cx: P(3, 3)[0], cy: P(3, 3)[1], r: 4, fill: INK });
  shapes.push(T(P(3, 3)[0] + 8, P(3, 3)[1] - 6, "(3, 3)", 10.5, "start", true));
  ["The solution is where the lines cross.", "Substitution: solve one equation for a", "variable, put it into the other.", "Elimination: add/subtract equations", "so one variable cancels."].forEach((t, i) => shapes.push(T(140, 20 + i * 20, t, 11.5, "start", i === 0)));
  return { title: "Systems of equations", visual: { w: W, h: 116, shapes, alt: "Two lines crossing at (3, 3)" } };
}

function twoWayTable(): AnchorChart {
  const rows = [["", "Cats", "Dogs", "Total"], ["Boys", "8", "12", "20"], ["Girls", "10", "6", "16"], ["Total", "18", "18", "36"]];
  const shapes: Shape[] = [];
  rows.forEach((r, i) => r.forEach((v, j) => { shapes.push({ k: "rect", x: j * 62, y: i * 24, w: 62, h: 24, fill: i === 0 || j === 0 ? F[0] : i === 3 || j === 3 ? F[1] : "#fff", stroke: INK, sw: 0.9 }, T(j * 62 + 31, i * 24 + 16, v, 11, "middle", i === 0 || j === 0)); }));
  ["Each cell counts BOTH groups:", "8 boys prefer cats.", "Totals add along each row and column.", "Relative frequency = cell ÷ total"].forEach((t, i) => shapes.push(T(270, 20 + i * 22, t, 11, "start", i === 0)));
  return { title: "Two-way tables", visual: { w: W, h: 98, shapes, alt: "A two-way table of boys and girls who prefer cats or dogs" } };
}

function polyBox(): AnchorChart {
  const shapes: Shape[] = [];
  const cells = [["x²", "3x"], ["2x", "6"]];
  shapes.push(T(60, 14, "x", 12, "middle", true, BLUE), T(120, 14, "+3", 12, "middle", true, BLUE), T(20, 44, "x", 12, "end", true, BLUE), T(20, 84, "+2", 12, "end", true, BLUE));
  cells.forEach((r, i) => r.forEach((v, j) => shapes.push(R(30 + j * 60, 22 + i * 40, 60, 40, F[i * 2 + j], 0), T(60 + j * 60, 47 + i * 40, v, 13, "middle", true))));
  ["(x + 2)(x + 3) = x² + 5x + 6", "Factoring x² + bx + c: find two", "numbers that multiply to c and add to b.", "a² − b² = (a + b)(a − b)", "(a + b)² = a² + 2ab + b²"].forEach((t, i) => shapes.push(T(180, 22 + i * 20, t, 11.5, "start", i === 0 || i >= 3, i === 0 ? BLUE : INK)));
  return { title: "Multiplying and factoring polynomials", visual: { w: W, h: 106, shapes, alt: "Box method for (x + 2)(x + 3)" } };
}

function absValueEq(): AnchorChart {
  const shapes: Shape[] = [];
  const x0 = 20, st = 26, y = 40;
  shapes.push(Ln(x0 - 6, y, x0 + 16 * st, y, INK, 1.4));
  for (let i = 0; i <= 16; i++) shapes.push(Ln(x0 + i * st, y - 4, x0 + i * st, y + 4, INK, 1), ...(i % 2 === 0 ? [T(x0 + i * st, y + 17, String(i - 8).replace("-", "−"), 9.5, "middle", i === 8 || i === 3 || i === 13)] : []));
  shapes.push({ k: "circle", cx: x0 + 3 * st, cy: y, r: 5, fill: BLUE }, { k: "circle", cx: x0 + 13 * st, cy: y, r: 5, fill: BLUE });
  shapes.push({ k: "poly", pts: Array.from({ length: 13 }, (_, k) => [x0 + 8 * st + (k / 12) * 5 * st, y - 6 - Math.sin((k / 12) * Math.PI) * 18] as [number, number]), stroke: RED, sw: 1.4 }, { k: "poly", pts: Array.from({ length: 13 }, (_, k) => [x0 + 8 * st - (k / 12) * 5 * st, y - 6 - Math.sin((k / 12) * Math.PI) * 18] as [number, number]), stroke: RED, sw: 1.4 });
  shapes.push(T(W / 2, 80, "|x| = 5 means x is 5 away from 0: x = 5 or x = −5", 12, "middle", true, BLUE), T(W / 2, 98, "|x − a| = b → x − a = b or x − a = −b (two answers)", 10.5, "middle"));
  return { title: "Absolute value equations", visual: { w: W, h: 104, shapes, alt: "Points −5 and 5 are both 5 away from 0" } };
}

function growthCurve(): AnchorChart {
  const shapes: Shape[] = [];
  const o = 20, base = 100;
  shapes.push(Ln(o, 6, o, base, INK, 1.3), Ln(o, base, o + 200, base, INK, 1.3));
  const up: [number, number][] = [], down: [number, number][] = [];
  for (let t = 0; t <= 5; t += 0.1) { up.push([o + t * 38, base - 8 * Math.pow(1.6, t)]); down.push([o + t * 38, base - 88 * Math.pow(0.6, t)]); }
  shapes.push({ k: "poly", pts: up.filter(([, yy]) => yy > 4), stroke: BLUE, sw: 2.2 }, { k: "poly", pts: down, stroke: RED, sw: 2.2 });
  shapes.push(T(150, 30, "growth: b > 1", 10.5, "start", true, BLUE), T(24, 116, "red: decay, 0 < b < 1", 10, "start", true, RED));
  ["y = a · bˣ", "a = starting amount", "b = growth factor (1 + rate)", "logᵦ(x) = y  means  bʸ = x", "log(ab) = log a + log b", "log(aⁿ) = n · log a"].forEach((t, i) => shapes.push(T(260, 18 + i * 17.5, t, 11, "start", i === 0 || i === 3, i === 0 || i === 3 ? BLUE : INK)));
  return { title: "Exponentials and logarithms", visual: { w: W, h: 120, shapes, alt: "Exponential growth and decay curves with log rules" } };
}

function sequencesChart(): AnchorChart {
  return { title: "Sequences and series", visual: cards([{ head: "Arithmetic: +d each time", lines: ["3, 7, 11, 15… (d = 4)", "aₙ = a₁ + (n − 1)d"] }, { head: "Geometric: ×r each time", lines: ["2, 6, 18, 54… (r = 3)", "aₙ = a₁ · rⁿ⁻¹"] }, { head: "Arithmetic sum", lines: ["Sₙ = n(a₁ + aₙ) ÷ 2"] }, { head: "Geometric sum", lines: ["Sₙ = a₁(1 − rⁿ) ÷ (1 − r)"] }], 2, 50) };
}

function unitCircle(): AnchorChart {
  const shapes: Shape[] = [];
  const cx = 100, cy = 76, r = 56;
  shapes.push(Ln(cx - r - 10, cy, cx + r + 10, cy, INK, 1.2), Ln(cx, cy - r - 8, cx, cy + r + 8, INK, 1.2), { k: "circle", cx, cy, r, fill: "none", stroke: BLUE, sw: 1.8 });
  const pts: [number, string][] = [[0, "(1, 0)"], [30, "(√3/2, ½)"], [45, "(√2/2, √2/2)"], [60, "(½, √3/2)"], [90, "(0, 1)"], [180, "(−1, 0)"], [270, "(0, −1)"]];
  for (const [deg, lab] of pts) {
    const a = (deg * Math.PI) / 180, x = cx + Math.cos(a) * r, y = cy - Math.sin(a) * r;
    shapes.push({ k: "circle", cx: x, cy: y, r: 3, fill: RED });
    if (deg <= 60 && deg > 0) shapes.push(T(x + 6, y - 2, `${deg}° ${lab}`, 8.5, "start", false, MUTED));
    else shapes.push(T(x + (deg === 180 ? -6 : 6), y + (deg === 90 ? -6 : deg === 270 ? 12 : -4), lab, 8.5, deg === 180 ? "end" : "start", false, MUTED));
  }
  ["Point on the circle = (cos θ, sin θ)", "tan θ = sin θ ÷ cos θ", "180° = π radians", "sin² θ + cos² θ = 1", "Law of sines: a/sin A = b/sin B", "Law of cosines: c² = a² + b² − 2ab cos C"].forEach((t, i) => shapes.push(T(250, 18 + i * 19, t, 11, "start", i < 2, i < 2 ? BLUE : INK)));
  return { title: "Unit circle and trig laws", visual: { w: W, h: 150, shapes, alt: "Unit circle with key angles, and trig identities" } };
}

function functionsHS(): AnchorChart {
  return { title: "Function toolkit", visual: cards([{ head: "f(x) + k", lines: ["shift up k"] }, { head: "f(x − h)", lines: ["shift right h"] }, { head: "−f(x)", lines: ["reflect in x-axis"] }, { head: "a·f(x)", lines: ["stretch by a"] }, { head: "Inverse f⁻¹", lines: ["swap x and y, solve for y", "mirror image in y = x"] }, { head: "(f ∘ g)(x)", lines: ["= f(g(x))", "do g first"] }], 3, 48) };
}

function complexChart(): AnchorChart {
  const shapes: Shape[] = [];
  [["i", "i"], ["i²", "−1"], ["i³", "−i"], ["i⁴", "1"]].forEach(([a, b], i) => { const ang = -Math.PI / 2 + (i * Math.PI) / 2, x = 70 + Math.cos(ang) * 44, y = 60 + Math.sin(ang) * 44; shapes.push({ k: "circle", cx: x, cy: y, r: 17, fill: F[i], stroke: INK, sw: 1.2 }, T(x, y - 1, a, 10.5, "middle", true), T(x, y + 11, `= ${b}`, 9, "middle", false, BLUE)); });
  ["Powers of i repeat every 4.", "a + bi: real part a, imaginary part b", "(a + bi)(a − bi) = a² + b²", "Remainder theorem: f(x) ÷ (x − c)", "leaves remainder f(c).", "If f(c) = 0, then x = c is a zero."].forEach((t, i) => shapes.push(T(160, 18 + i * 19, t, 11, "start", i === 0 || i === 3)));
  return { title: "Complex numbers and polynomials", visual: { w: W, h: 120, shapes, alt: "The cycle of powers of i" } };
}

function rationalRadical(): AnchorChart {
  return { title: "Rational and radical equations", visual: flow([{ head: "Factor", sub: "top and bottom" }, { head: "Restrictions", sub: "denominator ≠ 0" }, { head: "Cancel / isolate", sub: "simplify or get √ alone" }, { head: "Square / clear", sub: "both sides" }, { head: "Check", sub: "reject extra answers" }]) };
}

function normalCurve(): AnchorChart {
  const shapes: Shape[] = [];
  const cx = 150, base = 100, sd = 42;
  const pts: [number, number][] = [];
  for (let x = -3.4; x <= 3.4; x += 0.1) pts.push([cx + x * sd, base - 82 * Math.exp(-x * x / 2)]);
  shapes.push({ k: "poly", pts, stroke: BLUE, sw: 2.2 }, Ln(cx - 3.5 * sd, base, cx + 3.5 * sd, base, INK, 1.2));
  for (let k = -3; k <= 3; k++) shapes.push(Ln(cx + k * sd, base, cx + k * sd, base - 82 * Math.exp(-k * k / 2), "#94a3b8", 1, true), T(cx + k * sd, base + 13, k === 0 ? "μ" : `${k > 0 ? "+" : "−"}${Math.abs(k)}σ`, 9, "middle"));
  ["68% within 1σ", "95% within 2σ", "99.7% within 3σ", "z = (x − μ) ÷ σ", "nPr = n! ÷ (n − r)!  (order matters)", "nCr = n! ÷ (r!(n − r)!)"].forEach((t, i) => shapes.push(T(310, 18 + i * 18, t, 11, "start", i === 3, i === 3 ? BLUE : INK)));
  return { title: "Normal distribution and counting", visual: { w: W, h: 116, shapes, alt: "A normal curve with standard deviations marked" } };
}

function matrixVector(): AnchorChart {
  const shapes: Shape[] = [];
  const br = (x: number, y: number, h: number, right = false) => shapes.push({ k: "poly", pts: right ? [[x - 4, y], [x, y], [x, y + h], [x - 4, y + h]] : [[x + 4, y], [x, y], [x, y + h], [x + 4, y + h]], stroke: INK, sw: 1.4 });
  br(4, 10, 44); shapes.push(T(20, 28, "1", 12, "middle", true, RED), T(40, 28, "2", 12, "middle", true, RED), T(20, 46, "3", 12), T(40, 46, "4", 12)); br(56, 10, 44, true);
  br(66, 10, 44); shapes.push(T(80, 28, "5", 12, "middle", true, RED), T(80, 46, "6", 12, "middle", true, RED)); br(94, 10, 44, true);
  shapes.push(T(104, 36, "=", 13), T(118, 30, "1·5 + 2·6 = 17", 11, "start", true, RED), T(118, 48, "3·5 + 4·6 = 39", 11, "start"));
  shapes.push(T(10, 80, "Row × column, then add.", 11, "start", true), T(10, 98, "det [a b; c d] = ad − bc", 11, "start", false, BLUE));
  shapes.push(...arrow(250, 100, 330, 40, BLUE, 2), Ln(250, 100, 330, 100, MUTED, 1.2, true), Ln(330, 100, 330, 40, MUTED, 1.2, true), T(290, 114, "x = 4", 10, "middle"), T(336, 74, "y = 3", 10, "start"), T(282, 62, "|v| = 5", 11, "end", true, BLUE));
  shapes.push(T(390, 30, "v = ⟨4, 3⟩", 11, "start", true), T(390, 50, "|v| = √(x² + y²)", 11, "start"), T(390, 70, "add: tip to tail", 11, "start"));
  return { title: "Matrices and vectors", visual: { w: W, h: 120, shapes, alt: "Multiplying a matrix by a vector, and a vector's magnitude" } };
}

function calculusChart(): AnchorChart {
  return { title: "Calculus rules", visual: cards([{ head: "Limit", lines: ["value f(x) approaches", "as x → a"] }, { head: "d/dx xⁿ = n xⁿ⁻¹", lines: ["power rule"] }, { head: "d/dx (constant) = 0", lines: ["slope of a flat line"] }, { head: "∫ xⁿ dx = xⁿ⁺¹ ÷ (n + 1) + C", lines: ["n ≠ −1"] }, { head: "Derivative", lines: ["slope of the tangent"] }, { head: "Integral", lines: ["area under the curve"] }], 3, 48) };
}

function oddEven(): AnchorChart {
  const shapes: Shape[] = [];
  const pairs = (x: number, n: number, label: string) => {
    for (let i = 0; i < n; i++) shapes.push({ k: "circle", cx: x + Math.floor(i / 2) * 22, cy: 20 + (i % 2) * 22, r: 8, fill: i === n - 1 && n % 2 ? F[7] : F[0], stroke: INK, sw: 1.1 });
    shapes.push(T(x - 4, 66, label, 11.5, "start", true));
  };
  pairs(14, 8, "8 is even: every dot has a partner"); pairs(300, 7, "7 is odd: one left over");
  shapes.push(T(W / 2, 90, "Even numbers end in 0, 2, 4, 6, 8. Odd numbers end in 1, 3, 5, 7, 9.", 10.5, "middle", false, MUTED));
  return { title: "Odd and even", visual: { w: W, h: 96, shapes, alt: "Dots in pairs for 8 (even) and 7 (odd)" } };
}

function patternRules(): AnchorChart {
  const shapes: Shape[] = [];
  [3, 7, 11, 15, 19].forEach((v, i) => { shapes.push(R(i * 56, 10, 44, 34, F[0], 6), T(i * 56 + 22, 32, String(v), 14, "middle", true)); if (i < 4) shapes.push({ k: "poly", pts: Array.from({ length: 9 }, (_, k) => [i * 56 + 26 + (k / 8) * 50, 8 - Math.sin((k / 8) * Math.PI) * 8] as [number, number]), stroke: RED, sw: 1.4 }, T(i * 56 + 50, -2 + 8, "+4", 9.5, "middle", true, RED)); });
  ["Find the rule: what happens each time?", "Rule: start at 3, add 4.", "Check the rule works for every step."].forEach((t, i) => shapes.push(T(290, 18 + i * 20, t, 11.5, "start", i === 1, i === 1 ? BLUE : INK)));
  return { title: "Number patterns", visual: { w: W, h: 64, shapes: shapes.map((sh) => (sh.k === "rect" ? { ...sh, y: sh.y + 8 } : sh.k === "text" && sh.x < 290 ? { ...sh, y: sh.y + 8 } : sh.k === "poly" ? { ...sh, pts: sh.pts.map(([a, b]) => [a, b + 8] as [number, number]) } : sh)), alt: "Pattern 3, 7, 11, 15, 19 adding 4 each time" } };
}

function wordProblemSteps(): AnchorChart {
  return { title: "Solving word problems", visual: flow([{ head: "Read", sub: "twice" }, { head: "Find", sub: "what is asked" }, { head: "Draw", sub: "a bar model" }, { head: "Solve", sub: "+ − × ÷" }, { head: "Check", sub: "does it make sense?" }]) };
}

function compareLengthChart(): AnchorChart {
  const shapes: Shape[] = [R(10, 14, 300, 26, "#fde68a", 3)];
  for (let i = 0; i <= 15; i++) shapes.push(Ln(20 + i * 18.5, 14, 20 + i * 18.5, 14 + (i % 5 === 0 ? 12 : 7), INK, 1), ...(i % 5 === 0 ? [T(20 + i * 18.5, 36, String(i), 9, "middle", true)] : []));
  shapes.push(T(320, 32, "cm", 10, "start", true));
  ["Start measuring at 0.", "100 cm = 1 m · 12 in = 1 ft", "Longer − shorter = how much longer"].forEach((t, i) => shapes.push(T(10, 64 + i * 18, t, 11, "start", i === 0)));
  return { title: "Measuring length", visual: { w: W, h: 104, shapes, alt: "A ruler marked in centimetres" } };
}

// ---------------------------------------------------------------- round 2: more English

function synAnt(): AnchorChart {
  return { title: "Synonyms and antonyms", visual: cards([{ head: "Synonyms =", lines: ["words that mean the same", "big = large, happy = glad"], fill: F[2] }, { head: "Antonyms ↔", lines: ["words with opposite meanings", "hot ↔ cold, early ↔ late"], fill: F[7] }], 2, 52) };
}

function shadesChart(): AnchorChart {
  const shapes: Shape[] = [];
  const words = ["cool", "warm", "hot", "scorching"];
  words.forEach((w, i) => { shapes.push(R(i * 128, 40 - i * 10, 120, 30 + i * 10, ["#bae6fd", "#fde68a", "#fdba74", "#f87171"][i], 4), T(i * 128 + 60, 64, w, 13, "middle", true)); });
  shapes.push(T(W / 2, 90, "Words can mean nearly the same but be stronger or weaker: look → stare → glare", 10.5, "middle", false, MUTED));
  return { title: "Shades of meaning", visual: { w: W, h: 96, shapes, alt: "cool, warm, hot, scorching from weakest to strongest" } };
}

function homophonesChart(): AnchorChart {
  return { title: "Homophones: sound the same, mean different things", visual: cards([{ head: "their", lines: ["belongs to them"] }, { head: "there", lines: ["a place: over there"] }, { head: "they're", lines: ["they are"] }, { head: "to / too / two", lines: ["direction / also / 2"] }, { head: "your / you're", lines: ["belongs to you / you are"] }, { head: "its / it's", lines: ["belongs to it / it is"] }], 3, 44) };
}

function pronounChart(): AnchorChart {
  return { title: "Pronouns", visual: cards([{ head: "Subject", lines: ["does the action", "I, he, she, we, they, who"] }, { head: "Object", lines: ["receives the action", "me, him, her, us, them, whom"] }, { head: "Possessive", lines: ["shows owner", "my, his, her, our, their"] }, { head: "Relative", lines: ["who (people), which (things)", "that, whose"] }], 4, 56) };
}

function conjunctionChart(): AnchorChart {
  const shapes: Shape[] = [];
  "FANBOYS".split("").forEach((c, i) => { shapes.push(R(i * 46, 0, 40, 40, F[i % F.length], 6), T(i * 46 + 20, 26, c, 18, "middle", true)); shapes.push(T(i * 46 + 20, 56, ["for", "and", "nor", "but", "or", "yet", "so"][i], 11, "middle", true, BLUE)); });
  ["FANBOYS join two complete", "sentences (add a comma).", "because, when, although, if", "start a dependent clause."].forEach((t, i) => shapes.push(T(340, 14 + i * 18, t, 10.5, "start", i === 2, i === 2 ? BLUE : INK)));
  return { title: "Conjunctions", visual: { w: W, h: 66, shapes, alt: "FANBOYS: for, and, nor, but, or, yet, so" } };
}

function analogyChart(): AnchorChart {
  const shapes: Shape[] = [T(10, 26, "hot : cold :: up : down", 17, "start", true, BLUE), T(10, 46, "“hot is to cold as up is to down”", 11, "start", false, MUTED)];
  shapes.push(...cards([{ head: "Opposites", lines: ["big : small"] }, { head: "Same meaning", lines: ["fast : quick"] }, { head: "Part : whole", lines: ["wheel : car"] }, { head: "Tool : job", lines: ["pen : write"] }], 4, 40).shapes.map((sh) => (sh.k === "rect" ? { ...sh, y: sh.y + 58 } : sh.k === "text" ? { ...sh, y: sh.y + 58 } : sh)));
  return { title: "Analogies", visual: { w: W, h: 100, shapes, alt: "Analogy types" } };
}

function idiomChart(): AnchorChart {
  const shapes: Shape[] = [R(0, 6, 240, 70, F[1], 10), T(120, 30, "“It's raining cats and dogs.”", 12, "middle", true), T(120, 54, "What it SAYS: animals falling", 10.5, "middle", false, MUTED)];
  shapes.push(...arrow(248, 41, 278, 41), R(282, 6, 238, 70, F[2], 10), T(400, 30, "What it MEANS:", 12, "middle", true), T(400, 54, "it's raining very hard", 12, "middle", false, BLUE));
  shapes.push(T(W / 2, 96, "An idiom's meaning is different from its words. Use the context to work it out.", 10.5, "middle", false, MUTED));
  return { title: "Idioms", visual: { w: W, h: 102, shapes, alt: "An idiom: what it says versus what it means" } };
}

function toneChart(): AnchorChart {
  return { title: "Tone and mood", visual: cards([{ head: "Tone", lines: ["the author's attitude"] }, { head: "Mood", lines: ["how the reader feels"] }, { head: "Positive", lines: ["cheerful, hopeful, playful"] }, { head: "Negative", lines: ["bitter, gloomy, anxious"] }, { head: "Neutral", lines: ["formal, objective, calm"] }, { head: "Clues", lines: ["word choice, details, setting"] }], 3, 44) };
}

function sourcesChart(): AnchorChart {
  return { title: "Sources and evidence", visual: cards([{ head: "Primary", lines: ["first-hand: diary, photo,", "interview, original data"] }, { head: "Secondary", lines: ["about the event later:", "textbook, review, article"] }, { head: "Is it credible?", lines: ["Who wrote it? When?", "Evidence? Purpose? Bias?"] }], 3, 54) };
}

function modifiersChart(): AnchorChart {
  return { title: "Clear sentences", visual: cards([{ head: "Misplaced modifier ✗", lines: ["I saw a dog running to school.", "✓ Running to school, I saw a dog."] }, { head: "Parallelism ✗", lines: ["I like to swim, biking and to run.", "✓ I like swimming, biking and running."] }, { head: "Active voice", lines: ["The dog chased the ball.", "(the subject does the action)"] }, { head: "Passive voice", lines: ["The ball was chased by the dog.", "(the action is done to the subject)"] }], 2, 50) };
}

function verbalsMoods(): AnchorChart {
  return { title: "Verbals and verb moods", visual: cards([{ head: "Gerund (-ing noun)", lines: ["Swimming is fun."] }, { head: "Participle (adjective)", lines: ["the broken vase"] }, { head: "Infinitive (to + verb)", lines: ["I want to win."] }, { head: "Indicative", lines: ["states a fact"] }, { head: "Imperative", lines: ["gives a command"] }, { head: "Subjunctive", lines: ["wish: If I were…"] }], 3, 44) };
}

function fallacyChart(): AnchorChart {
  return { title: "Logical fallacies", visual: cards([{ head: "Bandwagon", lines: ["everyone does it"] }, { head: "Ad hominem", lines: ["attacks the person"] }, { head: "Straw man", lines: ["twists the other argument"] }, { head: "Slippery slope", lines: ["one step → disaster"] }, { head: "False choice", lines: ["only two options given"] }, { head: "Hasty generalization", lines: ["too little evidence"] }], 3, 42) };
}

function confusedWords(): AnchorChart {
  return { title: "Commonly confused words", visual: cards([{ head: "affect / effect", lines: ["verb / noun (usually)"] }, { head: "then / than", lines: ["time / comparing"] }, { head: "accept / except", lines: ["receive / leave out"] }, { head: "who / whom", lines: ["he → who, him → whom"] }, { head: "fewer / less", lines: ["count / amount"] }, { head: "lie / lay", lines: ["recline / put something"] }], 3, 42) };
}

function spellingRules(): AnchorChart {
  return { title: "Spelling rules", visual: cards([{ head: "i before e", lines: ["except after c", "friend, receive"] }, { head: "Drop the e", lines: ["make → making", "before -ing, -ed"] }, { head: "Double it", lines: ["run → running", "short vowel + 1 consonant"] }, { head: "y → i", lines: ["happy → happier", "before -er, -es, -ed"] }], 4, 52) };
}

function vocabMap(): AnchorChart {
  const shapes: Shape[] = [];
  const spots: [number, number, string][] = [[80, 18, "Meaning"], [440, 18, "Synonym"], [80, 98, "Use it in a sentence"], [440, 98, "Draw it"]];
  spots.forEach(([x, y]) => shapes.push(Ln(260, 58, x, y, MUTED, 1.2)));
  spots.forEach(([x, y, t], i) => shapes.push(R(x - 74, y - 14, 148, 28, F[[0, 2, 3, 4][i]], 6), T(x, y + 4, t, 11, "middle", true)));
  shapes.push(R(200, 40, 120, 36, F[1], 18), T(260, 63, "new word", 12, "middle", true));
  return { title: "Learning a new word", visual: { w: W, h: 114, shapes, alt: "A word map: meaning, synonym, sentence, picture" } };
}

// ---------------------------------------------------------------- round 2: more science

function energyFormsChart(): AnchorChart {
  return { title: "Forms of energy", visual: cards([{ head: "Light", lines: ["sun, bulb"] }, { head: "Heat (thermal)", lines: ["fire, warm hands"] }, { head: "Sound", lines: ["drum, voice"] }, { head: "Motion (kinetic)", lines: ["rolling ball"] }, { head: "Electrical", lines: ["battery, wires"] }, { head: "Stored (potential)", lines: ["stretched band, food"] }], 3, 42) };
}

function structuresChart(): AnchorChart {
  return { title: "Structures that help living things survive", visual: cards([{ head: "Roots", lines: ["take in water"] }, { head: "Thorns", lines: ["protect a plant"] }, { head: "Fur / feathers", lines: ["keep warm"] }, { head: "Claws / beaks", lines: ["catch and eat food"] }, { head: "Shells", lines: ["protection"] }, { head: "Camouflage", lines: ["hide from predators"] }], 3, 40) };
}

function gravityChart(): AnchorChart {
  return { title: "Gravity, mass and weight", visual: cards([{ head: "Gravity", lines: ["pulls objects toward", "each other (and down)"] }, { head: "Mass", lines: ["amount of matter (kg)", "same everywhere"] }, { head: "Weight", lines: ["pull of gravity (N)", "less on the Moon"] }, { head: "F = G m₁m₂ ÷ r²", lines: ["bigger masses pull more,", "distance weakens it"] }], 4, 54) };
}

function conservationChart(): AnchorChart {
  const shapes: Shape[] = [R(10, 10, 200, 50, F[0], 6), T(110, 32, "Before: 50 g + 20 g", 12, "middle", true), T(110, 50, "= 70 g", 12, "middle", true, BLUE), ...arrow(216, 35, 296, 35), T(256, 24, "reaction", 10, "middle", false, MUTED), R(300, 10, 210, 50, F[2], 6), T(405, 32, "After: products", 12, "middle", true), T(405, 50, "= 70 g", 12, "middle", true, BLUE)];
  shapes.push(T(W / 2, 84, "Mass is never created or destroyed: total mass before = total mass after.", 11, "middle", true));
  return { title: "Conservation of mass", visual: { w: W, h: 92, shapes, alt: "Mass before a reaction equals mass after" } };
}

function carbonCycle(): AnchorChart {
  return { title: "Cycles of matter", visual: flow([{ head: "Plants", sub: "take in CO₂" }, { head: "Animals", sub: "eat plants" }, { head: "Respiration", sub: "gives out CO₂" }, { head: "Decomposers", sub: "return nutrients" }, { head: "Burning fuels", sub: "adds CO₂" }], true) };
}

function spheresChart(): AnchorChart {
  return { title: "Earth's spheres", visual: cards([{ head: "Geosphere", lines: ["rocks, soil, land"], fill: "#fed7aa" }, { head: "Hydrosphere", lines: ["all water"], fill: "#bfdbfe" }, { head: "Atmosphere", lines: ["air around Earth"], fill: "#e0f2fe" }, { head: "Biosphere", lines: ["all living things"], fill: "#bbf7d0" }], 4, 46) };
}

function waterDistribution(): AnchorChart {
  const shapes: Shape[] = [{ k: "rect", x: 0, y: 14, w: 500, h: 30, fill: "#60a5fa", stroke: INK, sw: 1 }, { k: "rect", x: 485, y: 14, w: 10, h: 30, fill: "#e0f2fe", stroke: INK, sw: 1 }, { k: "rect", x: 495, y: 14, w: 5, h: 30, fill: "#4ade80", stroke: INK, sw: 1 }];
  shapes.push(T(240, 34, "97% salt water (oceans)", 12, "middle", true, "#fff"), T(470, 62, "2% ice", 10.5, "end", true), T(500, 78, "1% fresh liquid water", 10.5, "end", true, "#16a34a"));
  shapes.push(T(10, 70, "Only a tiny part of Earth's water is fresh water we can use.", 11, "start"));
  return { title: "Where Earth's water is", visual: { w: W, h: 86, shapes, alt: "97 percent salt water, 2 percent ice, 1 percent fresh water" } };
}

function greenhouse(): AnchorChart {
  const shapes: Shape[] = [{ k: "circle", cx: 30, cy: 30, r: 18, fill: "#fde047", stroke: "#d97706", sw: 1.6 }];
  shapes.push({ k: "rect", x: 0, y: 90, w: 300, h: 24, fill: "#bbf7d0", stroke: INK, sw: 1 }, T(150, 106, "Earth", 11, "middle", true));
  shapes.push(Ln(0, 60, 300, 60, BLUE, 3, true), T(296, 54, "greenhouse gases (CO₂, methane)", 9.5, "end", false, BLUE));
  shapes.push(...arrow(50, 44, 120, 88, "#f59e0b", 2), ...arrow(150, 88, 190, 64, RED, 2), ...arrow(196, 62, 230, 86, RED, 2));
  ["Sunlight passes through the air.", "Earth gives off heat.", "Greenhouse gases trap some heat.", "More gases trap more heat", "→ global warming."].forEach((t, i) => shapes.push(T(320, 20 + i * 20, t, 11, "start", i >= 3, i >= 3 ? RED : INK)));
  return { title: "The greenhouse effect", visual: { w: W, h: 116, shapes, alt: "Sunlight in, heat trapped by greenhouse gases" } };
}

function microscopeChart(): AnchorChart {
  return { title: "Using a microscope", visual: cards([{ head: "Eyepiece", lines: ["look through (10×)"] }, { head: "Objective lens", lines: ["4×, 10×, 40×"] }, { head: "Stage", lines: ["holds the slide"] }, { head: "Light", lines: ["shines up through"] }, { head: "Focus knobs", lines: ["coarse, then fine"] }, { head: "Magnification", lines: ["eyepiece × objective"] }], 3, 40) };
}

function reproductionChart(): AnchorChart {
  return { title: "Reproduction", visual: cards([{ head: "Sexual", lines: ["two parents", "offspring are different", "(variation)"], fill: F[3] }, { head: "Asexual", lines: ["one parent", "offspring are identical", "budding, runners, cuttings"], fill: F[0] }], 2, 66) };
}

function naturalSelection(): AnchorChart {
  return { title: "Natural selection", visual: flow([{ head: "Variation", sub: "traits differ" }, { head: "Too many young", sub: "not all survive" }, { head: "Competition", sub: "food, space" }, { head: "Best-suited survive", sub: "and reproduce" }, { head: "Traits spread", sub: "over generations" }]) };
}

function chemBasics(): AnchorChart {
  const shapes: Shape[] = [T(10, 30, "H₂O", 26, "start", true, BLUE)];
  shapes.push(T(84, 22, "2 hydrogen atoms (the small 2)", 11, "start"), T(84, 40, "1 oxygen atom (no number = 1)", 11, "start"));
  shapes.push(...cards([{ head: "Atom", lines: ["smallest piece"] }, { head: "Element", lines: ["one kind of atom: O"] }, { head: "Molecule", lines: ["atoms bonded: O₂"] }, { head: "Compound", lines: ["different elements: CO₂"] }, { head: "Mixture", lines: ["not bonded: salt water"] }], 5, 40).shapes.map((sh) => (sh.k === "rect" ? { ...sh, y: sh.y + 56 } : sh.k === "text" ? { ...sh, y: sh.y + 56 } : sh)));
  return { title: "Atoms, elements and compounds", visual: { w: W, h: 98, shapes, alt: "Reading the formula H2O, and key chemistry words" } };
}

function biomolecules(): AnchorChart {
  return { title: "Molecules of life", visual: cards([{ head: "Carbohydrates", lines: ["quick energy", "sugar, starch"] }, { head: "Lipids", lines: ["stored energy", "fats, oils"] }, { head: "Proteins", lines: ["build & repair", "enzymes, muscle"] }, { head: "Nucleic acids", lines: ["genetic info", "DNA, RNA"] }], 4, 54) };
}

function transportChart(): AnchorChart {
  const shapes: Shape[] = [Ln(170, 4, 170, 90, INK, 3, true), T(176, 10, "membrane", 9.5, "start", false, MUTED)];
  [[30, 20], [60, 50], [40, 70], [100, 30], [120, 64], [80, 14], [140, 44], [20, 46]].forEach(([x, y]) => shapes.push({ k: "circle", cx: x, cy: y, r: 6, fill: F[0], stroke: INK, sw: 1 }));
  [[220, 30], [260, 64]].forEach(([x, y]) => shapes.push({ k: "circle", cx: x, cy: y, r: 6, fill: F[0], stroke: INK, sw: 1 }));
  shapes.push(...arrow(130, 20, 230, 20, BLUE, 2), T(80, 100, "high concentration", 9.5, "middle", true), T(250, 100, "low", 9.5, "middle", true));
  ["Diffusion: high → low, no energy", "Osmosis: water across a membrane", "Active transport: low → high,", "needs energy (ATP)"].forEach((t, i) => shapes.push(T(300, 22 + i * 22, t, 11, "start", i === 0)));
  return { title: "Moving across membranes", visual: { w: W, h: 110, shapes, alt: "Particles diffusing from high to low concentration" } };
}

function populationCurve(): AnchorChart {
  const shapes: Shape[] = [];
  const o = 40, base = 100;
  shapes.push(Ln(o, 6, o, base, INK, 1.3), Ln(o, base, o + 200, base, INK, 1.3), Ln(o, 24, o + 200, 24, RED, 1.4, true), T(o + 202, 28, "carrying capacity", 9.5, "start", true, RED));
  const pts: [number, number][] = [];
  for (let t = 0; t <= 10; t += 0.2) pts.push([o + t * 20, base - 76 / (1 + Math.exp(-(t - 4)))]);
  shapes.push({ k: "poly", pts, stroke: BLUE, sw: 2.2 }, T(o + 110, base + 14, "time", 9.5, "middle"), T(o - 6, 56, "pop.", 9.5, "end"));
  ["Limiting factors: food, water,", "space, predators, disease.", "Births + immigration add;", "deaths + emigration remove."].forEach((t, i) => shapes.push(T(340, 50 + i * 17, t, 10.5, "start")));
  return { title: "Population growth", visual: { w: W, h: 116, shapes, alt: "S-shaped population curve levelling off at carrying capacity" } };
}

function bondingChart(): AnchorChart {
  return { title: "Chemical bonds", visual: cards([{ head: "Ionic", lines: ["metal + non-metal", "electrons transferred: NaCl"] }, { head: "Covalent", lines: ["non-metals", "electrons shared: H₂O"] }, { head: "Metallic", lines: ["metal atoms", "sea of electrons: Cu"] }], 3, 54) };
}

function organelles(): AnchorChart {
  return { title: "Cell parts and jobs", visual: cards([{ head: "Nucleus", lines: ["control centre, DNA"] }, { head: "Mitochondria", lines: ["release energy"] }, { head: "Ribosomes", lines: ["make proteins"] }, { head: "Cell membrane", lines: ["controls what enters"] }, { head: "Chloroplasts", lines: ["photosynthesis (plants)"] }, { head: "Cell wall", lines: ["support (plants)"] }], 3, 40) };
}

function specificHeat(): AnchorChart {
  return { title: "Heat energy", visual: formulaTriangle("q", "m", "cΔT", ["q = m × c × ΔT", "q = heat energy (J)", "c = specific heat (J/g°C)", "Water: c = 4.18 J/g°C"]) };
}

function keplerChart(): AnchorChart {
  const shapes: Shape[] = [];
  const pts: [number, number][] = [];
  for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 2; pts.push([110 + Math.cos(a) * 90, 56 + Math.sin(a) * 46]); }
  shapes.push({ k: "poly", pts, closed: true, stroke: BLUE, sw: 1.8 }, { k: "circle", cx: 70, cy: 56, r: 10, fill: "#fde047", stroke: "#d97706", sw: 1.4 }, { k: "circle", cx: 196, cy: 44, r: 5, fill: "#60a5fa", stroke: INK, sw: 1 });
  ["1. Orbits are ellipses, Sun at one focus.", "2. Planets move faster near the Sun.", "3. T² ∝ a³ (farther = longer year)", "Stars: nebula → star → red giant", "→ white dwarf (or supernova)"].forEach((t, i) => shapes.push(T(230, 20 + i * 20, t, 11, "start", i < 3)));
  return { title: "Orbits and stars", visual: { w: W, h: 110, shapes, alt: "An elliptical orbit with the Sun at one focus" } };
}

// ---------------------------------------------------------------- round 2 map additions

Object.assign(MATH, {
  counting: () => hundredChart("tens"), count_120: () => hundredChart("none"), ten_more_less: () => hundredChart("tens"), add_tens: () => hundredChart("tens"), skip_counting: () => hundredChart("fives"),
  missing_addend: () => numberLineHops(), three_addends: () => numberLineHops(), equal_sign: () => balanceChart(), add_2d_1d: () => columnRegroup(false),
  add_2d: () => columnRegroup(false), add_3d: () => columnRegroup(false), add_sub_multi: () => columnRegroup(false), sub_2d: () => columnRegroup(true),
  mult_multi: () => areaModel(), mult_comparison: () => arrayChart(), factors_multiples: () => factorTree(), prime_composite: () => factorTree(), gcf_lcm: () => factorTree(),
  decimals_add_sub: () => decimalAlign(), decimals_mul_div: () => decimalAlign(), decimals: () => decimalAlign(), fractions_mul_div: () => fractionWall(),
  write_expressions: () => wordsToSymbols(), write_expressions_alg: () => wordsToSymbols(), expressions: () => wordsToSymbols(), algebra_basics: () => likeTerms(),
  algebra_combine_terms: () => likeTerms(), algebra_distribute: () => likeTerms(), factor_linear: () => likeTerms(),
  percent_change: () => percentChange(), simple_interest: () => percentChange(), scale_drawings: () => scaleChart(), similar_triangles: () => scaleChart(),
  irrational_numbers: () => numberSets(), square_cube_roots: () => numberSets(), radicals: () => numberSets(),
  systems: () => systemsChart(), systems_word: () => systemsChart(), two_way_tables: () => twoWayTable(),
  polynomials: () => polyBox(), factoring_trinomials: () => polyBox(), special_factoring: () => polyBox(),
  absolute_value_equations: () => absValueEq(), exponential: () => growthCurve(), exp_equations: () => growthCurve(), logarithms: () => growthCurve(), log_properties: () => growthCurve(),
  sequences: () => sequencesChart(), series_sum: () => sequencesChart(), unit_circle: () => unitCircle(), law_sines_cosines: () => unitCircle(), trig_equations: () => unitCircle(),
  inverse_functions: () => functionsHS(), function_transformations: () => functionsHS(), complex_numbers: () => complexChart(), poly_remainder: () => complexChart(), poly_zeros: () => complexChart(),
  rational_expressions: () => rationalRadical(), radical_equations: () => rationalRadical(), std_dev_zscore: () => normalCurve(), permutations_combinations: () => normalCurve(),
  matrices: () => matrixVector(), vectors: () => matrixVector(), limits: () => calculusChart(), derivatives_power: () => calculusChart(), integrals_basic: () => calculusChart(),
  odd_even: () => oddEven(), number_patterns: () => patternRules(), wordproblems: (g: number) => (g >= 2 ? wordProblemSteps() : null), two_step_word: () => wordProblemSteps(), compare_length: () => compareLengthChart(),
  bar_models: () => wordProblemSteps(), balance_puzzles: () => balanceChart(),
});
Object.assign(ENGLISH, {
  just_synonyms: () => synAnt(), just_antonyms: () => synAnt(), synonyms_antonyms: () => synAnt(), shades_meaning: () => shadesChart(), homophones: () => homophonesChart(),
  relative_pronouns: () => pronounChart(), pronoun_usage: () => pronounChart(), conjunctions: () => conjunctionChart(), analogies: () => analogyChart(), idioms: () => idiomChart(),
  tone_mood: () => toneChart(), sources: () => sourcesChart(), misplaced_modifiers: () => modifiersChart(), parallelism: () => modifiersChart(), active_passive: () => modifiersChart(),
  verbals: () => verbalsMoods(), verb_moods: () => verbalsMoods(), fallacies: () => fallacyChart(), confused_words: () => confusedWords(), grammar_advanced: () => confusedWords(),
  spelling: () => spellingRules(), vocabulary: () => vocabMap(),
});
Object.assign(SCIENCE, {
  energy_forms: () => energyFormsChart(), structures_survival: () => structuresChart(), adaptations: () => structuresChart(), gravity_basic: () => gravityChart(), gravitation: () => gravityChart(),
  conservation_mass: () => conservationChart(), matter_cycles: () => carbonCycle(), earth_spheres: () => spheresChart(), earth_systems_hs: () => spheresChart(), earth_water: () => waterDistribution(),
  climate_change: () => greenhouse(), microscope: () => microscopeChart(), reproduction: () => reproductionChart(), natural_selection: () => naturalSelection(),
  chemistry_compounds: () => chemBasics(), chemistry_basics: () => chemBasics(), biomolecules: () => biomolecules(), cell_transport: () => transportChart(), ecology_populations: () => populationCurve(),
  bonding: () => bondingChart(), biology_advanced: () => organelles(), specific_heat: () => specificHeat(), keplers_laws: () => keplerChart(), universe: () => keplerChart(),
});

export function anchorChart(subject: string, topic: string, grade: number): AnchorChart | null {
  const map = subject === "math" ? MATH : subject === "english" ? ENGLISH : subject === "science" ? SCIENCE : null;
  return map?.[topic]?.(grade) ?? null;
}

export const ANCHOR_TOPICS = { math: Object.keys(MATH), english: Object.keys(ENGLISH), science: Object.keys(SCIENCE) };
