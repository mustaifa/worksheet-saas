/**
 * Senior challenges (Grades 11–12): real-world problems with real numbers —
 * loans and credit cards, medical-test paradoxes, card check digits and toy
 * RSA, carbon dating, orbits and braking distances, airbags and car exhaust,
 * genetics odds, password cracking, and spotting bias in headlines.
 *
 * Every numeric answer is computed in code from the randomised inputs, and
 * every rounding instruction is stated in the question so the answer key can
 * be marked exactly (Live Quiz / Family Challenge compare numbers).
 */
import { Topic, Gen, Difficulty, Question, makeHelpers, skillTopic as T, RNG } from "./types";
import { frac, fStr, piStr, nCr, NAMES } from "./mathUtil";
import { bankGen, Item } from "./bank";

type Tpl = () => Question;
const fx = (x: number, dp: number) => {
  const s = x.toFixed(dp);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
};
const cents = (x: number) => `$${x.toFixed(2)}`;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]];

/** Easy draws from the first `easy` templates; medium/hard from all of them. */
function choose(d: Difficulty, rng: RNG, tpls: Tpl[], easy: number): Question {
  const { pick } = makeHelpers(rng);
  return pick(d === "easy" ? tpls.slice(0, easy) : tpls)();
}
function modPow(base: number, exp: number, mod: number): number {
  // mod ≤ 100 here, so every product stays far below 2^53
  let r = 1, b = base % mod, e = exp;
  while (e > 0) { if (e % 2 === 1) r = (r * b) % mod; b = (b * b) % mod; e = Math.floor(e / 2); }
  return r;
}

export const SENIOR_MATH_TOPICS: Topic[] = [
  T("challenge_money_math", "Challenge: Money Math — Loans, Credit Cards & Inflation", ["loan payment", "credit card interest", "apr vs apy", "inflation", "rule of 72", "financial math"], "Real financial decisions: car-loan payments, how long a credit card takes to pay off, APR vs APY, inflation and real returns."),
  T("challenge_optimization", "Challenge: Optimization & Rates of Change", ["optimization", "related rates", "maximum area", "maximize revenue"], "Real optimization problems — fencing, open boxes, ticket pricing, sliding ladders and inflating balloons."),
  T("challenge_probability_paradoxes", "Challenge: Probability Paradoxes", ["monty hall", "birthday problem", "bayes theorem", "false positive", "probability paradox"], "Results that surprise even adults: medical false positives, the birthday problem, Monty Hall, overbooked flights and gambler's ruin."),
  T("challenge_number_codes", "Challenge: Number Theory & Secret Codes", ["check digit", "luhn algorithm", "isbn", "rsa", "modular arithmetic", "last two digits"], "Modular arithmetic at work: card and ISBN check digits, toy RSA keys, last digits of huge powers and calendar puzzles."),
  T("challenge_exponential_world", "Challenge: Modelling with Exponentials & Logs", ["carbon dating", "richter scale", "decibels", "newton's law of cooling", "half life medicine"], "Exponentials and logs in the real world: carbon dating, earthquakes, decibels, cooling coffee and medicine doses."),
];
export const SENIOR_SCIENCE_TOPICS: Topic[] = [
  T("challenge_physics_world", "Challenge: Physics in the Real World", ["physics challenge", "orbital period", "escape velocity", "braking distance", "real world physics"], "Real physics with real numbers: dropped phones, the ISS's orbit, escape velocity, braking on ice and messages to Mars."),
  T("challenge_chemistry_world", "Challenge: Chemistry in the Real World", ["chemistry challenge", "airbag chemistry", "limiting reagent", "stoichiometry real world"], "Stoichiometry that matters: airbags, a tank of petrol's CO₂, tyre pressure in winter, medicine half-lives and dilutions."),
  T("challenge_biology_world", "Challenge: Biology by the Numbers", ["biology challenge", "hardy weinberg", "genetics probability", "mark recapture", "carrier frequency"], "Quantitative biology: carrier frequencies, multi-gene crosses, family genetics odds, population estimates and bacterial growth."),
];
export const SENIOR_CS_TOPICS: Topic[] = [
  T("challenge_cs_senior", "Challenge: Algorithms & Real Computing", ["password cracking", "subnet", "two's complement", "binary search steps", "algorithm scaling"], "Computing as engineers meet it: password-cracking time, binary search on billions, subnets, two's complement and Python surprises."),
];
export const SENIOR_ENGLISH_TOPICS: Topic[] = [
  T("challenge_bias_detective", "Challenge: Spot the Bias in the Claim", ["survivorship bias", "correlation causation", "sampling bias", "misleading statistics", "media literacy"], "Reading headlines and ads critically: survivorship bias, correlation vs causation, sampling bias, base rates and cherry-picking."),
];

