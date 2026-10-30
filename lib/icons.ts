/**
 * A small library of friendly pictures for early-grade worksheets: fruit,
 * animals and everyday objects, all drawn in one style from the same
 * primitives as the other worksheet pictures (so they print sharply and work
 * in the PDF). Each picture knows its word, first letter, rhyme family and
 * whether it is a living thing, so generators can build sound, rhyme and
 * sorting activities from it.
 *
 * Every icon is drawn in a 48 × 48 box.
 */
import type { Shape } from "./worksheetVisuals";

export type Icon = {
  word: string;
  /** Plural used in counting/word problems ("3 apples"). */
  plural: string;
  rhyme?: string;
  living?: boolean;
  /** Food, animal or thing — used to pick sensible sets. */
  kind: "food" | "animal" | "thing" | "nature";
  draw: () => Shape[];
};

const INK = "#1e293b";
const RED = "#f87171", ORANGE = "#fb923c", YELLOW = "#fde047", GREEN = "#4ade80", DGREEN = "#16a34a", BLUE = "#60a5fa";
const PURPLE = "#c4b5fd", PINK = "#f9a8d4", BROWN = "#b45309", TAN = "#e7c9a0", GREY = "#cbd5e1", WHITE = "#ffffff", SKY = "#bae6fd";

// ---------------------------------------------------------------- helpers

function ell(cx: number, cy: number, rx: number, ry: number, fill: string, sw = 1.6, n = 28): Shape {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return { k: "poly", pts, closed: true, fill, stroke: INK, sw };
}
const circ = (cx: number, cy: number, r: number, fill: string, sw = 1.6): Shape => (sw ? { k: "circle", cx, cy, r, fill, stroke: INK, sw } : { k: "circle", cx, cy, r, fill });
const dot = (cx: number, cy: number, r = 1.6, fill = INK): Shape => ({ k: "circle", cx, cy, r, fill });
const rect = (x: number, y: number, w: number, h: number, fill: string, r = 0, sw = 1.6): Shape => (sw ? { k: "rect", x, y, w, h, r, fill, stroke: INK, sw } : { k: "rect", x, y, w, h, r, fill });
const poly = (pts: [number, number][], fill: string, sw = 1.6): Shape => ({ k: "poly", pts, closed: true, fill, stroke: INK, sw });
const line = (x1: number, y1: number, x2: number, y2: number, sw = 1.6, stroke = INK): Shape => ({ k: "line", x1, y1, x2, y2, stroke, sw });
const path = (pts: [number, number][], sw = 1.6, stroke = INK): Shape => ({ k: "poly", pts, stroke, sw });

function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 12): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return pts;
}
const smile = (cx: number, cy: number, r = 3.5): Shape => path(arc(cx, cy, r, 0.3, Math.PI - 0.3, 8), 1.3);
const eyes = (cx: number, cy: number, gap = 4): Shape[] => [dot(cx - gap, cy), dot(cx + gap, cy)];

function leafShape(cx: number, cy: number, len: number, ang: number, fill = GREEN): Shape {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([t * len, -Math.sin(t * Math.PI) * len * 0.35]); }
  for (let i = 12; i >= 0; i--) { const t = i / 12; pts.push([t * len, Math.sin(t * Math.PI) * len * 0.35]); }
  const c = Math.cos(ang), s = Math.sin(ang);
  return poly(pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]), fill, 1.3);
}

function starPts(cx: number, cy: number, r: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return pts;
}

// ---------------------------------------------------------------- icons

