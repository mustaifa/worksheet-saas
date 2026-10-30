"use client";
import type { PinPageLink } from "@/lib/pinLinks";

// Every page of a worksheet as a pin, each with its own "Pin page N" button
// (Pinterest's pin link takes one image at a time).
export default function PinPages({ links, compact }: { links: PinPageLink[]; compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
      {links.map((l) => (
        <div key={l.page} className="flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.image} alt={`Pin image, page ${l.page} of ${l.of}`} loading="lazy" className="w-full aspect-[2/3] rounded-lg border border-slate-200 dark:border-slate-700 object-cover bg-slate-100" />
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm font-medium rounded-lg bg-[#E60023] hover:bg-[#ad081b] text-white px-3 py-2"
          >
            {l.of > 1 ? `Pin page ${l.page}` : "Save to Pinterest"}
          </a>
        </div>
      ))}
    </div>
  );
}
