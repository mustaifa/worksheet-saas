export type Topic = {
  id: string;
  label: string;
  grades: number[];
};

export const TOPICS: Topic[] = [
  { id: "addsub", label: "Addition & Subtraction", grades: [1, 2] },
  { id: "counting", label: "Counting & Sequences", grades: [1] },
  { id: "comparing", label: "Comparing Numbers", grades: [1, 2] },
  { id: "shapes", label: "Shapes & Basics", grades: [1, 2, 3] },
  { id: "placevalue", label: "Place Value & Rounding", grades: [2, 3, 4] },
  { id: "multdiv", label: "Multiplication & Division", grades: [3, 4] },
  { id: "fractions_intro", label: "Intro to Fractions", grades: [3, 4] },
  { id: "decimals_intro", label: "Intro to Decimals", grades: [4, 5] },
  { id: "wordproblems", label: "Word Problems", grades: [1, 2, 3, 4] },
  { id: "fractions", label: "Fractions", grades: [5, 6] },
  { id: "decimals", label: "Decimals", grades: [5, 6] },
  { id: "geometry", label: "Geometry", grades: [4, 5, 6, 7, 8] },
  { id: "stats", label: "Statistics", grades: [5, 6, 7, 8] },
  { id: "order", label: "Order of Operations", grades: [5, 6, 7] },
  { id: "ratios", label: "Ratios & Rates", grades: [6, 7] },
  { id: "percent", label: "Percentages", grades: [6, 7, 8] },
  { id: "integers", label: "Integers", grades: [6, 7, 8] },
  { id: "expressions", label: "Expressions & Equations", grades: [6, 7] },
  { id: "proportions", label: "Proportions", grades: [7, 8] },
  { id: "linear", label: "Linear Equations", grades: [8] },
  { id: "exponents", label: "Exponents", grades: [8] },
];

export type Difficulty = "easy" | "medium" | "hard";
export type Question = { q: string; a: string };

// ---------- seeded RNG so a generated worksheet can be reproduced from a link ----------
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const names = ["Maria", "Jayden", "Aisha", "Liam", "Priya", "Noah", "Zoe", "Kenji", "Amara", "Diego", "Ines", "Sam"];
const objects = ["stickers", "marbles", "pencils", "trading cards", "cookies", "ribbons", "beads", "notebooks"];

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}
function simplifyFrac(n: number, d: number): [number, number] {
  const g = gcd(n, d);
  return [n / g, d / g];
}
function fracStr(n: number, d: number) { return d === 1 ? `${n}` : `${n}/${d}`; }
function mixedStr(n: number, d: number) {
  if (Math.abs(n) < d) return fracStr(n, d);
  const whole = Math.trunc(n / d);
  const rem = Math.abs(n) % d;
  return rem === 0 ? `${whole}` : `${whole} ${rem}/${d}`;
}

type RNG = () => number;

function makeHelpers(rng: RNG) {
  const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  const pick = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
  return { randInt, pick };
}

const dr = <T,>(level: Difficulty, ranges: Record<Difficulty, T>): T => ranges[level];

type Gen = (grade: number, diff: Difficulty, rng: RNG) => Question;

const genAddSub: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = grade === 1 ? { easy: 10, medium: 20, hard: 20 }[diff] : { easy: 50, medium: 100, hard: 200 }[diff];
  const op = pick(["+", "-"]);
  let a = randInt(0, max), b = randInt(0, max);
  if (op === "-" && b > a) [a, b] = [b, a];
  return { q: `${a} ${op} ${b} = ?`, a: `${op === "+" ? a + b : a - b}` };
};

const genCounting: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const step = pick(diff === "easy" ? [1, 2] : diff === "medium" ? [2, 5, 10] : [3, 4, 5, 10]);
  const start = randInt(1, 30);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  return { q: `What comes next? ${seq.join(", ")}, __`, a: `${start + 4 * step}` };
};

