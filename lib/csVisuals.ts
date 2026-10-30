/**
 * Pictures for Computer Science questions, drawn from `pic` specs made by
 * lib/subjects/csSkills: bit boxes, binary sums, hex digits, colour swatches,
 * logic gates and circuits, code blocks, robot grids, flowcharts, arrays,
 * spreadsheets and password slots. Same Shape primitives as every other
 * worksheet picture, so they render on screen, in print and in the PDF.
 * Pictures show the information, never the answer.
 */
import type { Shape, Visual } from "./worksheetVisuals";

const INK = "#1e293b", MUTED = "#475569", BLUE = "#1d4ed8", PALE = "#f1f5f9", VIOLET = "#7c3aed";
const T = (x: number, y: number, t: string, size = 11, anchor: "start" | "middle" | "end" = "middle", bold = false, fill = INK): Shape => ({ k: "text", x, y, t, size, anchor, bold, fill });
const R = (x: number, y: number, w: number, h: number, fill: string, r = 3, stroke = INK, sw = 1.2): Shape => ({ k: "rect", x, y, w, h, r, fill, stroke, sw });
const Ln = (x1: number, y1: number, x2: number, y2: number, stroke = INK, sw = 1.4): Shape => ({ k: "line", x1, y1, x2, y2, stroke, sw });
function arrow(x1: number, y1: number, x2: number, y2: number, color = MUTED): Shape[] {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 6;
  const p = (s: number): [number, number] => [x2 - Math.cos(a) * h + Math.cos(a + Math.PI / 2) * s, y2 - Math.sin(a) * h + Math.sin(a + Math.PI / 2) * s];
  return [Ln(x1, y1, x2 - Math.cos(a) * 3, y2 - Math.sin(a) * 3, color, 1.5), { k: "poly", pts: [[x2, y2], p(3.5), p(-3.5)], closed: true, fill: color, stroke: color, sw: 1 }];
}
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 16): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

/** Bit boxes under place-value headings (?, or one digit per box). */
function bits(digits: string, n: number): Visual {
  const cw = n > 6 ? 40 : 46, shapes: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const x = i * cw, pv = 2 ** (n - 1 - i);
    shapes.push(R(x, 0, cw - 4, 20, "#e0e7ff", 3, "#94a3b8", 0.8), T(x + (cw - 4) / 2, 14, String(pv), 10.5, "middle", true, BLUE));
    shapes.push(R(x, 24, cw - 4, 32, digits === "?" ? "#fff" : digits[i] === "1" ? "#fde68a" : PALE));
    if (digits !== "?") shapes.push(T(x + (cw - 4) / 2, 46, digits[i], 17, "middle", true));
  }
  return { w: n * cw, h: 58, shapes, alt: digits === "?" ? `${n} empty bit boxes with place values` : `Bits ${digits} under place values` };
}

function binAdd(a: string, b: string): Visual {
  const n = Math.max(a.length, b.length) + 1, cw = 24, shapes: Shape[] = [];
  const row = (s: string, y: number) => s.padStart(n, " ").split("").forEach((d, i) => d.trim() && shapes.push(T(30 + i * cw + cw / 2, y, d, 16, "middle", true)));
  row(a, 22); row(b, 48);
  shapes.push(T(12, 48, "+", 16, "middle", true, BLUE), Ln(20, 58, 30 + n * cw, 58, INK, 1.6));
  for (let i = 0; i < n; i++) shapes.push(R(30 + i * cw + 2, 64, cw - 4, 26, "#fff", 3, "#94a3b8", 0.9));
  shapes.push(T(30 + n * cw + 12, 82, "Remember: 1 + 1 = 10", 10, "start", false, MUTED));
  return { w: 30 + n * cw + 150, h: 94, shapes, alt: `Column addition of binary ${a} and ${b}`, prompt: "Add these binary numbers. Write the answer in binary." };
}

function hexDigits(h: string): Visual {
  const shapes: Shape[] = [];
  [...h].forEach((d, i) => {
    const x = i * 70;
    shapes.push(R(x, 0, 60, 18, "#e0e7ff", 3, "#94a3b8", 0.8), T(x + 30, 13, i === 0 ? "16s" : "1s", 10.5, "middle", true, BLUE), R(x, 22, 60, 34, d === "?" ? "#fff" : "#fde68a"));
    if (d !== "?") shapes.push(T(x + 30, 46, d, 18, "middle", true));
  });
  shapes.push(T(150, 22, "A=10  B=11  C=12", 10.5, "start", false, MUTED), T(150, 38, "D=13  E=14  F=15", 10.5, "start", false, MUTED));
  return { w: 290, h: 58, shapes, alt: "Hexadecimal place-value boxes and digit key" };
}

