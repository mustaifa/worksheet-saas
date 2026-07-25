import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-bold text-slate-900">Practice Sheet</p>
          <p className="text-slate-500 mt-2">Worksheets for Math, English & Science, grades 1–12.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-2">Product</p>
          <ul className="space-y-1.5 text-slate-500">
            <li><Link href="/worksheets" className="hover:text-slate-900">Browse worksheets</Link></li>
            <li><Link href="/pricing" className="hover:text-slate-900">Pricing</Link></li>
            <li><Link href="/blog" className="hover:text-slate-900">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-2">Company</p>
          <ul className="space-y-1.5 text-slate-500">
            <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
            <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-2">Legal</p>
          <ul className="space-y-1.5 text-slate-500">
            <li><Link href="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Practice Sheet. All rights reserved.
      </div>
    </footer>
  );
}
