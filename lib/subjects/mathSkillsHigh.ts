/**
 * Fine-grained Math skill generators for grades 9–12 (Common Core high school:
 * Algebra I, Geometry, Algebra II, Precalculus, plus an intro-calculus preview).
 * Each one backs a leaf in the Math curriculum book (lib/curriculum/math.ts).
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import {
  frac, fAdd, fMul, fStr, fVal, Frac, num, round, linExpr, lineStr, sgn, poly, polyAt, polyMul, factor,
  nCr, nPr, radical, piStr, complexStr, money, NAMES,
} from "./mathUtil";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];
const deg = (x: number) => (x * Math.PI) / 180;

export const MATH_HIGH_TOPICS: Topic[] = [
  // ---- Algebra I
  T("literal_equations", "Literal Equations (Rearranging Formulas)", ["literal equation", "rearrange formula", "solve for a variable"], "Rearranging formulas such as A = lw or y = mx + b to make a different variable the subject."),
  T("absolute_value_equations", "Absolute Value Equations & Inequalities", ["absolute value equation", "absolute value inequality"], "Solving equations and inequalities that contain absolute values, including ones with no solution."),
  T("point_slope", "Writing Linear Equations", ["point slope", "equation of a line", "write linear equation"], "Writing the equation of a line from a slope and a point, or from two points."),
  T("systems_word", "Systems of Equations Word Problems", ["system word problem", "two unknowns"], "Setting up and solving two-variable systems from tickets, coins, mixtures and number puzzles."),
  T("factoring_trinomials", "Factoring Trinomials", ["factor trinomial", "factoring quadratics", "ac method"], "Factoring quadratic trinomials, from x² + bx + c up to ax² + bx + c."),
  T("special_factoring", "GCF, Difference of Squares & Perfect Squares", ["difference of squares", "perfect square trinomial", "factor out gcf"], "Factoring out a GCF and spotting differences of squares and perfect-square trinomials."),
  // ---- Geometry
  T("parallel_perpendicular", "Parallel & Perpendicular Lines", ["parallel lines slope", "perpendicular lines slope"], "Using slopes to identify and write equations of parallel and perpendicular lines."),
  T("parallel_lines_angles", "Angles Formed by Parallel Lines & Transversals", ["transversal", "alternate interior angles", "corresponding angles"], "Corresponding, alternate and same-side angles formed when a transversal crosses parallel lines."),
  T("similar_triangles", "Similar Triangles & Scale Factor", ["similar triangles", "similar figures", "scale factor"], "Using scale factors and proportions to find missing sides, perimeters and areas of similar figures."),
  T("special_right_triangles", "Special Right Triangles", ["45-45-90", "30-60-90", "special right triangle"], "Exact side lengths in 45-45-90 and 30-60-90 triangles."),
  T("trig_solve", "Solving Right Triangles with Trigonometry", ["solve right triangle", "inverse trig", "find missing side trig"], "Using sine, cosine and tangent and their inverses to find missing sides and angles."),
  T("polygon_angles", "Interior & Exterior Angles of Polygons", ["interior angles", "exterior angles", "polygon angle sum"], "Angle sums of polygons and the interior and exterior angles of regular polygons."),
  T("arc_sector", "Arc Length & Sector Area", ["arc length", "sector area"], "Finding arc lengths and sector areas as fractions of a circle, in terms of π."),
  T("circle_equation", "Equations of Circles", ["equation of a circle", "center radius form"], "Writing and reading the center-radius equation of a circle."),
  T("surface_area_solids", "Surface Area of Cylinders, Cones & Spheres", ["surface area cylinder", "surface area cone", "surface area sphere"], "Surface area of cylinders, cones and spheres in terms of π."),
  // ---- Algebra II
  T("function_ops", "Function Operations & Composition", ["composition of functions", "f(g(x))", "function operations"], "Adding, multiplying and composing functions, and evaluating composites like f(g(2))."),
  T("inverse_functions", "Inverse Functions", ["inverse function", "f inverse"], "Finding and evaluating inverse functions."),
  T("function_transformations", "Transforming Functions", ["function transformation", "vertex form shift", "graph shift"], "Describing shifts, reflections and stretches of parent functions."),
  T("complex_numbers", "Complex Numbers", ["complex number", "imaginary number", "powers of i"], "Adding, subtracting and multiplying complex numbers, powers of i and square roots of negatives."),
  T("completing_square", "Completing the Square", ["completing the square", "vertex form"], "Completing the square to rewrite quadratics in vertex form and to solve equations."),
  T("poly_remainder", "Polynomial Division & the Remainder Theorem", ["remainder theorem", "factor theorem", "synthetic division", "polynomial division"], "Dividing polynomials by x − a and using the remainder and factor theorems."),
  T("poly_zeros", "Zeros of Polynomials", ["zeros of polynomial", "roots multiplicity", "polynomial roots"], "Finding zeros and their multiplicities from factored form, and counting zeros by degree."),
  T("log_properties", "Properties of Logarithms", ["log rules", "product rule logarithm", "expand logarithm", "condense logarithm"], "Using the product, quotient and power rules to expand, condense and evaluate logarithms."),
  T("exp_equations", "Solving Exponential Equations", ["exponential equation", "same base"], "Solving exponential equations by matching bases or using logarithms."),
  T("rational_expressions", "Simplifying Rational Expressions", ["rational expression", "simplify algebraic fraction", "excluded value"], "Factoring to simplify rational expressions and stating excluded values."),
  T("radical_equations", "Solving Radical Equations", ["radical equation", "square root equation", "extraneous solution"], "Solving equations with square roots and checking for extraneous solutions."),
  T("series_sum", "Arithmetic & Geometric Series", ["series sum", "sum of arithmetic series", "geometric series", "sigma notation"], "Sums of finite arithmetic and geometric series, infinite geometric series and sigma notation."),
  T("unit_circle", "Radians & the Unit Circle", ["unit circle", "radians", "degrees to radians", "exact trig values"], "Converting degrees and radians and finding exact sine, cosine and tangent values on the unit circle."),
  T("std_dev_zscore", "Standard Deviation, z-Scores & the Normal Curve", ["standard deviation", "z-score", "normal distribution", "empirical rule"], "Measuring spread with standard deviation, standardizing with z-scores and using the 68-95-99.7 rule."),
  // ---- Precalculus & calculus preview
  T("trig_equations", "Trig Identities & Equations", ["trig identity", "trig equation", "pythagorean identity"], "Using the Pythagorean identity and solving basic trig equations on 0° to 360°."),
  T("law_sines_cosines", "Law of Sines & Law of Cosines", ["law of sines", "law of cosines", "oblique triangle"], "Solving non-right triangles and finding their areas."),
  T("vectors", "Vectors", ["vector", "magnitude", "dot product"], "Vector addition, scalar multiples, magnitude and the dot product."),
  T("matrices", "Matrix Operations", ["matrix", "matrices", "determinant"], "Adding and multiplying matrices and finding 2 × 2 determinants."),
  T("permutations_combinations", "Permutations & Combinations", ["permutation", "combination", "nCr", "nPr"], "Counting ordered and unordered selections with nPr and nCr."),
  T("binomial_probability", "Binomial Probability", ["binomial probability", "exactly k successes"], "Probability of exactly k successes in n independent trials."),
  T("expected_value", "Expected Value", ["expected value", "fair game"], "Finding the long-run average value of games and random experiments."),
  T("limits", "Limits", ["limit", "limits calculus"], "Evaluating limits by substitution, factoring and comparing leading terms."),
  T("derivatives_power", "Derivatives: The Power Rule", ["derivative", "power rule", "differentiate"], "Differentiating polynomials with the power rule and finding slopes of tangent lines."),
  T("integrals_basic", "Basic Integrals", ["integral", "antiderivative", "definite integral"], "Antiderivatives of polynomials and definite integrals with the power rule."),
  // ---- challenge
  T("challenge_algebra", "Challenge: Algebra Puzzles", ["algebra puzzle", "clever algebra"], "Algebra problems that look hard until you spot the trick — identities, consecutive numbers and exponents."),
  T("challenge_geometry", "Challenge: Geometry Puzzles", ["geometry puzzle", "diagonals of polygon"], "Geometry puzzles about diagonals, inscribed shapes and hidden right triangles."),
];

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]];

// ===================================================================== Algebra I
const LITERAL: [string, string, string][] = [
  ["A = lw", "w", "w = A/l"], ["d = rt", "t", "t = d/r"], ["P = 2l + 2w", "l", "l = (P - 2w)/2"], ["y = mx + b", "x", "x = (y - b)/m"],
  ["V = lwh", "h", "h = V/(lw)"], ["A = (1/2)bh", "h", "h = 2A/b"], ["C = 2πr", "r", "r = C/(2π)"], ["I = Prt", "r", "r = I/(Pt)"],
  ["F = (9/5)C + 32", "C", "C = (5/9)(F - 32)"], ["ax + b = c", "x", "x = (c - b)/a"], ["y = mx + b", "b", "b = y - mx"], ["A = P + Prt", "P", "P = A/(1 + rt)"],
];
const genLiteral: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  if (diff === "easy" || rng() < 0.35) {
    const r = randInt(20, 70), t = randInt(2, 6), l = randInt(3, 15), w = randInt(2, 12);
    return pick([
      { q: `Use d = rt. If d = ${r * t} miles and r = ${r} mph, find t.`, a: `${t} hours` },
      { q: `Use A = lw. If A = ${l * w} and l = ${l}, find w.`, a: `${w}` },
      { q: `Use P = 2l + 2w. If P = ${2 * l + 2 * w} and w = ${w}, find l.`, a: `${l}` },
    ]);
  }
  const [f, v, a] = pick(diff === "medium" ? LITERAL.slice(0, 8) : LITERAL);
  return { q: `Solve ${f} for ${v}.`, a };
};
const genAbsEq: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["simple", "shift"], medium: ["shift", "coef", "none"], hard: ["coef", "lt", "gt", "none"] }));
  const c = randInt(-8, 8), k = randInt(1, 12);
  if (kind === "simple") return { q: `Solve: |x| = ${k}`, a: `x = ${k} or x = -${k}` };
  if (kind === "shift") return { q: `Solve: |x${sgn(-c)}| = ${k}`, a: `x = ${c + k} or x = ${c - k}` };
  if (kind === "coef") { const a = randInt(2, 4), x1 = randInt(-6, 6), x2 = x1 - randInt(1, 6); /* |a x + b| = k with both roots integers */ const b = -a * (x1 + x2) / 2; if (Number.isInteger(b)) { const kk = a * (x1 - x2) / 2; return { q: `Solve: |${linExpr(a, b)}| = ${kk}`, a: `x = ${x1} or x = ${x2}` }; } return { q: `Solve: |x${sgn(-c)}| = ${k}`, a: `x = ${c + k} or x = ${c - k}` }; }
  if (kind === "none") return { q: `Solve: |x${sgn(-c)}| = -${k}`, a: "no solution" };
  if (kind === "lt") return { q: `Solve: |x${sgn(-c)}| < ${k}`, a: `${c - k} < x < ${c + k}` };
  return { q: `Solve: |x${sgn(-c)}| > ${k}`, a: `x < ${c - k} or x > ${c + k}` };
};
const genPointSlope: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const fracSlope = diff === "hard" && rng() < 0.5;
  const run = fracSlope ? pick([2, 3, 4]) : 1, rise = randInt(-6, 6) || 1;
  const m = frac(rise, run), x1 = run * randInt(-3, 3), b = randInt(-8, 8);
  const y1 = fVal(m) * x1 + b;
  const eq = lineStr(m, frac(b));
  if (rng() < 0.5) return { q: `Write the equation (y = mx + b) of the line with slope ${fStr(m)} through (${x1}, ${num(y1)}).`, a: eq };
  const x2 = x1 + run * randInt(1, 3), y2 = fVal(m) * x2 + b;
  return { q: `Write the equation (y = mx + b) of the line through (${x1}, ${num(y1)}) and (${x2}, ${num(y2)}).`, a: eq };
};
const genSystemsWord: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = randInt(5, 40), y = randInt(5, 40);
  const ta = randInt(6, 15), tc = randInt(2, ta - 1);
  const templates = [
    () => ({ q: `Two numbers add up to ${x + y} and their difference is ${Math.abs(x - y)}. What are the numbers?`, a: `${Math.max(x, y)} and ${Math.min(x, y)}` }),
    () => ({ q: `A theater sold ${x + y} tickets. Adult tickets cost $${ta} and child tickets cost $${tc}. Sales were $${ta * x + tc * y}. How many adult tickets were sold?`, a: `${x}` }),
    () => ({ q: `${pick(NAMES)} has ${x + y} coins, all dimes and quarters, worth ${money((10 * x + 25 * y) / 100)}. How many quarters are there?`, a: `${y}` }),
    () => { const p1 = randInt(2, 5), p2 = randInt(6, 9); return { q: `Apples cost $${p1} per bag and oranges cost $${p2} per bag. ${x + y} bags cost $${p1 * x + p2 * y}. How many bags of apples were bought?`, a: `${x}` }; },
    () => { const s = randInt(3, 8), c = randInt(1, s - 1); return { q: `A boat travels ${(s + c) * 3} km downstream in 3 hours and ${(s - c) * 3} km upstream in 3 hours. What is the speed of the boat in still water?`, a: `${s} km/h` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 2) : templates)();
};
const genFactorTrinomials: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const p = randInt(-9, 9) || 1, q = randInt(-9, 9) || -2;
  if (diff !== "hard") {
    const easyQ = diff === "easy" ? Math.abs(q) : q, easyP = diff === "easy" ? Math.abs(p) : p;
    const coeffs = polyMul([1, easyP], [1, easyQ]);
    const [s, t] = easyP <= easyQ ? [easyP, easyQ] : [easyQ, easyP];
    return { q: `Factor: ${poly(coeffs)}`, a: `${factor(1, s)}${factor(1, t)}` };
  }
  const a = randInt(2, 5), b = randInt(-7, 7) || 3;
  // (a x + b)(x + q), with gcd(a, b) = 1 so the factorization is complete
  let bb = b; while (gcdi(a, bb) !== 1) bb += 1;
  return { q: `Factor: ${poly(polyMul([a, bb], [1, q]))}`, a: `${factor(a, bb)}${factor(1, q)}` };
};
function gcdi(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }
const genSpecialFactoring: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["gcf", "dos"], medium: ["gcf", "dos", "pst"], hard: ["dos2", "pst2", "gcfDos"] }));
  const n = randInt(1, 12);
  if (kind === "gcf") { const g = randInt(2, 9), a = randInt(1, 6), b = randInt(1, 9) * (rng() < 0.5 ? -1 : 1); let bb = b; while (gcdi(a, bb) !== 1) bb += 1; return { q: `Factor out the GCF: ${poly([g * a, g * bb, 0])}`, a: `${g}x${factor(a, bb)}` }; }
  if (kind === "dos") return { q: `Factor: x^2 - ${n * n}`, a: `(x + ${n})(x - ${n})` };
  if (kind === "pst") { const s = rng() < 0.5 ? 1 : -1; return { q: `Factor: ${poly([1, 2 * s * n, n * n])}`, a: `(x ${s > 0 ? "+" : "-"} ${n})^2` }; }
  if (kind === "dos2") { const a = randInt(2, 7); return { q: `Factor: ${a * a}x^2 - ${n * n}`, a: `(${a}x + ${n})(${a}x - ${n})` }; }
  if (kind === "pst2") { const a = randInt(2, 5); return { q: `Factor: ${poly([a * a, 2 * a * n, n * n])}`, a: `(${a}x + ${n})^2` }; }
  const g = randInt(2, 5);
  return { q: `Factor completely: ${g}x^2 - ${g * n * n}`, a: `${g}(x + ${n})(x - ${n})` };
};

