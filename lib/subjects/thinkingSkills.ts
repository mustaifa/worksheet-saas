/**
 * Thinking and problem-solving skills (math, grades 2–8):
 *  - Find the mistake: a worked answer with one typical error to spot and fix
 *  - Balance puzzles: shapes on balance scales (early algebra)
 *  - Bar models: word problems with a tape diagram
 *  - Number pyramids: each brick is the sum of the two below it
 * Every answer is computed; the `pic` spec draws the work, scales, bars or
 * pyramid (lib/worksheetVisuals → picVisual). The text alone is still enough
 * to answer, so these work in Live Quiz too.
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import { frac, fStr } from "./mathUtil";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];
const NAMES = ["Sam", "Ava", "Leo", "Mia", "Omar", "Zoe", "Noah", "Lena", "Ravi", "Aisha"];

export const THINKING_TOPICS: Topic[] = [
  T("find_the_mistake", "Find the Mistake", ["find the mistake", "error analysis", "spot the error", "what went wrong"], "Looking at a worked answer, finding the step that went wrong and writing the correct answer."),
  T("balance_puzzles", "Balance Scale Puzzles", ["balance puzzle", "balance scale", "shape puzzles", "pre-algebra puzzles"], "Working out what each shape is worth from balanced scales — algebra thinking with pictures."),
  T("bar_models", "Bar Model Word Problems", ["bar model", "tape diagram", "singapore math", "word problem diagram"], "Drawing and using bar models (tape diagrams) to plan and solve word problems."),
  T("number_pyramids", "Number Pyramids", ["number pyramid", "addition pyramid", "sum pyramid"], "Number pyramids where every brick is the sum of the two bricks below it."),
];

const digits = (n: number) => String(n).split("").map(Number);

/** Column addition done without carrying. */
function addNoCarry(a: number, b: number) {
  const A = digits(a).reverse(), B = digits(b).reverse();
  const out: number[] = [];
  for (let i = 0; i < Math.max(A.length, B.length); i++) out.push(((A[i] || 0) + (B[i] || 0)) % 10);
  return +out.reverse().join("");
}
/** Column subtraction taking the smaller digit from the larger in every column. */
function subSmallFromBig(a: number, b: number) {
  const A = digits(a).reverse(), B = digits(b).reverse();
  const out: number[] = [];
  for (let i = 0; i < A.length; i++) out.push(Math.abs((A[i] || 0) - (B[i] || 0)));
  return +out.reverse().join("");
}