function colourCode(code: string): Visual {
  const hex = code.slice(1), shapes: Shape[] = [];
  const parts = [["R", hex.slice(0, 2), "#fecaca"], ["G", hex.slice(2, 4), "#bbf7d0"], ["B", hex.slice(4, 6), "#bfdbfe"]];
  shapes.push(R(0, 0, 56, 56, code, 8), T(80, 14, "#", 16, "middle", true));
  parts.forEach(([l, v, f], i) => { const x = 92 + i * 56; shapes.push(R(x, 0, 50, 30, f), T(x + 25, 21, v, 15, "middle", true), T(x + 25, 46, l === "R" ? "red" : l === "G" ? "green" : "blue", 10.5, "middle", false, MUTED)); });
  return { w: 262, h: 58, shapes, alt: `Colour swatch ${code} split into red, green and blue` };
}

/** One gate symbol with its left edge at x and centre y. */
function gateShape(kind: string, x: number, y: number): Shape[] {
  const s: Shape[] = [], h = 34, top = y - h / 2;
  const bubble = (bx: number) => s.push({ k: "circle", cx: bx + 4, cy: y, r: 4, fill: "#fff", stroke: INK, sw: 1.4 });
  if (kind === "NOT") {
    s.push({ k: "poly", pts: [[x, top], [x, top + h], [x + 30, y]], closed: true, fill: "#e0e7ff", stroke: INK, sw: 1.5 });
    bubble(x + 30);
    return s;
  }
  const base = kind.replace(/^N(?=AND|OR)/, "");
  if (base === "AND") s.push({ k: "poly", pts: [[x, top], [x + 20, top], ...arc(x + 20, y, h / 2, -Math.PI / 2, Math.PI / 2), [x, top + h]], closed: true, fill: "#e0e7ff", stroke: INK, sw: 1.5 });
  else {
    // OR shape: curved back, two curved sides meeting at a point.
    const q = (t: number, cy: number): [number, number] => [(1 - t) ** 2 * x + 2 * (1 - t) * t * (x + 26) + t * t * (x + 40), (1 - t) ** 2 * cy + 2 * (1 - t) * t * cy + t * t * y];
    const topSide = Array.from({ length: 11 }, (_, i) => q(i / 10, top));
    const botSide = Array.from({ length: 11 }, (_, i) => q(1 - i / 10, top + h));
    const r = Math.hypot(22, h / 2), a = Math.atan2(h / 2, 22);
    const back = arc(x - 22, y, r, a, -a, 10);
    s.push({ k: "poly", pts: [...topSide, ...botSide, ...back], closed: true, fill: "#e0e7ff", stroke: INK, sw: 1.5 });
    if (base === "XOR") s.push({ k: "poly", pts: arc(x - 29, y, r, a, -a, 10), stroke: INK, sw: 1.5 });
  }
  if (kind.startsWith("N")) bubble(x + 40);
  return s;
}
const gateOut = (kind: string, x: number) => x + (kind === "NOT" ? 38 : kind.startsWith("N") ? 48 : 40);

function oneGate(kind: string, a: string, b?: string): Visual {
  const s: Shape[] = [], gx = 70, y = 40;
  const ins = kind === "NOT" ? [y] : [y - 10, y + 10];
  [a, b].slice(0, ins.length).forEach((v, i) => {
    s.push(T(10, ins[i] + 5, ins.length === 1 ? "A" : "AB"[i], 12, "middle", true, BLUE), R(20, ins[i] - 9, 20, 18, "#fde68a"), T(30, ins[i] + 5, v!, 12, "middle", true), Ln(40, ins[i], gx + (kind === "NOT" ? 0 : kind.includes("OR") ? 6 : 0), ins[i]));
  });
  const ox = gateOut(kind, gx);
  s.push(...gateShape(kind, gx, y), Ln(ox, y, ox + 30, y), R(ox + 30, y - 11, 24, 22, "#fff"), T(ox + 42, y + 20 + 6, "output", 9.5, "middle", false, MUTED));
  s.push(T(gx + 20, 12, kind, 12, "middle", true, VIOLET));
  return { w: ox + 70, h: 80, shapes: s, alt: `${kind} gate with inputs ${[a, b].filter(Boolean).join(" and ")}`, prompt: "What is the output of this gate?" };
}

