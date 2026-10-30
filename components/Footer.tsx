import Link from "next/link";
import { isFreeMode } from "@/lib/access";
import CookieSettingsLink from "./CookieSettingsLink";

export default function Footer() {
  const freeMode = isFreeMode();

  return (
    <footer className="print:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <img src="/logo-mark.png" alt="" width={22} height={22} className="rounded-md" />
            Practice Sheet
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Worksheets for Math, English, Science and Computer Science, grades 1–12. A product of Aethel Systems.</p>
          <a href="mailto:aethelsystems@gmail.com" className="inline-block mt-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-2">aethelsystems@gmail.com</a>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Product</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/worksheets" className="hover:text-slate-900 dark:hover:text-white">Browse worksheets</Link></li>
            {!freeMode && <li><Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</Link></li>}
            <li><Link href="/blog" className="hover:text-slate-900 dark:hover:text-white">Blog</Link></li>
            <li><Link href="/play" className="hover:text-slate-900 dark:hover:text-white">Join a live quiz</Link></li>
            <li><Link href="/worksheets#request" className="hover:text-slate-900 dark:hover:text-white">Request a topic</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Who it's for</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/teachers" className="hover:text-slate-900 dark:hover:text-white">Teachers</Link></li>
            <li><Link href="/parents" className="hover:text-slate-900 dark:hover:text-white">Parents</Link></li>
            <li><Link href="/students" className="hover:text-slate-900 dark:hover:text-white">Students</Link></li>
          </ul>
          <p className="font-semibold text-slate-900 dark:text-white mt-5 mb-2">Guides</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/blog/subject/math" className="hover:text-slate-900 dark:hover:text-white">Math guides</Link></li>
            <li><Link href="/blog/subject/english" className="hover:text-slate-900 dark:hover:text-white">English guides</Link></li>
            <li><Link href="/blog/subject/science" className="hover:text-slate-900 dark:hover:text-white">Science guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Company</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/about" className="hover:text-slate-900 dark:hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
            <li><Link href="/ai" className="hover:text-slate-900 dark:hover:text-white">How we use AI</Link></li>
            <li><Link href="/safety" className="hover:text-slate-900 dark:hover:text-white">Safety & privacy</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Legal</p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
            <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link></li>
            <li><CookieSettingsLink className="hover:text-slate-900 dark:hover:text-white" /></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} Aethel Systems. Practice Sheet is a product of Aethel Systems. No ads, ever.
      </div>
    </footer>
  );
}
