import { Topic, Gen, Difficulty, RNG, makeHelpers } from "./types";

export const MATH_TOPICS: Topic[] = [
  { id: "addsub", label: "Addition & Subtraction", grades: [1, 2], aliases: ["addition", "subtraction", "add and subtract"] },
  { id: "counting", label: "Counting & Sequences", grades: [1], aliases: ["counting", "number sequence", "skip counting"] },
  { id: "comparing", label: "Comparing Numbers", grades: [1, 2], aliases: ["comparing numbers", "compare numbers", "greater than", "less than"] },
  { id: "shapes", label: "Shapes & Basics", grades: [1, 2, 3], aliases: ["shapes", "sides and corners", "vertices"] },
  { id: "placevalue", label: "Place Value & Rounding", grades: [2, 3, 4], aliases: ["place value", "rounding"] },
  { id: "multdiv", label: "Multiplication & Division", grades: [3, 4], aliases: ["multiplication", "division", "times table", "multiply", "divide"] },
  { id: "fractions_intro", label: "Intro to Fractions", grades: [3, 4], aliases: ["intro fraction", "simple fraction", "basic fraction"] },
  { id: "decimals_intro", label: "Intro to Decimals", grades: [4, 5], aliases: ["intro decimal", "simple decimal", "basic decimal"] },
  { id: "wordproblems", label: "Word Problems", grades: [1, 2, 3, 4], aliases: ["word problem"] },
  { id: "fractions", label: "Fractions (Mixed Practice)", grades: [5, 6], aliases: ["fraction"], group: "Fractions" },
  { id: "fractions_add_sub", label: "Adding & Subtracting Fractions", grades: [5, 6], aliases: ["add fraction", "subtract fraction", "adding fractions", "subtracting fractions"], group: "Fractions" },
  { id: "fractions_mul_div", label: "Multiplying & Dividing Fractions", grades: [5, 6], aliases: ["multiply fraction", "divide fraction", "multiplying fractions", "dividing fractions"], group: "Fractions" },
  { id: "fractions_simplify", label: "Simplifying Fractions", grades: [5, 6], aliases: ["simplify fraction", "reduce fraction", "lowest terms"], group: "Fractions" },
  { id: "fractions_compare", label: "Comparing Fractions", grades: [5, 6], aliases: ["compare fraction", "comparing fractions", "greater fraction"], group: "Fractions" },

  { id: "decimals", label: "Decimals (Mixed Practice)", grades: [5, 6], aliases: ["decimal"], group: "Decimals" },
  { id: "decimals_add_sub", label: "Adding & Subtracting Decimals", grades: [5, 6], aliases: ["add decimal", "subtract decimal", "adding decimals", "subtracting decimals"], group: "Decimals" },
  { id: "decimals_mul_div", label: "Multiplying & Dividing Decimals", grades: [5, 6], aliases: ["multiply decimal", "divide decimal", "multiplying decimals", "dividing decimals"], group: "Decimals" },
  { id: "decimals_round", label: "Rounding Decimals", grades: [5, 6], aliases: ["round decimal", "rounding decimals"], group: "Decimals" },
  { id: "decimals_compare", label: "Comparing Decimals", grades: [5, 6], aliases: ["compare decimal", "comparing decimals"], group: "Decimals" },

  { id: "geometry", label: "Geometry (Mixed Practice)", grades: [4, 5, 6, 7, 8], aliases: ["geometry", "area", "perimeter", "volume"], group: "Geometry" },
  { id: "geometry_area_rect", label: "Area: Rectangles & Parallelograms", grades: [4, 5, 6, 7, 8], aliases: ["area of rectangle", "area of parallelogram"], group: "Geometry" },
  { id: "geometry_area_triangle", label: "Area: Triangles", grades: [4, 5, 6, 7, 8], aliases: ["area of triangle", "triangle area"], group: "Geometry" },
  { id: "geometry_volume", label: "Volume: Rectangular Prisms", grades: [5, 6, 7, 8], aliases: ["volume", "rectangular prism"], group: "Geometry" },
  { id: "area_perimeter", label: "Area & Perimeter", grades: [3, 4, 5], aliases: ["area and perimeter", "perimeter", "area of a rectangle", "area of square"], group: "Geometry" },
  { id: "surface_area", label: "Surface Area of Prisms", grades: [6, 7, 8], aliases: ["surface area", "nets of"], group: "Geometry" },
  { id: "volume_prisms_cylinders", label: "Volume: Prisms & Cylinders", grades: [7, 8], aliases: ["volume of triangular prism", "triangular prism", "volume of cylinder", "cylinder"], group: "Geometry" },

  { id: "stats", label: "Statistics (Mixed Practice)", grades: [5, 6, 7, 8, 11], aliases: ["statistic"], group: "Statistics" },
  { id: "stats_central_tendency", label: "Mean, Median & Mode", grades: [5, 6, 7, 8, 11], aliases: ["mean", "median", "mode", "average"], group: "Statistics" },
  { id: "stats_range", label: "Range & Data Spread", grades: [5, 6, 7, 8, 11], aliases: ["range of data", "data spread"], group: "Statistics" },

  { id: "order", label: "Order of Operations", grades: [5, 6, 7], aliases: ["order of operations", "pemdas", "bodmas"] },

  { id: "ratios", label: "Ratios & Rates (Mixed)", grades: [6, 7], aliases: ["ratio", "unit rate"], group: "Ratios & Rates" },
  { id: "ratios_simplify", label: "Simplifying Ratios", grades: [6, 7], aliases: ["simplify ratio", "ratio in simplest form"], group: "Ratios & Rates" },
  { id: "ratios_equivalent", label: "Equivalent Ratios", grades: [6, 7], aliases: ["equivalent ratio", "ratio table"], group: "Ratios & Rates" },
  { id: "ratios_unit_rate", label: "Unit Rates", grades: [6, 7], aliases: ["unit rate", "rate per hour"], group: "Ratios & Rates" },

  { id: "percent", label: "Percentages (Mixed)", grades: [6, 7, 8], aliases: ["percent", "percentage"], group: "Percentages" },
  { id: "percent_find", label: "Finding a Percent of a Number", grades: [6, 7, 8], aliases: ["percent of a number", "what is x percent of"], group: "Percentages" },
  { id: "percent_convert", label: "Fraction, Decimal & Percent Conversion", grades: [6, 7, 8], aliases: ["percent conversion", "fraction to percent", "decimal to percent"], group: "Percentages" },
  { id: "percent_word_problems", label: "Percent Word Problems", grades: [6, 7, 8], aliases: ["discount", "percent off", "sale price"], group: "Percentages" },

  { id: "integers", label: "Integers (Mixed Practice)", grades: [6, 7, 8], aliases: ["integer", "negative number"], group: "Integers" },
  { id: "integers_add_sub", label: "Adding & Subtracting Integers", grades: [6, 7, 8], aliases: ["add integer", "subtract integer", "adding integers", "subtracting integers"], group: "Integers" },
  { id: "integers_mul_div", label: "Multiplying & Dividing Integers", grades: [6, 7, 8], aliases: ["multiply integer", "divide integer", "multiplying integers", "dividing integers"], group: "Integers" },

  { id: "expressions", label: "Expressions & Equations (Mixed)", grades: [6, 7], aliases: ["expression"], group: "Expressions & Equations" },
  { id: "expressions_evaluate", label: "Evaluating Expressions", grades: [6, 7], aliases: ["evaluate expression", "substitute value"], group: "Expressions & Equations" },
  { id: "expressions_one_step", label: "Solving One-Step Equations", grades: [6, 7], aliases: ["one-step equation", "solve for x"], group: "Expressions & Equations" },

  { id: "proportions", label: "Proportions", grades: [7, 8], aliases: ["proportion"] },
  { id: "linear", label: "Linear Equations", grades: [8, 9], aliases: ["linear equation", "two-step equation"] },
  { id: "exponents", label: "Exponents", grades: [8, 9], aliases: ["exponent", "power of", "squared number", "cubed number"] },

  // ---------- grades 9-12 ----------
  { id: "algebra_basics", label: "Algebra Basics (Mixed)", grades: [6, 7, 8, 9], aliases: ["algebra", "variables"], group: "Algebra Basics" },
  { id: "algebra_combine_terms", label: "Combining Like Terms", grades: [6, 7, 8, 9], aliases: ["combine like terms", "simplify expression"], group: "Algebra Basics" },
  { id: "algebra_distribute", label: "Distributive Property", grades: [6, 7, 8, 9], aliases: ["distributive property", "expand expression"], group: "Algebra Basics" },
  { id: "algebra_solve", label: "Solving for x", grades: [6, 7, 8, 9], aliases: ["solve for x", "algebra equation"], group: "Algebra Basics" },

  { id: "systems", label: "Systems of Equations", grades: [9], aliases: ["system of equations", "simultaneous equations"], group: "Algebra II" },
  { id: "quadratics", label: "Quadratic Equations", grades: [9, 10], aliases: ["quadratic", "factoring", "parabola"], group: "Algebra II" },
  { id: "radicals", label: "Radicals & Roots", grades: [9, 10], aliases: ["radical", "square root", "simplify root"], group: "Algebra II" },
  { id: "pythagorean", label: "Pythagorean Theorem", grades: [8, 9, 10], aliases: ["pythagorean", "right triangle", "hypotenuse"], group: "Geometry" },
  { id: "circle_geo", label: "Circles: Area & Circumference", grades: [7, 8, 9, 10], aliases: ["circle", "circumference", "radius", "diameter"], group: "Geometry" },
  { id: "coordinate_geo", label: "Coordinate Geometry", grades: [9, 10], aliases: ["coordinate plane", "distance formula", "midpoint", "slope"], group: "Geometry" },
  { id: "quadratic_formula", label: "Quadratic Formula & Vertex", grades: [10, 11], aliases: ["quadratic formula", "vertex form", "discriminant"], group: "Algebra II" },
  { id: "exponential", label: "Exponential Growth & Decay", grades: [10, 11], aliases: ["exponential growth", "exponential decay", "compound"], group: "Algebra II" },
  { id: "logarithms", label: "Logarithms", grades: [11], aliases: ["logarithm", "log base"], group: "Algebra II" },
  { id: "sequences", label: "Sequences & Series", grades: [10, 11], aliases: ["arithmetic sequence", "geometric sequence", "nth term"], group: "Algebra II" },
  { id: "trig_ratios", label: "Trigonometric Ratios", grades: [10, 11, 12], aliases: ["trigonometry", "sine", "cosine", "tangent", "soh cah toa"], group: "Trigonometry" },
  { id: "polynomials", label: "Polynomials", grades: [9, 10, 11], aliases: ["polynomial", "multiply binomials", "foil"], group: "Algebra II" },
  { id: "probability", label: "Probability", grades: [7, 8, 9, 12], aliases: ["probability", "chance", "odds"] },
];