// ===================================================================== MATH
const moneyMath: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const who = pick(NAMES);
  return choose(d, rng, [
    () => { const r = pick([3, 4, 6, 8, 9, 12]); return { q: `The Rule of 72 says money doubles in about 72 ÷ r years at r% interest. At ${r}% compounded annually, exactly how many years does it take to double? Give your answer to 2 decimal places.`, a: fx(Math.log(2) / Math.log(1 + r / 100), 2) }; },
    () => { const apr = pick([12, 18, 21, 24, 30]); return { q: `A credit card charges ${apr}% APR, compounded monthly (${apr / 12}% per month). What is the effective annual rate (APY) as a percentage, to 2 decimal places?`, a: `${fx((Math.pow(1 + apr / 1200, 12) - 1) * 100, 2)}%` }; },
    () => { const i = randInt(2, 6), y = pick([10, 15, 20, 25]); return { q: `Prices rise ${i}% every year. In ${y} years, $100 will buy only what $x buys today. Find x to the nearest cent.`, a: cents(100 / Math.pow(1 + i / 100, y)) }; },
    () => {
      const P = randInt(24, 80) * 500, apr = pick([3.9, 4.5, 5.9, 6.5, 7.2]), yrs = pick([3, 4, 5]);
      const r = apr / 1200, n = yrs * 12, M = (P * r) / (1 - Math.pow(1 + r, -n));
      return { q: `${who} borrows $${P} for a car at ${apr}% APR (compounded monthly), repaid in equal monthly payments over ${yrs} years. What is the monthly payment, to the nearest cent?`, a: cents(M) };
    },
    () => {
      const P = randInt(24, 80) * 500, apr = pick([4.5, 5.9, 6.5, 7.2, 8.9]), yrs = pick([4, 5, 6]);
      const r = apr / 1200, n = yrs * 12, M = Math.round(((P * r) / (1 - Math.pow(1 + r, -n))) * 100) / 100;
      return { q: `A $${P} car loan at ${apr}% APR is repaid with ${n} monthly payments of ${cents(M)}. How much interest is paid in total, to the nearest cent?`, a: cents(M * n - P) };
    },
    () => {
      for (;;) {
        const B = randInt(15, 60) * 100, m = pick([60, 75, 100, 150, 200]), r = 0.02;
        if (m <= B * r * 1.15) continue;
        const months = Math.ceil(-Math.log(1 - (r * B) / m) / Math.log(1 + r) - 1e-9);
        return { q: `${who} owes $${B} on a credit card charging 2% interest per month (24% APR). Each month interest is added, then ${who} pays $${m}. How many monthly payments until the card is paid off? (The last payment may be smaller.)`, a: `${months}` };
      }
    },
    () => { const n = randInt(6, 11), i = randInt(2, Math.min(6, n - 2)); return { q: `An investment earns ${n}% a year while inflation is ${i}% a year. What is the real (inflation-adjusted) return as a percentage, to 2 decimal places? (Not simply ${n} − ${i}!)`, a: `${fx(((1 + n / 100) / (1 + i / 100) - 1) * 100, 2)}%` }; },
  ], 3);
};

const optimization: Gen = (g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const algebra: Tpl[] = [
    () => { const L = randInt(30, 200) * 4; return { q: `A farmer has ${L} m of fencing to enclose a rectangular field beside a straight river (no fence is needed along the river). What is the largest area she can enclose, in m²?`, a: `${(L * L) / 8}` }; },
    () => {
      const k = pick([5, 10, 20, 25]), p = randInt(10, 30), x = randInt(2, 15), A = k * (p + 2 * x);
      return { q: `A concert charges $${p} a ticket and sells ${A} tickets. Market research shows every $1 increase in price loses ${k} sales. What ticket price maximizes revenue (in dollars)?`, a: `${p + x}` };
    },
    () => {
      const v = pick([9.8, 14.7, 19.6, 24.5, 29.4]), h0 = randInt(1, 3);
      return { q: `A ball's height is h(t) = −4.9t² + ${v}t + ${h0} metres, t seconds after it is thrown. What is its maximum height, in metres to 1 decimal place?`, a: fx(h0 + (v * v) / 19.6, 1) };
    },
  ];
  const calculus: Tpl[] = [
    () => { const k = randInt(2, 10), s = 6 * k; return { q: `Equal squares are cut from the corners of a ${s} cm × ${s} cm sheet of card and the sides folded up to make an open box. What is the largest possible volume, in cm³?`, a: `${16 * k * k * k}` }; },
    () => {
      const [a, b, c] = pick(TRIPLES), v = randInt(1, 3);
      return { q: `A ${c} m ladder leans against a wall. Its foot slides away from the wall at ${v} m/s. How fast is the top sliding down the wall when the foot is ${a} m from the wall? Give an exact answer in m/s.`, a: fStr(frac(a * v, b)) };
    },
    () => { const R = randInt(2, 15), k = randInt(1, 4); return { q: `The radius of a spherical balloon grows at ${k} cm/s. How fast is its volume increasing when the radius is ${R} cm? Give an exact answer in cm³/s, in terms of π.`, a: piStr(frac(4 * R * R * k)) }; },
    () => { const V = pick([330, 355, 500, 1000]); return { q: `A closed cylindrical can must hold ${V} cm³. To use the least metal, what should the ratio height ÷ radius be?`, a: "2" }; },
  ];
  return choose(d, rng, g >= 12 ? [...algebra, ...calculus] : algebra, g >= 12 ? 4 : 3);
};

