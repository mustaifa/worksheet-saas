// Builds Pinterest bulk-upload CSVs (100 pins per file) for every worksheet page.
// Run:  npx -y tsx scripts/pinterest-csv.ts [outDir]
// Upload each file at pinterest.com → Create → Bulk create Pins. Create the boards
// first with exactly these names: "<Subject> Worksheets" (e.g. "Math Worksheets").
import { writeFileSync, mkdirSync } from "fs";
import { pinQueue, ALREADY_PINNED } from "../lib/pinQueue";
import { sharePaths, pinDescription } from "../lib/shareImage";

const BASE = (process.env.NEXT_PUBLIC_APP_URL || "https://aethelsystems.com").replace(/\/$/, "");
const out = process.argv[2] || "pinterest-csv";
mkdirSync(out, { recursive: true });

const mixed = pinQueue().filter((r) => !ALREADY_PINNED.has(`${r.s}/${r.g}/${r.id}`));

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
