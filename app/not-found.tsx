import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SUBJECTS, allGrades, topicsForGrade } from "@/lib/subjects";

export const metadata = { title: "Page not found", robots: { index: false } };

// Shown for any missing page — including old links from the site's previous
// version — so visitors land somewhere useful instead of a blank error.
export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Page not found</p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-slate-900 dark:text-white">We couldn't find that page</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-3">
          It may have moved, or the link may be from an older version of the site. Here are the most useful places to go next.
        </p>
        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          {SUBJECTS.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <Link href={`/worksheets/${s.id}`} className="font-semibold text-slate-900 dark:text-white hover:underline">{s.label} worksheets</Link>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {allGrades().filter((g) => topicsForGrade(s.id, g).length > 0).map((g) => (
                  <Link key={g} href={`/worksheets/${s.id}/${g}`} className="text-xs px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-white">
                    Grade {g}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-medium">Home</Link>
          <Link href="/blog" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">Guides</Link>
          <Link href="/teachers" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">For teachers</Link>
          <Link href="/parents" className="px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">For parents</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
