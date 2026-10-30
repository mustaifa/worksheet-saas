import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupCta from "@/components/SignupCta";
import TopicRequestBox from "@/components/TopicRequestBox";
import TrustStrip from "@/components/TrustStrip";
import JsonLd, { breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { absoluteUrl, OG_IMAGE } from "@/lib/site";
import { isFreeMode } from "@/lib/access";
import { topicDescription, gradeEquivalents, gradeOverview } from "@/lib/topicContent";
import { SUBJECTS, SubjectId, Topic, allGrades, topicsForGrade, groupTopics, generateWorksheet } from "@/lib/subjects";
import { bookFor, LEVEL_LABEL, LEVEL_BADGE, STANDARDS, type Skill } from "@/lib/curriculum";
import { guidesForWorksheet, SUBJECT_HUBS } from "@/lib/blogNav";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { subject: string; grade: string }[] = [];
  for (const s of SUBJECTS) {
    for (const g of allGrades()) {
      if (topicsForGrade(s.id, g).length > 0) params.push({ subject: s.id, grade: String(g) });
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: { subject: string; grade: string } }): Metadata {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return {};
  const g = parseInt(params.grade, 10);
  const eq = gradeEquivalents(g);
  const n = topicsForGrade(subject.id, g).length;
  const title = `Grade ${g} ${subject.label} Worksheets — Free PDF with Answers`;
  const description = `${n} free printable Grade ${g} ${subject.id === "english" ? "English" : subject.label.toLowerCase()} worksheets (Year ${eq.ukYear} UK, Class ${eq.indiaClass} India), each with a full answer key. Print or save as PDF.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/worksheets/${subject.id}/${g}` },
    openGraph: { title, description, url: `/worksheets/${subject.id}/${g}`, images: [OG_IMAGE] },
  };
}

// same deterministic seed as the topic pages, so the sample matches what's there
function stableSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash) || 1;
}

