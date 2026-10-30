/**
 * "Label the diagram" pictures for science topics: water cycle, plant parts,
 * food chains, states of matter, the solar system, circuits, cells, atoms…
 *
 * Each diagram is drawn from the same primitives as the other worksheet
 * pictures (so it renders on screen, in print and in the PDF) and lists the
 * spots to label: (x, y) is where the numbered marker goes and (ax, ay) the
 * point on the drawing its leader line touches. Diagrams are fixed per topic
 * and grade band — no randomness — so the answer key never changes.
 */
import type { Shape, Visual } from "./worksheetVisuals";

export type DiagramLabel = { answer: string; x: number; y: number; ax?: number; ay?: number };
export type Diagram = { visual: Visual; labels: DiagramLabel[] };

const INK = "#1e293b";
const BLUE = "#bfdbfe", DEEP_BLUE = "#60a5fa", AMBER = "#fde68a", GREEN = "#bbf7d0", DEEP_GREEN = "#4ade80";
const PINK = "#fbcfe8", PURPLE = "#ddd6fe", ORANGE = "#fed7aa", GREY = "#e2e8f0", SOIL = "#e7d3b0", RED = "#fca5a5";

// ---------------------------------------------------------------- helpers

function ellipse(cx: number, cy: number, rx: number, ry: number, fill?: string, stroke = INK, sw = 1.5, n = 28): Shape {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return { k: "poly", pts, closed: true, fill, stroke, sw };
}

function arcPts(cx: number, cy: number, r: number, a0: number, a1: number, n = 16): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return pts;
}

function arrow(x1: number, y1: number, x2: number, y2: number, color = INK, sw = 2, head = 7): Shape[] {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (d: number, s: number): [number, number] => [x2 - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s, y2 - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s];
  return [
    { k: "line", x1, y1, x2: x2 - Math.cos(a) * head * 0.6, y2: y2 - Math.sin(a) * head * 0.6, stroke: color, sw },
    { k: "poly", pts: [[x2, y2], p(head, head * 0.55), p(head, -head * 0.55)], closed: true, fill: color, stroke: color, sw: 1 },
  ];
}

function sun(cx: number, cy: number, r: number): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    out.push({ k: "line", x1: cx + Math.cos(a) * (r + 4), y1: cy + Math.sin(a) * (r + 4), x2: cx + Math.cos(a) * (r + 12), y2: cy + Math.sin(a) * (r + 12), stroke: "#f59e0b", sw: 2.5 });
  }
  out.push({ k: "circle", cx, cy, r, fill: AMBER, stroke: "#d97706", sw: 1.8 });
  return out;
}

/** A puffy cloud: outlined circles, then the same circles filled on top so only the outside edge shows. */
function cloud(cx: number, cy: number, s = 1, fill = "#ffffff"): Shape[] {
  const blobs: [number, number, number][] = [[-24, 6, 15], [-8, -6, 19], [12, -2, 17], [27, 7, 13], [2, 10, 15]];
  const out: Shape[] = blobs.map(([dx, dy, r]) => ({ k: "circle", cx: cx + dx * s, cy: cy + dy * s, r: r * s, stroke: INK, sw: 1.5, fill }));
  blobs.forEach(([dx, dy, r]) => out.push({ k: "circle", cx: cx + dx * s, cy: cy + dy * s, r: r * s - 1.2, fill }));
  return out;
}

const txt = (x: number, y: number, t: string, size = 11, anchor: "start" | "middle" | "end" = "middle", bold = false, fill = INK): Shape => ({ k: "text", x, y, t, size, anchor, bold, fill });

function leaf(cx: number, cy: number, len: number, angle: number, fill = DEEP_GREEN): Shape {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20, w = Math.sin(t * Math.PI) * len * 0.32;
    pts.push([t * len, -w]);
  }
  for (let i = 20; i >= 0; i--) {
    const t = i / 20, w = Math.sin(t * Math.PI) * len * 0.32;
    pts.push([t * len, w]);
  }
  const c = Math.cos(angle), s = Math.sin(angle);
  return { k: "poly", pts: pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]), closed: true, fill, stroke: INK, sw: 1.4 };
}

// ---------------------------------------------------------------- diagrams

function waterCycle(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 0, y: 0, w: 460, h: 250, fill: "#f0f9ff", stroke: "#f0f9ff", sw: 0 });
  s.push(...sun(410, 48, 22));
  s.push({ k: "poly", pts: [[0, 250], [0, 170], [55, 105], [95, 150], [140, 120], [215, 205], [215, 250]], closed: true, fill: GREEN, stroke: INK, sw: 1.5 });
  s.push({ k: "poly", pts: [[42, 121], [55, 105], [69, 121], [61, 117], [55, 124], [49, 117]], closed: true, fill: "#fff", stroke: INK, sw: 1 });
  s.push({ k: "poly", pts: [[205, 250], [205, 205], [460, 205], [460, 250]], closed: true, fill: DEEP_BLUE, stroke: INK, sw: 1.5 });
  for (let x = 225; x < 430; x += 38) s.push({ k: "poly", pts: [[x, 220], [x + 8, 216], [x + 16, 220], [x + 24, 216]], stroke: "#fff", sw: 1.5 });
  s.push(...cloud(175, 58, 1.1, "#f1f5f9"));
  for (let i = 0; i < 5; i++) { const x = 140 + i * 13; s.push({ k: "line", x1: x, y1: 90, x2: x - 6, y2: 104 + (i % 2) * 10, stroke: "#2563eb", sw: 2 }); }
  for (const x of [300, 345, 390]) s.push(...arrow(x, 195, x - 15, 120, "#ef4444", 2));
  s.push(...arrow(275, 115, 215, 75, "#64748b", 2));
  s.push(...arrow(150, 175, 205, 210, "#2563eb", 2));
  return {
    visual: { w: 460, h: 250, shapes: s, alt: "The water cycle: sun, sea, clouds, rain and land" },
    labels: [
      { answer: "evaporation", x: 420, y: 150, ax: 375, ay: 150 },
      { answer: "condensation", x: 270, y: 30, ax: 212, ay: 50 },
      { answer: "precipitation", x: 95, y: 70, ax: 140, ay: 96 },
      { answer: "collection", x: 440, y: 232, ax: 410, ay: 230 },
    ],
  };
}

