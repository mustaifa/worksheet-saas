"use client";
import { useState } from "react";
import type { AiHealth } from "@/lib/aiHealth";

function Row({ label, h }: { label: string; h: AiHealth }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
      <p className="text-sm font-semibold">
        {label}: {h.ok ? <span className="text-emerald-600">working ✓</span> : <span className="text-red-600">not working ✗</span>}
      </p>
      <p className="text-xs text-slate-500 mt-1">Model: {h.model}{h.status ? ` · HTTP ${h.status}` : ""}{h.errorType ? ` · ${h.errorType}` : ""}</p>
      {h.message && <p className="text-xs text-slate-500 mt-1">{h.message}</p>}
      {h.hint && <p className="text-sm mt-2">{h.hint}</p>}
    </div>
  );
}

export default function AiHealthCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tutor: AiHealth; scanner: AiHealth } | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/ai-health", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) setError(data.error || `HTTP ${res.status}`); else setResult(data);
    } catch (e: any) { setError(String(e?.message || e)); }
    setLoading(false);
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold">AI features (Tutor & Scanner)</h2>
        <button onClick={run} disabled={loading} className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50">
          {loading ? "Checking…" : "Check connection"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {result && (
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <Row label="Homework Tutor" h={result.tutor} />
          <Row label="Worksheet Scanner" h={result.scanner} />
        </div>
      )}
    </div>
  );
}
