/**
 * Navigation helpers for the blog: subject hubs, related guides, previous /
 * next links, and which guides belong on each worksheet page. Keeping these
 * links consistent is what lets readers (and search engines) move between
 * guides and the worksheets they explain.
 */
import { BLOG_POSTS, type BlogPost } from "./blog";
import { subjectOf } from "./blogPresentation";

export type SubjectHub = { slug: string; name: string; title: string; blurb: string };

export const SUBJECT_HUBS: SubjectHub[] = [
  { slug: "math", name: "Math", title: "Math guides", blurb: "Worked examples for fractions, division, telling time, order of operations and more — from first grade to algebra." },
  { slug: "english", name: "English", title: "English guides", blurb: "Grammar, parts of speech, vocabulary, context clues and reading comprehension, explained with examples." },
  { slug: "science", name: "Science", title: "Science guides", blurb: "Clear explanations of moon phases, the scientific method, the human body, genetics and hands-on experiments." },
  { slug: "learning", name: "Learning", title: "Teaching & study guides", blurb: "How to study, help with homework, run a classroom and understand the standards your child is learning." },
];

export const hubFor = (post: BlogPost) => SUBJECT_HUBS.find((h) => h.name === subjectOf(post)) ?? SUBJECT_HUBS[3];
export const hubBySlug = (slug: string) => SUBJECT_HUBS.find((h) => h.slug === slug);

const byNewest = (a: BlogPost, b: BlogPost) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title);

export function postsInHub(hub: SubjectHub): BlogPost[] {
  return BLOG_POSTS.filter((p) => subjectOf(p) === hub.name).sort(byNewest);
}

/** Every /worksheets link a post makes, from its worksheet list and its body text. */
export function worksheetLinks(post: BlogPost): string[] {
  const inline = post.content.flatMap((b) => [...b.matchAll(/\]\((\/worksheets\/[^)#?]+)\)/g)].map((m) => m[1]));
  return [...new Set([...(post.worksheets ?? []).map((w) => w.href), ...inline])];
}

/** Guides to read next: same subject first, then guides that share worksheet topics or an audience. */
export function relatedPosts(post: BlogPost, n = 3): BlogPost[] {
  const mine = new Set(worksheetLinks(post).map((h) => h.split("/").slice(2, 5).filter((_, i) => i !== 1).join("/")));
  const score = (p: BlogPost) => {
    let s = 0;
    if (subjectOf(p) === subjectOf(post)) s += 4;
    for (const h of worksheetLinks(p)) if (mine.has(h.split("/").slice(2, 5).filter((_, i) => i !== 1).join("/"))) s += 3;
    if (p.audience?.some((a) => post.audience?.includes(a))) s += 1;
    return s;
  };
  return BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || byNewest(a.p, b.p))
    .slice(0, n)
    .map((x) => x.p);
}

/** Previous (older) and next (newer) guide in the same subject. */
export function neighbours(post: BlogPost): { newer?: BlogPost; older?: BlogPost } {
  const list = postsInHub(hubFor(post));
  const i = list.findIndex((p) => p.slug === post.slug);
  return { newer: i > 0 ? list[i - 1] : undefined, older: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}

/**
 * Guides for a worksheet page. A guide that links this exact page ranks
 * first, then guides linking the same topic at another grade, then guides
 * linking the same subject and grade.
 */
export function guidesForWorksheet(subject: string, grade: number, topic?: string, n = 3): BlogPost[] {
  const exact = topic ? `/worksheets/${subject}/${grade}/${topic}` : `/worksheets/${subject}/${grade}`;
  const scored = BLOG_POSTS.map((p) => {
    let s = 0;
    for (const h of worksheetLinks(p)) {
      const [, , sub, g, t] = h.split("/");
      if (sub !== subject) continue;
      if (h === exact) s = Math.max(s, 10);
      else if (topic && t === topic) s = Math.max(s, 6);
      else if (g === `${grade}`) s = Math.max(s, 3);
      else s = Math.max(s, 1);
    }
    return { p, s };
  }).filter((x) => x.s >= (topic ? 3 : 1));
  return scored.sort((a, b) => b.s - a.s || byNewest(a.p, b.p)).slice(0, n).map((x) => x.p);
}