function plantParts(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 60, y: 170, w: 340, h: 70, fill: SOIL, stroke: INK, sw: 1.2 });
  const roots: [number, number, number, number][] = [[230, 170, 200, 225], [230, 170, 262, 228], [230, 170, 230, 235], [215, 200, 185, 210], [246, 200, 275, 205]];
  roots.forEach(([a, b, c, d]) => s.push({ k: "line", x1: a, y1: b, x2: c, y2: d, stroke: "#92400e", sw: 2.2 }));
  s.push({ k: "line", x1: 230, y1: 170, x2: 230, y2: 62, stroke: "#16a34a", sw: 5 });
  s.push(leaf(228, 130, 55, Math.PI + 0.45), leaf(232, 100, 55, -0.45));
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; s.push({ k: "circle", cx: 230 + Math.cos(a) * 15, cy: 48 + Math.sin(a) * 15, r: 11, fill: PINK, stroke: INK, sw: 1.3 }); }
  s.push({ k: "circle", cx: 230, cy: 48, r: 9, fill: AMBER, stroke: INK, sw: 1.3 });
  return {
    visual: { w: 460, h: 245, shapes: s, alt: "A flowering plant growing in soil" },
    labels: [
      { answer: "flower", x: 340, y: 40, ax: 255, ay: 45 },
      { answer: "leaf", x: 340, y: 95, ax: 270, ay: 85 },
      { answer: "stem", x: 120, y: 80, ax: 228, ay: 80 },
      { answer: "roots", x: 120, y: 215, ax: 200, ay: 222 },
    ],
  };
}

function plantNeeds(): Diagram {
  const s: Shape[] = [];
  s.push(...sun(60, 50, 24));
  s.push(...cloud(380, 45, 1, "#f1f5f9"));
  for (let i = 0; i < 4; i++) s.push({ k: "line", x1: 362 + i * 12, y1: 75, x2: 358 + i * 12, y2: 92, stroke: "#2563eb", sw: 2 });
  for (let i = 0; i < 3; i++) s.push({ k: "poly", pts: [[40, 120 + i * 14], [55, 115 + i * 14], [70, 120 + i * 14], [85, 115 + i * 14], [100, 120 + i * 14]], stroke: "#64748b", sw: 1.8 });
  s.push({ k: "rect", x: 150, y: 180, w: 160, h: 50, fill: SOIL, stroke: INK, sw: 1.2 });
  s.push({ k: "line", x1: 230, y1: 180, x2: 230, y2: 100, stroke: "#16a34a", sw: 5 });
  s.push(leaf(228, 150, 45, Math.PI + 0.5), leaf(232, 125, 45, -0.5), leaf(230, 102, 35, -Math.PI / 2));
  return {
    visual: { w: 460, h: 235, shapes: s, alt: "A plant with the sun, rain clouds, wind and soil around it" },
    labels: [
      { answer: "sunlight", x: 130, y: 40, ax: 92, ay: 50 },
      { answer: "water", x: 435, y: 100, ax: 400, ay: 88 },
      { answer: "air", x: 30, y: 180, ax: 60, ay: 140 },
      { answer: "soil", x: 360, y: 210, ax: 310, ay: 210 },
    ],
  };
}

function foodChain(grade: number): Diagram {
  const s: Shape[] = [];
  const names = ["Grass", "Rabbit", "Fox"];
  const fills = [GREEN, AMBER, ORANGE];
  names.forEach((n, i) => {
    const x = 20 + i * 150;
    s.push({ k: "rect", x, y: 40, w: 110, h: 54, r: 10, fill: fills[i], stroke: INK, sw: 1.6 });
    s.push(txt(x + 55, 72, n, 15, "middle", true));
    if (i < 2) s.push(...arrow(x + 115, 67, x + 145, 67, INK, 2.2));
  });
  s.push({ k: "rect", x: 170, y: 150, w: 110, h: 50, r: 10, fill: GREY, stroke: INK, sw: 1.6 });
  s.push(txt(225, 180, "Mushrooms", 14, "middle", true));
  s.push({ k: "line", x1: 75, y1: 98, x2: 175, y2: 155, stroke: "#94a3b8", sw: 1.5, dash: true });
  s.push({ k: "line", x1: 375, y1: 98, x2: 275, y2: 155, stroke: "#94a3b8", sw: 1.5, dash: true });
  s.push(txt(225, 225, "Arrows show the flow of energy", 10, "middle", false, "#64748b"));
  const adv = grade >= 6;
  return {
    visual: { w: 460, h: 232, shapes: s, alt: "A food chain: grass, rabbit, fox, with mushrooms breaking down dead matter" },
    labels: [
      { answer: "producer", x: 75, y: 14, ax: 75, ay: 40 },
      { answer: adv ? "primary consumer" : "herbivore", x: 225, y: 14, ax: 225, ay: 40 },
      { answer: adv ? "secondary consumer" : "carnivore", x: 375, y: 14, ax: 375, ay: 40 },
      { answer: "decomposer", x: 330, y: 190, ax: 282, ay: 178 },
    ],
  };
}

