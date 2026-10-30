/**
 * Computer Science skills, grades 6–12 (CSTA K–12 aligned).
 * Every answer is computed by code (binary/hex conversions, gate outputs,
 * program traces, search and sort steps…). Each question carries a `pic`
 * spec the worksheet draws (lib/csVisuals): bit boxes, gates, code blocks,
 * robot grids, flowcharts, arrays and spreadsheets.
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T, RNG } from "./types";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];
const shuffle = <V,>(rng: RNG, arr: V[]) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Code-block picture; `prompt` replaces the question wording on the sheet (the code is drawn). */
const code = (lines: string[], prompt = "What does this program print?") => `code:${lines.join("\n")}§${prompt}`;

export const CS_TOPICS: Topic[] = [
  T("binary_numbers", "Binary Numbers", ["binary", "base 2", "bits", "binary to decimal"], "Converting between binary and decimal with place values 1, 2, 4, 8 … and adding binary numbers."),
  T("data_units", "Bits, Bytes & Data Sizes", ["bits and bytes", "kilobyte", "megabyte", "data units", "file size"], "Converting between bits, bytes, KB, MB and GB, and working out file sizes and storage."),
  T("hexadecimal", "Hexadecimal", ["hexadecimal", "hex", "base 16", "colour codes"], "Converting between hexadecimal, decimal and binary, and reading hex colour codes."),
  T("logic_gates", "Logic Gates", ["logic gates", "and gate", "or gate", "not gate", "xor", "truth table"], "Working out the outputs of AND, OR, NOT and XOR gates and small logic circuits."),
  T("boolean_logic", "Boolean Expressions", ["boolean", "true false", "and or not", "boolean logic"], "Evaluating Boolean expressions with AND, OR and NOT, including comparisons."),
  T("robot_commands", "Robot Algorithms on a Grid", ["robot", "algorithm", "commands", "sequencing", "grid directions"], "Following a robot's step-by-step commands on a grid to find where it ends up — sequencing and debugging."),
  T("loops_trace", "Tracing Loops", ["loops", "repeat", "iteration", "trace a loop"], "Tracing repeat and nested loops to find the final value or the number of times something happens."),
  T("code_tracing", "Tracing Code (Python)", ["code tracing", "python", "trace code", "what does this program print"], "Reading short Python programs with variables, if/else and loops and working out what they print."),
  T("flowcharts", "Flowcharts", ["flowchart", "decision", "algorithm diagram"], "Following flowcharts with decisions and loops to find the output for a given input."),
  T("search_sort", "Searching & Sorting", ["searching", "sorting", "binary search", "linear search", "bubble sort"], "Counting the steps in linear and binary search and tracing bubble and selection sort passes."),
  T("data_types", "Variables & Data Types", ["data types", "integer", "float", "string", "boolean", "variables"], "Recognising integers, floats, strings and Booleans, and how operators behave on each."),
  T("spreadsheet_formulas", "Spreadsheet Formulas", ["spreadsheet", "formulas", "sum", "average", "cell reference"], "Working out what spreadsheet formulas like =SUM, =AVERAGE, =MAX and =B2*C2 will show."),
  T("networks_internet", "Networks & the Internet", ["networks", "internet", "router", "ip address", "packets", "bandwidth"], "How networks move data: devices, IP addresses, packets and download times."),
  T("cybersecurity", "Cybersecurity & Passwords", ["cybersecurity", "passwords", "encryption", "phishing", "online safety"], "Password strength by counting combinations, spotting threats, and simple encryption."),
  T("big_o", "Algorithm Efficiency (Big-O)", ["big o", "efficiency", "complexity", "time complexity"], "Comparing how the number of steps grows: O(1), O(log n), O(n) and O(n²)."),
  T("lists_arrays", "Lists & Arrays", ["lists", "arrays", "index", "python list"], "Indexing, slicing and changing lists, and finding their length and values."),
  T("functions_returns", "Functions & Return Values", ["functions", "return", "parameters", "procedures"], "Tracing functions with parameters and return values, including functions that call other functions."),
  T("recursion", "Recursion", ["recursion", "recursive", "factorial", "fibonacci"], "Tracing recursive functions like factorial, Fibonacci and sums, and counting calls."),
  T("challenge_cs", "Computing Challenge Puzzles", ["computing puzzles", "cs challenge", "computational thinking puzzles"], "Puzzles that stretch computational thinking: bit patterns, logic and clever counting."),
];

const toBin = (n: number, w = 0) => n.toString(2).padStart(w, "0");
const toHex = (n: number) => n.toString(16).toUpperCase();

// ---------------------------------------------------------------- generators

