/**
 * Fine-grained Math skill generators for grades 6–8 (Common Core 6–8 domains).
 * Each one backs a leaf in the Math curriculum book (lib/curriculum/math.ts).
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import {
  frac, fAdd, fSub, fMul, fDiv, fStr, fMixed, fVal, Frac, num, round, money, gcd, lcm, linExpr, lineStr, sgn,
  nCr, factorial, factorsOf, comma, units, NAMES,
} from "./mathUtil";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];

export const MATH_MIDDLE_TOPICS: Topic[] = [
  // ---- grade 6
  T("gcf_lcm", "GCF & LCM", ["gcf", "lcm", "greatest common factor", "least common multiple"], "Finding greatest common factors and least common multiples, and using the GCF to factor sums like 36 + 8."),
  T("absolute_value", "Absolute Value & Opposites", ["absolute value", "opposite number"], "Absolute value as distance from zero, opposites, and comparing distances on the number line."),
  T("coordinate_four_quadrants", "Coordinate Plane (Four Quadrants)", ["four quadrants", "quadrant", "reflect a point"], "Naming quadrants, reflecting points across the axes and finding distances between points with a shared coordinate."),
  T("compare_rationals", "Comparing & Ordering Rational Numbers", ["order rational numbers", "compare negative numbers", "order integers"], "Comparing and ordering positive and negative integers, fractions and decimals."),
  T("exponents_whole", "Whole-Number Exponents", ["exponent", "powers", "squared", "cubed"], "Reading, writing and evaluating powers with whole-number exponents."),
  T("write_expressions_alg", "Writing Algebraic Expressions", ["write algebraic expression", "translate words to algebra"], "Translating phrases such as '5 less than n' into algebraic expressions."),
  T("inequalities_intro", "Introduction to Inequalities", ["inequality", "inequalities", "is it a solution"], "Checking whether a value satisfies an inequality, writing inequalities from words and solving one-step inequalities."),
  T("polygon_area", "Area of Trapezoids & Composite Shapes", ["trapezoid area", "composite shape", "compound shape area"], "Finding the area of trapezoids and of shapes made from rectangles and triangles."),
  T("mad_iqr", "Interquartile Range & Mean Absolute Deviation", ["interquartile range", "iqr", "mean absolute deviation", "quartiles"], "Measuring how spread out data is with quartiles, the interquartile range and mean absolute deviation."),
  // ---- grade 7
  T("constant_proportionality", "Constant of Proportionality", ["constant of proportionality", "proportional relationship", "y = kx"], "Finding k in y = kx from tables and pairs of values, and deciding whether a relationship is proportional."),
  T("percent_change", "Percent Increase & Decrease", ["percent increase", "percent decrease", "percent change"], "Finding percent increases and decreases, and the new amount after a percent change."),
  T("simple_interest", "Tax, Tips, Markups & Simple Interest", ["sales tax", "tip", "markup", "simple interest"], "Everyday percent problems: sales tax, tips, markups, discounts and simple interest."),
  T("scale_drawings", "Scale Drawings & Maps", ["scale drawing", "map scale", "scale factor"], "Using a scale to move between drawing or map lengths and real-life lengths."),
  T("rational_ops", "Operations with Rational Numbers", ["rational numbers", "negative fractions", "negative decimals"], "Adding, subtracting, multiplying and dividing positive and negative fractions and decimals."),
  T("fraction_to_decimal", "Fractions to Decimals (Terminating & Repeating)", ["repeating decimal", "terminating decimal", "fraction to decimal"], "Converting fractions to decimals with long division and spotting terminating and repeating decimals."),
  T("two_step_equations", "Two-Step Equations", ["two-step equation", "two step equations"], "Solving equations like 3x − 7 = 11 and turning word problems into two-step equations."),
  T("inequalities_solve", "Solving Two-Step Inequalities", ["solve inequality", "two-step inequality"], "Solving inequalities in two steps, including flipping the sign when multiplying or dividing by a negative."),
  T("factor_linear", "Expanding & Factoring Linear Expressions", ["factor linear expression", "expand brackets", "simplify linear expression"], "Using the distributive property to expand, factor and simplify linear expressions."),
  T("angle_relationships", "Complementary, Supplementary & Vertical Angles", ["complementary", "supplementary", "vertical angles", "adjacent angles"], "Using angle facts to find unknown angles and to set up and solve simple equations."),
  T("probability_compound", "Compound Probability", ["compound probability", "independent events", "two dice"], "Probabilities of two events together — coins, dice, spinners and drawing with or without replacement."),
  // ---- grade 8
  T("scientific_notation", "Scientific Notation", ["scientific notation", "standard form large numbers"], "Writing very large and very small numbers in scientific notation and multiplying and dividing them."),
  T("square_cube_roots", "Square & Cube Roots", ["square root", "cube root", "perfect square"], "Square and cube roots of perfect squares and cubes, solving x² = p and x³ = p, and estimating roots."),
  T("irrational_numbers", "Rational & Irrational Numbers", ["irrational number", "rational number", "classify numbers"], "Telling rational and irrational numbers apart and estimating irrational numbers like √30."),
  T("multi_step_equations", "Equations with Variables on Both Sides", ["variables on both sides", "multi-step equation", "no solution", "infinitely many solutions"], "Solving multi-step linear equations, including ones with no solution or infinitely many solutions."),
  T("slope", "Slope", ["slope", "rate of change", "rise over run"], "Finding the slope of a line from two points, and recognizing zero and undefined slopes."),
  T("slope_intercept", "Slope-Intercept Form (y = mx + b)", ["slope intercept", "y = mx + b", "y-intercept"], "Reading slope and y-intercept from y = mx + b and writing equations of lines."),
  T("functions_intro", "Introduction to Functions", ["function", "function notation", "f(x)", "is it a function"], "Deciding whether a relation is a function and evaluating functions written in f(x) notation."),
  T("transformations", "Transformations on the Coordinate Plane", ["translation", "reflection", "rotation", "dilation"], "Translating, reflecting, rotating and dilating points on the coordinate plane."),
  T("triangle_angles", "Triangle Angle Sum & Exterior Angles", ["triangle angle sum", "exterior angle", "angles in a triangle"], "Using the 180° angle sum and the exterior angle theorem to find missing angles."),
  T("volume_cones_spheres", "Volume of Cylinders, Cones & Spheres", ["volume of cone", "volume of sphere", "volume of cylinder"], "Volume of cylinders, cones and spheres, giving answers in terms of π."),
  T("two_way_tables", "Two-Way Tables", ["two-way table", "relative frequency", "frequency table"], "Reading two-way tables and finding totals and relative frequencies."),
  // ---- challenge
  T("challenge_number_theory", "Challenge: Number Theory Puzzles", ["number theory", "divisibility puzzle", "units digit"], "Puzzles about divisibility, remainders, factors and units digits that reward spotting patterns."),
  T("challenge_counting", "Challenge: Counting & Arrangements", ["counting problem", "arrangements", "how many ways"], "Counting outfits, handshakes, arrangements and grid paths — an introduction to combinatorics."),
];

// ===================================================================== grade 6
const genGcfLcm: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const g = randInt(2, diff === "easy" ? 6 : 12), a = g * randInt(1, 9), b = g * randInt(2, 9);
  const kind = pick(by(diff, { easy: ["gcf", "lcm"], medium: ["gcf", "lcm", "dist"], hard: ["dist", "word", "lcm3"] }));
  if (kind === "gcf") return { q: `What is the greatest common factor of ${a} and ${b}?`, a: `${gcd(a, b)}` };
  if (kind === "lcm") { const x = randInt(2, 12), y = randInt(2, 12); return { q: `What is the least common multiple of ${x} and ${y}?`, a: `${lcm(x, y)}` }; }
  if (kind === "dist") {
    // two different multiples whose cofactors share nothing, so the GCF is exactly g
    const m1 = randInt(2, 8); let m2 = randInt(2, 9); while (m2 === m1 || gcd(m1, m2) !== 1) m2 = m2 >= 9 ? 2 : m2 + 1;
    return { q: `Use the GCF to rewrite ${g * m1} + ${g * m2} as a product.`, a: `${g}(${m1} + ${m2})` };
  }
  if (kind === "lcm3") { const x = randInt(2, 6), y = randInt(3, 8), z = randInt(4, 10); return { q: `What is the least common multiple of ${x}, ${y} and ${z}?`, a: `${lcm(lcm(x, y), z)}` }; }
  const G = gcd(a, b);
  return { q: `${a} pencils and ${b} erasers are packed into identical kits with nothing left over. What is the greatest number of kits that can be made?`, a: `${G}` };
};
const genAbsoluteValue: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(-50, 50) || -7, m = randInt(-50, 50) || 3;
  const kind = pick(by(diff, { easy: ["abs", "opp"], medium: ["abs", "opp", "farther", "sum"], hard: ["farther", "sum", "expr", "solve"] }));
  if (kind === "abs") return { q: `|${n}| = ?`, a: `${Math.abs(n)}` };
  if (kind === "opp") return { q: `What is the opposite of ${n}?`, a: `${-n}` };
  if (kind === "farther") { const b = Math.abs(m) === Math.abs(n) ? m + 1 : m; return { q: `Which is farther from 0: ${n} or ${b}?`, a: Math.abs(n) > Math.abs(b) ? `${n}` : `${b}` }; }
  if (kind === "sum") return { q: `|${n}| + |${m}| = ?`, a: `${Math.abs(n) + Math.abs(m)}` };
  if (kind === "expr") return { q: `|${n}| - |${m}| = ?`, a: `${Math.abs(n) - Math.abs(m)}` };
  const k = Math.abs(n) || 5;
  return { q: `Which two numbers have an absolute value of ${k}?`, a: `${k} and -${k}` };
};
const quadrant = (x: number, y: number) => (x === 0 && y === 0 ? "the origin" : x === 0 ? "on the y-axis" : y === 0 ? "on the x-axis" : x > 0 ? (y > 0 ? "Quadrant I" : "Quadrant IV") : y > 0 ? "Quadrant II" : "Quadrant III");
const genCoordFour: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = randInt(-9, 9) || 4, y = randInt(-9, 9) || -3;
  const kind = pick(by(diff, { easy: ["quad"], medium: ["quad", "reflect", "dist"], hard: ["reflect", "dist", "both", "perim"] }));
  if (kind === "quad") return { q: `In which quadrant is the point (${x}, ${y})?`, a: quadrant(x, y) };
  if (kind === "reflect") { const ax = pick(["x", "y"]); return { q: `Reflect (${x}, ${y}) across the ${ax}-axis. What are the new coordinates?`, a: ax === "x" ? `(${x}, ${-y})` : `(${-x}, ${y})` }; }
  if (kind === "both") return { q: `Reflect (${x}, ${y}) across the x-axis and then across the y-axis. Where does it end up?`, a: `(${-x}, ${-y})` };
  if (kind === "dist") { const x2 = randInt(-9, 9); return { q: `How far apart are (${x}, ${y}) and (${x2 === x ? x + 5 : x2}, ${y})?`, a: `${Math.abs((x2 === x ? x + 5 : x2) - x)} units` }; }
  const w = randInt(2, 8), h = randInt(2, 8);
  return { q: `A rectangle has corners (${x}, ${y}), (${x + w}, ${y}), (${x + w}, ${y - h}) and (${x}, ${y - h}). What is its perimeter?`, a: `${2 * (w + h)} units` };
};
type RVal = { s: string; v: number };
const genCompareRationals: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const mk = (): RVal => {
    const t = pick(diff === "easy" ? ["int"] : ["int", "dec", "frac"]);
    if (t === "int") { const v = randInt(-20, 20); return { s: `${v}`, v }; }
    if (t === "dec") { const v = randInt(-99, 99) / 10; return { s: num(v), v }; }
    const d = pick([2, 3, 4, 5, 8]), n = randInt(-2 * d, 2 * d) || 1; const f = frac(n, d); return { s: fStr(f), v: fVal(f) };
  };
  if (rng() < 0.5) {
    const a = mk(); let b = mk(); if (b.v === a.v) b = { s: `${Math.round(a.v) + 1}`, v: Math.round(a.v) + 1 };
    return { q: `Compare: ${a.s} ___ ${b.s}  (use <, >, or =)`, a: a.v > b.v ? ">" : a.v < b.v ? "<" : "=" };
  }
  const vals: RVal[] = [];
  while (vals.length < 4) { const c = mk(); if (!vals.some((x) => Math.abs(x.v - c.v) < 1e-9)) vals.push(c); }
  return { q: `Order from least to greatest: ${vals.map((x) => x.s).join(", ")}`, a: [...vals].sort((p, q) => p.v - q.v).map((x) => x.s).join(", ") };
};
const genExponentsWhole: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const b = randInt(2, diff === "easy" ? 5 : 10), e = randInt(2, b <= 3 ? 5 : b <= 5 ? 4 : 3);
  const kind = pick(by(diff, { easy: ["eval", "write"], medium: ["eval", "write", "sum"], hard: ["sum", "frac", "order", "dec"] }));
  if (kind === "eval") return { q: `Evaluate: ${b}^${e}`, a: `${Math.pow(b, e)}` };
  if (kind === "write") return { q: `Write ${Array(e).fill(b).join(" × ")} as a power.`, a: `${b}^${e}` };
  if (kind === "sum") { const c = randInt(2, 6); return { q: `Evaluate: ${b}^2 + ${c}^3`, a: `${b * b + c * c * c}` }; }
  if (kind === "frac") { const d = randInt(2, 5), k = randInt(2, 3); return { q: `Evaluate: (1/${d})^${k}`, a: `1/${Math.pow(d, k)}` }; }
  if (kind === "dec") { const d = randInt(1, 9) / 10; return { q: `Evaluate: ${num(d)}^2`, a: num(d * d) }; }
  const c = randInt(2, 6);
  return { q: `Evaluate: ${c} × ${b}^2 - ${c}`, a: `${c * b * b - c}` };
};
const genWriteExpressionsAlg: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, 12), b = randInt(2, 15), v = pick(["n", "x", "y", "m"]);
  const items: [string, string][] = [
    [`${a} less than ${v}`, `${v} - ${a}`],
    [`${a} more than ${v}`, `${v} + ${a}`],
    [`the product of ${a} and ${v}`, `${a}${v}`],
    [`the quotient of ${v} and ${a}`, `${v}/${a}`],
    [`${v} decreased by ${a}`, `${v} - ${a}`],
    [`${a} times a number ${v}, increased by ${b}`, `${a}${v} + ${b}`],
    [`twice ${v}, minus ${b}`, `2${v} - ${b}`],
    [`${a} subtracted from ${b} times ${v}`, `${b}${v} - ${a}`],
    [`the sum of ${v} and ${a}, multiplied by ${b}`, `${b}(${v} + ${a})`],
    [`the cost of ${v} tickets at $${a} each`, `${a}${v}`],
  ];
  const [phrase, ans] = pick(diff === "easy" ? items.slice(0, 5) : diff === "medium" ? items.slice(0, 8) : items.slice(5));
  return { q: `Write an algebraic expression for: ${phrase}`, a: ans };
};
const INEQ_WORDS: [string, string][] = [["at least", "≥"], ["at most", "≤"], ["more than", ">"], ["less than", "<"], ["no more than", "≤"], ["no less than", "≥"]];
const genInequalitiesIntro: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["check"], medium: ["check", "words", "solve"], hard: ["solve", "solveMul", "words"] }));
  if (kind === "check") {
    const a = randInt(1, 12), c = randInt(a + 1, 25), x = randInt(1, 20), sym = pick([">", "<", "≥", "≤"]);
    const L = x + a, ok = sym === ">" ? L > c : sym === "<" ? L < c : sym === "≥" ? L >= c : L <= c;
    return { q: `Is x = ${x} a solution of x + ${a} ${sym} ${c}? Answer yes or no.`, a: ok ? "yes" : "no" };
  }
  if (kind === "words") { const [w, s] = pick(INEQ_WORDS), n = randInt(5, 60); return { q: `Write an inequality: a number x is ${w} ${n}.`, a: `x ${s} ${n}` }; }
  const sym = pick([">", "<", "≥", "≤"]);
  if (kind === "solveMul") { const k = randInt(2, 9), x = randInt(2, 12); return { q: `Solve: ${k}x ${sym} ${k * x}`, a: `x ${sym} ${x}` }; }
  const a = randInt(2, 20), x = randInt(1, 25);
  return { q: `Solve: x + ${a} ${sym} ${x + a}`, a: `x ${sym} ${x}` };
};
const genPolygonArea: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const unit = pick(["cm", "m", "in"]);
  const kind = pick(by(diff, { easy: ["trap"], medium: ["trap", "houseShape"], hard: ["houseShape", "trapMissing", "frame"] }));
  if (kind === "trap") { const b1 = randInt(3, 14), b2 = randInt(b1 + 1, 20), h = randInt(2, 12); return { q: `Find the area of a trapezoid with bases ${b1} ${unit} and ${b2} ${unit} and height ${h} ${unit}.`, a: `${num(((b1 + b2) * h) / 2)} ${unit}²` }; }
  if (kind === "trapMissing") { const b1 = randInt(3, 14), b2 = randInt(b1 + 1, 20), h = randInt(1, 6) * 2; return { q: `A trapezoid has area ${((b1 + b2) * h) / 2} ${unit}² and bases ${b1} ${unit} and ${b2} ${unit}. What is its height?`, a: `${h} ${unit}` }; }
  if (kind === "houseShape") { const w = randInt(2, 8) * 2, h = randInt(3, 10), th = randInt(2, 8); return { q: `A shape is a ${w} × ${h} ${unit} rectangle with a triangle on top. The triangle has base ${w} ${unit} and height ${th} ${unit}. What is the total area?`, a: `${w * h + (w * th) / 2} ${unit}²` }; }
  const W = randInt(8, 16), H = randInt(8, 16), t = randInt(1, 3);
  return { q: `A picture frame is a ${W} × ${H} ${unit} rectangle with a ${W - 2 * t} × ${H - 2 * t} ${unit} rectangle cut out of the middle. What is the area of the frame?`, a: `${W * H - (W - 2 * t) * (H - 2 * t)} ${unit}²` };
};
function median(sorted: number[]): number { const m = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2; }
function quartiles(data: number[]) {
  const s = [...data].sort((a, b) => a - b), h = Math.floor(s.length / 2);
  const lower = s.slice(0, h), upper = s.slice(s.length % 2 ? h + 1 : h);
  return { q1: median(lower), q3: median(upper), med: median(s), s };
}
const genMadIqr: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const size = by(diff, { easy: 7, medium: 8, hard: 9 });
  const data = Array.from({ length: size }, () => randInt(1, 40));
  const kind = pick(by(diff, { easy: ["q1", "q3", "med"], medium: ["iqr", "q1", "q3"], hard: ["iqr", "mad", "mad"] }));
  const { q1, q3, med } = quartiles(data);
  if (kind === "med") return { q: `Find the median of: ${data.join(", ")}`, a: num(med) };
  if (kind === "q1") return { q: `Find the lower quartile (Q1) of: ${data.join(", ")}`, a: num(q1) };
  if (kind === "q3") return { q: `Find the upper quartile (Q3) of: ${data.join(", ")}`, a: num(q3) };
  if (kind === "iqr") return { q: `Find the interquartile range of: ${data.join(", ")}`, a: num(q3 - q1) };
  // MAD with a whole-number mean so the steps stay friendly
  const vals = Array.from({ length: 6 }, () => randInt(2, 30));
  const rem = vals.reduce((s, v) => s + v, 0) % 6; vals[0] += rem === 0 ? 0 : 6 - rem;
  const mean = vals.reduce((s, v) => s + v, 0) / 6;
  const mad = vals.reduce((s, v) => s + Math.abs(v - mean), 0) / 6;
  return { q: `Find the mean absolute deviation of: ${vals.join(", ")} (the mean is ${mean})`, a: num(round(mad, 2)) };
};

// ===================================================================== grade 7
const genConstantProp: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const k = diff === "hard" && rng() < 0.5 ? randInt(3, 9) / 2 : randInt(2, 12);
  const kind = pick(by(diff, { easy: ["pair", "useK"], medium: ["pair", "table", "useK"], hard: ["table", "isProp", "useK", "pair"] }));
  const xs = [randInt(1, 3), randInt(4, 6), randInt(7, 10)].map((x) => (k % 1 ? x * 2 : x));
  if (kind === "pair") return { q: `y is proportional to x. When x = ${xs[1]}, y = ${num(k * xs[1])}. What is the constant of proportionality?`, a: num(k) };
  if (kind === "table") return { q: `In a proportional table, x = ${xs.join(", ")} and y = ${xs.map((x) => num(k * x)).join(", ")}. What is k in y = kx?`, a: num(k) };
  if (kind === "useK") { const x = randInt(2, 20); return { q: `y = ${num(k)}x. Find y when x = ${x}.`, a: num(k * x) }; }
  const prop = rng() < 0.5;
  const ys = xs.map((x, i) => k * x + (prop || i < 2 ? 0 : randInt(1, 3)));
  return { q: `Is this relationship proportional? x = ${xs.join(", ")}; y = ${ys.map((y) => num(y)).join(", ")}. Answer yes or no.`, a: prop ? "yes" : "no" };
};
const genPercentChange: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const pct = pick(by(diff, { easy: [10, 20, 25, 50], medium: [5, 10, 15, 20, 25, 30, 40, 50, 75], hard: [12, 15, 35, 40, 60, 80, 120, 150] }));
  const base = pick([20, 40, 50, 60, 80, 100, 120, 160, 200, 250, 400]);
  const up = rng() < 0.5 || pct > 100;
  const after = (base * (100 + (up ? pct : -pct))) / 100;
  const kind = pick(["find", "apply"]);
  if (kind === "find") return { q: `A price changes from $${base} to $${num(after)}. What is the percent ${up ? "increase" : "decrease"}?`, a: `${pct}%` };
  return { q: `$${base} is ${up ? "increased" : "decreased"} by ${pct}%. What is the new amount?`, a: `$${num(after)}` };
};
const genSimpleInterest: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["tax", "tip"], medium: ["tax", "tip", "markup", "interest"], hard: ["interest", "total", "discountTax", "interestRate"] }));
  const price = randInt(8, 120) + pick([0, 0.5, 0.25]);
  const rate = pick([5, 6, 8, 10, 15, 18, 20]);
  if (kind === "tax") return { q: `A jacket costs ${money(price)}. Sales tax is ${rate}%. How much is the tax?`, a: money(round((price * rate) / 100, 2)) };
  if (kind === "tip") return { q: `A meal costs ${money(price)}. You leave a${rate === 8 || rate === 18 ? "n" : ""} ${rate}% tip. How much is the tip?`, a: money(round((price * rate) / 100, 2)) };
  if (kind === "markup") { const cost = randInt(10, 80); const m = pick([20, 25, 40, 50, 75, 100]); return { q: `A store buys a lamp for $${cost} and marks it up ${m}%. What is the selling price?`, a: money((cost * (100 + m)) / 100) }; }
  const P = pick([500, 800, 1000, 1200, 1500, 2000, 2500]), r = pick([2, 3, 4, 5, 6]), t = randInt(2, 6);
  if (kind === "interest") return { q: `$${comma(P)} is invested at ${r}% simple interest per year for ${t} years. How much interest is earned?`, a: money((P * r * t) / 100) };
  if (kind === "total") return { q: `$${comma(P)} is borrowed at ${r}% simple interest per year for ${t} years. What is the total amount owed at the end?`, a: money(P + (P * r * t) / 100) };
  if (kind === "interestRate") return { q: `$${comma(P)} earns $${(P * r * t) / 100} simple interest in ${t} years. What is the yearly interest rate?`, a: `${r}%` };
  const p2 = randInt(4, 20) * 10, d = pick([10, 20, 25]), tx = pick([5, 8, 10]);
  return { q: `A $${p2} game is ${d}% off, then ${tx}% tax is added to the sale price. What is the final price?`, a: money(round(p2 * (1 - d / 100) * (1 + tx / 100), 2)) };
};
const genScaleDrawings: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const s = pick([2, 5, 10, 20, 25, 50]), d = randInt(2, 15);
  const kind = pick(by(diff, { easy: ["toReal"], medium: ["toReal", "toDraw", "map"], hard: ["map", "area", "toDraw", "findScale"] }));
  const place = s <= 5 ? "room" : s <= 20 ? "park" : "lake";
  if (kind === "toReal") return { q: `On a scale drawing, 1 cm represents ${s} m. A ${place} is ${d} cm long on the drawing. How long is the real ${place}?`, a: `${d * s} m` };
  if (kind === "toDraw") return { q: `On a scale drawing, 1 cm represents ${s} m. A real ${place} is ${d * s} m long. How long is it on the drawing?`, a: `${d} cm` };
  if (kind === "map") { const half = randInt(3, 19) / 2; return { q: `A map scale is 1 inch : ${s} miles. Two towns are ${num(half)} inches apart on the map. How far apart are they really?`, a: `${num(half * s)} miles` }; }
  if (kind === "findScale") return { q: `A ${d * s} m bridge is drawn ${d} cm long. Complete the scale: 1 cm = __ m`, a: `${s} m` };
  const k = randInt(2, 5);
  return { q: `A drawing is enlarged so every length is ${k} times as long. How many times as large is the new area?`, a: `${k * k}` };
};
const sFrac = (f: Frac) => (f.n < 0 ? `(${fStr(f)})` : fStr(f));
const genRationalOps: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const op = pick(by(diff, { easy: ["+", "-"], medium: ["+", "-", "×"], hard: ["+", "-", "×", "÷"] }));
  if (rng() < 0.4) {
    const a = randInt(-99, 99) / 10 || 1.5, b = randInt(-99, 99) / 10 || -2.5;
    const r = op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : null;
    if (r !== null) return { q: `${num(a)} ${op} ${b < 0 ? `(${num(b)})` : num(b)} = ?`, a: num(round(r, 3)) };
  }
  const d1 = pick([2, 3, 4, 5, 6, 8]), d2 = pick([2, 3, 4, 5, 6, 8]);
  const a = frac(randInt(-2 * d1, 2 * d1) || -1, d1), b = frac(randInt(-2 * d2, 2 * d2) || 1, d2);
  const r = op === "+" ? fAdd(a, b) : op === "-" ? fSub(a, b) : op === "×" ? fMul(a, b) : fDiv(a, b);
  return { q: `${fStr(a)} ${op} ${sFrac(b)} = ?`, a: fMixed(r) };
};
function decimalExpansion(n: number, d: number): { text: string; repeating: boolean } {
  const whole = Math.floor(n / d); let rem = n % d;
  const digits: number[] = []; const seen = new Map<number, number>();
  while (rem !== 0 && !seen.has(rem) && digits.length < 20) { seen.set(rem, digits.length); rem *= 10; digits.push(Math.floor(rem / d)); rem %= d; }
  if (rem === 0) return { text: `${whole}.${digits.join("") || "0"}`.replace(/\.0$/, ""), repeating: false };
  const start = seen.get(rem)!;
  const fixed = digits.slice(0, start).join(""), rep = digits.slice(start).join("");
  return { text: `${whole}.${fixed}${rep}${rep.length < 3 ? rep : ""}... (${rep} repeats)`, repeating: true };
}
const genFractionToDecimal: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = pick(by(diff, { easy: [2, 4, 5, 8, 10, 20, 25], medium: [3, 4, 6, 8, 9, 11, 12, 16], hard: [6, 7, 9, 11, 12, 15, 18] }));
  let n = randInt(1, d - 1);
  while (gcd(n, d) !== 1) n = randInt(1, d - 1);
  const e = decimalExpansion(n, d);
  if (diff !== "easy" && rng() < 0.3) return { q: `Does ${n}/${d} make a terminating or repeating decimal?`, a: e.repeating ? "repeating" : "terminating" };
  return { q: `Write ${n}/${d} as a decimal.`, a: e.text };
};
const genTwoStepEq: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = diff === "easy" ? randInt(1, 12) : randInt(-12, 12) || 3;
  const a = diff === "hard" ? (randInt(2, 9) * (rng() < 0.4 ? -1 : 1)) : randInt(2, 9), b = randInt(-20, 20) || 5;
  const kind = pick(by(diff, { easy: ["ax+b"], medium: ["ax+b", "x/a+b", "word"], hard: ["ax+b", "x/a+b", "paren", "word"] }));
  if (kind === "ax+b") return { q: `Solve: ${linExpr(a, b)} = ${a * x + b}`, a: `x = ${x}` };
  if (kind === "x/a+b") { const k = randInt(2, 6), xx = k * randInt(-6, 9) || k; return { q: `Solve: x/${k}${sgn(b)} = ${xx / k + b}`, a: `x = ${xx}` }; }
  if (kind === "paren") return { q: `Solve: ${a}(x${sgn(b)}) = ${a * (x + b)}`, a: `x = ${x}` };
  const fee = randInt(3, 15), per = randInt(2, 8), n = randInt(2, 12);
  return { q: `A gym charges a $${fee} joining fee plus $${per} per class. ${pick(NAMES)} paid $${fee + per * n}. How many classes did they take?`, a: `${n}` };
};
const FLIP: Record<string, string> = { ">": "<", "<": ">", "≥": "≤", "≤": "≥" };
const genInequalitiesSolve: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = randInt(-10, 12), sym = pick([">", "<", "≥", "≤"]);
  const neg = diff === "hard" || (diff === "medium" && rng() < 0.3);
  const a = randInt(2, 9) * (neg ? -1 : 1), b = randInt(-15, 15) || 4;
  if (diff !== "easy" && grade >= 9 && rng() < 0.3) {
    const lo = randInt(-8, 2), hi = lo + randInt(3, 10), c = randInt(-5, 5) || 3;
    return { q: `Solve: ${lo + c} < x${sgn(c)} < ${hi + c}`, a: `${lo} < x < ${hi}` };
  }
  return { q: `Solve: ${linExpr(a, b)} ${sym} ${a * x + b}`, a: `x ${a < 0 ? FLIP[sym] : sym} ${x}` };
};
const genFactorLinear: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const k = randInt(2, 9), a = randInt(1, 6), b = randInt(-9, 9) || 2;
  const kind = pick(by(diff, { easy: ["expand"], medium: ["expand", "factor"], hard: ["factor", "simplify", "simplify2"] }));
  if (kind === "expand") return { q: `Expand: ${k}(${linExpr(a, b)})`, a: linExpr(k * a, k * b) };
  if (kind === "factor") { let aa = a, bb = b; while (gcd(aa, bb) !== 1) bb += 1; return { q: `Factor completely: ${linExpr(k * aa, k * bb)}`, a: `${k}(${linExpr(aa, bb)})` }; }
  const c = randInt(1, 5), d = randInt(-9, 9);
  if (kind === "simplify") return { q: `Simplify: ${k}(${linExpr(a, b)})${d ? sgn(d) : ""} + ${c === 1 ? "" : c}x`, a: linExpr(k * a + c, k * b + d) };
  return { q: `Simplify: ${k}(${linExpr(a, b)}) - ${c === 1 ? "" : c}(${linExpr(1, d)})`, a: linExpr(k * a - c, k * b - c * d) };
};
const genAngleRelationships: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["comp", "supp", "vert"], medium: ["comp", "supp", "vert", "solveSupp"], hard: ["solveSupp", "solveComp", "solveVert"] }));
  if (kind === "comp") { const a = randInt(5, 85); return { q: `What is the complement of a ${a}° angle?`, a: `${90 - a}°` }; }
  if (kind === "supp") { const a = randInt(5, 175); return { q: `What is the supplement of a ${a}° angle?`, a: `${180 - a}°` }; }
  if (kind === "vert") { const a = randInt(20, 160); return { q: `Two lines cross. One angle is ${a}°. What is the angle vertically opposite it?`, a: `${a}°` }; }
  const x = randInt(5, 30), m = randInt(2, 4);
  if (kind === "solveSupp") { const c = randInt(0, 20), other = 180 - (m * x + c); if (other > 0) return { q: `Two angles are supplementary. One is (${linExpr(m, c)})° and the other is ${other}°. Find x.`, a: `x = ${x}` }; }
  if (kind === "solveComp") { const xx = randInt(4, 12), c = randInt(0, 10), other = 90 - (m * xx + c); if (other > 0) return { q: `Two angles are complementary. One is (${linExpr(m, c)})° and the other is ${other}°. Find x.`, a: `x = ${xx}` }; }
  const c1 = randInt(1, 20), c2 = c1 + (m - 1) * x;
  return { q: `Vertical angles measure (${linExpr(m, c1)})° and (${linExpr(1, c2)})°. Find x.`, a: `x = ${x}` };
};
const genProbCompound: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["coins", "coinDie"], medium: ["coinDie", "diceSum", "withRep"], hard: ["diceSum", "withRep", "noRep", "atLeast"] }));
  if (kind === "coins") { const n = randInt(2, 3); return { q: `You flip ${n} coins. What is the probability that all of them land heads?`, a: `1/${Math.pow(2, n)}` }; }
  if (kind === "coinDie") { const ev = pick([["an even number", 3], ["a 6", 1], ["a number greater than 4", 2], ["a number less than 3", 2]] as const); return { q: `You flip a coin and roll a number cube. What is P(heads and ${ev[0]})?`, a: fStr(frac(ev[1], 12)) }; }
  if (kind === "diceSum") { const s = randInt(2, 12); let c = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (i + j === s) c++; return { q: `You roll two number cubes. What is the probability that the sum is ${s}?`, a: fStr(frac(c, 36)) }; }
  const r = randInt(2, 6), b = randInt(2, 6), t = r + b;
  if (kind === "withRep") return { q: `A bag has ${r} red and ${b} blue marbles. You draw one, put it back, then draw again. What is P(red, then red)?`, a: fStr(frac(r * r, t * t)) };
  if (kind === "noRep") return { q: `A bag has ${r} red and ${b} blue marbles. You draw two without putting the first back. What is P(both red)?`, a: fStr(frac(r * (r - 1), t * (t - 1))) };
  const n = randInt(2, 3);
  return { q: `You flip ${n} coins. What is the probability of getting at least one tail?`, a: fStr(frac(Math.pow(2, n) - 1, Math.pow(2, n))) };
};

// ===================================================================== grade 8
const sup = (e: number) => `10^${e}`;
const genScientificNotation: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["toSci", "fromSci"], medium: ["toSci", "fromSci", "small", "toSmall"], hard: ["mul", "div", "small", "compare"] }));
  const m = randInt(11, 99) / 10, e = randInt(3, 9);
  if (kind === "toSci") return { q: `Write ${Math.round(m * Math.pow(10, e)).toLocaleString("en-US")} in scientific notation.`, a: `${num(m)} × ${sup(e)}` };
  if (kind === "fromSci") return { q: `Write ${num(m)} × ${sup(e)} in standard form.`, a: Math.round(m * Math.pow(10, e)).toLocaleString("en-US") };
  const ne = randInt(2, 6);
  if (kind === "small") return { q: `Write ${(m / Math.pow(10, ne)).toFixed(ne + 1).replace(/0+$/, "")} in scientific notation.`, a: `${num(m)} × 10^-${ne}` };
  if (kind === "toSmall") return { q: `Write ${num(m)} × 10^-${ne} in standard form.`, a: (m / Math.pow(10, ne)).toFixed(ne + 1).replace(/0+$/, "") };
  const a = randInt(1, 9), b = randInt(1, 9), e1 = randInt(2, 8), e2 = randInt(2, 8);
  if (kind === "mul") { let p = a * b, ee = e1 + e2; let ps = `${p}`; if (p >= 10) { ps = num(p / 10); ee += 1; } return { q: `Multiply: (${a} × ${sup(e1)}) × (${b} × ${sup(e2)}). Write the answer in scientific notation.`, a: `${ps} × ${sup(ee)}` }; }
  if (kind === "div") { const p = a * b; return { q: `Divide: (${p} × ${sup(e1 + e2)}) ÷ (${a} × ${sup(e2)}). Write the answer in scientific notation.`, a: `${b} × ${sup(e1)}` }; }
  const e3 = e + pick([-1, 1]);
  return { q: `Which is larger: ${num(m)} × ${sup(e)} or ${num(m)} × ${sup(e3)}?`, a: `${num(m)} × ${sup(Math.max(e, e3))}` };
};
const genSquareCubeRoots: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["sq", "cube"], medium: ["sq", "cube", "solveSq", "between"], hard: ["solveSq", "solveCube", "between", "frac"] }));
  const n = randInt(1, 15), c = randInt(1, 6);
  if (kind === "sq") return { q: `√${n * n} = ?`, a: `${n}` };
  if (kind === "cube") return { q: `∛${c * c * c} = ?`, a: `${c}` };
  if (kind === "solveSq") return { q: `Solve: x² = ${n * n}`, a: `x = ${n} or x = -${n}` };
  if (kind === "solveCube") { const s = rng() < 0.5 ? -1 : 1; return { q: `Solve: x³ = ${s * c * c * c}`, a: `x = ${s * c}` }; }
  if (kind === "frac") { const a = randInt(1, 9), b = randInt(2, 12); return { q: `√(${a * a}/${b * b}) = ?`, a: fStr(frac(a, b)) }; }
  let k = randInt(3, 120); while (Number.isInteger(Math.sqrt(k))) k++;
  const lo = Math.floor(Math.sqrt(k));
  return { q: `√${k} lies between which two consecutive whole numbers?`, a: `${lo} and ${lo + 1}` };
};
const genIrrational: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  if (diff !== "easy" && rng() < 0.4) { let k = randInt(3, 150); while (Number.isInteger(Math.sqrt(k))) k++; return { q: `Estimate √${k} to the nearest whole number.`, a: `${Math.round(Math.sqrt(k))}` }; }
  const items: [string, string][] = [
    [`√${pick([4, 9, 16, 25, 36, 49, 64, 81, 100])}`, "rational"], [`√${pick([2, 3, 5, 7, 10, 11, 15, 20])}`, "irrational"],
    ["π", "irrational"], [`${randInt(1, 9)}/${randInt(2, 9)}`, "rational"], [`0.${randInt(1, 9)}${randInt(1, 9)}${randInt(1, 9)}`, "rational"],
    ["0.333... (the 3 repeats forever)", "rational"], [`-${randInt(2, 50)}`, "rational"], ["0.1010010001... (the pattern never repeats)", "irrational"],
    [`∛${pick([8, 27, 64, 125])}`, "rational"], [`${randInt(2, 9)}√2`, "irrational"],
  ];
  const [x, a] = pick(items);
  return { q: `Is ${x} rational or irrational?`, a };
};
const genMultiStepEq: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = randInt(-10, 12);
  const kind = pick(by(diff, { easy: ["both"], medium: ["both", "dist"], hard: ["both", "dist", "special", "special"] }));
  if (kind === "both") { const a = randInt(2, 9), c = randInt(1, a - 1) * (rng() < 0.3 ? -1 : 1), b = randInt(-15, 15); const d = (a - c) * x + b; return { q: `Solve: ${linExpr(a, b)} = ${linExpr(c, d)}`, a: `x = ${x}` }; }
  if (kind === "dist") { const k = randInt(2, 6), p = randInt(-6, 6) || 2, c = randInt(1, k - 1); const d = k * (x + p) - c * x; return { q: `Solve: ${k}(x${sgn(p)}) = ${linExpr(c, d)}`, a: `x = ${x}` }; }
  const k = randInt(2, 5), p = randInt(1, 6), inf = rng() < 0.5;
  return { q: `Solve: ${k}(x + ${p}) = ${linExpr(k, k * p + (inf ? 0 : randInt(1, 5)))}`, a: inf ? "infinitely many solutions" : "no solution" };
};
const genSlope: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x1 = randInt(-8, 8), y1 = randInt(-8, 8);
  const special = diff !== "easy" && rng() < 0.2;
  if (special) { const v = rng() < 0.5; const o = randInt(1, 7); return { q: `Find the slope of the line through (${x1}, ${y1}) and (${v ? x1 : x1 + o}, ${v ? y1 + o : y1}).`, a: v ? "undefined" : "0" }; }
  const run = randInt(1, 6) * (rng() < 0.3 ? -1 : 1), rise = diff === "easy" ? run * (randInt(-4, 4) || 2) : randInt(-9, 9) || 3;
  return { q: `Find the slope of the line through (${x1}, ${y1}) and (${x1 + run}, ${y1 + rise}).`, a: fStr(frac(rise, run)) };
};
const genSlopeIntercept: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const m = randInt(-6, 6) || 2, b = randInt(-10, 10);
  const eq = lineStr(frac(m), frac(b));
  const kind = pick(by(diff, { easy: ["m", "b", "y"], medium: ["m", "b", "write", "y"], hard: ["write", "fromPoints", "fromPoint", "y"] }));
  if (kind === "m") return { q: `What is the slope of ${eq}?`, a: `${m}` };
  if (kind === "b") return { q: `What is the y-intercept of ${eq}?`, a: `${b}` };
  if (kind === "y") { const x = randInt(-5, 5); return { q: `For ${eq}, find y when x = ${x}.`, a: `${m * x + b}` }; }
  if (kind === "write") return { q: `Write the equation of the line with slope ${m} and y-intercept ${b}.`, a: eq };
  const x1 = randInt(-5, 5);
  if (kind === "fromPoint") return { q: `A line has slope ${m} and passes through (${x1}, ${m * x1 + b}). Write its equation in slope-intercept form.`, a: eq };
  const x2 = x1 + randInt(1, 4);
  return { q: `Write the equation of the line through (${x1}, ${m * x1 + b}) and (${x2}, ${m * x2 + b}) in slope-intercept form.`, a: eq };
};
const genFunctionsIntro: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["evalLin"], medium: ["evalLin", "isFunc", "evalQuad"], hard: ["evalQuad", "isFunc", "solveF", "domain"] }));
  const a = randInt(-5, 6) || 2, b = randInt(-9, 9), x = randInt(-5, 6);
  if (kind === "evalLin") return { q: `f(x) = ${linExpr(a, b)}. Find f(${x}).`, a: `${a * x + b}` };
  if (kind === "evalQuad") { const c = randInt(-9, 9); return { q: `f(x) = x^2${sgn(c)}. Find f(${x}).`, a: `${x * x + c}` }; }
  if (kind === "solveF") { const y = a * x + b; return { q: `f(x) = ${linExpr(a, b)}. For what value of x is f(x) = ${y}?`, a: `x = ${x}` }; }
  if (kind === "domain") { const xs = [randInt(-5, 0), randInt(1, 3), randInt(4, 8)]; return { q: `What is the domain of the relation {(${xs[0]}, ${b}), (${xs[1]}, ${a}), (${xs[2]}, ${b})}?`, a: `{${xs.join(", ")}}` }; }
  const isF = rng() < 0.5;
  const xs = [randInt(-5, -1), randInt(0, 3), randInt(4, 8)];
  const pairs = xs.map((xx) => [xx, randInt(-9, 9)]);
  if (!isF) pairs.push([xs[1], (pairs[1][1] as number) + randInt(1, 5)]);
  return { q: `Is {${pairs.map(([p, q]) => `(${p}, ${q})`).join(", ")}} a function? Answer yes or no.`, a: isF ? "yes" : "no" };
};
const genTransformations: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = randInt(-8, 8) || 3, y = randInt(-8, 8) || -2;
  const kind = pick(by(diff, { easy: ["translate", "reflect"], medium: ["translate", "reflect", "rot180", "dilate"], hard: ["rot90cw", "rot90ccw", "rot180", "dilate", "combo"] }));
  if (kind === "translate") { const a = randInt(-6, 6) || 2, b = randInt(-6, 6) || -3; return { q: `Translate (${x}, ${y}) by ${units(Math.abs(a))} ${a > 0 ? "right" : "left"} and ${units(Math.abs(b))} ${b > 0 ? "up" : "down"}. What is the image?`, a: `(${x + a}, ${y + b})` }; }
  if (kind === "reflect") { const ax = pick(["x-axis", "y-axis"]); return { q: `Reflect (${x}, ${y}) across the ${ax}. What is the image?`, a: ax === "x-axis" ? `(${x}, ${-y})` : `(${-x}, ${y})` }; }
  if (kind === "rot180") return { q: `Rotate (${x}, ${y}) 180° about the origin. What is the image?`, a: `(${-x}, ${-y})` };
  if (kind === "rot90cw") return { q: `Rotate (${x}, ${y}) 90° clockwise about the origin. What is the image?`, a: `(${y}, ${-x})` };
  if (kind === "rot90ccw") return { q: `Rotate (${x}, ${y}) 90° counterclockwise about the origin. What is the image?`, a: `(${-y}, ${x})` };
  if (kind === "dilate") { const k = pick([2, 3, 4]); return { q: `Dilate (${x}, ${y}) by a scale factor of ${k} centered at the origin. What is the image?`, a: `(${k * x}, ${k * y})` }; }
  return { q: `Reflect (${x}, ${y}) across the y-axis, then translate it 3 units down. What is the image?`, a: `(${-x}, ${y - 3})` };
};
const genTriangleAngles: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const A = randInt(25, 95), B = randInt(25, 150 - A), C = 180 - A - B;
  const kind = pick(by(diff, { easy: ["missing"], medium: ["missing", "exterior", "isosceles"], hard: ["exterior", "isosceles", "algebra", "extMissing"] }));
  if (kind === "missing") return { q: `Two angles of a triangle are ${A}° and ${B}°. Find the third angle.`, a: `${C}°` };
  if (kind === "exterior") return { q: `A triangle has interior angles ${A}° and ${B}°. What is the exterior angle at the third vertex?`, a: `${A + B}°` };
  if (kind === "extMissing") return { q: `An exterior angle of a triangle is ${A + B}°. One of the two remote interior angles is ${A}°. Find the other.`, a: `${B}°` };
  if (kind === "isosceles") { const v = randInt(10, 80) * 2; return { q: `An isosceles triangle has a vertex angle of ${v}°. What is each base angle?`, a: `${(180 - v) / 2}°` }; }
  const x = randInt(10, 30), c = 180 - 4 * x;
  return { q: `The angles of a triangle are x°, 3x° and ${c}°. Find x.`, a: `x = ${x}` };
};
const genVolumeConesSpheres: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const unit = pick(["cm", "m", "in"]);
  const kind = pick(by(diff, { easy: ["cyl", "cone"], medium: ["cyl", "cone", "sphere"], hard: ["sphere", "cone", "hemi", "cylMissing"] }));
  const pi = (f: Frac) => `${fMixed(f) === "1" ? "" : fStr(f)}π ${unit}³ (≈ ${num(round(fVal(f) * Math.PI, 2))} ${unit}³)`;
  const r = randInt(1, 10), h = randInt(1, 12);
  if (kind === "cyl") return { q: `Find the volume of a cylinder with radius ${r} ${unit} and height ${h} ${unit}. Leave your answer in terms of π.`, a: pi(frac(r * r * h)) };
  if (kind === "cone") { const hh = randInt(1, 4) * 3; return { q: `Find the volume of a cone with radius ${r} ${unit} and height ${hh} ${unit}. Leave your answer in terms of π.`, a: pi(frac(r * r * hh, 3)) }; }
  if (kind === "sphere") { const rr = pick([3, 6, 9, 3, 6]); return { q: `Find the volume of a sphere with radius ${rr} ${unit}. Leave your answer in terms of π.`, a: pi(frac(4 * rr * rr * rr, 3)) }; }
  if (kind === "hemi") { const rr = pick([3, 6]); return { q: `Find the volume of a hemisphere (half a sphere) with radius ${rr} ${unit}. Leave your answer in terms of π.`, a: pi(frac(2 * rr * rr * rr, 3)) }; }
  return { q: `A cylinder has volume ${r * r * h}π ${unit}³ and radius ${r} ${unit}. What is its height?`, a: `${h} ${unit}` };
};
const genTwoWayTables: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [rowA, rowB, colA, colB, ctx] = pick([
    ["boys", "girls", "soccer", "basketball", "students chose a favorite sport"],
    ["7th graders", "8th graders", "cats", "dogs", "students chose a favorite pet"],
    ["adults", "children", "cereal", "eggs", "people chose a breakfast"],
  ]);
  const aa = randInt(5, 30), ab = randInt(5, 30), ba = randInt(5, 30), bb = randInt(5, 30);
  const table = `In a survey, ${ctx}: ${aa} ${rowA} chose ${colA}, ${ab} ${rowA} chose ${colB}, ${ba} ${rowB} chose ${colA} and ${bb} ${rowB} chose ${colB}.`;
  const kind = pick(by(diff, { easy: ["total", "col"], medium: ["col", "row", "rel"], hard: ["rel", "relCol", "pct"] }));
  if (kind === "total") return { q: `${table} How many people were surveyed?`, a: `${aa + ab + ba + bb}` };
  if (kind === "col") return { q: `${table} How many chose ${colA}?`, a: `${aa + ba}` };
  if (kind === "row") return { q: `${table} How many ${rowB} were surveyed?`, a: `${ba + bb}` };
  if (kind === "rel") return { q: `${table} What fraction of the ${rowA} chose ${colB}?`, a: fStr(frac(ab, aa + ab)) };
  if (kind === "relCol") return { q: `${table} Of those who chose ${colA}, what fraction were ${rowB}?`, a: fStr(frac(ba, aa + ba)) };
  return { q: `${table} What percent of the ${rowB} chose ${colA}? (round to the nearest whole percent)`, a: `${Math.round((ba / (ba + bb)) * 100)}%` };
};

// ===================================================================== challenges
const genNumberTheory: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const templates = [
    () => { const set = [2, 3, 4, 5, 6, 7, 8, 9].slice(0, randInt(3, 6)); return { q: `What is the smallest positive whole number divisible by every number from 2 to ${set[set.length - 1]}?`, a: `${set.reduce((a, b) => lcm(a, b), 1)}` }; },
    () => { const k = randInt(3, 13); let c = 0; for (let i = 10; i <= 99; i++) if (i % k === 0) c++; return { q: `How many two-digit numbers are divisible by ${k}?`, a: `${c}` }; },
    () => { const b = pick([2, 3, 7, 8, 9]), e = randInt(10, 60); let u = 1; for (let i = 0; i < e; i++) u = (u * b) % 10; return { q: `What is the units (ones) digit of ${b}^${e}?`, a: `${u}` }; },
    () => { const n = pick([36, 48, 60, 72, 84, 90, 96, 100, 120]); return { q: `How many factors does ${n} have?`, a: `${factorsOf(n).length}` }; },
    () => { const d = [2, 3, 4], extra = pick([5, 7]); let n = 1; while (!(d.every((k) => n % k === 1) && n % extra === 0)) n++; return { q: `What is the smallest number that leaves a remainder of 1 when divided by 2, 3 or 4, and is divisible by ${extra}?`, a: `${n}` }; },
    () => { const n = randInt(10, 40); return { q: `What is the sum of all whole numbers from 1 to ${n}?`, a: `${(n * (n + 1)) / 2}` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 3) : templates)();
};
const genCounting: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const templates = [
    () => { const s = randInt(2, 6), p = randInt(2, 5), h = randInt(1, 4); return { q: `You have ${s} shirts, ${p} pairs of pants and ${h} hats. How many different outfits of one shirt, one pair of pants and one hat can you make?`, a: `${s * p * h}` }; },
    () => { const n = randInt(4, 15); return { q: `At a meeting, ${n} people each shake hands once with everyone else. How many handshakes take place?`, a: `${nCr(n, 2)}` }; },
    () => { const w = pick(["MATH", "CODE", "FROG", "PLANT", "BRICK", "CLIMB"]); return { q: `How many different ways can the letters of the word ${w} be arranged? (all letters are different)`, a: `${factorial(w.length)}` }; },
    () => { const d = randInt(4, 7); return { q: `How many 3-digit numbers can be made from the digits 1 to ${d} if no digit is repeated?`, a: `${d * (d - 1) * (d - 2)}` }; },
    () => { const m = randInt(2, 4), n = randInt(2, 4); return { q: `On a grid, you walk from the bottom-left corner to a point ${m} blocks right and ${n} blocks up, moving only right or up. How many different shortest paths are there?`, a: `${nCr(m + n, m)}` }; },
    () => { const n = randInt(5, 10), k = randInt(2, 3); return { q: `How many ways can a team of ${k} be chosen from ${n} students?`, a: `${nCr(n, k)}` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 3) : templates)();
};

export const MATH_MIDDLE_GENERATORS: Record<string, Gen> = {
  gcf_lcm: genGcfLcm, absolute_value: genAbsoluteValue, coordinate_four_quadrants: genCoordFour, compare_rationals: genCompareRationals,
  exponents_whole: genExponentsWhole, write_expressions_alg: genWriteExpressionsAlg, inequalities_intro: genInequalitiesIntro,
  polygon_area: genPolygonArea, mad_iqr: genMadIqr,
  constant_proportionality: genConstantProp, percent_change: genPercentChange, simple_interest: genSimpleInterest,
  scale_drawings: genScaleDrawings, rational_ops: genRationalOps, fraction_to_decimal: genFractionToDecimal,
  two_step_equations: genTwoStepEq, inequalities_solve: genInequalitiesSolve, factor_linear: genFactorLinear,
  angle_relationships: genAngleRelationships, probability_compound: genProbCompound,
  scientific_notation: genScientificNotation, square_cube_roots: genSquareCubeRoots, irrational_numbers: genIrrational,
  multi_step_equations: genMultiStepEq, slope: genSlope, slope_intercept: genSlopeIntercept, functions_intro: genFunctionsIntro,
  transformations: genTransformations, triangle_angles: genTriangleAngles, volume_cones_spheres: genVolumeConesSpheres,
  two_way_tables: genTwoWayTables, challenge_number_theory: genNumberTheory, challenge_counting: genCounting,
};

