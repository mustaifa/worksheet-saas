/**
 * Turns a plain list of generated questions into a teacher-style worksheet
 * layout: directions, a learning goal, tick-box choices, inline blanks, a word
 * bank, answer boxes or writing lines, pictures and a one/two column plan.
 *
 * Pure and deterministic: the same questions always give the same layout, so
 * screen, print and PDF match and nothing changes the questions or answers.
 */
import type { Question } from "./subjects/types";
import { visualFor, questionIcon, picVisual, type Visual } from "./worksheetVisuals";
import { locateSkill, STANDARDS } from "./curriculum";
import { scienceDiagram } from "./scienceDiagrams";
import { anchorChart, type AnchorChart } from "./anchorCharts";

export type AnswerMode = "box" | "lines" | "blank" | "choice";

export type LaidOutQuestion = {
  n: number;
  /** Question text as shown (may be shortened when a picture carries the details). */
  text: string;
  answer: string;
  mode: AnswerMode;
  /** Options to circle/tick (or a mini word box when the question also has a blank). */
  choices?: string[];
  /** The option that matches the answer (for the answer key). */
  correct?: string;
  lines: number;
  visual?: Visual | null;
  /** Word to underline inside `text` (e.g. the word to classify). */
  em?: string;
  /** Short item shown in a boxed card (a mini-passage) rather than plain text. */
  boxed?: boolean;
  /** Match activities: the letter of the correct option. */
  letter?: string;
  /** Small decorative picture of the thing the question is about (early grades). */
  icon?: Visual | null;
};

export type SectionKind = "list" | "tick" | "match" | "label";

/** One "Part" of the worksheet: its own instruction and activity format. */
export type Section = {
  part?: string; // "Part A"
  heading?: string;
  kind: SectionKind;
  nums: number[];
  /** List parts: one or two columns of question cards. */
  columns?: 1 | 2;
  /** Two-column list of short items with an answer line beside each. */
  compact?: boolean;
  /** Tick tables: the column headings (the options). */
  tickCols?: string[];
  /** Match: the lettered options on the right. */
  options?: { letter: string; text: string }[];
  /** Label: the diagram (numbered markers are already drawn on it). */
  diagram?: Visual;
  bank?: string[];
};

export type WorksheetLayout = {
  title: string;
  topic?: string;
  subject: string;
  subjectLabel: string;
  grade: number;
  directions: string;
  goal?: string;
  wordBank?: string[];
  passage?: { title?: string; text: string };
  columns: 1 | 2;
  /** Bigger type and boxes for the youngest children. */
  large: boolean;
  questions: LaidOutQuestion[];
  sections: Section[];
  /** A worked example shown before the questions. */
  example?: { text: string; answer: string };
  /** A "Remember" reference chart for the topic. */
  anchor?: AnchorChart;
};