const ICON_LIST: Icon[] = [
  // ---- food
  { word: "apple", plural: "apples", kind: "food", draw: () => [ell(24, 28, 15, 14, RED), line(24, 15, 25, 7, 2, BROWN), leafShape(25, 10, 11, -0.5)] },
  { word: "banana", plural: "bananas", kind: "food", draw: () => [poly([...arc(24, 6, 30, 0.75, 2.4, 14), ...arc(24, 2, 24, 2.25, 0.85, 14)], YELLOW), line(43, 26, 45, 23, 2.4, BROWN)] },
  { word: "pear", plural: "pears", kind: "food", draw: () => [poly([...arc(24, 31, 14, -0.4, Math.PI + 0.4, 16), [16, 17], [20, 10], [28, 10], [32, 17]], "#bef264"), line(24, 10, 25, 4, 2, BROWN)] },
  { word: "cherry", plural: "cherries", kind: "food", draw: () => [circ(15, 34, 8, RED), circ(33, 34, 8, RED), path([[15, 26], [24, 8], [33, 26]], 1.6, DGREEN), leafShape(24, 8, 10, -0.3)] },
  { word: "strawberry", plural: "strawberries", kind: "food", draw: () => [poly([[8, 16], [40, 16], [36, 30], [24, 44], [12, 30]], RED), ...[[16, 22], [24, 21], [32, 22], [20, 30], [28, 30], [24, 37]].map(([x, y]) => dot(x, y, 1.1, "#fef08a")), poly([[12, 16], [18, 8], [22, 14], [26, 8], [30, 14], [36, 16]], GREEN, 1.3)] },
  { word: "carrot", plural: "carrots", kind: "food", draw: () => [poly([[16, 14], [32, 14], [25, 46]], ORANGE), line(19, 22, 23, 22, 1.2), line(21, 30, 26, 30, 1.2), leafShape(24, 14, 12, -1.9, GREEN), leafShape(24, 14, 12, -1.2, GREEN)] },
  { word: "grapes", plural: "bunches of grapes", kind: "food", draw: () => [...[[17, 17], [26, 17], [35, 17], [21, 25], [30, 25], [25, 33], [16, 26], [34, 26], [25, 41]].map(([x, y]) => circ(x, y, 5.5, PURPLE, 1.3)), line(26, 11, 27, 4, 2, BROWN)] },
  { word: "egg", plural: "eggs", kind: "food", draw: () => [ell(24, 26, 13, 17, "#fef9c3")] },
  { word: "cake", plural: "cakes", rhyme: "ake", kind: "food", draw: () => [rect(8, 22, 32, 20, PINK, 3), path([[8, 28], [14, 32], [20, 28], [26, 32], [32, 28], [40, 32]], 1.3), rect(22, 10, 4, 12, BLUE, 1, 1.2), poly([[24, 4], [21, 9], [27, 9]], YELLOW, 1)] },
  { word: "cookie", plural: "cookies", kind: "food", draw: () => [circ(24, 24, 17, TAN), ...[[18, 18], [29, 16], [31, 28], [20, 30], [25, 23]].map(([x, y]) => dot(x, y, 2.4, BROWN))] },
  { word: "bun", plural: "buns", rhyme: "un", kind: "food", draw: () => [poly([...arc(24, 30, 18, Math.PI, Math.PI * 2, 16), [42, 34], [6, 34]], TAN), ...[[16, 20], [24, 17], [32, 20]].map(([x, y]) => dot(x, y, 1.2, "#fef3c7"))] },

  // ---- animals
  { word: "cat", plural: "cats", rhyme: "at", living: true, kind: "animal", draw: () => [poly([[10, 22], [12, 6], [20, 14], [28, 14], [36, 6], [38, 22]], ORANGE), ell(24, 27, 15, 14, ORANGE), ...eyes(24, 25, 5), poly([[22, 30], [26, 30], [24, 32]], PINK, 1), line(8, 30, 18, 31, 1), line(8, 34, 18, 33, 1), line(30, 31, 40, 30, 1), line(30, 33, 40, 34, 1)] },
  { word: "dog", plural: "dogs", rhyme: "og", living: true, kind: "animal", draw: () => [ell(24, 26, 14, 15, TAN), ell(10, 24, 5, 11, BROWN), ell(38, 24, 5, 11, BROWN), ...eyes(24, 22, 5), ell(24, 31, 4, 3, INK, 1), smile(24, 34, 3)] },
  { word: "fish", plural: "fish", rhyme: "ish", living: true, kind: "animal", draw: () => [poly([[34, 24], [46, 14], [46, 34]], ORANGE), ell(22, 24, 16, 11, ORANGE), dot(13, 21, 2), path(arc(28, 24, 7, -1.2, 1.2, 8), 1.2)] },
  { word: "bird", plural: "birds", living: true, kind: "animal", draw: () => [ell(24, 28, 15, 12, BLUE), circ(14, 18, 8, BLUE), dot(12, 16, 1.6), poly([[5, 18], [1, 21], [6, 21]], ORANGE, 1.2), poly([[24, 26], [38, 20], [32, 32]], "#3b82f6", 1.3), line(22, 40, 20, 46, 1.4), line(28, 40, 30, 46, 1.4)] },
  { word: "bee", plural: "bees", rhyme: "ee", living: true, kind: "animal", draw: () => [ell(16, 14, 8, 6, SKY, 1.2), ell(30, 14, 8, 6, SKY, 1.2), ell(24, 28, 16, 11, YELLOW), rect(18, 18, 4, 20, INK, 0, 0), rect(26, 18, 4, 20, INK, 0, 0), dot(12, 26, 1.6), poly([[40, 28], [46, 28], [40, 31]], INK, 1)] },
  { word: "frog", plural: "frogs", rhyme: "og", living: true, kind: "animal", draw: () => [ell(24, 30, 18, 12, GREEN), circ(15, 18, 6, GREEN), circ(33, 18, 6, GREEN), dot(15, 18, 2.2), dot(33, 18, 2.2), path(arc(24, 28, 9, 0.3, Math.PI - 0.3, 10), 1.4)] },
  { word: "duck", plural: "ducks", rhyme: "uck", living: true, kind: "animal", draw: () => [ell(26, 32, 17, 11, YELLOW), circ(14, 16, 8, YELLOW), dot(13, 14, 1.6), poly([[6, 17], [0, 19], [6, 21]], ORANGE, 1.2), path(arc(30, 30, 7, 0.2, 2.2, 8), 1.2)] },
  { word: "pig", plural: "pigs", rhyme: "ig", living: true, kind: "animal", draw: () => [poly([[10, 16], [12, 6], [19, 12]], PINK), poly([[38, 16], [36, 6], [29, 12]], PINK), circ(24, 26, 16, PINK), ell(24, 31, 7, 5, "#f472b6", 1.3), dot(21, 31, 1.3), dot(27, 31, 1.3), ...eyes(24, 21, 6)] },
  { word: "hen", plural: "hens", rhyme: "en", living: true, kind: "animal", draw: () => [ell(26, 30, 16, 13, WHITE), circ(14, 16, 8, WHITE), poly([[10, 8], [13, 4], [16, 8], [19, 5], [20, 10]], RED, 1.1), dot(13, 15, 1.6), poly([[6, 16], [1, 18], [6, 20]], ORANGE, 1.2), line(22, 43, 21, 47, 1.4), line(30, 43, 31, 47, 1.4)] },
  { word: "snail", plural: "snails", rhyme: "ail", living: true, kind: "animal", draw: () => [poly([[4, 40], [44, 40], [44, 34], [10, 34]], "#d9f99d"), circ(26, 24, 12, "#fdba74"), path(arc(26, 24, 6, 0, Math.PI * 1.6, 10), 1.3), line(8, 34, 5, 24, 1.3), line(11, 34, 11, 24, 1.3), dot(5, 23, 1.5), dot(11, 23, 1.5)] },
  { word: "bug", plural: "bugs", rhyme: "ug", living: true, kind: "animal", draw: () => [circ(24, 27, 15, RED), line(24, 12, 24, 42, 1.4), circ(24, 12, 6, INK), ...[[17, 22], [31, 22], [18, 33], [30, 33]].map(([x, y]) => dot(x, y, 2.4)), line(20, 7, 17, 3, 1.2), line(28, 7, 31, 3, 1.2)] },
  { word: "mouse", plural: "mice", rhyme: "ouse", living: true, kind: "animal", draw: () => [circ(13, 15, 7, GREY), circ(35, 15, 7, GREY), ell(24, 28, 15, 13, GREY), ...eyes(24, 25, 5), dot(24, 32, 2.2, PINK), line(14, 32, 4, 31, 1), line(34, 32, 44, 31, 1)] },
  { word: "owl", plural: "owls", living: true, kind: "animal", draw: () => [ell(24, 27, 16, 18, "#a16207"), ell(24, 32, 9, 10, "#fde68a", 1.2), circ(17, 20, 6, WHITE), circ(31, 20, 6, WHITE), dot(17, 20, 2.4), dot(31, 20, 2.4), poly([[22, 25], [26, 25], [24, 29]], ORANGE, 1), poly([[10, 10], [13, 4], [17, 10]], "#a16207", 1.2), poly([[38, 10], [35, 4], [31, 10]], "#a16207", 1.2)] },
  { word: "snake", plural: "snakes", rhyme: "ake", living: true, kind: "animal", draw: () => [path([[6, 38], [14, 30], [22, 38], [30, 30], [36, 22]], 6, DGREEN), path([[6, 38], [14, 30], [22, 38], [30, 30], [36, 22]], 3.5, GREEN), ell(39, 18, 6, 5, GREEN, 1.3), dot(40, 16, 1.2), line(44, 19, 47, 20, 1, RED)] },
  { word: "fox", plural: "foxes", rhyme: "ox", living: true, kind: "animal", draw: () => [poly([[6, 8], [16, 14], [32, 14], [42, 8], [40, 24], [24, 42], [8, 24]], ORANGE), poly([[16, 30], [24, 42], [32, 30], [24, 34]], WHITE, 1.2), ...eyes(24, 22, 7), dot(24, 40, 2)] },
  { word: "goat", plural: "goats", rhyme: "oat", living: true, kind: "animal", draw: () => [path([[16, 12], [12, 4], [8, 6]], 2.2, BROWN), path([[32, 12], [36, 4], [40, 6]], 2.2, BROWN), ell(24, 24, 12, 15, "#e7e5e4"), ell(9, 18, 6, 3, "#e7e5e4", 1.3), ell(39, 18, 6, 3, "#e7e5e4", 1.3), ...eyes(24, 20, 5), poly([[20, 38], [28, 38], [24, 47]], "#e7e5e4", 1.2)] },
  { word: "rabbit", plural: "rabbits", living: true, kind: "animal", draw: () => [ell(18, 12, 4, 11, WHITE), ell(30, 12, 4, 11, WHITE), circ(24, 30, 13, WHITE), ...eyes(24, 28, 5), dot(24, 33, 1.8, PINK)] },

  // ---- things
  { word: "ball", plural: "balls", rhyme: "all", kind: "thing", draw: () => [circ(24, 24, 18, RED), path(arc(4, 24, 22, -0.8, 0.8, 10), 1.4), path(arc(44, 24, 22, Math.PI - 0.8, Math.PI + 0.8, 10), 1.4), line(6, 24, 42, 24, 1.4)] },
  { word: "car", plural: "cars", rhyme: "ar", kind: "thing", draw: () => [poly([[4, 32], [6, 22], [14, 22], [18, 13], [32, 13], [37, 22], [44, 24], [44, 32]], RED), rect(20, 16, 10, 6, SKY, 1, 1), circ(13, 33, 5, INK, 1), circ(36, 33, 5, INK, 1), dot(13, 33, 2, GREY), dot(36, 33, 2, GREY)] },
  { word: "bus", plural: "buses", kind: "thing", draw: () => [rect(3, 10, 42, 26, YELLOW, 3), ...[6, 15, 24, 33].map((x) => rect(x, 14, 7, 8, SKY, 1, 1)), circ(12, 37, 5, INK, 1), circ(36, 37, 5, INK, 1), dot(12, 37, 2, GREY), dot(36, 37, 2, GREY)] },
  { word: "boat", plural: "boats", rhyme: "oat", kind: "thing", draw: () => [poly([[4, 30], [44, 30], [38, 40], [10, 40]], BROWN), line(24, 30, 24, 4, 1.8), poly([[24, 6], [24, 28], [40, 28]], WHITE, 1.4), path([[2, 44], [10, 41], [18, 44], [26, 41], [34, 44], [42, 41]], 1.4, "#3b82f6")] },
  { word: "kite", plural: "kites", rhyme: "ite", kind: "thing", draw: () => [poly([[24, 2], [38, 18], [24, 34], [10, 18]], PINK), line(24, 2, 24, 34, 1), line(10, 18, 38, 18, 1), path([[24, 34], [20, 40], [26, 42], [22, 47]], 1.2), poly([[19, 40], [16, 38], [16, 42]], BLUE, 1), poly([[25, 43], [28, 41], [28, 45]], YELLOW, 1)] },
  { word: "hat", plural: "hats", rhyme: "at", kind: "thing", draw: () => [ell(24, 36, 21, 6, BLUE), rect(13, 12, 22, 24, BLUE, 3), rect(13, 28, 22, 5, RED, 0, 1.2)] },
  { word: "cup", plural: "cups", rhyme: "up", kind: "thing", draw: () => [path(arc(37, 24, 7, -1.4, 1.4, 10), 2.4), poly([[8, 12], [38, 12], [34, 42], [12, 42]], "#bae6fd")] },
  { word: "mug", plural: "mugs", rhyme: "ug", kind: "thing", draw: () => [path(arc(36, 26, 8, -1.4, 1.4, 10), 2.8), rect(8, 12, 28, 30, ORANGE, 3), ...[[16, 6], [22, 4], [28, 6]].map(([x, y]) => path([[x, y + 4], [x - 2, y + 2], [x, y]], 1, "#94a3b8"))] },
  { word: "book", plural: "books", rhyme: "ook", kind: "thing", draw: () => [rect(8, 6, 32, 36, BLUE, 2), rect(8, 6, 6, 36, "#2563eb", 1), rect(18, 14, 16, 6, WHITE, 1, 1)] },
  { word: "pencil", plural: "pencils", kind: "thing", draw: () => [poly([[6, 38], [32, 12], [38, 18], [12, 44]], YELLOW), poly([[6, 38], [12, 44], [3, 47]], TAN, 1.2), dot(4, 46, 1.5), poly([[32, 12], [36, 8], [42, 14], [38, 18]], PINK, 1.2)] },
  { word: "bell", plural: "bells", rhyme: "ell", kind: "thing", draw: () => [poly([...arc(24, 20, 12, Math.PI, Math.PI * 2, 14), [38, 36], [10, 36]], YELLOW), rect(6, 36, 36, 4, "#facc15", 2, 1.3), circ(24, 42, 3.5, "#facc15", 1.2), circ(24, 6, 2.5, "#facc15", 1.2)] },
  { word: "key", plural: "keys", rhyme: "ee", kind: "thing", draw: () => [circ(14, 24, 10, YELLOW), circ(14, 24, 4, WHITE, 1.2), rect(23, 21, 22, 6, YELLOW, 1, 1.4), rect(36, 27, 4, 6, YELLOW, 0, 1.2), rect(30, 27, 3, 5, YELLOW, 0, 1.2)] },
  { word: "umbrella", plural: "umbrellas", kind: "thing", draw: () => [poly([...arc(24, 24, 20, Math.PI, Math.PI * 2, 16), [38, 24], [31, 21], [24, 24], [17, 21], [10, 24]], PURPLE), line(24, 24, 24, 40, 2), path(arc(20, 40, 4, 0, Math.PI, 8), 2)] },
  { word: "sock", plural: "socks", rhyme: "ock", kind: "thing", draw: () => [poly([[16, 4], [30, 4], [30, 30], [38, 34], [36, 44], [18, 44], [16, 36]], RED), rect(16, 4, 14, 6, WHITE, 0, 1.2)] },
  { word: "clock", plural: "clocks", rhyme: "ock", kind: "thing", draw: () => [circ(24, 24, 19, WHITE, 2), line(24, 24, 24, 11, 2), line(24, 24, 33, 28, 2), dot(24, 24, 2), ...[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2; return line(24 + Math.sin(a) * 15, 24 - Math.cos(a) * 15, 24 + Math.sin(a) * 18, 24 - Math.cos(a) * 18, 1.6); })] },
  { word: "box", plural: "boxes", rhyme: "ox", kind: "thing", draw: () => [poly([[6, 18], [16, 10], [42, 10], [32, 18]], "#fcd34d", 1.4), poly([[32, 18], [42, 10], [42, 34], [32, 42]], "#d97706", 1.4), rect(6, 18, 26, 24, "#fbbf24", 0, 1.4)] },
  { word: "drum", plural: "drums", kind: "thing", draw: () => [rect(8, 16, 32, 22, RED, 0), ell(24, 16, 16, 5, WHITE), path([[8, 20], [16, 36], [24, 20], [32, 36], [40, 20]], 1.2), line(30, 2, 40, 12, 2, BROWN), line(18, 2, 8, 12, 2, BROWN)] },
  { word: "rock", plural: "rocks", rhyme: "ock", kind: "nature", draw: () => [poly([[4, 40], [8, 24], [18, 14], [32, 16], [42, 26], [44, 40]], "#a8a29e"), line(18, 28, 26, 26, 1.1), line(30, 32, 36, 30, 1.1)] },
  { word: "house", plural: "houses", rhyme: "ouse", kind: "thing", draw: () => [poly([[4, 22], [24, 4], [44, 22]], RED), rect(9, 22, 30, 22, YELLOW, 0), rect(20, 30, 8, 14, BROWN, 0, 1.3), rect(12, 26, 6, 6, SKY, 0, 1.1), rect(31, 26, 6, 6, SKY, 0, 1.1)] },
  { word: "jar", plural: "jars", rhyme: "ar", kind: "thing", draw: () => [rect(15, 4, 18, 6, RED, 1, 1.4), rect(10, 10, 28, 34, "#e0f2fe", 6), rect(14, 22, 20, 12, WHITE, 1, 1.1)] },
  { word: "spoon", plural: "spoons", rhyme: "oon", kind: "thing", draw: () => [ell(16, 14, 8, 11, GREY), poly([[20, 22], [40, 44], [43, 41], [23, 20]], GREY, 1.4)] },
  { word: "flag", plural: "flags", rhyme: "ag", kind: "thing", draw: () => [line(10, 4, 10, 46, 2.4, BROWN), poly([[10, 6], [42, 6], [34, 15], [42, 24], [10, 24]], RED)] },
  { word: "bag", plural: "bags", rhyme: "ag", kind: "thing", draw: () => [path(arc(24, 16, 9, Math.PI, Math.PI * 2, 10), 2.4), rect(6, 16, 36, 28, "#a78bfa", 4)] },
  { word: "rug", plural: "rugs", rhyme: "ug", kind: "thing", draw: () => [rect(4, 14, 40, 22, "#fca5a5", 2), rect(10, 19, 28, 12, "#fde68a", 1, 1.2), ...[6, 12, 18, 24, 30, 36, 42].flatMap((x) => [line(x, 36, x, 41, 1), line(x, 9, x, 14, 1)])] },
  { word: "bed", plural: "beds", rhyme: "ed", kind: "thing", draw: () => [rect(4, 26, 40, 10, BLUE, 1), rect(4, 14, 6, 30, BROWN, 1, 1.3), rect(38, 22, 6, 22, BROWN, 1, 1.3), ell(17, 23, 6, 3.5, WHITE, 1.2)] },
  { word: "pen", plural: "pens", rhyme: "en", kind: "thing", draw: () => [poly([[8, 40], [34, 14], [40, 20], [14, 46]], BLUE), poly([[8, 40], [14, 46], [4, 46]], INK, 1), line(30, 10, 34, 14, 2.4)] },
  { word: "ring", plural: "rings", rhyme: "ing", kind: "thing", draw: () => [circ(24, 30, 14, "#fde68a", 2.2), circ(24, 30, 10, WHITE, 1.4), poly([[18, 12], [24, 4], [30, 12], [24, 18]], "#a5f3fc", 1.3)] },
  { word: "van", plural: "vans", rhyme: "an", kind: "thing", draw: () => [poly([[4, 34], [4, 12], [32, 12], [42, 22], [44, 34]], "#86efac"), poly([[33, 15], [39, 22], [33, 22]], SKY, 1.1), circ(13, 35, 5, INK, 1), circ(36, 35, 5, INK, 1)] },
  { word: "fan", plural: "fans", rhyme: "an", kind: "thing", draw: () => [line(24, 24, 24, 44, 2.4), rect(14, 42, 20, 4, GREY, 1, 1.3), ...[0, 1, 2].map((i) => ell(24 + Math.cos(i * 2.1) * 9, 22 + Math.sin(i * 2.1) * 9, 8, 5, SKY, 1.3)), circ(24, 22, 3, GREY, 1.2)] },
  { word: "pan", plural: "pans", rhyme: "an", kind: "thing", draw: () => [ell(20, 26, 17, 12, "#475569"), ell(20, 25, 13, 8, "#94a3b8", 1.2), rect(36, 23, 12, 5, INK, 2, 1)] },
  { word: "shell", plural: "shells", rhyme: "ell", kind: "nature", draw: () => [poly([[24, 44], [6, 20], [12, 10], [24, 6], [36, 10], [42, 20]], "#fed7aa"), ...[12, 18, 24, 30, 36].map((x) => line(24, 44, x, 9, 1.1))] },
  { word: "hook", plural: "hooks", rhyme: "ook", kind: "thing", draw: () => [line(24, 4, 24, 30, 2.6), path(arc(18, 30, 6, 0, Math.PI, 10), 2.6), circ(24, 4, 2.5, GREY, 1.2)] },
  { word: "log", plural: "logs", rhyme: "og", kind: "nature", draw: () => [rect(6, 16, 34, 18, BROWN, 0), ell(40, 25, 5, 9, TAN), path(arc(40, 25, 3, 0, Math.PI * 2, 10), 1)] },
  { word: "rake", plural: "rakes", rhyme: "ake", kind: "thing", draw: () => [line(24, 2, 24, 32, 2.6, BROWN), rect(8, 32, 32, 4, GREY, 1, 1.3), ...[10, 16, 22, 28, 34, 38].map((x) => line(x, 36, x, 44, 1.6))] },

  { word: "marble", plural: "marbles", kind: "thing", draw: () => [circ(24, 24, 16, "#93c5fd"), path(arc(24, 24, 9, 2.4, 4.6, 8), 2.4, "#1d4ed8"), path(arc(24, 24, 9, -0.8, 1.2, 8), 2.4, "#16a34a"), circ(18, 17, 3, WHITE, 0)] },
  { word: "sticker", plural: "stickers", kind: "thing", draw: () => [poly(starPts(24, 25, 20), "#fda4af"), dot(18, 22, 1.6), dot(30, 22, 1.6), smile(24, 27, 4)] },
  { word: "bead", plural: "beads", kind: "thing", draw: () => [ell(24, 24, 15, 13, "#a78bfa"), ell(24, 24, 4, 4, WHITE, 1.3)] },
  { word: "notebook", plural: "notebooks", kind: "thing", draw: () => [rect(10, 6, 30, 38, "#86efac", 2), ...[12, 20, 28, 36].map((y) => circ(10, y, 2.4, WHITE, 1.2)), line(18, 16, 34, 16, 1.2), line(18, 22, 34, 22, 1.2), line(18, 28, 34, 28, 1.2)] },
  { word: "ribbon", plural: "ribbons", kind: "thing", draw: () => [poly([[24, 22], [6, 10], [6, 34]], "#f472b6"), poly([[24, 22], [42, 10], [42, 34]], "#f472b6"), poly([[22, 24], [14, 44], [20, 42], [24, 30]], "#ec4899", 1.3), poly([[26, 24], [34, 44], [28, 42], [24, 30]], "#ec4899", 1.3), circ(24, 22, 5, "#ec4899")] },
  { word: "card", plural: "trading cards", kind: "thing", draw: () => [rect(10, 4, 28, 40, WHITE, 3), rect(14, 8, 20, 18, SKY, 1, 1.2), poly(starPts(24, 17, 6), YELLOW, 1), line(15, 32, 33, 32, 1.2), line(15, 37, 28, 37, 1.2)] },

  // ---- nature
  { word: "sun", plural: "suns", rhyme: "un", kind: "nature", draw: () => [...Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return line(24 + Math.cos(a) * 14, 24 + Math.sin(a) * 14, 24 + Math.cos(a) * 21, 24 + Math.sin(a) * 21, 2.4, "#f59e0b"); }), circ(24, 24, 11, YELLOW)] },
  { word: "moon", plural: "moons", rhyme: "oon", kind: "nature", draw: () => [poly([...arc(24, 24, 18, 1.2, 2 * Math.PI - 1.2, 18), ...arc(32, 24, 16.9, 4.62, 1.66, 18)], "#fef08a")] },
  { word: "star", plural: "stars", rhyme: "ar", kind: "nature", draw: () => [poly(starPts(24, 25, 20), YELLOW)] },
  { word: "cloud", plural: "clouds", kind: "nature", draw: () => [circ(15, 28, 9, WHITE), circ(26, 22, 12, WHITE), circ(36, 29, 8, WHITE), circ(15, 28, 7.6, WHITE, 0), circ(26, 22, 10.6, WHITE, 0), circ(36, 29, 6.6, WHITE, 0), rect(14, 29, 22, 8, WHITE, 0, 0), line(15, 37, 36, 37, 1.6)] },
  { word: "tree", plural: "trees", rhyme: "ee", living: true, kind: "nature", draw: () => [rect(20, 28, 8, 18, BROWN, 0), circ(24, 18, 15, GREEN)] },
  { word: "flower", plural: "flowers", living: true, kind: "nature", draw: () => [line(24, 26, 24, 46, 2.4, DGREEN), leafShape(24, 38, 11, -0.6), ...Array.from({ length: 6 }, (_, i) => { const a = (i * Math.PI) / 3; return circ(24 + Math.cos(a) * 8, 16 + Math.sin(a) * 8, 6, PINK, 1.3); }), circ(24, 16, 5, YELLOW, 1.3)] },
  { word: "leaf", plural: "leaves", kind: "nature", draw: () => [leafShape(6, 40, 44, -0.75, GREEN), line(6, 40, 36, 10, 1.1)] },
  { word: "heart", plural: "hearts", kind: "thing", draw: () => [poly([...arc(16, 18, 10, Math.PI * 0.9, Math.PI * 2, 10), ...arc(32, 18, 10, Math.PI, Math.PI * 2.1, 10), [24, 42]], RED)] },
];

