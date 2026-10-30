import type { SubjectBook, Unit, Lesson, Skill, SkillLevel } from "./types";
import { MATH_BOOK } from "./math";

export type { SubjectBook, Unit, Lesson, Skill, SkillLevel };
export { LEVEL_LABEL, LEVEL_BADGE } from "./types";

type SubjectKey = "math" | "english" | "science";

/** Subjects that have a book-style outline. Others fall back to the flat topic list. */
const BOOKS: Partial<Record<SubjectKey, SubjectBook>> = {
  math: MATH_BOOK,
};

export function hasBook(subject: SubjectKey): boolean {
  return !!BOOKS[subject];
}

export function bookFor(subject: SubjectKey, grade: number): Unit[] | null {
  return BOOKS[subject]?.[grade] ?? null;
}

/** Every skill in a grade's book, in teaching order. */
export function bookSkills(units: Unit[]): Skill[] {
  return units.flatMap((u) => u.lessons.flatMap((l) => l.skills));
}

/** grade → topic ids for one subject's book; used to derive each topic's grade list. */
export function bookGradesByTopic(subject: SubjectKey): Map<string, number[]> {
  const out = new Map<string, number[]>();
  const book = BOOKS[subject];
  if (!book) return out;
  for (const [g, units] of Object.entries(book)) {
    for (const s of bookSkills(units)) {
      const list = out.get(s.topic) ?? [];
      if (!list.includes(Number(g))) list.push(Number(g));
      out.set(s.topic, list);
    }
  }
  return out;
}

export type SkillLocation = { unit: Unit; unitNumber: number; lesson: Lesson; skill: Skill };

/** Where a topic sits in a grade's book (unit, lesson, standard), for breadcrumbs and related links. */
export function locateSkill(subject: SubjectKey, grade: number, topicId: string): SkillLocation | null {
  const units = bookFor(subject, grade);
  if (!units) return null;
  for (let i = 0; i < units.length; i++) {
    for (const lesson of units[i].lessons) {
      const skill = lesson.skills.find((s) => s.topic === topicId);
      if (skill) return { unit: units[i], unitNumber: i + 1, lesson, skill };
    }
  }
  return null;
}

/**
 * Prunes a grade's book to the given topic ids (e.g. Live Quiz excludes
 * free-text topics), dropping lessons and units that end up empty.
 */
export function pruneBook(units: Unit[], allowed: Set<string>): Unit[] {
  return units
    .map((u) => ({ ...u, lessons: u.lessons.map((l) => ({ ...l, skills: l.skills.filter((s) => allowed.has(s.topic)) })).filter((l) => l.skills.length > 0) }))
    .filter((u) => u.lessons.length > 0);
}