const genComparing: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const max = grade === 1 ? { easy: 20, medium: 50, hard: 99 }[diff] : { easy: 100, medium: 500, hard: 999 }[diff];
  const a = randInt(0, max), b = randInt(0, max);
  return { q: `Compare: ${a} ___ ${b}  (use <, >, or =)`, a: a > b ? ">" : a < b ? "<" : "=" };
};

const genShapes: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const facts = [
    { name: "triangle", sides: 3, corners: 3 }, { name: "square", sides: 4, corners: 4 },
    { name: "rectangle", sides: 4, corners: 4 }, { name: "pentagon", sides: 5, corners: 5 },
    { name: "hexagon", sides: 6, corners: 6 }, { name: "octagon", sides: 8, corners: 8 },
  ];
  const s = pick(facts);
  const askSides = rng() < 0.5;
  return askSides
    ? { q: `How many sides does a ${s.name} have?`, a: `${s.sides}` }
    : { q: `How many corners (vertices) does a ${s.name} have?`, a: `${s.corners}` };
};

const genPlaceValue: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const digits = grade <= 2 ? { easy: 2, medium: 3, hard: 3 }[diff] : { easy: 3, medium: 4, hard: 5 }[diff];
  const num = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  if (rng() < 0.5) {
    const numStr = `${num}`;
    const pos = randInt(0, numStr.length - 1);
    const digit = numStr[pos];
    const placeValue = Math.pow(10, numStr.length - 1 - pos) * parseInt(digit, 10);
    return { q: `What is the value of the digit ${digit} in ${num.toLocaleString()}?`, a: `${placeValue.toLocaleString()}` };
  }
  const options = digits >= 4 ? [10, 100, 1000] : digits === 3 ? [10, 100] : [10];
  const roundTo = pick(options);
  return { q: `Round ${num.toLocaleString()} to the nearest ${roundTo}.`, a: `${(Math.round(num / roundTo) * roundTo).toLocaleString()}` };
};

const genMultDiv: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = grade === 3 ? { easy: 5, medium: 10, hard: 12 }[diff] : { easy: 9, medium: 12, hard: 15 }[diff];
  if (pick(["×", "÷"]) === "×") { const a = randInt(2, max), b = randInt(2, max); return { q: `${a} × ${b} = ?`, a: `${a * b}` }; }
  const b = randInt(2, max), quotient = randInt(2, max);
  return { q: `${b * quotient} ÷ ${b} = ?`, a: `${quotient}` };
};

const genFractionsIntro: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = pick(diff === "easy" ? [2, 4] : diff === "medium" ? [3, 4, 5, 6] : [4, 5, 6, 8, 10]);
  const n = randInt(1, d - 1);
  if (rng() < 0.5) {
    const item = pick(["pizza", "chocolate bar", "garden", "cake"]);
    return { q: `A ${item} is cut into ${d} equal pieces. If you have ${n} piece(s), what fraction is that?`, a: `${n}/${d}` };
  }
  let n2 = randInt(1, d - 1); while (n2 === n) n2 = randInt(1, d - 1);
  return { q: `Compare: ${n}/${d} ___ ${n2}/${d}  (use <, >, or =)`, a: n > n2 ? ">" : n < n2 ? "<" : "=" };
};

const genDecimalsIntro: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  if (rng() < 0.5) {
    const tenths = randInt(1, 9), hundredths = diff === "easy" ? 0 : randInt(0, 9);
    const num = hundredths ? `0.${tenths}${hundredths}` : `0.${tenths}`;
    return { q: `What digit is in the tenths place of ${num}?`, a: `${tenths}` };
  }
  const a = (randInt(1, 99) / 10).toFixed(1), b = (randInt(1, 99) / 10).toFixed(1);
  return { q: `Compare: ${a} ___ ${b}  (use <, >, or =)`, a: parseFloat(a) > parseFloat(b) ? ">" : parseFloat(a) < parseFloat(b) ? "<" : "=" };
};

