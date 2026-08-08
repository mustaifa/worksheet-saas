"use client";
import { useState, useEffect } from "react";
import { ExtractedWorksheet } from "@/lib/worksheetScanTypes";

export default function ScanPreview({ id }: { id: string }) {
  const [data, setData] = useState<ExtractedWorksheet | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/worksheet-scan/${id}`);
        let json: any = {};
        try { json = await res.json(); } catch {}
        if (!res.ok) { setError(json.error || "Not found."); return; }
        setData(json.scan.extractedData);
      } catch {
        setError("Could not reach the server.");
      }
    }
    load();
  }, [id]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-slate-400">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{data.title}</h1>
        <div className="flex gap-2">
          <a href={`/api/worksheet-scan/${id}/pdf`} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm px-4 py-2 rounded-lg font-medium">
            ⬇ Download PDF
          </a>
          <a href={`/api/worksheet-scan/${id}/docx`} className="border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm px-4 py-2 rounded-lg font-medium">
            ⬇ Download Word
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8">
        <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-900 dark:border-white pb-4 mb-6">
          {(data.studentInfoFields.length > 0 ? data.studentInfoFields : ["Name", "Date"]).map((f) => (
            <span key={f} className="border-b border-slate-400 pb-0.5">{f}: ______________</span>
          ))}
        </div>

        {data.sections.map((section, i) => (
          <div key={i} className="mb-8">
            <p className="font-semibold text-slate-900 dark:text-white mb-3">{section.number}. {section.instructions}</p>

            {section.table && (
              <table className="w-full text-sm mb-4 border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    {section.table.headers.map((h, hi) => (
                      <th key={hi} className="border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-center">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {section.chart && (
              <div className="mb-4 border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                📊 <strong>{section.chart.title}</strong> — {section.chart.xLabel} vs {section.chart.yLabel} (0–{section.chart.yMax})
                <br />Categories: {section.chart.categories.join(", ")}
                <p className="mt-1 text-slate-400">Drawn as real chart axes in the PDF export.</p>
              </div>
            )}

            <ul className="space-y-2 pl-4">
              {section.subQuestions.map((sq, si) => (
                <li key={si} className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{sq.label}</span> {sq.text}
                  {sq.hint && <p className="text-xs text-slate-400 italic ml-4 mt-0.5">{sq.hint}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