function circuit(g1: string, g2: string, notC: boolean, A: string, B: string, C: string): Visual {
  const s: Shape[] = [];
  const inp = (label: string, v: string, y: number) => s.push(T(10, y + 5, label, 12, "middle", true, BLUE), R(20, y - 9, 20, 18, "#fde68a"), T(30, y + 5, v, 12, "middle", true));
  inp("A", A, 26); inp("B", B, 46); inp("C", C, 96);
  const x1 = 90, x2 = 230;
  s.push(Ln(40, 26, x1 + 4, 26), Ln(40, 46, x1 + 4, 46), ...gateShape(g1, x1, 36), T(x1 + 20, 12, g1, 11, "middle", true, VIOLET));
  const o1 = gateOut(g1, x1);
  s.push(Ln(o1, 36, 190, 36), Ln(190, 36, 190, 56), Ln(190, 56, x2 + 4, 56));
  if (notC) { s.push(Ln(40, 96, 120, 96), ...gateShape("NOT", 120, 96), Ln(gateOut("NOT", 120), 96, 190, 96)); }
  else s.push(Ln(40, 96, 190, 96));
  s.push(Ln(190, 96, 190, 76), Ln(190, 76, x2 + 4, 76), ...gateShape(g2, x2, 66), T(x2 + 20, 42, g2, 11, "middle", true, VIOLET));
  const o2 = gateOut(g2, x2);
  s.push(Ln(o2, 66, o2 + 24, 66), R(o2 + 24, 55, 24, 22, "#fff"), T(o2 + 36, 92, "Q", 12, "middle", true, BLUE));
  return { w: o2 + 60, h: 112, shapes: s, alt: `Logic circuit (A ${g1} B) ${g2} ${notC ? "NOT C" : "C"}`, prompt: "Work through the circuit gate by gate. What is the output Q?" };
}

function codeBlock(src: string, prompt: string): Visual {
  const lines = src.split("\n"), lh = 17, s: Shape[] = [];
  const longest = Math.max(...lines.map((l) => l.length));
  const w = Math.min(470, Math.max(200, longest * 7.4 + 44));
  s.push(R(0, 0, w, lines.length * lh + 14, "#f8fafc", 6, "#94a3b8", 1));
  s.push({ k: "rect", x: 0, y: 0, w: 26, h: lines.length * lh + 14, r: 6, fill: "#e2e8f0", stroke: "#94a3b8", sw: 1 });
  lines.forEach((l, i) => {
    const indent = l.length - l.trimStart().length;
    const y = 18 + i * lh;
    s.push(T(13, y, String(i + 1), 9, "middle", false, "#64748b"));
    if (l.trim()) s.push(T(34 + indent * 7, y, l.trim(), 12, "start", /^(def|for|while|if|elif|else|repeat|return)\b/.test(l.trim()), /^(def|for|while|if|elif|else|repeat|return)\b/.test(l.trim()) ? VIOLET : INK));
  });
  return { w, h: lines.length * lh + 16, shapes: s, alt: `Program: ${lines.map((l) => l.trim()).filter(Boolean).join("; ")}`, prompt };
}