const probabilityParadoxes: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => {
      const n = pick([10, 15, 20, 23, 25, 30, 40, 50]);
      let none = 1; for (let i = 0; i < n; i++) none *= (365 - i) / 365;
      return { q: `In a room of ${n} people, what is the probability that at least two share a birthday? Ignore leap years and give a percentage to 1 decimal place.`, a: `${fx((1 - none) * 100, 1)}%` };
    },
    () => { const n = pick([3, 4, 5, 10]); return { q: `Monty Hall with ${n} doors: one hides a car. You pick a door; the host, who knows where the car is, opens one other door showing a goat. You switch to one of the other unopened doors at random. What is your probability of winning the car?`, a: fStr(frac(n - 1, n * (n - 2))) }; },
    () => { const a = randInt(2, 30), T0 = a + randInt(2, 40); return { q: `You have $${a} and bet $1 at a time on a fair coin toss. You stop when you reach $${T0} or go broke. What is the probability you reach $${T0}? Give a fraction.`, a: fStr(frac(a, T0)) }; },
    () => {
      const N = pick([100, 200, 500, 1000]), s = pick([90, 95, 99]), f = pick([1, 2, 5]);
      const tp = (s / 100) / N, fp = (f / 100) * (1 - 1 / N);
      return { q: `A disease affects 1 in ${N} people. A test detects it ${s}% of the time but also gives a false positive for ${f}% of healthy people. You test positive. What is the probability you actually have the disease? Give a percentage to 1 decimal place.`, a: `${fx((tp / (tp + fp)) * 100, 1)}%` };
    },
    () => { const n = pick([10, 20, 50, 100]); return { q: `Monty Hall with ${n} doors: you pick one, then the host (who knows where the car is) opens ${n - 2} of the others, all goats. If you switch to the last closed door, what is your probability of winning?`, a: fStr(frac(n - 1, n)) }; },
    () => {
      const n = pick([4, 6, 8, 10, 12, 20]);
      let h = 0; for (let i = 1; i <= n; i++) h += n / i;
      return { q: `You roll a fair ${n}-sided die until every face has appeared at least once. On average, how many rolls does that take? Give your answer to 1 decimal place.`, a: fx(h, 1) };
    },
    () => {
      const S = pick([18, 20, 30]), k = randInt(1, 3), p = pick([0.85, 0.9]), sold = S + k;
      let over = 0; for (let j = S + 1; j <= sold; j++) over += nCr(sold, j) * Math.pow(p, j) * Math.pow(1 - p, sold - j);
      return { q: `A small plane has ${S} seats but the airline sells ${sold} tickets. Each passenger independently shows up with probability ${p}. What is the probability that more passengers show up than there are seats? Give your answer to 3 decimal places.`, a: fx(over, 3) };
    },
  ], 3);
};