const dr = <T,>(level: Difficulty, ranges: Record<Difficulty, T>): T => ranges[level];
const names = ["Maria", "Jayden", "Aisha", "Liam", "Priya", "Noah", "Zoe", "Kenji", "Amara", "Diego", "Ines", "Sam"];
const objects = ["stickers", "marbles", "pencils", "trading cards", "cookies", "ribbons", "beads", "notebooks"];

function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function simplifyFrac(n: number, d: number): [number, number] { const g = gcd(n, d); return [n / g, d / g]; }
function fracStr(n: number, d: number) { return d === 1 ? `${n}` : `${n}/${d}`; }
function mixedStr(n: number, d: number) {
  if (Math.abs(n) < d) return fracStr(n, d);
  const whole = Math.trunc(n / d); const rem = Math.abs(n) % d;
  return rem === 0 ? `${whole}` : `${whole} ${rem}/${d}`;
}

// ---------- grades 1-8 (unchanged behavior from the original engine) ----------
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
  const flat = [
    { name: "triangle", sides: 3 }, { name: "square", sides: 4 }, { name: "rectangle", sides: 4 },
    { name: "pentagon", sides: 5 }, { name: "hexagon", sides: 6 }, { name: "octagon", sides: 8 },
    { name: "heptagon", sides: 7 }, { name: "rhombus", sides: 4 }, { name: "trapezoid", sides: 4 },
    { name: "parallelogram", sides: 4 }, { name: "decagon", sides: 10 },
  ];
  const solids = [
    { name: "cube", faces: 6, edges: 12, vertices: 8 }, { name: "rectangular prism", faces: 6, edges: 12, vertices: 8 },
    { name: "square pyramid", faces: 5, edges: 8, vertices: 5 }, { name: "triangular prism", faces: 5, edges: 9, vertices: 6 },
    { name: "triangular pyramid", faces: 4, edges: 6, vertices: 4 },
  ];
  const easyFlat = flat.slice(0, 6);
  const kind = pick(diff === "easy" ? ["sides", "corners"] : diff === "medium" ? ["sides", "corners", "name", "faces"] : ["faces", "edges", "vertices", "name", "total"]);
  const f = pick(diff === "easy" ? easyFlat : flat);
  if (kind === "sides") return { q: `How many sides does a ${f.name} have?`, a: `${f.sides}` };
  if (kind === "corners") return { q: `How many corners (vertices) does a ${f.name} have?`, a: `${f.sides}` };
  if (kind === "name") {
    const g = pick(flat.filter((x) => !["square", "rectangle", "rhombus", "trapezoid", "parallelogram"].includes(x.name)));
    return { q: `What do we call a flat shape with ${g.sides} straight sides?`, a: g.name };
  }
  const sld = pick(solids);
  if (kind === "faces") return { q: `How many faces does a ${sld.name} have?`, a: `${sld.faces}` };
  if (kind === "edges") return { q: `How many edges does a ${sld.name} have?`, a: `${sld.edges}` };
  if (kind === "vertices") return { q: `How many vertices (corners) does a ${sld.name} have?`, a: `${sld.vertices}` };
  const two = [pick(easyFlat), pick(easyFlat)];
  return { q: `How many sides do a ${two[0].name} and a ${two[1].name} have altogether?`, a: `${two[0].sides + two[1].sides}` };
};
const genPlaceValue: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const digits = grade <= 2 ? { easy: 2, medium: 3, hard: 3 }[diff] : { easy: 3, medium: 4, hard: 5 }[diff];
  const num = randInt(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  if (rng() < 0.5) {
    const numStr = `${num}`; const pos = randInt(0, numStr.length - 1); const digit = numStr[pos];
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
  if (rng() < 0.5) { const item = pick(["pizza", "chocolate bar", "garden", "cake"]); return { q: `A ${item} is cut into ${d} equal pieces. If you have ${n} piece(s), what fraction is that?`, a: `${n}/${d}` }; }
  // Comparing needs two different numerators. With halves there is only 1/2,
  // which used to loop forever (froze the page on Easy) — use quarters instead.
  const cd = d < 3 ? 4 : d;
  const cn = Math.min(n, cd - 1);
  let n2 = randInt(1, cd - 1); while (n2 === cn) n2 = randInt(1, cd - 1);
  return { q: `Compare: ${cn}/${cd} ___ ${n2}/${cd}  (use <, >, or =)`, a: cn > n2 ? ">" : cn < n2 ? "<" : "=" };
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
  let d1 = pick(dens), d2 = pick(dens);
  // proper fractions (e.g. 3/8) on easy/medium; improper ones (e.g. 13/8) only on hard
  let n1 = diff === "hard" ? randInt(1, d1 * 2) : randInt(1, d1 - 1), n2 = diff === "hard" ? randInt(1, d2 * 2) : randInt(1, d2 - 1);
  if (n1 === d1) n1 = d1 - 1 || 1; if (n2 === d2) n2 = d2 + 1;
  if (diff === "easy") { n1 = randInt(1, d1 - 1); n2 = randInt(1, d1 - 1); d2 = d1; }
  // Grades 5–6 haven't met negative numbers yet: put the larger fraction first,
  // and never subtract a fraction from itself (e.g. 1/2 − 1/2).
  if (op === "-" && n1 * d2 === n2 * d1) { if (n1 < d1 - 1) n1++; else if (n2 > 1) n2--; else d2++; }
  if (op === "-" && n1 * d2 < n2 * d1) { [n1, n2] = [n2, n1]; [d1, d2] = [d2, d1]; }
  if (op === "+" || op === "-") { const num = op === "+" ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1; const [sn, sd] = simplifyFrac(num, d1 * d2); return { q: `${fracStr(n1, d1)} ${op} ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) }; }
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
  if (op === "+") result = a + b; else if (op === "-") result = a - b;
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
  const base = dr(diff, { easy: () => randInt(1, 20) * 10, medium: () => randInt(1, 50) * 4, hard: () => randInt(10, 300) })();
  const result = Math.round(((pct / 100) * base) * 100) / 100;
  if (kind === "findpercent") return { q: `What is ${pct}% of ${base}?`, a: `${result}` };
  const item = pick(["backpack", "skateboard", "book set", "video game", "pair of shoes"]);
  return { q: `A ${item} costs $${base}. It is on sale for ${pct}% off. How much is the discount?`, a: `$${result}` };
};

// ---------- Phase 2 sub-topic generators ----------
const genRatiosSimplify: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const g = randInt(2, diff === "hard" ? 9 : 6), x = randInt(2, 9), y = randInt(2, 9);
  const [rn, rd] = simplifyFrac(x * g, y * g);
  return { q: `Write the ratio ${x * g} : ${y * g} in simplest form.`, a: `${rn} : ${rd}` };
};
const genRatiosEquivalent: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const a1 = randInt(2, 9), b1 = randInt(2, 9), mult = randInt(2, diff === "hard" ? 9 : 5);
  return { q: `${a1} : ${b1} = ${a1 * mult} : ?`, a: `${b1 * mult}` };
};
const genRatiosUnitRate: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const person = pick(names), item = pick(["miles", "pages", "laps", "problems", "words typed"]);
  const hours = randInt(2, 6), rate = randInt(3, diff === "hard" ? 18 : 9);
  return { q: `${person} completed ${hours * rate} ${item} in ${hours} hours. What is the rate per hour?`, a: `${rate} ${item} per hour` };
};

const genPercentFind: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const pct = pick(dr(diff, { easy: [10, 20, 25, 50], medium: [10, 15, 20, 25, 30, 40, 60, 75], hard: [8, 12, 15, 35, 45, 65, 85] }));
  const base = dr(diff, { easy: () => randInt(1, 20) * 10, medium: () => randInt(1, 50) * 4, hard: () => randInt(10, 300) })();
  return { q: `What is ${pct}% of ${base}?`, a: `${Math.round(((pct / 100) * base) * 100) / 100}` };
};
const genPercentConvert: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(["frac_to_pct", "dec_to_pct"]);
  if (kind === "frac_to_pct") { const d = pick([4, 5, 10, 20, 25, 50]), n = randInt(1, d - 1); return { q: `Write ${n}/${d} as a percent.`, a: `${Math.round((n / d) * 100)}%` }; }
  const dec = (randInt(1, 99) / 100).toFixed(2);
  return { q: `Write ${dec} as a percent.`, a: `${Math.round(parseFloat(dec) * 100)}%` };
};
const genPercentWordProblems: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const pct = pick(dr(diff, { easy: [10, 20, 25, 50], medium: [15, 20, 30, 40], hard: [12, 35, 45, 65] }));
  const base = dr(diff, { easy: () => randInt(1, 20) * 10, medium: () => randInt(1, 50) * 4, hard: () => randInt(10, 300) })();
  const discount = Math.round(((pct / 100) * base) * 100) / 100;
  const item = pick(["backpack", "skateboard", "book set", "video game", "pair of shoes"]);
  return { q: `A ${item} costs $${base}. It is on sale for ${pct}% off. How much is the discount?`, a: `$${discount}` };
};

const genExpressionsEvaluate: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const x = randInt(1, diff === "hard" ? 12 : 8), coeff = randInt(2, 9), add = randInt(1, 15);
  if (diff === "hard" && rng() < 0.4) return { q: `Evaluate ${coeff}x² + ${add} when x = ${x}.`, a: `${coeff * x * x + add}` };
  return { q: `Evaluate ${coeff}x + ${add} when x = ${x}.`, a: `${coeff * x + add}` };
};
const genExpressionsOneStep: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const coeff = diff === "hard" ? randInt(2, 9) : 1, x = randInt(2, diff === "hard" ? 15 : 12), add = randInt(1, 20), total = coeff * x + add;
  return { q: `Solve for x: ${coeff === 1 ? `x + ${add}` : `${coeff}x + ${add}`} = ${total}`, a: `x = ${x}` };
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
  if (diff === "medium") {
    // keep answers non-negative: n4 ≤ 5 < (n1 + n2) × n3
    return { q: `(${n1} + ${n2}) × ${n3} - ${n4} = ?`, a: `${(n1 + n2) * n3 - n4}` };
  }
  const n5 = randInt(2, 6);
  if (grade >= 6 && rng() < 0.5) {
    // exponents and division, with clean integer division
    const sq = randInt(2, 5), d = randInt(2, 6), mult = d * randInt(1, 6);
    return { q: `${sq}² + ${mult} ÷ ${d} × ${n3} - ${n4} = ?`, a: `${sq * sq + (mult / d) * n3 - n4}` };
  }
  const value = n1 * (n2 + n3) - n4 * n5;
  // Grades 5 and below haven't met negative numbers: add instead of subtract
  if (value < 0 && grade < 6) return { q: `${n1} × (${n2} + ${n3}) + ${n4} × ${n5} = ?`, a: `${n1 * (n2 + n3) + n4 * n5}` };
  return { q: `${n1} × (${n2} + ${n3}) - ${n4} × ${n5} = ?`, a: `${value}` };
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

// ---------- focused sub-topic generators (Phase 1 of topic splitting) ----------
const genFractionsAddSub: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const dens = dr(diff, { easy: [2, 3, 4, 5, 6], medium: [2, 3, 4, 5, 6, 8, 9, 10, 12], hard: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12] });
  const op = pick(["+", "-"]);
  let d1 = pick(dens), d2 = pick(dens);
  // proper fractions (e.g. 3/8) on easy/medium; improper ones (e.g. 13/8) only on hard
  let n1 = diff === "hard" ? randInt(1, d1 * 2) : randInt(1, d1 - 1), n2 = diff === "hard" ? randInt(1, d2 * 2) : randInt(1, d2 - 1);
  if (n1 === d1) n1 = d1 - 1 || 1; if (n2 === d2) n2 = d2 + 1;
  if (diff === "easy") { n1 = randInt(1, d1 - 1); n2 = randInt(1, d1 - 1); d2 = d1; }
  // Grades 5–6 haven't met negative numbers yet: put the larger fraction first,
  // and never subtract a fraction from itself (e.g. 1/2 − 1/2).
  if (op === "-" && n1 * d2 === n2 * d1) { if (n1 < d1 - 1) n1++; else if (n2 > 1) n2--; else d2++; }
  if (op === "-" && n1 * d2 < n2 * d1) { [n1, n2] = [n2, n1]; [d1, d2] = [d2, d1]; }
  const num = op === "+" ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
  const [sn, sd] = simplifyFrac(num, d1 * d2);
  return { q: `${fracStr(n1, d1)} ${op} ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) };
};
const genFractionsMulDiv: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const dens = dr(diff, { easy: [2, 3, 4, 5], medium: [2, 3, 4, 5, 6, 8], hard: [2, 3, 4, 5, 6, 7, 8, 9, 10] });
  const op = pick(["×", "÷"]);
  const d1 = pick(dens), d2 = pick(dens), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
  if (op === "×") { const [sn, sd] = simplifyFrac(n1 * n2, d1 * d2); return { q: `${fracStr(n1, d1)} × ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) }; }
  const [sn, sd] = simplifyFrac(n1 * d2, d1 * n2);
  return { q: `${fracStr(n1, d1)} ÷ ${fracStr(n2, d2)} = ?`, a: mixedStr(sn, sd) };
};
const genFractionsSimplify: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const factor = randInt(2, diff === "hard" ? 9 : 5);
  const [baseN, baseD] = [randInt(1, diff === "hard" ? 8 : 5), pick(diff === "easy" ? [2, 3, 4] : [2, 3, 4, 5, 6, 7])];
  const n = baseN * factor, d = baseD * factor;
  const [sn, sd] = simplifyFrac(n, d);
  return { q: `Simplify to lowest terms: ${fracStr(n, d)}`, a: mixedStr(sn, sd) };
};
const genFractionsCompare: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const dens = dr(diff, { easy: [2, 3, 4], medium: [2, 3, 4, 5, 6, 8], hard: [2, 3, 4, 5, 6, 7, 8, 9, 10] });
  const d1 = pick(dens), d2 = pick(dens), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
  const symbol = n1 * d2 > n2 * d1 ? ">" : n1 * d2 < n2 * d1 ? "<" : "=";
  return { q: `Compare: ${fracStr(n1, d1)} ___ ${fracStr(n2, d2)}  (use <, >, or =)`, a: symbol };
};

const genDecimalsAddSub: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const places = dr(diff, { easy: 1, medium: 2, hard: 2 });
  const maxWhole = dr(diff, { easy: 20, medium: 80, hard: 300 });
  const op = rng() < 0.5 ? "+" : "-";
  const rnd = () => parseFloat((rng() * maxWhole).toFixed(places));
  let a = rnd(), b = rnd();
  if (op === "-" && b > a) [a, b] = [b, a];
  const result = op === "+" ? a + b : a - b;
  return { q: `${a} ${op} ${b} = ?`, a: `${Math.round(result * 100) / 100}` };
};
const genDecimalsMulDiv: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const op = rng() < 0.5 ? "×" : "÷";
  if (op === "×") {
    const a = parseFloat((rng() * (diff === "hard" ? 50 : 20)).toFixed(diff === "easy" ? 1 : 2));
    const b = parseFloat((rng() * 9 + 1).toFixed(1));
    return { q: `${a} × ${b} = ?`, a: `${Math.round(a * b * 100) / 100}` };
  }
  const divisor = randInt(2, 9);
  const a = parseFloat((divisor * randInt(2, diff === "hard" ? 30 : 10)).toFixed(0));
  return { q: `${a} ÷ ${divisor} = ?`, a: `${Math.round((a / divisor) * 100) / 100}` };
};
const genDecimalsRound: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const places = dr(diff, { easy: 1, medium: 2, hard: 3 });
  const whole = randInt(1, 999);
  const frac = randInt(0, Math.pow(10, places) - 1);
  const num = parseFloat(`${whole}.${frac.toString().padStart(places, "0")}`);
  const roundTo = pick(["nearest whole number", "nearest tenth"]);
  const rounded = roundTo === "nearest whole number" ? Math.round(num) : Math.round(num * 10) / 10;
  return { q: `Round ${num} to the ${roundTo}.`, a: `${rounded}` };
};
const genDecimalsCompare: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const places = dr(diff, { easy: 1, medium: 2, hard: 2 });
  const rnd = () => parseFloat((randInt(1, 999) / Math.pow(10, places)).toFixed(places));
  const a = rnd(), b = rnd();
  return { q: `Compare: ${a} ___ ${b}  (use <, >, or =)`, a: a > b ? ">" : a < b ? "<" : "=" };
};

const genGeometryAreaRect: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = diff === "hard" ? 30 : diff === "medium" ? 18 : 12;
  const shape = pick(["rectangle", "parallelogram"]);
  const w = randInt(3, max), h = randInt(3, max);
  const label = shape === "rectangle" ? `length ${w} cm and width ${h} cm` : `base ${w} cm and height ${h} cm`;
  return { q: `Find the area of a ${shape} with ${label}.`, a: `${w * h} cm²` };
};
const genGeometryAreaTriangle: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const max = diff === "hard" ? 30 : diff === "medium" ? 20 : 12;
  const b = randInt(4, max), h = randInt(4, max);
  return { q: `Find the area of a triangle with base ${b} cm and height ${h} cm.`, a: `${(b * h) / 2} cm²` };
};
const genGeometryVolume: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const max = diff === "hard" ? 15 : diff === "medium" ? 10 : 6;
  const l = randInt(2, max), w = randInt(2, max), h = randInt(2, max);
  if (diff === "easy" && rng() < 0.3) { const e = randInt(2, 9); return { q: `Find the volume of a cube with edges of ${e} cm.`, a: `${e * e * e} cm³` }; }
  if (diff === "hard" && rng() < 0.4) return { q: `A rectangular prism has volume ${l * w * h} cm³, length ${l} cm and width ${w} cm. What is its height?`, a: `${h} cm` };
  if (diff !== "easy" && rng() < 0.3) return { q: `A fish tank is ${l * 5} cm long, ${w * 5} cm wide and ${h * 5} cm tall. What is its volume?`, a: `${125 * l * w * h} cm³` };
  return { q: `Find the volume of a rectangular prism with length ${l} cm, width ${w} cm, and height ${h} cm.`, a: `${l * w * h} cm³` };
};

const genAreaPerimeter: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const unit = pick(["cm", "m", "in", "ft"]);
  const max = diff === "easy" ? 10 : diff === "medium" ? 15 : 20;
  const l = randInt(2, max), w = randInt(2, max);
  const kinds = diff === "easy" ? ["area", "perim", "square"] : diff === "medium" ? ["area", "perim", "missingP", "missingA", "word"] : ["missingP", "missingA", "lshape", "word", "compare"];
  const kind = pick(kinds);
  if (kind === "area") return { q: `Find the area of a rectangle ${l} ${unit} long and ${w} ${unit} wide.`, a: `${l * w} ${unit}²` };
  if (kind === "perim") return { q: `Find the perimeter of a rectangle ${l} ${unit} long and ${w} ${unit} wide.`, a: `${2 * (l + w)} ${unit}` };
  if (kind === "square") { const s = randInt(2, 12); return pick([{ q: `A square has sides of ${s} ${unit}. What is its perimeter?`, a: `${4 * s} ${unit}` }, { q: `A square has sides of ${s} ${unit}. What is its area?`, a: `${s * s} ${unit}²` }]); }
  if (kind === "missingP") return { q: `A rectangle has a perimeter of ${2 * (l + w)} ${unit}. Its length is ${l} ${unit}. What is its width?`, a: `${w} ${unit}` };
  if (kind === "missingA") return { q: `A rectangle has an area of ${l * w} ${unit}². Its length is ${l} ${unit}. What is its width?`, a: `${w} ${unit}` };
  if (kind === "word") {
    return pick([
      { q: `A garden is ${l} m long and ${w} m wide. How many meters of fence are needed to go all the way around it?`, a: `${2 * (l + w)} m` },
      { q: `A floor is ${l} ft by ${w} ft. How many square feet of carpet are needed to cover it?`, a: `${l * w} ft²` },
    ]);
  }
  if (kind === "compare") {
    const a2 = randInt(2, max), b2 = randInt(2, max);
    const A1 = l * w, A2 = a2 * b2;
    return { q: `Rectangle A is ${l} × ${w} ${unit}. Rectangle B is ${a2} × ${b2} ${unit}. Which has the greater area, and by how much?`, a: A1 === A2 ? "they are equal" : `${A1 > A2 ? "A" : "B"}, by ${Math.abs(A1 - A2)} ${unit}²` };
  }
  // L-shape made of two rectangles: a big rectangle with a corner rectangle cut out
  const W = randInt(6, 14), H = randInt(6, 14), cw = randInt(2, W - 3), ch = randInt(2, H - 3);
  return { q: `An L-shaped room is a ${W} m × ${H} m rectangle with a ${cw} m × ${ch} m corner cut out. What is its area?`, a: `${W * H - cw * ch} m²` };
};

const genSurfaceArea: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const unit = pick(["cm", "m", "in"]);
  const kind = pick(diff === "easy" ? ["cube", "rect"] : diff === "medium" ? ["rect", "rect", "cube", "word"] : ["tri", "rect", "missing", "word"]);
  if (kind === "cube") { const s = randInt(2, 12); return { q: `Find the surface area of a cube with edges of ${s} ${unit}.`, a: `${6 * s * s} ${unit}²` }; }
  const l = randInt(2, diff === "easy" ? 8 : 15), w = randInt(2, diff === "easy" ? 8 : 12), h = randInt(2, diff === "easy" ? 8 : 12);
  const sa = 2 * (l * w + l * h + w * h);
  if (kind === "rect") return { q: `Find the surface area of a rectangular prism ${l} ${unit} long, ${w} ${unit} wide and ${h} ${unit} high.`, a: `${sa} ${unit}²` };
  if (kind === "word") return { q: `A gift box is ${l} cm × ${w} cm × ${h} cm. How much wrapping paper is needed to cover it exactly (no overlap)?`, a: `${sa} cm²` };
  if (kind === "missing") {
    // SA known, find height: SA = 2lw + 2h(l + w)
    return { q: `A rectangular prism has length ${l} ${unit}, width ${w} ${unit} and surface area ${sa} ${unit}². What is its height?`, a: `${h} ${unit}` };
  }
  // right-triangular prism using a Pythagorean triple: two triangles + three rectangles
  const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), len = randInt(4, 15);
  return { q: `A triangular prism has a right-triangle base with sides ${a}, ${b} and ${c} ${unit}, and a length of ${len} ${unit}. Find its surface area.`, a: `${a * b + (a + b + c) * len} ${unit}²` };
};

const genVolumePrismsCylinders: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const unit = pick(["cm", "m", "in"]);
  const kind = pick(diff === "easy" ? ["rect", "tri"] : diff === "medium" ? ["tri", "cyl", "rect"] : ["tri", "cyl", "cylMissing", "triMissing"]);
  const round2 = (x: number) => Math.round(x * 100) / 100;
  if (kind === "rect") { const l = randInt(2, 12), w = randInt(2, 12), h = randInt(2, 12); return { q: `Find the volume of a rectangular prism ${l} × ${w} × ${h} ${unit}.`, a: `${l * w * h} ${unit}³` }; }
  if (kind === "tri") {
    const b = randInt(1, 6) * 2, h = randInt(2, 12), len = randInt(2, 15); // even base keeps ½bh whole
    return { q: `A triangular prism has a triangular face with base ${b} ${unit} and height ${h} ${unit}. The prism is ${len} ${unit} long. Find its volume.`, a: `${(b * h / 2) * len} ${unit}³` };
  }
  if (kind === "triMissing") {
    const b = randInt(1, 6) * 2, h = randInt(2, 12), len = randInt(2, 15);
    return { q: `A triangular prism has volume ${(b * h / 2) * len} ${unit}³. Its triangular face has base ${b} ${unit} and height ${h} ${unit}. How long is the prism?`, a: `${len} ${unit}` };
  }
  const r = randInt(1, diff === "hard" ? 10 : 6), h = randInt(2, 15);
  if (kind === "cyl") return { q: `Find the volume of a cylinder with radius ${r} ${unit} and height ${h} ${unit}. (Use π ≈ 3.14, round to 2 decimals)`, a: `${round2(3.14 * r * r * h)} ${unit}³` };
  return { q: `A cylinder has volume ${round2(3.14 * r * r * h)} ${unit}³ and radius ${r} ${unit}. Using π ≈ 3.14, what is its height?`, a: `${h} ${unit}` };
};

const genIntegersAddSub: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const range = dr(diff, { easy: 10, medium: 25, hard: 60 });
  const op = rng() < 0.5 ? "+" : "-";
  const a = randInt(-range, range) || 1, b = randInt(-range, range) || 1;
  const result = op === "+" ? a + b : a - b;
  const bStr = b < 0 ? `(${b})` : `${b}`;
  return { q: `${a} ${op} ${bStr} = ?`, a: `${result}` };
};
const genIntegersMulDiv: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const op = rng() < 0.5 ? "×" : "÷";
  let a: number, b: number, result: number;
  if (op === "×") { a = randInt(-12, 12) || 1; b = randInt(-12, 12) || 3; result = a * b; }
  else { const divisor = randInt(2, 9) * (rng() < 0.5 ? -1 : 1); const q = randInt(-12, 12) || 2; a = divisor * q; b = divisor; result = q; }
  const bStr = b < 0 ? `(${b})` : `${b}`;
  return { q: `${a} ${op} ${bStr} = ?`, a: `${result}` };
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
  const counts: Record<number, number> = {}; data.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  return { q: `Find the mode of: ${data.join(", ")}`, a: `${Object.keys(counts).reduce((a, b) => (counts[+a] >= counts[+b] ? a : b))}` };
};
const genStatsCentralTendency: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const size = dr(diff, { easy: 5, medium: 6, hard: 7 });
  const max = dr(diff, { easy: 20, medium: 50, hard: 100 });
  const data = Array.from({ length: size }, () => randInt(1, max));
  const sorted = [...data].sort((a, b) => a - b);
  const kind = pick(["mean", "median", "mode"]);
  if (kind === "mean") return { q: `Find the mean of: ${data.join(", ")}`, a: `${Math.round((data.reduce((s, v) => s + v, 0) / data.length) * 100) / 100}` };
  if (kind === "median") { const mid = Math.floor(sorted.length / 2); return { q: `Find the median of: ${data.join(", ")}`, a: `${sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]}` }; }
  const dupIndex = randInt(0, data.length - 2); data[dupIndex + 1] = data[dupIndex];
  const counts: Record<number, number> = {}; data.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  return { q: `Find the mode of: ${data.join(", ")}`, a: `${Object.keys(counts).reduce((a, b) => (counts[+a] >= counts[+b] ? a : b))}` };
};
const genStatsRange: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const size = dr(diff, { easy: 5, medium: 6, hard: 8 });
  const max = dr(diff, { easy: 20, medium: 50, hard: 100 });
  const data = Array.from({ length: size }, () => randInt(1, max));
  const sorted = [...data].sort((a, b) => a - b);
  return { q: `Find the range of: ${data.join(", ")}`, a: `${sorted[sorted.length - 1] - sorted[0]}` };
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
  const { randInt, pick } = makeHelpers(rng);
  const kinds = diff === "easy" ? ["eval"] : diff === "medium" ? ["eval", "product", "quotient", "power", "zero"] : ["product", "quotient", "power", "negative", "sci", "mixed"];
  const kind = pick(kinds);
  const v = pick(["x", "y", "a", "n"]);
  if (kind === "eval") {
    const exp = diff === "easy" ? randInt(2, 3) : randInt(2, 4);
    const base = randInt(2, exp === 2 ? 12 : diff === "easy" ? 5 : 9);
    return { q: `Evaluate: ${base}^${exp}`, a: `${Math.pow(base, exp)}` };
  }
  if (kind === "product") { const m = randInt(2, 9), n = randInt(2, 9); return { q: `Simplify: ${v}^${m} × ${v}^${n}`, a: `${v}^${m + n}` }; }
  if (kind === "quotient") { const n = randInt(2, 6), m = n + randInt(1, 7); return { q: `Simplify: ${v}^${m} ÷ ${v}^${n}`, a: `${v}^${m - n}` }; }
  if (kind === "power") { const m = randInt(2, 5), n = randInt(2, 4); return { q: `Simplify: (${v}^${m})^${n}`, a: `${v}^${m * n}` }; }
  if (kind === "zero") { const b = randInt(2, 99); return { q: `Evaluate: ${b}^0`, a: "1" }; }
  if (kind === "negative") {
    const b = pick([2, 3, 4, 5, 10]), e = randInt(1, b === 10 ? 3 : 3);
    return { q: `Write as a fraction: ${b}^-${e}`, a: `1/${Math.pow(b, e)}` };
  }
  if (kind === "sci") {
    const mant = randInt(11, 99) / 10, e = randInt(3, 7);
    const n = Math.round(mant * Math.pow(10, e));
    return { q: `Write ${n.toLocaleString("en-US")} in scientific notation.`, a: `${mant} × 10^${e}` };
  }
  const c = randInt(2, 5), m = randInt(2, 5), n = randInt(1, 4);
  return { q: `Simplify: (${c}${v}^${m})^2 × ${v}^${n}`, a: `${c * c}${v}^${2 * m + n}` };
};
// ---------- grades 9-12 (new) ----------
const genAlgebraBasics: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(["combine", "distribute", "solve"]);
  if (kind === "combine") {
    const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9);
    return { q: `Simplify: ${a}x + ${b}x - ${c}x`, a: `${a + b - c}x` };
  }
  if (kind === "distribute") {
    const a = randInt(2, 6), b = randInt(1, 9), c = randInt(1, 9);
    return { q: `Expand: ${a}(x + ${b}) ${c >= 0 ? `+ ${c}` : ""}`.trim(), a: `${a}x + ${a * b + c}` };
  }
  const coeff = randInt(2, diff === "hard" ? 9 : 6), x = randInt(-10, 10) || 3, add = randInt(1, 15) * (rng() < 0.5 ? -1 : 1);
  const total = coeff * x + add;
  return { q: `Solve for x: ${coeff}x ${add >= 0 ? `+ ${add}` : `- ${Math.abs(add)}`} = ${total}`, a: `x = ${x}` };
};
const genAlgebraCombineTerms: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const a = randInt(2, diff === "hard" ? 15 : 9), b = randInt(2, diff === "hard" ? 15 : 9), c = randInt(2, diff === "hard" ? 15 : 9);
  return { q: `Simplify: ${a}x + ${b}x - ${c}x`, a: `${a + b - c}x` };
};
const genAlgebraDistribute: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const a = randInt(2, diff === "hard" ? 9 : 6), b = randInt(1, 9), c = randInt(1, 9);
  return { q: `Expand: ${a}(x + ${b}) + ${c}`, a: `${a}x + ${a * b + c}` };
};
const genAlgebraSolve: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const coeff = randInt(2, diff === "hard" ? 9 : 6), x = randInt(-10, 10) || 3, add = randInt(1, 15) * (rng() < 0.5 ? -1 : 1);
  const total = coeff * x + add;
  return { q: `Solve for x: ${coeff}x ${add >= 0 ? `+ ${add}` : `- ${Math.abs(add)}`} = ${total}`, a: `x = ${x}` };
};
const genSystems: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  // pick a nice integer solution, build two equations from it
  const x = randInt(-8, 8) || 1, y = randInt(-8, 8) || 1;
  const a1 = randInt(1, 5), b1 = randInt(1, 5);
  const a2 = randInt(1, 5), b2 = randInt(1, 5);
  const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
  return { q: `Solve the system: ${a1}x + ${b1}y = ${c1}  and  ${a2}x + ${b2}y = ${c2}`, a: `x = ${x}, y = ${y}` };
};
const genQuadratics: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1*r2, always integer roots
  const r1 = randInt(-8, 8), r2 = randInt(-8, 8);
  const b = -(r1 + r2), c = r1 * r2;
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const roots = r1 === r2 ? `x = ${r1}` : `x = ${Math.min(r1, r2)} or x = ${Math.max(r1, r2)}`;
  return { q: `Solve by factoring: x² ${bStr} ${cStr} = 0`, a: roots };
};
const genRadicals: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const outside = randInt(2, diff === "hard" ? 6 : 4);
  const inside = pick([2, 3, 5, 6, 7]);
  const n = outside * outside * inside;
  return { q: `Simplify: √${n}`, a: `${outside}√${inside}` };
};
const genPythagorean: Gen = (grade, diff, rng) => {
  const { pick, randInt } = makeHelpers(rng);
  const base = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const unit = pick(["cm", "m", "in", "ft"]);
  const k = diff === "easy" ? 1 : randInt(1, diff === "hard" ? 4 : 3);
  const [a, b, c] = pick(diff === "easy" ? base.slice(0, 2) : base).map((x) => x * k);
  const kind = pick(diff === "hard" ? ["leg", "decimal", "check", "ladder"] : diff === "medium" ? ["hyp", "leg", "ladder"] : ["hyp", "hyp", "leg"]);
  if (kind === "hyp") return { q: `A right triangle has legs of ${a} ${unit} and ${b} ${unit}. Find the hypotenuse.`, a: `${c} ${unit}` };
  if (kind === "leg") return { q: `A right triangle has a hypotenuse of ${c} ${unit} and one leg of ${a} ${unit}. Find the other leg.`, a: `${b} ${unit}` };
  if (kind === "ladder") return { q: `A ${c} ${unit} ladder leans against a wall with its foot ${a} ${unit} from the wall. How high up the wall does it reach?`, a: `${b} ${unit}` };
  if (kind === "check") {
    const right = rng() < 0.5;
    const sides = right ? [a, b, c] : [a, b, c + randInt(1, 3)];
    return { q: `Is a triangle with sides ${sides.join(", ")} a right triangle?`, a: right ? `yes (${a}² + ${b}² = ${c}²)` : `no (${sides[0]}² + ${sides[1]}² ≠ ${sides[2]}²)` };
  }
  const x = randInt(2, 9), y = randInt(2, 9);
  const h = Math.round(Math.sqrt(x * x + y * y) * 10) / 10;
  return { q: `A right triangle has legs of ${x} ${unit} and ${y} ${unit}. Find the hypotenuse to 1 decimal place.`, a: Number.isInteger(Math.sqrt(x * x + y * y)) ? `${Math.sqrt(x * x + y * y)} ${unit}` : `${h} ${unit}` };
};
const genCircleGeo: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const r = randInt(2, diff === "hard" ? 15 : 10);
  const kind = pick(["area", "circumference"]);
  if (kind === "area") return { q: `Find the area of a circle with radius ${r} cm. (Use π ≈ 3.14, round to 2 decimals)`, a: `${Math.round(3.14 * r * r * 100) / 100} cm²` };
  return { q: `Find the circumference of a circle with radius ${r} cm. (Use π ≈ 3.14, round to 2 decimals)`, a: `${Math.round(2 * 3.14 * r * 100) / 100} cm` };
};
const genCoordinateGeo: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x1 = randInt(-10, 10), y1 = randInt(-10, 10);
  const kind = pick(["distance", "midpoint", "slope"]);
  if (kind === "midpoint") { const x2 = randInt(-10, 10), y2 = randInt(-10, 10); return { q: `Find the midpoint of (${x1}, ${y1}) and (${x2}, ${y2}).`, a: `(${(x1 + x2) / 2}, ${(y1 + y2) / 2})` }; }
  if (kind === "slope") { const x2 = x1 + randInt(1, 8); const y2 = y1 + randInt(-8, 8); const dx = x2 - x1, dy = y2 - y1; const [sn, sd] = simplifyFrac(dy, dx); return { q: `Find the slope between (${x1}, ${y1}) and (${x2}, ${y2}).`, a: sd === 1 ? `${sn}` : `${sn}/${sd}` }; }
  const [a, b] = pick([[3, 4], [6, 8], [5, 12], [8, 15]]);
  const x2 = x1 + a, y2 = y1 + b;
  return { q: `Find the distance between (${x1}, ${y1}) and (${x2}, ${y2}).`, a: `${Math.sqrt(a * a + b * b)}` };
};
const genQuadraticFormula: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const term = (coef: number, sym: string, first = false) => {
    if (coef === 0) return "";
    const abs = Math.abs(coef), c = abs === 1 && sym ? "" : `${abs}`;
    if (first) return `${coef < 0 ? "-" : ""}${c}${sym}`;
    return ` ${coef < 0 ? "-" : "+"} ${c}${sym}`;
  };
  if (diff !== "easy" && rng() < 0.35) {
    // vertex of y = ax² + bx + c built from a(x - h)² + k
    const a = pick(diff === "hard" ? [1, 2, -1, 3] : [1, 1, 2]), h = randInt(-5, 5), k = randInt(-9, 9);
    const b = -2 * a * h, c = a * h * h + k;
    return { q: `Find the vertex of y = ${term(a, "x²", true)}${term(b, "x")}${term(c, "")}`, a: `(${h}, ${k})` };
  }
  // roots chosen first, so the discriminant is always a perfect square
  const r1 = randInt(-7, 7);
  let r2 = randInt(-7, 7); if (r2 === r1) r2 = r1 + 1;
  if (diff === "hard") {
    // a = 2: one root is a half, e.g. (2x - p)(x - q)
    const p = pick([1, 3, 5, -1, -3, -5]), q = randInt(-6, 6);
    const A = 2, B = -(p + 2 * q), C = p * q;
    const roots = [p / 2, q].sort((x, y) => x - y);
    const fmt = (x: number) => (Number.isInteger(x) ? `${x}` : `${x < 0 ? "-" : ""}${Math.abs(p)}/2`);
    return { q: `Use the quadratic formula to solve: ${term(A, "x²", true)}${term(B, "x")}${term(C, "")} = 0`, a: roots[0] === roots[1] ? `x = ${fmt(roots[0])}` : `x = ${fmt(roots[0])} or x = ${fmt(roots[1])}` };
  }
  const a = diff === "easy" ? 1 : pick([1, 1, 2, 3]);
  const B = -a * (r1 + r2), C = a * r1 * r2;
  const [lo, hi] = [r1, r2].sort((x, y) => x - y);
  return { q: `Use the quadratic formula to solve: ${term(a, "x²", true)}${term(B, "x")}${term(C, "")} = 0`, a: `x = ${lo} or x = ${hi}` };
};
const genExponential: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const initial = pick([100, 200, 500, 1000]);
  const time = randInt(2, 4);
  const kind = pick(["growth", "decay"]);
  if (kind === "growth") {
    const factor = pick([2, 3]); // doubles or triples — text always matches the factor used
    const word = factor === 2 ? "doubles" : "triples";
    return { q: `A population of ${initial} ${word} every year. What will it be after ${time} years?`, a: `${initial * Math.pow(factor, time)}` };
  }
  const half = initial * Math.pow(0.5, time);
  return { q: `A sample of ${initial}mg decays to half its amount every cycle. How much remains after ${time} cycles?`, a: `${half}mg` };
};
const genLogarithms: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const base = randInt(2, 5);
  const exp = randInt(1, diff === "hard" ? 5 : 3);
  const value = Math.pow(base, exp);
  return { q: `Evaluate: log₍${base}₎(${value})`, a: `${exp}` };
};
const genSequences: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(["arithmetic", "geometric"]);
  const n = randInt(6, 10);
  if (kind === "arithmetic") {
    const first = randInt(1, 10), d = randInt(2, 8);
    return { q: `Find the ${n}th term: ${first}, ${first + d}, ${first + 2 * d}, ${first + 3 * d}, ...`, a: `${first + (n - 1) * d}` };
  }
  const first = randInt(1, 5), r = pick([2, 3]);
  return { q: `Find the ${Math.min(n, 6)}th term: ${first}, ${first * r}, ${first * r * r}, ...`, a: `${first * Math.pow(r, Math.min(n, 6) - 1)}` };
};
const genTrigRatios: Gen = (grade, diff, rng) => {
  const { pick, randInt } = makeHelpers(rng);
  const special: [string, string][] = [
    ["sin(30°)", "1/2"], ["cos(60°)", "1/2"], ["sin(90°)", "1"], ["cos(0°)", "1"], ["sin(0°)", "0"],
    ["cos(90°)", "0"], ["tan(45°)", "1"], ["sin(45°)", "√2/2"], ["cos(45°)", "√2/2"],
    ["sin(60°)", "√3/2"], ["cos(30°)", "√3/2"], ["tan(30°)", "√3/3"], ["tan(60°)", "√3"],
  ];
  const kind = pick(diff === "easy" ? ["special", "ratio"] : diff === "medium" ? ["ratio", "ratio", "special", "side"] : ["side", "side", "angle", "ratio"]);
  if (kind === "special") { const [q, a] = pick(special); return { q: `Evaluate exactly: ${q}`, a }; }
  const [p, qq, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
  if (kind === "ratio") {
    // angle A is opposite side p
    const fn = pick(["sin", "cos", "tan"]);
    const val = fn === "sin" ? `${p}/${h}` : fn === "cos" ? `${qq}/${h}` : `${p}/${qq}`;
    return { q: `In right triangle ABC (right angle at C), the side opposite angle A is ${p}, the side adjacent to A is ${qq}, and the hypotenuse is ${h}. Find ${fn}(A).`, a: val };
  }
  if (kind === "side") {
    const hyp = randInt(2, 12) * 2;
    const which = pick(["opp30", "adj60", "opp90"]);
    if (which === "opp30") return { q: `A right triangle has a hypotenuse of ${hyp} cm and an angle of 30°. How long is the side opposite the 30° angle?`, a: `${hyp / 2} cm` };
    if (which === "adj60") return { q: `A right triangle has a hypotenuse of ${hyp} cm and an angle of 60°. How long is the side adjacent to the 60° angle?`, a: `${hyp / 2} cm` };
    const leg = randInt(2, 15);
    return { q: `In a right triangle, one angle is 45° and one leg is ${leg} cm. How long is the other leg?`, a: `${leg} cm` };
  }
  const deg = pick([30, 45, 60]);
  const val = deg === 30 ? "1/2" : deg === 45 ? "√2/2" : "√3/2";
  return { q: `An acute angle θ has sin(θ) = ${val}. What is θ?`, a: `${deg}°` };
};
const genPolynomials: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const a = randInt(1, 6), b = randInt(1, 9), c = randInt(1, 6), d = randInt(1, 9);
  const x2 = a * c, xCoeff = a * d + b * c, constant = b * d;
  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`, dSign = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
  const xSign = xCoeff >= 0 ? `+ ${xCoeff}x` : `- ${Math.abs(xCoeff)}x`, cSign = constant >= 0 ? `+ ${constant}` : `- ${Math.abs(constant)}`;
  return { q: `Multiply: (${a}x ${bSign})(${c}x ${dSign})`, a: `${x2}x² ${xSign} ${cSign}` };
};
const genProbability: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(["dice", "cards", "marbles"]);
  if (kind === "dice") { const target = randInt(1, 6); return { q: `What is the probability of rolling a ${target} on a standard six-sided die?`, a: `1/6` }; }
  if (kind === "cards") return { q: `What is the probability of drawing a heart from a standard 52-card deck?`, a: `13/52 = 1/4` };
  const red = randInt(2, 8), blue = randInt(2, 8);
  const total = red + blue;
  const [sn, sd] = simplifyFrac(red, total);
  return { q: `A bag has ${red} red marbles and ${blue} blue marbles. What is the probability of picking a red marble?`, a: `${sn}/${sd}` };
};

