import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import TopicRequestBox from "@/components/TopicRequestBox";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/site";
import { gradeEquivalents } from "@/lib/topicContent";
import { SUBJECTS, SubjectId, allGrades, topicsForGrade } from "@/lib/subjects";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.id }));
}

export function generateMetadata({ params }: { params: { subject: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return {};
  return {
    title: `Free ${subject.label} Worksheets with Answers, Grades 1–12`,
    description: `Free printable ${subject.label} worksheets for every grade from 1 to 12, each with a full answer key. Print or save as a PDF.`,
    alternates: { canonical: `/worksheets/${subject.id}` },
  };
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) notFound();

  const grades = allGrades().filter((g) => topicsForGrade(subject.id as SubjectId, g).length > 0);

  return (
    <main>
      <Navbar />
      <JsonLd data={breadcrumbLd([
        { name: "Worksheets", url: absoluteUrl("/worksheets") },
        { name: subject.label, url: absoluteUrl(`/worksheets/${subject.id}`) },
      ])} />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm text-slate-500"><Link href="/worksheets" className="hover:underline">Worksheets</Link> / {subject.label}</p>
        <h1 className="text-3xl font-bold mt-2">Free {subject.label} Worksheets by Grade</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Choose a grade to see every {subject.label.toLowerCase()} topic we cover (UK Year and India Class shown under each grade). Each worksheet is free to print, comes with a full
          answer key, and can be saved as a PDF.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-8">
          {grades.map((g) => (
            <Link
              key={g}
              href={`/worksheets/${subject.id}/${g}`}
              className="rounded-xl border border-slate-200 p-5 text-center hover:border-slate-900 hover:shadow-md transition-all"
            >
              <p className="text-xl font-bold">Grade {g}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{topicsForGrade(subject.id as SubjectId, g).length} topics</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Year {gradeEquivalents(g).ukYear} · Class {g}</p>
            </Link>
          ))}
        </div>
        <div id="request" className="mt-12">
          <TopicRequestBox subject={subject.id} compact />
        </div>
      </section>
      <Footer />
    </main>
  );
}