const numberCodes: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => { const n = randInt(100, 2026); let z = 0; for (let p = 5; p <= n; p *= 5) z += Math.floor(n / p); return { q: `How many zeros are at the end of ${n}! (${n} factorial)?`, a: `${z}` }; },
    () => {
      const digits = [4, ...Array.from({ length: 14 }, () => randInt(0, 9))];
      let sum = 0;
      // with the check digit appended, every second digit from the right (starting with the one before it) is doubled
      digits.slice().reverse().forEach((x, i) => { const v = i % 2 === 0 ? x * 2 : x; sum += v > 9 ? v - 9 : v; });
      const check = (10 - (sum % 10)) % 10;
      const s = digits.join("");
      return { q: `Card numbers end with a Luhn check digit. What check digit completes the (made-up) card number ${s.slice(0, 4)} ${s.slice(4, 8)} ${s.slice(8, 12)} ${s.slice(12)}_ ?`, a: `${check}` };
    },
    () => {
      const r = [randInt(0, 2), randInt(0, 4), randInt(0, 6)];
      let x = 1; while (!(x % 3 === r[0] && x % 5 === r[1] && x % 7 === r[2])) x++;
      return { q: `A farmer counts her eggs in 3s and has ${r[0]} left over, in 5s and has ${r[1]} left over, and in 7s and has ${r[2]} left over. What is the smallest positive number of eggs she could have?`, a: `${x}` };
    },
    () => { const k = randInt(10, 100), day = randInt(0, 6); return { q: `Today is ${DAYS[day]}. What day of the week will it be 2^${k} days from today?`, a: DAYS[(day + modPow(2, k, 7)) % 7] }; },
    () => { const a = pick([3, 7, 13, 17, 19, 23]), n = randInt(100, 2026); return { q: `What are the last two digits of ${a}^${n}?`, a: String(modPow(a, n, 100)).padStart(2, "0") }; },
    () => {
      const digits = [9, 7, 8, ...Array.from({ length: 9 }, () => randInt(0, 9))];
      const sum = digits.reduce((s, x, i) => s + x * (i % 2 === 0 ? 1 : 3), 0);
      const s = digits.join("");
      return { q: `ISBN-13 check digit: multiply the first 12 digits alternately by 1 and 3, add them up, and the check digit makes the total a multiple of 10. What is the check digit of ${s.slice(0, 3)}-${s.slice(3)}-_ ?`, a: `${(10 - (sum % 10)) % 10}` };
    },
    () => {
      for (;;) {
        const [p, q] = pick([[5, 11], [7, 11], [5, 13], [7, 13], [11, 13], [3, 17], [5, 17]]), phi = (p - 1) * (q - 1);
        const e = pick([3, 5, 7, 11, 13, 17]);
        let dd = 0; for (let k = 1; k < phi; k++) if ((e * k) % phi === 1) { dd = k; break; }
        if (!dd) continue;
        return { q: `Toy RSA: p = ${p}, q = ${q}, so n = ${p * q} and φ(n) = ${phi}. The public exponent is e = ${e}. Find the private key d (0 < d < ${phi}) with e·d ≡ 1 (mod ${phi}).`, a: `${dd}` };
      }
    },
    () => { const a = randInt(1, 6), b = randInt(1, 5), c = randInt(0, 3), N = 2 ** a * 3 ** b * 5 ** c; return { q: `How many positive whole numbers divide exactly into ${N}?`, a: `${(a + 1) * (b + 1) * (c + 1)}` }; },
  ], 4);
};

const exponentialWorld: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => { const f = randInt(2, 18) * 5; return { q: `A bone has ${f}% of the carbon-14 it had when the animal died. Carbon-14 has a half-life of 5730 years. How old is the bone, to the nearest 100 years?`, a: `${Math.round((5730 * Math.log(f / 100)) / Math.log(0.5) / 100) * 100}` }; },
    () => { const m = randInt(40, 60) / 10, dm = pick([1, 2]); return { q: `Each step of 1 on the Richter scale means the ground shakes 10 times harder and releases about 10^1.5 times more energy. How many times more energy does a magnitude ${fx(m + dm, 1)} quake release than a magnitude ${fx(m, 1)} quake? Round to the nearest whole number.`, a: `${Math.round(Math.pow(10, 1.5 * dm))}` }; },
    () => { const dd = pick([2, 3, 4, 5]), A = pick([100, 250, 1000]), mult = pick([10, 50, 100, 1000]); return { q: `Cases of a new illness double every ${dd} days. How many days does it take to go from ${A} cases to ${A * mult} cases? Give your answer to 1 decimal place.`, a: fx(dd * Math.log2(mult), 1) }; },
    () => { const L = randInt(60, 90), n = pick([2, 4, 10, 100]); return { q: `One machine makes ${L} dB of noise. Sound level is L = 10·log₁₀(I/I₀). How loud are ${n} identical machines running together, in dB to 1 decimal place?`, a: fx(L + 10 * Math.log10(n), 1) }; },
    () => {
      const T1 = pick([65, 60, 55, 50]), t = pick([20, 30]);
      return { q: `Coffee at 90 °C is left in a 20 °C room. After 10 minutes it is ${T1} °C. Using Newton's law of cooling (the difference from room temperature shrinks by the same factor every 10 minutes), what is its temperature after ${t} minutes? Give °C to 1 decimal place.`, a: fx(20 + 70 * Math.pow((T1 - 20) / 70, t / 10), 1) };
    },
    () => {
      const D = pick([100, 200, 250, 500]), hl = pick([4, 6, 8, 12]), tau = pick([hl, 2 * hl]);
      return { q: `A patient takes ${D} mg of a medicine every ${tau} hours. Its half-life in the body is ${hl} hours. After many doses, how many mg are in the body right after a dose? Give your answer to 1 decimal place.`, a: fx(D / (1 - Math.pow(0.5, tau / hl)), 1) };
    },
  ], 3);
};