function binaryNumbers(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const bits = g <= 6 ? (d === "hard" ? 6 : 4) : d === "easy" ? 5 : 8;
  const n = randInt(3, 2 ** bits - 1);
  const kind = by(d, { easy: "toDec", medium: pick(["toDec", "toBin"]), hard: g >= 8 ? pick(["add", "toBin"]) : "toBin" });
  if (kind === "toDec") return { q: `What is the binary number ${toBin(n)} in decimal?`, a: String(n), pic: `bits:${toBin(n, bits)}|${bits}` };
  if (kind === "toBin") return { q: `Write the decimal number ${n} in binary.`, a: toBin(n), pic: `bits:?|${bits}` };
  const a = randInt(3, 2 ** (bits - 2)), b = randInt(3, 2 ** (bits - 2));
  return { q: `Add the binary numbers ${toBin(a)} + ${toBin(b)}. Give the answer in binary.`, a: toBin(a + b), pic: `binadd:${toBin(a, bits - 1)}|${toBin(b, bits - 1)}` };
}

function dataUnits(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kind = by(d, { easy: pick(["bits", "bytes"]), medium: pick(["kbmb", "bits", "fit"]), hard: pick(["fit", "gbmb", "time"]) });
  if (kind === "bits") { const b = randInt(2, 16); return { q: `How many bits are in ${b} bytes?`, a: String(b * 8), pic: "" }; }
  if (kind === "bytes") { const b = randInt(2, 12) * 8; return { q: `How many bytes are ${b} bits?`, a: String(b / 8), pic: "" }; }
  if (kind === "kbmb") { const mb = randInt(2, 9); return { q: `How many kilobytes (KB) are in ${mb} MB? (Use 1 MB = 1,000 KB.)`, a: String(mb * 1000), pic: "" }; }
  if (kind === "gbmb") { const mb = randInt(2, 9) * 500; return { q: `How many gigabytes (GB) is ${mb.toLocaleString("en-US")} MB? (Use 1 GB = 1,000 MB.)`, a: String(mb / 1000), pic: "" }; }
  if (kind === "time") { const size = randInt(2, 12) * 8, speed = pick([8, 16, 4]); return { q: `A ${size} megabit (Mb) file downloads at ${speed} Mb per second. How many seconds does it take?`, a: String(size / speed), pic: "" }; }
  const card = pick([4, 8, 16, 32]), photo = pick([2, 4, 5]);
  return { q: `A memory card holds ${card} GB. Each photo is ${photo} MB. How many photos fit? (Use 1 GB = 1,000 MB.)`, a: (card * 1000 / photo).toLocaleString("en-US"), pic: "" };
}

function hexadecimal(_g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const n = randInt(17, 255);
  const kind = by(d, { easy: "toDec", medium: pick(["toDec", "toHex", "toBin"]), hard: pick(["toHex", "colour", "toBin"]) });
  if (kind === "toDec") return { q: `What is the hexadecimal number ${toHex(n)} in decimal?`, a: String(n), pic: `hex:${toHex(n).padStart(2, "0")}` };
  if (kind === "toHex") return { q: `Write the decimal number ${n} in hexadecimal.`, a: toHex(n), pic: "hex:??" };
  if (kind === "toBin") { const h = toHex(n).padStart(2, "0"); return { q: `Convert the hexadecimal number ${h} to 8-bit binary.`, a: toBin(n, 8), pic: `hex:${h}` }; }
  const r = pick([0, 51, 102, 153, 204, 255]), gg = pick([0, 128, 255]), b = pick([0, 64, 255]);
  const codeStr = `#${toHex(r).padStart(2, "0")}${toHex(gg).padStart(2, "0")}${toHex(b).padStart(2, "0")}`;
  return { q: `In the colour code ${codeStr}, what is the red value in decimal (0–255)?`, a: String(r), pic: `colour:${codeStr}` };
}

const GATES: Record<string, (a: number, b: number) => number> = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b) };

function logicGates(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const A = randInt(0, 1), B = randInt(0, 1), C = randInt(0, 1);
  if (d === "easy" || g <= 8 && d === "medium") {
    const gate = pick(g <= 8 ? ["AND", "OR", "NOT"] : ["AND", "OR", "NOT", "XOR", "NAND", "NOR"]);
    if (gate === "NOT") return { q: `The input to a NOT gate is ${A}. What is the output?`, a: String(1 - A), pic: `gate:NOT|${A}` };
    return { q: `An ${gate} gate has inputs A = ${A} and B = ${B}. What is the output?`.replace("An AND", "An AND").replace(/^An ([NX]?O|N)/, "A $1"), a: String(GATES[gate](A, B)), pic: `gate:${gate}|${A}|${B}` };
  }
  const g1 = pick(["AND", "OR"]), g2 = pick(["AND", "OR", "XOR"].filter((x) => x !== g1));
  const notC = d === "hard";
  const mid = GATES[g1](A, B), c2 = notC ? 1 - C : C, out = GATES[g2](mid, c2);
  return { q: `A circuit computes (A ${g1} B) ${g2} ${notC ? "(NOT C)" : "C"} with A = ${A}, B = ${B}, C = ${C}. What is the output?`, a: String(out), pic: `circuit2:${g1}|${g2}|${notC ? 1 : 0}|${A}|${B}|${C}` };
}