export const THINKING_GENERATORS: Record<string, Gen> = {
  find_the_mistake: (g, d, rng) => {
    const { randInt, pick } = makeHelpers(rng);
    const who = pick(NAMES);
    const kinds = g <= 3 ? ["add", "sub"] : g <= 5 ? ["add", "sub", "mult", "frac"] : g <= 6 ? ["frac", "order", "neg"] : ["order", "neg", "eq"];
    const kind = pick(kinds);
    if (kind === "add") {
      for (;;) {
        const big = g >= 3 || d === "hard";
        const a = big ? randInt(125, 689) : randInt(25, 79), b = big ? randInt(117, 299) : randInt(15, 49);
        const wrong = addNoCarry(a, b);
        if (wrong !== a + b && a + b < (big ? 1000 : 100)) return { q: `${who} added ${a} + ${b} in columns and got ${wrong}. Find the mistake and write the correct answer.`, a: String(a + b), pic: `col:+|${a}|${b}|${wrong}|${who}` };
      }
    }
    if (kind === "sub") {
      for (;;) {
        const big = g >= 3 || d === "hard";
        const a = big ? randInt(312, 905) : randInt(41, 93), b = big ? randInt(128, a - 50) : randInt(14, a - 10);
        const wrong = subSmallFromBig(a, b);
        if (wrong !== a - b) return { q: `${who} worked out ${a} − ${b} in columns and got ${wrong}. Find the mistake and write the correct answer.`, a: String(a - b), pic: `col:−|${a}|${b}|${wrong}|${who}` };
      }
    }
    if (kind === "mult") {
      const a = randInt(13, 48), t = randInt(1, 4), o = randInt(2, 9), b = t * 10 + o;
      const wrong = a * o + a * t;
      return { q: `${who} worked out ${a} × ${b}: ${a} × ${o} = ${a * o}, then ${a} × ${t} = ${a * t}, so the answer is ${a * o} + ${a * t} = ${wrong}. Find the mistake and write the correct answer.`, a: String(a * b), pic: `work:${who}|${a} × ${b}|${a} × ${o} = ${a * o}|${a} × ${t} = ${a * t}|${a * o} + ${a * t} = ${wrong}` };
    }
    if (kind === "frac") {
      const den = pick([5, 6, 7, 8, 9, 10, 12]);
      const n1 = randInt(1, den - 2), n2 = randInt(1, den - n1 - 1);
      const right = fStr(frac(n1 + n2, den));
      return { q: `${who} wrote ${n1}/${den} + ${n2}/${den} = ${n1 + n2}/${den * 2}. Find the mistake and write the correct answer.`, a: right, pic: `work:${who}|${n1}/${den} + ${n2}/${den}|= ${n1 + n2}/${den + den}` };
    }
    if (kind === "order") {
      const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9);
      return { q: `${who} worked out ${a} + ${b} × ${c} as ${a + b} × ${c} = ${(a + b) * c}. Find the mistake and write the correct answer.`, a: String(a + b * c), pic: `work:${who}|${a} + ${b} × ${c}|= ${a + b} × ${c}|= ${(a + b) * c}` };
    }
    if (kind === "neg") {
      const a = randInt(2, 9), b = randInt(a + 1, 15);
      return { q: `${who} wrote −${a} − (−${b}) = −${a + b}. Find the mistake and write the correct answer.`, a: String(b - a), pic: `work:${who}|−${a} − (−${b})|= −${a} − ${b}|= −${a + b}` };
    }
    // two-step equation with a sign error
    const x = randInt(2, 9), m = randInt(2, 6), c = randInt(3, 12), rhs = m * x - c;
    const wrongX = (rhs - c) / m;
    if (!Number.isInteger(wrongX)) {
      return { q: `${who} solved x − ${c} = ${rhs} and got x = ${rhs - c}. Find the mistake and write the correct value of x.`, a: String(rhs + c), pic: `work:${who}|x − ${c} = ${rhs}|x = ${rhs} − ${c}|x = ${rhs - c}` };
    }
    return { q: `${who} solved ${m}x − ${c} = ${rhs}: ${m}x = ${rhs - c}, so x = ${wrongX}. Find the mistake and write the correct value of x.`, a: String(x), pic: `work:${who}|${m}x − ${c} = ${rhs}|${m}x = ${rhs} − ${c} = ${rhs - c}|x = ${wrongX}` };
  },

  balance_puzzles: (g, d, rng) => {
    const { randInt, pick } = makeHelpers(rng);
    const level = g <= 3 ? (d === "hard" ? 2 : 1) : g <= 5 ? (d === "easy" ? 1 : 2) : d === "easy" ? 2 : 3;
    const max = g <= 3 ? 9 : 15;
    const A = randInt(2, max), B = randInt(2, max), C = randInt(2, max);
    const nm: Record<string, string> = { c: "circle", s: "square", t: "triangle" };
    const fmt = (sh: string[]) => sh.map((x) => nm[x]).join(" + ");
    let scales: [string[], number][];
    let ask: string, ans: number;
    if (level === 1) {
      const k = pick([2, 3]);
      scales = [[Array(k).fill("c"), k * A], [["c", "s"], A + B]];
      ask = "square"; ans = B;
    } else if (level === 2) {
      scales = [[["c", "c", "s"], 2 * A + B], [["c", "s"], A + B]];
      ask = pick(["circle", "square"]); ans = ask === "circle" ? A : B;
    } else {
      scales = [[["c", "s"], A + B], [["s", "t"], B + C], [["c", "c"], 2 * A]];
      ask = "triangle"; ans = C;
    }
    const text = scales.map(([sh, w], i) => `scale ${i + 1}: ${fmt(sh)} = ${w}`).join("; ");
    return { q: `Each scale balances. ${text.charAt(0).toUpperCase() + text.slice(1)}. What is one ${ask} worth?`, a: String(ans), pic: `balance:${scales.map(([sh, w]) => `${sh.join("+")}=${w}`).join(";")}|${ask}` };
  },

  bar_models: (g, d, rng) => {
    const { randInt, pick } = makeHelpers(rng);
    const [p, q2] = [pick(NAMES), pick(NAMES.filter((n) => n !== "Sam"))];
    const other = q2 === p ? "Sam" : q2;
    const thing = pick(["stickers", "marbles", "cards", "stamps", "beads", "shells"]);
    const kinds = g <= 2 ? ["partwhole", "more"] : g <= 3 ? ["partwhole", "more", "times"] : g <= 4 ? ["more", "times", "fraction"] : ["times", "fraction", "sumdiff"];
    const kind = pick(kinds);
    if (kind === "partwhole") {
      const whole = randInt(g <= 2 ? 20 : 60, g <= 2 ? 60 : 300), part = randInt(Math.floor(whole / 4), Math.floor(whole * 0.7));
      return { q: `${p} has ${whole} ${thing}. ${part} of them are new and the rest are old. How many are old?`, a: String(whole - part), pic: `bar:${JSON.stringify({ top: String(whole), bars: [{ label: p, segs: [[part, String(part)], [whole - part, "?"]] }] })}` };
    }
    if (kind === "more") {
      const a = randInt(12, g <= 2 ? 40 : 120), more = randInt(5, g <= 2 ? 20 : 60);
      const askTotal = d !== "easy";
      return {
        q: `${p} has ${a} ${thing}. ${other} has ${more} more than ${p}. ${askTotal ? "How many do they have altogether?" : `How many does ${other} have?`}`,
        a: String(askTotal ? 2 * a + more : a + more),
        pic: `bar:${JSON.stringify({ total: askTotal ? "?" : undefined, bars: [{ label: p, segs: [[a, String(a)]] }, { label: other, segs: [[a, String(a)], [more, String(more)]] }] })}`,
      };
    }
    if (kind === "times") {
      const k = randInt(2, g <= 3 ? 4 : 6), unit = randInt(4, g <= 3 ? 12 : 30);
      const total = (k + 1) * unit;
      return {
        q: `${p} has ${k} times as many ${thing} as ${other}. Together they have ${total}. How many does ${p} have?`,
        a: String(k * unit),
        pic: `bar:${JSON.stringify({ total: String(total), bars: [{ label: p, segs: Array.from({ length: k }, () => [1, ""]) }, { label: other, segs: [[1, ""]] }] })}`,
      };
    }
    if (kind === "fraction") {
      const den = pick([3, 4, 5, 6, 8]), num = randInt(1, den - 1), unit = randInt(3, 12), total = den * unit;
      return {
        q: `There are ${total} children in a club. ${num}/${den} of them play chess. How many children play chess?`,
        a: String(num * unit),
        pic: `bar:${JSON.stringify({ top: String(total), bars: [{ label: "club", segs: Array.from({ length: den }, (_, i) => [1, i < num ? "•" : " "]) }] })}`,
      };
    }
    const big = randInt(30, 140), diff = randInt(6, big - 10), small = big - diff;
    return {
      q: `Two numbers add up to ${big + small}. One is ${diff} more than the other. What is the larger number?`,
      a: String(big),
      pic: `bar:${JSON.stringify({ total: String(big + small), bars: [{ label: "larger", segs: [[small, "?"], [diff, String(diff)]] }, { label: "smaller", segs: [[small, "?"]] }] })}`,
    };
  },

  number_pyramids: (g, d, rng) => {
    const { randInt } = makeHelpers(rng);
    const four = g >= 4 && d !== "easy";
    const max = g <= 2 ? 9 : g <= 4 ? 20 : 50;
    const bottom = Array.from({ length: four ? 4 : 3 }, () => randInt(1, max));
    const rows: number[][] = [bottom];
    while (rows[rows.length - 1].length > 1) { const r = rows[rows.length - 1]; rows.push(r.slice(1).map((v, i) => v + r[i])); }
    const top = rows[rows.length - 1][0];
    const missing = d === "hard" || (d === "medium" && g >= 5);
    if (missing) {
      const k = four ? randInt(1, 2) : 1;
      const shown = bottom.map((v, i) => (i === k ? "?" : String(v)));
      const spec = [shown, ...rows.slice(1, -1).map((r) => r.map(() => "")), [String(top)]];
      return { q: `In a number pyramid each brick is the sum of the two bricks below it. The bottom row is ${shown.join(", ")} and the top brick is ${top}. What is the missing number?`, a: String(bottom[k]), pic: `pyr:${spec.map((r) => r.join(",")).join("/")}` };
    }
    const spec = [bottom.map(String), ...rows.slice(1, -1).map((r) => r.map(() => "")), ["?"]];
    return { q: `In a number pyramid each brick is the sum of the two bricks below it. The bottom row is ${bottom.join(", ")}. What number goes in the top brick?`, a: String(top), pic: `pyr:${spec.map((r) => r.join(",")).join("/")}` };
  },
};
