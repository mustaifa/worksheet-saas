import Link from "next/link";
import { NoAdsIcon, KeyCheckIcon, UsersOffIcon, GlobeIcon } from "./Icons";
import { BRAND } from "@/lib/brand";

const ITEMS = [
  { Icon: KeyCheckIcon, title: "Answer keys checked by code", body: "Never guessed by AI" },
  { Icon: NoAdsIcon, title: "No ads, ever", body: "Nothing to distract students" },
  { Icon: UsersOffIcon, title: "No student accounts needed", body: "Print, or join quizzes with a code" },
  { Icon: GlobeIcon, title: `Used in ${BRAND.countriesReached} countries`, body: "By teachers, parents and students" },
];

export default function TrustStrip({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ul className="print:hidden flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
        {ITEMS.slice(0, 3).map(({ Icon, title }) => (
          <li key={title} className="flex items-center gap-1.5"><Icon size={16} className="text-emerald-600" />{title}</li>
        ))}
        <li><Link href="/safety" className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">Safety & privacy</Link></li>
      </ul>
    );
  }
  return (
    <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {ITEMS.map(({ Icon, title, body }) => (
        <div key={title} className="flex gap-3 items-start rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <span className="shrink-0 w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center"><Icon size={18} /></span>
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