const norm = (s: string) =>
  s.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[“”"'‘’.,!?:;]/g, " ").replace(/\b(a|an|the)\b/g, " ").replace(/\s+/g, " ").trim();

export const BLANK_RE = /_{2,}/g;

/** Finds options written into the question and keeps them only if the answer is one of them. */
function findChoices(q: string, a: string): { choices: string[]; text: string } | null {
  const want = norm(a);
  const cap = (o: string) => o.charAt(0).toUpperCase() + o.slice(1);
  const ok = (opts: string[]) => {
    const clean = opts.map((o) => o.trim()).filter(Boolean);
    return clean.length >= 2 && clean.every((o) => !/^\s*$/.test(o)) && clean.length <= 5 && clean.every((o) => o.length <= 28) && clean.some((o) => norm(o) === want) &&
      new Set(clean.map(norm)).size === clean.length ? clean.map(cap) : null;
  };
  let m: RegExpMatchArray | null;

  // (use <, >, or =)
  if (/\(use <, >, or =\)/.test(q)) {
    const c = ok(["<", ">", "="]);
    if (c) return { choices: c, text: q.replace(/\s*\(use <, >, or =\)/, "").trim() };
  }
  // (bark / barks) or (is/are) anywhere
  if ((m = q.match(/\(([^()]+?(?:\s*\/\s*[^()]+?)+)\)/))) {
    const parts = m[1].split("/");
    const c = parts.every((o) => /^[A-Za-z' -]+$/.test(o.trim())) ? ok(parts) : null;
    if (c) return { choices: c, text: q.replace(m[0], "").replace(/\s{2,}/g, " ").replace(/\s+([.?!])/g, "$1").trim() };
  }
  // Choose and, but or or: '…'
  if ((m = q.match(/^Choose ((?:[\w']+, )*[\w']+,? or [\w']+):\s*/))) {
    const c = ok(m[1].replace(/,? or /, ", ").split(", "));
    if (c) return { choices: c, text: q.slice(m[0].length).trim() };
  }
  // Answer yes or no.
  if (/Answer yes or no\.?$/.test(q)) {
    const c = ok(["yes", "no"]);
    if (c) return { choices: c, text: q.replace(/\s*Answer yes or no\.?$/, "").trim() };
  }
  // Leading "Fact or opinion?" / "Fragment, run-on or complete sentence?"
  if ((m = q.match(/^((?:[A-Za-z][\w-]*(?: [\w-]+)?, )*[A-Za-z][\w-]*(?: [\w-]+)?,? or [\w-]+(?: [\w-]+)?)\?\s+/))) {
    const c = ok(m[1].replace(/,? or /, ", ").split(", "));
    if (c) return { choices: c, text: q.slice(m[0].length).trim() };
  }
  // 'warm' or 'hot'?
  if ((m = q.match(/'([^']+)' or '([^']+)'\?/))) {
    const c = ok([m[1], m[2]]);
    if (c) return { choices: c, text: q };
  }
  // … a solid, liquid, or gas?   /   … a noun or a verb?
  if ((m = q.match(/((?:(?:an? )?[\w-]+, )+(?:an? )?[\w-]+,? or (?:an? )?[\w-]+)\?/)) || (m = q.match(/((?:an? )?[\w-]+ or (?:an? )?[\w-]+)\?/))) {
    const c = ok(m[1].replace(/,? or /, ", ").split(", ").map((o) => o.replace(/^an? /, "")));
    if (c) return { choices: c, text: q };
  }
  return null;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const bankWord = (a: string) => a.replace(/\s*\([^)]*\)/g, "").trim();

/** Letter-multiset similarity (0–1): "tall"/"taller" 0.8, "freind"/"friend" 1. */
function letterSim(a: string, b: string) {
  const count = (s: string) => { const m = new Map<string, number>(); for (const ch of s.toLowerCase().replace(/[^a-z]/g, "")) m.set(ch, (m.get(ch) || 0) + 1); return m; };
  const A = count(a), B = count(b);
  let common = 0, na = 0, nb = 0;
  A.forEach((v, k) => { na += v; common += Math.min(v, B.get(k) || 0); });
  B.forEach((v) => { nb += v; });
  return na + nb ? (2 * common) / (na + nb) : 0;
}

/** True when the answer is just a reworking of a word in the question (spelling, plurals, contractions…), where a word bank would give it away. */
function answerDerivedFromQuestion(q: string, a: string) {
  const ans = bankWord(a);
  const toks = q.split(/[^A-Za-z']+/).filter((t) => t.length >= 3);
  const words = ans.split(/\s+/).filter((w) => w.replace(/[^A-Za-z]/g, "").length >= 3);
  return toks.some((tok) => letterSim(tok, ans) >= 0.7 || words.some((w) => letterSim(tok, w) >= 0.85));
}

const QO = `["“']`, QC = `["”']`;
const unquote = (t: string) => t.trim().replace(/^["“']([\s\S]*)["”']\.?$/, "$1").trim();
const words = (t: string) => t.trim().split(/\s+/).length;

/** Friendlier headings for common one-line instructions. */
const HEADINGS: Record<string, string> = {
  "Define": "Write what each word means.",
  "Correct the spelling": "Write each word with the correct spelling.",
  "Add a comma": "Rewrite each sentence with the missing comma.",
  "Add commas": "Rewrite each sentence with the missing commas.",
  "Fix the capitals": "Rewrite each sentence with the correct capital letters.",
  "Fix the sentence": "Rewrite each sentence correctly.",
  "Text structure": "What is the text structure of each passage?",
  "Tone": "What is the tone of each sentence?",
  "Name the mood": "Name the mood of each verb.",
  "Choose a transition": "Choose a transition word to fill each blank.",
  "Choose the correct word": "Choose the correct word to fill each blank.",
  "What punctuation belongs in the blank": "Write the punctuation mark that belongs in each blank.",
};

type Tpl = { key: string; heading: string; item: string; em?: string; boxed?: boolean; tick?: boolean };

/** Recognises "same instruction, different item" questions so the instruction can be written once. */
function templateOf(q: LaidOutQuestion, orig: string): Tpl | null {
  let m: RegExpMatchArray | null;
  const ch = q.choices;
  if (ch && q.mode === "choice") {
    if ((m = orig.match(new RegExp(`^In (?:the sentence )?${QO}(.+?)${QC},? is ${QO}(.+?)${QC} (an? [\\w-]+(?:,? (?:or )?an? [\\w-]+)+)\\?$`)))) {
      return { key: `tick:${m[3]}`, heading: `Is the underlined word ${m[3]}? Tick one box.`, item: m[1], em: m[2], tick: true };
    }
    if ((m = orig.match(/^Is an? (.+?) living or non-living\?$/))) {
      return { key: "tick:living", heading: "Is each one living or non-living? Tick one box.", item: m[1].charAt(0).toUpperCase() + m[1].slice(1), tick: true };
    }
    if ((m = orig.match(new RegExp(`^Is this sentence (.+?)\\? ${QO}(.+)${QC}$`)))) {
      return { key: `tick:${m[1]}`, heading: `Is each sentence ${m[1]}? Tick one box.`, item: m[2], tick: true };
    }
    if (q.text !== orig && q.text.length <= 130 && !BLANK_RE.test(q.text)) {
      BLANK_RE.lastIndex = 0;
      const opts = ch.join(" or ");
      return { key: `tick:${ch.join("|")}`, heading: `${opts}? Tick one box for each.`, item: unquote(q.text), tick: true };
    }
    BLANK_RE.lastIndex = 0;
    return null;
  }
  if ((m = orig.match(new RegExp(`^Use context: ${QO}(.+)${QC} What does ${QO}(.+?)${QC} mean\\?$`)))) {
    return { key: "context", heading: "Use the clues in each sentence to work out what the underlined word means.", item: m[1], em: m[2] };
  }
  if ((m = orig.match(new RegExp(`^Read: ${QO}(.+)${QC} (What is (?:the|a) [\\w ]+\\?)$`)))) {
    return { key: `read:${m[2]}`, heading: `Read each short text. ${m[2]}`, item: m[1], boxed: true };
  }
  if ((m = orig.match(new RegExp(`^What does the idiom ${QO}(.+?)${QC} mean\\?$`)))) {
    return { key: "idiom", heading: "What does each idiom mean?", item: m[1] };
  }
  // "Instruction: 'item'" / "Instruction? 'item'"
  if ((m = orig.match(new RegExp(`^([A-Z][^"“'?:]{2,60}?)([:?])\\s+${QO}(.+)${QC}\\.?$`)))) {
    const p = m[1].trim();
    return { key: `p:${p}`, heading: HEADINGS[p] || `${p}${m[2] === "?" ? "?" : ":"}`, item: m[3], boxed: m[3].length > 90 };
  }
  // "Give a synonym for 'happy'."
  if ((m = orig.match(new RegExp(`^([A-Z][\\w ,'-]{3,50}?) ${QO}([^"“”]+?)${QC}\\.?$`)))) {
    const p = m[1].trim();
    return { key: `w:${p}`, heading: HEADINGS[p] || `${p} each ${words(m[2]) <= 3 ? "word" : "sentence"}.`.replace(/ for each/, " for each").replace(/^Give /, "Write "), item: m[2] };
  }
  return null;
}

const bankable = (a: string) => {
  const w = bankWord(a);
  return w.length >= 2 && w.length <= 24 && w.split(/\s+/).length <= 3 && !/\d/.test(w) && !/[,;]/.test(w);
};

function restHeading(qs: LaidOutQuestion[], grade: number, isMath: boolean) {
  const count = (m: AnswerMode) => qs.filter((q) => q.mode === m).length;
  if (isMath) return qs.some((q) => q.visual) ? "Use the pictures to help you. Write each answer in the box." : "Solve each problem. Show your work, then write your answer in the box.";
  if (count("choice") > qs.length / 2) return "Circle the best answer.";
  if (count("blank") > qs.length / 2) return "Fill in each blank.";
  return grade >= 3 ? "Answer each question. Use full sentences where you can." : "Write your answer on the line.";
}

export function layoutWorksheet(opts: {
  subject: string;
  subjectLabel: string;
  grade: number;
  topic: string;
  title: string;
  questions: Question[];
  /** An extra question shown as a worked example (not numbered or scored). */
  example?: Question;
}): WorksheetLayout {
  const { subject, grade, topic, questions } = opts;
  const isMath = subject === "math";
  const first = questions[0];
  const passage = first?.passage ? { title: first.passageTitle, text: first.passage } : undefined;

  const prep = (item: Question, i: number): LaidOutQuestion => {
    const iconOnly = item.pic?.startsWith("icon:");
    const visual = iconOnly ? null : visualFor(subject, topic, grade, item.q, item.pic);
    const icon = iconOnly ? picVisual(item.pic!) : visual ? null : questionIcon(subject, grade, item.q);
    let text = visual?.prompt || item.q;
    const ch = findChoices(text, item.a);
    if (ch) text = ch.text;
    const hasBlank = BLANK_RE.test(text);
    BLANK_RE.lastIndex = 0;
    const mode: AnswerMode = ch && !hasBlank ? "choice" : hasBlank ? "blank" : isMath ? "box" : "lines";
    const long = item.a.length > 38 || /\bexplain|describe|why\b|what is the difference/i.test(item.q);
    const correct = ch?.choices.find((c) => norm(c) === norm(item.a));
    return { n: i + 1, text, answer: item.a, mode, choices: ch?.choices, correct, lines: mode === "lines" ? (long ? 2 : 1) : 0, visual, icon };
  };
  const laid = questions.map(prep);

  // ---- Group into parts --------------------------------------------------
  type Group = { sec: Section; qs: LaidOutQuestion[] };
  const groups: Group[] = [];
  const used = new Set<LaidOutQuestion>();

  // A. Label the diagram (science topics with a matching diagram).
  const labelQs: LaidOutQuestion[] = [];
  let diagramSec: Section | null = null;
  if (subject === "science" && !passage) {
    const d = scienceDiagram(topic, grade);
    if (d) {
      for (const l of d.labels) labelQs.push({ n: 0, text: "", answer: l.answer, mode: "lines", lines: 1 });
      diagramSec = { kind: "label", heading: "Label the diagram. Use the words in the box.", nums: [], diagram: d.visual, bank: [...d.labels.map((l) => l.answer)].sort((a, b) => hash(a) - hash(b)) };
      groups.push({ sec: diagramSec, qs: labelQs });
    }
  }

  // B. Same-instruction runs → one instruction, then a list or tick table.
  if (!passage) {
    const byKey = new Map<string, { t: Tpl; items: [LaidOutQuestion, Tpl][] }>();
    laid.forEach((q, i) => {
      const t = templateOf(q, questions[i].q);
      if (!t) return;
      const e = byKey.get(t.key) || { t, items: [] };
      e.items.push([q, t]); byKey.set(t.key, e);
    });
    for (const { t, items } of byKey.values()) {
      if (items.length < 3) continue;
      const qs = items.map(([q, tt]) => {
        used.add(q);
        q.text = tt.item; q.em = tt.em; q.boxed = tt.boxed;
        if (q.mode === "lines" && tt.boxed) q.lines = Math.max(q.lines, 1);
        return q;
      });
      const tick = !!t.tick;
      const sec: Section = { kind: tick ? "tick" : "list", heading: t.heading, nums: [], tickCols: tick ? qs[0].choices : undefined };
      if (!tick && qs.every((q) => !q.boxed && q.text.length <= 34 && q.answer.length <= 22 && (q.mode === "lines" || (q.mode === "blank" && !q.choices)))) {
        sec.compact = true;
        qs.forEach((q) => { q.lines = 1; });
      }
      groups.push({ sec, qs });
    }
  }

  // C. Match it up: short-answer vocabulary questions (not maths, no passage).
  if (!isMath && !passage) {
    const seen = new Set<string>();
    const cand = laid.filter((q) => {
      if (used.has(q) || q.mode !== "lines" || q.visual || q.text.length > 110 || !bankable(q.answer)) return false;
      const k = norm(bankWord(q.answer));
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
    const derived = cand.filter((q) => answerDerivedFromQuestion(q.text, q.answer)).length;
    if (cand.length >= 4 && derived < cand.length * 0.4) {
      const qs = cand.slice(0, 6);
      qs.forEach((q) => used.add(q));
      const opts = qs.map((q) => bankWord(q.answer).replace(/^(the|a|an) (?=\S)/i, "")).map((w) => (w.charAt(0).toUpperCase() + w.slice(1))).sort((a, b) => hash(a) - hash(b));
      const options = opts.map((t, i) => ({ letter: String.fromCharCode(65 + i), text: t }));
      qs.forEach((q) => { q.letter = options.find((o) => norm(o.text) === norm(bankWord(q.answer)))?.letter; q.lines = 0; });
      groups.splice(diagramSec ? 1 : 0, 0, { sec: { kind: "match", heading: "Match each clue to the right word. Write the letter in the box.", nums: [], options }, qs });
    }
  }

  // D. Everything else.
  const rest = laid.filter((q) => !used.has(q));
  const partsCount = groups.length + (rest.length ? 1 : 0);

  // Word bank for the remaining open questions (younger grades).
  let wordBank: string[] | undefined;
  const open = rest.filter((q) => q.mode === "lines" || (q.mode === "blank" && !q.choices));
  if (!isMath && !passage && grade <= 7 && open.length >= (partsCount > 1 ? 3 : 4) && open.length === rest.filter((q) => q.mode !== "choice").length) {
    const ws = open.map((q) => bankWord(q.answer));
    const unique = [...new Map(ws.map((w) => [norm(w), w])).values()];
    const derived = open.filter((q) => answerDerivedFromQuestion(q.text, q.answer)).length;
    if (ws.every(bankable) && unique.length >= 3 && derived < open.length * 0.4) {
      wordBank = unique.sort((a, b) => hash(a) - hash(b));
      for (const q of open) if (q.mode === "lines") q.lines = 1;
    }
  }
  if (rest.length) {
    groups.push({ sec: { kind: "list", heading: partsCount > 1 ? restHeading(rest, grade, isMath) : undefined, nums: [], bank: wordBank }, qs: rest });
  }

  // Number everything in reading order, name the parts.
  const ordered: LaidOutQuestion[] = [];
  const sections: Section[] = groups.map((g, i) => {
    g.qs.forEach((q) => { q.n = ordered.length + 1; ordered.push(q); });
    return { ...g.sec, nums: g.qs.map((q) => q.n), part: groups.length > 1 ? `Part ${String.fromCharCode(65 + i)}` : undefined };
  });
  // Number markers on the diagram match the question numbers.
  if (diagramSec) {
    const sec = sections[0];
    const d = scienceDiagram(topic, grade)!;
    sec.diagram = withMarkers(d.visual, d.labels.map((l, i) => ({ ...l, n: sec.nums[i] })));
  }

  // ---- Directions ---------------------------------------------------------
  const anyVisual = ordered.some((q) => q.visual);
  const nChoice = ordered.filter((q) => q.mode === "choice" || q.choices).length;
  const nBlank = ordered.filter((q) => q.mode === "blank").length;
  const parts: string[] = [];
  if (passage) parts.push("Read the passage carefully, then answer the questions.");
  if (sections.length > 1) {
    parts.push(`This worksheet has ${sections.length} parts. Read the instructions at the start of each part.`);
  } else {
    const only = sections[0];
    if (only?.heading) parts.push(only.heading);
    else {
      if (wordBank) parts.push(wordBank.length === open.length ? "Use the words in the word bank. Each word is used once." : "Use the words in the word bank to help you.");
      const nPictureOnly = ordered.filter((q) => q.visual?.prompt).length;
      if (isMath) {
        if (nPictureOnly > ordered.length / 2) parts.push("Look carefully at each picture, then write your answer in the box.");
        else {
          if (anyVisual) parts.push("Use the pictures to help you.");
          parts.push(nBlank > ordered.length / 2 ? "Fill in each blank." : nChoice > ordered.length / 2 ? "Circle the correct answer." : "Solve each problem. Show your work, then write your answer in the box.");
        }
      } else if (!passage && !wordBank) {
        if (nChoice > ordered.length / 2) parts.push("Read each question and circle the best answer.");
        else if (nBlank > ordered.length / 2) parts.push("Read each sentence and fill in the blank.");
        else if (nChoice > 0) parts.push("Read each question carefully. Circle the correct choice or write your answer on the line.");
        else parts.push("Read each question carefully and write your answer on the line.");
      }
      if (anyVisual && !isMath) parts.push(grade <= 3 ? "Use the pictures to help you." : "Use the diagram to help you.");
    }
    if (only?.heading && only.bank) parts.push("Use the words in the word bank.");
  }
  if (sections.length === 1 && sections[0].heading) sections[0].heading = undefined; // already in the directions

  let goal: string | undefined;
  if (subject === "math" || subject === "english" || subject === "science") {
    const loc = locateSkill(subject, grade, topic);
    if (loc) goal = `${loc.lesson.title}${loc.skill.std ? ` · ${STANDARDS[subject].short} ${loc.skill.std}` : ""}`;
  }

  const compact = rest.length > 0 && rest.every((q) => q.text.length <= (q.visual ? 72 : 44) && (q.mode === "box" || q.mode === "blank" || q.mode === "choice") && (!q.visual || q.visual.w <= 260));
  const columns: 1 | 2 = !passage && rest.length >= 4 && compact ? 2 : 1;
  const restSec = rest.length ? sections[sections.length - 1] : undefined;
  if (restSec) restSec.columns = columns;

  // ---- Worked example
  let example: WorksheetLayout["example"];
  if (opts.example && !passage && !opts.example.pic && !visualFor(subject, topic, grade, opts.example.q)?.prompt) {
    let text = opts.example.q;
    if (BLANK_RE.test(text)) { BLANK_RE.lastIndex = 0; text = text.replace(BLANK_RE, "____"); }
    if (text.length <= 220 && opts.example.a.length <= 120) example = { text, answer: opts.example.a };
  }

  return {
    title: opts.title,
    topic,
    subject,
    subjectLabel: opts.subjectLabel,
    grade,
    directions: parts.join(" "),
    goal,
    wordBank: sections.length === 1 ? wordBank : undefined,
    passage,
    columns,
    large: grade <= 2,
    questions: ordered,
    sections,
    example,
    anchor: passage || diagramSec ? undefined : anchorChart(subject, topic, grade) ?? undefined,
  };
}

/** Adds numbered circles (and leader lines) where the labels go. */
function withMarkers(v: Visual, labels: { x: number; y: number; ax?: number; ay?: number; n: number }[]): Visual {
  const shapes = [...v.shapes];
  for (const l of labels) {
    if (l.ax !== undefined && l.ay !== undefined) {
      shapes.push({ k: "line", x1: l.x, y1: l.y, x2: l.ax, y2: l.ay, stroke: "#334155", sw: 1.2 });
      shapes.push({ k: "circle", cx: l.ax, cy: l.ay, r: 2.2, fill: "#334155" });
    }
    shapes.push({ k: "circle", cx: l.x, cy: l.y, r: 10, fill: "#fff", stroke: "#334155", sw: 1.6 });
    shapes.push({ k: "text", x: l.x, y: l.y + 4.5, t: String(l.n), size: 12, bold: true, anchor: "middle", fill: "#0f172a" });
  }
  return { ...v, shapes };
}

/** Splits question text around blanks so they can be drawn as writing gaps. */
export function splitBlanks(text: string): string[] {
  return text.split(BLANK_RE);
}
