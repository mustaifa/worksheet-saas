/**
 * Round-5 thinking, graph and creative skills:
 *  math    — reading graphs, growing patterns, logic grids, mini sudoku, real-life math
 *  english — secret codes, word ladders
 *  science — investigations (variables, patterns, predictions, claims)
 * Every answer is computed by code. Each question carries a `pic` spec the
 * worksheet draws (lib/worksheetVisuals → picVisual); the question text keeps
 * the data too, so it can still be answered as text (Live Quiz).
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T, RNG } from "./types";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];
const shuffle = <V,>(rng: RNG, arr: V[]) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const money = (c: number) => `$${(c / 100).toFixed(2)}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const CREATIVE_MATH_TOPICS: Topic[] = [
  T("read_graphs", "Reading Bar & Line Graphs", ["read graphs", "bar graph", "line graph", "interpret data", "graph questions"], "Reading values from bar and line graphs, comparing bars and spotting the biggest change."),
  T("growing_patterns", "Growing Shape Patterns", ["growing patterns", "visual patterns", "shape patterns", "how many squares"], "Looking at shape patterns that grow step by step and predicting later steps."),
  T("logic_grids", "Logic Grid Puzzles", ["logic grid", "logic puzzle", "who has which", "deduction"], "Using clues and a grid of ticks and crosses to work out who has what."),
  T("mini_sudoku", "Mini Sudoku (4 × 4)", ["sudoku", "mini sudoku", "number puzzle grid"], "4 × 4 sudoku: each row, column and box has 1, 2, 3 and 4 exactly once."),
  T("real_life_math", "Real-Life Math", ["real life math", "better buy", "timetable", "recipe", "shopping change", "unit price"], "Everyday problems: better buys, giving change, scaling recipes, reading timetables and sale prices."),
];
export const CREATIVE_ENGLISH_TOPICS: Topic[] = [
  T("secret_codes", "Secret Codes", ["secret code", "cipher", "code breaking", "decode"], "Cracking and writing secret messages with number codes and letter-shift ciphers."),
  T("word_ladders", "Word Ladders", ["word ladder", "change one letter", "word chain"], "Climbing from one word to another by changing one letter at a time, using clues."),
];
export const CREATIVE_SCIENCE_TOPICS: Topic[] = [
  T("science_investigations", "Science Investigations: Data & Claims", ["investigation", "variables", "experiment data", "claim evidence reasoning", "fair test"], "Reading an experiment's data table and graph: what was changed and measured, the pattern, predictions and whether the evidence supports a claim."),
];

// ---------------------------------------------------------------- reading graphs

const BAR_THEMES = [
  { title: "Favourite fruit", unit: "children", what: "chose", labels: ["Apples", "Bananas", "Grapes", "Oranges", "Pears"] },
  { title: "Books read this month", unit: "books", what: "read", labels: ["Ana", "Ben", "Chen", "Dina", "Eli"] },
  { title: "Pets in our class", unit: "pets", what: "", labels: ["Cats", "Dogs", "Fish", "Birds", "Rabbits"] },
  { title: "Tickets sold", unit: "tickets", what: "", labels: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
];
const LINE_THEMES = [
  { title: "Temperature (°C)", unit: "°C", labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], lo: 8, hi: 30, step: 2, noun: "temperature" },
  { title: "Plant height (cm)", unit: "cm", labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"], lo: 2, hi: 30, step: 2, noun: "plant height", rising: true },
  { title: "Visitors to the park", unit: "visitors", labels: ["8 am", "10 am", "12 pm", "2 pm", "4 pm", "6 pm"], lo: 10, hi: 90, step: 10, noun: "number of visitors" },
];

function readGraphs(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const line = g >= 5 ? rng() < 0.6 : g >= 4 ? rng() < 0.35 : false;
  if (!line) {
    const th = pick(BAR_THEMES);
    const n = g <= 2 ? 4 : 5;
    const labels = th.labels.slice(0, n);
    const step = g <= 2 ? 1 : g <= 3 ? 2 : 5;
    const maxU = g <= 2 ? 10 : g <= 3 ? 10 : 12;
    let vals: number[];
    do { vals = labels.map(() => randInt(1, maxU) * step); } while (new Set(vals).size < vals.length);
    const scale = g <= 2 ? 1 : g <= 3 ? 2 : 10;
    const data = labels.map((l, i) => `${l.toLowerCase()} ${vals[i]}`).join(", ");
    const [i, j] = shuffle(rng, labels.map((_, k) => k)).slice(0, 2);
    const hi = Math.max(vals[i], vals[j]) === vals[i] ? i : j, lo = hi === i ? j : i;
    const kind = by(d, { easy: pick(["value", "most"]), medium: pick(["diff", "least", "value"]), hard: pick(["total", "diff", "half"]) });
    let ask: string, a: string;
    if (kind === "value") { ask = `What is the value for ${labels[i]}? Read it from the bar.`; a = String(vals[i]); }
    else if (kind === "most") { ask = "Which bar is the tallest?"; a = labels[vals.indexOf(Math.max(...vals))]; }
    else if (kind === "least") { ask = "Which bar is the shortest?"; a = labels[vals.indexOf(Math.min(...vals))]; }
    else if (kind === "diff") { ask = `How many more for ${labels[hi]} than for ${labels[lo]}?`; a = String(vals[hi] - vals[lo]); }
    else if (kind === "total") { ask = "What is the total of all the bars?"; a = String(vals.reduce((x, y) => x + y, 0)); }
    else { ask = `About how many times as big is ${labels[hi]} as ${labels[lo]}? Round to the nearest whole number.`; a = String(Math.round(vals[hi] / vals[lo])); }
    const spec = { type: "bar", title: th.title, labels, values: vals, step: scale };
    return { q: `The bar graph "${th.title}" shows ${data}. ${ask}`, a, pic: `graph:${JSON.stringify(spec)}|${ask}` };
  }
  const th = pick(LINE_THEMES);
  const n = 6;
  const vals: number[] = [];
  let v = th.rising ? th.lo + randInt(0, 2) * th.step : randInt(th.lo / th.step + 2, (th.hi / th.step) - 4) * th.step;
  for (let k = 0; k < n; k++) {
    vals.push(v);
    const delta = th.rising ? randInt(1, 3) * th.step : randInt(-2, 3) * th.step;
    v = Math.min(th.hi, Math.max(th.lo, v + delta));
  }
  const labels = th.labels;
  const data = labels.map((l, k) => `${l} ${vals[k]}`).join(", ");
  const rises = vals.slice(1).map((x, k) => x - vals[k]);
  const maxRise = Math.max(...rises);
  const kind = by(d, { easy: pick(["value", "highest"]), medium: pick(["change", "highest", "value"]), hard: pick(["change", "bigrise", "range"]) });
  let ask: string, a: string;
  const i = randInt(0, n - 2), j = randInt(i + 1, n - 1);
  if (kind === "value") { ask = `What was the ${th.noun} at ${labels[i]}?`; a = `${vals[i]}`; }
  else if (kind === "highest" && vals.filter((x) => x === Math.max(...vals)).length === 1) { ask = `When was the ${th.noun} highest?`; a = labels[vals.indexOf(Math.max(...vals))]; }
  else if (kind === "bigrise" && rises.filter((x) => x === maxRise).length === 1 && maxRise > 0) { const k = rises.indexOf(maxRise); ask = `Between which two points did it rise the most? Write the first one.`; a = labels[k]; }
  else if (kind === "range") { ask = `What is the difference between the highest and lowest values?`; a = String(Math.max(...vals) - Math.min(...vals)); }
  else { ask = `By how much did the ${th.noun} change from ${labels[i]} to ${labels[j]}? (Use − for a fall.)`; a = String(vals[j] - vals[i]).replace("-", "−"); }
  const spec = { type: "line", title: th.title, labels, values: vals, step: th.step * (th.hi > 40 ? 1 : 2) };
  return { q: `The line graph "${th.title}" shows ${data}. ${ask}`, a, pic: `graph:${JSON.stringify(spec)}|${ask}` };
}

// ---------------------------------------------------------------- growing patterns

function growingPatterns(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const square = g >= 5 && rng() < 0.3;
  const a = square ? 0 : randInt(1, g <= 3 ? 2 : 3), b = square ? 0 : randInt(0, 2);
  const f = (n: number) => (square ? n * n : a * n + b);
  const counts = [1, 2, 3].map(f);
  const kind = by(d, { easy: "step4", medium: "step10", hard: square ? "step10" : "which" });
  const target = kind === "step4" ? 4 : kind === "step10" ? pick([8, 10, 12]) : randInt(9, 20);
  let ask: string, ans: string;
  if (kind === "which") { ask = `Which step will have ${f(target)} squares?`; ans = String(target); }
  else { ask = `How many squares will step ${target} have?`; ans = String(f(target)); }
  return { q: `A pattern grows: step 1 has ${counts[0]} squares, step 2 has ${counts[1]} and step 3 has ${counts[2]}. ${ask}`, a: ans, pic: `grow:${square ? "sq" : `${a},${b}`}|${ask}` };
}

// ---------------------------------------------------------------- logic grids

const LG_NAMES = ["Ali", "Ben", "Cara", "Dev"];
const LG_SETS = [
  { kind: "pet", items: ["cat", "dog", "fish", "bird"], verb: "has the" },
  { kind: "snack", items: ["apple", "cake", "cheese", "grapes"], verb: "is eating the" },
  { kind: "sport", items: ["football", "tennis", "swimming", "chess"], verb: "plays" },
];

function permutations<V>(arr: V[]): V[][] {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}

function logicGrids(g: number, d: Difficulty, rng: RNG) {
  const { pick } = makeHelpers(rng);
  const n = g >= 6 && d !== "easy" ? 4 : 3;
  const names = LG_NAMES.slice(0, n), set = pick(LG_SETS), items = shuffle(rng, set.items.slice(0, n));
  const sol = shuffle(rng, items); // sol[i] = item of names[i]
  const perms = permutations(items);
  type Clue = { name: number; item: string; pos: boolean };
  const negs: Clue[] = shuffle(rng, names.flatMap((_, i) => items.filter((it) => it !== sol[i]).map((it) => ({ name: i, item: it, pos: false }))));
  const askItem = pick(items), askName = sol.indexOf(askItem);
  const clues: Clue[] = [];
  const consistent = () => perms.filter((p) => clues.every((c) => (p[c.name] === c.item) === c.pos));
  // one positive clue for 4×4 puzzles (never about the asked item)
  if (n === 4) { const k = [0, 1, 2, 3].find((i) => i !== askName)!; clues.push({ name: k, item: sol[k], pos: true }); }
  for (const c of negs) { if (consistent().length === 1) break; clues.push(c); }
  // drop clues that aren't needed
  for (let i = clues.length - 1; i >= 0; i--) { const keep = clues.splice(i, 1)[0]; if (consistent().length !== 1) clues.splice(i, 0, keep); }
  const verb = set.verb;
  const neg = set.kind === "pet" ? "does not have the" : set.kind === "snack" ? "is not eating the" : "does not play";
  const say = (c: Clue) => `${names[c.name]} ${c.pos ? verb : neg} ${c.item}.`;
  const intro = `${names.slice(0, -1).join(", ")} and ${names[n - 1]} each ${set.kind === "pet" ? "have a different pet" : set.kind === "snack" ? "are eating a different snack" : "play a different sport"}: ${items.slice(0, -1).join(", ")} or ${items[n - 1]}.`;
  const ask = set.kind === "pet" ? `Who has the ${askItem}?` : set.kind === "snack" ? `Who is eating the ${askItem}?` : `Who plays ${askItem}?`;
  return { q: `${intro} Clues: ${clues.map(say).join(" ")} ${ask}`, a: names[askName], pic: `lgrid:${names.join(",")}|${items.join(",")}|${clues.map(say).join("~")}|${ask}` };
}

// ---------------------------------------------------------------- mini sudoku

function miniSudoku(g: number, d: Difficulty, rng: RNG) {
  const { randInt } = makeHelpers(rng);
  const base = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
  const digits = shuffle(rng, [1, 2, 3, 4]);
  let grid = base.map((r) => r.map((v) => digits[v - 1]));
  if (rng() < 0.5) grid = [grid[1], grid[0], grid[2], grid[3]];
  if (rng() < 0.5) grid = [grid[0], grid[1], grid[3], grid[2]];
  if (rng() < 0.5) grid = grid.map((r) => [r[1], r[0], r[2], r[3]]);
  if (rng() < 0.5) grid = grid.map((r) => [r[0], r[1], r[3], r[2]]);
  const tr = randInt(0, 3), tc = randInt(0, 3);
  const shown = grid.map((r) => r.map((v) => v as number | null));
  shown[tr][tc] = null;
  const candidates = () => {
    const used = new Set<number>();
    for (let k = 0; k < 4; k++) { if (shown[tr][k]) used.add(shown[tr][k]!); if (shown[k][tc]) used.add(shown[k][tc]!); }
    const br = tr - (tr % 2), bc = tc - (tc % 2);
    for (let r = br; r < br + 2; r++) for (let c = bc; c < bc + 2; c++) if (shown[r][c]) used.add(shown[r][c]!);
    return [1, 2, 3, 4].filter((v) => !used.has(v));
  };
  const removals = by(d, { easy: 6, medium: 9, hard: 11 });
  const cells = shuffle(rng, Array.from({ length: 16 }, (_, i) => [Math.floor(i / 4), i % 4] as [number, number]).filter(([r, c]) => !(r === tr && c === tc)));
  let removed = 0;
  for (const [r, c] of cells) {
    if (removed >= removals) break;
    const keep = shown[r][c]; shown[r][c] = null;
    if (candidates().length !== 1) shown[r][c] = keep; else removed++;
  }
  const rows = shown.map((r, i) => r.map((v, j) => (i === tr && j === tc ? "★" : v ? String(v) : "_")).join(" "));
  return {
    q: `Mini sudoku: every row, column and 2 × 2 box has 1, 2, 3 and 4 once. Rows: ${rows.join(" | ")}. What number goes in the ★ square?`,
    a: String(grid[tr][tc]),
    pic: `sudoku:${rows.join("/")}`,
  };
}

// ---------------------------------------------------------------- real-life math

function realLife(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kinds = g <= 4 ? ["change", "recipe", "timetable"] : g <= 5 ? ["change", "recipe", "timetable", "better", "fence"] : ["better", "sale", "recipe", "fence", "timetable"];
  const kind = pick(kinds);
  if (kind === "change") {
    const item = pick(["notebooks", "pens", "juice boxes", "stickers packs", "apples"]);
    const n = randInt(2, 5), price = randInt(g <= 4 ? 3 : 5, g <= 4 ? 12 : 39) * 25, note = n * price < 1000 ? 1000 : 2000;
    return { q: `You buy ${n} ${item} at ${money(price)} each and pay with a ${money(note).replace(".00", "")} note. How much change do you get?`, a: money(note - n * price), pic: `tags:${item}|${money(price)} each|${n}|${money(note).replace(".00", "")} note` };
  }
  if (kind === "recipe") {
    const ing = pick([["flour", "g"], ["milk", "mL"], ["sugar", "g"], ["butter", "g"]] as const);
    const base = pick([2, 4, 6]), want = pick([3, 5, 6, 8, 9, 10, 12].filter((x) => x !== base));
    const per = randInt(1, 6) * 25;
    return { q: `A recipe for ${base} people needs ${per * base} ${ing[1]} of ${ing[0]}. How much ${ing[0]} is needed for ${want} people?`, a: `${per * want} ${ing[1]}`, pic: `recipe:${base}|${per * base} ${ing[1]} ${ing[0]}|${want}` };
  }
  if (kind === "timetable") {
    const stops = ["Station", "Park", "Library", "School"];
    const start = randInt(7, 9) * 60 + pick([0, 10, 15, 20, 30, 45]);
    const gaps = [randInt(4, 12), randInt(5, 15), randInt(4, 12)];
    const times = (s: number) => { const out = [s]; for (const gp of gaps) out.push(out[out.length - 1] + gp); return out; };
    const buses = [start, start + 30, start + 60].map(times);
    const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
    const bi = randInt(0, 2), a = randInt(0, 2), b = randInt(a + 1, 3);
    return {
      q: `A bus timetable: ${stops.map((s, k) => `${s} ${buses.map((t) => fmt(t[k])).join(" / ")}`).join("; ")}. How many minutes does the ${fmt(buses[bi][0])} bus take from ${stops[a]} to ${stops[b]}?`,
      a: `${buses[bi][b] - buses[bi][a]} minutes`,
      pic: `table:${["Stop", "Bus 1", "Bus 2", "Bus 3"].join(",")}/${stops.map((s, k) => [s, ...buses.map((t) => fmt(t[k]))].join(",")).join("/")}|How many minutes does the ${fmt(buses[bi][0])} bus take from ${stops[a]} to ${stops[b]}?`,
    };
  }
  if (kind === "better") {
    for (;;) {
      const n1 = randInt(2, 6), n2 = randInt(2, 8), u1 = randInt(30, 120), u2 = randInt(30, 120);
      if (n1 === n2 || Math.abs(u1 - u2) < 6) continue;
      const item = pick(["pens", "yoghurts", "batteries", "muffins"]);
      return { q: `Shop A sells ${n1} ${item} for ${money(n1 * u1)}. Shop B sells ${n2} ${item} for ${money(n2 * u2)}. Which shop is the better buy (cheaper for each one)?`, a: u1 < u2 ? "Shop A" : "Shop B", pic: `buy:${item}|${n1}|${money(n1 * u1)}|${n2}|${money(n2 * u2)}` };
    }
  }
  if (kind === "sale") {
    const price = randInt(4, 24) * 5, off = pick([10, 20, 25, 50]);
    return { q: `A jacket costs $${price}. It is ${off}% off in a sale. What is the sale price?`, a: money(price * (100 - off)), pic: `sale:$${price}|${off}% OFF` };
  }
  const L = randInt(4, 15), W = randInt(3, 10), cost = randInt(2, 9);
  return { q: `A garden is ${L} m long and ${W} m wide. Fencing costs $${cost} for each metre. How much does it cost to fence all the way around?`, a: `$${2 * (L + W) * cost}`, pic: `garden:${L}|${W}|$${cost} per metre` };
}

// ---------------------------------------------------------------- secret codes

const CODE_WORDS = ["cat", "dog", "sun", "fish", "star", "book", "tree", "frog", "cake", "moon", "bird", "lion", "ship", "rain", "kite", "duck", "bear", "cloud", "apple", "tiger", "smile", "happy", "music", "robot", "space"];

function secretCodes(g: number, d: Difficulty, rng: RNG) {
  const { pick, randInt } = makeHelpers(rng);
  const word = pick(CODE_WORDS.filter((w) => (g <= 3 ? w.length <= 4 : true)));
  const num = (w: string) => w.split("").map((c) => c.charCodeAt(0) - 96).join("-");
  const kind = g <= 3 ? by(d, { easy: "decode", medium: "decode", hard: "encode" }) : by(d, { easy: "encode", medium: pick(["decode", "shift"]), hard: pick(["shift", "shiftEncode"]) });
  if (kind === "decode") return { q: `Use the code A = 1, B = 2, C = 3 … Z = 26. Decode the secret word: ${num(word)}`, a: word, pic: `codekey:num|${num(word)}` };
  if (kind === "encode") return { q: `Use the code A = 1, B = 2, C = 3 … Z = 26. Write the word ${word.toUpperCase()} in code (numbers with dashes).`, a: num(word), pic: `codekey:num|${word.toUpperCase()} = ?` };
  const k = randInt(1, g <= 5 ? 2 : 4);
  const shifted = word.split("").map((c) => String.fromCharCode(((c.charCodeAt(0) - 97 + k) % 26) + 65)).join("");
  if (kind === "shift") return { q: `Each letter of a secret word was moved ${k} letter${k > 1 ? "s" : ""} forward in the alphabet (A → ${String.fromCharCode(65 + k)}). Decode: ${shifted}`, a: word, pic: `codekey:shift${k}|${shifted}` };
  return { q: `Move each letter of ${word.toUpperCase()} ${k} letter${k > 1 ? "s" : ""} forward in the alphabet (A → ${String.fromCharCode(65 + k)}). What is the secret code?`, a: shifted, pic: `codekey:shift${k}|${word.toUpperCase()} → ?` };
}

// ---------------------------------------------------------------- word ladders

const LADDER: Record<string, string> = {
  cat: "a pet that purrs", cot: "a small bed for a baby", dog: "a pet that barks", dot: "a tiny round spot", hot: "very warm", hat: "you wear it on your head",
  hit: "to strike something", sit: "what you do on a chair", sat: "past tense of sit", mat: "a small rug by the door", map: "it shows where places are",
  mop: "you clean the floor with it", top: "the highest part", tap: "water comes out of it", cap: "a hat with a peak", cup: "you drink from it",
  pup: "a baby dog", sun: "the star that lights our day", bun: "a small round bread roll", bus: "a big vehicle for many passengers", bug: "a small insect",
  rug: "a small carpet", mug: "a big cup with a handle", hug: "wrap your arms around someone", hen: "a female chicken", pen: "you write with it",
  pin: "a sharp little stick for holding cloth", pig: "a farm animal that oinks", wig: "false hair", big: "large", bag: "you carry things in it",
  rag: "an old piece of cloth", ran: "past tense of run", run: "move fast on your feet", fun: "a good time", fan: "it keeps you cool",
  man: "a grown-up boy", ten: "the number after nine", tin: "a metal can", fin: "a fish swims with it", fit: "healthy and strong", bit: "a small piece",
  bat: "you hit a ball with it", rat: "an animal with a long thin tail", red: "the colour of a strawberry", bed: "you sleep in it", bad: "not good",
  dad: "another word for father", mad: "very angry", mud: "wet, sticky dirt", bud: "a flower before it opens", jet: "a very fast plane",
  net: "it catches fish", wet: "covered in water", leg: "you walk on it", log: "a piece of a tree trunk", fog: "a cloud near the ground",
  box: "a container with corners", fox: "a wild animal with a bushy tail", pot: "you cook soup in it", pet: "an animal you keep at home",
  nut: "a squirrel eats it", cut: "what scissors do", hut: "a small simple house", hop: "jump on one foot", pop: "what a balloon does when it bursts",
  can: "a metal container", van: "a vehicle for carrying things", pan: "you fry eggs in it", car: "you drive it", jar: "a glass container with a lid",
  cow: "a farm animal that moos", sad: "not happy",
};
const LWORDS = Object.keys(LADDER).filter((w) => w.length === 3 && LADDER[w]);
const diff1 = (a: string, b: string) => [0, 1, 2].filter((i) => a[i] !== b[i]).length === 1;

function wordLadders(_g: number, d: Difficulty, rng: RNG) {
  const { pick } = makeHelpers(rng);
  const long = d === "hard";
  for (let tries = 0; tries < 400; tries++) {
    const s = pick(LWORDS);
    const m1 = pick(LWORDS.filter((w) => w !== s && diff1(s, w)));
    if (!m1) continue;
    const e = pick(LWORDS.filter((w) => w !== s && w !== m1 && diff1(m1, w) && !diff1(s, w)));
    if (!e) continue;
    if (!long) {
      return { q: `Word ladder: change one letter at a time to get from ${s.toUpperCase()} to ${e.toUpperCase()}. Clue for the middle word: ${LADDER[m1]}. What is the middle word?`, a: m1, pic: `ladder:${s}|?|${e}|${LADDER[m1]}` };
    }
    const f = pick(LWORDS.filter((w) => ![s, m1, e].includes(w) && diff1(e, w) && !diff1(m1, w) && !diff1(s, w)));
    if (!f) continue;
    return { q: `Word ladder: ${s.toUpperCase()} → ${m1.toUpperCase()} → ___ → ${f.toUpperCase()}, changing one letter each step. Clue for the missing word: ${LADDER[e]}. What is it?`, a: e, pic: `ladder:${s}|${m1}|?|${f}|${LADDER[e]}` };
  }
  return { q: "Word ladder: change one letter of CAT to make a word that means 'you wear it on your head'.", a: "hat", pic: "ladder:cat|?|you wear it on your head" };
}

// ---------------------------------------------------------------- science investigations

const EXPERIMENTS = [
  { title: "Ramp height and distance rolled", setup: "Students rolled a toy car down a ramp at different heights", indep: "height", dep: "distance", other: "car", xName: "ramp height", yName: "distance rolled", xu: "cm", yu: "cm", xs: [10, 20, 30, 40], f: (x: number, k: number) => x * (k + 2), next: 50 },
  { title: "Sunlight and plant growth", setup: "Students grew bean plants with different hours of sunlight each day", indep: "sunlight", dep: "height", other: "soil", xName: "hours of sunlight", yName: "plant height", xu: "hours", yu: "cm", xs: [0, 2, 4, 6], f: (x: number, k: number) => 2 + x * (k + 1), next: 8 },
  { title: "Water temperature and dissolving", setup: "Students timed how long a sugar cube took to dissolve in water at different temperatures", indep: "temperature", dep: "time", other: "spoon", xName: "water temperature", yName: "time to dissolve", xu: "°C", yu: "seconds", xs: [20, 40, 60, 80], f: (x: number, k: number) => 150 - x * (0.4 + 0.3 * k), next: 100 },
  { title: "Exercise and heart rate", setup: "Students measured their heart rate after skipping for different numbers of minutes", indep: "minutes", dep: "heartbeat", other: "rope", xName: "minutes of skipping", yName: "heart rate", xu: "minutes", yu: "beats per minute", xs: [0, 2, 4, 6], f: (x: number, k: number) => 70 + x * (k * 5 + 5), next: 8 },
  { title: "Magnet distance and paper clips", setup: "Students held a magnet at different distances from a pile of paper clips and counted how many it picked up", indep: "distance", dep: "clips", other: "table", xName: "distance from the clips", yName: "paper clips picked up", xu: "cm", yu: "clips", xs: [1, 2, 3, 4], f: (x: number, k: number) => 12 + k - x * 2, next: 5 },
];

function investigations(g: number, d: Difficulty, rng: RNG) {
  const { pick, randInt } = makeHelpers(rng);
  const ex = pick(EXPERIMENTS);
  const k = randInt(1, 3);
  const ys = ex.xs.map((x) => Math.round(ex.f(x, k)));
  const up = ys[ys.length - 1] > ys[0];
  const table = ex.xs.map((x, i) => `${x} ${ex.xu} → ${ys[i]} ${ex.yu}`).join(", ");
  const kinds = by(d, { easy: ["changed", "read", "trend"], medium: ["changed", "measured", "trend", "read", "claim"], hard: ["predict", "claim", "measured", "trend"] });
  const kind = pick(g <= 4 ? kinds.filter((x) => x !== "predict") : kinds);
  const opts = shuffle(rng, [ex.indep, ex.dep, ex.other]);
  let ask: string, a: string;
  if (kind === "changed") { ask = `Which variable did they change on purpose: ${opts[0]}, ${opts[1]}, or ${opts[2]}?`; a = ex.indep; }
  else if (kind === "measured") { ask = `Which variable did they measure: ${opts[0]}, ${opts[1]}, or ${opts[2]}?`; a = ex.dep; }
  else if (kind === "trend") { ask = `As the ${ex.xName} went up, did the ${ex.yName} increase or decrease?`; a = up ? "increase" : "decrease"; }
  else if (kind === "read") { const i = randInt(0, ex.xs.length - 1); ask = `What was the ${ex.yName} when the ${ex.xName} was ${ex.xs[i]} ${ex.xu}?`; a = `${ys[i]} ${ex.yu}`; }
  else if (kind === "predict") { ask = `If the pattern continues, predict the ${ex.yName} at ${ex.next} ${ex.xu}.`; a = `${Math.round(ex.f(ex.next, k))} ${ex.yu}`; }
  else {
    const truthful = rng() < 0.5;
    const claim = `as the ${ex.xName} goes up, the ${ex.yName} goes ${truthful === up ? "up" : "down"}`;
    ask = `Claim: "${cap(claim)}." Does the evidence support this claim? Answer yes or no.`;
    a = truthful ? "yes" : "no";
  }
  const spec = { title: ex.title, xName: `${cap(ex.xName)} (${ex.xu})`, yName: `${cap(ex.yName)} (${ex.yu})`, xs: ex.xs, ys };
  return { q: `${ex.setup}. Results: ${table}. ${ask}`, a, pic: `inv:${JSON.stringify(spec)}|${ask}` };
}

export const CREATIVE_GENERATORS: Record<string, Gen> = {
  read_graphs: readGraphs,
  growing_patterns: growingPatterns,
  logic_grids: logicGrids,
  mini_sudoku: miniSudoku,
  real_life_math: realLife,
  secret_codes: secretCodes,
  word_ladders: wordLadders,
  science_investigations: investigations,
};