function energyPyramid(): Diagram {
  const s: Shape[] = [];
  const top: [number, number] = [170, 15], bl: [number, number] = [20, 215], br: [number, number] = [320, 215];
  const fills = [GREEN, AMBER, ORANGE, RED];
  const names = ["grass", "grasshopper", "frog", "hawk"];
  for (let i = 0; i < 4; i++) {
    const t0 = 1 - i / 4, t1 = 1 - (i + 1) / 4;
    const lx = (t: number) => top[0] + (bl[0] - top[0]) * t, rx = (t: number) => top[0] + (br[0] - top[0]) * t, yy = (t: number) => top[1] + (bl[1] - top[1]) * t;
    s.push({ k: "poly", pts: [[lx(t0), yy(t0)], [rx(t0), yy(t0)], [rx(t1), yy(t1)], [lx(t1), yy(t1)]], closed: true, fill: fills[i], stroke: INK, sw: 1.5 });
    s.push(txt(170, (yy(t0) + yy(t1)) / 2 + 4, names[i], 11, "middle", true));
  }
  s.push(...arrow(350, 205, 350, 30, "#64748b", 2));
  s.push(txt(362, 120, "less energy", 10, "start", false, "#64748b"));
  return {
    visual: { w: 460, h: 225, shapes: s, alt: "An energy pyramid with grass at the bottom and a hawk at the top" },
    labels: [
      { answer: "producers", x: 440, y: 190, ax: 300, ay: 190 },
      { answer: "primary consumers", x: 440, y: 150, ax: 270, ay: 140 },
      { answer: "secondary consumers", x: 440, y: 100, ax: 240, ay: 92 },
      { answer: "tertiary consumers", x: 440, y: 45, ax: 200, ay: 45 },
    ],
  };
}

function statesOfMatter(): Diagram {
  const s: Shape[] = [];
  const box = (x: number) => s.push({ k: "poly", pts: [[x, 30], [x, 170], [x + 110, 170], [x + 110, 30]], fill: "#f8fafc", stroke: INK, sw: 2 });
  [20, 175, 330].forEach(box);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s.push({ k: "circle", cx: 41 + c * 22, cy: 102 + r * 20, r: 9, fill: DEEP_BLUE, stroke: INK, sw: 1 });
  const liquid: [number, number][] = [[192, 158], [214, 156], [238, 160], [262, 155], [284, 158], [200, 138], [224, 136], [250, 140], [274, 137], [212, 118], [262, 120], [236, 117]];
  liquid.forEach(([x, y]) => s.push({ k: "circle", cx: x, cy: y, r: 9, fill: DEEP_BLUE, stroke: INK, sw: 1 }));
  const gas: [number, number][] = [[350, 50], [410, 62], [372, 110], [425, 135], [348, 152], [395, 85]];
  gas.forEach(([x, y]) => s.push({ k: "circle", cx: x, cy: y, r: 9, fill: DEEP_BLUE, stroke: INK, sw: 1 }));
  return {
    visual: { w: 460, h: 210, shapes: s, alt: "Three boxes of particles: tightly packed, loosely packed and spread out" },
    labels: [
      { answer: "solid", x: 75, y: 195, ax: 75, ay: 172 },
      { answer: "liquid", x: 230, y: 195, ax: 230, ay: 172 },
      { answer: "gas", x: 385, y: 195, ax: 385, ay: 172 },
    ],
  };
}

function solarSystem(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "circle", cx: 38, cy: 100, r: 34, fill: AMBER, stroke: "#d97706", sw: 2 });
  s.push(txt(38, 104, "Sun", 11, "middle", true));
  const planets: [string, number, number, string, boolean][] = [
    ["Mercury", 92, 4, "#cbd5e1", false], ["Venus", 118, 7, ORANGE, false], ["Earth", 148, 8, DEEP_BLUE, true], ["Mars", 176, 6, RED, true],
    ["Jupiter", 222, 21, "#fdba74", true], ["Saturn", 290, 16, AMBER, true], ["Uranus", 350, 11, "#a5f3fc", false], ["Neptune", 400, 11, "#93c5fd", false],
  ];
  for (const [name, x, r, fill, blank] of planets) {
    if (name === "Saturn") s.push(ellipse(x, 100, r + 12, 5, undefined, INK, 1.5));
    s.push({ k: "circle", cx: x, cy: 100, r, fill, stroke: INK, sw: 1.4 });
    if (!blank) s.push(txt(x, 100 + r + (name === "Mercury" ? 26 : 16), name, 9, "middle", false, "#475569"));
  }
  return {
    visual: { w: 430, h: 175, shapes: s, alt: "The Sun and the eight planets in order" },
    labels: [
      { answer: "Earth", x: 148, y: 158, ax: 148, ay: 109 },
      { answer: "Mars", x: 176, y: 40, ax: 176, ay: 94 },
      { answer: "Jupiter", x: 222, y: 158, ax: 222, ay: 121 },
      { answer: "Saturn", x: 290, y: 40, ax: 290, ay: 84 },
    ],
  };
}

function moonPhases(): Diagram {
  const s: Shape[] = [];
  const R = 34, y = 70, xs = [60, 170, 280, 390];
  const DARK = "#334155", LIGHT = "#fef9c3";
  xs.forEach((x, i) => {
    s.push({ k: "circle", cx: x, cy: y, r: R, fill: i === 2 ? LIGHT : DARK, stroke: INK, sw: 1.6 });
    if (i === 1) s.push({ k: "poly", pts: arcPts(x, y, R, -Math.PI / 2, Math.PI / 2), closed: true, fill: LIGHT, stroke: INK, sw: 1.2 });
    if (i === 3) s.push({ k: "poly", pts: arcPts(x, y, R, Math.PI / 2, (3 * Math.PI) / 2), closed: true, fill: LIGHT, stroke: INK, sw: 1.2 });
    if (i < 3) s.push(...arrow(x + R + 10, y, x + 110 - R - 10, y, "#64748b", 1.8));
  });
  return {
    visual: { w: 450, h: 150, shapes: s, alt: "Four phases of the Moon in order" },
    labels: xs.map((x, i) => ({ answer: ["new moon", "first quarter", "full moon", "third quarter"][i], x, y: 132, ax: x, ay: y + R + 2 })),
  };
}

