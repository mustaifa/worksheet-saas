/**
 * Book-style curriculum outline: Grade → Unit (chapter) → Lesson → Skill.
 *
 * A Skill is the leaf a teacher actually picks for a day's lesson. Every
 * skill points at a topic id in lib/subjects, so it always generates a real
 * worksheet with code-computed answers — the outline never lists something
 * that can't be printed. scripts/verify-curriculum.ts enforces that.
 */

/** core = the grade's standard; advanced = preview of next grade; challenge = puzzles for curious students */
export type SkillLevel = "core" | "advanced" | "challenge";

export type Skill = {
  /** topic id in lib/subjects (the generator that builds the worksheet) */
  topic: string;
  /** standard code, e.g. Common Core "3.NF.A.1" or NGSS "4-PS3-2" */
  std?: string;
  level?: SkillLevel;
};

export type Lesson = { title: string; skills: Skill[] };

export type Unit = {
  title: string;
  /** standards domain shown under the unit title, e.g. "Number & Operations — Fractions" */
  domain?: string;
  lessons: Lesson[];
};

/** grade (1–12) → units in teaching order */
export type SubjectBook = Record<number, Unit[]>;

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  core: "Core",
  advanced: "Advanced",
  challenge: "Challenge",
};

/** Tailwind classes for the level badge (empty for core skills). */
export const LEVEL_BADGE: Record<SkillLevel, string> = {
  core: "",
  advanced: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  challenge: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
};
