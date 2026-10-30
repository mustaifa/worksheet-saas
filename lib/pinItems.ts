// Turns a laid-out worksheet into the blocks a Pinterest pin shows: each question
// with its picture (clock, number line, diagram, chart…), options to circle, and
// part headings — so the pin looks like the real worksheet, not just its text.
// Pure data, safe on both server (image route) and client (Pin it dialog).
import type { WorksheetLayout, LaidOutQuestion } from "@/lib/worksheetLayout";
import type { Visual } from "@/lib/worksheetVisuals";

export type PinItem =
  | { kind: "q"; n: number; text: string; visual?: Visual; icon?: Visual; choices?: string[] }
  | { kind: "heading"; text: string }
  | { kind: "passage"; title?: string; text: string }
  | { kind: "diagram"; visual: Visual; caption?: string };

const clipText = (s: string, n: number) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:(]+$/, "") + "…";
};

const showText = (q: LaidOutQuestion) => clipText(q.text.replace(/_{2,}/g, "____"), 150);

export function pinItemsFromLayout(layout: WorksheetLayout): PinItem[] {
  const items: PinItem[] = [];
  const byNum = new Map(layout.questions.map((q) => [q.n, q]));

  if (layout.passage) items.push({ kind: "passage", title: layout.passage.title, text: clipText(layout.passage.text, 420) });

  const pushQ = (q: LaidOutQuestion, extraChoices?: string[]) => {
    if (!q.text && !q.visual) return; // label answers: the numbered diagram carries them
    items.push({
      kind: "q", n: q.n, text: showText(q) || "(see picture)",
      visual: q.visual || undefined,
      icon: !q.visual && q.icon ? q.icon : undefined,
      choices: q.mode === "choice" && q.choices ? q.choices : extraChoices,
    });
  };

  if (!layout.sections.length) {
    layout.questions.forEach((q) => pushQ(q));
    return items;
  }

  for (const sec of layout.sections) {
    if (layout.sections.length > 1 && (sec.part || sec.heading)) {
      items.push({ kind: "heading", text: [sec.part, sec.heading].filter(Boolean).join(" · ") });
    }
    if (sec.kind === "label" && sec.diagram) {
      const labels = sec.nums.map((n) => byNum.get(n)).filter(Boolean) as LaidOutQuestion[];
      const caption = labels.length ? `Questions ${labels[0].n}–${labels[labels.length - 1].n}: write the label for each numbered part.` : undefined;
      items.push({ kind: "diagram", visual: sec.diagram, caption });
      continue;
    }
    if (sec.kind === "match" && sec.options?.length) {
      items.push({ kind: "heading", text: "Match each item with: " + sec.options.map((o) => `${o.letter}) ${o.text}`).join("   ") });
    }
    for (const n of sec.nums) {
      const q = byNum.get(n);
      if (q) pushQ(q, sec.kind === "tick" ? sec.tickCols : undefined);
    }
  }
  return items;
}

// ---- Size estimates (pixels on the 1000×1500 pin, 26px text in a ~720px column) ----

export const PIN_TEXT = { perLine: 48, lineH: 34, gap: 20 };
export const PIN_VISUAL_MAX = { w: 640, h: 190 };
export const PIN_DIAGRAM_MAX = { w: 760, h: 420 };

export function visualScale(v: Visual, max: { w: number; h: number }) {
  return Math.min(max.w / v.w, max.h / v.h, 2);
}

const textH = (s: string, perLine = PIN_TEXT.perLine, lineH = PIN_TEXT.lineH) => Math.max(1, Math.ceil(s.length / perLine)) * lineH;

export function itemHeight(it: PinItem): number {
  switch (it.kind) {
    case "heading": return textH(it.text, 54, 30) + 18;
    case "passage": return textH(it.text, 54, 30) + (it.title ? 36 : 0) + 40 + PIN_TEXT.gap;
    case "diagram": return Math.round(it.visual.h * visualScale(it.visual, PIN_DIAGRAM_MAX)) + PIN_TEXT.gap + 10 + (it.caption ? textH(it.caption, 54, 30) + 8 : 0);
    case "q": {
      let h = textH(it.text) + PIN_TEXT.gap;
      if (it.visual) h += Math.round(it.visual.h * visualScale(it.visual, PIN_VISUAL_MAX)) + 10;
      if (it.choices?.length) h += textH(it.choices.join("     "), 52, 32) + 6;
      return h;
    }
  }
}

/** Number of questions in a list of items (for "Questions 10–20"). */
export const questionNums = (items: PinItem[]) => items.filter((i): i is Extract<PinItem, { kind: "q" }> => i.kind === "q").map((i) => i.n);
