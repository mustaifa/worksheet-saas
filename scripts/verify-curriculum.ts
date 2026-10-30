/**
 * Checks every curriculum book: each skill points at a real generator, no
 * grade lists a skill twice, every pre-existing topic URL is still in its
 * grade's book, and every skill produces clean worksheets at every grade and
 * difficulty across many seeds.
 *
 *   npx tsx scripts/verify-curriculum.ts            # checks only
 *   npx tsx scripts/verify-curriculum.ts --samples  # also prints 3 sample questions per skill
 */
import { SUBJECTS, allTopics, generateWorksheet, topicsForGrade, type SubjectId, type Difficulty } from "../lib/subjects";
import { MATH_TOPICS } from "../lib/subjects/math";
import { ENGLISH_TOPICS } from "../lib/subjects/english";
import { SCIENCE_TOPICS } from "../lib/subjects/science";
import { bookFor, bookSkills, hasBook } from "../lib/curriculum";

const SEEDS = 40;
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];
const BAD = /\bNaN\b|Infinity|\[object|null|-0(?![.\d])|\+ -|- -|\(\)|\b1[a-z]\b|\b0[a-z]\b|[a-z]\^1\b|[a-z)] [+-] 0(?![.\d])/;
const errors: string[] = [];
const warnings: string[] = [];
const samples = process.argv.includes("--samples");

const LEGACY: Partial<Record<SubjectId, { id: string; grades: number[] }[]>> = { math: MATH_TOPICS, english: ENGLISH_TOPICS, science: SCIENCE_TOPICS };

for (const { id: subject } of SUBJECTS) {
  if (!hasBook(subject)) continue;
  const topicIds = new Set(allTopics(subject).map((t) => t.id));
  let leaves = 0;

  for (let grade = 1; grade <= 12; grade++) {
    const units = bookFor(subject, grade);
    if (!units) { errors.push(`${subject} ${grade}: no book for this grade`); continue; }
    const skills = bookSkills(units);
    leaves += skills.length;

    const seen = new Set<string>();
    for (const s of skills) {
      if (seen.has(s.topic)) errors.push(`${subject} ${grade}: "${s.topic}" listed twice`);
      seen.add(s.topic);
      if (!topicIds.has(s.topic)) errors.push(`${subject} ${grade}: unknown topic "${s.topic}"`);
    }
    for (const u of units) for (const l of u.lessons) if (!l.skills.length) errors.push(`${subject} ${grade}: empty lesson "${l.title}"`);

    // legacy topic URLs must still be in the book (not just appended)
    for (const t of LEGACY[subject] ?? []) {
      if (t.grades.includes(grade) && !seen.has(t.id)) errors.push(`${subject} ${grade}: existing topic "${t.id}" missing from the book`);
    }
    const listed = topicsForGrade(subject, grade).map((t) => t.id);
    const orphans = listed.filter((id) => !seen.has(id));
    if (orphans.length) warnings.push(`${subject} ${grade}: topics outside the book: ${orphans.join(", ")}`);

    for (const s of skills) {
      for (const difficulty of DIFFS) {
        let minUnique = Infinity;
        for (let i = 0; i < SEEDS; i++) {
          const seed = 1000 + i * 7919 + grade * 31;
          const t0 = Date.now();
          let qs;
          try {
            qs = generateWorksheet({ subject, grade, topic: s.topic, difficulty, count: 10, seed });
            generateWorksheet({ subject, grade, topic: s.topic, difficulty, count: 8, seed, forTyping: true });
          } catch (e) {
            errors.push(`${subject} ${grade} ${s.topic} ${difficulty} seed ${seed}: threw ${(e as Error).message}`);
            break;
          }
          const ms = Date.now() - t0;
          if (ms > 250) warnings.push(`${subject} ${grade} ${s.topic} ${difficulty}: slow (${ms} ms)`);
          // reading comprehension is one passage with its own fixed question set
          if (s.topic === "reading_comprehension") { if (!qs.length || !qs[0].passage) errors.push(`${subject} ${grade} ${s.topic}: no passage`); break; }
          if (qs.length !== 10) errors.push(`${subject} ${grade} ${s.topic} ${difficulty}: ${qs.length}/10 questions`);
          for (const { q, a } of qs) {
            if (!q?.trim() || !a?.trim()) errors.push(`${subject} ${grade} ${s.topic} ${difficulty}: empty q/a → ${q} | ${a}`);
            // "undefined" is a real answer (slope of a vertical line, tan 90°) — only flag it inside other text
            const leaked = (/undefined/.test(a) && a !== "undefined") || /undefined(?!\?)/.test(q);
            if (leaked || BAD.test(q) || BAD.test(a)) errors.push(`${subject} ${grade} ${s.topic} ${difficulty}: suspicious text → ${q} | ${a}`);
          }
          minUnique = Math.min(minUnique, new Set(qs.map((x) => x.q)).size);
        }
        if (minUnique < 6) warnings.push(`${subject} ${grade} ${s.topic} ${difficulty}: only ${minUnique}/10 distinct questions on some seeds`);
      }
      if (samples) {
        const qs = generateWorksheet({ subject, grade, topic: s.topic, difficulty: "medium", count: 3, seed: grade * 101 });
        console.log(`\n[${subject} G${grade}] ${s.topic} (${s.level})`);
        for (const { q, a } of qs) console.log(`   ${q}  →  ${a}`);
      }
    }
  }
  console.log(`${subject}: ${leaves} skill slots across 12 grades, ${topicIds.size} topics`);
}

const uniq = (xs: string[]) => [...new Set(xs)];
if (warnings.length) console.log(`\n${warnings.length} warnings:\n` + uniq(warnings).slice(0, 80).join("\n"));
if (errors.length) {
  // one example per subject/topic/difficulty keeps the report readable
  const byKey = new Map<string, string>();
  for (const e of errors) { const key = e.split(":")[0]; if (!byKey.has(key)) byKey.set(key, e); }
  console.log(`\n${errors.length} errors in ${byKey.size} groups (first example of each):\n` + [...byKey.values()].join("\n"));
  process.exit(1);
}
console.log("\nAll curriculum checks passed.");
