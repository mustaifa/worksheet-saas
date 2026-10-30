// One exact generated worksheet, as a URL segment: "<difficulty>-<count>-<seed>",
// e.g. "hard-15-123456789". Used by the public /ws/... page and its Pinterest image,
// so a pinned worksheet shows the same questions the person generated.
import type { Difficulty } from "@/lib/subjects";

export type Variant = { difficulty: Difficulty; count: number; seed: number };

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export function formatVariant(v: Variant): string {
  return `${v.difficulty}-${v.count}-${v.seed}`;
}

export function parseVariant(s: string | null | undefined): Variant | null {
  const m = /^(easy|medium|hard)-(\d{1,2})-(\d{1,10})$/.exec(s || "");
  if (!m) return null;
  const count = parseInt(m[2], 10);
  const seed = parseInt(m[3], 10);
  if (!DIFFS.includes(m[1] as Difficulty) || count < 1 || count > 40 || seed < 1 || seed > 2147483647) return null;
  return { difficulty: m[1] as Difficulty, count, seed };
}

export function variantPath(subject: string, grade: number | string, topic: string, v: Variant) {
  return `/ws/${subject}/${grade}/${topic}/${formatVariant(v)}`;
}