/** All icons, by word. */
export const ICONS: Record<string, Icon> = Object.fromEntries(ICON_LIST.map((i) => [i.word, i]));
export const ICON_WORDS = Object.keys(ICONS);

/** Finds an icon by its singular or plural name. */
export function iconFor(word: string): Icon | undefined {
  const w = word.toLowerCase();
  return ICONS[w] || ICON_LIST.find((i) => i.plural === w);
}

/** Shapes for an icon placed at (x, y) and scaled to `size` px. */
export function placeIcon(icon: Icon, x: number, y: number, size = 48): Shape[] {
  const k = size / 48;
  return icon.draw().map((s): Shape => {
    const sw = "sw" in s && s.sw !== undefined ? s.sw * Math.max(0.6, k) : undefined;
    switch (s.k) {
      case "rect": return { ...s, x: x + s.x * k, y: y + s.y * k, w: s.w * k, h: s.h * k, r: s.r ? s.r * k : s.r, sw };
      case "circle": return { ...s, cx: x + s.cx * k, cy: y + s.cy * k, r: s.r * k, sw };
      case "line": return { ...s, x1: x + s.x1 * k, y1: y + s.y1 * k, x2: x + s.x2 * k, y2: y + s.y2 * k, sw };
      case "poly": return { ...s, pts: s.pts.map(([a, b]) => [x + a * k, y + b * k] as [number, number]), sw };
      case "text": return { ...s, x: x + s.x * k, y: y + s.y * k, size: (s.size || 12) * k };
    }
  });
}
