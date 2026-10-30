// Per-topic share images: a tall Pinterest pin (1000×1500) and a wide social
// card (1200×630) for every worksheet page. Both show the real first questions
// of the free worksheet on that page, so the image matches what people land on.
import { SUBJECTS, SubjectId, topicsForGrade, generateWorksheet } from "@/lib/subjects";
import { BRAND } from "@/lib/brand";
import type { Variant } from "@/lib/worksheetVariant";

export const PIN_SIZE = { width: 1000, height: 1500 };
export const OG_SIZE = { width: 1200, height: 630 };

/** Same seed the topic page uses, so the image shows the page's own questions. */
export function stableSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export function sharePaths(subject: string, grade: string | number, topic: string, variant?: string) {
  const tail = `${subject}/${grade}/${topic}`;
  const q = variant ? `?v=${variant}` : "";
  return { pin: `/share/pin/${tail}${q}`, og: `/share/og/${tail}${q}` };
}

/** "Grade 4 Long Division Worksheet — Free PDF + Answer Key" style text for pins. */
export function pinDescription(grade: number, subjectLabel: string, name: string) {
  return `Free printable Grade ${grade} ${name} worksheet (${subjectLabel}) with a full answer key. Print it or save it as a PDF, or generate a fresh version. #worksheets #grade${grade} #${subjectLabel.replace(/\s+/g, "").toLowerCase()} #homeschool #teacherresources`;
}

type ShareData = { subjectLabel: string; grade: number; name: string; questions: string[]; total: number };

/** Data for a share image: the topic page's fixed worksheet, or an exact generated one (variant). */
export function shareData(subject: string, gradeStr: string, topicId: string, variant?: Variant | null): ShareData | null {
  const s = SUBJECTS.find((x) => x.id === subject);
  const grade = parseInt(gradeStr, 10);
  if (!s || isNaN(grade)) return null;
  const topic = topicsForGrade(s.id as SubjectId, grade).find((t) => t.id === topicId);
  if (!topic) return null;
  const seed = variant?.seed ?? stableSeed(`${s.id}-${grade}-${topic.id}`);
  const seen = new Set<string>();
  const qs = generateWorksheet({ subject: s.id as SubjectId, grade, topic: topic.id, difficulty: variant?.difficulty ?? "medium", count: variant?.count ?? 12, seed })
    .map((item) => item.q)
    .filter((q) => (seen.has(q) ? false : (seen.add(q), true)));
  return { subjectLabel: s.label, grade, name: topic.label.replace(/^The /, ""), questions: qs, total: qs.length };
}

// Shorten at a word boundary so we never end on half a word ("ha…").
const clip = (s: string, n: number) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:(]+$/, "") + "…";
};

const SUBJECT_COLOR: Record<string, string> = {
  Math: "#2563eb", English: "#db2777", Science: "#059669", Physics: "#7c3aed",
  Chemistry: "#ea580c", Biology: "#16a34a", "Computer Science": "#0891b2",
};

/** Tall 2:3 pin — the format Pinterest shows best. */
/** Take questions in order until the sheet is about full (estimated in pixels). */
function fitQuestions(qs: string[], o: { budget: number; perLine: number; lineH: number; gap: number; maxChars: number }) {
  const out: string[] = [];
  let used = 0;
  for (const raw of qs) {
    const q = clip(raw, o.maxChars);
    const need = Math.ceil(q.length / o.perLine) * o.lineH + o.gap;
    if (out.length >= 3 && used + need > o.budget) break;
    out.push(q);
    used += need;
  }
  return out;
}

