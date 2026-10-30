// Per-topic share images: a tall Pinterest pin (1000×1500) and a wide social
// card (1200×630) for every worksheet page. Both show the real worksheet — its
// questions with their pictures, diagrams and options — so the image matches
// what people land on.
import { SUBJECTS, SubjectId, topicsForGrade, generateWorksheet, exampleQuestion, challengeQuestion } from "@/lib/subjects";
import { layoutWorksheet } from "@/lib/worksheetLayout";
import { BRAND } from "@/lib/brand";
import type { Variant } from "@/lib/worksheetVariant";
import type { Visual } from "@/lib/worksheetVisuals";
import { planPinPages, visualScale, questionNums, PIN_VISUAL_MAX, PIN_DIAGRAM_MAX, PIN_ANCHOR_MAX, PIN_CHALLENGE_MAX, type PinItem, type PinSheet } from "@/lib/pinItems";
import { topicDoodle, selfCheckFaces } from "@/lib/worksheetVisuals";

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
export const SHARE_IMAGE_VERSION = 4;

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

type ShareData = { subjectLabel: string; grade: number; name: string; items: PinItem[]; total: number; sheet: PinSheet; pages: PinItem[][] };

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
  const { sheet, pages } = planPinPages(layout);
  return { subjectLabel: s.label, grade, name: topic.label.replace(/^The /, ""), items: pages.flat(), total: layout.questions.length, sheet, pages };
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
    <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
      <div style={{ display: "flex", fontSize: 26, color: "#1e293b", lineHeight: 1.33 }}>
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

// Worksheet tints, matching the printed sheet (components/WorksheetSheet.tsx).
const TINT: Record<string, { band: string; border: string; badge: string }> = {
  math: { band: "#f0f9ff", border: "#bae6fd", badge: "#0284c7" },
  english: { band: "#fff1f2", border: "#fecdd3", badge: "#e11d48" },
  science: { band: "#ecfdf5", border: "#a7f3d0", badge: "#059669" },
  physics: { band: "#eef2ff", border: "#c7d2fe", badge: "#4f46e5" },
  chemistry: { band: "#fff7ed", border: "#fed7aa", badge: "#ea580c" },
  biology: { band: "#f0fdfa", border: "#99f6e4", badge: "#0d9488" },
  computer: { band: "#f5f3ff", border: "#ddd6fe", badge: "#7c3aed" },
};

const Line = ({ label, flex }: { label: string; flex: number }) => (
  <div style={{ display: "flex", alignItems: "flex-end", flex, marginRight: 22, fontSize: 22, color: "#475569" }}>
    {label}<div style={{ display: "flex", flex: 1, borderBottom: "2px solid #94a3b8", height: 26, marginLeft: 10 }} />
  </div>
);

/**
 * Tall 2:3 pin drawn as a page of the real worksheet: brand row, tinted title
 * band with score box, then the page's content, then the footer.
 * Page 1 adds the name line, directions, worked example and "Remember" chart;
 * the last page adds the Challenge corner and "How did I do?".
 * Without `page` it's the single summary pin for topic pages (page 1 + "N more").
 */
