import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SUBJECTS, SubjectId, allGrades, topicsForGrade, topicLabel, generateWorksheet } from "@/lib/subjects";

// deterministic hash so every visitor to the same URL sees the same sample —
// good for SEO (stable, indexable content) and avoids surprising repeat visitors
function stableSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

export function generateStaticParams() {
  const params: { subject: string; grade: string; topic: string }[] = [];
  for (const s of SUBJECTS) {
    for (const g of allGrades()) {
      for (const t of topicsForGrade(s.id, g)) {
        params.push({ subject: s.id, grade: String(g), topic: t.id });
      }
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: { subject: string; grade: string; topic: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return {};
  const label = topicLabel(subject.id, params.topic);
  return {
    title: `Grade ${params.grade} ${label} Worksheet (Free Sample) | Practice Sheet`,
    description: `Free printable Grade ${params.grade} ${subject.label} worksheet on ${label}. Verified answers, printable PDF, generate unlimited variations.`,
  };
}

export default function TopicPage({ params }: { params: { subject: string; grade: string; topic: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  const grade = parseInt(params.grade, 10);
  if (!subject || isNaN(grade)) notFound();

  const topics = topicsForGrade(subject.id as SubjectId, grade);
  const topic = topics.find((t) => t.id === params.topic);
  if (!topic) notFound();

  const seed = stableSeed(`${subject.id}-${grade}-${topic.id}`);
  const sample = generateWorksheet({ subject: subject.id as SubjectId, grade, topic: topic.id, difficulty: "medium", count: 6, seed });

  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm text-slate-500">
          <Link href="/worksheets" className="hover:underline">Worksheets</Link> /{" "}
          <Link href={`/worksheets/${subject.id}`} className="hover:underline">{subject.label}</Link> /{" "}
          <Link href={`/worksheets/${subject.id}/${grade}`} className="hover:underline">Grade {grade}</Link> / {topic.label}
        </p>
        <h1 className="text-3xl font-bold mt-2">Grade {grade} {topic.label} Worksheet</h1>
        <p className="text-slate-600 mt-2">
          A free sample below. Every answer is verified, not AI-guessed — sign up to generate unlimited
          fresh worksheets on this topic, with printable A4 and PDF export.
        </p>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8 border border-slate-200">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
            <h2 className="text-xl font-bold">{topic.label}</h2>
            <div className="text-right text-xs text-slate-500 uppercase tracking-wide">
              Grade {grade} · {subject.label}
            </div>
          </div>
          <ul>
            {sample.map((item, i) => (
              <li key={i} className="flex gap-3 py-3 border-b border-dotted border-slate-200 last:border-0">
                <span className="text-slate-400 font-mono text-sm w-6">{i + 1}.</span>
                <span>{item.q}<span className="inline-block min-w-[90px] border-b border-slate-400 ml-2">&nbsp;</span></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center bg-slate-50 rounded-xl p-8">
          <p className="text-lg font-semibold">Want a fresh set every time, plus the answer key?</p>
          <p className="text-slate-500 text-sm mt-1">Free {process.env.NEXT_PUBLIC_TRIAL_DAYS || "7"}-day trial, no card required.</p>
          <Link href="/signup" className="inline-block mt-4 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700">
            Generate unlimited worksheets
          </Link>
        </div>
      </section>
    </main>
  );
}
