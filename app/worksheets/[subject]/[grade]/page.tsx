import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/site";
import { topicDescription } from "@/lib/topicContent";
import { SUBJECTS, SubjectId, allGrades, topicsForGrade, groupTopics } from "@/lib/subjects";

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

export function generateMetadata({ params }: { params: { subject: string; grade: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return {};
  return {
    title: `Free Grade ${params.grade} ${subject.label} Worksheets with Answers`,
    description: `Free printable Grade ${params.grade} ${subject.label} worksheets on every topic, each with a full answer key. Print or save as a PDF.`,
    alternates: { canonical: `/worksheets/${subject.id}/${params.grade}` },
  };
}

export default function GradePage({ params }: { params: { subject: string; grade: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  const grade = parseInt(params.grade, 10);
  if (!subject || isNaN(grade)) notFound();

  const topics = topicsForGrade(subject.id as SubjectId, grade);
  if (topics.length === 0) notFound();

  return (
    <main>
      <Navbar />
      <JsonLd data={breadcrumbLd([
        { name: "Worksheets", url: absoluteUrl("/worksheets") },
        { name: subject.label, url: absoluteUrl(`/worksheets/${subject.id}`) },
        { name: `Grade ${grade}`, url: absoluteUrl(`/worksheets/${subject.id}/${grade}`) },
      ])} />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm text-slate-500">
          <Link href="/worksheets" className="hover:underline">Worksheets</Link> /{" "}
          <Link href={`/worksheets/${subject.id}`} className="hover:underline">{subject.label}</Link> / Grade {grade}
        </p>
        <h1 className="text-3xl font-bold mt-2">Free Grade {grade} {subject.label} Worksheets</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          {topics.length} free Grade {grade} {subject.label.toLowerCase()} worksheets. Pick a topic to open a printable worksheet with a full answer key.
        </p>

        <div className="mt-8 space-y-8">
          {groupTopics(topics).map(({ group, topics: groupedTopics }) => (
            <div key={group ?? "_"}>
              {group && <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{group}</h2>}
              <div className="grid sm:grid-cols-2 gap-3">
                {groupedTopics.map((t) => (
                  <Link
                    key={t.id}
                    href={`/worksheets/${subject.id}/${grade}/${t.id}`}
                    className="rounded-xl border border-slate-200 p-5 hover:border-slate-900 hover:shadow-md transition-all"
                  >
                    <p className="font-semibold">{t.label}</p>
                    {topicDescription(subject.id as SubjectId, t.id) && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{topicDescription(subject.id as SubjectId, t.id)}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
