import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isFreeMode } from "@/lib/access";

export default function Home() {
  const freeMode = isFreeMode();

  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Math, English & Science worksheets for grades 1–12, generated in seconds
        </h1>
        <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Every answer is verified, not guessed — so the answer key is always correct.
          Pick a subject, grade, and topic, or just describe what you need.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/signup" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-200">
            {freeMode ? "Sign up — it's free" : `Start your ${process.env.TRIAL_DAYS || "7"}-day free trial`}
          </Link>
          <Link href="/pricing" className="px-6 py-3 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900">
            {freeMode ? "Learn more" : "See pricing"}
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {freeMode ? "100% free during our launch — no card, ever." : "No card required to start."}
        </p>
      </section>
      <Footer />
    </main>
  );
}