function booleanLogic(_g: number, d: Difficulty, rng: RNG) {
  const { pick, randInt } = makeHelpers(rng);
  const v = () => rng() < 0.5;
  const s = (b: boolean) => (b ? "True" : "False");
  if (d === "easy") { const a = v(), b = v(), op = pick(["and", "or"]); return { q: `What is the value of ${s(a)} ${op} ${s(b)}?`, a: s(op === "and" ? a && b : a || b), pic: "" }; }
  if (d === "medium") { const a = v(), b = v(), c = v(); return { q: `What is the value of not (${s(a)} and ${s(b)}) or ${s(c)}?`, a: s(!(a && b) || c), pic: "" }; }
  const x = randInt(1, 20), y = randInt(1, 20);
  return { q: `If x = ${x} and y = ${y}, what is the value of (x > 10 and y < 15) or x == y?`, a: s((x > 10 && y < 15) || x === y), pic: code([`x = ${x}`, `y = ${y}`, `print((x > 10 and y < 15) or x == y)`], "What does this print: True or False?") };
}

function robotCommands(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const size = 5;
  const dirs = ["N", "E", "S", "W"], dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];
  for (;;) {
    let x = randInt(0, size - 1), y = randInt(0, size - 1), f = randInt(0, 3);
    const sx = x, sy = y, sf = f;
    const len = by(d, { easy: 4, medium: 6, hard: 8 });
    const cmds: string[] = [];
    let ok = true;
    for (let i = 0; i < len; i++) {
      // Sensible programs: start and end with F, never undo a turn (L R) or spin (3 turns in a row).
      let c = i === 0 || i === len - 1 ? "F" : pick(["F", "F", "L", "R"]);
      const p1 = cmds[i - 1], p2 = cmds[i - 2];
      if (c !== "F" && ((p1 && p1 !== "F" && p1 !== c) || (p1 === c && p2 === c))) c = "F";
      if (c === "F") { x += dx[f]; y += dy[f]; if (x < 0 || y < 0 || x >= size || y >= size) { ok = false; break; } }
      else f = (f + (c === "R" ? 1 : 3)) % 4;
      cmds.push(c);
    }
    if (!ok || (x === sx && y === sy)) continue;
    const name = (cx: number, cy: number) => `${"ABCDE"[cx]}${cy + 1}`;
    const repeat = g >= 7 && d === "hard";
    const shown = repeat ? cmds.join(" ").replace(/(F F)( F)+/g, (m0) => `repeat ${m0.split(" ").length} [F]`) : cmds.join(" ");
    return {
      q: `A robot starts on square ${name(sx, sy)} facing ${["north", "east", "south", "west"][sf]}. F = move forward 1, L = turn left, R = turn right. Commands: ${shown}. Which square does it end on?`,
      a: name(x, y),
      pic: `robot:${sx},${sy},${dirs[sf]}|${shown}`,
    };
  }
}

function loopsTrace(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  if (d === "hard" && g >= 7) {
    const a = randInt(2, 5), b = randInt(2, 6);
    return { q: `A program runs: repeat ${a} times [ repeat ${b} times [ draw a star ] ]. How many stars are drawn?`, a: String(a * b), pic: code([`count = 0`, `repeat ${a} times:`, `    repeat ${b} times:`, `        count = count + 1`, `print(count)`], "Each time count goes up, one star is drawn. How many stars are drawn?") };
  }
  const start = randInt(0, 10), step = randInt(2, 9), times = randInt(3, 7), op = d === "easy" ? "+" : pick(["+", "-", "*"]);
  const t2 = op === "*" ? Math.min(times, 4) : times, st = op === "*" ? randInt(2, 3) : step;
  let v = op === "*" ? Math.max(1, start % 5) : start;
  const s0 = v;
  for (let i = 0; i < t2; i++) v = op === "+" ? v + st : op === "-" ? v - st : v * st;
  return { q: `total starts at ${s0}. The loop repeats ${t2} times: total = total ${op === "*" ? "×" : op} ${st}. What is total at the end?`, a: String(v), pic: code([`total = ${s0}`, `repeat ${t2} times:`, `    total = total ${op} ${st}`, `print(total)`], "What is total at the end?") };
}