export const MATH_GENERATORS: Record<string, Gen> = {
  addsub: genAddSub, counting: genCounting, comparing: genComparing, shapes: genShapes,
  placevalue: genPlaceValue, multdiv: genMultDiv, fractions_intro: genFractionsIntro,
  decimals_intro: genDecimalsIntro, wordproblems: genWordProblemsEarly,
  fractions: genFraction, decimals: genDecimal, geometry: genGeometry, stats: genStats,
  order: genOrderOfOps, ratios: genRatio, percent: genPercent, integers: genIntegerV2,
  expressions: genExpression, proportions: genProportions, linear: genLinear, exponents: genExponents,
  algebra_basics: genAlgebraBasics, systems: genSystems, quadratics: genQuadratics, radicals: genRadicals,
  pythagorean: genPythagorean, circle_geo: genCircleGeo, coordinate_geo: genCoordinateGeo,
  quadratic_formula: genQuadraticFormula, exponential: genExponential, logarithms: genLogarithms,
  sequences: genSequences, trig_ratios: genTrigRatios, polynomials: genPolynomials, probability: genProbability,
  fractions_add_sub: genFractionsAddSub, fractions_mul_div: genFractionsMulDiv,
  fractions_simplify: genFractionsSimplify, fractions_compare: genFractionsCompare,
  decimals_add_sub: genDecimalsAddSub, decimals_mul_div: genDecimalsMulDiv,
  decimals_round: genDecimalsRound, decimals_compare: genDecimalsCompare,
  geometry_area_rect: genGeometryAreaRect, geometry_area_triangle: genGeometryAreaTriangle, geometry_volume: genGeometryVolume,
  area_perimeter: genAreaPerimeter, surface_area: genSurfaceArea, volume_prisms_cylinders: genVolumePrismsCylinders,
  stats_central_tendency: genStatsCentralTendency, stats_range: genStatsRange,
  ratios_simplify: genRatiosSimplify, ratios_equivalent: genRatiosEquivalent, ratios_unit_rate: genRatiosUnitRate,
  percent_find: genPercentFind, percent_convert: genPercentConvert, percent_word_problems: genPercentWordProblems,
  expressions_evaluate: genExpressionsEvaluate, expressions_one_step: genExpressionsOneStep,
  algebra_combine_terms: genAlgebraCombineTerms, algebra_distribute: genAlgebraDistribute, algebra_solve: genAlgebraSolve,
  integers_add_sub: genIntegersAddSub, integers_mul_div: genIntegersMulDiv,
};