// ===================================================================== SCIENCE
const G = 9.8;
const physicsWorld: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => { const h = pick([1.2, 1.5, 2, 5, 20, 45]); return pick([
      { q: `A phone slips from a height of ${h} m. Ignoring air resistance (g = 9.8 m/s²), how long does it take to hit the ground, in seconds to 2 decimal places?`, a: fx(Math.sqrt((2 * h) / G), 2) },
      { q: `A phone slips from a height of ${h} m. Ignoring air resistance (g = 9.8 m/s²), how fast is it moving when it hits the ground, in m/s to 1 decimal place?`, a: fx(Math.sqrt(2 * G * h), 1) },
    ]); },
    () => {
      const v = pick([50, 70, 90, 110, 130]), [road, mu] = pick([["dry", 0.7], ["wet", 0.4], ["icy", 0.1]] as [string, number][]);
      return { q: `A car travelling at ${v} km/h brakes hard on ${road === "icy" ? "an" : "a"} ${road} road (coefficient of friction ${mu}, g = 9.8 m/s²). What is its braking distance, to the nearest metre?`, a: `${Math.round((v / 3.6) ** 2 / (2 * mu * G))}` };
    },
    () => { const dist = randInt(55, 400); return { q: `Mars is ${dist} million km from Earth today. Radio signals travel at 300 000 km/s. How many minutes does a message take to reach a rover there? Give your answer to 1 decimal place.`, a: fx((dist * 1e6) / 3e5 / 60, 1) }; },
    () => {
      const A = pick([350, 400, 420, 550, 800, 1200]), r = (6371 + A) * 1000;
      return { q: `A satellite orbits ${A} km above Earth's surface. Earth's radius is 6371 km and GM = 3.986 × 10^14 m³/s². What is its orbital period, to the nearest minute?`, a: `${Math.round((2 * Math.PI * Math.sqrt((r * r * r) / 3.986e14)) / 60)}` };
    },
    () => {
      const [M, R] = pick([[4, 2], [9, 3], [0.5, 0.5], [2, 1.5], [8, 2], [0.1, 0.5]] as [number, number][]);
      return { q: `Escape velocity from Earth is 11.2 km/s, and v = √(2GM/R). A planet has ${M} times Earth's mass and ${R} times its radius. What is its escape velocity, in km/s to 1 decimal place?`, a: fx(11.2 * Math.sqrt(M / R), 1) };
    },
    () => {
      const m = randInt(50, 90), a = randInt(1, 3), up = rng() < 0.5;
      return { q: `A ${m} kg person stands on bathroom scales in a lift that is ${up ? "speeding up going up" : "speeding up going down"} at ${a} m/s². What force do the scales read, in newtons? (g = 9.8 m/s², nearest whole number)`, a: `${Math.round(m * (G + (up ? a : -a)))}` };
    },
    () => {
      const m = randInt(55, 90), H = pick([500, 800, 1000, 1500]);
      return { q: `A ${m} kg hiker climbs ${H} m up a mountain. Muscles are about 25% efficient and 1 kcal = 4184 J. How many kcal of food energy does the climb use, to the nearest whole number? (g = 9.8 m/s²)`, a: `${Math.round((m * G * H) / 0.25 / 4184)}` };
    },
  ], 3);
};