const genWordProblemsEarly: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const person = pick(names), item = pick(objects);
  const max = grade <= 2 ? { easy: 10, medium: 20, hard: 50 }[diff] : { easy: 20, medium: 60, hard: 150 }[diff];
  const op = grade <= 2 ? pick(["+", "-"]) : pick(["+", "-", "×"]);
  let a = randInt(2, max), b = randInt(2, grade <= 2 ? max : 12);
  if (op === "+") return { q: `${person} has ${a} ${item}. A friend gives them ${b} more. How many ${item} does ${person} have now?`, a: `${a + b}` };
  if (op === "-") { if (b > a) [a, b] = [b, a]; return { q: `${person} has ${a} ${item} and gives away ${b}. How many are left?`, a: `${a - b}` }; }
  return { q: `${person} has ${b} bags with ${a} ${item} in each bag. How many ${item} in total?`, a: `${a * b}` };
};

const genFraction: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const dens = dr(diff, { easy: [2, 3, 4, 5, 6], medium: [2, 3, 4, 5, 6, 8, 9, 10, 12], hard: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12] });
  const ops = dr(diff, { easy: ["+", "-"], medium: ["+", "-", "×"], hard: ["+", "-", "×", "÷"] });
  const op = pick(ops);
  let d1 = pick(dens), d2 = pick(dens), n1 = randInt(1, d1 * 2), n2 = randInt(1, d2 * 2);
  if (diff === "easy") { n1 = randInt(1, d1 - 1); n2 = randInt(1, d1 - 1); d2 = d1; }
  if (op === "+" || op === "-") {
    const num = op === "+" ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
    const [sn, sd] = simplifyFrac(num, d1 * d2);
    return { q: `${fracStr(n1, d1)} ${op} ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) };
  }
  if (op === "×") { const [sn, sd] = simplifyFrac(n1 * n2, d1 * d2); return { q: `${fracStr(n1, d1)} × ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) }; }
  const [sn, sd] = simplifyFrac(n1 * d2, d1 * n2);
  return { q: `${fracStr(n1, d1)} ÷ ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) };
};

const genDecimal: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const places = dr(diff, { easy: 1, medium: 2, hard: 2 });
  const maxWhole = dr(diff, { easy: 20, medium: 80, hard: 300 });
  const ops = dr(diff, { easy: ["+", "-"], medium: ["+", "-", "×"], hard: ["+", "-", "×", "÷"] });
  const op = ops[Math.floor(rng() * ops.length)];
  const rnd = () => parseFloat((rng() * maxWhole).toFixed(places));
  let a = rnd(), b = rnd(), result: number;
  if (op === "-" && b > a) [a, b] = [b, a];
  if (op === "+") result = a + b;
  else if (op === "-") result = a - b;
  else if (op === "×") { b = parseFloat((rng() * 9 + 1).toFixed(1)); result = a * b; }
  else { const divisor = randInt(2, 9); a = parseFloat((divisor * randInt(2, 10)).toFixed(0)); b = divisor; result = a / b; }
  return { q: `${a} ${op} ${b} = ?`, a: `${Math.round(result * 100) / 100}` };
};

const genRatio: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(diff === "easy" ? ["simplify", "equivalent"] : ["simplify", "equivalent", "unitrate"]);
  if (kind === "simplify") { const g = randInt(2, 6), x = randInt(2, 9), y = randInt(2, 9); const [rn, rd] = simplifyFrac(x * g, y * g); return { q: `Write the ratio ${x * g} : ${y * g} in simplest form.`, a: `${rn} : ${rd}` }; }
  if (kind === "equivalent") { const a1 = randInt(2, 9), b1 = randInt(2, 9), mult = randInt(2, diff === "hard" ? 8 : 5); return { q: `${a1} : ${b1} = ${a1 * mult} : ?`, a: `${b1 * mult}` }; }
  const person = pick(names), item = pick(["miles", "pages", "laps", "problems", "words typed"]), hours = randInt(2, 6), rate = randInt(3, diff === "hard" ? 15 : 9);
  return { q: `${person} completed ${hours * rate} ${item} in ${hours} hours. What is the rate per hour?`, a: `${rate} ${item} per hour` };
};

const genPercent: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(["findpercent", "wordproblem", "convert"]);
  if (kind === "convert") { const d = pick([4, 5, 10, 20, 25, 50]), n = randInt(1, d - 1); return { q: `Write ${n}/${d} as a percent.`, a: `${Math.round((n / d) * 100)}%` }; }
  const pct = pick(dr(diff, { easy: [10, 20, 25, 50], medium: [10, 15, 20, 25, 30, 40, 60, 75], hard: [8, 12, 15, 35, 45, 65, 85] }));
  const base = dr(diff, {
    easy: () => randInt(1, 20) * 10,
    medium: () => randInt(1, 50) * 4,
    hard: () => randInt(10, 300),
  })();
  const result = Math.round(((pct / 100) * base) * 100) / 100;
  if (kind === "findpercent") return { q: `What is ${pct}% of ${base}?`, a: `${result}` };
  const item = pick(["backpack", "skateboard", "book set", "video game", "pair of shoes"]);
  return { q: `A ${item} costs $${base}. It is on sale for ${pct}% off. How much is the discount?`, a: `$${result}` };
};

const genIntegerV2: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const range = dr(diff, { easy: 10, medium: 25, hard: 60 });
  const op = pick(dr(diff, { easy: ["+", "-"], medium: ["+", "-", "×"], hard: ["+", "-", "×", "÷"] }));
  let a = randInt(-range, range) || 1, b: number, result: number;
  if (op === "×") { b = randInt(-12, 12) || 3; result = a * b; }
  else if (op === "÷") { const divisor = randInt(2, 9) * (rng() < 0.5 ? -1 : 1); const q = randInt(-12, 12) || 2; a = divisor * q; b = divisor; result = q; }
  else { b = randInt(-range, range) || 1; result = op === "+" ? a + b : a - b; }
  const bStr = b < 0 ? `(${b})` : `${b}`;
  return { q: `${a} ${op} ${bStr} = ?`, a: `${result}` };
};

const genOrderOfOps: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const n1 = randInt(2, 9), n2 = randInt(2, 9), n3 = randInt(2, 9), n4 = randInt(1, 5);
  if (diff === "easy") return { q: `${n1} + ${n2} × ${n3} = ?`, a: `${n1 + n2 * n3}` };
  if (diff === "medium") return { q: `(${n1} + ${n2}) × ${n3} - ${n4} = ?`, a: `${(n1 + n2) * n3 - n4}` };
  const n5 = randInt(2, 6);
  return { q: `${n1} × (${n2} + ${n3}) - ${n4} × ${n5} = ?`, a: `${n1 * (n2 + n3) - n4 * n5}` };
};

const genExpression: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  if (pick(diff === "easy" ? ["evaluate"] : ["evaluate", "equation"]) === "evaluate") {
    const x = randInt(1, diff === "hard" ? 12 : 8), coeff = randInt(2, 9), add = randInt(1, 15);
    if (diff === "hard" && rng() < 0.4) return { q: `Evaluate ${coeff}x² + ${add} when x = ${x}.`, a: `${coeff * x * x + add}` };
    return { q: `Evaluate ${coeff}x + ${add} when x = ${x}.`, a: `${coeff * x + add}` };
  }
  const coeff = diff === "hard" ? randInt(2, 9) : 1, x = randInt(2, diff === "hard" ? 15 : 12), add = randInt(1, 20), total = coeff * x + add;
  return { q: `Solve for x: ${coeff === 1 ? `x + ${add}` : `${coeff}x + ${add}`} = ${total}`, a: `x = ${x}` };
};

const genGeometry: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(diff === "easy" ? ["rect", "triangle"] : ["rect", "triangle", "parallelogram", "volume"]);
  if (kind === "rect") { const w = randInt(3, 15), h = randInt(3, 15); return { q: `Find the area of a rectangle with length ${w} cm and width ${h} cm.`, a: `${w * h} cm²` }; }
  if (kind === "triangle") { const b = randInt(4, 20), h = randInt(4, 20); return { q: `Find the area of a triangle with base ${b} cm and height ${h} cm.`, a: `${(b * h) / 2} cm²` }; }
  if (kind === "parallelogram") { const b = randInt(4, 18), h = randInt(3, 15); return { q: `Find the area of a parallelogram with base ${b} cm and height ${h} cm.`, a: `${b * h} cm²` }; }
  const l = randInt(2, 10), w = randInt(2, 10), h = randInt(2, 10);
  return { q: `Find the volume of a rectangular prism with length ${l} cm, width ${w} cm, and height ${h} cm.`, a: `${l * w * h} cm³` };
};

const genStats: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const size = dr(diff, { easy: 5, medium: 6, hard: 7 });
  const max = dr(diff, { easy: 20, medium: 50, hard: 100 });
  const data = Array.from({ length: size }, () => randInt(1, max));
  const sorted = [...data].sort((a, b) => a - b);
  const kind = pick(["mean", "median", "range", "mode"]);
  if (kind === "mean") return { q: `Find the mean of: ${data.join(", ")}`, a: `${Math.round((data.reduce((s, v) => s + v, 0) / data.length) * 100) / 100}` };
  if (kind === "median") { const mid = Math.floor(sorted.length / 2); return { q: `Find the median of: ${data.join(", ")}`, a: `${sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]}` }; }
  if (kind === "range") return { q: `Find the range of: ${data.join(", ")}`, a: `${sorted[sorted.length - 1] - sorted[0]}` };
  const dupIndex = randInt(0, data.length - 2); data[dupIndex + 1] = data[dupIndex];
  const counts: Record<number, number> = {};
  data.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  const modeVal = Object.keys(counts).reduce((a, b) => (counts[+a] >= counts[+b] ? a : b));
  return { q: `Find the mode of: ${data.join(", ")}`, a: `${modeVal}` };
};

const genProportions: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const a = randInt(2, 12), b = randInt(2, 12), mult = randInt(2, diff === "hard" ? 9 : 6);
  return { q: `Solve the proportion: ${a}/${b} = ${a * mult}/x`, a: `x = ${b * mult}` };
};

const genLinear: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const coeff = randInt(2, diff === "hard" ? 9 : 6), x = randInt(-12, 12) || 2, add = randInt(1, 20) * (rng() < 0.5 ? -1 : 1);
  const total = coeff * x + add;
  return { q: `Solve for x: ${coeff}x ${add >= 0 ? `+ ${add}` : `- ${Math.abs(add)}`} = ${total}`, a: `x = ${x}` };
};

const genExponents: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const base = randInt(2, diff === "hard" ? 6 : 5), exp = diff === "easy" ? 2 : randInt(2, 3);
  return { q: `Evaluate: ${base}^${exp}`, a: `${Math.pow(base, exp)}` };
};

const GENERATORS: Record<string, Gen> = {
  addsub: genAddSub, counting: genCounting, comparing: genComparing, shapes: genShapes,
  placevalue: genPlaceValue, multdiv: genMultDiv, fractions_intro: genFractionsIntro,
  decimals_intro: genDecimalsIntro, wordproblems: genWordProblemsEarly,
  fractions: genFraction, decimals: genDecimal, geometry: genGeometry, stats: genStats,
  order: genOrderOfOps, ratios: genRatio, percent: genPercent, integers: genIntegerV2,
  expressions: genExpression, proportions: genProportions, linear: genLinear, exponents: genExponents,
};

export function generateWorksheet(opts: {
  grade: number;
  topic: string;
  difficulty: Difficulty;
  count: number;
  seed: number;
}): Question[] {
  const rng = mulberry32(opts.seed);
  const gen = GENERATORS[opts.topic];
  if (!gen) return [];
  const list: Question[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (list.length < opts.count && attempts < opts.count * 25) {
    attempts++;
    const item = gen(opts.grade, opts.difficulty, rng);
    if (seen.has(item.q)) continue;
    seen.add(item.q);
    list.push(item);
  }
  return list;
}

export function topicsForGrade(grade: number): Topic[] {
  return TOPICS.filter((t) => t.grades.includes(grade));
}
