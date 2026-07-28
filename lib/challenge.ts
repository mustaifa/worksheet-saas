import { prisma } from "@/lib/prisma";

/** Normalizes an answer for lenient comparison: trims, lowercases, collapses
 * whitespace, and treats numerically-equal answers (e.g. "0.5" vs ".50") as
 * a match even if the strings differ. */
export function answersMatch(correct: string, submitted: string): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.]$/, "");
  const a = normalize(correct);
  const b = normalize(submitted);
  if (a === b) return true;

  const numA = parseFloat(a.replace(/[^0-9.\-]/g, ""));
  const numB = parseFloat(b.replace(/[^0-9.\-]/g, ""));
  if (!isNaN(numA) && !isNaN(numB) && /^-?[\d.]+$/.test(a.replace(/[$%]/g, "")) && /^-?[\d.]+$/.test(b.replace(/[$%]/g, ""))) {
    return Math.abs(numA - numB) < 0.001;
  }
  return false;
}

const PASS_THRESHOLD = 0.7; // 70% correct to pass and be eligible for a reward

export function isPassingScore(score: number, total: number): boolean {
  return total > 0 && score / total >= PASS_THRESHOLD;
}

export async function pickRandomReward(childId: string, difficulty: string): Promise<string | null> {
  const items = await prisma.rewardItem.findMany({ where: { childId, difficulty, active: true } });
  if (items.length === 0) return null;
  const pick = items[Math.floor(Math.random() * items.length)];
  return pick.label;
}