const chemistryWorld: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => {
      const T1 = 20, T2 = pick([-15, -10, 0, 35, 50]), P1 = pick([300, 320, 330]);
      return { q: `A tyre's absolute air pressure is ${P1} kPa at ${T1} °C. Assuming its volume stays the same, what is the pressure at ${T2} °C, to the nearest kPa?`, a: `${Math.round((P1 * (T2 + 273)) / (T1 + 273))}` };
    },
    () => { const D = pick([200, 400, 500, 800]), hl = pick([4, 6, 8]), t = pick([12, 24, 30]); return { q: `A patient takes ${D} mg of a drug with a half-life of ${hl} hours. How many mg remain after ${t} hours, to 1 decimal place?`, a: fx(D * Math.pow(0.5, t / hl), 1) }; },
    () => { const p = randInt(1, 3), k = randInt(1, 2), V = pick([10, 25, 50]); return { q: `A strong acid has pH ${p}. To make its pH ${p + k}, how many mL of water must you add to ${V} mL of it?`, a: `${V * (10 ** k - 1)}` }; },
    () => { const V = pick([40, 50, 60, 70]); return { q: `Car airbags inflate when sodium azide decomposes: 2 NaN3 → 2 Na + 3 N2. How many grams of sodium azide (65.01 g/mol) are needed to make ${V} L of nitrogen at STP (22.4 L/mol)? Give 1 decimal place.`, a: fx((V / 22.4) * (2 / 3) * 65.01, 1) }; },
    () => { const L = pick([40, 50, 60]); return { q: `Petrol is mostly octane, C₈H₁₈ (114.23 g/mol), with density 0.70 kg/L. It burns as 2 C₈H₁₈ + 25 O₂ → 16 CO₂ + 18 H₂O. How many kg of CO₂ (44.01 g/mol) does a ${L} L tank produce? Give 1 decimal place.`, a: fx(L * 0.7 * ((8 * 44.01) / 114.23), 1) }; },
    () => {
      const h = pick([2, 4, 6, 8, 10]), o = pick([16, 32, 48, 64, 80]);
      return { q: `${h} g of hydrogen (2.016 g/mol) reacts with ${o} g of oxygen (32.00 g/mol): 2 H₂ + O₂ → 2 H₂O. What is the greatest mass of water (18.02 g/mol) that can form, in grams to 1 decimal place?`, a: fx(18.02 * Math.min(h / 2.016, (o / 32) * 2), 1) };
    },
    () => {
      const m = pick([10, 20, 25, 50]), theo = (m * 56.08) / 100.09, act = Math.round(theo * (randInt(70, 95) / 100) * 10) / 10;
      return { q: `Heating ${m} g of limestone, CaCO₃ (100.09 g/mol), gives quicklime, CaO (56.08 g/mol), and CO₂. A student collects ${act} g of CaO. What is the percent yield, to 1 decimal place?`, a: `${fx((act / theo) * 100, 1)}%` };
    },
  ], 3);
};

/** Probability that a child of p1 × p2 (genotypes like "Aa") has genotype `want`. */
function geneProb(p1: string, p2: string, want: string): [number, number] {
  let hit = 0;
  for (const x of p1) for (const y of p2) { const kid = [x, y].sort().join(""); if (kid === [...want].sort().join("")) hit++; }
  return [hit, 4];
}
const biologyWorld: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => { for (;;) { const M = randInt(40, 120), C = randInt(50, 150), R = randInt(5, 30); if ((M * C) % R === 0 && R < Math.min(M, C)) return { q: `Ecologists catch, tag and release ${M} fish in a lake. Later they catch ${C} fish and ${R} are tagged. Estimate the lake's fish population.`, a: `${(M * C) / R}` }; } },
    () => { const s = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]); return { q: `Model a cell as a cube of side ${s} µm. What is its surface-area-to-volume ratio (per µm)? Give an exact answer.`, a: fStr(frac(6, s)) }; },
    () => { const img = pick([12, 18, 24, 30, 36]), mag = pick([400, 600, 1000, 1500]); return { q: `In a micrograph at ×${mag}, a cell measures ${img} mm. What is its actual size in µm, to 1 decimal place?`, a: fx((img * 1000) / mag, 1) }; },
    () => {
      const N = pick([900, 1600, 2500, 3600, 10000]);
      const q = Math.sqrt(1 / N), p = 1 - q;
      return { q: `A recessive genetic condition affects 1 in ${N} people. Using Hardy–Weinberg, what percentage of people are unaffected carriers? Give 1 decimal place.`, a: `${fx(2 * p * q * 100, 1)}%` };
    },
    () => {
      const genes = ["A", "B", "C", "D"].slice(0, randInt(2, 3));
      const kinds: [string, string][] = [["Aa", "Aa"], ["Aa", "aa"], ["AA", "Aa"]];
      let num = 1, den = 1; const p1: string[] = [], p2: string[] = [], kid: string[] = [];
      for (const gch of genes) {
        const [x, y] = pick(kinds).map((s) => s.replace(/A/g, gch).replace(/a/g, gch.toLowerCase()));
        const options = [...new Set([...x].flatMap((u) => [...y].map((v) => [u, v].sort().join(""))))];
        const w = pick(options);
        const [h, t] = geneProb(x, y, w);
        num *= h; den *= t; p1.push(x); p2.push(y); kid.push(w);
      }
      return { q: `Genes assort independently. Parents ${p1.join("")} × ${p2.join("")} have a child. What is the probability the child's genotype is exactly ${kid.join("")}? Give a fraction.`, a: fStr(frac(num, den)) };
    },
    () => {
      const n = randInt(2, 4), k = randInt(1, n);
      return { q: `Two parents are both carriers of a recessive condition. If they have ${n} children, what is the probability that exactly ${k} of them ${k === 1 ? "is" : "are"} affected? Give a fraction.`, a: fStr(frac(nCr(n, k) * 3 ** (n - k), 4 ** n)) };
    },
    () => { return { q: `Two unaffected parents have a child with a recessive condition. Their second child is unaffected. What is the probability that this second child is a carrier? Give a fraction.`, a: "2/3" }; },
    () => { const dt = pick([20, 30]), target = pick([1e6, 1e9]); return { q: `One bacterium divides every ${dt} minutes. How many minutes until there are at least ${target === 1e6 ? "1 million" : "1 billion"} bacteria?`, a: `${Math.ceil(Math.log2(target)) * dt}` }; },
    () => { const bpm = pick([60, 70, 80]), yrs = pick([70, 80]); return { q: `A heart beats ${bpm} times a minute, every minute, for ${yrs} years (use 365.25 days a year). How many billion beats is that, to 1 decimal place?`, a: fx((bpm * 60 * 24 * 365.25 * yrs) / 1e9, 1) }; },
  ], 3);
};

