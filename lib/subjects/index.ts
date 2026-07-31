import { Topic, Difficulty, Question, mulberry32, buildQuestionSet } from "./types";
import { MATH_TOPICS, MATH_GENERATORS } from "./math";
import { ENGLISH_TOPICS, ENGLISH_GENERATORS } from "./english";
import { SCIENCE_TOPICS, SCIENCE_GENERATORS } from "./science";
import { pickPassageForGrade } from "./comprehension";

export type { Difficulty, Question, Topic };

export type SubjectId = "math" | "english" | "science";

export const SUBJECTS: { id: SubjectId; label: string }[] = [
  { id: "math", label: "Math" },
  { id: "english", label: "English" },
  { id: "science", label: "Science" },
];

const TOPICS_BY_SUBJECT: Record<SubjectId, Topic[]> = {
  math: MATH_TOPICS,
  english: ENGLISH_TOPICS,
  science: SCIENCE_TOPICS,
};

const GENERATORS_BY_SUBJECT: Record<SubjectId, Record<string, any>> = {
  math: MATH_GENERATORS,
  english: ENGLISH_GENERATORS,
  science: SCIENCE_GENERATORS,
};

export function allGrades(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

export function topicsForGrade(subject: SubjectId, grade: number): Topic[] {
  return TOPICS_BY_SUBJECT[subject].filter((t) => t.grades.includes(grade));
}

export function topicLabel(subject: SubjectId, topicId: string): string {
  return TOPICS_BY_SUBJECT[subject].find((t) => t.id === topicId)?.label || topicId;
}

export function allTopics(subject: SubjectId): Topic[] {
  return TOPICS_BY_SUBJECT[subject];
}

/**
 * Clusters topics by their optional `group` field, preserving first-seen
 * order, for UI pickers to render as labeled sections instead of one flat
 * list. Ungrouped topics come back under a null group and render plainly.
 */
export function groupTopics(topics: Topic[]): { group: string | null; topics: Topic[] }[] {
  const order: (string | null)[] = [];
  const buckets = new Map<string | null, Topic[]>();
  for (const t of topics) {
    const key = t.group ?? null;
    if (!buckets.has(key)) { buckets.set(key, []); order.push(key); }
    buckets.get(key)!.push(t);
  }
  return order.map((key) => ({ group: key, topics: buckets.get(key)! }));
}

export function generateWorksheet(opts: {
  subject: SubjectId;
  grade: number;
  topic: string;
  difficulty: Difficulty;
  count: number;
  seed: number;
}): Question[] {
  const rng = mulberry32(opts.seed);

  // Reading comprehension doesn't fit the "N independent random questions"
  // shape everything else uses — it's one shared passage plus its own fixed
  // set of questions, so it's handled separately here.
  if (opts.subject === "english" && opts.topic === "reading_comprehension") {
    const passage = pickPassageForGrade(opts.grade, rng);
    return passage.questions.map((q) => ({
      q: q.q,
      a: q.a,
      passage: passage.passage,
      passageTitle: passage.title,
    }));
  }

  const gen = GENERATORS_BY_SUBJECT[opts.subject]?.[opts.topic];
  if (!gen) return [];
  return buildQuestionSet(gen, opts.grade, opts.difficulty, opts.count, rng);
}

/**
 * Rule-based parser for the "describe what you need" box. Detects subject,
 * grade, topic, difficulty, and count from free text. Not a live AI model —
 * pure keyword matching, same approach as the original standalone tool.
 */
export function parseCommand(
  text: string,
  current: { subject: SubjectId; grade: number; topic: string; difficulty: Difficulty; count: number }
) {
  const t = text.toLowerCase();

  let subject: SubjectId | null = null;
  if (/\b(math|maths|arithmetic|algebra|geometry)\b/.test(t)) subject = "math";
  else if (/\b(english|grammar|vocabulary|spelling|reading|writing)\b/.test(t)) subject = "english";
  else if (/\b(science|biology|chemistry|physics)\b/.test(t)) subject = "science";

  let grade: number | null = null;
  const gm = t.match(/grade\s*(\d{1,2})/) || t.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s*grade\b/);
  if (gm) grade = Math.max(1, Math.min(12, parseInt(gm[1], 10)));

  let difficulty: Difficulty | null = null;
  if (/\b(easy|simple|basic)\b/.test(t)) difficulty = "easy";
  else if (/\b(hard|difficult|advanced|challenging)\b/.test(t)) difficulty = "hard";
  else if (/\b(medium|moderate|normal)\b/.test(t)) difficulty = "medium";

  let count: number | null = null;
  const cm = t.match(/(\d{1,2})\s*(questions|problems|q\b)/);
  if (cm) count = Math.max(3, Math.min(30, parseInt(cm[1], 10)));

  const resolvedSubject = subject || current.subject;

  let topicId: string | null = null;
  for (const top of TOPICS_BY_SUBJECT[resolvedSubject]) {
    if (top.aliases.some((alias) => t.includes(alias))) { topicId = top.id; break; }
  }

  if (topicId && grade) {
    const top = TOPICS_BY_SUBJECT[resolvedSubject].find((x) => x.id === topicId)!;
    if (!top.grades.includes(grade)) {
      grade = top.grades.reduce((best, g) => (Math.abs(g - grade!) < Math.abs(best - grade!) ? g : best), top.grades[0]);
    }
  } else if (topicId && !grade) {
    const top = TOPICS_BY_SUBJECT[resolvedSubject].find((x) => x.id === topicId)!;
    grade = top.grades.includes(current.grade) ? current.grade : top.grades[0];
  } else if (!topicId) {
    const g = grade || current.grade;
    const available = topicsForGrade(resolvedSubject, g);
    topicId = available.find((x) => x.id === current.topic && resolvedSubject === current.subject) ? current.topic : available[0]?.id || null;
  }

  return {
    subject: resolvedSubject,
    grade: grade ?? current.grade,
    topic: topicId ?? current.topic,
    difficulty: difficulty ?? current.difficulty,
    count: count ?? current.count,
  };
}