export function PinImage({ d, page }: { d: ShareData; page?: { index: number; pages: PinItem[][] } }) {
  const sh = d.sheet;
  const t = TINT[sh.subject] || TINT.math;
  const paged = !!page;
  const pages = page?.pages ?? d.pages;
  const pageCount = paged ? pages.length : 1;
  const idx = page?.index ?? 0;
  const shown = pages[idx] || [];
  const nums = questionNums(shown);
  const isFirst = idx === 0;
  const isLast = paged ? idx === pageCount - 1 : pages.length <= 1;
  const left = d.total - (nums.length ? nums[nums.length - 1] : 0);
  const title = clip(sh.title, 60);

  const note = paged
    ? (!isLast ? `Continued on page ${idx + 2} →` : left > 0 ? `+ ${left} more on the free PDF` : "Answer key on the free PDF")
    : left > 0 ? `+ ${left} more questions on the free PDF` : "Answer key on the free PDF";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ffffff", padding: 52, fontFamily: "DejaVu", color: "#0f172a" }}>
      {/* brand row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 44 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, fontWeight: 700, color: "#334155" }}>
          <div style={{ display: "flex", width: 30, height: 30, borderRadius: 8, background: "#0b1220", color: "#F0C94E", fontSize: 18, alignItems: "center", justifyContent: "center", marginRight: 10 }}>P</div>
          {BRAND.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: "#64748b" }}>
          {paged && pageCount > 1 && (
            <div style={{ display: "flex", background: t.badge, color: "white", fontSize: 22, fontWeight: 700, borderRadius: 999, padding: "5px 16px", marginRight: 14 }}>{`Page ${idx + 1} of ${pageCount}`}</div>
          )}
          {BRAND.domain}
        </div>
      </div>

      {/* title band */}
      <div style={{ display: "flex", alignItems: "center", background: t.band, border: `2px solid ${t.border}`, borderRadius: 22, padding: isFirst ? "18px 22px" : "12px 20px", marginTop: 10, height: isFirst ? 140 : 94 }}>
        {isFirst && <div style={{ display: "flex", marginRight: 18 }}><PinVisual v={topicDoodle(sh.subject, sh.topic)} max={{ w: 96, h: 84 }} /></div>}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: isFirst ? (title.length > 30 ? 36 : 44) : 30, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: "#64748b", marginTop: 8, letterSpacing: 1 }}>{`GRADE ${sh.grade} · ${sh.subjectLabel.toUpperCase()}${isFirst ? "" : " · CONTINUED"}`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: isFirst ? 104 : 84, height: isFirst ? 104 : 84, borderRadius: 999, border: "3px solid #94a3b8", background: "white" }}>
          <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#64748b" }}>SCORE</div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: "#334155", marginTop: 4 }}>{`__/${sh.total}`}</div>
        </div>
      </div>

      {/* body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {isFirst && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", marginTop: 22 }}><Line label="Name" flex={2} /><Line label="Class" flex={1} /><Line label="Date" flex={1} /></div>
            {sh.goal && (
              <div style={{ display: "flex", marginTop: 14, fontSize: 21, color: "#334155", lineHeight: 1.35 }}>
                <div style={{ display: "flex", fontWeight: 700, marginRight: 8, flexShrink: 0 }}>Learning goal:</div>
                <div style={{ display: "flex", flex: 1 }}>{sh.goal}</div>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 14, border: "2px dashed #cbd5e1", borderRadius: 14, padding: "10px 16px", fontSize: 21, lineHeight: 1.35 }}>
              <div style={{ display: "flex", fontWeight: 700, marginRight: 8, flexShrink: 0 }}>Directions:</div>
              <div style={{ display: "flex", flex: 1 }}>{sh.directions}</div>
            </div>
            {sh.example && (
              <div style={{ display: "flex", marginTop: 14, background: "#fffbeb", border: "2px solid #fcd34d", borderRadius: 16, padding: "12px 16px" }}>
                <div style={{ display: "flex", background: "#fbbf24", color: "#451a03", fontSize: 16, fontWeight: 700, borderRadius: 999, padding: "4px 12px", height: 30, marginRight: 14 }}>EXAMPLE</div>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, fontSize: 23, lineHeight: 1.3 }}>
                  <div style={{ display: "flex" }}>{sh.example.text}</div>
                  <div style={{ display: "flex", marginTop: 4, color: "#334155" }}>
                    <div style={{ display: "flex", marginRight: 8 }}>Answer:</div>
                    <div style={{ display: "flex", color: "#1d4ed8", fontWeight: 700 }}>{sh.example.answer}</div>
                  </div>
                </div>
              </div>
            )}
            {sh.wordBank && (
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 14, border: `2px solid ${t.border}`, borderRadius: 14, padding: "8px 14px", fontSize: 22 }}>
                <div style={{ display: "flex", fontWeight: 700, marginRight: 12 }}>Word bank:</div>
                {sh.wordBank.map((w, i) => <div key={i} style={{ display: "flex", marginRight: 18 }}>{w}</div>)}
              </div>
            )}
            {sh.anchor && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 14, border: `2px solid ${t.border}`, borderRadius: 16, padding: "10px 16px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: 18, fontWeight: 700, color: "#475569" }}>
                  <div style={{ display: "flex", background: t.badge, color: "white", borderRadius: 6, padding: "2px 10px", marginRight: 10 }}>REMEMBER</div>
                  {sh.anchor.title.toUpperCase()}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}><PinVisual v={sh.anchor.visual} max={PIN_ANCHOR_MAX} /></div>
              </div>
            )}
          </div>
        )}

        {shown.map((it, i) => <PinBlock key={i} it={it} accent={t.badge} />)}

        {isLast && sh.challenge && (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, background: "#f5f3ff", border: "3px dashed #c4b5fd", borderRadius: 16, padding: "12px 18px" }}>
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#6d28d9" }}>
              <div style={{ display: "flex" }}>CHALLENGE CORNER</div>
              <div style={{ display: "flex", fontWeight: 400, color: "#8b5cf6", marginLeft: 10 }}>for fast finishers</div>
            </div>
            <div style={{ display: "flex", fontSize: 23, marginTop: 6, lineHeight: 1.3 }}>{sh.challenge.text}</div>
            {sh.challenge.visual && <div style={{ display: "flex", marginTop: 8 }}><PinVisual v={sh.challenge.visual} max={PIN_CHALLENGE_MAX} /></div>}
            <div style={{ display: "flex", borderBottom: "2px solid #c4b5fd", height: 30 }} />
          </div>
        )}
        {isLast && (
          <div style={{ display: "flex", marginTop: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", border: "2px solid #cbd5e1", borderRadius: 12, padding: "8px 14px", marginRight: 14 }}>
              <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#475569" }}>HOW DID I DO?</div>
              <PinVisual v={selfCheckFaces()} max={{ w: 200, h: 46 }} />
            </div>
            <div style={{ display: "flex", flex: 1, border: "2px solid #cbd5e1", borderRadius: 12, padding: "8px 14px", fontSize: 16, fontWeight: 700, color: "#475569" }}>TEACHER&apos;S COMMENTS</div>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid #e2e8f0", paddingTop: 16, height: 70 }}>
        <div style={{ display: "flex", fontSize: 19, color: "#94a3b8" }}>{`Free worksheets + answer keys · ${BRAND.domain}`}</div>
        <div style={{ display: "flex", background: "#0b1220", color: "white", fontSize: 19, fontWeight: 700, borderRadius: 999, padding: "8px 18px", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 16 }}>{note}</div>
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
