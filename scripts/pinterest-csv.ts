// Builds Pinterest bulk-upload CSVs (100 pins per file) for every worksheet page.
// Run:  npx -y tsx scripts/pinterest-csv.ts [outDir]
// Upload each file at pinterest.com → Create → Bulk create Pins. Create the boards
// first with exactly these names: "<Subject> Worksheets" (e.g. "Math Worksheets").
import { writeFileSync, mkdirSync } from "fs";
import { SUBJECTS, allGrades, topicsForGrade } from "../lib/subjects";
import { sharePaths, pinDescription } from "../lib/shareImage";

const BASE = (process.env.NEXT_PUBLIC_APP_URL || "https://aethelsystems.com").replace(/\/$/, "");
const out = process.argv[2] || "pinterest-csv";
mkdirSync(out, { recursive: true });

// Most-searched first: Math, then English, then Science; grades 3–6, then 1–2, then 7–12.
const SUBJECT_ORDER = ["math", "english", "science", "biology", "chemistry", "physics", "computer"];
const gradeRank = (g: number) => (g >= 3 && g <= 6 ? 0 : g <= 2 ? 1 : 2);

type Row = { s: string; label: string; g: number; id: string; name: string };
const rows: Row[] = [];
for (const s of SUBJECTS) for (const g of allGrades()) for (const t of topicsForGrade(s.id, g))
  rows.push({ s: s.id, label: s.label, g, id: t.id, name: t.label.replace(/^The /, "") });
rows.sort((a, b) => gradeRank(a.g) - gradeRank(b.g) || SUBJECT_ORDER.indexOf(a.s) - SUBJECT_ORDER.indexOf(b.s) || a.g - b.g);
// Within each priority tier, interleave so one batch isn't all the same subject/grade.
const mixed: Row[] = [];
for (const tier of [0, 1, 2]) {
  const buckets = new Map<string, Row[]>();
  for (const r of rows.filter((x) => gradeRank(x.g) === tier)) { const k = `${r.s}-${r.g}`; (buckets.get(k) || buckets.set(k, []).get(k)!).push(r); }
  while ([...buckets.values()].some((b) => b.length)) for (const b of buckets.values()) if (b.length) mixed.push(b.shift()!);
}

const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
const header = "Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords";
for (let i = 0; i < mixed.length; i += 100) {
  const lines = mixed.slice(i, i + 100).map((r) => {
    const title = `Grade ${r.g} ${r.name} Worksheet (Free PDF + Answer Key)`.slice(0, 100);
    const link = `${BASE}/worksheets/${r.s}/${r.g}/${r.id}`;
    const media = BASE + sharePaths(r.s, r.g, r.id).pin;
    const kw = [`grade ${r.g} ${r.label.toLowerCase()} worksheets`, `${r.name.toLowerCase()} worksheet`, "free printable worksheets", "answer key", "homeschool"].join(", ");
    return [q(title), q(media), q(`${r.label} Worksheets`), "", q(pinDescription(r.g, r.label, r.name).slice(0, 500)), q(link), "", q(kw)].join(",");
  });
  const n = String(i / 100 + 1).padStart(2, "0");
  writeFileSync(`${out}/pins-${n}.csv`, [header, ...lines].join("\r\n") + "\r\n", "utf8");
}
console.log(`${mixed.length} pins → ${Math.ceil(mixed.length / 100)} files in ${out}/`);