// ===================================================================== Geometry
const genParallelPerp: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const m = frac(randInt(-6, 6) || 2, pick([1, 1, 2, 3])), b = randInt(-9, 9);
  const perp = frac(-m.d, m.n);
  const kind = pick(by(diff, { easy: ["par", "perp"], medium: ["par", "perp", "which"], hard: ["which", "writePar", "writePerp"] }));
  if (kind === "par") return { q: `What is the slope of a line parallel to ${lineStr(m, frac(b))}?`, a: fStr(m) };
  if (kind === "perp") return { q: `What is the slope of a line perpendicular to ${lineStr(m, frac(b))}?`, a: fStr(perp) };
  if (kind === "which") {
    const other = pick([m, perp, frac(m.n + 1, m.d)]);
    const rel = other === m ? "parallel" : other === perp ? "perpendicular" : "neither";
    return { q: `Are ${lineStr(m, frac(b))} and ${lineStr(other, frac(b + 3))} parallel, perpendicular or neither?`, a: rel };
  }
  const slope = kind === "writePar" ? m : perp;
  const x0 = slope.d * randInt(-3, 3), b2 = b + (randInt(1, 6) * (rng() < 0.5 ? -1 : 1));
  const y0 = fVal(slope) * x0 + b2;
  return { q: `Write the equation of the line through (${x0}, ${num(y0)}) that is ${kind === "writePar" ? "parallel" : "perpendicular"} to ${lineStr(m, frac(b))}.`, a: lineStr(slope, frac(b2)) };
};
const genParallelAngles: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(35, 145);
  const pairs: [string, boolean][] = [["corresponding", true], ["alternate interior", true], ["alternate exterior", true], ["same-side interior", false]];
  const [name, equal] = pick(pairs);
  if (diff === "easy" || (diff === "medium" && rng() < 0.5)) return { q: `Two parallel lines are cut by a transversal. One angle is ${a}°. What is its ${name} angle?`, a: `${equal ? a : 180 - a}°` };
  const m = randInt(2, 5), x = randInt(8, 30), c = randInt(-10, 20);
  const angle = m * x + c;
  if (angle <= 10 || angle >= 170) return { q: `Two parallel lines are cut by a transversal. One angle is ${a}°. What is its ${name} angle?`, a: `${equal ? a : 180 - a}°` };
  return { q: `Parallel lines are cut by a transversal. A pair of ${name} angles measure (${linExpr(m, c)})° and ${equal ? angle : 180 - angle}°. Find x.`, a: `x = ${x}` };
};
const genSimilarTriangles: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [a, b, c] = pick(TRIPLES), k = randInt(2, 5);
  const kind = pick(by(diff, { easy: ["scale", "side"], medium: ["side", "perim", "scale"], hard: ["area", "side", "areaBack"] }));
  if (kind === "scale") return { q: `Triangle ABC has sides ${a}, ${b}, ${c}. A similar triangle has sides ${a * k}, ${b * k}, ${c * k}. What is the scale factor from ABC to the larger triangle?`, a: `${k}` };
  if (kind === "side") return { q: `Triangle ABC ~ triangle DEF. AB = ${a}, BC = ${b}, DE = ${a * k}. Find EF.`, a: `${b * k}` };
  if (kind === "perim") return { q: `Two similar triangles have a scale factor of ${k}. The smaller one has perimeter ${a + b + c}. What is the perimeter of the larger one?`, a: `${(a + b + c) * k}` };
  const area = (a * b) / 2;
  if (kind === "area") return { q: `Two similar triangles have a scale factor of ${k}. The smaller has area ${area} square units. What is the area of the larger?`, a: `${area * k * k} square units` };
  return { q: `The areas of two similar triangles are ${area} and ${area * k * k} square units. What is the scale factor of their sides?`, a: `${k}` };
};
const genSpecialRight: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const s = randInt(2, 12);
  const kind = pick(by(diff, { easy: ["45leg", "30short"], medium: ["45leg", "45hyp", "30short", "30hyp"], hard: ["45hyp", "30hyp", "30long", "45hypOdd"] }));
  if (kind === "45leg") return { q: `A 45-45-90 triangle has legs of length ${s}. How long is the hypotenuse?`, a: `${s}√2` };
  if (kind === "45hyp") return { q: `A 45-45-90 triangle has a hypotenuse of ${s}√2. How long is each leg?`, a: `${s}` };
  if (kind === "45hypOdd") return { q: `A 45-45-90 triangle has a hypotenuse of ${s}. How long is each leg? (simplest radical form)`, a: s % 2 === 0 ? `${s / 2 === 1 ? "" : s / 2}√2` : `${s}√2/2` };
  if (kind === "30short") return { q: `In a 30-60-90 triangle the shorter leg is ${s}. Find the longer leg and the hypotenuse.`, a: `longer leg ${s}√3, hypotenuse ${2 * s}` };
  if (kind === "30hyp") return { q: `In a 30-60-90 triangle the hypotenuse is ${2 * s}. Find the shorter leg and the longer leg.`, a: `shorter leg ${s}, longer leg ${s}√3` };
  return { q: `In a 30-60-90 triangle the longer leg is ${s}√3. How long is the hypotenuse?`, a: `${2 * s}` };
};
const genTrigSolve: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const A = randInt(15, 75), side = randInt(5, 30);
  const kind = pick(by(diff, { easy: ["opp", "adj"], medium: ["opp", "adj", "hyp"], hard: ["hyp", "angle", "angle2", "elev"] }));
  if (kind === "opp") return { q: `In a right triangle, angle A = ${A}° and the hypotenuse is ${side}. Find the side opposite A, to 1 decimal place.`, a: num(round(side * Math.sin(deg(A)), 1)) };
  if (kind === "adj") return { q: `In a right triangle, angle A = ${A}° and the hypotenuse is ${side}. Find the side adjacent to A, to 1 decimal place.`, a: num(round(side * Math.cos(deg(A)), 1)) };
  if (kind === "hyp") return { q: `In a right triangle, angle A = ${A}° and the side opposite A is ${side}. Find the hypotenuse, to 1 decimal place.`, a: num(round(side / Math.sin(deg(A)), 1)) };
  const [a, b] = [randInt(3, 20), randInt(3, 20)];
  if (kind === "angle") return { q: `A right triangle has legs ${a} (opposite angle A) and ${b} (adjacent to A). Find angle A to the nearest degree.`, a: `${Math.round((Math.atan(a / b) * 180) / Math.PI)}°` };
  if (kind === "angle2") { const h = Math.max(a, b) + randInt(1, 10); return { q: `In a right triangle, the side opposite angle A is ${Math.min(a, b)} and the hypotenuse is ${h}. Find angle A to the nearest degree.`, a: `${Math.round((Math.asin(Math.min(a, b) / h) * 180) / Math.PI)}°` }; }
  return { q: `From ${side} m away from the base of a tree, the angle of elevation to its top is ${A}°. How tall is the tree, to 1 decimal place?`, a: `${num(round(side * Math.tan(deg(A)), 1))} m` };
};
const NICE_N = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
const genPolygonAngles: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const n = pick(diff === "easy" ? [3, 4, 5, 6, 8, 10] : NICE_N);
  const kind = pick(by(diff, { easy: ["sum", "ext"], medium: ["sum", "each", "ext"], hard: ["each", "fromExt", "fromInt", "fromSum"] }));
  if (kind === "sum") return { q: `What is the sum of the interior angles of a ${n}-sided polygon?`, a: `${(n - 2) * 180}°` };
  if (kind === "each") return { q: `What is each interior angle of a regular ${n}-sided polygon?`, a: `${num(180 - 360 / n)}°` };
  if (kind === "ext") return { q: `What is each exterior angle of a regular ${n}-sided polygon?`, a: `${num(360 / n)}°` };
  if (kind === "fromExt") return { q: `Each exterior angle of a regular polygon is ${360 / n}°. How many sides does it have?`, a: `${n}` };
  if (kind === "fromInt") return { q: `Each interior angle of a regular polygon is ${180 - 360 / n}°. How many sides does it have?`, a: `${n}` };
  return { q: `The interior angles of a polygon add up to ${(n - 2) * 180}°. How many sides does it have?`, a: `${n}` };
};
const genArcSector: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const theta = pick([30, 45, 60, 72, 90, 120, 135, 150, 180, 210, 240, 270, 300]), r = randInt(2, 12);
  const kind = pick(by(diff, { easy: ["arc", "sector"], medium: ["arc", "sector", "circ"], hard: ["arc", "sector", "angleFromArc", "rad"] }));
  if (kind === "arc") return { q: `Find the length of an arc with central angle ${theta}° in a circle of radius ${r}. Leave your answer in terms of π.`, a: piStr(frac(theta * r, 180)) };
  if (kind === "sector") return { q: `Find the area of a sector with central angle ${theta}° in a circle of radius ${r}. Leave your answer in terms of π.`, a: piStr(frac(theta * r * r, 360)) };
  if (kind === "circ") return { q: `A circle has radius ${r}. What fraction of the circumference is an arc with central angle ${theta}°?`, a: fStr(frac(theta, 360)) };
  if (kind === "rad") { const t = frac(theta, 180); return { q: `Find the arc length for a central angle of ${piStr(t)} radians in a circle of radius ${r}. Leave your answer in terms of π.`, a: piStr(fMul(t, frac(r))) }; }
  return { q: `An arc in a circle of radius ${r} has length ${piStr(frac(theta * r, 180))}. What is its central angle in degrees?`, a: `${theta}°` };
};
const sq = (v: string, h: number) => (h === 0 ? `${v}^2` : `(${v}${sgn(-h)})^2`);
const genCircleEquation: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(-8, 8), k = randInt(-8, 8), r = randInt(1, 10);
  const eq = `${sq("x", h)} + ${sq("y", k)} = ${r * r}`;
  const kind = pick(by(diff, { easy: ["write", "center"], medium: ["write", "center", "radius"], hard: ["write", "fromDiameter", "onCircle", "radius"] }));
  if (kind === "write") return { q: `Write the equation of the circle with center (${h}, ${k}) and radius ${r}.`, a: eq };
  if (kind === "center") return { q: `What is the center of the circle ${eq}?`, a: `(${h}, ${k})` };
  if (kind === "radius") return { q: `What is the radius of the circle ${eq}?`, a: `${r}` };
  if (kind === "fromDiameter") { const [a, b, c] = pick(TRIPLES); return { q: `A diameter of a circle has endpoints (${h - a}, ${k - b}) and (${h + a}, ${k + b}). Write the equation of the circle.`, a: `${sq("x", h)} + ${sq("y", k)} = ${c * c}` }; }
  const [a, b, c] = pick(TRIPLES);
  const on = rng() < 0.5;
  return { q: `Is the point (${h + a}, ${k + (on ? b : b + 1)}) on the circle ${sq("x", h)} + ${sq("y", k)} = ${c * c}? Answer yes or no.`, a: on ? "yes" : "no" };
};
const genSurfaceAreaSolids: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const unit = pick(["cm", "m", "in"]);
  const kind = pick(by(diff, { easy: ["sphere", "cyl"], medium: ["sphere", "cyl", "cone"], hard: ["cone", "hemi", "cylMissing"] }));
  const r = randInt(1, 10), h = randInt(1, 12);
  if (kind === "sphere") return { q: `Find the surface area of a sphere with radius ${r} ${unit}, in terms of π.`, a: `${4 * r * r}π ${unit}²` };
  if (kind === "cyl") return { q: `Find the total surface area of a cylinder with radius ${r} ${unit} and height ${h} ${unit}, in terms of π.`, a: `${2 * r * r + 2 * r * h}π ${unit}²` };
  if (kind === "cone") { const [a, b, c] = pick(TRIPLES); return { q: `A cone has radius ${a} ${unit} and height ${b} ${unit}. Find its total surface area in terms of π. (Hint: find the slant height first.)`, a: `${a * a + a * c}π ${unit}²` }; }
  if (kind === "hemi") return { q: `Find the total surface area of a solid hemisphere (curved surface plus flat base) of radius ${r} ${unit}, in terms of π.`, a: `${3 * r * r}π ${unit}²` };
  return { q: `A cylinder has radius ${r} ${unit} and total surface area ${2 * r * r + 2 * r * h}π ${unit}². What is its height?`, a: `${h} ${unit}` };
};

