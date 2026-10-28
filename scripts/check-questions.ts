/**
 * Quality check for every worksheet generator.
 *   npx tsx scripts/check-questions.ts          (summary)
 *   npx tsx scripts/check-questions.ts --pools  (also list distinct-question counts)
 *
 * Fails (exit 1) if any question is empty, contains NaN/undefined/Infinity,
 * has a wrong answer we can recompute, or gives a negative answer below grade 6.
 * Warns when a topic can't fill a 10-question worksheet without repeats.
 */
import { SUBJECTS, allGrades, topicsForGrade, generateWorksheet, Difficulty } from "../lib/subjects";

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];
const SEEDS = Array.from({ length: 8 }, (_, i) => 1000 + i * 7919);
const errors: string[] = [];
const thin: { key: string; distinct: number }[] = [];

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : Math.abs(a); }
function parseFrac(s: string): number | null {
  s = s.trim();
  let m = s.match(/^(-?\d+) (\d+)\/(\d+)$/);
  if (m) { const w = +m[1]; return w + Math.sign(w || 1) * (+m[2] / +m[3]); }
  m = s.match(/^(-?\d+)\/(\d+)$/);
  if (m) return +m[1] / +m[2];
  m = s.match(/^-?\d+(\.\d+)?$/);
  return m ? parseFloat(s) : null;
}

// Recompute "a/b + c/d = ?" style fraction questions and plain integer arithmetic.
function verify(q: string, a: string): string | null {
  let m = q.match(/^(\d+)\/(\d+) ([+\-−×÷]) (\d+)\/(\d+) = \?$/);
  if (m) {
    const x = +m[1] / +m[2], y = +m[4] / +m[5];
    const op = m[3];
    const want = op === "+" ? x + y : op === "-" || op === "−" ? x - y : op === "×" ? x * y : x / y;
    const got = parseFrac(a);
    if (got === null || Math.abs(got - want) > 1e-9) return `expected ${want}, key says ${a}`;
    return null;
  }
  m = q.match(/^(\d+) ([+\-×÷]) (\d+) = \?$/);
  if (m) {
    const x = +m[1], y = +m[3];
    const want = m[2] === "+" ? x + y : m[2] === "-" ? x - y : m[2] === "×" ? x * y : x / y;
    const got = parseFloat(a);
    if (Number.isFinite(want) && Number.isInteger(want) && got !== want) return `expected ${want}, key says ${a}`;
  }
  return null;
}

let total = 0;
for (const s of SUBJECTS) {
  for (const g of allGrades()) {
    for (const t of topicsForGrade(s.id, g)) {
      const distinct = new Set<string>();
      for (const d of DIFFS) {
        for (const seed of SEEDS) {
          const qs = generateWorksheet({ subject: s.id, grade: g, topic: t.id, difficulty: d, count: 10, seed });
          if (qs.length === 0) { errors.push(`${s.id}/${g}/${t.id}/${d}: generated nothing`); continue; }
          for (const item of qs) {
            total++;
            distinct.add(item.q);
            const where = `${s.id}/${g}/${t.id}/${d}: "${item.q}"`;
            if (!item.q?.trim() || !String(item.a ?? "").trim()) errors.push(`${where} empty question or answer`);
            if (/NaN|undefined|Infinity|\[object/.test(item.q + " " + item.a)) errors.push(`${where} → "${item.a}" contains NaN/undefined`);
            if (s.id === "math" && g <= 5 && /^-\d/.test(String(item.a).trim())) errors.push(`${where} → negative answer "${item.a}" at grade ${g}`);
            const bad = verify(item.q, String(item.a));
            if (bad) errors.push(`${where} ${bad}`);
          }
        }
      }
      if (t.id !== "reading_comprehension" && distinct.size < 12) thin.push({ key: `${s.id}/${g}/${t.id}`, distinct: distinct.size });
    }
  }
}

const uniqueErrors = [...new Set(errors)];
console.log(`Checked ${total} generated questions.`);
console.log(`Topics with fewer than 12 distinct questions (can repeat on a 10-question sheet): ${thin.length}`);
if (process.argv.includes("--pools")) for (const t of thin.sort((a, b) => a.distinct - b.distinct)) console.log(`  ${t.distinct.toString().padStart(3)}  ${t.key}`);
if (uniqueErrors.length) {
  console.log(`\n${uniqueErrors.length} problems:`);
  for (const e of uniqueErrors.slice(0, 60)) console.log("  ✗ " + e);
  process.exit(1);
}
console.log("No errors.");
