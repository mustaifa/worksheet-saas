import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SUBJECTS } from "@/lib/subjects";

export const metadata = {
  title: "Free Worksheets — Math, English & Science, Grades 1–12 | Practice Sheet",
  description: "Browse printable, self-checking worksheets for every grade from 1 to 12, across Math, English, and Science.",
};

export default function WorksheetsHub() {
  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">Browse worksheets by subject</h1>
        <p className="text-slate-600 mt-2">Every worksheet is generated with verified answers — pick a subject to start.</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {SUBJECTS.map((s) => (
            <Link
              key={s.id}
              href={`/worksheets/${s.id}`}
              className="rounded-xl border border-slate-200 p-6 text-center hover:border-slate-900 hover:shadow-md transition-all"
            >
              <p className="text-lg font-semibold">{s.label}</p>
              <p className="text-xs text-slate-500 mt-1">Grades 1–12</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
