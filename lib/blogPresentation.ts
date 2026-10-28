import type { BlogPost } from "./blog";
export function subjectOf(post: BlogPost): string {
 const text = `${post.slug} ${post.title}`.toLowerCase();
 if (/fraction|math|times-tables|word-problem|decimal|percent/.test(text)) return "Math";
 if (/reading|literary|sentence|synonym|antonym|vocabulary/.test(text)) return "English";
 if (/science|circulatory|punnett|experiment/.test(text)) return "Science";
 return "Learning";
}
export function coverOf(post: BlogPost) {
 const subject = subjectOf(post);
 return { src: `/blog/${subject.toLowerCase()}.svg`, alt: { Math: "Fraction bar showing one half equals two quarters", English: "Open book illustration for reading and language guides", Science: "Illustrated laboratory flask for science exploration", Learning: "Three rising steps representing learning progress" }[subject] || "Learning guide illustration" };
}
export function headingId(text: string, index: number) { return `section-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`; }