// ===================================================================== Algebra II
const genFunctionOps: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(-5, 5) || 2, b = randInt(-9, 9), c = randInt(-5, 5) || 3, d = randInt(-9, 9), x = randInt(-4, 4);
  const f = (t: number) => a * t + b, g = (t: number) => c * t + d;
  const fs = linExpr(a, b), gs = linExpr(c, d);
  const kind = pick(by(diff, { easy: ["sum", "prodAt"], medium: ["compAt", "sum", "prodAt"], hard: ["compExpr", "compAt", "quadComp"] }));
  if (kind === "sum") return { q: `f(x) = ${fs} and g(x) = ${gs}. Find (f + g)(x).`, a: linExpr(a + c, b + d) };
  if (kind === "prodAt") return { q: `f(x) = ${fs} and g(x) = ${gs}. Find (f · g)(${x}).`, a: `${f(x) * g(x)}` };
  if (kind === "compAt") return { q: `f(x) = ${fs} and g(x) = ${gs}. Find f(g(${x})).`, a: `${f(g(x))}` };
  if (kind === "compExpr") return { q: `f(x) = ${fs} and g(x) = ${gs}. Find f(g(x)).`, a: linExpr(a * c, a * d + b) };
  return { q: `f(x) = x^2${sgn(b)} and g(x) = ${gs}. Find f(g(${x})).`, a: `${g(x) * g(x) + b}` };
};
const genInverse: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, 9) * (rng() < 0.3 ? -1 : 1), b = randInt(-12, 12) || 4;
  const kind = pick(by(diff, { easy: ["fromPoint", "evalInv"], medium: ["formula", "evalInv"], hard: ["formula", "cube", "evalInv"] }));
  if (kind === "fromPoint") { const x = randInt(-5, 9), y = randInt(-9, 20); return { q: `f(${x}) = ${y}. What is f⁻¹(${y})?`, a: `${x}` }; }
  if (kind === "evalInv") { const x = randInt(-6, 6); return { q: `f(x) = ${linExpr(a, b)}. Find f⁻¹(${a * x + b}).`, a: `${x}` }; }
  if (kind === "cube") return { q: `Find the inverse of f(x) = x^3${sgn(b)}.`, a: `f⁻¹(x) = ∛(x${sgn(-b)})` };
  return { q: `Find the inverse of f(x) = ${linExpr(a, b)}.`, a: `f⁻¹(x) = (x${sgn(-b)})/${a < 0 ? `(${a})` : a}` };
};
const genFunctionTransformations: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(-7, 7) || 2, k = randInt(-7, 7) || -3;
  const hp = h > 0 ? `right ${h}` : `left ${-h}`, kp = k > 0 ? `up ${k}` : `down ${-k}`;
  const inside = `x${sgn(-h)}`;
  const kind = pick(by(diff, { easy: ["vertex", "shiftUp"], medium: ["vertex", "describe", "abs"], hard: ["describe", "reflect", "write", "stretch"] }));
  if (kind === "vertex") return { q: `What is the vertex of y = (${inside})^2${sgn(k)}?`, a: `(${h}, ${k})` };
  if (kind === "shiftUp") return { q: `The graph of g(x) = f(x)${sgn(k)} is the graph of f shifted how?`, a: kp };
  if (kind === "abs") return { q: `Describe how y = |${inside}|${sgn(k)} is moved from y = |x|.`, a: `${hp}, ${kp}` };
  if (kind === "describe") return { q: `Describe how y = √(${inside})${sgn(k)} is moved from y = √x.`, a: `${hp}, ${kp}` };
  if (kind === "reflect") return pick([{ q: "What transformation turns y = f(x) into y = -f(x)?", a: "a reflection across the x-axis" }, { q: "What transformation turns y = f(x) into y = f(-x)?", a: "a reflection across the y-axis" }]);
  if (kind === "stretch") { const a = randInt(2, 5); return { q: `What does the 'a' do in y = ${a}f(x)?`, a: `a vertical stretch by a factor of ${a}` }; }
  return { q: `Write the equation of y = x^2 shifted ${hp} and ${kp}.`, a: `y = (${inside})^2${sgn(k)}` };
};
const genComplex: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(-9, 9), b = randInt(-9, 9) || 2, c = randInt(-9, 9), d = randInt(-9, 9) || -3;
  const kind = pick(by(diff, { easy: ["add", "sub", "sqrtNeg"], medium: ["add", "mul", "powI", "sqrtNeg"], hard: ["mul", "conjMul", "powI", "modulus"] }));
  const z1 = `(${complexStr(a, b)})`, z2 = `(${complexStr(c, d)})`;
  if (kind === "add") return { q: `Simplify: ${z1} + ${z2}`, a: complexStr(a + c, b + d) };
  if (kind === "sub") return { q: `Simplify: ${z1} - ${z2}`, a: complexStr(a - c, b - d) };
  if (kind === "mul") return { q: `Simplify: ${z1}${z2}`, a: complexStr(a * c - b * d, a * d + b * c) };
  if (kind === "conjMul") return { q: `Simplify: ${z1}(${complexStr(a, -b)})`, a: `${a * a + b * b}` };
  if (kind === "sqrtNeg") { const n = pick([4, 9, 16, 25, 36, 49, 64, 81, 100, 8, 12, 18, 20, 50]); const r = radical(n); return { q: `Simplify: √-${n}`, a: /√/.test(r) ? r.replace("√", "i√") : `${r}i` }; }
  if (kind === "powI") { const n = randInt(5, 99); return { q: `Simplify: i^${n}`, a: ["1", "i", "-1", "-i"][n % 4] }; }
  const [p, q, r] = pick(TRIPLES);
  return { q: `Find the modulus |${complexStr(p, q)}|.`, a: `${r}` };
};
const genCompletingSquare: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(-8, 8) || 3, k = randInt(-20, 20);
  // x² + bx + c with b = -2h, c = h² + k  →  (x − h)² + k
  const b = -2 * h, c = h * h + k;
  const kind = pick(by(diff, { easy: ["fill"], medium: ["fill", "vertexForm"], hard: ["vertexForm", "solve", "vertex"] }));
  if (kind === "fill") return { q: `What number completes the square: x^2${sgn(b)}x + __ ?`, a: `${h * h}` };
  if (kind === "vertexForm") return { q: `Write ${poly([1, b, c])} in vertex form by completing the square.`, a: `(x${sgn(-h)})^2${k === 0 ? "" : sgn(k)}` };
  if (kind === "vertex") return { q: `Find the vertex of y = ${poly([1, b, c])} by completing the square.`, a: `(${h}, ${k})` };
  const s = randInt(1, 9), c2 = h * h - s * s;
  return { q: `Solve by completing the square: ${poly([1, b, c2])} = 0`, a: `x = ${h + s} or x = ${h - s}` };
};
const genPolyRemainder: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(-4, 4) || 2;
  const kind = pick(by(diff, { easy: ["rem2"], medium: ["rem2", "rem3", "isFactor"], hard: ["rem3", "isFactor", "quotient"] }));
  const coeffs = kind === "rem2" ? [1, randInt(-9, 9), randInt(-9, 9)] : [randInt(1, 3), randInt(-6, 6), randInt(-9, 9), randInt(-9, 9)];
  if (kind === "rem2" || kind === "rem3") return { q: `Use the remainder theorem: what is the remainder when ${poly(coeffs)} is divided by ${factor(1, -a)}?`, a: `${polyAt(coeffs, a)}` };
  if (kind === "isFactor") { const r = randInt(-6, 6) || 1, s = randInt(-6, 6); const p = polyMul([1, -r], [1, -s]); const test = rng() < 0.5 ? r : r + randInt(1, 3); return { q: `Is ${factor(1, -test)} a factor of ${poly(p)}? Answer yes or no.`, a: polyAt(p, test) === 0 ? "yes" : "no" }; }
  const r = randInt(-6, 6) || 2, s = randInt(-6, 6);
  return { q: `Divide: (${poly(polyMul([1, -r], [1, -s]))}) ÷ ${factor(1, -r)}`, a: linExpr(1, -s) };
};
const genPolyZeros: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const roots = [randInt(-6, 6), randInt(-6, 6), randInt(-6, 6)];
  const kind = pick(by(diff, { easy: ["zeros2"], medium: ["zeros3", "count"], hard: ["mult", "expand", "count"] }));
  const fct = (r: number) => factor(1, -r);
  if (kind === "zeros2") { const rs = roots.slice(0, 2); return { q: `Find the zeros of f(x) = ${rs.map(fct).join("")}.`, a: [...new Set(rs)].sort((p, q) => p - q).join(", ") }; }
  if (kind === "zeros3") return { q: `Find the zeros of f(x) = ${roots.map(fct).join("")}.`, a: [...new Set(roots)].sort((p, q) => p - q).join(", ") };
  if (kind === "count") { const n = randInt(2, 7); return { q: `How many complex zeros (counting multiplicity) does a polynomial of degree ${n} have?`, a: `${n}` }; }
  if (kind === "expand") { const rs = roots.slice(0, 2); if (rs[0] === rs[1]) rs[1] += 1; return { q: `Write a polynomial in standard form with leading coefficient 1 and zeros ${rs[0]} and ${rs[1]}.`, a: `f(x) = ${poly(polyMul([1, -rs[0]], [1, -rs[1]]))}` }; }
  let r1 = roots[0], r2 = roots[1]; if (r1 === r2) r2 += 1;
  return { q: `f(x) = ${fct(r1)}^2${fct(r2)}. List each zero with its multiplicity.`, a: `${r1} (multiplicity 2), ${r2} (multiplicity 1)` };
};
const genLogProperties: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const b = pick([2, 3, 5, 10]);
  const kind = pick(by(diff, { easy: ["eval", "sum"], medium: ["sum", "diff", "expand", "condense"], hard: ["power", "expand", "condense", "change"] }));
  const e1 = randInt(1, b === 10 ? 3 : 4), e2 = randInt(1, b === 10 ? 3 : 3);
  const lg = (x: string | number) => (b === 10 ? `log ${x}` : `log_${b} ${x}`);
  if (kind === "eval") return { q: `Evaluate: ${lg(Math.pow(b, e1))}`, a: `${e1}` };
  if (kind === "sum") return { q: `Evaluate: ${lg(Math.pow(b, e1))} + ${lg(Math.pow(b, e2))}`, a: `${e1 + e2}` };
  if (kind === "diff") { const big = Math.pow(b, e1 + e2), small = Math.pow(b, e2); return { q: `Evaluate: ${lg(big * 7)} - ${lg(small * 7)}`, a: `${e1}` }; }
  if (kind === "power") { const k = randInt(2, 5); return { q: `Evaluate: ${k}·${lg(Math.pow(b, e1))}`, a: `${k * e1}` }; }
  const p = randInt(2, 4);
  if (kind === "expand") return { q: `Expand: ${lg(`(x^${p}y)`)}`, a: `${p}${lg("x")} + ${lg("y")}` };
  if (kind === "condense") return { q: `Write as a single logarithm: ${p}${lg("x")} - ${lg("y")}`, a: lg(`(x^${p}/y)`) };
  const n = randInt(3, 50);
  return { q: `Use the change-of-base formula to find log_${b === 10 ? 2 : b} ${n}, to 2 decimal places.`, a: num(round(Math.log(n) / Math.log(b === 10 ? 2 : b), 2)) };
};
const genExpEquations: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["same"], medium: ["same", "shift", "neg"], hard: ["rebase", "log", "shift"] }));
  const b = pick([2, 3, 5]), x = randInt(1, b === 2 ? 6 : 4);
  if (kind === "same") return { q: `Solve: ${b}^x = ${Math.pow(b, x)}`, a: `x = ${x}` };
  if (kind === "shift") { const c = randInt(1, 3); return { q: `Solve: ${b}^(x + ${c}) = ${Math.pow(b, x + c)}`, a: `x = ${x}` }; }
  if (kind === "neg") return { q: `Solve: ${b}^x = 1/${Math.pow(b, x)}`, a: `x = -${x}` };
  if (kind === "rebase") { const [B1, B2, p, q] = pick([[4, 8, 2, 3], [9, 27, 2, 3], [8, 4, 3, 2], [25, 125, 2, 3], [4, 32, 2, 5]] as const); return { q: `Solve: ${B1}^x = ${B2}`, a: `x = ${fStr(frac(q, p))}` }; }
  let n = randInt(3, 99);
  while (Number.isInteger(round(Math.log(n) / Math.log(b), 9))) n++;
  return { q: `Solve: ${b}^x = ${n}. Give x to 2 decimal places.`, a: `x ≈ ${num(round(Math.log(n) / Math.log(b), 2))}` };
};
const genRationalExpressions: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const p = randInt(-8, 8) || 2, q = randInt(-8, 8) || -3;
  const kind = pick(by(diff, { easy: ["dos", "excluded"], medium: ["tri", "dos", "excluded"], hard: ["tri2", "mul", "tri"] }));
  if (kind === "dos") { const n = Math.abs(p); return { q: `Simplify: (x^2 - ${n * n})/(x + ${n})`, a: `x - ${n}` }; }
  if (kind === "excluded") { const r = q === p ? q + 1 : q; return { q: `What values of x make (x + 1)/(${poly(polyMul([1, -p], [1, -r]))}) undefined?`, a: [p, r].sort((a, b) => a - b).map((v) => `x = ${v}`).join(" and ") }; }
  if (kind === "tri") return { q: `Simplify: (${poly(polyMul([1, -p], [1, -q]))})/(${linExpr(1, -p)})`, a: linExpr(1, -q) };
  const r = randInt(-8, 8) || 5;
  if (kind === "tri2" && p !== r && q !== r) return { q: `Simplify: (${poly(polyMul([1, -p], [1, -q]))})/(${poly(polyMul([1, -p], [1, -r]))})`, a: `(${linExpr(1, -q)})/(${linExpr(1, -r)})` };
  const k = randInt(2, 6);
  return { q: `Simplify: (${k}x)/(${linExpr(1, -p)}) · (${linExpr(1, -p)})/(${k * 2}x^2)`, a: `1/(2x)` };
};
const genRadicalEquations: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["simple"], medium: ["simple", "coef", "none"], hard: ["extraneous", "coef", "both"] }));
  if (kind === "simple") { const b = randInt(1, 12), a = randInt(-10, 10); return { q: `Solve: √(x${sgn(a)}) = ${b}`, a: `x = ${b * b - a}` }; }
  if (kind === "coef") { const k = randInt(2, 4), b = randInt(1, 9), c = randInt(-8, 8); const x = (b * b - c) / k; if (Number.isInteger(x)) return { q: `Solve: √(${linExpr(k, c)}) = ${b}`, a: `x = ${x}` }; return { q: `Solve: √(x${sgn(c)}) = ${b}`, a: `x = ${b * b - c}` }; }
  if (kind === "none") { const b = randInt(1, 9); return { q: `Solve: √(x + ${randInt(1, 9)}) = -${b}`, a: "no solution" }; }
  if (kind === "both") { const b = randInt(1, 9), d = randInt(1, 9); return { q: `Solve: √(x + ${d}) + ${b} = ${2 * b}`, a: `x = ${b * b - d}` }; }
  // √(x + c) = x with roots r and 1 − r; the negative one is extraneous
  const r = randInt(2, 7), c = r * r - r;
  return { q: `Solve: √(x + ${c}) = x. Check for extraneous solutions.`, a: `x = ${r} (x = ${1 - r} is extraneous)` };
};
/** "-5 - 4 - 3 + ..." rather than "-5 + -4 + -3 + ..." */
const seriesStr = (terms: number[]) => `with terms ${terms.join(", ")}, ...`;
const genSeriesSum: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["arith", "sigma"], medium: ["arith", "geo", "sigma"], hard: ["geo", "infinite", "sigma", "arithN"] }));
  if (kind === "arith") { const a1 = randInt(-5, 10), d = randInt(1, 6), n = randInt(8, 25); return { q: `Find the sum of the first ${n} terms of the arithmetic series ${seriesStr([a1, a1 + d, a1 + 2 * d])}`, a: `${(n * (2 * a1 + (n - 1) * d)) / 2}` }; }
  if (kind === "arithN") { const a1 = randInt(1, 10), d = randInt(2, 5), n = randInt(10, 30), an = a1 + (n - 1) * d; return { q: `Find the sum: ${a1} + ${a1 + d} + ${a1 + 2 * d} + ... + ${an}`, a: `${(n * (a1 + an)) / 2}` }; }
  if (kind === "geo") { const a1 = randInt(1, 5), r = pick([2, 3, -2]), n = randInt(4, 8); return { q: `Find the sum of the first ${n} terms of the geometric series ${seriesStr([a1, a1 * r, a1 * r * r])}`, a: `${(a1 * (Math.pow(r, n) - 1)) / (r - 1)}` }; }
  if (kind === "infinite") { const a1 = randInt(2, 30), r = pick([frac(1, 2), frac(1, 3), frac(1, 4), frac(2, 3), frac(-1, 2)]); return { q: `Find the sum of the infinite geometric series with first term ${a1} and common ratio ${fStr(r)}.`, a: fStr(frac(a1 * r.d, r.d - r.n)) }; }
  const a = randInt(1, 5), c = randInt(-3, 5), n = randInt(4, 10);
  let s = 0; for (let k = 1; k <= n; k++) s += a * k + c;
  return { q: `Evaluate: Σ (k = 1 to ${n}) of (${linExpr(a, c, "k")})`, a: `${s}` };
};
type Special = { d: number; sin: string; cos: string; tan: string };
const SPECIAL: Special[] = (() => {
  const base: Record<number, [string, string, string]> = { 0: ["0", "1", "0"], 30: ["1/2", "√3/2", "√3/3"], 45: ["√2/2", "√2/2", "1"], 60: ["√3/2", "1/2", "√3"], 90: ["1", "0", "undefined"] };
  const neg = (s: string) => (s === "0" ? "0" : s === "undefined" ? s : s.startsWith("-") ? s.slice(1) : `-${s}`);
  const out: Special[] = [];
  for (let d = 0; d < 360; d += 15) {
    const ref = d % 90 === 0 ? (d % 180 === 0 ? 0 : 90) : d < 90 ? d : d < 180 ? 180 - d : d < 270 ? d - 180 : 360 - d;
    if (!base[ref]) continue;
    const [s0, c0, t0] = base[ref];
    const sinNeg = d > 180, cosNeg = d > 90 && d < 270;
    const sinV = d === 180 ? "0" : sinNeg ? neg(s0) : s0;
    const cosV = d === 90 || d === 270 ? "0" : cosNeg ? neg(c0) : c0;
    const tanV = d === 90 || d === 270 ? "undefined" : d === 0 || d === 180 ? "0" : sinNeg !== cosNeg ? neg(t0) : t0;
    out.push({ d, sin: d === 270 ? "-1" : sinV, cos: d === 180 ? "-1" : cosV, tan: tanV });
  }
  return out;
})();
const genUnitCircle: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const s = pick(diff === "easy" ? SPECIAL.filter((x) => x.d <= 90) : SPECIAL);
  const kind = pick(by(diff, { easy: ["toRad", "toDeg", "trig"], medium: ["toRad", "toDeg", "trig", "quad"], hard: ["trigRad", "trig", "ref", "quad"] }));
  const rad = piStr(frac(s.d, 180));
  const fn = pick(["sin", "cos", "tan"] as const);
  if (kind === "toRad") return { q: `Convert ${s.d}° to radians.`, a: s.d === 0 ? "0" : rad };
  if (kind === "toDeg") return { q: `Convert ${s.d === 0 ? "0" : rad} radians to degrees.`, a: `${s.d}°` };
  if (kind === "trig") return { q: `Find the exact value of ${fn}(${s.d}°).`, a: s[fn] };
  if (kind === "trigRad") return { q: `Find the exact value of ${fn}(${s.d === 0 ? "0" : rad}).`, a: s[fn] };
  if (kind === "ref") { const t = pick(SPECIAL.filter((x) => x.d % 90 !== 0)); const r = t.d < 90 ? t.d : t.d < 180 ? 180 - t.d : t.d < 270 ? t.d - 180 : 360 - t.d; return { q: `What is the reference angle for ${t.d}°?`, a: `${r}°` }; }
  const t = pick(SPECIAL.filter((x) => x.d % 90 !== 0));
  return { q: `In which quadrant does a ${t.d}° angle in standard position lie?`, a: `Quadrant ${["I", "II", "III", "IV"][Math.floor(t.d / 90)]}` };
};
const genStdDev: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const mu = randInt(5, 20) * 5, sigma = randInt(2, 10);
  const kind = pick(by(diff, { easy: ["z", "rule"], medium: ["z", "fromZ", "rule"], hard: ["sd", "fromZ", "ruleRange", "z"] }));
  if (kind === "z") { const z = randInt(-6, 6) / 2; return { q: `Test scores have mean ${mu} and standard deviation ${sigma}. What is the z-score of a score of ${num(mu + z * sigma)}?`, a: num(z) }; }
  if (kind === "fromZ") { const z = randInt(-6, 6) / 2; return { q: `Heights have mean ${mu} cm and standard deviation ${sigma} cm. What height has a z-score of ${num(z)}?`, a: `${num(mu + z * sigma)} cm` }; }
  if (kind === "rule") { const k = pick([1, 2, 3]); return { q: `In a normal distribution, about what percent of data lies within ${k} standard deviation${k > 1 ? "s" : ""} of the mean?`, a: ["68%", "95%", "99.7%"][k - 1] }; }
  if (kind === "ruleRange") return { q: `Scores are normally distributed with mean ${mu} and standard deviation ${sigma}. About 95% of scores lie between which two values?`, a: `${mu - 2 * sigma} and ${mu + 2 * sigma}` };
  const data = pick([[2, 4, 4, 4, 5, 5, 7, 9], [1, 3, 5, 7, 9], [10, 12, 14, 16, 18], [6, 6, 8, 10, 10]]);
  const m = data.reduce((s, v) => s + v, 0) / data.length;
  const sd = Math.sqrt(data.reduce((s, v) => s + (v - m) * (v - m), 0) / data.length);
  return { q: `Find the population standard deviation of: ${data.join(", ")} (to 2 decimal places)`, a: num(round(sd, 2)) };
};

