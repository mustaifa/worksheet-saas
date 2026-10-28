import Link from "next/link";
import Navbar from "@/components/Navbar";
import TopicRequestBox from "@/components/TopicRequestBox";
import Footer from "@/components/Footer";
import { SUBJECTS, allGrades, topicsForGrade } from "@/lib/subjects";

export const metadata = {
  title: "Free Printable Worksheets with Answers, Grades 1–12",
  description: "Browse free printable Math, English and Science worksheets for every grade from 1 to 12. Each one comes with a full answer key and prints or saves as a PDF.",
  alternates: { canonical: "/worksheets" },
};

const SUBJECT_BLURBS: Record<string, string> = {
  math: "Number sense, fractions, decimals, percentages, algebra, geometry, statistics and trigonometry.",
  english: "Phonics, spelling, punctuation, grammar, parts of speech, vocabulary, literary devices and reading comprehension.",
  science: "Living things, the human body, the solar system, matter, forces, earth science, chemistry and genetics.",
};

export default function WorksheetsHub() {
  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">Free printable worksheets with answer keys</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Hundreds of free Math, English and Science worksheets for grades 1–12. Every worksheet comes with a full answer key
          that is checked by code, never guessed, and you can print it or save it as a PDF. Pick a subject to start.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {SUBJECTS.map((s) => (
            <Link
              key={s.id}
              href={`/worksheets/${s.id}`}
              className="rounded-xl border border-slate-200 p-6 text-center hover:border-slate-900 hover:shadow-md transition-all"
            >
              <p className="text-lg font-semibold">{s.label} worksheets</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Grades 1–12 · {allGrades().reduce((n, g) => n + topicsForGrade(s.id, g).length, 0)} worksheets
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">{SUBJECT_BLURBS[s.id]}</p>
            </Link>
          ))}
        </div>
        <div id="request" className="mt-12">
          <TopicRequestBox compact />
        </div>
      </section>
      <Footer />
    </main>
  );
}
