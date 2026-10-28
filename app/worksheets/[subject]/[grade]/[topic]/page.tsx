import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintButton from "@/components/PrintButton";
import SignupCta from "@/components/SignupCta";
import JsonLd, { breadcrumbLd, faqLd } from "@/components/seo/JsonLd";
import { isFreeMode } from "@/lib/access";
import { absoluteUrl, SITE_NAME, OG_IMAGE } from "@/lib/site";
import { topicDescription, gradeBand, howToUse } from "@/lib/topicContent";
import { SUBJECTS, SubjectId, allGrades, allTopics, topicsForGrade, topicLabel, generateWorksheet } from "@/lib/subjects";

// Number of questions on the free public worksheet (reading comprehension
// ignores this and uses its passage's own question set).
const SAMPLE_COUNT = 12;

// deterministic hash so every visitor to the same URL sees the same worksheet —
// good for SEO (stable, indexable content) and avoids surprising repeat visitors
function stableSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

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
  const label = topicLabel(subject.id, params.topic);
  const path = `/worksheets/${subject.id}/${params.grade}/${params.topic}`;
  const title = `Grade ${params.grade} ${label} Worksheet with Answers (Free PDF)`;
  const description = `Free printable Grade ${params.grade} ${subject.label} worksheet on ${label}, with a full answer key. Print it or save it as a PDF — every answer is checked by code, not guessed.`;
  return {
    // absolute: keeps the keyword-first title under ~65 chars (no "| Practice Sheet" suffix)
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description },
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
  const passage = questions[0]?.passage ? { title: questions[0].passageTitle, text: questions[0].passage } : null;

  const description = topicDescription(subjectId, topic.id);
  const tips = howToUse(grade);

  // Related links: same-group topics first, then the rest of this grade; and
  // the same topic at the other grades it's offered in.
  const sameGrade = gradeTopics
    .filter((t) => t.id !== topic.id)
    .sort((a, b) => Number(b.group === topic.group && !!topic.group) - Number(a.group === topic.group && !!topic.group))
    .slice(0, 8);
  const otherGrades = (allTopics(subjectId).find((t) => t.id === topic.id)?.grades || []).filter((g) => g !== grade);

  const path = `/worksheets/${subject.id}/${grade}/${topic.id}`;
  const faqs = [
    {
      q: `Does this Grade ${grade} ${topic.label} worksheet come with answers?`,
      a: `Yes. The full answer key is on this page, and it prints on its own page after the questions. Every answer is calculated or checked by code rather than written by an AI model, so the key is always correct.`,
    },
    {
      q: "How do I print it or save it as a PDF?",
      a: `Click "Print / Save as PDF". Your browser's print window opens with just the worksheet and answer key. Choose your printer, or pick "Save as PDF" as the destination to download a PDF.`,
    },
    {
      q: `Can I get a different ${topic.label} worksheet?`,
      a: freeMode
        ? `Yes. Create a free account to generate as many fresh Grade ${grade} ${topic.label} worksheets as you like, at easy, medium or hard difficulty, each with its own answer key.`
        : `Yes. Start a free trial (no card needed) to generate as many fresh Grade ${grade} ${topic.label} worksheets as you like, at easy, medium or hard difficulty, each with its own answer key.`,
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
            name: `Grade ${grade} ${topic.label} Worksheet`,
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
        <h1 className="print:hidden text-3xl font-bold mt-2 text-slate-900 dark:text-white">Grade {grade} {topic.label} Worksheet with Answers</h1>
        <p className="print:hidden text-slate-600 dark:text-slate-300 mt-3">
          {description ? `${description} ` : ""}
          This free {gradeBand(grade)} worksheet has {questions.length} questions and a full answer key. Print it or save it as a PDF — every answer is checked by code, not guessed.
        </p>

        <div className="print:hidden mt-6 flex flex-wrap items-center gap-3">
          <PrintButton />
          <a href="#answer-key" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900">
            Jump to answer key
          </a>
        </div>

        {/* Everything inside this element (and only this) is printed — see globals.css */}
        <div id="worksheet-print-area" className="mt-8 print:mt-0 bg-white text-slate-900 rounded-lg shadow-lg p-8 border border-slate-200">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
            <div>
              <h2 className="text-xl font-bold">{topic.label}</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Grade {grade} · {subject.label}</p>
            </div>
            <div className="text-sm text-slate-600 space-y-2 text-right">
              <p>Name: <span className="inline-block w-36 border-b border-slate-400">&nbsp;</span></p>
              <p>Date: <span className="inline-block w-36 border-b border-slate-400">&nbsp;</span></p>
            </div>
          </div>
          {passage && (
            <div className="mb-5 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-semibold text-sm mb-2">{passage.title}</p>
              <p className="text-sm leading-relaxed whitespace-pre-line">{passage.text}</p>
            </div>
          )}
          <ol>
            {questions.map((item, i) => (
              <li key={i} className="flex gap-3 py-3 border-b border-dotted border-slate-200 last:border-0 break-inside-avoid">
                <span className="text-slate-400 font-mono text-sm w-6 shrink-0">{i + 1}.</span>
                <span>{item.q}<span className="inline-block min-w-[90px] border-b border-slate-400 ml-2">&nbsp;</span></span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[11px] text-slate-400">{SITE_NAME} · {absoluteUrl(path).replace(/^https?:\/\//, "")}</p>

          {/* Printed answer key: always on its own page in print, hidden on screen
              (the on-screen version is the expandable block below). */}
          <div className="hidden print:block break-before-page">
            <h2 className="text-xl font-bold border-b-2 border-slate-900 pb-3 mb-4">Answer key — {topic.label} (Grade {grade})</h2>
            <ol>
              {questions.map((item, i) => (
                <li key={i} className="flex gap-3 py-1.5 text-sm">
                  <span className="text-slate-400 font-mono w-6 shrink-0">{i + 1}.</span>
                  <span>{item.a}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <details id="answer-key" className="print:hidden mt-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
          <summary className="cursor-pointer select-none px-6 py-4 font-semibold text-slate-900 dark:text-white">
            Answer key <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(click to show)</span>
          </summary>
          <ol className="px-6 pb-5">
            {questions.map((item, i) => (
              <li key={i} className="flex gap-3 py-2 border-b border-dotted border-slate-200 dark:border-slate-800 last:border-0 text-slate-700 dark:text-slate-200">
                <span className="text-slate-400 font-mono text-sm w-6 shrink-0">{i + 1}.</span>
                <span>{item.a}</span>
              </li>
            ))}
          </ol>
        </details>

        <div className="print:hidden mt-10 text-center bg-slate-100 dark:bg-slate-900 rounded-xl p-8">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Need another {topic.label} worksheet?</p>
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

        {(sameGrade.length > 0 || otherGrades.length > 0) && (
          <div className="print:hidden mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related worksheets</h2>
            {otherGrades.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{topic.label} at other grades</p>
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
                      Grade {grade} {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
