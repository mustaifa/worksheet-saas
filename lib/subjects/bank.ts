import type { Gen } from "./types";

/** 1 = recall (easy), 2 = understanding (medium), 3 = apply / analyse (hard) */
export type Lvl = 1 | 2 | 3;
/** [question, answer, level] */
export type Item = [string, string, Lvl];

const WEIGHTS = {
  easy: { 1: 3, 2: 1, 3: 0 },
  medium: { 1: 1, 2: 3, 3: 1 },
  hard: { 1: 0, 2: 1, 3: 3 },
} as const;

/**
 * Generator over one or more curated banks. Each difficulty draws from the
 * matching levels (hard still mixes in some medium items so small banks can
 * fill a worksheet without repeating).
 */
export function bankGen(...banks: Item[][]): Gen {
  const all = banks.flat();
  return (_grade, diff, rng) => {
    const w = WEIGHTS[diff];
    const weighted: Item[] = [];
    for (const it of all) for (let i = 0; i < w[it[2]]; i++) weighted.push(it);
    const pool = weighted.length ? weighted : all;
    const [q, a] = pool[Math.floor(rng() * pool.length)];
    return { q, a };
  };
}

/** Mixes a computed generator with a bank: `share` of questions come from the generator. */
export function mixGen(gen: Gen, share: number, ...banks: Item[][]): Gen {
  const fromBank = bankGen(...banks);
  return (grade, diff, rng) => (rng() < share ? gen(grade, diff, rng) : fromBank(grade, diff, rng));
}