function robotGrid(start: string, cmds: string): Visual {
  const [sx, sy, dir] = start.split(","), x0 = +sx, y0 = +sy;
  const n = 5, c = 30, ox = 20, s: Shape[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s.push(R(ox + i * c, (n - 1 - j) * c, c, c, (i + j) % 2 ? "#fff" : PALE, 0, "#94a3b8", 0.8));
  for (let i = 0; i < n; i++) { s.push(T(ox + i * c + c / 2, n * c + 14, "ABCDE"[i], 11, "middle", true, BLUE), T(10, (n - 1 - i) * c + c / 2 + 4, String(i + 1), 11, "middle", true, BLUE)); }
  const cx = ox + x0 * c + c / 2, cy = (n - 1 - y0) * c + c / 2;
  const ang = { N: -Math.PI / 2, E: 0, S: Math.PI / 2, W: Math.PI }[dir as "N"] ?? 0;
  const pt = (d: number, a: number): [number, number] => [cx + Math.cos(ang + a) * d, cy + Math.sin(ang + a) * d];
  s.push({ k: "circle", cx, cy, r: 11, fill: "#fde68a", stroke: INK, sw: 1.4 }, { k: "poly", pts: [pt(9, 0), pt(6, 2.4), pt(6, -2.4)], closed: true, fill: "#dc2626", stroke: "#dc2626", sw: 1 });
  const kx = ox + n * c + 18;
  s.push(T(kx, 14, "Commands", 11.5, "start", true, VIOLET));
  const words = cmds.split(" "); let line = "", ly = 34;
  for (const w of words) { if ((line + " " + w).length > 22) { s.push(T(kx, ly, line.trim(), 13, "start", true)); ly += 18; line = ""; } line += " " + w; }
  if (line.trim()) s.push(T(kx, ly, line.trim(), 13, "start", true));
  s.push(T(kx, ly + 24, "F = forward 1", 10, "start", false, MUTED), T(kx, ly + 38, "L / R = turn left / right", 10, "start", false, MUTED));
  return { w: kx + 150, h: n * c + 20, shapes: s, alt: `5 by 5 grid with a robot on ${"ABCDE"[x0]}${y0 + 1} facing ${dir}`, prompt: `The robot follows: ${cmds}. Which square does it end on?` };
}

function flowchart(spec: string): Visual {
  const p = spec.split("|"), s: Shape[] = [];
  const box = (x: number, y: number, w: number, t: string, fill = "#e0e7ff", round = 4) => s.push(R(x - w / 2, y - 13, w, 26, fill, round), T(x, y + 4, t, 11, "middle", true));
  const diamond = (x: number, y: number, t: string) => s.push({ k: "poly", pts: [[x, y - 22], [x + 60, y], [x, y + 22], [x - 60, y]], closed: true, fill: "#fde68a", stroke: INK, sw: 1.3 }, T(x, y + 4, t, 11, "middle", true));
  const cx = 110;
  box(cx, 14, 90, "Start", "#bbf7d0", 13);
  s.push(...arrow(cx, 27, cx, 42));
  box(cx, 56, 110, `Input x = ${p[1]}`, "#fff");
  s.push(...arrow(cx, 69, cx, 84));
  if (p[0] === "if") {
    const [, , t, add, mul] = p;
    diamond(cx, 106, `x > ${t}?`);
    s.push(Ln(cx + 60, 106, 230, 106), ...arrow(230, 106, 230, 140), T(200, 100, "yes", 10, "middle", true, "#16a34a"));
    s.push(Ln(cx - 60, 106, 40, 106), ...arrow(40, 106, 40, 140), T(66, 100, "no", 10, "middle", true, "#dc2626"));
    box(230, 154, 100, `x = x − ${add}`); box(40, 154, 84, `x = x × ${mul}`);
    s.push(Ln(230, 167, 230, 186), Ln(40, 167, 40, 186), Ln(40, 186, 230, 186), ...arrow(cx, 186, cx, 200));
    box(cx, 214, 100, "Output x", "#fff"); s.push(...arrow(cx, 227, cx, 240)); box(cx, 254, 90, "Stop", "#fecaca", 13);
    return { w: 290, h: 270, shapes: s.map((sh) => shiftX(sh, 20)), alt: `Flowchart: if x > ${t} subtract ${add}, else multiply by ${mul}`, prompt: `Follow the flowchart with x = ${p[1]}. What is the output?` };
  }
  const lim = p[2];
  diamond(cx, 106, `x ≤ ${lim}?`);
  s.push(Ln(cx + 60, 106, 240, 106), ...arrow(240, 106, 240, 128), T(205, 100, "yes", 10, "middle", true, "#16a34a"));
  box(240, 142, 90, "x = x × 2");
  s.push(Ln(240, 155, 240, 176), Ln(240, 176, 280, 176), Ln(280, 176, 280, 84), ...arrow(280, 84, cx + 6, 84));
  s.push(...arrow(cx, 128, cx, 186), T(cx + 12, 146, "no", 10, "start", true, "#dc2626"));
  box(cx, 200, 100, "Output x", "#fff"); s.push(...arrow(cx, 213, cx, 226)); box(cx, 240, 90, "Stop", "#fecaca", 13);
  return { w: 300, h: 256, shapes: s, alt: `Flowchart loop: double x while x ≤ ${lim}`, prompt: `Follow the flowchart with x = ${p[1]}. What is the output?` };
}
function shiftX(sh: Shape, dx: number): Shape {
  if (sh.k === "rect" || sh.k === "text") return { ...sh, x: sh.x + dx };
  if (sh.k === "circle") return { ...sh, cx: sh.cx + dx };
  if (sh.k === "line") return { ...sh, x1: sh.x1 + dx, x2: sh.x2 + dx };
  return { ...sh, pts: sh.pts.map(([x, y]) => [x + dx, y] as [number, number]) };
}

function arrayBoxes(vals: string[], hi: number): Visual {
  const cw = vals.length > 9 ? 36 : 42, s: Shape[] = [];
  vals.forEach((v, i) => {
    s.push(R(i * cw, 0, cw - 3, 32, i === hi ? "#fde68a" : "#e0f2fe"), T(i * cw + (cw - 3) / 2, 21, v, 13, "middle", true));
    s.push(T(i * cw + (cw - 3) / 2, 46, String(i), 9.5, "middle", false, MUTED));
  });
  s.push(T(0, 60, "index", 9, "start", false, MUTED));
  return { w: vals.length * cw, h: 62, shapes: s, alt: `List of ${vals.length} items: ${vals.join(", ")}` };
}

function spreadsheet(grid: string, formula: string): Visual {
  const rows = grid.split("/").map((r) => r.split(",")), cw = 60, rh = 22, s: Shape[] = [];
  s.push(R(0, 0, 28, 24, "#fff", 0, "#94a3b8", 0.8), R(28, 0, cw * 3, 24, "#fff", 0, "#94a3b8", 0.8), T(34, 16, "fx", 10, "start", true, VIOLET), T(54, 16, formula, 11, "start", true));
  const y0 = 30;
  ["", "A", "B", "C"].forEach((h, i) => s.push(R(i ? 28 + (i - 1) * cw : 0, y0, i ? cw : 28, rh, "#e2e8f0", 0, "#94a3b8", 0.8), T(i ? 28 + (i - 1) * cw + cw / 2 : 14, y0 + 15, h, 10.5, "middle", true, MUTED)));
  rows.forEach((r, ri) => {
    const y = y0 + rh * (ri + 1);
    s.push(R(0, y, 28, rh, "#e2e8f0", 0, "#94a3b8", 0.8), T(14, y + 15, String(ri + 1), 10.5, "middle", true, MUTED));
    r.forEach((v, ci) => s.push(R(28 + ci * cw, y, cw, rh, "#fff", 0, "#cbd5e1", 0.8), T(28 + ci * cw + cw - 6, y + 15, v, 11, "end")));
  });
  return { w: 28 + cw * 3 + 2, h: y0 + rh * (rows.length + 1) + 2, shapes: s, alt: `Spreadsheet with formula ${formula}`, prompt: `What will the formula ${formula} show?` };
}

function passwordSlots(n: number, choices: number): Visual {
  const s: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const x = i * 58;
    s.push(R(x, 0, 48, 36, "#fff"), T(x + 24, 24, "?", 16, "middle", true, "#94a3b8"), T(x + 24, 54, `${choices}`, 12, "middle", true, BLUE), T(x + 24, 67, "choices", 9, "middle", false, MUTED));
    if (i < n - 1) s.push(T(x + 53, 24, "×", 13, "middle", true, MUTED));
  }
  return { w: n * 58, h: 70, shapes: s, alt: `${n} slots with ${choices} choices each` };
}

