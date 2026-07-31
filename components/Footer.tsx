import Link from "next/link";
import { isFreeMode } from "@/lib/access";

export default function Footer() {
  const freeMode = isFreeMode();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-bold text-slate-900 dark:text-white">Practice Sheet</p>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Worksheets for Math, English & Science, grades 1–12.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Product</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/worksheets" className="hover:text-slate-900 dark:hover:text-white">Browse worksheets</Link></li>
            {!freeMode && <li><Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</Link></li>}
            <li><Link href="/blog" className="hover:text-slate-900 dark:hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Company</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/about" className="hover:text-slate-900 dark:hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Legal</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} Practice Sheet. All rights reserved.
      </div>
    </footer>
  );
}
