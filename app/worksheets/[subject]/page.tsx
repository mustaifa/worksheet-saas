import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SUBJECTS, SubjectId, allGrades, topicsForGrade } from "@/lib/subjects";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.id }));
}

export function generateMetadata({ params }: { params: { subject: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return {};
  return {
    title: `Free ${subject.label} Worksheets, Grades 1–12 | Practice Sheet`,
    description: `Printable, self-checking ${subject.label} worksheets for every grade from 1 to 12.`,
  };
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) notFound();

  const grades = allGrades().filter((g) => topicsForGrade(subject.id as SubjectId, g).length > 0);

  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm text-slate-500"><Link href="/worksheets" className="hover:underline">Worksheets</Link> / {subject.label}</p>
        <h1 className="text-3xl font-bold mt-2">{subject.label} Worksheets by Grade</h1>
        <p className="text-slate-600 mt-2">Choose a grade to see available topics.</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
          {grades.map((g) => (
            <Link
              key={g}
              href={`/worksheets/${subject.id}/${g}`}
              className="rounded-xl border border-slate-200 p-5 text-center hover:border-slate-900 hover:shadow-md transition-all"
            >
              <p className="text-xl font-bold">Grade {g}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
