import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AiPaused({ name }: { name: string }) {
  return (
    <main>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{name} is taking a short break</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">
          This feature is temporarily unavailable. Everything else — worksheets, answer keys, Live Quiz and Family — works as normal.
        </p>
        <Link href="/dashboard" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-medium">Create a worksheet</Link>
      </div>
    </main>
  );
}
