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

/** Pin image for page N (1-based) of an exact generated worksheet. */
export function pinPagePath(subject: string, grade: string | number, topic: string, variant: string, page: number) {
  return `/share/pin/${subject}/${grade}/${topic}?v=${variant}&p=${page}`;
}

/** "Grade 4 Long Division Worksheet — Free PDF + Answer Key" style text for pins. */
export function pinDescription(grade: number, subjectLabel: string, name: string) {
  return `Free printable Grade ${grade} ${name} worksheet (${subjectLabel}) with a full answer key. Print it or save it as a PDF, or generate a fresh version. #worksheets #grade${grade} #${subjectLabel.replace(/\s+/g, "").toLowerCase()} #homeschool #teacherresources`;
}

/** Question texts in order, without repeats (some small fact banks repeat). */
export function uniqueQuestions(qs: string[]): string[] {
  const seen = new Set<string>();
  return qs.filter((q) => (seen.has(q) ? false : (seen.add(q), true)));
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
  const qs = uniqueQuestions(generateWorksheet({ subject: s.id as SubjectId, grade, topic: topic.id, difficulty: variant?.difficulty ?? "medium", count: variant?.count ?? 12, seed }).map((item) => item.q));
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

// Pin sheet text metrics (DejaVu Sans 26px in a ~780px column).
const PIN_Q = { perLine: 46, lineH: 34, gap: 22, maxChars: 130 };
const FIRST_PAGE_BUDGET = 790;   // below the big title
const NEXT_PAGE_BUDGET = 1080;   // continuation pages have a small header
export const MAX_PIN_PAGES = 6;

/**
 * Split a worksheet's questions into pin-sized pages so nothing is cut off.
 * Returns the questions on each page (page 1 first).
 */
export function pinPages(questions: string[]): string[][] {
  const pages: string[][] = [];
  let rest = questions;
  while (rest.length && pages.length < MAX_PIN_PAGES) {
    const page = fitQuestions(rest, { ...PIN_Q, budget: pages.length === 0 ? FIRST_PAGE_BUDGET : NEXT_PAGE_BUDGET });
    pages.push(page);
    rest = rest.slice(page.length);
  }
  return pages;
}

/** Title size that keeps the heading to two lines in the 888px header. */
function titleSize(name: string) {
  const perLineAt1px = 888 / 0.62; // DejaVu Bold averages ~0.62em per character
  const size = Math.floor(perLineAt1px / Math.ceil(name.length / 2));
  return Math.max(44, Math.min(76, size));
}

/**
 * Tall 2:3 pin — the format Pinterest shows best.
 * Without `page`, it's the single summary pin used for topic pages ("+ N more").
 * With `page`, it's one page of a multi-page worksheet ("Page 2 of 3").
 */
export function PinImage({ d, page }: { d: ShareData; page?: { index: number; pages: string[][] } }) {
  const accent = SUBJECT_COLOR[d.subjectLabel] || "#2563eb";
  const paged = !!page;
  const pageCount = page?.pages.length ?? 1;
  const idx = page?.index ?? 0;
  const shown = paged ? page!.pages[idx] : fitQuestions(d.questions, { ...PIN_Q, budget: FIRST_PAGE_BUDGET });
  const offset = paged ? page!.pages.slice(0, idx).reduce((n, p) => n + p.length, 0) : 0;
  const isFirst = idx === 0;
  const isLast = idx === pageCount - 1;
  const name = clip(d.name, 60);

  let note: string;
  if (paged) note = isLast ? "Full answer key on the free PDF" : `Continued on page ${idx + 2} of ${pageCount} →`;
  else note = d.total > shown.length ? `+ ${d.total - shown.length} more question${d.total - shown.length === 1 ? "" : "s"} and the full answer key` : "Full answer key included";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0b1220", padding: 56, fontFamily: "DejaVu" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", color: "#F0C94E", fontSize: 34, fontWeight: 700 }}>{BRAND.name}</div>
        <div style={{ display: "flex", background: accent, color: "white", fontSize: 28, fontWeight: 700, borderRadius: 999, padding: "8px 24px" }}>
          {paged && pageCount > 1 ? `Page ${idx + 1} of ${pageCount}` : `Grade ${d.grade} · ${d.subjectLabel}`}
        </div>
      </div>

      {isFirst ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "white", fontSize: titleSize(name), fontWeight: 800, lineHeight: 1.08, marginTop: 36 }}>{name}</div>
          <div style={{ display: "flex", color: "#cbd5e1", fontSize: 36, marginTop: 14 }}>
            {paged && pageCount > 1 ? `Grade ${d.grade} ${d.subjectLabel} · ${d.total} questions + answer key` : "Free printable worksheet + answer key"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", color: "#cbd5e1", fontSize: 30, marginTop: 24 }}>{`Grade ${d.grade} ${d.subjectLabel} · ${clip(d.name, 44)}`}</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "white", borderRadius: 24, padding: "36px 40px", marginTop: isFirst ? 40 : 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #0f172a", paddingBottom: 14 }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{clip(d.name, 34)}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#64748b" }}>{isFirst ? "Name: ____________" : `Questions ${offset + 1}–${offset + shown.length}`}</div>
        </div>
        {shown.map((q, i) => (
          <div key={i} style={{ display: "flex", fontSize: 26, color: "#1e293b", marginTop: 22, lineHeight: 1.3 }}>
            <div style={{ display: "flex", width: 56, color: accent, fontWeight: 700 }}>{`${offset + i + 1}.`}</div>
            <div style={{ display: "flex", flex: 1 }}>{q}</div>
          </div>
        ))}
        <div style={{ display: "flex", marginTop: "auto", paddingTop: 20, fontSize: 22, color: "#94a3b8" }}>{note}</div>
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