// ===================================================================== Precalculus & calculus preview
const genTrigEquations: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["pyth", "fromTriple"], medium: ["fromTriple", "solve", "pyth"], hard: ["solve", "solve2", "tanFrom"] }));
  if (kind === "pyth") return pick([{ q: "Simplify: sin²θ + cos²θ", a: "1" }, { q: "Simplify: 1 - sin²θ", a: "cos²θ" }, { q: "Simplify: 1 - cos²θ", a: "sin²θ" }, { q: "Simplify: sin θ / cos θ", a: "tan θ" }]);
  const [a, b, c] = pick(TRIPLES);
  if (kind === "fromTriple") return { q: `If sin θ = ${fStr(frac(a, c))} and θ is in Quadrant I, find cos θ.`, a: fStr(frac(b, c)) };
  if (kind === "tanFrom") return { q: `If cos θ = ${fStr(frac(b, c))} and θ is in Quadrant IV, find tan θ.`, a: `-${fStr(frac(a, b))}` };
  const fn = pick(["sin", "cos", "tan"] as const);
  const targets = [...new Set(SPECIAL.map((s) => s[fn]))].filter((v) => v !== "undefined");
  const v = pick(targets);
  const sols = SPECIAL.filter((s) => s[fn] === v).map((s) => `${s.d}°`);
  if (kind === "solve2" && /^-?1\/2$|^-?√[23]\/2$/.test(v)) { const k = v.startsWith("-") ? "-2" : "2"; const inner = v.replace(/^-/, "").replace("/2", ""); return { q: `Solve for 0° ≤ x < 360°: ${k} ${fn} x = ${inner}`, a: sols.join(", ") }; }
  return { q: `Solve for 0° ≤ x < 360°: ${fn} x = ${v}`, a: sols.join(", ") };
};
const genLawSinesCosines: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(5, 20), b = randInt(5, 20), C = randInt(25, 140);
  const kind = pick(by(diff, { easy: ["area"], medium: ["cos", "area", "sin"], hard: ["cos", "sin", "angleCos"] }));
  if (kind === "area") return { q: `Find the area of a triangle with sides ${a} and ${b} and an included angle of ${C}°, to 1 decimal place.`, a: num(round(0.5 * a * b * Math.sin(deg(C)), 1)) };
  if (kind === "cos") return { q: `In triangle ABC, a = ${a}, b = ${b} and C = ${C}°. Use the law of cosines to find c, to 1 decimal place.`, a: num(round(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(deg(C))), 1)) };
  if (kind === "sin") { const A = randInt(25, 70), B = randInt(25, 170 - A - 10); return { q: `In triangle ABC, A = ${A}°, B = ${B}° and a = ${a}. Use the law of sines to find b, to 1 decimal place.`, a: num(round((a * Math.sin(deg(B))) / Math.sin(deg(A)), 1)) }; }
  const c = randInt(Math.abs(a - b) + 1, a + b - 1);
  return { q: `A triangle has sides a = ${a}, b = ${b} and c = ${c}. Find angle C to the nearest degree.`, a: `${Math.round((Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180) / Math.PI)}°` };
};
const vec = (x: number, y: number) => `<${x}, ${y}>`;
const genVectors: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(-9, 9), b = randInt(-9, 9), c = randInt(-9, 9), d = randInt(-9, 9);
  const kind = pick(by(diff, { easy: ["add", "scalar"], medium: ["add", "mag", "dot", "sub"], hard: ["mag2", "dot", "perp", "combo"] }));
  if (kind === "add") return { q: `u = ${vec(a, b)}, v = ${vec(c, d)}. Find u + v.`, a: vec(a + c, b + d) };
  if (kind === "sub") return { q: `u = ${vec(a, b)}, v = ${vec(c, d)}. Find u - v.`, a: vec(a - c, b - d) };
  if (kind === "scalar") { const k = pick([-3, -2, 2, 3, 4, 5]); return { q: `u = ${vec(a, b)}. Find ${k}u.`, a: vec(k * a, k * b) }; }
  if (kind === "mag") { const [p, q, r] = pick(TRIPLES); return { q: `Find the magnitude of ${vec(p * (rng() < 0.5 ? -1 : 1), q)}.`, a: `${r}` }; }
  if (kind === "mag2") return { q: `Find the magnitude of ${vec(a, b)}, in simplest radical form.`, a: radical(a * a + b * b) };
  if (kind === "dot") return { q: `Find the dot product of ${vec(a, b)} and ${vec(c, d)}.`, a: `${a * c + b * d}` };
  if (kind === "perp") {
    const p = a || 2, q = b || 3, k = randInt(1, 3);
    const v = rng() < 0.5 ? [-k * q, k * p] : [k * q, k * p + randInt(1, 3)];
    return { q: `Are ${vec(p, q)} and ${vec(v[0], v[1])} perpendicular? Answer yes or no.`, a: p * v[0] + q * v[1] === 0 ? "yes" : "no" };
  }
  return { q: `u = ${vec(a, b)}, v = ${vec(c, d)}. Find 2u - 3v.`, a: vec(2 * a - 3 * c, 2 * b - 3 * d) };
};
const mat = (m: number[][]) => `[${m.map((r) => `[${r.join(", ")}]`).join(", ")}]`;
const genMatrices: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const r = () => randInt(-6, 9);
  const A = [[r(), r()], [r(), r()]], B = [[r(), r()], [r(), r()]];
  const kind = pick(by(diff, { easy: ["add", "scalar"], medium: ["add", "det", "mul", "sub"], hard: ["mul", "det", "inverseExists", "mulVec"] }));
  if (kind === "add") return { q: `A = ${mat(A)}, B = ${mat(B)}. Find A + B.`, a: mat(A.map((row, i) => row.map((v, j) => v + B[i][j]))) };
  if (kind === "sub") return { q: `A = ${mat(A)}, B = ${mat(B)}. Find A - B.`, a: mat(A.map((row, i) => row.map((v, j) => v - B[i][j]))) };
  if (kind === "scalar") { const k = randInt(-3, 4) || 2; return { q: `A = ${mat(A)}. Find ${k}A.`, a: mat(A.map((row) => row.map((v) => k * v))) }; }
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (kind === "det") return { q: `Find the determinant of ${mat(A)}.`, a: `${det}` };
  if (kind === "inverseExists") return { q: `Does ${mat(A)} have an inverse? Answer yes or no.`, a: det !== 0 ? "yes" : "no" };
  if (kind === "mulVec") { const v = [r(), r()]; return { q: `A = ${mat(A)}. Find A times the column vector [${v[0]}, ${v[1]}].`, a: `[${A[0][0] * v[0] + A[0][1] * v[1]}, ${A[1][0] * v[0] + A[1][1] * v[1]}]` }; }
  const P = [0, 1].map((i) => [0, 1].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
  return { q: `A = ${mat(A)}, B = ${mat(B)}. Find AB.`, a: mat(P) };
};
const genPermComb: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(5, 12), k = randInt(2, Math.min(4, n - 1));
  const kind = pick(by(diff, { easy: ["nPr", "nCr"], medium: ["nPr", "nCr", "wordP", "wordC"], hard: ["wordP", "wordC", "mixed", "letters"] }));
  if (kind === "nPr") return { q: `Evaluate: ${n}P${k}`, a: `${nPr(n, k)}` };
  if (kind === "nCr") return { q: `Evaluate: ${n}C${k}`, a: `${nCr(n, k)}` };
  if (kind === "wordP") return { q: `In how many ways can a president, vice-president${k >= 3 ? " and secretary" : ""} be chosen from ${n} club members?`, a: `${nPr(n, k >= 3 ? 3 : 2)}` };
  if (kind === "wordC") return { q: `How many different ${k}-person committees can be chosen from ${n} people?`, a: `${nCr(n, k)}` };
  if (kind === "letters") { const w = pick([["BOOK", 12], ["LEVEL", 30], ["APPLE", 60], ["BANANA", 60], ["COOKIE", 180]] as const); return { q: `How many distinct arrangements are there of the letters in ${w[0]}?`, a: `${w[1]}` }; }
  const g = randInt(4, 8), b = randInt(4, 8);
  return { q: `A team of 2 girls and 2 boys is chosen from ${g} girls and ${b} boys. How many different teams are possible?`, a: `${nCr(g, 2) * nCr(b, 2)}` };
};
const genBinomial: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(3, diff === "easy" ? 4 : 6), k = randInt(0, n);
  if (diff === "easy" || rng() < 0.5) return { q: `A fair coin is flipped ${n} times. What is the probability of exactly ${k} heads?`, a: fStr(frac(nCr(n, k), Math.pow(2, n))) };
  const [p, label] = pick([[frac(1, 6), "rolls a 6 on a number cube"], [frac(1, 4), "spins red on a spinner with 4 equal colors"], [frac(1, 3), "draws a winning card (1 in 3 chance)"]] as const);
  const kk = Math.min(k, 3);
  const prob = frac(nCr(n, kk) * Math.pow(p.n, kk) * Math.pow(p.d - p.n, n - kk), Math.pow(p.d, n));
  return { q: `A player ${label}. In ${n} independent tries, what is the probability of exactly ${kk} successes? (exact fraction)`, a: fStr(prob) };
};
const genExpectedValue: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["die", "spinner"], medium: ["spinner", "game"], hard: ["game", "fair", "raffle"] }));
  if (kind === "die") return { q: "What is the expected value of one roll of a fair six-sided number cube?", a: "3.5" };
  if (kind === "spinner") { const vals = [randInt(1, 10), randInt(1, 10), randInt(1, 10), randInt(1, 10)]; return { q: `A spinner has 4 equal sections worth ${vals.join(", ")} points. What is the expected number of points per spin?`, a: num(vals.reduce((s, v) => s + v, 0) / 4) }; }
  if (kind === "game") { const win = randInt(5, 20), lose = randInt(1, 5), d = pick([4, 5, 6]); const ev = fAdd(frac(win, d), frac(-lose * (d - 1), d)); return { q: `You win $${win} with probability 1/${d} and lose $${lose} otherwise. What is the expected value of playing once?`, a: money(round(fVal(ev), 2)) }; }
  if (kind === "fair") { const d = pick([4, 5, 6, 10]), cost = randInt(1, 5); return { q: `A game costs $${cost} to play and you win with probability 1/${d}. What prize amount makes the game fair (expected value $0 for the player, counting the cost)?`, a: `$${cost * d}` }; }
  const tickets = pick([100, 200, 500, 1000]), prize = pick([50, 100, 200, 500]), price = pick([1, 2, 5]);
  return { q: `${tickets} raffle tickets are sold for $${price} each. There is one prize of $${prize}. What is the expected value of buying one ticket?`, a: money(round(prize / tickets - price, 2)) };
};
const genLimits: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(-5, 5) || 2;
  const kind = pick(by(diff, { easy: ["sub"], medium: ["sub", "factor"], hard: ["factor", "infinity", "infinity0"] }));
  if (kind === "sub") { const c = [randInt(1, 3), randInt(-5, 5), randInt(-9, 9)]; return { q: `Find lim (x → ${a}) of ${poly(c)}.`, a: `${polyAt(c, a)}` }; }
  if (kind === "factor") { const s = randInt(-5, 5); return { q: `Find lim (x → ${a}) of (${poly(polyMul([1, -a], [1, -s]))})/(${linExpr(1, -a)}).`, a: `${a - s}` }; }
  const p = randInt(1, 6), q = randInt(1, 6);
  if (kind === "infinity") return { q: `Find lim (x → ∞) of (${poly([p, randInt(-5, 5), randInt(-5, 5)])})/(${poly([q, randInt(-5, 5), randInt(1, 5)])}).`, a: fStr(frac(p, q)) };
  return { q: `Find lim (x → ∞) of (${poly([p, randInt(1, 5)])})/(${poly([q, randInt(-5, 5), randInt(1, 5)])}).`, a: "0" };
};
const derivCoeffs = (c: number[]) => c.slice(0, -1).map((v, i) => v * (c.length - 1 - i));
const genDerivatives: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const degN = by(diff, { easy: 2, medium: 3, hard: 4 });
  const c = Array.from({ length: degN + 1 }, (_, i) => (i === 0 ? randInt(1, 6) : randInt(-9, 9)));
  const kind = pick(by(diff, { easy: ["deriv"], medium: ["deriv", "slopeAt"], hard: ["deriv", "slopeAt", "tangent"] }));
  const dc = derivCoeffs(c);
  if (kind === "deriv") return { q: `Find f'(x) if f(x) = ${poly(c)}.`, a: `f'(x) = ${poly(dc)}` };
  const x = randInt(-3, 3);
  if (kind === "slopeAt") return { q: `f(x) = ${poly(c)}. Find the slope of the tangent line at x = ${x}.`, a: `${polyAt(dc, x)}` };
  const m = polyAt(dc, x), y = polyAt(c, x);
  return { q: `Find the equation of the tangent line to f(x) = ${poly(c)} at x = ${x}.`, a: lineStr(frac(m), frac(y - m * x)) };
};
const genIntegrals: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["anti1"], medium: ["anti", "def"], hard: ["def", "defPoly", "anti"] }));
  if (kind === "anti1") { const n = randInt(1, 4), k = (n + 1) * randInt(1, 4); return { q: `Find the antiderivative: ∫ ${k}x${n === 1 ? "" : `^${n}`} dx`, a: `${k / (n + 1) === 1 ? "" : k / (n + 1)}x^${n + 1} + C` }; }
  if (kind === "anti") { const a = 3 * randInt(1, 3), b = 2 * randInt(-4, 4) || 2, c = randInt(-9, 9); return { q: `Find the antiderivative: ∫ (${poly([a, b, c])}) dx`, a: `${poly([a / 3, b / 2, c, 0])} + C` }; }
  const lo = randInt(0, 2), hi = lo + randInt(1, 3);
  if (kind === "def") { const k = randInt(1, 6), n = randInt(1, 3); const F = (t: number) => frac(k * Math.pow(t, n + 1), n + 1); return { q: `Evaluate: ∫ from ${lo} to ${hi} of ${k === 1 ? "" : k}x${n === 1 ? "" : `^${n}`} dx`, a: fStr(fAdd(F(hi), frac(-F(lo).n, F(lo).d))) }; }
  const a = randInt(1, 4), b = randInt(-5, 5);
  const F = (t: number): Frac => fAdd(frac(3 * a * t * t * t, 3), frac(b * t * t, 2));
  const res = fAdd(F(hi), frac(-F(lo).n, F(lo).d));
  return { q: `Evaluate: ∫ from ${lo} to ${hi} of (${poly([3 * a, b, 0])}) dx`, a: fStr(res) };
};