function lifeCycle(grade: number): Diagram {
  const s: Shape[] = [];
  const C: [number, number][] = [[230, 40], [380, 120], [230, 200], [80, 120]];
  // egg: tiny eggs on a leaf
  s.push(leaf(200, 40, 60, 0, GREEN));
  [[222, 36], [232, 42], [242, 36], [232, 31]].forEach(([x, y]) => s.push({ k: "circle", cx: x, cy: y, r: 4, fill: "#fefce8", stroke: INK, sw: 1 }));
  // caterpillar
  for (let i = 0; i < 6; i++) s.push({ k: "circle", cx: 350 + i * 11, cy: 120 + (i % 2 ? -3 : 3), r: 7.5, fill: DEEP_GREEN, stroke: INK, sw: 1.2 });
  s.push({ k: "circle", cx: 418, cy: 116, r: 1.6, fill: INK });
  // chrysalis hanging from a twig
  s.push({ k: "line", x1: 200, y1: 172, x2: 262, y2: 172, stroke: "#92400e", sw: 3 });
  s.push(ellipse(230, 200, 11, 24, "#a3e635", INK, 1.4));
  // butterfly
  s.push({ k: "poly", pts: [[80, 120], [48, 92], [42, 118], [80, 122]], closed: true, fill: ORANGE, stroke: INK, sw: 1.4 });
  s.push({ k: "poly", pts: [[80, 120], [112, 92], [118, 118], [80, 122]], closed: true, fill: ORANGE, stroke: INK, sw: 1.4 });
  s.push({ k: "poly", pts: [[80, 122], [54, 146], [72, 150]], closed: true, fill: AMBER, stroke: INK, sw: 1.4 });
  s.push({ k: "poly", pts: [[80, 122], [106, 146], [88, 150]], closed: true, fill: AMBER, stroke: INK, sw: 1.4 });
  s.push(ellipse(80, 124, 3, 16, INK, INK, 1));
  // arrows round the cycle
  s.push(...arrow(290, 50, 350, 95, "#64748b", 2), ...arrow(360, 150, 280, 195, "#64748b", 2), ...arrow(180, 195, 110, 155, "#64748b", 2), ...arrow(110, 90, 170, 50, "#64748b", 2));
  const words = grade >= 4 ? ["egg", "larva", "pupa", "adult"] : ["egg", "caterpillar", "chrysalis", "butterfly"];
  return {
    visual: { w: 460, h: 240, shapes: s, alt: "The life cycle of a butterfly in four stages" },
    labels: [
      { answer: words[0], x: 300, y: 18, ax: 248, ay: 38 },
      { answer: words[1], x: 400, y: 165, ax: 390, ay: 128 },
      { answer: words[2], x: 290, y: 225, ax: 242, ay: 205 },
      { answer: words[3], x: 30, y: 70, ax: 52, ay: 98 },
    ],
  };
}

function circuit(): Diagram {
  const s: Shape[] = [];
  const W = "#475569";
  // wires (a rectangle with gaps for parts)
  s.push({ k: "line", x1: 60, y1: 40, x2: 205, y2: 40, stroke: W, sw: 3 }, { k: "line", x1: 255, y1: 40, x2: 400, y2: 40, stroke: W, sw: 3 });
  s.push({ k: "line", x1: 400, y1: 40, x2: 400, y2: 105, stroke: W, sw: 3 }, { k: "line", x1: 400, y1: 155, x2: 400, y2: 200, stroke: W, sw: 3 });
  s.push({ k: "line", x1: 400, y1: 200, x2: 60, y2: 200, stroke: W, sw: 3 });
  s.push({ k: "line", x1: 60, y1: 200, x2: 60, y2: 140, stroke: W, sw: 3 }, { k: "line", x1: 60, y1: 100, x2: 60, y2: 40, stroke: W, sw: 3 });
  // battery
  s.push({ k: "rect", x: 38, y: 100, w: 44, h: 40, r: 4, fill: AMBER, stroke: INK, sw: 1.6 });
  s.push({ k: "rect", x: 52, y: 94, w: 16, h: 6, fill: "#cbd5e1", stroke: INK, sw: 1.2 });
  s.push(txt(60, 124, "+", 14, "middle", true));
  // bulb
  s.push({ k: "circle", cx: 230, cy: 32, r: 22, fill: "#fef9c3", stroke: INK, sw: 1.6 });
  s.push({ k: "rect", x: 218, y: 52, w: 24, h: 12, fill: "#cbd5e1", stroke: INK, sw: 1.2 });
  s.push({ k: "poly", pts: [[220, 40], [225, 28], [230, 40], [235, 28], [240, 40]], stroke: INK, sw: 1.3 });
  s.push({ k: "line", x1: 205, y1: 40, x2: 218, y2: 58, stroke: W, sw: 3 }, { k: "line", x1: 255, y1: 40, x2: 242, y2: 58, stroke: W, sw: 3 });
  // switch (open)
  s.push({ k: "circle", cx: 400, cy: 105, r: 4, fill: INK }, { k: "circle", cx: 400, cy: 155, r: 4, fill: INK });
  s.push({ k: "line", x1: 400, y1: 155, x2: 428, y2: 112, stroke: INK, sw: 3 });
  return {
    visual: { w: 460, h: 215, shapes: s, alt: "A simple circuit with a battery, a bulb, a switch and wires" },
    labels: [
      { answer: "battery", x: 125, y: 120, ax: 84, ay: 120 },
      { answer: "bulb", x: 300, y: 18, ax: 252, ay: 26 },
      { answer: "switch", x: 445, y: 160, ax: 418, ay: 128 },
      { answer: "wire", x: 230, y: 175, ax: 230, ay: 200 },
    ],
  };
}

function lever(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "line", x1: 20, y1: 190, x2: 440, y2: 190, stroke: "#94a3b8", sw: 2 });
  s.push({ k: "poly", pts: [[170, 190], [200, 140], [230, 190]], closed: true, fill: AMBER, stroke: INK, sw: 1.6 });
  s.push({ k: "poly", pts: [[40, 160], [420, 120], [421, 128], [41, 168]], closed: true, fill: ORANGE, stroke: INK, sw: 1.5 });
  s.push({ k: "rect", x: 52, y: 118, w: 48, h: 42, r: 3, fill: "#cbd5e1", stroke: INK, sw: 1.6 });
  s.push(txt(76, 144, "50 kg", 10, "middle", true));
  s.push(...arrow(400, 50, 400, 112, "#dc2626", 3, 10));
  return {
    visual: { w: 460, h: 205, shapes: s, alt: "A lever: a plank on a triangle with a heavy box at one end and a downward push at the other" },
    labels: [
      { answer: "load", x: 76, y: 80, ax: 76, ay: 117 },
      { answer: "fulcrum", x: 200, y: 215 - 20, ax: 200, ay: 172 },
      { answer: "effort", x: 345, y: 50, ax: 393, ay: 75 },
    ],
  };
}

