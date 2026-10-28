import Link from "next/link";
import Navbar from "@/components/Navbar";
import TopicRequestBox from "@/components/TopicRequestBox";
import Footer from "@/components/Footer";
import { SUBJECTS, allGrades, topicsForGrade, generateWorksheet } from "@/lib/subjects";
import WorksheetThumb from "@/components/WorksheetThumb";
import TrustStrip from "@/components/TrustStrip";
import { subjectStyle } from "@/components/subjectStyles";

export const metadata = {
  title: "Free Printable Worksheets with Answers, Grades 1–12",
  description: "Browse free printable Math, English and Science worksheets for every grade from 1 to 12. Each one comes with a full answer key and prints or saves as a PDF.",
  alternates: { canonical: "/worksheets" },
};

const PREVIEW: Record<string, { grade: number; topic: string; title: string }> = {
  math: { grade: 5, topic: "fractions_add_sub", title: "Adding & Subtracting Fractions" },
  english: { grade: 8, topic: "sentence_types", title: "Sentence Structure" },
  science: { grade: 6, topic: "body_circulatory", title: "Circulatory System" },
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Free printable worksheets with answer keys</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-3xl">
          Hundreds of free Math, English and Science worksheets for grades 1–12. Every worksheet comes with a full answer key
          that is checked by code, never guessed, and you can print it or download it as a PDF. Pick a subject to start.
        </p>
        <div className="mt-5"><TrustStrip compact /></div>
        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          {SUBJECTS.map((s) => {
            const pv = PREVIEW[s.id];
            const lines = generateWorksheet({ subject: s.id, grade: pv.grade, topic: pv.topic, difficulty: "medium", count: 5, seed: 7 }).map((x) => x.q);
            const st = subjectStyle(s.id);
            return (
              <Link key={s.id} href={`/worksheets/${s.id}`} className={`group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg transition-all ${st.ring}`}>
                <div className={`${st.soft} px-8 pt-6 pb-0 h-48 overflow-hidden`}>
                  <WorksheetThumb subject={s.id} title={pv.title} meta={`Grade ${pv.grade} · ${s.label}`} lines={lines} className="group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="p-6">
                  <p className={`text-lg font-semibold ${st.text}`}>{s.label} worksheets</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Grades 1–12 · {allGrades().reduce((n, g) => n + topicsForGrade(s.id, g).length, 0)} worksheets
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">{SUBJECT_BLURBS[s.id]}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div id="request" className="mt-12">
          <TopicRequestBox compact />
        </div>
      </section>
      <Footer />
    </main>
  );
}
