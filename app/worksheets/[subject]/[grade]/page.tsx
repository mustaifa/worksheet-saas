import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SUBJECTS, SubjectId, allGrades, topicsForGrade } from "@/lib/subjects";

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
    title: `Grade ${params.grade} ${subject.label} Worksheets | Practice Sheet`,
    description: `Printable, self-checking Grade ${params.grade} ${subject.label} worksheets — pick a topic to see a free sample.`,
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
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm text-slate-500">
          <Link href="/worksheets" className="hover:underline">Worksheets</Link> /{" "}
          <Link href={`/worksheets/${subject.id}`} className="hover:underline">{subject.label}</Link> / Grade {grade}
        </p>
        <h1 className="text-3xl font-bold mt-2">Grade {grade} {subject.label} Worksheets</h1>
        <p className="text-slate-600 mt-2">Pick a topic to see a free sample worksheet.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {topics.map((t) => (
            <Link
              key={t.id}
              href={`/worksheets/${subject.id}/${grade}/${t.id}`}
              className="rounded-xl border border-slate-200 p-5 hover:border-slate-900 hover:shadow-md transition-all"
            >
              <p className="font-semibold">{t.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