function plantCell(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 110, y: 15, w: 240, h: 200, r: 18, fill: GREEN, stroke: "#15803d", sw: 4 });
  s.push({ k: "rect", x: 120, y: 25, w: 220, h: 180, r: 12, fill: "#f0fdf4", stroke: INK, sw: 1.4 });
  s.push({ k: "rect", x: 190, y: 55, w: 120, h: 110, r: 30, fill: "#dbeafe", stroke: INK, sw: 1.4 });
  s.push({ k: "circle", cx: 155, cy: 70, r: 22, fill: PURPLE, stroke: INK, sw: 1.5 }, { k: "circle", cx: 158, cy: 72, r: 7, fill: "#a78bfa", stroke: INK, sw: 1 });
  [[150, 150], [170, 185], [320, 185], [325, 40], [270, 185]].forEach(([x, y]) => s.push(ellipse(x, y, 11, 6, DEEP_GREEN, INK, 1.2, 16)));
  return {
    visual: { w: 460, h: 230, shapes: s, alt: "A plant cell with a cell wall, membrane, nucleus, chloroplasts and a large vacuole" },
    labels: [
      { answer: "cell wall", x: 60, y: 40, ax: 111, ay: 45 },
      { answer: "cell membrane", x: 60, y: 120, ax: 121, ay: 120 },
      { answer: "nucleus", x: 60, y: 200, ax: 146, ay: 82 },
      { answer: "chloroplast", x: 400, y: 190, ax: 331, ay: 185 },
      { answer: "vacuole", x: 400, y: 110, ax: 309, ay: 110 },
    ],
  };
}

function atom(): Diagram {
  const s: Shape[] = [];
  const cx = 200, cy = 115;
  s.push({ k: "circle", cx, cy, r: 55, stroke: "#94a3b8", sw: 1.3 }, { k: "circle", cx, cy, r: 95, stroke: "#94a3b8", sw: 1.3 });
  const nuc: [number, number, boolean][] = [[-8, -8, true], [8, -8, false], [-8, 8, false], [8, 8, true], [0, 0, true], [0, -14, false], [0, 14, false]];
  nuc.forEach(([dx, dy, p]) => {
    s.push({ k: "circle", cx: cx + dx, cy: cy + dy, r: 8, fill: p ? RED : "#cbd5e1", stroke: INK, sw: 1.1 });
    if (p) s.push(txt(cx + dx, cy + dy + 4, "+", 11, "middle", true));
  });
  s.push({ k: "poly", pts: arcPts(cx, cy, 25, 0, Math.PI * 2, 36), closed: true, stroke: INK, sw: 1, dash: true });
  const e = (a: number, r: number) => {
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    s.push({ k: "circle", cx: x, cy: y, r: 7, fill: DEEP_BLUE, stroke: INK, sw: 1.1 }, txt(x, y + 4, "−", 11, "middle", true));
  };
  e(-Math.PI / 2, 55); e(Math.PI / 2, 55);
  [0.3, 1.1, 2.1, 2.9, 3.9, 4.9].forEach((a) => e(a, 95));
  return {
    visual: { w: 460, h: 230, shapes: s, alt: "A model of an atom with protons and neutrons in the nucleus and electrons in shells" },
    labels: [
      { answer: "nucleus", x: 400, y: 30, ax: 222, ay: 104 },
      { answer: "proton", x: 400, y: 90, ax: 209, ay: 108 },
      { answer: "neutron", x: 400, y: 150, ax: 208, ay: 125 },
      { answer: "electron", x: 400, y: 210, ax: cx + Math.cos(0.3) * 95 + 6, ay: cy + Math.sin(0.3) * 95 },
    ],
  };
}

function earthLayers(): Diagram {
  const s: Shape[] = [];
  const cx = 160, cy = 115;
  s.push({ k: "circle", cx, cy, r: 100, fill: "#a16207", stroke: INK, sw: 1.8 });
  s.push({ k: "circle", cx, cy, r: 94, fill: ORANGE, stroke: INK, sw: 1.2 });
  s.push({ k: "circle", cx, cy, r: 55, fill: "#fb923c", stroke: INK, sw: 1.2 });
  s.push({ k: "circle", cx, cy, r: 26, fill: AMBER, stroke: INK, sw: 1.2 });
  return {
    visual: { w: 420, h: 230, shapes: s, alt: "A cross-section of Earth showing four layers" },
    labels: [
      { answer: "crust", x: 330, y: 30, ax: 228, ay: 42 },
      { answer: "mantle", x: 330, y: 90, ax: 240, ay: 92 },
      { answer: "outer core", x: 330, y: 150, ax: 200, ay: 140 },
      { answer: "inner core", x: 330, y: 205, ax: 165, ay: 128 },
    ],
  };
}

function wave(): Diagram {
  const s: Shape[] = [];
  const y0 = 110, A = 60, L = 180, x0 = 20;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) { const x = x0 + (i / 120) * 2 * L; pts.push([x, y0 - Math.sin(((x - x0) / L) * Math.PI * 2) * A]); }
  s.push({ k: "line", x1: x0, y1: y0, x2: x0 + 2 * L, y2: y0, stroke: "#94a3b8", sw: 1.2, dash: true });
  s.push({ k: "poly", pts, stroke: "#2563eb", sw: 3 });
  // wavelength: crest to crest
  const c1 = x0 + L / 4, c2 = c1 + L;
  s.push({ k: "line", x1: c1, y1: y0 - A - 8, x2: c1, y2: y0 - A - 22, stroke: INK, sw: 1 }, { k: "line", x1: c2, y1: y0 - A - 8, x2: c2, y2: y0 - A - 22, stroke: INK, sw: 1 });
  s.push(...arrow((c1 + c2) / 2, y0 - A - 16, c1, y0 - A - 16, INK, 1.4, 6), ...arrow((c1 + c2) / 2, y0 - A - 16, c2, y0 - A - 16, INK, 1.4, 6));
  // amplitude: rest line to crest
  const ax = c2 + 2;
  s.push(...arrow(ax + 14, y0, ax + 14, y0 - A, INK, 1.4, 6));
  return {
    visual: { w: 400, h: 215, shapes: s, alt: "A wave with its crest, trough, wavelength and amplitude marked" },
    labels: [
      { answer: "crest", x: c1 - 40, y: y0 - A + 5, ax: c1 - 4, ay: y0 - A + 1 },
      { answer: "trough", x: c1 + L / 2, y: y0 + A + 25, ax: c1 + L / 2, ay: y0 + A + 2 },
      { answer: "wavelength", x: (c1 + c2) / 2, y: y0 - A - 1, ax: (c1 + c2) / 2, ay: y0 - A - 15 },
      { answer: "amplitude", x: ax + 48, y: y0 - A / 2 + 18, ax: ax + 15, ay: y0 - A / 2 },
    ],
  };
}

