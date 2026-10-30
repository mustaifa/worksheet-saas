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

export const PIN_TEXT = { perLine: 56, lineH: 35, gap: 24 };
export const PIN_VISUAL_MAX = { w: 760, h: 200 };
export const PIN_DIAGRAM_MAX = { w: 860, h: 460 };

export function visualScale(v: Visual, max: { w: number; h: number }) {
  return Math.min(max.w / v.w, max.h / v.h, 2.2);
}

const textH = (s: string, perLine = PIN_TEXT.perLine, lineH = PIN_TEXT.lineH) => Math.max(1, Math.ceil(s.length / perLine)) * lineH;

export function itemHeight(it: PinItem): number {
  switch (it.kind) {
    case "heading": return textH(it.text, 62, 30) + 20;
    case "passage": return textH(it.text, 66, 31) + (it.title ? 38 : 0) + 44 + PIN_TEXT.gap;
    case "diagram": return Math.round(it.visual.h * visualScale(it.visual, PIN_DIAGRAM_MAX)) + PIN_TEXT.gap + 10 + (it.caption ? textH(it.caption, 62, 30) + 8 : 0);
    case "q": {
      let h = textH(it.text) + PIN_TEXT.gap;
      if (it.visual) h += Math.round(it.visual.h * visualScale(it.visual, PIN_VISUAL_MAX)) + 10;
      if (it.choices?.length) h += textH(it.choices.join("     "), 58, 34) + 8;
      return h;
    }
  }
}

/** Number of questions in a list of items (for "Questions 10–20"). */
export const questionNums = (items: PinItem[]) => items.filter((i): i is Extract<PinItem, { kind: "q" }> => i.kind === "q").map((i) => i.n);

// ---- Whole-page plan: each pin is a mini worksheet page ----

/** The worksheet parts shown around the questions (header, example, chart, challenge). */
export type PinSheet = {
  title: string; subject: string; topic: string; subjectLabel: string; grade: number; total: number;
  directions: string; goal?: string; wordBank?: string[];
  example?: { text: string; answer: string };
  anchor?: { title: string; visual: Visual };
  challenge?: { text: string; visual?: Visual };
};

export const PIN_ANCHOR_MAX = { w: 860, h: 230 };
export const PIN_CHALLENGE_MAX = { w: 700, h: 170 };
export const MAX_Q_PER_PIN = 5;
export const MAX_PIN_PAGES = 10;

// Space for blocks below the title band (1500px pin, 52px margins, brand row, band, footer).
const BODY_FIRST = 1500 - 104 - 44 - 150 - 84;  // page 1: tall title band
const BODY_NEXT = 1500 - 104 - 44 - 104 - 84;   // later pages: compact band

export function pinSheetFromLayout(layout: WorksheetLayout): PinSheet {
  return {
    title: layout.title, subject: layout.subject, topic: layout.topic || "", subjectLabel: layout.subjectLabel,
    grade: layout.grade, total: layout.questions.length,
    directions: clipText(layout.directions, 260), goal: layout.goal ? clipText(layout.goal, 140) : undefined,
    wordBank: layout.wordBank?.length ? layout.wordBank.slice(0, 12) : undefined,
    example: layout.example ? { text: clipText(layout.example.text, 140), answer: clipText(layout.example.answer, 60) } : undefined,
    anchor: layout.anchor ? { title: layout.anchor.title, visual: layout.anchor.visual } : undefined,
    challenge: layout.challenge ? { text: clipText(layout.challenge.text, 200), visual: layout.challenge.visual || undefined } : undefined,
  };
}

/** Height of page 1's extras: name line, goal, directions, example, word bank, Remember chart. */
export function firstPageExtras(sh: PinSheet): number {
  let h = 64; // Name / Class / Date
  if (sh.goal) h += textH(sh.goal, 70, 30) + 10;
  h += textH(sh.directions, 62, 30) + 40;
  if (sh.example) h += textH(sh.example.text, 54, 32) + 32 + 46;
  if (sh.wordBank) h += textH(sh.wordBank.join("   "), 60, 34) + 50;
  if (sh.anchor) h += Math.round(sh.anchor.visual.h * visualScale(sh.anchor.visual, PIN_ANCHOR_MAX)) + 74;
  return h;
}

/** Height of the last page's closing blocks: Challenge corner and "How did I do?". */
export function lastPageExtras(sh: PinSheet): number {
  let h = 110; // self-check faces row
  if (sh.challenge) {
    h += textH(sh.challenge.text, 58, 32) + 100;
    if (sh.challenge.visual) h += Math.round(sh.challenge.visual.h * visualScale(sh.challenge.visual, PIN_CHALLENGE_MAX)) + 10;
  }
  return h;
}

/**
 * Split a worksheet into pin pages: page 1 carries the header extras, each page
 * holds up to 5 questions, and the last page ends with the challenge.
 * Returns the items on each page (an empty last page holds only the closing blocks).
 */
export function planPinPages(layout: WorksheetLayout): { sheet: PinSheet; pages: PinItem[][] } {
  const sheet = pinSheetFromLayout(layout);
  const items = pinItemsFromLayout(layout);
  const pages: PinItem[][] = [];
  let i = 0;
  while (i < items.length && pages.length < MAX_PIN_PAGES) {
    const budget = (pages.length === 0 ? BODY_FIRST - firstPageExtras(sheet) : BODY_NEXT);
    const page: PinItem[] = [];
    let used = 0, qs = 0;
    while (i < items.length) {
      const it = items[i];
      const need = itemHeight(it);
      if (it.kind === "q" && qs >= MAX_Q_PER_PIN) break;
      if (page.length && used + need > budget) break;
      page.push(it); used += need; i++;
      if (it.kind === "q") qs++;
    }
    while (page.length > 1 && page[page.length - 1].kind === "heading") { page.pop(); i--; }
    pages.push(page);
  }
  // The challenge goes on the last page if it fits, otherwise on a page of its own.
  if (pages.length && i >= items.length) {
    const last = pages[pages.length - 1];
    const budget = pages.length === 1 ? BODY_FIRST - firstPageExtras(sheet) : BODY_NEXT;
    const used = last.reduce((n, it) => n + itemHeight(it), 0);
    if (used + lastPageExtras(sheet) > budget && pages.length < MAX_PIN_PAGES) pages.push([]);
  }
  return { sheet, pages };
}
