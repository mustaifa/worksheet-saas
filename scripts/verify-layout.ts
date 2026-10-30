/**
 * Lays out every topic at every grade and difficulty and checks the teacher-style
 * layout keeps every question and answer, numbers them in order, and that the
 * PDF builds.   npx tsx scripts/verify-layout.ts
 */
import { readFileSync } from "fs";
import { SUBJECTS, topicsForGrade, generateWorksheet, exampleQuestion, type Difficulty } from "../lib/subjects";
import { layoutWorksheet } from "../lib/worksheetLayout";
import { buildWorksheetPdf } from "../lib/brandedPdf";
const fonts = { regular: readFileSync("public/fonts/DejaVuSans.ttf").toString("base64"), bold: readFileSync("public/fonts/DejaVuSans-Bold.ttf").toString("base64"), logo: null };
const errs: string[] = []; const stats: Record<string, Record<string, number>> = {};
(async () => {
  for (const { id: s, label } of SUBJECTS) {
    stats[s] = { sheets: 0, multiPart: 0, picture: 0, tick: 0, match: 0, label: 0, compact: 0, example: 0, plain: 0 };
    for (let g = 1; g <= 12; g++) for (const t of topicsForGrade(s, g)) for (const [d, seed] of [["easy", 1], ["medium", 7], ["hard", 99]] as [Difficulty, number][]) {
      const qs = generateWorksheet({ subject: s, grade: g, topic: t.id, difficulty: d, count: 10, seed });
      const ex = exampleQuestion({ subject: s, grade: g, topic: t.id, seed, avoid: qs });
      const L = layoutWorksheet({ subject: s, subjectLabel: label, grade: g, topic: t.id, title: t.label, questions: qs, example: ex });
      const tag = `${s}/${g}/${t.id}/${d}`;
      const nLabel = L.sections.filter((x) => x.kind === "label").reduce((a, x) => a + x.nums.length, 0);
      if (L.questions.length !== qs.length + nLabel) errs.push(`${tag}: count ${L.questions.length} vs ${qs.length}+${nLabel}`);
      L.questions.forEach((q, i) => { if (q.n !== i + 1) errs.push(`${tag}: numbering`); });
      const all = L.sections.flatMap((x) => x.nums).sort((a, b) => a - b);
      if (all.join() !== L.questions.map((q) => q.n).join()) errs.push(`${tag}: sections don't cover questions`);
      const ans = new Map<string, number>(); for (const q of qs) ans.set(q.a, (ans.get(q.a) || 0) + 1);
      const lab = new Set(L.sections.filter((x) => x.kind === "label").flatMap((x) => x.nums));
      for (const q of L.questions) if (!lab.has(q.n) && ans.has(q.answer)) ans.set(q.answer, ans.get(q.answer)! - 1);
      if ([...ans.values()].some((v) => v !== 0)) errs.push(`${tag}: answers changed`);
      for (const sec of L.sections) {
        for (const n of sec.nums) {
          const q = L.questions[n - 1];
          if (sec.kind === "tick" && !sec.tickCols!.includes(q.correct!)) errs.push(`${tag}: tick answer missing (${q.answer} / ${sec.tickCols})`);
          if (sec.kind === "match" && !sec.options!.some((o) => o.letter === q.letter)) errs.push(`${tag}: match letter missing`);
          if (!q.text && sec.kind !== "label") errs.push(`${tag}: empty text`);
        }
        stats[s][sec.kind === "list" ? (sec.compact ? "compact" : "x") : sec.kind] += d === "medium" ? 1 : 0;
      }
      if (d !== "medium") continue;
      const st = stats[s]; st.sheets++;
      if (L.sections.length > 1) st.multiPart++;
      if (L.questions.some((q) => q.visual) || L.sections.some((x) => x.diagram)) st.picture++;
      if (L.example) st.example++;
      if (L.sections.length === 1 && L.sections[0].kind === "list" && !L.sections[0].compact && !L.questions.some((q) => q.visual || q.mode === "choice") && !L.wordBank && !L.passage) st.plain++;
      try { await buildWorksheetPdf({ title: t.label, meta: "x", layout: L, includeAnswerKey: true, filename: "x" }, fonts); } catch (e: any) { errs.push(`${tag}: PDF ${e.message}`); }
    }
  }
  console.log(JSON.stringify(stats, null, 1).replace(/\n\s*/g, " "));
  console.log("errors", errs.length); errs.slice(0, 30).forEach((e) => console.log(" ", e));
})();
