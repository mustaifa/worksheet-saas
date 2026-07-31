export type Difficulty = "easy" | "medium" | "hard";
export type Question = { q: string; a: string; passage?: string; passageTitle?: string };
export type RNG = () => number;

export type Topic = {
  id: string;
  label: string;
  grades: number[];
  aliases: string[]; // keywords the command-box parser matches against
  group?: string; // optional cluster label — topics sharing a group render together under one heading
};

export type Gen = (grade: number, diff: Difficulty, rng: RNG) => Question;

export function mulberry32(seed: number): RNG {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeHelpers(rng: RNG) {
  const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  const pick = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
  const pickAndRemove = <T,>(arr: T[]): T => {
    const i = randInt(0, arr.length - 1);
    return arr.splice(i, 1)[0];
  };
  return { randInt, pick, pickAndRemove };
}

/**
 * Runs `gen` repeatedly to build a deduplicated question set. If the topic's
 * content pool is smaller than the requested count (common for curated
 * fact-bank topics), it relaxes deduplication after enough attempts so the
 * worksheet still reaches the requested length instead of falling short.
 */
export function buildQuestionSet(
  gen: Gen,
  grade: number,
  diff: Difficulty,
  count: number,
  rng: RNG
): Question[] {
  const list: Question[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  const softLimit = count * 25;

  while (list.length < count && attempts < softLimit) {
    attempts++;
    const item = gen(grade, diff, rng);
    if (seen.has(item.q) && attempts < softLimit * 0.8) continue; // allow repeats only near the end
    seen.add(item.q);
    list.push(item);
  }
  return list;
}
