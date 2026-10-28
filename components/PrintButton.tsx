"use client";

// Opens the browser print dialog. The @media print rules in globals.css print
// only #worksheet-print-area, and the dialog's "Save as PDF" option gives a PDF.
export default function PrintButton({ label = "Print / Save as PDF", className = "" }: { label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-200 ${className}`}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" />
      </svg>
      {label}
    </button>
  );
}
