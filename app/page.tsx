import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Math, English & Science worksheets for grades 1–12, generated in seconds
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          Every answer is verified, not guessed — so the answer key is always correct.
          Pick a subject, grade, and topic, or just describe what you need.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700">
            Start your {process.env.TRIAL_DAYS || "7"}-day free trial
          </Link>
          <Link href="/pricing" className="px-6 py-3 rounded-lg font-medium border border-slate-300 hover:bg-slate-100">
            See pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">No card required to start.</p>
      </section>
    </main>
  );
}
