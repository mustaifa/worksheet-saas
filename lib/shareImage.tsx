// Per-topic share images: a tall Pinterest pin (1000×1500) and a wide social
// card (1200×630) for every worksheet page. Both show the real worksheet — its
// questions with their pictures, diagrams and options — so the image matches
// what people land on.
import { SUBJECTS, SubjectId, topicsForGrade, generateWorksheet, exampleQuestion, challengeQuestion } from "@/lib/subjects";
import { layoutWorksheet } from "@/lib/worksheetLayout";
import { BRAND } from "@/lib/brand";
import type { Variant } from "@/lib/worksheetVariant";
import type { Visual } from "@/lib/worksheetVisuals";
import { pinItemsFromLayout, itemHeight, visualScale, questionNums, PIN_VISUAL_MAX, PIN_DIAGRAM_MAX, type PinItem } from "@/lib/pinItems";

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

/**
 * Bump when the pin/card artwork changes. It's part of every image URL, so
 * browsers, the CDN and Pinterest (which all cache images by URL) fetch the new
 * artwork instead of reusing an old copy.
 */
export const SHARE_IMAGE_VERSION = 3;

export function sharePaths(subject: string, grade: string | number, topic: string, variant?: string) {
  const tail = `${subject}/${grade}/${topic}`;
  const q = `?${variant ? `v=${variant}&` : ""}r=${SHARE_IMAGE_VERSION}`;
  return { pin: `/share/pin/${tail}${q}`, og: `/share/og/${tail}${q}` };
}

/** Pin image for page N (1-based) of an exact generated worksheet. */
export function pinPagePath(subject: string, grade: string | number, topic: string, variant: string, page: number) {
  return `/share/pin/${subject}/${grade}/${topic}?v=${variant}&p=${page}&r=${SHARE_IMAGE_VERSION}`;
}

/** "Grade 4 Long Division Worksheet — Free PDF + Answer Key" style text for pins. */
export function pinDescription(grade: number, subjectLabel: string, name: string) {
  return `Free printable Grade ${grade} ${name} worksheet (${subjectLabel}) with a full answer key. Print it or save it as a PDF, or generate a fresh version. #worksheets #grade${grade} #${subjectLabel.replace(/\s+/g, "").toLowerCase()} #homeschool #teacherresources`;
}

type ShareData = { subjectLabel: string; grade: number; name: string; items: PinItem[]; total: number };

/**
 * Data for a share image: the topic page's fixed worksheet, or an exact generated
 * one (variant). Built with the same steps as those pages, so the pin matches them.
 */