// ===================================================================== challenges
const genChallengeAlgebra: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const templates = [
    () => { const k = randInt(3, 9); return { q: `If x + 1/x = ${k}, what is x^2 + 1/x^2?`, a: `${k * k - 2}` }; },
    () => { const s = randInt(3, 15), p = randInt(1, Math.floor((s * s) / 4)); return { q: `If a + b = ${s} and ab = ${p}, what is a^2 + b^2?`, a: `${s * s - 2 * p}` }; },
    () => { const x = randInt(2, 6); return { q: `If 2^x = ${Math.pow(2, x)}, what is 4^x?`, a: `${Math.pow(4, x)}` }; },
    () => { const n = randInt(4, 9), m = randInt(10, 40); return { q: `The sum of ${n} consecutive integers is ${n * m + (n * (n - 1)) / 2}. What is the largest of them?`, a: `${m + n - 1}` }; },
    () => { const a = randInt(11, 99), b = randInt(1, 9); return { q: `Without a calculator: ${a + b}^2 - ${a - b}^2 = ?`, a: `${4 * a * b}` }; },
    () => { const s = randInt(5, 20), d = randInt(1, s - 1); return { q: `If a + b = ${s} and a - b = ${d}, what is a^2 - b^2?`, a: `${s * d}` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 3) : templates)();
};
const genChallengeGeometry: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const templates = [
    () => { const n = randInt(5, 20); return { q: `How many diagonals does a polygon with ${n} sides have?`, a: `${(n * (n - 3)) / 2}` }; },
    () => { const n = randInt(5, 12); return { q: `${n} points are marked on a circle. How many different triangles can be drawn using these points as corners?`, a: `${nCr(n, 3)}` }; },
    () => { const [a, b, c] = pick(TRIPLES); return { q: `A rectangle has a diagonal of ${c} and one side of ${a}. What is its area?`, a: `${a * b}` }; },
    () => { const r = randInt(2, 10); return { q: `A square is drawn inside a circle of radius ${r} so its corners touch the circle. What is the area of the square?`, a: `${2 * r * r}` }; },
    () => { const s = randInt(2, 12); return { q: `A circle fits exactly inside a square of side ${s} (touching all four sides). What is the area of the circle in terms of π?`, a: piStr(frac(s * s, 4)) }; },
    () => { const n = pick(NICE_N.filter((x) => x >= 5)); return { q: `Each interior angle of a regular polygon is ${180 - 360 / n}°. How many diagonals does it have?`, a: `${(n * (n - 3)) / 2}` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 3) : templates)();
};

