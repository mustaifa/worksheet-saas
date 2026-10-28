import { BRAND } from "@/lib/brand";
import { subjectStyle } from "./subjectStyles";

/** A small picture of a real worksheet (title, Name/Date, numbered questions),
 * so visitors can see what they'll get before clicking. */
export default function WorksheetThumb({ subject, title, meta, lines, className = "" }: { subject: string; title: string; meta: string; lines: string[]; className?: string }) {
  const s = subjectStyle(subject);
  return (
    <div className={`relative bg-white text-slate-900 rounded-md shadow-md border border-slate-200 overflow-hidden ${className}`} aria-hidden="true">
      <div className={`h-1.5 ${s.stripe}`} />
      <div className="px-3.5 pt-2.5 pb-3">
        <div className="flex items-center justify-between text-[7px] text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-slate-500"><img src={BRAND.logoPath} alt="" width={8} height={8} className="rounded-sm" />{BRAND.name}</span>
          <span>{BRAND.domain}</span>
        </div>
        <p className="mt-1.5 text-[11px] font-bold leading-tight truncate">{title}</p>
        <p className="text-[7.5px] text-slate-500 uppercase tracking-wide">{meta}</p>
        <div className="mt-1.5 flex gap-3 text-[7px] text-slate-400"><span>Name: ________</span><span>Date: ______</span></div>
        <div className="mt-1 border-t border-slate-800" />
        <ol className="mt-1.5 space-y-1.5">
          {lines.slice(0, 5).map((l, i) => (
            <li key={i} className="flex gap-1.5 text-[8px] leading-snug">
              <span className="text-slate-400 w-2.5 shrink-0">{i + 1}.</span>
              <span className="line-clamp-2">{l} <span className="inline-block w-8 border-b border-slate-300 align-bottom" /></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