export function shareData(subject: string, gradeStr: string, topicId: string, variant?: Variant | null): ShareData | null {
  const s = SUBJECTS.find((x) => x.id === subject);
  const grade = parseInt(gradeStr, 10);
  if (!s || isNaN(grade)) return null;
  const topic = topicsForGrade(s.id as SubjectId, grade).find((t) => t.id === topicId);
  if (!topic) return null;
  const sid = s.id as SubjectId;
  const seed = variant?.seed ?? stableSeed(`${s.id}-${grade}-${topic.id}`);
  let questions = generateWorksheet({ subject: sid, grade, topic: topic.id, difficulty: variant?.difficulty ?? "medium", count: variant?.count ?? 12, seed });
  if (!variant) { // the topic page drops repeats from small fact banks
    const seen = new Set<string>();
    questions = questions.filter((q) => (seen.has(q.q) ? false : (seen.add(q.q), true)));
  }
  const example = exampleQuestion({ subject: sid, grade, topic: topic.id, seed, avoid: questions });
  const challenge = challengeQuestion({ subject: sid, grade, topic: topic.id, seed });
  const layout = layoutWorksheet({ subject: sid, subjectLabel: s.label, grade, topic: topic.id, title: topic.label, questions, example, challenge });
  const items = pinItemsFromLayout(layout);
  return { subjectLabel: s.label, grade, name: topic.label.replace(/^The /, ""), items, total: layout.questions.length };
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

const FIRST_PAGE_BUDGET = 830;   // below the big title
const NEXT_PAGE_BUDGET = 1080;   // continuation pages have a small header
export const MAX_PIN_PAGES = 8;

/** Take items in order until the sheet is about full. Always takes at least one. */
function fitItems(items: PinItem[], budget: number) {
  const out: PinItem[] = [];
  let used = 0;
  for (const it of items) {
    const need = itemHeight(it);
    if (out.length && used + need > budget) break;
    out.push(it);
    used += need;
  }
  // Don't end a page on a part heading: carry it over with its first question.
  while (out.length > 1 && out[out.length - 1].kind === "heading") out.pop();
  return out;
}

/** Split a worksheet into pin-sized pages so nothing is cut off (page 1 first). */
export function pinPages(items: PinItem[]): PinItem[][] {
  const pages: PinItem[][] = [];
  let rest = items;
  while (rest.length && pages.length < MAX_PIN_PAGES) {
    const page = fitItems(rest, pages.length === 0 ? FIRST_PAGE_BUDGET : NEXT_PAGE_BUDGET);
    pages.push(page);
    rest = rest.slice(page.length);
  }
  return pages;
}

const b64 = (svg: string) => (typeof Buffer !== "undefined" ? Buffer.from(svg).toString("base64") : btoa(unescape(encodeURIComponent(svg))));
const attr = (v: string | number) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * A worksheet picture for the image renderer: shapes go in an SVG image, and the
 * text labels are laid over it as real text (so they use the bundled font and
 * never come out blank).
 */
function PinVisual({ v, max }: { v: Visual; max: { w: number; h: number } }) {
  const k = visualScale(v, max);
  const W = Math.round(v.w * k), H = Math.round(v.h * k);
  const parts: string[] = [];
  for (const sh of v.shapes) {
    const dash = "dash" in sh && sh.dash ? ' stroke-dasharray="4 3"' : "";
    switch (sh.k) {
      case "rect": parts.push(`<rect x="${sh.x}" y="${sh.y}" width="${sh.w}" height="${sh.h}" rx="${sh.r ?? 0}" fill="${attr(sh.fill || "none")}" stroke="${attr(sh.stroke || "none")}" stroke-width="${sh.sw ?? 1}"${dash}/>`); break;
      case "circle": parts.push(`<circle cx="${sh.cx}" cy="${sh.cy}" r="${sh.r}" fill="${attr(sh.fill || "none")}" stroke="${attr(sh.stroke || "none")}" stroke-width="${sh.sw ?? 1}"/>`); break;
      case "line": parts.push(`<line x1="${sh.x1}" y1="${sh.y1}" x2="${sh.x2}" y2="${sh.y2}" stroke="${attr(sh.stroke || "#1e293b")}" stroke-width="${sh.sw ?? 1}" stroke-linecap="round"${dash}/>`); break;
      case "poly": {
        const pts = sh.pts.map((p) => p.join(",")).join(" ");
        parts.push(sh.closed
          ? `<polygon points="${pts}" fill="${attr(sh.fill || "none")}" stroke="${attr(sh.stroke || "none")}" stroke-width="${sh.sw ?? 1}" stroke-linejoin="round"${dash}/>`
          : `<polyline points="${pts}" fill="none" stroke="${attr(sh.stroke || "#1e293b")}" stroke-width="${sh.sw ?? 1}" stroke-linecap="round" stroke-linejoin="round"/>`);
        break;
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v.w} ${v.h}" width="${W}" height="${H}">${parts.join("")}</svg>`;
  const texts = v.shapes.filter((sh): sh is Extract<typeof sh, { k: "text" }> => sh.k === "text");
  return (
    <div style={{ display: "flex", position: "relative", width: W, height: H }}>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={`data:image/svg+xml;base64,${b64(svg)}`} width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }} />
      {texts.map((t, i) => {
        const size = Math.max(8, (t.size || 12) * k);
        const boxW = 600;
        const left = t.anchor === "middle" ? t.x * k - boxW / 2 : t.anchor === "end" ? t.x * k - boxW : t.x * k;
        return (
          <div key={i} style={{
            display: "flex", position: "absolute", left, top: t.y * k - size * 0.84, width: boxW,
            justifyContent: t.anchor === "middle" ? "center" : t.anchor === "end" ? "flex-end" : "flex-start",
            fontSize: size, lineHeight: 1, fontWeight: t.bold ? 700 : 400, color: t.fill || "#1e293b", whiteSpace: "nowrap",
          }}>{t.t}</div>
        );
      })}
    </div>
  );
}

function PinBlock({ it, accent }: { it: PinItem; accent: string }) {
  if (it.kind === "heading") {
    return <div style={{ display: "flex", marginTop: 18, fontSize: 22, fontWeight: 700, color: accent, lineHeight: 1.35 }}>{it.text}</div>;
  }
  if (it.kind === "passage") {
    return (
      <div style={{ display: "flex", flexDirection: "column", marginTop: 22, background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 14, padding: "16px 20px" }}>
        {it.title && <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{it.title}</div>}
        <div style={{ display: "flex", fontSize: 22, color: "#334155", lineHeight: 1.36 }}>{it.text}</div>
      </div>
    );
  }
  if (it.kind === "diagram") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 22 }}>
        <PinVisual v={it.visual} max={PIN_DIAGRAM_MAX} />
        {it.caption && <div style={{ display: "flex", marginTop: 8, fontSize: 22, color: "#475569" }}>{it.caption}</div>}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
      <div style={{ display: "flex", fontSize: 26, color: "#1e293b", lineHeight: 1.3 }}>
        <div style={{ display: "flex", width: 56, color: accent, fontWeight: 700 }}>{`${it.n}.`}</div>
        <div style={{ display: "flex", flex: 1 }}>{it.text}</div>
        {it.icon && <div style={{ display: "flex", marginLeft: 12 }}><PinVisual v={it.icon} max={{ w: 60, h: 34 }} /></div>}
      </div>
      {it.visual && <div style={{ display: "flex", marginTop: 10, marginLeft: 56 }}><PinVisual v={it.visual} max={PIN_VISUAL_MAX} /></div>}
      {it.choices && it.choices.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 6, marginLeft: 56, fontSize: 23, color: "#334155" }}>
          {it.choices.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", marginRight: 30, marginTop: 4 }}>
              <div style={{ display: "flex", width: 20, height: 20, borderRadius: 999, border: "2px solid #64748b", marginRight: 8 }} />
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
export function PinImage({ d, page }: { d: ShareData; page?: { index: number; pages: PinItem[][] } }) {
  const accent = SUBJECT_COLOR[d.subjectLabel] || "#2563eb";
  const paged = !!page;
  const pageCount = page?.pages.length ?? 1;
  const idx = page?.index ?? 0;
  const shown = paged ? page!.pages[idx] : pinPages(d.items)[0] || [];
  const nums = questionNums(shown);
  const isFirst = idx === 0;
  const isLast = idx === pageCount - 1;
  const name = clip(d.name, 60);
  const left = d.total - (nums.length ? nums[nums.length - 1] : 0);

  let note: string;
  if (paged) note = !isLast ? `Continued on page ${idx + 2} of ${pageCount} →` : left > 0 ? `+ ${left} more question${left === 1 ? "" : "s"} and the answer key on the free PDF` : "Full answer key on the free PDF";
  else note = left > 0 ? `+ ${left} more question${left === 1 ? "" : "s"} and the full answer key` : "Full answer key included";

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
          <div style={{ display: "flex", fontSize: 22, color: "#64748b" }}>{isFirst || !nums.length ? "Name: ____________" : `Questions ${nums[0]}–${nums[nums.length - 1]}`}</div>
        </div>
        {shown.map((it, i) => <PinBlock key={i} it={it} accent={accent} />)}
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
  const shown: string[] = [];
  let used = 0;
  for (const it of d.items) {
    if (it.kind !== "q") continue;
    const q = clip(it.text, 76);
    used += Math.ceil(q.length / 33) * 24 + 14;
    if (shown.length >= 3 && used > 390) break;
    shown.push(q);
  }
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