export default function GradePage({ params }: { params: { subject: string; grade: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  const grade = parseInt(params.grade, 10);
  if (!subject || isNaN(grade)) notFound();
  const sid = subject.id as SubjectId;

  const topics = topicsForGrade(sid, grade);
  if (topics.length === 0) notFound();

  const eq = gradeEquivalents(grade);
  const freeMode = isFreeMode();
  const lower = sid === "english" ? "English" : subject.label.toLowerCase(); // English is a proper noun
  const grades = allGrades().filter((g) => topicsForGrade(sid, g).length > 0);
  const otherSubjects = SUBJECTS.filter((s) => s.id !== sid && topicsForGrade(s.id, grade).length > 0);

  const book = bookFor(sid, grade);
  const guides = guidesForWorksheet(sid, grade, undefined, 4);
  const hub = SUBJECT_HUBS.find((h) => h.slug === sid);
  const byId = new Map(topics.map((t) => [t.id, t]));

  const sample = (topicId: string) => {
    const q = generateWorksheet({ subject: sid, grade, topic: topicId, difficulty: "medium", count: 1, seed: stableSeed(`${sid}-${grade}-${topicId}`) })[0];
    return q && !q.passage ? q.q : null;
  };

  function TopicCard({ t, skill }: { t: Topic; skill?: Skill }) {
    const q = sample(t.id);
    const desc = topicDescription(sid, t.id);
    const level = skill?.level ?? "core";
    return (
      <Link
        href={`/worksheets/${sid}/${grade}/${t.id}`}
        className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-900 dark:hover:border-white transition-colors"
      >
        <p className="font-semibold text-slate-900 dark:text-white group-hover:underline">Grade {grade} {t.label.replace(/^The /, "")}</p>
        {(level !== "core" || skill?.std) && (
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
            {level !== "core" && <span className={`rounded px-1.5 py-0.5 font-semibold ${LEVEL_BADGE[level]}`}>{LEVEL_LABEL[level]}</span>}
            {skill?.std && <span className="font-mono text-slate-500 dark:text-slate-400">{skill.std}</span>}
          </p>
        )}
        {desc && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{desc}</p>}
        {q && <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 border-l-2 border-amber-400 pl-2 italic line-clamp-2">e.g. {q}</p>}
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-3">Worksheet + answer key →</p>
      </Link>
    );
  }

  const faqs = [
    { q: `Are these Grade ${grade} ${lower} worksheets free?`, a: `Yes. Every Grade ${grade} ${lower} worksheet on this page is free to print or save as a PDF, and each one includes a full answer key.` },
    { q: `What is Grade ${grade} in the UK and India?`, a: `Grade ${grade} in the US is roughly Year ${eq.ukYear} in the UK and Class ${eq.indiaClass} in India, for students aged about ${eq.ages}. Curricula differ, so pick topics by what your child or class is learning.` },
    { q: `What ${lower} topics are covered in Grade ${grade}?`, a: `${topics.length} topics, including ${topics.slice(0, 6).map((t) => t.label.replace(/^The /, "")).join(", ")}${topics.length > 6 ? " and more" : ""}.` },
    { q: "Can I get different versions of a worksheet?", a: freeMode ? "Yes. Create a free account to generate unlimited new versions at easy, medium or hard difficulty, each with its own answer key." : "Yes. Start a free trial to generate unlimited new versions at easy, medium or hard difficulty, each with its own answer key." },
  ];

  return (
    <main>
      <Navbar />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Worksheets", url: absoluteUrl("/worksheets") },
            { name: subject.label, url: absoluteUrl(`/worksheets/${sid}`) },
            { name: `Grade ${grade}`, url: absoluteUrl(`/worksheets/${sid}/${grade}`) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Grade ${grade} ${subject.label} Worksheets`,
            itemListElement: topics.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: `Grade ${grade} ${t.label.replace(/^The /, "")} Worksheet`, url: absoluteUrl(`/worksheets/${sid}/${grade}/${t.id}`) })),
          },
          faqLd(faqs),
        ]}
      />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          <Link href="/worksheets" className="hover:underline">Worksheets</Link> /{" "}
          <Link href={`/worksheets/${sid}`} className="hover:underline">{subject.label}</Link> / Grade {grade}
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-slate-900 dark:text-white">Free Grade {grade} {subject.label} Worksheets with Answers</h1>
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Grade {grade} (US) · Year {eq.ukYear} (UK) · Class {eq.indiaClass} (India) · ages {eq.ages}
        </p>
        <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-3xl">
          {topics.length} printable Grade {grade} {lower} worksheets, each with a full answer key. Open a topic to print it or save it as a PDF.{" "}
          {gradeOverview(sid, grade)}
        </p>
        <div className="mt-5"><TrustStrip compact /></div>

        {book ? (
          <>
            <nav aria-label={`Grade ${grade} ${lower} units`} className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Contents</p>
              <ol className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {book.map((u, i) => (
                  <li key={u.title}><a href={`#unit-${i + 1}`} className="text-slate-700 dark:text-slate-200 hover:underline">Unit {i + 1}: {u.title}</a></li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Aligned to the {STANDARDS[sid].name}. <span className={`rounded px-1.5 py-0.5 font-semibold ${LEVEL_BADGE.advanced}`}>Advanced</span> skills preview the next grade; <span className={`rounded px-1.5 py-0.5 font-semibold ${LEVEL_BADGE.challenge}`}>Challenge</span> skills are puzzles for curious students.</p>
            </nav>
            <div className="mt-10 space-y-12">
              {book.map((unit, ui) => (
                <section key={unit.title} id={`unit-${ui + 1}`} className="scroll-mt-20">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unit {ui + 1}: {unit.title}</h2>
                  {unit.domain && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{unit.domain}</p>}
                  <div className="mt-4 space-y-6">
                    {unit.lessons.map((lesson) => (
                      <div key={lesson.title}>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-2">{lesson.title}</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {lesson.skills.map((skill) => {
                            const t = byId.get(skill.topic);
                            return t ? <TopicCard key={t.id} t={t} skill={skill} /> : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 space-y-10">
            {groupTopics(topics).map(({ group, topics: groupedTopics }) => (
              <div key={group ?? "_"}>
                {group && <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{group}</h2>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {groupedTopics.map((t) => <TopicCard key={t.id} t={t} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{subject.label} worksheets for other grades</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {grades.map((g) => (
                <Link key={g} href={`/worksheets/${sid}/${g}`} aria-current={g === grade ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full border text-sm ${g === grade ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-white"}`}>
                  Grade {g}
                </Link>
              ))}
            </div>
          </div>
          {otherSubjects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Other Grade {grade} subjects</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {otherSubjects.map((s) => (
                  <Link key={s.id} href={`/worksheets/${s.id}/${grade}`} className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-white">
                    Grade {grade} {s.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {guides.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{subject.label} guides for parents & teachers</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {guides.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-900 dark:hover:border-white">
                  <span className="block font-semibold text-slate-900 dark:text-white">{p.title}</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{p.excerpt}</span>
                </Link>
              ))}
            </div>
            {hub && <p className="mt-3 text-sm"><Link href={`/blog/subject/${hub.slug}`} className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">All {hub.title} →</Link></p>}
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-slate-100 dark:bg-slate-900 p-6 sm:p-8 text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Need more Grade {grade} {lower} practice?</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate unlimited fresh worksheets at easy, medium or hard difficulty. {freeMode ? "Free during our launch — no card needed." : "Start with a free trial."}
          </p>
          <SignupCta label={freeMode ? "Create a free account" : "Start your free trial"} className="mt-4" />
        </div>

        <div id="request" className="mt-12 max-w-3xl">
          <TopicRequestBox subject={sid} grade={grade} />
        </div>

        <div className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
          <div className="mt-4 space-y-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