export function PinImage({ d }: { d: ShareData }) {
  const accent = SUBJECT_COLOR[d.subjectLabel] || "#2563eb";
  const shown = fitQuestions(d.questions, { budget: 790, perLine: 46, lineH: 34, gap: 22, maxChars: 130 });
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0b1220", padding: 56, fontFamily: "DejaVu" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", color: "#F0C94E", fontSize: 34, fontWeight: 700 }}>{BRAND.name}</div>
        <div style={{ display: "flex", background: accent, color: "white", fontSize: 28, fontWeight: 700, borderRadius: 999, padding: "8px 24px" }}>
          {`Grade ${d.grade} · ${d.subjectLabel}`}
        </div>
      </div>
      <div style={{ display: "flex", color: "white", fontSize: d.name.length > 28 ? 62 : 76, fontWeight: 800, lineHeight: 1.08, marginTop: 36 }}>
        {clip(d.name, 48)}
      </div>
      <div style={{ display: "flex", color: "#cbd5e1", fontSize: 36, marginTop: 14 }}>Free printable worksheet + answer key</div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "white", borderRadius: 24, padding: "36px 40px", marginTop: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #0f172a", paddingBottom: 14 }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{clip(d.name, 34)}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#64748b" }}>Name: ____________</div>
        </div>
        {shown.map((q, i) => (
          <div key={i} style={{ display: "flex", fontSize: 26, color: "#1e293b", marginTop: 22, lineHeight: 1.3 }}>
            <div style={{ display: "flex", width: 56, color: accent, fontWeight: 700 }}>{`${i + 1}.`}</div>
            <div style={{ display: "flex", flex: 1 }}>{q}</div>
          </div>
        ))}
        <div style={{ display: "flex", marginTop: "auto", paddingTop: 20, fontSize: 22, color: "#94a3b8" }}>
          {d.total > shown.length ? `+ ${d.total - shown.length} more question${d.total - shown.length === 1 ? "" : "s"} and the full answer key` : "Full answer key included"}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 34 }}>
        <div style={{ display: "flex", color: "white", fontSize: 30, fontWeight: 700 }}>Download the free PDF →</div>
        <div style={{ display: "flex", color: "#94a3b8", fontSize: 28 }}>{BRAND.domain}</div>
      </div>
    </div>
  );
}

/** Wide card for Facebook, WhatsApp, X, LinkedIn link previews. */
export function OgCard({ d }: { d: ShareData }) {
  const accent = SUBJECT_COLOR[d.subjectLabel] || "#2563eb";
  const shown = fitQuestions(d.questions, { budget: 390, perLine: 33, lineH: 24, gap: 14, maxChars: 90 });
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b1220", padding: 56, fontFamily: "DejaVu" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
        <div style={{ display: "flex", color: "#F0C94E", fontSize: 30, fontWeight: 700 }}>{BRAND.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: accent === "#2563eb" ? "#93c5fd" : accent, fontSize: 32, fontWeight: 700 }}>{`Grade ${d.grade} · ${d.subjectLabel}`}</div>
          <div style={{ display: "flex", color: "white", fontSize: d.name.length > 24 ? 56 : 68, fontWeight: 800, lineHeight: 1.1, marginTop: 10 }}>{clip(d.name, 44)}</div>
          <div style={{ display: "flex", color: "#cbd5e1", fontSize: 30, marginTop: 18 }}>Free printable worksheet + answer key</div>
        </div>
        <div style={{ display: "flex", color: "#94a3b8", fontSize: 24 }}>{BRAND.domain}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 440, background: "white", borderRadius: 18, padding: 28, marginLeft: 36 }}>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#0f172a", borderBottom: "3px solid #0f172a", paddingBottom: 10 }}>{clip(d.name, 30)}</div>
        {shown.map((q, i) => (
          <div key={i} style={{ display: "flex", fontSize: 18, color: "#334155", marginTop: 14, lineHeight: 1.3 }}>
            <div style={{ display: "flex", width: 36, color: accent, fontWeight: 700 }}>{`${i + 1}.`}</div>
            <div style={{ display: "flex", flex: 1 }}>{q}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** DejaVu Sans (already in /public/fonts for the PDFs) covers symbols like × ÷ − √ π → . */
let fontCache: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[]> | null = null;
export function shareFonts(origin: string) {
  if (!fontCache) {
    const load = (f: string) => fetch(`${origin}/fonts/${f}`).then((r) => {
      if (!r.ok) throw new Error(`font ${f}: ${r.status}`);
      return r.arrayBuffer();
    });
    fontCache = Promise.all([load("DejaVuSans.ttf"), load("DejaVuSans-Bold.ttf")])
      .then(([reg, bold]) => [
        { name: "DejaVu", data: reg, weight: 400 as const, style: "normal" as const },
        { name: "DejaVu", data: bold, weight: 700 as const, style: "normal" as const },
      ])
      .catch((e) => { fontCache = null; throw e; });
  }
  return fontCache;
}