export const MATH_HIGH_GENERATORS: Record<string, Gen> = {
  literal_equations: genLiteral, absolute_value_equations: genAbsEq, point_slope: genPointSlope, systems_word: genSystemsWord,
  factoring_trinomials: genFactorTrinomials, special_factoring: genSpecialFactoring,
  parallel_perpendicular: genParallelPerp, parallel_lines_angles: genParallelAngles, similar_triangles: genSimilarTriangles,
  special_right_triangles: genSpecialRight, trig_solve: genTrigSolve, polygon_angles: genPolygonAngles, arc_sector: genArcSector,
  circle_equation: genCircleEquation, surface_area_solids: genSurfaceAreaSolids,
  function_ops: genFunctionOps, inverse_functions: genInverse, function_transformations: genFunctionTransformations,
  complex_numbers: genComplex, completing_square: genCompletingSquare, poly_remainder: genPolyRemainder, poly_zeros: genPolyZeros,
  log_properties: genLogProperties, exp_equations: genExpEquations, rational_expressions: genRationalExpressions,
  radical_equations: genRadicalEquations, series_sum: genSeriesSum, unit_circle: genUnitCircle, std_dev_zscore: genStdDev,
  trig_equations: genTrigEquations, law_sines_cosines: genLawSinesCosines, vectors: genVectors, matrices: genMatrices,
  permutations_combinations: genPermComb, binomial_probability: genBinomial, expected_value: genExpectedValue,
  limits: genLimits, derivatives_power: genDerivatives, integrals_basic: genIntegrals,
  challenge_algebra: genChallengeAlgebra, challenge_geometry: genChallengeGeometry,
};