function forces(grade: number): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 20, y: 160, w: 420, h: 18, fill: GREY, stroke: INK, sw: 1.2 });
  for (let x = 30; x < 440; x += 18) s.push({ k: "line", x1: x, y1: 178, x2: x - 8, y2: 186, stroke: "#94a3b8", sw: 1 });
  s.push({ k: "rect", x: 185, y: 100, w: 90, h: 60, r: 4, fill: ORANGE, stroke: INK, sw: 1.8 });
  s.push(...arrow(100, 130, 182, 130, "#dc2626", 3.5, 11));
  s.push(...arrow(275, 157, 215 + 135, 157, "#7c3aed", 3, 10).map((x) => x));
  s.push(...arrow(230, 162, 230, 225 - 10, "#2563eb", 3.5, 11));
  s.push(...arrow(230, 98, 230, 40, "#16a34a", 3.5, 11));
  const hs = grade >= 6;
  return {
    visual: { w: 460, h: 225, shapes: s, alt: "A box on the floor with four force arrows" },
    labels: [
      { answer: hs ? "applied force" : "push", x: 60, y: 130, ax: 100, ay: 130 },
      { answer: "friction", x: 395, y: 135, ax: 350, ay: 157 },
      { answer: "gravity", x: 290, y: 205, ax: 232, ay: 205 },
      { answer: hs ? "normal force" : "support force", x: 290, y: 45, ax: 232, ay: 48 },
    ],
  };
}

function shadow(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "line", x1: 20, y1: 180, x2: 440, y2: 180, stroke: "#94a3b8", sw: 2 });
  // torch
  s.push({ k: "poly", pts: [[40, 70], [80, 60], [80, 100], [40, 90]], closed: true, fill: "#cbd5e1", stroke: INK, sw: 1.5 });
  s.push({ k: "rect", x: 80, y: 55, w: 14, h: 50, r: 3, fill: AMBER, stroke: INK, sw: 1.5 });
  for (const dy of [-30, 0, 30]) s.push({ k: "line", x1: 100, y1: 80 + dy * 0.3, x2: 150, y2: 80 + dy, stroke: "#f59e0b", sw: 1.6, dash: true });
  // tree
  s.push({ k: "rect", x: 196, y: 120, w: 14, h: 60, fill: "#a16207", stroke: INK, sw: 1.4 });
  s.push({ k: "circle", cx: 203, cy: 105, r: 30, fill: DEEP_GREEN, stroke: INK, sw: 1.5 });
  // shadow
  s.push(ellipse(330, 186, 105, 9, "#475569", "#475569", 1));
  return {
    visual: { w: 460, h: 205, shapes: s, alt: "A torch shining on a tree, which casts a shadow on the ground" },
    labels: [
      { answer: "light source", x: 60, y: 25, ax: 70, ay: 60 },
      { answer: "object", x: 270, y: 70, ax: 230, ay: 100 },
      { answer: "shadow", x: 400, y: 150, ax: 380, ay: 182 },
    ],
  };
}

function emSpectrum(): Diagram {
  const s: Shape[] = [];
  const names = ["radio waves", "microwaves", "infrared", "visible light", "ultraviolet", "X-rays", "gamma rays"];
  const fills = ["#fecaca", "#fed7aa", "#fde68a", "#bbf7d0", "#bfdbfe", "#c7d2fe", "#e9d5ff"];
  const blank = new Set([0, 1, 3, 5]);
  const w = 60;
  names.forEach((n, i) => {
    s.push({ k: "rect", x: 15 + i * w, y: 60, w, h: 50, fill: fills[i], stroke: INK, sw: 1.3 });
    if (!blank.has(i)) {
      const [a, b] = n.split(" ");
      s.push(txt(15 + i * w + w / 2, b ? 82 : 89, a, 9, "middle", true));
      if (b) s.push(txt(15 + i * w + w / 2, 95, b, 9, "middle", true));
    }
  });
  s.push(...arrow(170, 140, 20, 140, "#64748b", 1.6), ...arrow(270, 140, 420, 140, "#64748b", 1.6));
  s.push(txt(20, 158, "longer wavelength", 9, "start", false, "#64748b"), txt(430, 158, "higher energy", 9, "end", false, "#64748b"));
  return {
    visual: { w: 450, h: 165, shapes: s, alt: "The electromagnetic spectrum from radio waves to gamma rays" },
    labels: [...blank].map((i) => ({ answer: names[i], x: 15 + i * w + w / 2, y: 30, ax: 15 + i * w + w / 2, ay: 60 })),
  };
}

