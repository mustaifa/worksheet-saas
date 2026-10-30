/**
 * Fine-grained Math skill generators for grades 1–5 (Common Core K–5 domains).
 * Each one backs a leaf in the Math curriculum book (lib/curriculum/math.ts).
 * Answers are always computed, never typed by hand.
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import {
  frac, fMixed, fStr, num, comma, cents, numberToWords, expandedForm, factorsOf, isPrime, units, NAMES,
} from "./mathUtil";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];

export const MATH_ELEM_TOPICS: Topic[] = [
  // ---- grade 1–2 number sense
  T("count_120", "Counting to 120", ["count to 120", "number before", "number after", "number between"], "Saying the number that comes before, after or between, and filling gaps in counting sequences up to 120."),
  T("tens_ones", "Tens and Ones", ["tens and ones", "tens ones"], "Seeing a two-digit number as a bundle of tens plus some ones — the heart of place value."),
  T("expanded_form", "Hundreds, Tens & Ones (Expanded Form)", ["expanded form", "hundreds tens ones", "number words"], "Reading and writing three-digit numbers in standard form, expanded form and words."),
  T("skip_counting", "Skip Counting by 2s, 5s, 10s & 100s", ["skip count", "count by 5", "count by 10", "count by 100"], "Continuing skip-counting sequences forwards and backwards by 2s, 5s, 10s and 100s."),
  T("odd_even", "Odd & Even Numbers", ["odd and even", "odd number", "even number"], "Deciding whether a number is odd or even, and writing even numbers as a sum of two equal addends."),
  T("ten_more_less", "10 More, 10 Less (and 100 More/Less)", ["10 more", "10 less", "100 more", "100 less"], "Mentally finding 10 (or 100) more or less than a number without counting on."),
  // ---- addition & subtraction facts
  T("add_within_10", "Addition Facts within 10", ["add within 10", "addition facts to 10"], "Quick addition facts with totals up to 10."),
  T("sub_within_10", "Subtraction Facts within 10", ["subtract within 10", "subtraction facts to 10"], "Quick subtraction facts starting from numbers up to 10."),
  T("add_within_20", "Addition Facts within 20", ["add within 20", "addition facts to 20"], "Addition facts with totals up to 20, including adding across ten."),
  T("sub_within_20", "Subtraction Facts within 20", ["subtract within 20", "subtraction facts to 20"], "Subtraction facts from teen numbers, including subtracting across ten."),
  T("make_ten", "Making 10 to Add", ["make ten", "make 10", "number bonds to 10"], "Number bonds to 10 and the make-a-ten strategy for adding numbers like 8 + 5."),
  T("doubles", "Doubles & Near Doubles", ["doubles", "near doubles"], "Using doubles facts (6 + 6) and near doubles (6 + 7) as a quick mental strategy."),
  T("missing_addend", "Missing Numbers in Equations", ["missing number", "missing addend", "unknown number"], "Finding the unknown number in addition and subtraction equations such as __ + 4 = 9."),
  T("equal_sign", "True or False Equations", ["true or false equation", "equal sign", "balance equation"], "Understanding that = means 'the same as' by judging equations like 5 + 2 = 4 + 3."),
  T("three_addends", "Adding Three Numbers", ["three addends", "add three numbers"], "Adding three numbers by looking for doubles or a make-ten pair first."),
  T("add_tens", "Adding & Subtracting Tens", ["add tens", "subtract tens", "multiples of 10"], "Adding and subtracting multiples of 10 using place value."),
  T("add_2d_1d", "Adding a One-Digit Number to a Two-Digit Number", ["two digit plus one digit", "add within 100"], "Adding one-digit numbers to two-digit numbers, with and without making a new ten."),
  T("add_2d", "Adding Two-Digit Numbers", ["add two digit", "two-digit addition", "regrouping addition"], "Adding two-digit numbers with and without regrouping, and adding up to four two-digit numbers."),
  T("sub_2d", "Subtracting Two-Digit Numbers", ["subtract two digit", "two-digit subtraction", "regrouping subtraction", "borrowing"], "Subtracting two-digit numbers with and without regrouping."),
  T("add_3d", "Adding & Subtracting within 1,000", ["three digit addition", "three digit subtraction", "add within 1000"], "Adding and subtracting three-digit numbers, including regrouping across zeros."),
  // ---- measurement, money, data, geometry (early)
  T("time_hour_half", "Telling Time (Hour & Half Hour)", ["telling time", "o'clock", "half past"], "Reading clocks to the hour and half hour from where the hands point."),
  T("time_5min", "Telling Time to 5 Minutes", ["time to 5 minutes", "quarter past", "quarter to"], "Reading clocks to the nearest five minutes and using quarter past, half past and quarter to."),
  T("time_minute", "Telling Time to the Minute", ["time to the minute", "nearest minute"], "Reading and writing times to the nearest minute."),
  T("elapsed_time", "Elapsed Time", ["elapsed time", "how long", "start time", "end time"], "Working out start times, end times and how long something lasted."),
  T("money", "Counting Money", ["money", "coins", "quarters dimes nickels", "cents"], "Counting coins and bills, and solving simple money problems with ¢ and $."),
  T("compare_length", "Measuring & Comparing Length", ["length", "longer", "shorter", "measure length", "centimeters", "inches"], "Measuring and comparing lengths, finding differences in length and choosing sensible units."),
  T("mass_volume", "Mass & Liquid Volume", ["mass", "liquid volume", "grams", "kilograms", "liters"], "Solving problems with grams, kilograms and liters, and choosing sensible units."),
  T("data_tally", "Tally Charts, Picture Graphs & Bar Graphs", ["tally chart", "picture graph", "bar graph", "pictograph"], "Reading data from tally charts, picture graphs and bar graphs to answer how many, how many more and which is most."),
  T("halves_quarters", "Halves, Thirds & Quarters of Shapes", ["halves", "quarters", "thirds", "equal parts"], "Splitting shapes into equal parts and naming halves, thirds and quarters."),
  T("arrays", "Arrays & Repeated Addition", ["array", "repeated addition", "rows and columns"], "Using rows and columns of objects to build the idea of multiplication as repeated addition."),
  // ---- grade 3 operations
  T("mult_facts", "Multiplication Facts (0–12)", ["multiplication facts", "times tables"], "Multiplication facts up to 12 × 12, starting with the 2s, 5s and 10s."),
  T("div_facts", "Division Facts", ["division facts"], "Division facts as the inverse of multiplication facts."),
  T("mult_missing", "Missing Factors & Unknowns", ["missing factor", "unknown factor"], "Finding the unknown number in multiplication and division equations like 6 × __ = 42."),
  T("mult_by_10s", "Multiplying by Multiples of 10", ["multiply by multiples of 10", "times 10", "times 20"], "Multiplying one-digit numbers by multiples of 10 such as 7 × 40 using place value."),
  T("mult_div_word", "Multiplication & Division Word Problems", ["multiplication word problem", "division word problem", "equal groups"], "Equal groups, arrays and sharing problems solved with multiplication or division."),
  T("two_step_word", "Two-Step Word Problems", ["two-step word problem", "two step problem", "multi-step word problem"], "Word problems that need two operations, solved in the right order."),
  T("number_patterns", "Number Patterns & Rules", ["number pattern", "pattern rule", "arithmetic pattern"], "Finding the rule in a number pattern and using it to predict later terms."),
  // ---- grade 3–5 fractions
  T("fractions_number_line", "Fractions on a Number Line", ["fraction number line"], "Placing fractions on a number line by splitting each whole into equal jumps."),
  T("equivalent_fractions", "Equivalent Fractions", ["equivalent fraction", "equal fractions"], "Finding fractions that name the same amount, and writing whole numbers as fractions."),
  T("fractions_compare_same", "Comparing Fractions (Same Numerator or Denominator)", ["compare fractions same denominator", "compare fractions same numerator"], "Comparing fractions that share a numerator or a denominator by reasoning about the size of the parts."),
  T("add_like_fractions", "Adding & Subtracting Like Fractions", ["like fractions", "same denominator", "add fractions same denominator"], "Adding and subtracting fractions and mixed numbers that have the same denominator."),
  T("mixed_numbers", "Mixed Numbers & Improper Fractions", ["mixed number", "improper fraction"], "Converting between mixed numbers and improper fractions."),
  T("fraction_times_whole", "Multiplying a Fraction by a Whole Number", ["fraction times whole number", "whole number times fraction"], "Multiplying a fraction by a whole number, including word problems."),
  T("decimal_fraction_convert", "Tenths & Hundredths: Decimals and Fractions", ["tenths and hundredths", "decimal to fraction", "fraction to decimal"], "Writing tenths and hundredths as decimals and fractions, and adding tenths to hundredths."),
  T("fraction_division_interp", "Fractions as Division", ["fraction as division", "sharing equally fraction"], "Seeing a fraction as a division (3/4 = 3 ÷ 4) through fair-sharing problems."),
  T("fraction_unit_div", "Dividing Unit Fractions & Whole Numbers", ["divide unit fraction", "divide by a fraction", "unit fraction division"], "Dividing a unit fraction by a whole number and a whole number by a unit fraction."),
  // ---- grade 4–5 number & operations
  T("large_numbers", "Reading & Writing Large Numbers", ["large numbers", "standard form", "word form", "millions"], "Reading and writing multi-digit numbers in standard form, words and expanded form."),
  T("compare_large", "Comparing & Ordering Large Numbers", ["compare large numbers", "order numbers"], "Comparing and ordering multi-digit numbers using place value."),
  T("add_sub_multi", "Multi-Digit Addition & Subtraction", ["multi-digit addition", "multi-digit subtraction", "column addition"], "Adding and subtracting multi-digit whole numbers with the standard algorithm."),
  T("mult_multi", "Multi-Digit Multiplication", ["multi-digit multiplication", "long multiplication", "2 digit by 2 digit"], "Multiplying multi-digit numbers, from 2-digit × 1-digit up to 3-digit × 2-digit."),
  T("long_division", "Long Division with Remainders", ["long division", "remainder", "divide with remainders"], "Dividing multi-digit numbers, including writing remainders."),
  T("factors_multiples", "Factors & Multiples", ["factor", "multiple", "factor pairs"], "Listing factors and multiples and deciding whether one number is a factor of another."),
  T("prime_composite", "Prime & Composite Numbers", ["prime", "composite", "prime number"], "Deciding whether numbers up to 100 are prime or composite."),
  T("mult_comparison", "Multiplicative Comparison", ["times as many", "times as much", "multiplicative comparison"], "Solving 'times as many' comparison problems with multiplication and division."),
  T("powers_of_10", "Powers of 10 & Place-Value Patterns", ["powers of 10", "multiply by 10", "divide by 100"], "Multiplying and dividing whole numbers and decimals by 10, 100 and 1,000, and using exponents for powers of 10."),
  T("decimal_place_value", "Decimal Place Value to Thousandths", ["decimal place value", "thousandths", "tenths place"], "The value of each digit in a decimal, and decimals in expanded form, to thousandths."),
  T("write_expressions", "Writing & Interpreting Numerical Expressions", ["numerical expression", "write an expression"], "Turning word descriptions into numerical expressions with brackets, and interpreting them without calculating."),
  T("unit_conversion", "Converting Measurement Units", ["convert units", "unit conversion", "metric conversion", "customary units"], "Converting between units of length, mass, capacity and time within one system."),
  // ---- grade 3–5 geometry & graphing
  T("quadrilaterals", "Quadrilaterals", ["quadrilateral", "rhombus", "trapezoid", "parallelogram"], "Naming quadrilaterals from their properties and seeing how the families overlap."),
  T("angles_measure", "Angles: Types & Measures", ["angle types", "acute", "obtuse", "right angle", "measure angles"], "Classifying angles and finding unknown angles that join to make a right angle, a straight line or a full turn."),
  T("lines_symmetry", "Lines, Rays & Symmetry", ["line of symmetry", "parallel lines", "perpendicular lines", "ray", "line segment"], "Points, lines, rays and segments, parallel and perpendicular lines, and lines of symmetry."),
  T("coordinate_plane_q1", "Coordinate Plane (First Quadrant)", ["coordinate plane", "ordered pair", "plot points"], "Reading and plotting ordered pairs in the first quadrant and moving between points."),
  T("triangle_classify", "Classifying Triangles", ["classify triangles", "scalene", "isosceles", "equilateral"], "Classifying triangles by their sides and by their angles."),
  // ---- challenge
  T("challenge_mystery_number", "Challenge: Mystery Number Riddles", ["mystery number", "number riddle", "what number am i"], "Reasoning backwards from clues to find a hidden number — great for building number sense."),
  T("challenge_magic_square", "Challenge: Magic Squares", ["magic square"], "Finding missing numbers in 3 × 3 magic squares where every row, column and diagonal has the same sum."),
  T("challenge_missing_digits", "Challenge: Missing Digit Puzzles", ["missing digit", "digit puzzle"], "Finding the hidden digit that makes an addition, subtraction or multiplication true."),
  T("challenge_logic", "Challenge: Logic & Reasoning Problems", ["logic puzzle", "reasoning problem", "heads and legs"], "Classic reasoning puzzles — ages, heads and legs, consecutive numbers — that reward careful thinking."),
];

// ===================================================================== number sense
const genCount120: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = by(diff, { easy: 50, medium: 100, hard: 120 });
  const n = randInt(2, max - 2);
  const kind = pick(["after", "before", "between", "seq", diff === "hard" ? "back" : "seq"]);
  if (kind === "after") return { q: `What number comes just after ${n}?`, a: `${n + 1}` };
  if (kind === "before") return { q: `What number comes just before ${n}?`, a: `${n - 1}` };
  if (kind === "between") return { q: `What number is between ${n - 1} and ${n + 1}?`, a: `${n}` };
  if (kind === "back") return { q: `Count back: ${n + 2}, ${n + 1}, __, ${n - 1}`, a: `${n}` };
  return { q: `Fill in the missing number: ${n - 1}, ${n}, __, ${n + 2}`, a: `${n + 1}` };
};

const genTensOnes: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const t = randInt(1, 9), o = randInt(0, 9), n = t * 10 + o;
  const kind = pick(diff === "easy" ? ["build", "split"] : diff === "medium" ? ["build", "split", "digit"] : ["extra", "digit", "split", "swap"]);
  if (kind === "build") return { q: `${t} tens and ${o} ones make what number?`, a: `${n}` };
  if (kind === "split") return { q: `How many tens and ones are in ${n}?`, a: `${t} tens ${o} ones` };
  if (kind === "digit") return pick([
    { q: `What digit is in the tens place of ${n}?`, a: `${t}` },
    { q: `What is the value of the ${t} in ${n}?`, a: `${t * 10}` },
  ]);
  if (kind === "swap") return { q: `${o} ones and ${t} tens make what number?`, a: `${n}` };
  const t2 = randInt(1, 7), o2 = randInt(10, 19);
  return { q: `${t2} tens and ${o2} ones make what number?`, a: `${t2 * 10 + o2}` };
};

const genExpandedForm: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(diff === "easy" ? 100 : 101, 999);
  const zeroTens = diff !== "easy" && rng() < 0.3 ? Math.floor(n / 100) * 100 + (n % 10) : n;
  const h = Math.floor(zeroTens / 100), t = Math.floor((zeroTens % 100) / 10), o = zeroTens % 10;
  const kind = pick(diff === "easy" ? ["toExp", "fromExp"] : ["toExp", "fromExp", "fromWords", "toWords", "hto"]);
  if (kind === "toExp") return { q: `Write ${zeroTens} in expanded form.`, a: expandedForm(zeroTens) };
  if (kind === "fromExp") return { q: `${expandedForm(zeroTens)} = ?`, a: `${zeroTens}` };
  if (kind === "fromWords") return { q: `Write the number: ${numberToWords(zeroTens)}`, a: `${zeroTens}` };
  if (kind === "toWords") return { q: `Write ${zeroTens} in words.`, a: numberToWords(zeroTens) };
  return { q: `${h} hundreds, ${t} tens and ${o} ones make what number?`, a: `${zeroTens}` };
};

const genSkipCounting: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const step = pick(by(diff, { easy: [2, 5, 10], medium: [2, 5, 10, 100], hard: [5, 10, 100, 25] }));
  const aligned = diff === "easy" || rng() < 0.5;
  let start = step === 100 ? randInt(1, 6) * 100 : randInt(1, 15) * step;
  if (!aligned) start += randInt(1, step - 1 || 1);
  const back = diff === "hard" && rng() < 0.5;
  if (back) start += step * 5;
  const s = (i: number) => (back ? start - i * step : start + i * step);
  const missingAt = diff === "easy" ? 3 : randInt(1, 3);
  const seq = [0, 1, 2, 3].map((i) => (i === missingAt ? "__" : `${s(i)}`));
  return { q: `Count by ${step}s${back ? " backwards" : ""}: ${seq.join(", ")}`, a: `${s(missingAt)}` };
};

const genOddEven: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = by(diff, { easy: 20, medium: 100, hard: 999 });
  const n = randInt(1, max);
  const kind = pick(diff === "easy" ? ["which", "which", "pair"] : ["which", "nextEven", "nextOdd", "pair", "sum"]);
  if (kind === "which") return { q: `Is ${n} odd or even?`, a: n % 2 ? "odd" : "even" };
  if (kind === "nextEven") return { q: `What is the next even number after ${n}?`, a: `${n % 2 ? n + 1 : n + 2}` };
  if (kind === "nextOdd") return { q: `What is the next odd number after ${n}?`, a: `${n % 2 ? n + 2 : n + 1}` };
  if (kind === "pair") {
    const e = randInt(1, diff === "easy" ? 10 : 20) * 2;
    return { q: `Write ${e} as the sum of two equal numbers.`, a: `${e / 2} + ${e / 2}` };
  }
  const a = randInt(1, 50), b = randInt(1, 50);
  return { q: `Is ${a} + ${b} odd or even?`, a: (a + b) % 2 ? "odd" : "even" };
};

const genTenMoreLess: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const big = grade >= 2 && diff !== "easy";
  const n = big ? randInt(110, 889) : randInt(11, 89);
  const step = big ? pick([10, 100]) : 10;
  const more = rng() < 0.5;
  if (diff === "hard" && rng() < 0.4) return { q: `${n} + __ = ${n + step}`, a: `${step}` };
  return { q: `What is ${step} ${more ? "more" : "less"} than ${n}?`, a: `${more ? n + step : n - step}` };
};

// ===================================================================== facts
const genAddWithin = (max: number): Gen => (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const lo = by(diff, { easy: 0, medium: 1, hard: 2 });
  const total = diff === "easy" ? randInt(lo + 1, Math.ceil(max * 0.7)) : randInt(Math.max(2, Math.ceil(max / 2)), max);
  const a = randInt(lo, total - lo), b = total - a;
  if (diff === "hard" && rng() < 0.35) return { q: `${a} + __ = ${total}`, a: `${b}` };
  return pick([{ q: `${a} + ${b} = ?`, a: `${total}` }, { q: `${b} + ${a} = ?`, a: `${total}` }]);
};
const genSubWithin = (max: number): Gen => (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  let a: number, b: number;
  if (max === 20 && diff !== "easy") {
    // teen minus a single digit that crosses ten, e.g. 13 − 7
    a = randInt(11, 18); b = randInt(a - 9, 9);
  } else {
    a = randInt(diff === "easy" ? 2 : Math.ceil(max / 2), max); b = randInt(0, a);
  }
  if (diff === "hard" && rng() < 0.35) return { q: `${a} - __ = ${a - b}`, a: `${b}` };
  return { q: `${a} - ${b} = ?`, a: `${a - b}` };
};

const genMakeTen: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["bond"], medium: ["bond", "split"], hard: ["split", "split", "total"] }));
  if (kind === "bond") { const a = randInt(0, 10); return pick([{ q: `${a} + __ = 10`, a: `${10 - a}` }, { q: `__ + ${a} = 10`, a: `${10 - a}` }]); }
  const a = randInt(6, 9), b = randInt(11 - a, 9);
  if (kind === "split") return { q: `Make a ten: ${a} + ${b} = 10 + __`, a: `${a + b - 10}` };
  return { q: `${a} + ${b} = ?  (Hint: make a ten first)`, a: `${a + b}` };
};

const genDoubles: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(1, by(diff, { easy: 6, medium: 10, hard: 10 }));
  const kind = pick(by(diff, { easy: ["double", "word"], medium: ["double", "near"], hard: ["near", "nearMinus", "word"] }));
  if (kind === "double") return { q: `${n} + ${n} = ?`, a: `${2 * n}` };
  if (kind === "near") return { q: `${n} + ${n + 1} = ?`, a: `${2 * n + 1}` };
  if (kind === "nearMinus") return { q: `${n + 1} + ${n} = ?  (Think: double ${n}, plus 1)`, a: `${2 * n + 1}` };
  return { q: `What is double ${n}?`, a: `${2 * n}` };
};

const genMissingAddend: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = grade <= 1 ? by(diff, { easy: 10, medium: 20, hard: 20 }) : by(diff, { easy: 20, medium: 50, hard: 100 });
  const c = randInt(3, max), a = randInt(1, c - 1), b = c - a;
  const kind = pick(by(diff, { easy: ["a_"], medium: ["a_", "_b", "c-_"], hard: ["_b", "c-_", "_-a", "eq"] }));
  if (kind === "a_") return { q: `${a} + __ = ${c}`, a: `${b}` };
  if (kind === "_b") return { q: `__ + ${b} = ${c}`, a: `${a}` };
  if (kind === "c-_") return { q: `${c} - __ = ${a}`, a: `${b}` };
  if (kind === "_-a") return { q: `__ - ${a} = ${b}`, a: `${c}` };
  return { q: `${c} = ${a} + __`, a: `${b}` };
};

const genEqualSign: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = grade <= 1 ? 20 : 50;
  const total = randInt(5, max);
  const a = randInt(1, total - 1), c = randInt(1, total - 1);
  if (diff === "hard" && rng() < 0.5) return { q: `${a} + ${total - a} = __ + ${total - c}`, a: `${c}` };
  const truthy = rng() < 0.5;
  const off = truthy ? 0 : pick([1, 2, -1]);
  const d = Math.max(0, total - c + off);
  const realTrue = c + d === total;
  const left = diff === "easy" ? `${total}` : `${a} + ${total - a}`;
  return { q: `True or false? ${left} = ${c} + ${d}`, a: realTrue ? "true" : "false" };
};

const genThreeAddends: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const hi = by(diff, { easy: 5, medium: 9, hard: grade >= 2 ? 20 : 9 });
  const a = randInt(1, hi), b = randInt(1, hi), c = randInt(1, hi);
  if (diff === "hard" && rng() < 0.4) {
    const p = pick(NAMES);
    return { q: `${p} has ${a} red, ${b} blue and ${c} green marbles. How many marbles in all?`, a: `${a + b + c}` };
  }
  return { q: `${a} + ${b} + ${c} = ?`, a: `${a + b + c}` };
};

const genAddTens: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["addT", "subT"], medium: ["addT", "subT", "twoPlusT"], hard: ["twoPlusT", "twoMinusT", "missing"] }));
  if (kind === "addT") { const a = randInt(1, 8), b = randInt(1, 9 - a); return { q: `${a * 10} + ${b * 10} = ?`, a: `${(a + b) * 10}` }; }
  if (kind === "subT") { const a = randInt(2, 9), b = randInt(1, a); return { q: `${a * 10} - ${b * 10} = ?`, a: `${(a - b) * 10}` }; }
  if (kind === "twoPlusT") { const n = randInt(11, 69), t = randInt(1, Math.floor((99 - n) / 10)) * 10; return { q: `${n} + ${t} = ?`, a: `${n + t}` }; }
  if (kind === "twoMinusT") { const n = randInt(31, 99), t = randInt(1, Math.floor(n / 10) - 1) * 10; return { q: `${n} - ${t} = ?`, a: `${n - t}` }; }
  const a = randInt(1, 7) * 10, b = randInt(1, (90 - a) / 10) * 10;
  return { q: `${a} + __ = ${a + b}`, a: `${b}` };
};

const genAdd2d1d: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const tens = randInt(1, 8);
  let ones: number, b: number;
  if (diff === "easy") { ones = randInt(0, 7); b = randInt(1, 9 - ones); }
  else { ones = randInt(3, 9); b = randInt(10 - ones, 9); }
  const n = tens * 10 + ones;
  return { q: `${n} + ${b} = ?`, a: `${n + b}` };
};

const genAdd2d: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  if (diff === "hard" && rng() < 0.5) {
    const k = randInt(3, 4);
    const nums = Array.from({ length: k }, () => randInt(11, 49));
    return { q: `${nums.join(" + ")} = ?`, a: `${nums.reduce((s, x) => s + x, 0)}` };
  }
  let a: number, b: number;
  if (diff === "easy") {
    const a1 = randInt(1, 7), a0 = randInt(0, 8), b1 = randInt(1, 8 - a1), b0 = randInt(0, 9 - a0);
    a = a1 * 10 + a0; b = b1 * 10 + b0;
  } else {
    const a0 = randInt(2, 9), b0 = randInt(10 - a0, 9);
    a = randInt(1, 6) * 10 + a0; b = randInt(1, 8 - Math.floor(a / 10)) * 10 + b0;
  }
  return { q: `${a} + ${b} = ?`, a: `${a + b}` };
};

const genSub2d: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  let a: number, b: number;
  if (diff === "easy") {
    const a1 = randInt(2, 9), a0 = randInt(1, 9), b1 = randInt(1, a1 - 1), b0 = randInt(0, a0);
    a = a1 * 10 + a0; b = b1 * 10 + b0;
  } else {
    const a1 = randInt(3, 9), a0 = randInt(0, 7), b1 = randInt(1, a1 - 1), b0 = randInt(a0 + 1, 9);
    a = a1 * 10 + a0; b = b1 * 10 + b0;
  }
  if (diff === "hard" && rng() < 0.4) return { q: `${a} - __ = ${a - b}`, a: `${b}` };
  return { q: `${a} - ${b} = ?`, a: `${a - b}` };
};

const genAdd3d: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const op = pick(["+", "-"]);
  if (diff === "easy") {
    // no regrouping: digit-by-digit sums stay below 10 / no borrowing
    const ad = [randInt(2, 8), randInt(0, 8), randInt(0, 8)];
    // each column: sum ≤ 9 when adding, top digit ≥ bottom digit when subtracting
    const bd = ad.map((d, i) => (op === "+" ? randInt(i === 0 ? 1 : 0, 9 - d) : randInt(i === 0 ? 1 : 0, i === 0 ? d - 1 : d)));
    const a = ad[0] * 100 + ad[1] * 10 + ad[2], b = bd[0] * 100 + bd[1] * 10 + bd[2];
    return op === "+" ? { q: `${a} + ${b} = ?`, a: `${a + b}` } : { q: `${a} - ${b} = ?`, a: `${a - b}` };
  }
  if (op === "+") { const a = randInt(115, 689), b = randInt(108, 999 - a); return { q: `${a} + ${b} = ?`, a: `${a + b}` }; }
  if (diff === "hard" && rng() < 0.5) { const a = randInt(2, 9) * 100 + randInt(0, 9) * (rng() < 0.5 ? 0 : 1); const b = randInt(111, a - 1); return { q: `${a} - ${b} = ?`, a: `${a - b}` }; }
  const a = randInt(300, 999), b = randInt(101, a - 50);
  return { q: `${a} - ${b} = ?`, a: `${a - b}` };
};

// ===================================================================== measurement, money, data
const clock = (h: number, m: number) => `${h}:${m.toString().padStart(2, "0")}`;
const addMin = (h: number, m: number, d: number): [number, number] => {
  let total = ((h % 12) * 60 + m + d) % 720;
  if (total < 0) total += 720;
  const hh = Math.floor(total / 60);
  return [hh === 0 ? 12 : hh, total % 60];
};

const genTimeHourHalf: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(1, 12), next = h === 12 ? 1 : h + 1;
  const kind = pick(by(diff, { easy: ["hour"], medium: ["hour", "half"], hard: ["half", "later", "write"] }));
  if (kind === "hour") return { q: `The hour hand points to ${h} and the minute hand points to 12. What time is it?`, a: clock(h, 0) };
  if (kind === "half") return { q: `The minute hand points to 6 and the hour hand is halfway between ${h} and ${next}. What time is it?`, a: clock(h, 30) };
  if (kind === "write") return { q: `Write "half past ${numberToWords(h)}" as a time.`, a: clock(h, 30) };
  const half = rng() < 0.5;
  return { q: `What time is it one hour after ${clock(h, half ? 30 : 0)}?`, a: clock(next, half ? 30 : 0) };
};

const genTime5min: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(1, 12), mark = randInt(1, 11), m = mark * 5, next = h === 12 ? 1 : h + 1;
  const kind = pick(by(diff, { easy: ["minutes", "quarter"], medium: ["read", "minutes", "quarter"], hard: ["read", "quarterTo", "later"] }));
  if (kind === "minutes") return { q: `The minute hand points to the ${mark}. How many minutes past the hour is that?`, a: `${m}` };
  if (kind === "read") return { q: `The hour hand is just past ${h} and the minute hand points to the ${mark}. What time is it?`, a: clock(h, m) };
  if (kind === "quarter") { const which = pick(["quarter past", "half past"]); return { q: `Write "${which} ${h}" as a digital time.`, a: clock(h, which === "quarter past" ? 15 : 30) }; }
  if (kind === "quarterTo") return { q: `Write "quarter to ${next}" as a digital time.`, a: clock(h, 45) };
  const d = randInt(1, 6) * 5; const [h2, m2] = addMin(h, m, d);
  return { q: `What time is it ${d} minutes after ${clock(h, m)}?`, a: clock(h2, m2) };
};

const genTimeMinute: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(1, 12), m = randInt(1, 59);
  const kind = pick(by(diff, { easy: ["words", "marks"], medium: ["words", "marks", "later"], hard: ["later", "before", "to"] }));
  if (kind === "words") return { q: `Write "${numberToWords(m)} minute${m === 1 ? "" : "s"} past ${numberToWords(h)}" as a digital time.`, a: clock(h, m) };
  if (kind === "marks") { const big = randInt(1, 11), extra = randInt(1, 4); return { q: `The minute hand is ${extra} small marks past the ${big}. How many minutes past the hour is it?`, a: `${big * 5 + extra}` }; }
  if (kind === "to") { const mm = randInt(31, 59); const next = h === 12 ? 1 : h + 1; return { q: `It is ${60 - mm} minutes to ${next}. Write the time in digital form.`, a: clock(h, mm) }; }
  const d = randInt(3, 48);
  const [h2, m2] = addMin(h, m, kind === "before" ? -d : d);
  return { q: `What time is it ${d} minutes ${kind === "before" ? "before" : "after"} ${clock(h, m)}?`, a: clock(h2, m2) };
};

const genElapsedTime: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const h = randInt(7, 10), m = randInt(0, 11) * 5;
  const step = diff === "easy" ? 15 : 5;
  const d = by(diff, { easy: randInt(1, 4) * 15, medium: randInt(2, 15) * step, hard: randInt(10, 40) * 5 });
  const [h2, m2] = addMin(h, m, d);
  const dur = d >= 60 && diff === "hard" ? `${Math.floor(d / 60)} hour${d >= 120 ? "s" : ""}${d % 60 ? ` ${d % 60} minutes` : ""}` : `${d} minutes`;
  const p = pick(NAMES), act = pick(["soccer practice", "piano lesson", "movie", "science club meeting", "bike ride"]);
  const kind = pick(["end", "length", "start"]);
  if (kind === "end") return { q: `${p}'s ${act} starts at ${clock(h, m)} and lasts ${dur}. What time does it end?`, a: clock(h2, m2) };
  if (kind === "start") return { q: `${p}'s ${act} ends at ${clock(h2, m2)}. It lasted ${dur}. What time did it start?`, a: clock(h, m) };
  return { q: `${p}'s ${act} starts at ${clock(h, m)} and ends at ${clock(h2, m2)}. How long does it last?`, a: dur };
};

const COINS: [string, number][] = [["quarter", 25], ["dime", 10], ["nickel", 5], ["penny", 1]];
const plural = (name: string, n: number) => (n === 1 ? name : name === "penny" ? "pennies" : `${name}s`);
const genMoney: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["count"], medium: ["count", "change"], hard: ["count", "change", "bills"] }));
  if (kind === "count") {
    const coins = diff === "easy" ? COINS.slice(1) : COINS;
    const parts = coins.map(([n, v]) => [n, v, randInt(0, diff === "easy" ? 4 : 3)] as const).filter((c) => c[2] > 0);
    if (parts.length === 0) return { q: `How much money is 3 dimes?`, a: "30¢" };
    const total = parts.reduce((s, [, v, k]) => s + v * k, 0);
    return { q: `How much money is ${parts.map(([n, , k]) => `${k} ${plural(n, k)}`).join(", ")}?`, a: cents(total) };
  }
  if (kind === "bills") {
    const d = randInt(1, 5), q = randInt(0, 3), dm = randInt(0, 4), p = randInt(0, 4);
    const total = d * 100 + q * 25 + dm * 10 + p;
    return { q: `How much money is ${d} dollar bill${d > 1 ? "s" : ""}, ${q} quarters, ${dm} dimes and ${p} pennies?`, a: cents(total) };
  }
  const have = diff === "hard" ? randInt(2, 10) * 50 : randInt(5, 19) * 5, cost = randInt(1, have / 5 - 1) * 5;
  const item = pick(["pencil", "sticker", "eraser", "toy car", "apple"]);
  return { q: `You have ${cents(have)}. You buy a ${item} for ${cents(cost)}. How much money is left?`, a: cents(have - cost) };
};

const genCompareLength: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  if (grade <= 1) {
    const unit = pick(["paper clips", "cubes", "blocks"]);
    const a = randInt(3, 15), b = randInt(2, a - 1);
    const [n1, n2] = pick([["pencil", "crayon"], ["shoe", "spoon"], ["book", "eraser"], ["rope", "string"]]);
    if (diff === "hard" || rng() < 0.4) return { q: `A ${n1} is ${a} ${unit} long. A ${n2} is ${b} ${unit} long. How much longer is the ${n1}?`, a: `${a - b} ${unit}` };
    const c = randInt(2, 15);
    const items: [string, number][] = [[n1, a], [n2, b], ["ribbon", c === a || c === b ? a + 1 : c]];
    const longest = items.reduce((x, y) => (y[1] > x[1] ? y : x));
    return { q: `A ${items[0][0]} is ${items[0][1]} ${unit}, a ${items[1][0]} is ${items[1][1]} ${unit} and a ${items[2][0]} is ${items[2][1]} ${unit} long. Which is longest?`, a: longest[0] };
  }
  const kind = pick(by(diff, { easy: ["diff", "unit"], medium: ["diff", "total", "unit"], hard: ["total", "diff", "missing"] }));
  if (kind === "unit") return pick([
    { q: "Would you measure the length of a classroom in centimeters or meters?", a: "meters" },
    { q: "Would you measure the length of a pencil in inches or feet?", a: "inches" },
    { q: "Would you measure the length of a ladybug in centimeters or meters?", a: "centimeters" },
    { q: "Would you measure the height of a door in feet or inches? (pick the better unit)", a: "feet" },
    { q: "Would you measure the distance between two towns in meters or kilometers?", a: "kilometers" },
    { q: "Would you measure the length of a paper clip in centimeters or meters?", a: "centimeters" },
  ]);
  const unit = pick(["cm", "in", "m", "ft"]);
  const a = randInt(10, 90), b = randInt(5, a - 1);
  if (kind === "diff") return { q: `A red ribbon is ${a} ${unit} long. A blue ribbon is ${b} ${unit} long. How much longer is the red ribbon?`, a: `${a - b} ${unit}` };
  if (kind === "total") return { q: `Two pieces of string are ${a} ${unit} and ${b} ${unit} long. What is their total length?`, a: `${a + b} ${unit}` };
  return { q: `A board was ${a} ${unit} long. A piece was cut off and now it is ${b} ${unit} long. How long was the piece cut off?`, a: `${a - b} ${unit}` };
};

const genMassVolume: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["unit", "add"], medium: ["add", "sub", "mult", "unit"], hard: ["mult", "div", "sub", "twoStep"] }));
  if (kind === "unit") return pick([
    { q: "Would you measure the mass of an apple in grams or kilograms?", a: "grams" },
    { q: "Would you measure the mass of a dog in grams or kilograms?", a: "kilograms" },
    { q: "Would you measure the water in a bathtub in milliliters or liters?", a: "liters" },
    { q: "Would you measure the medicine in a spoon in milliliters or liters?", a: "milliliters" },
    { q: "Would you measure the mass of a paper clip in grams or kilograms?", a: "grams" },
  ]);
  const unit = pick(["kg", "g", "L"]);
  const a = randInt(4, unit === "g" ? 90 : 40), b = randInt(2, a - 1);
  const thing = unit === "L" ? pick(["juice", "water", "paint"]) : unit === "g" ? pick(["sugar", "salt", "butter", "cheese"]) : pick(["flour", "rice", "sand", "potatoes"]);
  if (kind === "add") return { q: `One bag holds ${a} ${unit} of ${thing}. Another holds ${b} ${unit}. How much is there altogether?`, a: `${a + b} ${unit}` };
  if (kind === "sub") return { q: `A container had ${a} ${unit} of ${thing}. ${b} ${unit} was used. How much is left?`, a: `${a - b} ${unit}` };
  const each = randInt(2, 9), n = randInt(2, 9);
  if (kind === "mult") return { q: `Each bucket holds ${each} ${unit} of ${thing}. How much do ${n} buckets hold?`, a: `${each * n} ${unit}` };
  if (kind === "div") return { q: `${each * n} ${unit} of ${thing} is shared equally into ${n} containers. How much goes in each?`, a: `${each} ${unit}` };
  const used = randInt(1, each * n - 1);
  return { q: `${n} bags of ${thing} hold ${each} ${unit} each. ${used} ${unit} is used. How much is left?`, a: `${each * n - used} ${unit}` };
};

const DATA_SETS: [string, string[]][] = [
  ["favorite fruit", ["apples", "bananas", "grapes", "oranges"]],
  ["favorite pet", ["dogs", "cats", "fish", "birds"]],
  ["favorite sport", ["soccer", "basketball", "tennis", "swimming"]],
  ["favorite color", ["red", "blue", "green", "yellow"]],
];
const genDataTally: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [topic, cats] = pick(DATA_SETS);
  const k = diff === "easy" ? 3 : 4;
  const maxV = grade <= 1 ? 10 : grade === 2 ? 20 : 30;
  // distinct values so "most"/"least" always has one answer
  const vals: number[] = [];
  while (vals.length < k) { const v = randInt(1, maxV); if (!vals.includes(v)) vals.push(v); }
  const scale = grade >= 3 && diff !== "easy" ? pick([2, 5]) : 1;
  if (scale > 1) { vals.length = 0; while (vals.length < k) { const v = randInt(1, 8) * scale; if (!vals.includes(v)) vals.push(v); } }
  const data = cats.slice(0, k).map((c, i) => [c, vals[i]] as const);
  const table = scale > 1
    ? `In a picture graph of ${topic}, each ★ means ${scale} votes: ${data.map(([c, v]) => `${c} ${v / scale}★`).join(", ")}.`
    : `A class voted for their ${topic}: ${data.map(([c, v]) => `${c} ${v}`).join(", ")}.`;
  const kind = pick(["more", "total", "most", "least", "one"]);
  const [c1, v1] = data[0], [c2, v2] = data[1];
  if (kind === "more") { const [big, small] = v1 >= v2 ? [data[0], data[1]] : [data[1], data[0]]; return { q: `${table} How many more votes did ${big[0]} get than ${small[0]}?`, a: `${big[1] - small[1]}` }; }
  if (kind === "total") return { q: `${table} How many votes were there in total?`, a: `${data.reduce((s, [, v]) => s + v, 0)}` };
  if (kind === "most") return { q: `${table} Which got the most votes?`, a: data.reduce((x, y) => (y[1] > x[1] ? y : x))[0] };
  if (kind === "least") return { q: `${table} Which got the fewest votes?`, a: data.reduce((x, y) => (y[1] < x[1] ? y : x))[0] };
  return { q: `${table} How many votes did ${c2} get?`, a: `${v2}` };
};

const genHalvesQuarters: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const parts = grade <= 1 ? [2, 4] : [2, 3, 4];
  const name: Record<number, [string, string]> = { 2: ["a half", "halves"], 3: ["a third", "thirds"], 4: ["a quarter (a fourth)", "quarters"] };
  const p = pick(parts), thing = pick(["pizza", "sandwich", "square", "circle", "pie", "rectangle"]);
  const kind = pick(by(diff, { easy: ["name", "howMany"], medium: ["name", "howMany", "bigger"], hard: ["bigger", "count", "howMany"] }));
  if (kind === "name") return { q: `A ${thing} is cut into ${p} equal parts. What is each part called?`, a: name[p][0] };
  if (kind === "howMany") return { q: `How many ${name[p][1]} make one whole?`, a: `${p}` };
  if (kind === "bigger") {
    const [x, y] = pick([[2, 4], [2, 3], [3, 4]].filter(([a, b]) => parts.includes(a) && parts.includes(b)));
    return { q: `Which piece is bigger: ${name[x][0].replace(/ \(.*\)/, "")} or ${name[y][0].replace(/ \(.*\)/, "")} of the same ${thing}?`, a: name[x][0].replace(/ \(.*\)/, "") };
  }
  return { q: `A ${thing} is cut into ${p} equal parts and you eat 1 part. How many parts are left?`, a: `${p - 1}` };
};

const genArrays: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const r = randInt(2, by(diff, { easy: 4, medium: 5, hard: 9 })), c = randInt(2, by(diff, { easy: 5, medium: 5, hard: 9 }));
  const kind = pick(by(diff, { easy: ["total", "repeat"], medium: ["total", "repeat", "back"], hard: ["back", "mult", "total"] }));
  if (kind === "total") return { q: `An array has ${r} rows with ${c} stars in each row. How many stars are there?`, a: `${r * c}` };
  if (kind === "repeat") return { q: `Write ${r} rows of ${c} as repeated addition.`, a: Array(r).fill(c).join(" + ") };
  if (kind === "back") return { q: `${Array(r).fill(c).join(" + ")} = __ × ${c}`, a: `${r}` };
  return { q: `Chairs are set out in ${r} rows of ${c}. Write a multiplication sentence and find the total.`, a: `${r} × ${c} = ${r * c}` };
};

// ===================================================================== grade 3 operations
const genMultFacts: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = diff === "easy" ? pick([0, 1, 2, 5, 10]) : randInt(2, diff === "medium" ? 10 : 12);
  const b = randInt(diff === "easy" ? 1 : 2, diff === "hard" ? 12 : 10);
  return pick([{ q: `${a} × ${b} = ?`, a: `${a * b}` }, { q: `${b} × ${a} = ?`, a: `${a * b}` }]);
};
const genDivFacts: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const b = diff === "easy" ? pick([1, 2, 5, 10]) : randInt(2, diff === "medium" ? 10 : 12);
  const qn = randInt(1, diff === "hard" ? 12 : 10);
  return { q: `${b * qn} ÷ ${b} = ?`, a: `${qn}` };
};
const genMultMissing: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, diff === "easy" ? 5 : 10), b = randInt(2, diff === "hard" ? 12 : 10), p = a * b;
  const kind = pick(by(diff, { easy: ["a_"], medium: ["a_", "_b", "p/_"], hard: ["_b", "p/_", "_/a", "eq"] }));
  if (kind === "a_") return { q: `${a} × __ = ${p}`, a: `${b}` };
  if (kind === "_b") return { q: `__ × ${b} = ${p}`, a: `${a}` };
  if (kind === "p/_") return { q: `${p} ÷ __ = ${a}`, a: `${b}` };
  if (kind === "_/a") return { q: `__ ÷ ${a} = ${b}`, a: `${p}` };
  return { q: `${p} = ${a} × __`, a: `${b}` };
};
const genMultBy10s: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, 9), t = randInt(1, 9) * 10;
  if (diff === "hard" && rng() < 0.4) return { q: `__ × ${t} = ${a * t}`, a: `${a}` };
  if (diff === "hard" && rng() < 0.4) { const t2 = randInt(2, 9) * 10; return { q: `${t2} × ${t} = ?`, a: `${t2 * t}` }; }
  return pick([{ q: `${a} × ${t} = ?`, a: `${a * t}` }, { q: `${t} × ${a} = ?`, a: `${a * t}` }]);
};
const genMultDivWord: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, diff === "easy" ? 5 : 9), b = randInt(2, diff === "hard" ? 12 : 9), p = pick(NAMES);
  return pick([
    { q: `${p} has ${a} boxes with ${b} crayons in each box. How many crayons in all?`, a: `${a * b}` },
    { q: `There are ${a * b} cookies shared equally among ${a} friends. How many does each friend get?`, a: `${b}` },
    { q: `A garden has ${a} rows of ${b} plants. How many plants are there?`, a: `${a * b}` },
    { q: `${a * b} students get into teams of ${b}. How many teams are there?`, a: `${a}` },
    { q: `Each pack has ${b} stickers. ${p} buys ${a} packs. How many stickers is that?`, a: `${a * b}` },
    { q: `${a * b} eggs are packed into cartons of ${b}. How many cartons are filled?`, a: `${a}` },
  ]);
};
const genTwoStepWord: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const p = pick(NAMES);
  const big = grade >= 4 ? 4 : 1;
  const a = randInt(3, 9 * big), b = randInt(2, 9), c = randInt(2, 9);
  const templates = [
    () => ({ q: `${p} buys ${b} packs of pens with ${a} pens in each pack, then gives away ${c} pens. How many pens are left?`, a: `${a * b - c}` }),
    () => ({ q: `${p} has $${a * b + c * 5}. ${p} buys ${b} books for $${a} each. How much money is left?`, a: `$${c * 5}` }),
    () => ({ q: `A bus has ${a} passengers. At the first stop ${Math.min(c, a)} get off and ${b} get on. How many passengers are on the bus now?`, a: `${a - Math.min(c, a) + b}` }),
    () => ({ q: `There are ${b} shelves with ${a} books each. ${c} more books are added. How many books are there now?`, a: `${a * b + c}` }),
    () => ({ q: `${p} picks ${a * b} apples and puts them equally into ${b} baskets. Then ${p} eats ${Math.min(c, a)} apples from one basket. How many apples are left in that basket?`, a: `${a - Math.min(c, a)}` }),
    () => { const kids = randInt(2, 4); return { q: `Tickets cost $${b} for children and $${c + b} for adults. How much do ${kids} children and 1 adult pay altogether?`, a: `$${kids * b + c + b}` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 4) : templates)();
};
const genNumberPatterns: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  if (grade >= 5 && diff !== "easy" && rng() < 0.6) {
    const s1 = randInt(1, 5), s2 = s1 * randInt(2, 3), n = randInt(4, 6);
    return { q: `Pattern A starts at 0 and adds ${s1}. Pattern B starts at 0 and adds ${s2}. What is the ${n}th term of each pattern? (the first term is 0)`, a: `A: ${s1 * (n - 1)}, B: ${s2 * (n - 1)}` };
  }
  const mult = grade >= 4 && (diff === "hard" || (diff === "medium" && rng() < 0.4));
  const start = randInt(1, mult ? 5 : 20), step = mult ? randInt(2, 3) : randInt(2, grade >= 4 ? 25 : 10);
  const down = !mult && diff !== "easy" && rng() < 0.3;
  const term = (i: number) => (mult ? start * Math.pow(step, i) : down ? start + step * 6 - i * step : start + i * step);
  const seq = [0, 1, 2, 3].map(term);
  const rule = mult ? `multiply by ${step}` : down ? `subtract ${step}` : `add ${step}`;
  if (rng() < 0.5) return { q: `What is the rule? ${seq.join(", ")}, ...`, a: rule };
  return { q: `What are the next two numbers? ${seq.join(", ")}, __, __`, a: `${term(4)}, ${term(5)}` };
};

// ===================================================================== fractions
const genFractionsNumberLine: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = pick(by(diff, { easy: [2, 3, 4], medium: [3, 4, 6, 8], hard: [3, 4, 6, 8] }));
  const wholes = diff === "hard" ? 2 : 1;
  const k = randInt(1, d * wholes - 1);
  const kind = pick(["mark", "jumps"]);
  if (kind === "mark") return { q: `A number line from 0 to ${wholes} has each whole split into ${d} equal parts. What fraction is at the ${k}${k === 1 ? "st" : k === 2 ? "nd" : k === 3 ? "rd" : "th"} mark after 0?`, a: `${k}/${d}` };
  return { q: `How many jumps of 1/${d} do you make from 0 to reach ${k}/${d} on a number line?`, a: `${k}` };
};
const genEquivalentFractions: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const dens = grade <= 3 ? [2, 3, 4, 6] : [2, 3, 4, 5, 6, 10, 12];
  const d = pick(dens), n = randInt(1, d - 1), m = randInt(2, grade <= 3 ? 3 : 5);
  const kind = pick(by(diff, { easy: ["num", "whole"], medium: ["num", "den", "whole"], hard: ["num", "den", "check", "simplify"] }));
  if (kind === "num") return { q: `${n}/${d} = __/${d * m}`, a: `${n * m}` };
  if (kind === "den") return { q: `${n}/${d} = ${n * m}/__`, a: `${d * m}` };
  if (kind === "whole") {
    const w = randInt(1, 4), dd = pick([2, 3, 4, 6]);
    return pick([{ q: `${w * dd}/${dd} = ? (as a whole number)`, a: `${w}` }, { q: `Write ${w} as a fraction with denominator ${dd}.`, a: `${w * dd}/${dd}` }]);
  }
  if (kind === "simplify") { const f = frac(n * m, d * m); return { q: `Write ${n * m}/${d * m} as an equivalent fraction with the smallest possible denominator.`, a: fStr(f) }; }
  const ok = rng() < 0.5, n2 = ok ? n * m : n * m + 1;
  return { q: `Is ${n}/${d} equal to ${n2}/${d * m}? Answer yes or no.`, a: ok ? "yes" : "no" };
};
const genFractionsCompareSame: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const maxD = by(diff, { easy: 6, medium: 8, hard: 12 });
  if (rng() < 0.5) {
    const d = randInt(3, maxD), a = randInt(1, d - 1), b = randInt(1, d - 1);
    return { q: `Compare: ${a}/${d} ___ ${b}/${d}  (use <, >, or =)`, a: a > b ? ">" : a < b ? "<" : "=" };
  }
  const n = randInt(1, 3), d1 = randInt(n + 1, maxD), d2 = randInt(n + 1, maxD);
  return pick([
    { q: `Compare: ${n}/${d1} ___ ${n}/${d2}  (use <, >, or =)`, a: d1 < d2 ? ">" : d1 > d2 ? "<" : "=" },
  ]);
};
const genAddLikeFractions: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = pick(by(diff, { easy: [3, 4, 5, 6, 8], medium: [4, 5, 6, 8, 10, 12], hard: [3, 4, 5, 6, 8, 10] }));
  const op = pick(["+", "-"]);
  if (diff === "hard") {
    const w1 = randInt(1, 5), w2 = randInt(1, w1), n1 = randInt(1, d - 1), n2 = randInt(1, d - 1);
    const A = w1 * d + n1, B = w2 * d + n2;
    if (op === "-" && A <= B) return { q: `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ?`, a: fMixed(frac(A + B, d)) };
    return { q: `${w1} ${n1}/${d} ${op} ${w2} ${n2}/${d} = ?`, a: fMixed(frac(op === "+" ? A + B : A - B, d)) };
  }
  let a = randInt(1, d - 1), b = randInt(1, d - 1);
  if (op === "-" && b > a) [a, b] = [b, a];
  const r = op === "+" ? a + b : a - b;
  const plain = r === 0 ? "0" : `${r}/${d}`;
  const simp = r === 0 ? "0" : fMixed(frac(r, d));
  return { q: `${a}/${d} ${op} ${b}/${d} = ?`, a: plain === simp ? plain : `${plain} (= ${simp})` };
};
const genMixedNumbers: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = pick([2, 3, 4, 5, 6, 8, diff === "hard" ? 12 : 10]), w = randInt(1, diff === "easy" ? 3 : 9), n = randInt(1, d - 1);
  if (rng() < 0.5) return { q: `Write ${w * d + n}/${d} as a mixed number.`, a: `${w} ${n}/${d}` };
  return { q: `Write ${w} ${n}/${d} as an improper fraction.`, a: `${w * d + n}/${d}` };
};
const genFractionTimesWhole: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = pick([2, 3, 4, 5, 6, 8, 10]), n = diff === "easy" ? 1 : randInt(1, d - 1), w = randInt(2, diff === "hard" ? 12 : 6);
  if (diff !== "easy" && rng() < 0.4) {
    const [unit, stuff] = pick([["cup", "flour"], ["liter", "juice"], ["meter", "ribbon"]]);
    const total = frac(n * w, d);
    return { q: `Each batch needs ${n}/${d} ${unit} of ${stuff}. How much ${stuff} is needed for ${w} batches?`, a: `${fMixed(total)} ${unit}${total.n > total.d ? "s" : ""}` };
  }
  return { q: `${w} × ${n}/${d} = ?`, a: fMixed(frac(n * w, d)) };
};
const genDecimalFractionConvert: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["t2d", "d2t"], medium: ["t2d", "h2d", "d2h"], hard: ["h2d", "d2h", "addTH", "compare"] }));
  if (kind === "t2d") { const n = randInt(1, 9); return { q: `Write ${n}/10 as a decimal.`, a: `0.${n}` }; }
  if (kind === "d2t") { const n = randInt(1, 9); return { q: `Write 0.${n} as a fraction.`, a: `${n}/10` }; }
  if (kind === "h2d") { const n = randInt(1, 99); return { q: `Write ${n}/100 as a decimal.`, a: num(n / 100) }; }
  if (kind === "d2h") { const n = randInt(11, 99); return { q: `Write ${num(n / 100)} as a fraction with denominator 100.`, a: `${n}/100` }; }
  if (kind === "addTH") { const t = randInt(1, 9), h = randInt(1, 9); return { q: `${t}/10 + ${h}/100 = ?`, a: `${t * 10 + h}/100 (= ${num((t * 10 + h) / 100)})` }; }
  const a = randInt(1, 99), b = randInt(1, 9) * 10;
  return { q: `Compare: ${num(a / 100)} ___ ${b / 100 === 1 ? 1 : num(b / 100)}  (use <, >, or =)`, a: a > b ? ">" : a < b ? "<" : "=" };
};
const genFractionDivisionInterp: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(1, diff === "hard" ? 11 : 5), b = randInt(2, 8);
  const kind = pick(["share", "write", "back"]);
  if (kind === "share") return { q: `${a} pizza${a > 1 ? "s are" : " is"} shared equally among ${b} friends. How much pizza does each friend get?`, a: `${fMixed(frac(a, b))} of a pizza` };
  if (kind === "write") return { q: `Write ${a} ÷ ${b} as a fraction or mixed number.`, a: fMixed(frac(a, b)) };
  return { q: `${a}/${b} means the same as ${a} ÷ __`, a: `${b}` };
};
const genFractionUnitDiv: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = randInt(2, 8), w = randInt(2, diff === "hard" ? 12 : 6);
  const kind = pick(by(diff, { easy: ["fw", "wf"], medium: ["fw", "wf", "word"], hard: ["fw", "wf", "word", "word2"] }));
  if (kind === "fw") return { q: `1/${d} ÷ ${w} = ?`, a: `1/${d * w}` };
  if (kind === "wf") return { q: `${w} ÷ 1/${d} = ?`, a: `${w * d}` };
  if (kind === "word") return { q: `How many 1/${d}-cup servings are in ${w} cups of yogurt?`, a: `${w * d}` };
  return { q: `${w} friends share 1/${d} of a pound of chocolate equally. What fraction of a pound does each get?`, a: `1/${d * w}` };
};

// ===================================================================== grade 4–5 number & operations
const genLargeNumbers: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = by(diff, { easy: 99_999, medium: 999_999, hard: 9_999_999 });
  let n = randInt(1000, max);
  if (rng() < 0.4) { const s = `${n}`.split(""); s[randInt(1, s.length - 1)] = "0"; n = parseInt(s.join(""), 10); }
  const kind = pick(["fromWords", "toExp", "fromExp", "value"]);
  if (kind === "fromWords") return { q: `Write in standard form: ${numberToWords(n)}`, a: comma(n) };
  if (kind === "toExp") return { q: `Write ${comma(n)} in expanded form.`, a: expandedForm(n) };
  if (kind === "fromExp") return { q: `Write in standard form: ${expandedForm(n)}`, a: comma(n) };
  // only ask about a digit that appears once, so "the 7" is unambiguous
  const s = `${n}`;
  const unique = s.split("").map((c, i) => [c, i] as const).filter(([c]) => c !== "0" && s.indexOf(c) === s.lastIndexOf(c));
  if (!unique.length) return { q: `Write in standard form: ${numberToWords(n)}`, a: comma(n) };
  const [dgt, i] = pick(unique);
  return { q: `What is the value of the ${dgt} in ${comma(n)}?`, a: comma(parseInt(dgt, 10) * Math.pow(10, s.length - 1 - i)) };
};
const genCompareLarge: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const max = by(diff, { easy: 9_999, medium: 999_999, hard: 9_999_999 });
  const a = randInt(1000, max);
  let b: number;
  if (diff === "easy") b = randInt(1000, max);
  else { const s = `${a}`.split(""); const i = randInt(1, s.length - 1); s[i] = `${randInt(0, 9)}`; b = parseInt(s.join(""), 10); }
  if (rng() < 0.6) return { q: `Compare: ${comma(a)} ___ ${comma(b)}  (use <, >, or =)`, a: a > b ? ">" : a < b ? "<" : "=" };
  const c = randInt(1000, max);
  const set = [...new Set([a, b, c])];
  if (set.length < 3) set.push(max - 1);
  return { q: `Order from least to greatest: ${set.map(comma).join(", ")}`, a: [...set].sort((x, y) => x - y).map(comma).join(", ") };
};
const genAddSubMulti: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const max = by(diff, { easy: 9_999, medium: 99_999, hard: 999_999 });
  const op = pick(["+", "-"]);
  let a = randInt(1000, max), b = randInt(100, max);
  if (op === "-" && b > a) [a, b] = [b, a];
  if (op === "+" && grade <= 4 && a + b > 1_000_000) b = randInt(100, 1_000_000 - a);
  return { q: `${comma(a)} ${op} ${comma(b)} = ?`, a: comma(op === "+" ? a + b : a - b) };
};
const genMultMulti: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  let a: number, b: number;
  if (diff === "easy") { a = randInt(12, 99); b = randInt(2, 9); }
  else if (diff === "medium") { if (grade >= 5) { a = randInt(12, 99); b = randInt(12, 99); } else { a = randInt(100, 9999); b = randInt(2, 9); } }
  else if (grade >= 5) { a = randInt(100, 999); b = randInt(12, 99); }
  else { a = randInt(12, 99); b = randInt(12, 99); }
  return { q: `${comma(a)} × ${b} = ?`, a: comma(a * b) };
};
const genLongDivision: Gen = (grade, diff, rng) => {
  const { randInt } = makeHelpers(rng);
  const twoDigit = grade >= 5 && diff !== "easy";
  const divisor = twoDigit ? randInt(11, diff === "hard" ? 49 : 25) : randInt(2, 9);
  const quotient = randInt(diff === "easy" ? 11 : 21, twoDigit ? 399 : diff === "hard" ? 1999 : 299);
  const rem = diff === "easy" && rng() < 0.5 ? 0 : randInt(0, divisor - 1);
  const dividend = divisor * quotient + rem;
  return { q: `${comma(dividend)} ÷ ${divisor} = ?`, a: rem ? `${comma(quotient)} R${rem}` : comma(quotient) };
};
const genFactorsMultiples: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["isFactor", "multiples"], medium: ["list", "isFactor", "multiples", "isMultiple"], hard: ["list", "pairs", "common"] }));
  if (kind === "list") { const n = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 64, 72]); return { q: `List all the factors of ${n}.`, a: factorsOf(n).join(", ") }; }
  if (kind === "pairs") { const n = pick([24, 30, 36, 48, 60, 72]); const f = factorsOf(n).filter((x) => x * x <= n); return { q: `List all the factor pairs of ${n}.`, a: f.map((x) => `${x} × ${n / x}`).join(", ") }; }
  if (kind === "isFactor") { const f = randInt(2, 9), n = rng() < 0.5 ? f * randInt(2, 12) : f * randInt(2, 12) + randInt(1, f - 1); return { q: `Is ${f} a factor of ${n}? Answer yes or no.`, a: n % f === 0 ? "yes" : "no" }; }
  if (kind === "isMultiple") { const f = randInt(3, 12), n = randInt(20, 100); return { q: `Is ${n} a multiple of ${f}? Answer yes or no.`, a: n % f === 0 ? "yes" : "no" }; }
  if (kind === "common") { const a = randInt(2, 6), b = randInt(a + 1, 9); const out: number[] = []; for (let m = 1; out.length < 2; m++) if ((m % a === 0) && (m % b === 0)) out.push(m); return { q: `What are the first two common multiples of ${a} and ${b}?`, a: out.join(", ") }; }
  const f = randInt(2, 12), k = diff === "easy" ? 5 : 6;
  return { q: `List the first ${k} multiples of ${f}.`, a: Array.from({ length: k }, (_, i) => f * (i + 1)).join(", ") };
};
const genPrimeComposite: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["which"], medium: ["which", "next"], hard: ["which", "between", "next"] }));
  if (kind === "which") {
    const n = randInt(2, by(diff, { easy: 30, medium: 60, hard: 100 }));
    return { q: `Is ${n} prime or composite?`, a: isPrime(n) ? "prime" : "composite" };
  }
  if (kind === "next") { const n = randInt(10, 90); let p = n + 1; while (!isPrime(p)) p++; return { q: `What is the smallest prime number greater than ${n}?`, a: `${p}` }; }
  const lo = randInt(1, 8) * 10, hi = lo + 10;
  const ps: number[] = []; for (let i = lo + 1; i < hi; i++) if (isPrime(i)) ps.push(i);
  return { q: `List the prime numbers between ${lo} and ${hi}.`, a: ps.length ? ps.join(", ") : "none" };
};
const genMultComparison: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, 12), k = randInt(2, diff === "hard" ? 12 : 9), p = pick(NAMES);
  return pick([
    { q: `${p} has ${a} stickers. Leo has ${k} times as many. How many stickers does Leo have?`, a: `${a * k}` },
    { q: `${a * k} is ${k} times as many as what number?`, a: `${a}` },
    { q: `How many times as many is ${a * k} as ${a}?`, a: `${k}` },
    { q: `A red ribbon is ${k} times as long as a blue ribbon. The blue ribbon is ${a} cm. How long is the red ribbon?`, a: `${a * k} cm` },
    { q: `A tree is ${a * k} feet tall. That is ${k} times as tall as a bush. How tall is the bush?`, a: `${a} feet` },
  ]);
};
const genPowersOf10: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const p = randInt(1, 3), pow = Math.pow(10, p);
  const kind = pick(by(diff, { easy: ["mulW", "exp"], medium: ["mulD", "divW", "exp"], hard: ["mulD", "divD", "expMul"] }));
  if (kind === "exp") return { q: `Write 10^${p} as a whole number.`, a: comma(pow) };
  if (kind === "mulW") { const n = randInt(2, 99); return { q: `${n} × ${comma(pow)} = ?`, a: comma(n * pow) }; }
  if (kind === "divW") { const n = randInt(1, 99) * pow; return { q: `${comma(n)} ÷ ${comma(pow)} = ?`, a: comma(n / pow) }; }
  const d = randInt(11, 999) / 100;
  if (kind === "mulD") return { q: `${num(d)} × ${comma(pow)} = ?`, a: num(d * pow) };
  if (kind === "divD") return { q: `${num(d)} ÷ ${comma(pow)} = ?`, a: num(d / pow) };
  return { q: `${num(d)} × 10^${p} = ?`, a: num(d * pow) };
};
const PLACE = ["tenths", "hundredths", "thousandths"];
const genDecimalPlaceValue: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const w = randInt(0, 99), ds = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
  const places = diff === "easy" ? 2 : 3;
  const str = `${w}.${ds.slice(0, places).join("")}`;
  const kind = pick(["value", "place", "fromExp", "toExp"]);
  const i = randInt(0, places - 1);
  if (kind === "value") return { q: `What is the value of the digit in the ${PLACE[i]} place of ${str}?`, a: num(ds[i] / Math.pow(10, i + 1)) };
  if (kind === "place") return { q: `What digit is in the ${PLACE[i]} place of ${str}?`, a: `${ds[i]}` };
  const terms = [w ? `${w}` : "", ...ds.slice(0, places).map((dg, j) => num(dg / Math.pow(10, j + 1)))].filter(Boolean);
  if (kind === "fromExp") return { q: `Write in standard form: ${terms.join(" + ")}`, a: str };
  return { q: `Write ${str} in expanded form.`, a: terms.join(" + ") };
};
const genWriteExpressions: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(2, 15), b = randInt(2, 15), c = randInt(2, 6);
  const kind = pick(by(diff, { easy: ["eval1", "write1"], medium: ["write1", "write2", "eval2"], hard: ["write2", "times", "eval2"] }));
  if (kind === "write1") return { q: `Write an expression: add ${a} and ${b}, then multiply by ${c}.`, a: `(${a} + ${b}) × ${c}` };
  if (kind === "write2") return { q: `Write an expression: subtract ${Math.min(a, b)} from ${Math.max(a, b) + 10}, then divide by ${c}.`, a: `(${Math.max(a, b) + 10} - ${Math.min(a, b)}) ÷ ${c}` };
  if (kind === "eval1") return { q: `Evaluate: (${a} + ${b}) × ${c}`, a: `${(a + b) * c}` };
  if (kind === "eval2") { const x = c * randInt(2, 9); return { q: `Evaluate: ${a} × (${x} ÷ ${c}) - ${Math.min(b, a)}`, a: `${a * (x / c) - Math.min(b, a)}` }; }
  return { q: `Without calculating: how many times as large is ${c} × (${a * 37} + ${b * 11}) as ${a * 37} + ${b * 11}?`, a: `${c}` };
};
type Conv = [string, string, number];
const CONVS: Conv[] = [["km", "m", 1000], ["m", "cm", 100], ["cm", "mm", 10], ["kg", "g", 1000], ["L", "mL", 1000], ["hours", "minutes", 60], ["minutes", "seconds", 60], ["feet", "inches", 12], ["yards", "feet", 3], ["pounds", "ounces", 16], ["gallons", "quarts", 4], ["days", "hours", 24]];
const genUnitConversion: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [big, small, f] = pick(diff === "easy" ? CONVS.filter((c) => [10, 100, 1000, 60, 12].includes(c[2])) : CONVS);
  const kind = pick(by(diff, { easy: ["down"], medium: ["down", "up"], hard: grade >= 5 ? ["dec", "up", "mixed"] : ["up", "mixed", "down"] }));
  const n = randInt(2, 12);
  if (kind === "down") return { q: `${n} ${big} = __ ${small}`, a: `${comma(n * f)} ${small}` };
  if (kind === "up") return { q: `${comma(n * f)} ${small} = __ ${big}`, a: `${n} ${big}` };
  if (kind === "mixed") { const r = randInt(1, f - 1); return { q: `${n} ${big} ${r} ${small} = __ ${small}`, a: `${comma(n * f + r)} ${small}` }; }
  if ([10, 100, 1000].includes(f)) { const part = randInt(1, f - 1); return { q: `${comma(n * f + part)} ${small} = __ ${big} (write as a decimal)`, a: `${num(n + part / f)} ${big}` }; }
  return { q: `${comma(n * f)} ${small} = __ ${big}`, a: `${n} ${big}` };
};

// ===================================================================== geometry & graphing
const QUAD_FACTS: [string, string][] = [
  ["I have 4 equal sides and 4 right angles. What am I?", "square"],
  ["I have opposite sides equal and 4 right angles, but my sides are not all equal. What am I?", "rectangle"],
  ["I have 4 equal sides but no right angles. What am I?", "rhombus"],
  ["I have exactly one pair of parallel sides. What am I?", "trapezoid"],
  ["I have two pairs of parallel sides and no right angles, and my sides are not all equal. What am I?", "parallelogram"],
  ["I have two pairs of equal sides that are next to each other, not opposite. What am I?", "kite"],
  ["Is every square a rectangle? Answer yes or no.", "yes"],
  ["Is every rectangle a square? Answer yes or no.", "no"],
  ["Is every rhombus a parallelogram? Answer yes or no.", "yes"],
  ["Is every square a rhombus? Answer yes or no.", "yes"],
  ["How many sides does every quadrilateral have?", "4"],
  ["How many right angles does a rectangle have?", "4"],
];
const genQuadrilaterals: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  if (grade >= 4 && (diff === "hard" || (diff === "medium" && rng() < 0.3))) {
    const a = randInt(50, 120), b = randInt(50, 120), c = randInt(50, 120);
    if (a + b + c < 350 && a + b + c > 190) return { q: `A quadrilateral has angles of ${a}°, ${b}° and ${c}°. What is the fourth angle?`, a: `${360 - a - b - c}°` };
  }
  const [q, a] = pick(diff === "easy" ? QUAD_FACTS.slice(0, 6).concat(QUAD_FACTS.slice(10)) : QUAD_FACTS);
  return { q, a };
};
const genAnglesMeasure: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["classify", "turn"], medium: ["classify", "right", "straight"], hard: ["straight", "full", "right", "clock"] }));
  if (kind === "classify") { const a = pick([randInt(5, 89), 90, randInt(91, 179), 180]); return { q: `Is an angle of ${a}° acute, right, obtuse or straight?`, a: a < 90 ? "acute" : a === 90 ? "right" : a < 180 ? "obtuse" : "straight" }; }
  if (kind === "turn") return pick([{ q: "How many degrees are in a quarter turn?", a: "90°" }, { q: "How many degrees are in a half turn?", a: "180°" }, { q: "How many degrees are in a full turn?", a: "360°" }, { q: "How many degrees are in a three-quarter turn?", a: "270°" }]);
  if (kind === "right") { const a = randInt(10, 80); return { q: `Two angles together make a right angle. One is ${a}°. What is the other?`, a: `${90 - a}°` }; }
  if (kind === "straight") { const a = randInt(15, 165); return { q: `Two angles sit side by side on a straight line. One is ${a}°. What is the other?`, a: `${180 - a}°` }; }
  if (kind === "full") { const a = randInt(40, 150), b = randInt(40, 150); return { q: `Three angles meet at a point and make a full turn. Two of them are ${a}° and ${b}°. What is the third?`, a: `${360 - a - b}°` }; }
  const h = pick([1, 2, 3, 4, 5, 6]);
  return { q: `What is the smaller angle between the hands of a clock at ${h}:00?`, a: `${h * 30}°` };
};
const SYMMETRY: [string, string][] = [
  ["a square", "4"], ["a rectangle (not a square)", "2"], ["an equilateral triangle", "3"], ["an isosceles triangle", "1"],
  ["a scalene triangle", "0"], ["a regular pentagon", "5"], ["a regular hexagon", "6"], ["a regular octagon", "8"],
  ["a rhombus (not a square)", "2"], ["a kite", "1"], ["the capital letter H", "2"], ["the capital letter A", "1"],
  ["the capital letter F", "0"], ["the capital letter X", "2"], ["a parallelogram (not a rectangle)", "0"],
];
const LINE_FACTS: [string, string][] = [
  ["What do we call lines that never meet, no matter how far they go?", "parallel lines"],
  ["What do we call lines that cross to make right angles?", "perpendicular lines"],
  ["What do we call part of a line with two endpoints?", "a line segment"],
  ["What do we call part of a line with one endpoint that goes on forever in one direction?", "a ray"],
  ["What do we call an exact location, shown as a dot?", "a point"],
  ["Two rays that share an endpoint make what?", "an angle"],
];
const genLinesSymmetry: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  if (rng() < 0.6) { const [s, n] = pick(diff === "easy" ? SYMMETRY.slice(0, 7) : SYMMETRY); return { q: `How many lines of symmetry does ${s} have?`, a: n }; }
  const [q, a] = pick(LINE_FACTS);
  return { q, a };
};
const genCoordQ1: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const x = randInt(0, 9), y = randInt(0, 9);
  const kind = pick(by(diff, { easy: ["xcoord", "ycoord", "move"], medium: ["move", "dist", "xcoord"], hard: ["move2", "dist", "rect"] }));
  if (kind === "xcoord") return { q: `What is the x-coordinate of the point (${x}, ${y})?`, a: `${x}` };
  if (kind === "ycoord") return { q: `What is the y-coordinate of the point (${x}, ${y})?`, a: `${y}` };
  if (kind === "move") { const r = randInt(1, 6), u = randInt(1, 6); return { q: `Start at (${x}, ${y}). Move ${units(r)} right and ${units(u)} up. Where are you now?`, a: `(${x + r}, ${y + u})` }; }
  if (kind === "move2") { const r = randInt(1, x || 1), u = randInt(1, 6); return { q: `Start at (${Math.max(x, r)}, ${y}). Move ${units(r)} left and ${units(u)} up. Where are you now?`, a: `(${Math.max(x, r) - r}, ${y + u})` }; }
  if (kind === "dist") { const y2 = y + randInt(1, 8); return { q: `How many units apart are (${x}, ${y}) and (${x}, ${y2})?`, a: `${y2 - y}` }; }
  const w = randInt(2, 6), h = randInt(2, 6);
  return { q: `A rectangle has corners at (${x}, ${y}), (${x + w}, ${y}) and (${x + w}, ${y + h}). What is the fourth corner?`, a: `(${x}, ${y + h})` };
};
const genTriangleClassify: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["sides"], medium: ["sides", "angles"], hard: ["angles", "missing", "sides"] }));
  if (kind === "sides") {
    const a = randInt(3, 12);
    const [b, c] = pick([[a, a], [a, randInt(Math.ceil(a / 2) + 1, a * 2 - 1)], [a + 1, a + 2]]);
    const fixed = b === a && c === a ? "equilateral" : b === a || c === a || b === c ? "isosceles" : "scalene";
    return { q: `A triangle has sides of ${a} cm, ${b} cm and ${c} cm. Is it equilateral, isosceles or scalene?`, a: fixed };
  }
  const A = randInt(20, 100), B = randInt(20, 160 - A), C = 180 - A - B;
  if (kind === "missing") return { q: `A triangle has angles of ${A}° and ${B}°. What is the third angle?`, a: `${C}°` };
  const max = Math.max(A, B, C);
  return { q: `A triangle has angles of ${A}°, ${B}° and ${C}°. Is it acute, right or obtuse?`, a: max < 90 ? "acute" : max === 90 ? "right" : "obtuse" };
};

// ===================================================================== challenges
const genMysteryNumber: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(2, grade <= 1 ? 10 : 30);
  const a = randInt(2, 9), m = randInt(2, 5);
  const kind = pick(by(diff, { easy: ["add", "sub"], medium: ["add", "sub", "double"], hard: ["mulAdd", "digits", "double"] }));
  if (kind === "add") return { q: `I am thinking of a number. If I add ${a}, I get ${n + a}. What is my number?`, a: `${n}` };
  if (kind === "sub") return { q: `I am thinking of a number. If I take away ${Math.min(a, n)}, I get ${n - Math.min(a, n)}. What is my number?`, a: `${n}` };
  if (kind === "double") return { q: `I am thinking of a number. If I double it and add ${a}, I get ${2 * n + a}. What is my number?`, a: `${n}` };
  if (kind === "mulAdd") return { q: `I am thinking of a number. I multiply it by ${m} and then subtract ${a}. The answer is ${m * n - a}. What is my number?`, a: `${n}` };
  const o = randInt(0, 6), k = randInt(1, 9 - o);
  return { q: `I am a two-digit number. My tens digit is ${k} more than my ones digit. My digits add up to ${2 * o + k}. What number am I?`, a: `${(o + k) * 10 + o}` };
};
const LO_SHU = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
const genMagicSquare: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  let sq = LO_SHU.map((r) => [...r]);
  const turns = randInt(0, 3);
  for (let t = 0; t < turns; t++) sq = sq[0].map((_, c) => sq.map((r) => r[c]).reverse());
  if (rng() < 0.5) sq = sq.map((r) => [...r].reverse());
  const mul = diff === "easy" ? 1 : randInt(1, grade >= 4 ? 5 : 2), add = diff === "easy" ? 0 : randInt(0, grade >= 4 ? 20 : 5);
  sq = sq.map((r) => r.map((v) => v * mul + add));
  const sum = 15 * mul + 3 * add;
  const hide = diff === "hard" ? 2 : 1;
  const cells: [number, number][] = [];
  while (cells.length < hide) { const c: [number, number] = [randInt(0, 2), randInt(0, 2)]; if (!cells.some(([r, k]) => r === c[0] && k === c[1])) cells.push(c); }
  cells.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const rows = sq.map((r, i) => `Row ${i + 1}: ${r.map((v, j) => (cells.some(([a, b]) => a === i && b === j) ? "__" : v)).join(", ")}`).join(" | ");
  const told = diff === "hard" ? "has the same sum" : `adds up to ${sum}`;
  const answers = cells.map(([i, j]) => sq[i][j]);
  return { q: `In this magic square every row, column and diagonal ${told}. ${rows}. What ${hide === 1 ? "is the missing number" : "are the missing numbers, in reading order"}?`, a: answers.join(", ") };
};
const genMissingDigits: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const op = pick(by(diff, { easy: ["+"], medium: ["+", "-"], hard: grade >= 4 ? ["+", "-", "×"] : ["+", "-"] }));
  let a: number, b: number, c: number;
  if (op === "×") { a = randInt(12, 99); b = randInt(3, 9); c = a * b; }
  else { a = randInt(diff === "easy" ? 10 : 100, diff === "easy" ? 89 : 899); b = randInt(10, diff === "easy" ? 89 : 899); if (op === "-" && b > a) [a, b] = [b, a]; c = op === "+" ? a + b : a - b; }
  const which = pick(op === "×" ? [0, 2] : [0, 1, 2]);
  const parts = [`${a}`, `${b}`, `${c}`];
  const s = parts[which];
  const pos = randInt(0, s.length - 1);
  const digit = s[pos];
  parts[which] = s.slice(0, pos) + "□" + s.slice(pos + 1);
  return { q: `Find the missing digit: ${parts[0]} ${op} ${parts[1]} = ${parts[2]}`, a: digit };
};
const genChallengeLogic: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const p1 = pick(NAMES), p2 = pick(NAMES.filter((n) => n !== p1));
  const templates = [
    () => { const y = randInt(5, 15), d = randInt(2, 8); return { q: `${p1} is ${d} years older than ${p2}. Together their ages add up to ${2 * y + d}. How old is ${p2}?`, a: `${y}` }; },
    () => { const ch = randInt(3, 15), co = randInt(2, 12); return { q: `A farm has chickens and cows. There are ${ch + co} heads and ${2 * ch + 4 * co} legs. How many cows are there?`, a: `${co}` }; },
    () => { const s = randInt(5, 40); return { q: `Three consecutive whole numbers add up to ${3 * s + 3}. What is the smallest number?`, a: `${s}` }; },
    () => { const pen = randInt(1, 9), x = randInt(2, 9); return { q: `A pen and a notebook cost $${2 * pen + x} together. The notebook costs $${x} more than the pen. How much does the pen cost?`, a: `$${pen}` }; },
    () => { const k = randInt(3, 9); return { q: `A snail climbs ${k} feet up a wall each day and slides back 1 foot each night. The wall is ${k * 3 + 1} feet tall. On which day does it reach the top?`, a: `day ${Math.ceil((k * 3 + 1 - k) / (k - 1)) + 1}` }; },
    () => { const n = randInt(4, 12); return { q: `${n} people each shake hands once with every other person. How many handshakes are there?`, a: `${(n * (n - 1)) / 2}` }; },
  ];
  return pick(diff === "easy" ? templates.slice(0, 3) : templates)();
};

export const MATH_ELEM_GENERATORS: Record<string, Gen> = {
  count_120: genCount120, tens_ones: genTensOnes, expanded_form: genExpandedForm, skip_counting: genSkipCounting,
  odd_even: genOddEven, ten_more_less: genTenMoreLess,
  add_within_10: genAddWithin(10), sub_within_10: genSubWithin(10), add_within_20: genAddWithin(20), sub_within_20: genSubWithin(20),
  make_ten: genMakeTen, doubles: genDoubles, missing_addend: genMissingAddend, equal_sign: genEqualSign,
  three_addends: genThreeAddends, add_tens: genAddTens, add_2d_1d: genAdd2d1d, add_2d: genAdd2d, sub_2d: genSub2d, add_3d: genAdd3d,
  time_hour_half: genTimeHourHalf, time_5min: genTime5min, time_minute: genTimeMinute, elapsed_time: genElapsedTime,
  money: genMoney, compare_length: genCompareLength, mass_volume: genMassVolume, data_tally: genDataTally,
  halves_quarters: genHalvesQuarters, arrays: genArrays,
  mult_facts: genMultFacts, div_facts: genDivFacts, mult_missing: genMultMissing, mult_by_10s: genMultBy10s,
  mult_div_word: genMultDivWord, two_step_word: genTwoStepWord, number_patterns: genNumberPatterns,
  fractions_number_line: genFractionsNumberLine, equivalent_fractions: genEquivalentFractions,
  fractions_compare_same: genFractionsCompareSame, add_like_fractions: genAddLikeFractions, mixed_numbers: genMixedNumbers,
  fraction_times_whole: genFractionTimesWhole, decimal_fraction_convert: genDecimalFractionConvert,
  fraction_division_interp: genFractionDivisionInterp, fraction_unit_div: genFractionUnitDiv,
  large_numbers: genLargeNumbers, compare_large: genCompareLarge, add_sub_multi: genAddSubMulti, mult_multi: genMultMulti,
  long_division: genLongDivision, factors_multiples: genFactorsMultiples, prime_composite: genPrimeComposite,
  mult_comparison: genMultComparison, powers_of_10: genPowersOf10, decimal_place_value: genDecimalPlaceValue,
  write_expressions: genWriteExpressions, unit_conversion: genUnitConversion,
  quadrilaterals: genQuadrilaterals, angles_measure: genAnglesMeasure, lines_symmetry: genLinesSymmetry,
  coordinate_plane_q1: genCoordQ1, triangle_classify: genTriangleClassify,
  challenge_mystery_number: genMysteryNumber, challenge_magic_square: genMagicSquare,
  challenge_missing_digits: genMissingDigits, challenge_logic: genChallengeLogic,
};