function codeTracing(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kind = by(d, { easy: pick(["vars", "ifelse"]), medium: pick(["ifelse", "forsum", "string"]), hard: pick(["while", "forsum", "nested"]) });
  if (kind === "vars") { const a = randInt(2, 9), b = randInt(2, 9); const lines = [`a = ${a}`, `b = ${b}`, `a = a + b`, `b = a * 2`, `print(b)`]; return { q: `What does this program print? a = ${a}; b = ${b}; a = a + b; b = a * 2; print(b)`, a: String((a + b) * 2), pic: code(lines) }; }
  if (kind === "ifelse") { const x = randInt(1, 30), t = randInt(10, 20); const out = x > t ? "big" : x === t ? "equal" : "small"; return { q: `x = ${x}. if x > ${t}: print("big") elif x == ${t}: print("equal") else: print("small"). What is printed?`, a: out, pic: code([`x = ${x}`, `if x > ${t}:`, `    print("big")`, `elif x == ${t}:`, `    print("equal")`, `else:`, `    print("small")`]) }; }
  if (kind === "forsum") { const n = randInt(3, 7), m = pick([1, 2, 3]); let s = 0; for (let i = 1; i <= n; i++) s += i * m; return { q: `total = 0; for i in range(1, ${n + 1}): total = total + i * ${m}; print(total). What is printed?`, a: String(s), pic: code([`total = 0`, `for i in range(1, ${n + 1}):`, `    total = total + i * ${m}`, `print(total)`]) }; }
  if (kind === "string") { const w = pick(["PYTHON", "COMPUTER", "NETWORK", "KEYBOARD", "ALGORITHM"]), i = randInt(0, 3); return { q: `word = "${w}". What does print(word[${i}] + word[-1]) print?`, a: w[i] + w[w.length - 1], pic: code([`word = "${w}"`, `print(word[${i}] + word[-1])`]) }; }
  if (kind === "while") { let n = randInt(20, 90); const n0 = n; let c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } return { q: `n = ${n0}; count = 0; while n > 1: n = n // 2; count = count + 1. What is count at the end?`, a: String(c), pic: code([`n = ${n0}`, `count = 0`, `while n > 1:`, `    n = n // 2`, `    count = count + 1`, `print(count)`], "What is count at the end?") }; }
  const a = randInt(2, 4), b = randInt(2, 4); let c = 0; for (let i = 0; i < a; i++) for (let j = i; j < b; j++) c++;
  return { q: `count = 0; for i in range(${a}): for j in range(i, ${b}): count += 1. What is count?`, a: String(c), pic: code([`count = 0`, `for i in range(${a}):`, `    for j in range(i, ${b}):`, `        count += 1`, `print(count)`]) };
}

function flowcharts(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const t = randInt(5, 20), mul = randInt(2, 4), add = randInt(1, 9);
  const x = d === "easy" ? randInt(1, 30) : randInt(1, t + 6);
  if (d === "hard" && g >= 8) {
    let v = x; let steps = 0; const lim = t * 3; while (v <= lim) { v = v * 2; steps++; }
    return { q: `Flowchart: input x = ${x}. While x ≤ ${lim}, double x. Then output x. What is output?`, a: String(v), pic: `flow:loop|${x}|${lim}` };
  }
  const out = x > t ? x - add : x * mul;
  return { q: `Flowchart: input x = ${x}. Is x > ${t}? If yes, output x − ${add}. If no, output x × ${mul}. What is output?`, a: String(out), pic: `flow:if|${x}|${t}|${add}|${mul}` };
}

function searchSort(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const n = by(d, { easy: 7, medium: 9, hard: 11 });
  const arr = shuffle(rng, Array.from({ length: 40 }, (_, i) => i + 2)).slice(0, n);
  const kind = by(d, { easy: pick(["linear", "binarySteps"]), medium: pick(["bubble", "binaryMid", "linear"]), hard: pick(["bubble", "selection", "binarySteps"]) });
  if (kind === "linear") { const k = randInt(2, n - 1); return { q: `Linear search checks items one by one from the left. List: ${arr.join(", ")}. How many items are checked to find ${arr[k]}?`, a: String(k + 1), pic: `arr:${arr.join(",")}|${k}` }; }
  const sorted = [...arr].sort((a, b) => a - b);
  if (kind === "binaryMid") return { q: `Binary search on the sorted list ${sorted.join(", ")}. Which number is checked first (the middle item)?`, a: String(sorted[Math.floor((n - 1) / 2)]), pic: `arr:${sorted.join(",")}|-1` };
  if (kind === "binarySteps") { const N = pick([16, 32, 64, 100, 1000, 1000000]); return { q: `What is the most number of checks binary search needs to find an item in a sorted list of ${N.toLocaleString("en-US")} items?`, a: String(Math.floor(Math.log2(N)) + 1), pic: "" }; }
  if (kind === "bubble") { const a2 = arr.slice(0, 6); const b = [...a2]; for (let i = 0; i < b.length - 1; i++) if (b[i] > b[i + 1]) [b[i], b[i + 1]] = [b[i + 1], b[i]]; return { q: `Bubble sort (smallest to largest). Write the list after the first full pass: ${a2.join(", ")}`, a: b.join(", "), pic: `arr:${a2.join(",")}|-1` }; }
  const a2 = arr.slice(0, 6); const mi = a2.indexOf(Math.min(...a2)); const b = [...a2]; [b[0], b[mi]] = [b[mi], b[0]];
  return { q: `Selection sort (smallest to largest). Write the list after the first swap: ${a2.join(", ")}`, a: b.join(", "), pic: `arr:${a2.join(",")}|-1` };
}