function photosynthesis(): Diagram {
  const s: Shape[] = [];
  s.push(...sun(50, 45, 22));
  s.push(leaf(160, 120, 160, -0.15, DEEP_GREEN));
  s.push({ k: "line", x1: 160, y1: 120, x2: 140, y2: 210, stroke: "#16a34a", sw: 4 });
  s.push(...arrow(80, 65, 175, 105, "#f59e0b", 2.4));
  s.push(...arrow(40, 150, 150, 132, "#64748b", 2.4));
  s.push(...arrow(300, 110, 410, 85, "#2563eb", 2.4));
  s.push(...arrow(110, 215, 152, 160, "#0ea5e9", 2.4));
  s.push(txt(240, 112, "glucose", 11, "middle", true, "#14532d"));
  return {
    visual: { w: 450, h: 236, shapes: s, alt: "A leaf taking in sunlight, carbon dioxide and water and giving out oxygen" },
    labels: [
      { answer: "sunlight", x: 130, y: 40, ax: 125, ay: 85 },
      { answer: "carbon dioxide", x: 30, y: 190, ax: 60, ay: 147 },
      { answer: "oxygen", x: 420, y: 125, ax: 395, ay: 89 },
      { answer: "water", x: 70, y: 220, ax: 110, ay: 212 },
    ],
  };
}

function heatTransfer(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 120, y: 170, w: 160, h: 16, fill: "#475569", stroke: INK, sw: 1.2 });
  [150, 175, 200, 225, 250].forEach((x) => s.push({ k: "poly", pts: [[x - 9, 170], [x, 146], [x + 9, 170]], closed: true, fill: "#fb923c", stroke: "#c2410c", sw: 1.2 }));
  s.push({ k: "poly", pts: [[130, 60], [130, 140], [270, 140], [270, 60]], fill: "#dbeafe", stroke: INK, sw: 2.2 });
  s.push({ k: "line", x1: 270, y1: 72, x2: 390, y2: 72, stroke: INK, sw: 5 });
  s.push(ellipse(400, 74, 14, 10, ORANGE, INK, 1.3));
  // convection loop
  s.push({ k: "poly", pts: arcPts(200, 100, 28, Math.PI * 0.15, Math.PI * 1.85, 20), stroke: "#dc2626", sw: 2 });
  s.push(...arrow(222, 85, 225, 92, "#dc2626", 2, 7));
  // radiation
  for (const y of [100, 125, 150]) s.push({ k: "poly", pts: [[20, y], [32, y - 6], [44, y], [56, y - 6], [68, y], [80, y - 6], [92, y]], stroke: "#f59e0b", sw: 2 });
  return {
    visual: { w: 450, h: 200, shapes: s, alt: "A pan of water heating on a flame, with a hand holding a metal handle" },
    labels: [
      { answer: "conduction", x: 340, y: 30, ax: 335, ay: 70 },
      { answer: "convection", x: 200, y: 25, ax: 200, ay: 72 },
      { answer: "radiation", x: 55, y: 70, ax: 55, ay: 95 },
    ],
  };
}

function periodicTile(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 150, y: 15, w: 150, h: 170, r: 8, fill: "#ecfeff", stroke: INK, sw: 2.2 });
  s.push(txt(165, 45, "6", 22, "start", true));
  s.push(txt(225, 112, "C", 60, "middle", true));
  s.push(txt(225, 145, "Carbon", 16, "middle"));
  s.push(txt(225, 172, "12.011", 14, "middle"));
  return {
    visual: { w: 450, h: 200, shapes: s, alt: "A periodic table square for carbon" },
    labels: [
      { answer: "atomic number", x: 80, y: 38, ax: 162, ay: 38 },
      { answer: "symbol", x: 370, y: 90, ax: 250, ay: 92 },
      { answer: "element name", x: 80, y: 140, ax: 195, ay: 140 },
      { answer: "atomic mass", x: 370, y: 168, ax: 260, ay: 167 },
    ],
  };
}

function landforms(): Diagram {
  const s: Shape[] = [];
  s.push({ k: "rect", x: 0, y: 0, w: 460, h: 230, fill: "#f0f9ff", stroke: "#f0f9ff", sw: 0 });
  s.push({ k: "poly", pts: [[0, 230], [0, 140], [300, 140], [300, 230]], closed: true, fill: GREEN, stroke: INK, sw: 1.2 });
  s.push({ k: "poly", pts: [[20, 140], [85, 40], [150, 140]], closed: true, fill: "#a8a29e", stroke: INK, sw: 1.5 });
  s.push({ k: "poly", pts: [[70, 63], [85, 40], [100, 63], [92, 58], [85, 66], [78, 58]], closed: true, fill: "#fff", stroke: INK, sw: 1 });
  s.push({ k: "poly", pts: [[300, 140], [460, 140], [460, 230], [300, 230]], closed: true, fill: DEEP_BLUE, stroke: INK, sw: 1.2 });
  s.push({ k: "poly", pts: [[120, 140], [150, 165], [190, 175], [240, 195], [300, 200], [300, 212], [235, 208], [185, 188], [140, 172], [110, 145]], closed: true, fill: DEEP_BLUE, stroke: INK, sw: 1.2 });
  s.push(ellipse(210, 152, 32, 9, DEEP_BLUE, INK, 1.2));
  s.push(ellipse(395, 175, 30, 12, AMBER, INK, 1.3));
  s.push({ k: "line", x1: 395, y1: 165, x2: 398, y2: 140, stroke: "#a16207", sw: 2.5 }, leaf(398, 140, 22, -2.6), leaf(398, 140, 22, -0.5));
  return {
    visual: { w: 460, h: 230, shapes: s, alt: "A landscape with a mountain, a river, a lake, an ocean and an island" },
    labels: [
      { answer: "mountain", x: 180, y: 50, ax: 115, ay: 80 },
      { answer: "lake", x: 245, y: 115, ax: 225, ay: 146 },
      { answer: "river", x: 150, y: 215, ax: 200, ay: 185 },
      { answer: "ocean", x: 340, y: 120 + 90, ax: 330, ay: 190 },
      { answer: "island", x: 430, y: 112, ax: 412, ay: 168 },
    ],
  };
}

