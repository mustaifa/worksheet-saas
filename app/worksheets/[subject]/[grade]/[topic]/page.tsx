import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintButton from "@/components/PrintButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import WorksheetSheet from "@/components/WorksheetSheet";
import { layoutWorksheet } from "@/lib/worksheetLayout";
import { BRAND, brandedFilename } from "@/lib/brand";
import SignupCta from "@/components/SignupCta";
import TopicRequestBox from "@/components/TopicRequestBox";
import TrustStrip from "@/components/TrustStrip";
import JsonLd, { breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { isFreeMode } from "@/lib/access";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import PinButton from "@/components/PinButton";
import { stableSeed, sharePaths, pinDescription, OG_SIZE } from "@/lib/shareImage";
import { topicDescription, gradeBand, howToUse, gradeEquivalents } from "@/lib/topicContent";
import { SUBJECTS, SubjectId, allGrades, allTopics, topicsForGrade, topicLabel, generateWorksheet, exampleQuestion, challengeQuestion, isScienceFamily } from "@/lib/subjects";
import { locateSkill, LEVEL_LABEL, LEVEL_BADGE, STANDARDS } from "@/lib/curriculum";
import { guidesForWorksheet } from "@/lib/blogNav";

// Number of questions on the free public worksheet (reading comprehension
// ignores this and uses its passage's own question set).
const SAMPLE_COUNT = 12;

type Params = { subject: string; grade: string; topic: string };

export const dynamicParams = false;

export function generateStaticParams() {
  const params: Params[] = [];
  for (const s of SUBJECTS) {
    for (const g of allGrades()) {
      for (const t of topicsForGrade(s.id, g)) {
        params.push({ subject: s.id, grade: String(g), topic: t.id });
      }
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return {};
  // "Grade 3 Water Cycle", not "Grade 3 The Water Cycle"
  const label = topicLabel(subject.id, params.topic).replace(/^The /, "");
  const path = `/worksheets/${subject.id}/${params.grade}/${params.topic}`;
  const title = `Grade ${params.grade} ${label} Worksheet with Answers (Free PDF)`;
  const description = `Free printable Grade ${params.grade} ${subject.label} worksheet on ${label}, with a full answer key. Print it or save it as a PDF — every answer is checked by code, not guessed.`;
  return {
    // absolute: keeps the keyword-first title under ~65 chars (no "| Practice Sheet" suffix)
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title, description, url: path, type: "article",
      images: [{ url: sharePaths(subject.id, params.grade, params.topic).og, ...OG_SIZE, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [sharePaths(subject.id, params.grade, params.topic).og] },
  };
}

export default function TopicPage({ params }: { params: Params }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  const grade = parseInt(params.grade, 10);
  if (!subject || isNaN(grade)) notFound();
  const subjectId = subject.id as SubjectId;

  const gradeTopics = topicsForGrade(subjectId, grade);
  const topic = gradeTopics.find((t) => t.id === params.topic);
  if (!topic) notFound();

  const freeMode = isFreeMode();
  const seed = stableSeed(`${subject.id}-${grade}-${topic.id}`);
  // Some fact-bank topics have fewer distinct questions than SAMPLE_COUNT and
  // the generator then repeats; a public page should never show a duplicate.
  const seenQ = new Set<string>();
  const questions = generateWorksheet({ subject: subjectId, grade, topic: topic.id, difficulty: "medium", count: SAMPLE_COUNT, seed })
    .filter((item) => (seenQ.has(item.q) ? false : (seenQ.add(item.q), true)));
  const example = exampleQuestion({ subject: subjectId, grade, topic: topic.id, seed, avoid: questions });
  const challenge = challengeQuestion({ subject: subjectId, grade, topic: topic.id, seed });
  const layout = layoutWorksheet({ subject: subjectId, subjectLabel: subject.label, grade, topic: topic.id, title: topic.label, questions, example, challenge });

  const description = topicDescription(subjectId, topic.id);
  const name = topic.label.replace(/^The /, ""); // used after "Grade N" and in sentences
  const tips = howToUse(grade);

  // Where this skill sits in the grade's curriculum book (unit, lesson, standard), if there is one.
  const loc = locateSkill(subjectId, grade, topic.id);
  const level = loc?.skill.level ?? "core";

  // Related links: with a book, the rest of the same lesson and unit come
  // first (the skills a teacher covers next); otherwise same-group topics
  // first. Then the rest of this grade, and the same topic at other grades.
  const closeness = (id: string) => {
    if (loc) {
      if (loc.lesson.skills.some((s) => s.topic === id)) return 2;
      if (loc.unit.lessons.some((l) => l.skills.some((s) => s.topic === id))) return 1;
      return 0;
    }
    const t = gradeTopics.find((x) => x.id === id);
    return t && topic.group && t.group === topic.group ? 1 : 0;
  };
  const sameGrade = gradeTopics
    .filter((t) => t.id !== topic.id)
    .map((t, i) => ({ t, i, c: closeness(t.id) }))
    .sort((a, b) => b.c - a.c || a.i - b.i)
    .map((x) => x.t)
    .slice(0, 8);
  const guides = guidesForWorksheet(subjectId, grade, topic.id, 3);
  const otherGrades = (allTopics(subjectId).find((t) => t.id === topic.id)?.grades || []).filter((g) => g !== grade);
  // Science 9–12 topics also live in the Physics, Chemistry and Biology courses (and vice versa).
  const sameTopicElsewhere = isScienceFamily(subjectId) && grade >= 9
    ? SUBJECTS.filter((s) => s.id !== subjectId && isScienceFamily(s.id) && topicsForGrade(s.id, grade).some((t) => t.id === topic.id))
    : [];

  const path = `/worksheets/${subject.id}/${grade}/${topic.id}`;
  const faqs = [
    {
      q: `Does this Grade ${grade} ${name} worksheet come with answers?`,
      a: `Yes. The full answer key is on this page, and it prints on its own page after the questions. Every answer is calculated or checked by code rather than written by an AI model, so the key is always correct.`,
    },
    {
      q: "How do I print it or save it as a PDF?",
      a: `Click "Download PDF" to save a ready-to-print PDF with the answer key on the last page, or click "Print" to send the worksheet and answer key straight to your printer.`,
    },
    {
      q: `Can I get a different ${name} worksheet?`,
      a: freeMode
        ? `Yes. Create a free account to generate as many fresh Grade ${grade} ${name} worksheets as you like, at easy, medium or hard difficulty, each with its own answer key.`
        : `Yes. Start a free trial (no card needed) to generate as many fresh Grade ${grade} ${name} worksheets as you like, at easy, medium or hard difficulty, each with its own answer key.`,
    },
    {
      q: "Is this worksheet free?",
      a: freeMode
        ? "Yes. This worksheet is free to print, and Practice Sheet is free to use during our launch with no card needed."
        : "Yes. This worksheet is free to print. Generating unlimited new worksheets is part of Practice Sheet's paid plan, which starts with a free trial.",
    },
  ];

  return (
    <main>
      <Navbar />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Worksheets", url: absoluteUrl("/worksheets") },
            { name: subject.label, url: absoluteUrl(`/worksheets/${subject.id}`) },
            { name: `Grade ${grade}`, url: absoluteUrl(`/worksheets/${subject.id}/${grade}`) },
            { name: topic.label, url: absoluteUrl(path) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: `Grade ${grade} ${name} Worksheet`,
            description: description || undefined,
            url: absoluteUrl(path),
            learningResourceType: "Worksheet",
            educationalLevel: `Grade ${grade}`,
            about: topic.label,
            inLanguage: "en",
            isAccessibleForFree: true,
            provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
          },
          faqLd(faqs),
        ]}
      />

      <section className="max-w-3xl mx-auto px-6 py-12 print:p-0 print:max-w-none">
        <nav aria-label="Breadcrumb" className="print:hidden text-sm text-slate-500 dark:text-slate-400">
          <Link href="/worksheets" className="hover:underline">Worksheets</Link> /{" "}
          <Link href={`/worksheets/${subject.id}`} className="hover:underline">{subject.label}</Link> /{" "}
          <Link href={`/worksheets/${subject.id}/${grade}`} className="hover:underline">Grade {grade}</Link> / {topic.label}
        </nav>
        <h1 className="print:hidden text-3xl font-bold mt-2 text-slate-900 dark:text-white">Grade {grade} {name} Worksheet with Answers</h1>
        <p className="print:hidden mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          Grade {grade} (US) · Year {gradeEquivalents(grade).ukYear} (UK) · Class {grade} (India) · {subject.label}
        </p>
        {loc && (
          <p className="print:hidden mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
            <Link href={`/worksheets/${subject.id}/${grade}#unit-${loc.unitNumber}`} className="hover:underline">Unit {loc.unitNumber}: {loc.unit.title}</Link>
            <span aria-hidden>›</span>
            <span>{loc.lesson.title}</span>
            {loc.skill.std && <span className="font-mono text-xs rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5" title={STANDARDS[subjectId].name}>{STANDARDS[subjectId].short} {loc.skill.std}</span>}
            {level !== "core" && <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${LEVEL_BADGE[level]}`}>{LEVEL_LABEL[level]}</span>}
          </p>
        )}
        <p className="print:hidden text-slate-600 dark:text-slate-300 mt-3">
          {description ? `${description} ` : ""}
          This free {gradeBand(grade)} worksheet has {layout.questions.length} questions and a full answer key. Print it or save it as a PDF — every answer is checked by code, not guessed.
        </p>

        <div className="print:hidden mt-6 flex flex-wrap items-center gap-3">
          <PrintButton label="Print" />
          <DownloadPdfButton
            title={topic.label}
            meta={`Grade ${grade} · ${subject.label} · ${questions.length} questions`}
            filename={brandedFilename([`Grade ${grade}`, subject.label, name], "pdf")}
            layout={layout}
          />
          <PinButton
            url={absoluteUrl(path)}
            media={absoluteUrl(sharePaths(subject.id, grade, topic.id).pin)}
            description={pinDescription(grade, subject.label, name)}
          />
          <a href="#answer-key" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900">
            Jump to answer key
          </a>
        </div>

        <div className="mt-5"><TrustStrip compact /></div>

        {/* Everything inside this element (and only this) is printed — see globals.css */}
        <WorksheetSheet layout={layout} className="mt-8 print:mt-0" footerText={`${BRAND.tagline} · ${absoluteUrl(path).replace(/^https?:\/\//, "")}`}>
          {/* Printed answer key: always on its own page in print, hidden on screen
              (the on-screen version is the expandable block below). */}
          <div className="hidden print:block break-before-page">
            <h2 className="text-xl font-bold border-b-2 border-slate-900 pb-3 mb-4">Answer key — {topic.label} (Grade {grade})</h2>
            <ol>
              {layout.questions.map((item) => (
                <li key={item.n} className="flex gap-3 py-1.5 text-sm">
                  <span className="text-slate-400 font-mono w-6 shrink-0">{item.n}.</span>
                  <span>{item.letter ? `${item.letter} — ` : ""}{item.answer}</span>
                </li>
              ))}
              {layout.challenge && <li className="flex gap-3 py-1.5 text-sm"><span className="text-violet-500 w-6 shrink-0">★</span><span>{layout.challenge.answer}</span></li>}
            </ol>
          </div>
        </WorksheetSheet>

        <details id="answer-key" className="print:hidden mt-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
          <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-slate-900 dark:text-white">
            Answer key <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(click to show)</span>
          </summary>
          <ol className="px-6 pb-5">
            {layout.questions.map((item) => (
              <li key={item.n} className="flex gap-3 py-2 border-b border-dotted border-slate-200 dark:border-slate-800 last:border-0 text-slate-700 dark:text-slate-200">
                <span className="text-slate-400 font-mono text-sm w-6 shrink-0">{item.n}.</span>
                <span>{item.letter ? `${item.letter} — ` : ""}{item.answer}</span>
              </li>
            ))}
            {layout.challenge && <li className="flex gap-3 py-2 text-slate-700 dark:text-slate-200"><span className="text-violet-500 text-sm w-6 shrink-0">★</span><span>{layout.challenge.answer} <span className="text-xs text-slate-400">(challenge corner)</span></span></li>}
          </ol>
        </details>

        <div className="print:hidden mt-10 text-center bg-slate-100 dark:bg-slate-900 rounded-xl p-8">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Need another {name} worksheet?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Generate unlimited fresh versions at easy, medium or hard difficulty, each with its own answer key.{" "}
            {freeMode ? "Free during our launch — no card needed." : `Free ${process.env.NEXT_PUBLIC_TRIAL_DAYS || "7"}-day trial, no card required.`}
          </p>
          <SignupCta label={freeMode ? "Create a free account" : "Start your free trial"} className="mt-4" />
        </div>

        <div className="print:hidden mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to use this worksheet</h2>
          <ul className="mt-3 space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-300">
            {tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {(sameGrade.length > 0 || otherGrades.length > 0 || sameTopicElsewhere.length > 0) && (
          <div className="print:hidden mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related worksheets</h2>
            {sameTopicElsewhere.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{name} in other Grade {grade} courses</p>
                <div className="flex flex-wrap gap-2">
                  {sameTopicElsewhere.map((s) => (
                    <Link key={s.id} href={`/worksheets/${s.id}/${grade}/${topic.id}`} className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-white">
                      Grade {grade} {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {otherGrades.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{name} at other grades</p>
                <div className="flex flex-wrap gap-2">
                  {otherGrades.map((g) => (
                    <Link key={g} href={`/worksheets/${subject.id}/${g}/${topic.id}`} className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-white">
                      Grade {g}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {sameGrade.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">More Grade {grade} {subject.label} worksheets</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {sameGrade.map((t) => (
                    <Link key={t.id} href={`/worksheets/${subject.id}/${grade}/${t.id}`} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 hover:border-slate-900 dark:hover:border-white">
                      Grade {grade} {t.label.replace(/^The /, "")}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {guides.length > 0 && (
          <div className="print:hidden mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Guides for teaching {name}</h2>
            <div className="mt-4 grid gap-3">
              {guides.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-900 dark:hover:border-white">
                  <span className="block font-semibold text-slate-900 dark:text-white">{p.title}</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-300 mt-1">{p.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <TopicRequestBox subject={subject.id} grade={grade} compact />
        </div>

        <div className="print:hidden mt-12">
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