function dataTypes(_g: number, d: Difficulty, rng: RNG) {
  const { pick, randInt } = makeHelpers(rng);
  if (d !== "hard") {
    const items: [string, string][] = [[String(randInt(2, 999)), "integer"], [`${randInt(1, 99)}.${randInt(1, 9)}`, "float"], [`"${pick(["hello", "42", "True", "cat", "3.5"])}"`, "string"], [pick(["True", "False"]), "Boolean"]];
    const [val, type] = pick(items);
    return { q: `What data type is the value ${val}: integer, float, string, or Boolean?`, a: type, pic: "" };
  }
  const k = pick(["concat", "intdiv", "mult"]);
  if (k === "concat") { const a = randInt(2, 9), b = randInt(2, 9); return { q: `What does print("${a}" + "${b}") show?`, a: `${a}${b}`, pic: code([`print("${a}" + "${b}")`]) }; }
  if (k === "intdiv") { const a = randInt(10, 40), b = randInt(3, 7); return { q: `What does print(${a} // ${b}) show? (// is whole-number division.)`, a: String(Math.floor(a / b)), pic: code([`print(${a} // ${b})`]) }; }
  const w = pick(["ha", "ab", "go"]), n = randInt(2, 4);
  return { q: `What does print("${w}" * ${n}) show?`, a: w.repeat(n), pic: code([`print("${w}" * ${n})`]) };
}

function spreadsheetFormulas(_g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const grid = Array.from({ length: 4 }, () => Array.from({ length: 3 }, () => randInt(2, 30)));
  const cell = (c: number, r: number) => grid[r][c];
  const ref = (c: number, r: number) => `${"ABC"[c]}${r + 1}`;
  const kind = by(d, { easy: pick(["cell", "sum"]), medium: pick(["sum", "max", "mult"]), hard: pick(["avg", "mult2", "countif"]) });
  let f: string, a: number;
  const c = randInt(0, 2);
  if (kind === "cell") { const r = randInt(0, 3); f = `=${ref(c, r)}`; a = cell(c, r); }
  else if (kind === "sum") { f = `=SUM(${ref(c, 0)}:${ref(c, 3)})`; a = grid.reduce((s, row) => s + row[c], 0); }
  else if (kind === "max") { f = `=MAX(${ref(c, 0)}:${ref(c, 3)})`; a = Math.max(...grid.map((row) => row[c])); }
  else if (kind === "mult") { const r = randInt(0, 3); f = `=${ref(0, r)}*${ref(1, r)}`; a = cell(0, r) * cell(1, r); }
  else if (kind === "mult2") { const r = randInt(0, 3); f = `=(${ref(0, r)}+${ref(1, r)})*2`; a = (cell(0, r) + cell(1, r)) * 2; }
  else if (kind === "countif") { const t = 15; f = `=COUNTIF(${ref(c, 0)}:${ref(c, 3)},">${t}")`; a = grid.filter((row) => row[c] > t).length; }
  else { const vals = grid.map((row) => row[c]); const s = vals.reduce((x, y) => x + y, 0); if (s % 4) grid[3][c] += 4 - (s % 4); f = `=AVERAGE(${ref(c, 0)}:${ref(c, 3)})`; a = grid.reduce((x, row) => x + row[c], 0) / 4; }
  return { q: `In the spreadsheet (${grid.map((row, r) => row.map((v, cc) => `${ref(cc, r)}=${v}`).join(", ")).join("; ")}), what does the formula ${f} show?`, a: String(a), pic: `sheet:${grid.map((row) => row.join(",")).join("/")}|${f}` };
}