// ===================================================================== COMPUTER SCIENCE
const csSenior: Gen = (_g, d, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  return choose(d, rng, [
    () => { const [n, what] = pick([[1000, "1 000 sorted names"], [1e6, "1 million sorted records"], [1e9, "1 billion sorted records"], [8.1e9, "a sorted list of all 8.1 billion people on Earth"]] as [number, string][]); return { q: `Binary search is used on ${what}. In the worst case, how many items must it check?`, a: `${Math.floor(Math.log2(n)) + 1}` }; },
    () => { const k = randInt(20, 30); return { q: `A network is given the IPv4 block /${k}. How many usable host addresses does it have? (Two addresses are reserved.)`, a: `${2 ** (32 - k) - 2}` }; },
    () => { const n = randInt(8, 20); return { q: `Tower of Hanoi with ${n} disks: what is the fewest moves needed to move the whole tower?`, a: `${2 ** n - 1}` }; },
    () => { const v = randInt(-128, -1), bits = ((v + 256) % 256).toString(2).padStart(8, "0"); return { q: `The byte ${bits} is a signed 8-bit integer in two's complement. What decimal value does it hold?`, a: `${v}` }; },
    () => {
      const L = pick([6, 7, 8]);
      return { q: `An attacker can try 1 million passwords per second. A password is ${L} lowercase letters (26 options each). How many hours to try every possibility? Give 1 decimal place.`, a: fx(26 ** L / 1e6 / 3600, 1) };
    },
    () => { const L = randInt(8, 12); return { q: `Changing a ${L}-character password from lowercase only (26 symbols) to letters + digits (62 symbols) multiplies the number of possible passwords by about how much? Round to the nearest whole number.`, a: `${Math.round((62 / 26) ** L)}` }; },
    () => { const t = pick([2, 3, 5, 8]), k = pick([10, 100, 1000]); return { q: `An O(n²) sorting algorithm takes ${t} seconds for 10 000 items. Roughly how many seconds will it take for ${(10000 * k).toLocaleString("en-US").replace(/,/g, " ")} items?`, a: `${t * k * k}` }; },
    () => { const [N, what] = pick([[50, "50 US states"], [1000, "1 000 products"], [5000, "5 000 students"], [8.1e9, "8.1 billion people"]] as [number, string][]); return { q: `What is the fewest bits needed to give each of ${what} its own unique binary ID?`, a: `${Math.ceil(Math.log2(N))}` }; },
    () => {
      for (;;) {
        const a = randInt(-30, 30), b = pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        if (a === 0 || (a > 0 && b > 0) || a % b === 0) continue;
        const fl = Math.floor(a / b);
        return pick([
          { q: `In Python, what does print(${a} // ${b}) show? (// is floor division)`, a: `${fl}` },
          { q: `In Python, what does print(${a} % ${b}) show? (the result takes the sign of the divisor)`, a: `${a - b * fl}` },
        ]);
      }
    },
  ], 3);
};