/** Picture for a Computer Science `pic` spec, or null. */
export function csVisual(pic: string): Visual | null {
  const i = pic.indexOf(":");
  if (i < 0) return null;
  const kind = pic.slice(0, i), rest = pic.slice(i + 1);
  switch (kind) {
    case "bits": { const [d, n] = rest.split("|"); return bits(d, +n); }
    case "binadd": { const [a, b] = rest.split("|"); return binAdd(a, b); }
    case "hex": return hexDigits(rest);
    case "colour": return colourCode(rest);
    case "gate": { const [g, a, b] = rest.split("|"); return oneGate(g, a, b); }
    case "circuit2": { const [g1, g2, n, A, B, C] = rest.split("|"); return circuit(g1, g2, n === "1", A, B, C); }
    case "code": { const [src, prompt] = rest.split("§"); return codeBlock(src, prompt || "What does this program print?"); }
    case "robot": { const [st, cmds] = rest.split("|"); return robotGrid(st, cmds); }
    case "flow": return flowchart(rest);
    case "arr": { const [v, hi] = rest.split("|"); return arrayBoxes(v.split(","), +hi); }
    case "sheet": { const [g, f] = rest.split("|"); return spreadsheet(g, f); }
    case "pw": { const [n, c] = rest.split("|"); return passwordSlots(+n, +c); }
  }
  return null;
}

/** Header doodle for Computer Science: a little monitor with a prompt. */
export function computerDoodle(): Visual {
  return {
    w: 64, h: 56, alt: "",
    shapes: [
      R(4, 6, 56, 36, "#ddd6fe", 4, INK, 1.5), R(9, 11, 46, 26, "#1e293b", 2, INK, 1),
      T(14, 28, ">_", 11, "start", true, "#a7f3d0"),
      Ln(32, 42, 32, 48, INK, 2), R(18, 48, 28, 5, "#ddd6fe", 2, INK, 1.2),
    ],
  };
}