function weatherSymbols(): Diagram {
  const s: Shape[] = [];
  const xs = [55, 165, 275, 385];
  xs.forEach((x) => s.push({ k: "rect", x: x - 48, y: 20, w: 96, h: 96, r: 10, fill: "#f8fafc", stroke: INK, sw: 1.4 }));
  s.push(...sun(55, 68, 20));
  s.push(...cloud(165, 70, 0.95, "#e2e8f0"));
  s.push(...cloud(275, 58, 0.8, "#cbd5e1"));
  for (let i = 0; i < 4; i++) s.push({ k: "line", x1: 257 + i * 12, y1: 82, x2: 253 + i * 12, y2: 98, stroke: "#2563eb", sw: 2.2 });
  s.push(...cloud(385, 58, 0.8, "#e2e8f0"));
  for (let i = 0; i < 3; i++) { const x = 370 + i * 15, y = 92; s.push({ k: "line", x1: x - 5, y1: y, x2: x + 5, y2: y, stroke: "#0ea5e9", sw: 1.6 }, { k: "line", x1: x, y1: y - 5, x2: x, y2: y + 5, stroke: "#0ea5e9", sw: 1.6 }); }
  return {
    visual: { w: 440, h: 160, shapes: s, alt: "Four weather symbols" },
    labels: xs.map((x, i) => ({ answer: ["sunny", "cloudy", "rainy", "snowy"][i], x, y: 140, ax: x, ay: 117 })),
  };
}

function magnet(): Diagram {
  const s: Shape[] = [];
  for (const [rx, ry] of [[115, 45], [135, 65], [155, 85]]) {
    const top: [number, number][] = [], bot: [number, number][] = [];
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI + (Math.PI * i) / 24;
      top.push([230 + Math.cos(a) * rx, 105 + Math.sin(a) * ry]);
      bot.push([230 + Math.cos(a) * rx, 105 - Math.sin(a) * ry * 0.7]);
    }
    s.push({ k: "poly", pts: top, stroke: "#94a3b8", sw: 1.3, dash: true }, { k: "poly", pts: bot, stroke: "#94a3b8", sw: 1.3, dash: true });
  }
  s.push({ k: "rect", x: 130, y: 85, w: 100, h: 40, fill: "#fca5a5", stroke: INK, sw: 1.8 });
  s.push({ k: "rect", x: 230, y: 85, w: 100, h: 40, fill: "#93c5fd", stroke: INK, sw: 1.8 });
  s.push(txt(180, 112, "N", 20, "middle", true), txt(280, 112, "S", 20, "middle", true));
  // paperclip
  s.push({ k: "rect", x: 365, y: 96, w: 40, h: 18, r: 8, stroke: "#475569", sw: 2 }, { k: "rect", x: 372, y: 100, w: 26, h: 10, r: 5, stroke: "#475569", sw: 2 });
  return {
    visual: { w: 460, h: 205, shapes: s, alt: "A bar magnet with field lines and a paperclip" },
    labels: [
      { answer: "north pole", x: 150, y: 190, ax: 160, ay: 126 },
      { answer: "south pole", x: 310, y: 190, ax: 300, ay: 126 },
      { answer: "magnetic field", x: 230, y: 12, ax: 230, ay: 40 },
    ],
  };
}

function rockLayers(): Diagram {
  const s: Shape[] = [];
  const fills = ["#fde68a", "#fdba74", "#d6d3d1", "#a8a29e", "#fca5a5"];
  fills.forEach((f, i) => s.push({ k: "rect", x: 60, y: 20 + i * 36, w: 300, h: 36, fill: f, stroke: INK, sw: 1.3 }));
  // a shell fossil
  s.push({ k: "poly", pts: [[210, 140], [190, 124], [200, 110], [220, 110], [230, 124]], closed: true, fill: "#fff7ed", stroke: INK, sw: 1.3 });
  for (const x of [200, 210, 220]) s.push({ k: "line", x1: 210, y1: 138, x2: x, y2: 112, stroke: INK, sw: 0.9 });
  return {
    visual: { w: 460, h: 205, shapes: s, alt: "Five layers of rock with a fossil shell in one layer" },
    labels: [
      { answer: "youngest layer", x: 410, y: 38, ax: 361, ay: 38 },
      { answer: "oldest layer", x: 410, y: 182, ax: 361, ay: 182 },
      { answer: "fossil", x: 30, y: 125, ax: 192, ay: 125 },
    ],
  };
}

// ---------------------------------------------------------------- topic map

const MAP: Record<string, (grade: number) => Diagram | null> = {
  water_cycle: () => waterCycle(),
  plant_parts: () => plantParts(),
  plant_needs: () => plantNeeds(),
  food_chain: (g) => foodChain(g),
  food_energy: (g) => foodChain(g),
  ecosystem_roles: (g) => foodChain(Math.max(g, 6)),
  energy_pyramid: () => energyPyramid(),
  states_of_matter: () => statesOfMatter(),
  matter_particles: () => statesOfMatter(),
  solar_system: () => solarSystem(),
  solar_system_planets: () => solarSystem(),
  solar_system_earth_moon: () => moonPhases(),
  moon_seasons: () => moonPhases(),
  life_cycles: (g) => lifeCycle(g),
  electricity: () => circuit(),
  circuits: () => circuit(),
  simple_machines: () => lever(),
  cell_biology: () => plantCell(),
  chemistry_atoms: () => atom(),
  atomic_structure: () => atom(),
  earth_rocks_tectonics: () => earthLayers(),
  earth_science: () => earthLayers(),
  waves_basic: () => wave(),
  wave_equation: () => wave(),
  balanced_forces: (g) => forces(g),
  forces_motion: (g) => forces(g),
  forces_laws: (g) => forces(g),
  newton_second_law: (g) => forces(g),
  light_shadows: () => shadow(),
  stars_shadows: () => shadow(),
  em_spectrum: () => emSpectrum(),
  bio_photosynthesis_respiration: () => photosynthesis(),
  heat_transfer: () => heatTransfer(),
  periodic_table_basics: () => periodicTile(),
  landforms_water: () => landforms(),
  weather_climate: (g) => (g <= 4 ? weatherSymbols() : null),
  magnetism: () => magnet(),
  fossils: () => rockLayers(),
  geologic_time: () => rockLayers(),
};

export function scienceDiagram(topic: string, grade: number): Diagram | null {
  return MAP[topic]?.(grade) ?? null;
}

export const DIAGRAM_TOPICS = Object.keys(MAP);
