// The order worksheet pages go out on Pinterest, and when each one is released.
// Used by the RSS feeds Pinterest auto-publishes from (/feeds/pins/<subject>) and
// by scripts/pinterest-csv.ts.
import { SUBJECTS, allGrades, topicsForGrade } from "@/lib/subjects";

export type PinRow = { s: string; label: string; g: number; id: string; name: string };

// Most-searched first: Math, then English, then Science; grades 3–6, then 1–2, then 7–12.
const SUBJECT_ORDER = ["math", "english", "science", "biology", "chemistry", "physics", "computer"];
const gradeRank = (g: number) => (g >= 3 && g <= 6 ? 0 : g <= 2 ? 1 : 2);

let cache: PinRow[] | null = null;
export function pinQueue(): PinRow[] {
  if (cache) return cache;
  const rows: PinRow[] = [];
  for (const s of SUBJECTS) for (const g of allGrades()) for (const t of topicsForGrade(s.id, g))
    rows.push({ s: s.id, label: s.label, g, id: t.id, name: t.label.replace(/^The /, "") });
  rows.sort((a, b) => gradeRank(a.g) - gradeRank(b.g) || SUBJECT_ORDER.indexOf(a.s) - SUBJECT_ORDER.indexOf(b.s) || a.g - b.g);
  // Within each priority tier, interleave so one day isn't all the same subject/grade.
  const mixed: PinRow[] = [];
  for (const tier of [0, 1, 2]) {
    const buckets = new Map<string, PinRow[]>();
    for (const r of rows.filter((x) => gradeRank(x.g) === tier)) { const k = `${r.s}-${r.g}`; (buckets.get(k) || buckets.set(k, []).get(k)!).push(r); }
    while ([...buckets.values()].some((b) => b.length)) for (const b of buckets.values()) if (b.length) mixed.push(b.shift()!);
  }
  return (cache = mixed);
}

// Pinned by hand on 31 Oct 2026, so the feeds skip them (no duplicate pins).
export const ALREADY_PINNED = new Set([
  "math/3/arrays", "math/4/large_numbers", "math/5/powers_of_10", "math/6/ratios_simplify",
  "english/3/nouns_verbs", "english/4/relative_pronouns", "english/5/conjunctions", "english/6/pronoun_usage",
  "science/3/balanced_forces", "science/4/energy_forms", "science/5/matter_particles", "science/6/sci_method",
  "computer/6/binary_numbers", "math/3/mult_facts", "math/4/placevalue", "math/5/decimal_place_value",
  "math/6/ratios_equivalent", "english/3/plural_nouns", "english/4/grammar_tenses", "english/5/verb_tenses_adv",
]);

// Drip schedule: one page every 15 minutes (96 a day) from the start time, so a
// new account never posts hundreds at once. Change PIN_DRIP_START to restart.
export const DRIP_START = Date.parse(process.env.PIN_DRIP_START || "2026-10-30T21:30:00Z");
export const DRIP_EVERY_MS = 15 * 60 * 1000;

/** Pages still to pin, each with the time it becomes visible in its feed. */
export function pinSchedule(): (PinRow & { release: number })[] {
  return pinQueue()
    .filter((r) => !ALREADY_PINNED.has(`${r.s}/${r.g}/${r.id}`))
    .map((r, i) => ({ ...r, release: DRIP_START + i * DRIP_EVERY_MS }));
}
