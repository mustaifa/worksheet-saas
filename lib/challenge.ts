import { prisma } from "@/lib/prisma";

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'll\b/g, "i will"], [/\byou'll\b/g, "you will"], [/\bhe'll\b/g, "he will"], [/\bshe'll\b/g, "she will"],
  [/\bwe'll\b/g, "we will"], [/\bthey'll\b/g, "they will"],
  [/\bwon't\b/g, "will not"], [/\bdon't\b/g, "do not"], [/\bdoesn't\b/g, "does not"], [/\bdidn't\b/g, "did not"],
  [/\bcan't\b/g, "cannot"], [/\bi'm\b/g, "i am"], [/\bisn't\b/g, "is not"], [/\baren't\b/g, "are not"],
];

function normalizeAnswer(s: string): string {
  let out = s.trim().toLowerCase();
  for (const [pattern, replacement] of CONTRACTIONS) out = out.replace(pattern, replacement);
  // "3 : 1" and "3:1", "1 / 2" and "1/2" should compare equal
  out = out.replace(/\s*([:/])\s*/g, "$1");
  return out.replace(/[.,!?;:"']/g, "").replace(/\s+/g, " ").trim();
}

/** Normalizes an answer for lenient comparison: trims, lowercases, expands
 * common contractions, strips punctuation, treats numerically-equal answers
 * as a match, and for longer/sentence-style answers accepts a submission
 * if most of the correct answer's words are present — so "I will climb
 * every day" and "I'll climb every day" both count, instead of requiring a
 * character-perfect match. */
const stripArticles = (s: string) => s.replace(/^(the|a|an) /, "");

/**
 * Acceptable short forms of a stored answer, so students aren't marked wrong
 * for leaving out a note in brackets or picking one of several listed options:
 *   "the Arctic (cold, icy areas)"            → "arctic"
 *   "runoff / collection"                     → "runoff", "collection"
 *   "wind, water or animals (any two)"        → each option counts
 *   "4 (2 hydrogen, 1 oxygen)"                → "4"
 */
function acceptedForms(correct: string): { forms: string[]; anyOf: string[] } {
  const anyOne = /\(any (one|two)\)/i.test(correct);
  const core = correct.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const forms = new Set<string>([stripArticles(normalizeAnswer(core))]);
  for (const part of core.split(/\s+\/\s+|;\s+/)) forms.add(stripArticles(normalizeAnswer(part)));
  // "X or Y" for short answers (e.g. "herbivore or plant-eater")
  if (core.split(" ").length <= 6) for (const part of core.split(/\s+or\s+/)) forms.add(stripArticles(normalizeAnswer(part)));
  const anyOf = anyOne
    ? core.split(/,\s*|\s+or\s+/).map((p) => stripArticles(normalizeAnswer(p))).filter(Boolean)
    : [];
  return { forms: [...forms].filter(Boolean), anyOf };
}

export function answersMatch(correct: string, submitted: string): boolean {
  const a = normalizeAnswer(correct);
  const b = normalizeAnswer(submitted);
  if (a === b) return true;
  if (!b) return false;

  const { forms, anyOf } = acceptedForms(correct);
  const bCore = stripArticles(b);
  if (forms.includes(bCore)) return true;
  if (anyOf.length && anyOf.some((opt) => opt && (bCore === opt || bCore.split(/,\s*| and | or /).map((x) => stripArticles(x.trim())).includes(opt)))) return true;

  const numA = parseFloat(a.replace(/[^0-9.\-]/g, ""));
  const numB = parseFloat(b.replace(/[^0-9.\-]/g, ""));
  if (!isNaN(numA) && !isNaN(numB) && /^-?[\d.]+$/.test(a.replace(/[$%]/g, "")) && /^-?[\d.]+$/.test(b.replace(/[$%]/g, ""))) {
    return Math.abs(numA - numB) < 0.001;
  }

  // lenient word-overlap match for sentence-style answers (3+ words)
  // (4+ words only: for short answers one different word changes the meaning,
  // e.g. "white blood cells" vs "red blood cells")
  const wordsA = a.split(" ").filter(Boolean);
  if (wordsA.length >= 4) {
    const wordsB = new Set(b.split(" ").filter(Boolean));
    const matched = wordsA.filter((w) => wordsB.has(w)).length;
    if (matched / wordsA.length >= 0.65) return true;
  }

  return false;
}

const PASS_THRESHOLD = 0.7; // 70% correct to pass and be eligible for a reward

/**
 * Topics still excluded from interactive/timed contexts (Live Quiz, Family
 * Challenge): their answers are open-ended enough (full paraphrased
 * definitions, reading-comprehension responses) that even lenient
 * word-overlap grading isn't reliable — a correct answer phrased very
 * differently from the stored one could still be marked wrong. Verb tenses
 * was removed from this list once grading became lenient enough to handle
 * it fairly; these remaining ones are open to the same treatment later if
 * the grading gets smarter still.
 */
export const FREE_TEXT_TOPICS = new Set([
  "reading_comprehension",
  "idioms",
  "vocabulary",
]);

export function isPassingScore(score: number, total: number): boolean {
  return total > 0 && score / total >= PASS_THRESHOLD;
}

export async function pickRandomReward(childId: string, difficulty: string): Promise<string | null> {
  const items = await prisma.rewardItem.findMany({ where: { childId, difficulty, active: true } });
  if (items.length === 0) return null;
  const pick = items[Math.floor(Math.random() * items.length)];
  return pick.label;
}
