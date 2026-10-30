import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintButton from "@/components/PrintButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import WorksheetSheet from "@/components/WorksheetSheet";
import SignupCta from "@/components/SignupCta";
import PinPages from "@/components/PinPages";
import { pinPageLinks } from "@/lib/pinLinks";
import { SITE_URL } from "@/lib/site";
import { layoutWorksheet } from "@/lib/worksheetLayout";
import { BRAND, brandedFilename } from "@/lib/brand";
import { isFreeMode } from "@/lib/access";
import { absoluteUrl } from "@/lib/site";
import { SUBJECTS, SubjectId, topicsForGrade, generateWorksheet, exampleQuestion, challengeQuestion } from "@/lib/subjects";
import { parseVariant, formatVariant } from "@/lib/worksheetVariant";
import { sharePaths, OG_SIZE } from "@/lib/shareImage";

// Public page for one exact generated worksheet (what a "Pin it" from the
// generator links to). Not indexed: the topic page is the one for search.
type Params = { subject: string; grade: string; topic: string; variant: string };

function resolve(params: Params) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  const grade = parseInt(params.grade, 10);
  const v = parseVariant(params.variant);
  if (!subject || isNaN(grade) || !v) return null;
  const topic = topicsForGrade(subject.id as SubjectId, grade).find((t) => t.id === params.topic);
  if (!topic) return null;
  return { subject, grade, topic, v, name: topic.label.replace(/^The /, "") };
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const r = resolve(params);
  if (!r) return {};
  const title = `Grade ${r.grade} ${r.name} Worksheet with Answers (${r.v.difficulty}, ${r.v.count} questions)`;
  const description = `Free printable Grade ${r.grade} ${r.subject.label} worksheet on ${r.name}, with a full answer key. Print it or save it as a PDF.`;
  const og = sharePaths(r.subject.id, r.grade, r.topic.id, formatVariant(r.v)).og;
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/worksheets/${r.subject.id}/${r.grade}/${r.topic.id}` },
    openGraph: { title, description, type: "article", images: [{ url: og, ...OG_SIZE, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export default function GeneratedWorksheetPage({ params }: { params: Params }) {
  const r = resolve(params);
  if (!r) notFound();
  const { subject, grade, topic, v, name } = r;
  const subjectId = subject.id as SubjectId;

  // Same steps as the generator, so this matches what was pinned exactly.
  const questions = generateWorksheet({ subject: subjectId, grade, topic: topic.id, difficulty: v.difficulty, count: v.count, seed: v.seed });
  const example = exampleQuestion({ subject: subjectId, grade, topic: topic.id, seed: v.seed, avoid: questions });
  const challenge = challengeQuestion({ subject: subjectId, grade, topic: topic.id, seed: v.seed });
  const layout = layoutWorksheet({ subject: subjectId, subjectLabel: subject.label, grade, topic: topic.id, title: topic.label, questions, example, challenge });

  const path = `/ws/${subject.id}/${grade}/${topic.id}/${formatVariant(v)}`;
  const topicPath = `/worksheets/${subject.id}/${grade}/${topic.id}`;
  const freeMode = isFreeMode();
  const pinLinks = pinPageLinks({
    origin: SITE_URL, subject: subject.id, subjectLabel: subject.label, grade, topic: topic.id, name,
    variant: v, layout,
  });

  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-12 print:p-0 print:max-w-none">
        <nav aria-label="Breadcrumb" className="print:hidden text-sm text-slate-500 dark:text-slate-400">
          <Link href="/worksheets" className="hover:underline">Worksheets</Link> /{" "}
          <Link href={`/worksheets/${subject.id}`} className="hover:underline">{subject.label}</Link> /{" "}
          <Link href={`/worksheets/${subject.id}/${grade}`} className="hover:underline">Grade {grade}</Link> /{" "}
          <Link href={topicPath} className="hover:underline">{topic.label}</Link>
        </nav>
        <h1 className="print:hidden text-3xl font-bold mt-2 text-slate-900 dark:text-white">Grade {grade} {name} Worksheet with Answers</h1>
        <p className="print:hidden text-slate-600 dark:text-slate-300 mt-3">
          {layout.questions.length} questions · {v.difficulty} difficulty · full answer key. Print it or save it as a PDF — every answer is checked by code, not guessed.
        </p>

        <div className="print:hidden mt-6 flex flex-wrap items-center gap-3">
          <PrintButton label="Print" />
          <DownloadPdfButton
            title={topic.label}
            meta={`Grade ${grade} · ${subject.label} · ${layout.questions.length} questions`}
            filename={brandedFilename([`Grade ${grade}`, subject.label, name], "pdf")}
            layout={layout}
          />
          <a href="#pin" className="px-5 py-2.5 rounded-lg font-medium bg-[#E60023] hover:bg-[#ad081b] text-white">Save to Pinterest</a>
          <a href="#answer-key" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900">
            Jump to answer key
          </a>
        </div>

        <WorksheetSheet layout={layout} className="mt-8 print:mt-0" footerText={`${BRAND.tagline} · ${absoluteUrl(topicPath).replace(/^https?:\/\//, "")}`}>
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

        <details id="answer-key" className="print:hidden mt-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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

        <div id="pin" className="print:hidden mt-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pin this worksheet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            {pinLinks.length > 1 ? `Split into ${pinLinks.length} pin pages so every question is readable. Pin each page.` : "Save it to a Pinterest board."}
          </p>
          <PinPages links={pinLinks} />
        </div>

        <div className="print:hidden mt-10 text-center bg-slate-100 dark:bg-slate-900 rounded-xl p-8">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Want another {name} worksheet?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Generate unlimited fresh versions at easy, medium or hard difficulty, each with its own answer key.{" "}
            {freeMode ? "Free during our launch — no card needed." : `Free ${process.env.NEXT_PUBLIC_TRIAL_DAYS || "7"}-day trial, no card required.`}
          </p>
          <SignupCta label={freeMode ? "Create a free account" : "Start your free trial"} className="mt-4" />
          <p className="mt-4 text-sm"><Link href={topicPath} className="underline text-slate-600 dark:text-slate-300">More about Grade {grade} {name} worksheets</Link></p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