function networks(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kind = by(d, { easy: pick(["device", "protocol"]), medium: pick(["packets", "ip", "device"]), hard: pick(["time", "packets", "ip"]) });
  if (kind === "device") {
    const [desc, ans, o1, o2] = pick([["sends data between different networks", "router", "printer", "monitor"], ["turns your typing into data the computer reads", "keyboard", "router", "speaker"], ["stores websites and sends them to visitors", "server", "mouse", "scanner"], ["connects devices without cables using radio waves", "WiFi", "USB", "HDMI"]]);
    const opts = shuffle(rng, [ans, o1, o2]);
    return { q: `Which ${desc === "connects devices without cables using radio waves" ? "technology" : "device"} ${desc}: ${opts[0]}, ${opts[1]}, or ${opts[2]}?`, a: ans, pic: "" };
  }
  if (kind === "protocol") {
    const [desc, ans, o1, o2] = pick([["keeps web pages secure with encryption", "HTTPS", "FTP", "SMTP"], ["sends email", "SMTP", "HTTPS", "DNS"], ["turns a website name into an IP address", "DNS", "SMTP", "HTML"]]);
    const opts = shuffle(rng, [ans, o1, o2]);
    return { q: `Which protocol ${desc}: ${opts[0]}, ${opts[1]}, or ${opts[2]}?`, a: ans, pic: "" };
  }
  if (kind === "packets") { const size = randInt(3, 12) * 1.5, p = 1.5; return { q: `A ${size} MB file is split into packets of ${p} MB. How many packets are sent?`, a: String(size / p), pic: "" }; }
  if (kind === "ip") { const bad = rng() < 0.5; const parts = [randInt(10, 223), randInt(0, 255), randInt(0, 255), bad ? randInt(256, 320) : randInt(1, 254)]; return { q: `Is ${parts.join(".")} a valid IPv4 address (each part 0–255)? Answer yes or no.`, a: bad ? "no" : "yes", pic: "" }; }
  const mb = randInt(5, 50) * 10, speed = pick([50, 100, 25]);
  return { q: `A ${mb} megabyte file is downloaded at ${speed} megabits per second. How many seconds does it take? (1 byte = 8 bits)`, a: String((mb * 8) / speed), pic: "" };
}

function cybersecurity(g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kind = by(d, { easy: pick(["pin", "safe"]), medium: pick(["letters", "pin", "caesar"]), hard: g >= 9 ? pick(["mixed", "time", "caesar"]) : pick(["letters", "caesar"]) });
  if (kind === "pin") { const n = randInt(3, 6); return { q: `A PIN has ${n} digits (0–9). How many different PINs are possible?`, a: (10 ** n).toLocaleString("en-US"), pic: `pw:${n}|10` }; }
  if (kind === "letters") { const n = randInt(2, 4); return { q: `A password is ${n} lowercase letters (a–z). How many passwords are possible?`, a: (26 ** n).toLocaleString("en-US"), pic: `pw:${n}|26` }; }
  if (kind === "mixed") { const n = randInt(2, 3); return { q: `Each character of a ${n}-character password can be a lowercase letter, an uppercase letter or a digit (62 choices). How many passwords are possible?`, a: (62 ** n).toLocaleString("en-US"), pic: `pw:${n}|62` }; }
  if (kind === "time") { const n = 4, per = pick([100, 1000]); const total = 10 ** n; return { q: `A computer tries ${per} PINs per second. How many seconds to try every 4-digit PIN?`, a: String(total / per), pic: `pw:4|10` }; }
  if (kind === "caesar") { const w = pick(["LOGIN", "SAFE", "CODE", "DATA", "BYTE", "CLOUD"]), k = randInt(1, 3); const enc = w.split("").map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65)).join(""); return { q: `A Caesar cipher moved every letter ${k} forward. Decrypt: ${enc}`, a: w.toLowerCase(), pic: `codekey:shift${k}|${enc}` }; }
  const [good, b1, b2] = pick([["T!ger7Moon#", "password123", "12345678"], ["Blue$Kite!92", "qwerty", "myname2010"]]);
  const opts = shuffle(rng, [good, b1, b2]);
  return { q: `Which is the strongest password: ${opts[0]}, ${opts[1]} or ${opts[2]}?`, a: good, pic: "" };
}