// ===================================================================== ENGLISH
/** Original claims; the answer names the reasoning flaw or bias. */
const BIAS: Item[] = [
  ["\"Every famous app founder dropped out of college — so dropping out makes you more likely to succeed.\" Which bias ignores all the dropouts who failed?", "survivorship bias", 1],
  ["\"Cities with more firefighters have more fire damage, so firefighters cause damage.\" What error is this?", "correlation is not causation / false cause", 1],
  ["A website asks its own visitors \"Do you use the internet daily?\" and reports that 98% of people do. What is wrong with the sample?", "sampling bias / selection bias", 1],
  ["A sports drink ad shows only the three weeks when sales went up and hides the rest of the year. What is this called?", "cherry-picking", 1],
  ["A chart's y-axis starts at 49 instead of 0, so a rise from 50% to 52% looks like a cliff. What trick is this?", "truncated axis / misleading axis", 1],
  ["\"I asked my five friends and they all love the new phone, so everyone will.\" What is the main weakness?", "small sample size / hasty generalization", 1],
  ["A teacher praises the student who scored worst and next test they improve; she concludes praise works. Scores near the extremes tend to move back toward average anyway. What is this effect?", "regression to the mean", 2],
  ["A test for a rare disease is 99% accurate, so a positive result means you almost certainly have it. What does this ignore?", "base rate neglect / the base rate", 2],
  ["\"This pill cuts your risk of a rare illness by 50%!\" — from 2 in 10 000 to 1 in 10 000. What misleading choice of numbers is this?", "relative risk instead of absolute risk", 2],
  ["Someone who believes a full moon causes chaos remembers every wild full-moon night and forgets the calm ones. What bias is this?", "confirmation bias", 2],
  ["Planes returning from battle were covered in bullet holes on the wings, so engineers planned to armour the wings. Why might the engines need armour instead?", "survivorship bias / planes hit in the engines never returned", 2],
  ["A shop marks a jacket \"Was $400, now $199\", making $199 feel cheap even though the jacket never sold at $400. What bias does this use?", "anchoring", 2],
  ["\"Ice-cream sales and drownings rise together, so ice cream causes drowning.\" What hidden factor explains both?", "hot weather / a confounding variable", 2],
  ["A survey asks \"Don't you agree the unfair new tax should be scrapped?\" What is wrong with the question?", "loaded question / leading question", 2],
  ["\"Our toothpaste is 37.62% more effective\" — with no study, sample or comparison given. What is this called?", "false precision", 2],
  ["Hospital A has a lower overall survival rate than Hospital B, yet A does better for both mild and severe cases — because A takes far more severe patients. What is this paradox called?", "Simpson's paradox", 3],
  ["A school reports that students who take extra tutoring score higher, but only motivated students signed up for tutoring. What problem is this?", "self-selection bias / a confounding variable", 3],
  ["A fund advertises that its best 10 investment funds all beat the market — but it quietly closed the 40 that did badly. What bias is this?", "survivorship bias", 3],
  ["A study tests 20 foods against acne and finds one \"significant\" link at the 5% level, which makes the headline. What is the problem?", "multiple comparisons / p-hacking", 3],
  ["\"After the new mayor took office, crime fell — so the mayor's policies worked.\" Crime had been falling for ten years before. What error is this?", "post hoc / false cause", 3],
  ["An online review site shows mostly 5-star and 1-star ratings because only very happy or very angry customers bother to write. What bias is this?", "non-response bias / self-selection bias", 3],
  ["\"Nine out of ten dentists recommend our gum\" — the dentists could choose several brands, and 90% also picked rivals. What is misleading?", "cherry-picking / misleading statistic", 3],
];

export const SENIOR_GENERATORS: Record<string, Gen> = {
  challenge_money_math: moneyMath,
  challenge_optimization: optimization,
  challenge_probability_paradoxes: probabilityParadoxes,
  challenge_number_codes: numberCodes,
  challenge_exponential_world: exponentialWorld,
  challenge_physics_world: physicsWorld,
  challenge_chemistry_world: chemistryWorld,
  challenge_biology_world: biologyWorld,
  challenge_cs_senior: csSenior,
  challenge_bias_detective: bankGen(BIAS),
};

/** New senior challenge ids — kept out of the worksheet bonus-question pool so existing sheets don't change. */
export const SENIOR_CHALLENGE_IDS = Object.keys(SENIOR_GENERATORS);
