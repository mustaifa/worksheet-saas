"use client";
import { useState } from "react";
import { downloadWorksheetPdf, type PdfQuestion } from "@/lib/brandedPdf";

export default function DownloadPdfButton(props: {
  title: string; meta: string; filename: string; questions: PdfQuestion[];
  passage?: { title?: string; text: string } | null; className?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  async function go() {
    setState("busy");
    try {
      await downloadWorksheetPdf({ ...props, includeAnswerKey: true });
      setState("idle");
    } catch {
      setState("error");
    }
  }
  return (
    <button type="button" onClick={go} disabled={state === "busy"}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-60 ${props.className || ""}`}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
      {state === "busy" ? "Preparing…" : state === "error" ? "Try again" : "Download PDF"}
    </button>
  );
}