function bigO(_g: number, d: Difficulty, rng: RNG) {
  const { pick, randInt } = makeHelpers(rng);
  if (d === "hard") { const n = pick([10, 20, 50, 100, 1000]); const f = pick(["n²", "n", "n²"]); const k = pick([2, 3, 10]); return { q: `An algorithm takes about ${f} steps for n items. If n goes from ${n} to ${n * k}, how many times as many steps does it take?`, a: String(f === "n²" ? k * k : k), pic: "" }; }
  const v = pick(["i", "k", "x"]), w = pick(["j", "m", "y"]), c = randInt(3, 20), s2 = randInt(2, 3);
  const progs: [string[], string][] = [
    [[`for ${v} in range(n):`, `    print(${v})`], "O(n)"],
    [[`total = 0`, `for ${v} in range(n):`, `    total = total + ${v}`], "O(n)"],
    [[`for ${v} in range(0, n, ${s2}):`, `    print(${v})`], "O(n)"],
    [[`for ${v} in range(n):`, `    for ${w} in range(${c}):`, `        print(${v}, ${w})`], "O(n)"],
    [[`for ${v} in range(n):`, `    for ${w} in range(n):`, `        print(${v}, ${w})`], "O(n²)"],
    [[`for ${v} in range(n):`, `    for ${w} in range(${v}):`, `        print(${v}, ${w})`], "O(n²)"],
    [[`print(items[${randInt(0, 3)}])`], "O(1)"],
    [[`for ${v} in range(${c}):`, `    print(${v})`], "O(1)"],
    [[`x = items[0] + items[-1]`, `print(x * ${c})`], "O(1)"],
    [[`${v} = n`, `while ${v} > 1:`, `    ${v} = ${v} // 2`], "O(log n)"],
    [[`${v} = 1`, `while ${v} < n:`, `    ${v} = ${v} * ${s2}`], "O(log n)"],
    [[`for ${v} in range(n):`, `    print(${v})`, `for ${w} in range(n):`, `    print(${w})`], "O(n)"],
  ];
  const pool = d === "easy" ? progs.filter(([, a]) => a !== "O(log n)") : progs;
  const [lines, ans] = pick(pool);
  return { q: `What is the time complexity of this code: ${lines.map((l) => l.trim()).join("; ")}? Choose O(1), O(log n), O(n) or O(n²).`, a: ans, pic: code(lines, "What is the time complexity of this code? Choose O(1), O(log n), O(n) or O(n²).") };
}

function listsArrays(_g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const nums = Array.from({ length: randInt(5, 7) }, () => randInt(1, 50));
  const kind = by(d, { easy: pick(["index", "len"]), medium: pick(["neg", "slice", "index"]), hard: pick(["append", "slice", "sum"]) });
  const L = `nums = [${nums.join(", ")}]`;
  if (kind === "index") { const i = randInt(0, nums.length - 1); return { q: `${L}. What is nums[${i}]? (Indexes start at 0.)`, a: String(nums[i]), pic: `arr:${nums.join(",")}|-1` }; }
  if (kind === "len") return { q: `${L}. What is len(nums)?`, a: String(nums.length), pic: `arr:${nums.join(",")}|-1` };
  if (kind === "neg") { const i = randInt(1, 3); return { q: `${L}. What is nums[-${i}]?`, a: String(nums[nums.length - i]), pic: `arr:${nums.join(",")}|-1` }; }
  if (kind === "slice") { const a = randInt(0, 2), b = randInt(a + 2, nums.length); return { q: `${L}. What is nums[${a}:${b}]?`, a: `[${nums.slice(a, b).join(", ")}]`, pic: `arr:${nums.join(",")}|-1` }; }
  if (kind === "append") { const v = randInt(1, 50); return { q: `${L}. After nums.append(${v}) and nums.pop(0), what is nums[0]?`, a: String(nums[1]), pic: `arr:${nums.join(",")}|-1` }; }
  return { q: `${L}. What is sum(nums[1:4])?`, a: String(nums.slice(1, 4).reduce((a, b) => a + b, 0)), pic: `arr:${nums.join(",")}|-1` };
}

function functionsReturns(_g: number, d: Difficulty, rng: RNG) {
  const { randInt } = makeHelpers(rng);
  const m = randInt(2, 4), c = randInt(1, 5), x = randInt(1, 6);
  const f = (v: number) => m * v + c;
  if (d === "easy") return { q: `def f(x): return ${m} * x + ${c}. What does print(f(${x})) show?`, a: String(f(x)), pic: code([`def f(x):`, `    return ${m} * x + ${c}`, ``, `print(f(${x}))`]) };
  if (d === "medium") return { q: `def f(x): return ${m} * x + ${c}. What does print(f(f(${x}))) show?`, a: String(f(f(x))), pic: code([`def f(x):`, `    return ${m} * x + ${c}`, ``, `print(f(f(${x})))`]) };
  const a = randInt(2, 9), b = randInt(2, 9);
  const g2 = (p: number, q: number) => (p > q ? p - q : q * 2);
  return { q: `def g(a, b): if a > b: return a - b; else: return b * 2. What does print(g(${a}, ${b}) + g(${b}, ${a})) show?`, a: String(g2(a, b) + g2(b, a)), pic: code([`def g(a, b):`, `    if a > b:`, `        return a - b`, `    else:`, `        return b * 2`, ``, `print(g(${a}, ${b}) + g(${b}, ${a}))`]) };
}

