"use client";
import { useState, useEffect } from "react";
import { exportPagesToPdf } from "@/components/customworksheet/pdfExport";

type WorksheetPage = { id: string; snapshot: string | null };
type Worksheet = { title: string; subject: string | null; grade: number | null; pages: WorksheetPage[] };

export default function PublicWorksheetViewer({ code }: { code: string }) {
  const [ws, setWs] = useState<Worksheet | null>(null);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/custom-worksheet/public/${code}`);
        let data: any = {};
        try { data = await res.json(); } catch {}
        if (!res.ok) { setError(data.error || "Worksheet not found."); return; }
        setWs(data);
      } catch {
        setError("Could not reach the server.");
      }
    }
    load();
  }, [code]);

  async function downloadPdf() {
    if (!ws) return;
    setExporting(true);
    try {
      await exportPagesToPdf(ws.pages, `${ws.title.replace(/[^a-z0-9]/gi, "-")}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  if (error) return <p className="text-sm text-red-600 text-center">{error}</p>;
  if (!ws) return <p className="text-slate-400 text-center">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ws.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {[ws.subject, ws.grade ? `Grade ${ws.grade}` : null].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button
          onClick={downloadPdf} disabled={exporting}
          className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 whitespace-nowrap"
        >
          {exporting ? "Preparing…" : "⬇ Download PDF"}
        </button>
      </div>

      <div className="space-y-6">
        {ws.pages.map((p, i) => (
          <div key={p.id} className="rounded-xl border border-slate-300 overflow-hidden bg-white">
            {p.snapshot ? (
              <img src={p.snapshot} alt={`Page ${i + 1}`} className="w-full h-auto" />
            ) : (
              <div className="aspect-video flex items-center justify-center text-slate-400 text-sm">Blank page</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