function recursion(_g: number, d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kind = by(d, { easy: pick(["fact", "sum", "power"]), medium: pick(["sum", "fact", "power"]), hard: pick(["fib", "calls", "power"]) });
  if (kind === "fact") { const n = randInt(3, 6); let r = 1; for (let i = 2; i <= n; i++) r *= i; return { q: `def fact(n): if n == 1: return 1; return n * fact(n - 1). What is fact(${n})?`, a: String(r), pic: code([`def fact(n):`, `    if n == 1:`, `        return 1`, `    return n * fact(n - 1)`, ``, `print(fact(${n}))`]) }; }
  if (kind === "sum") { const n = randInt(4, 9); return { q: `def s(n): if n == 0: return 0; return n + s(n - 1). What is s(${n})?`, a: String((n * (n + 1)) / 2), pic: code([`def s(n):`, `    if n == 0:`, `        return 0`, `    return n + s(n - 1)`, ``, `print(s(${n}))`]) }; }
  if (kind === "power") { const b = randInt(2, 3), e = randInt(3, 5); return { q: `def p(b, e): if e == 0: return 1; return b * p(b, e - 1). What is p(${b}, ${e})?`, a: String(b ** e), pic: code([`def p(b, e):`, `    if e == 0:`, `        return 1`, `    return b * p(b, e - 1)`, ``, `print(p(${b}, ${e}))`]) }; }
  if (kind === "calls") { const n = randInt(3, 6); return { q: `def fact(n): if n == 1: return 1; return n * fact(n - 1). How many times is fact called in total when we run fact(${n})?`, a: String(n), pic: code([`def fact(n):`, `    if n == 1:`, `        return 1`, `    return n * fact(n - 1)`, ``, `fact(${n})`], `How many times is fact called in total when we run fact(${n})?`) }; }
  const n = randInt(5, 9); const fib = [0, 1]; for (let i = 2; i <= n; i++) fib.push(fib[i - 1] + fib[i - 2]);
  return { q: `def fib(n): if n < 2: return n; return fib(n - 1) + fib(n - 2). What is fib(${n})?`, a: String(fib[n]), pic: code([`def fib(n):`, `    if n < 2:`, `        return n`, `    return fib(n - 1) + fib(n - 2)`, ``, `print(fib(${n}))`]) };
}

function challengeCs(g: number, _d: Difficulty, rng: RNG) {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(g <= 8 ? ["patterns", "largest", "robotShort"] : ["patterns", "largest", "gray", "subsets", "handshake"]);
  if (kind === "patterns") { const n = randInt(3, 8); return { q: `How many different patterns can ${n} bits make?`, a: String(2 ** n), pic: `bits:?|${n}` }; }
  if (kind === "largest") { const n = randInt(4, 10); return { q: `What is the largest whole number you can store in ${n} bits?`, a: String(2 ** n - 1), pic: `bits:${"1".repeat(n)}|${n}` }; }
  if (kind === "robotShort") { const a = randInt(2, 4), b = randInt(1, 3); return { q: `A robot on a grid can only move forward 1 square, or turn. What is the fewest forward moves to go ${a} squares east and ${b} squares north?`, a: String(a + b), pic: "" }; }
  if (kind === "gray") { const n = randInt(2, 4); return { q: `In a list of every ${n}-bit pattern, how many patterns have exactly one 1?`, a: String(n), pic: `bits:?|${n}` }; }
  if (kind === "subsets") { const n = randInt(3, 6); return { q: `A playlist app lets you switch each of ${n} songs on or off. How many different playlists (including the empty one) are possible?`, a: String(2 ** n), pic: "" }; }
  const n = randInt(4, 10); return { q: `${n} computers each connect directly to every other computer with one cable. How many cables are needed?`, a: String((n * (n - 1)) / 2), pic: "" };
}

export const CS_GENERATORS: Record<string, Gen> = {
  binary_numbers: binaryNumbers, data_units: dataUnits, hexadecimal, logic_gates: logicGates, boolean_logic: booleanLogic,
  robot_commands: robotCommands, loops_trace: loopsTrace, code_tracing: codeTracing, flowcharts, search_sort: searchSort,
  data_types: dataTypes, spreadsheet_formulas: spreadsheetFormulas, networks_internet: networks, cybersecurity,
  big_o: bigO, lists_arrays: listsArrays, functions_returns: functionsReturns, recursion, challenge_cs: challengeCs,
};
