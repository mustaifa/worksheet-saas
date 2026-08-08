"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ScanSummary = { id: string; title: string; createdAt: string };

export default function WorksheetScanUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadScans(); }, []);

  async function loadScans() {
    setLoading(true);
    try {
      const res = await fetch("/api/worksheet-scan/list");
      const data = await res.json();
      if (res.ok) setScans(data.scans);
    } catch { /* ignore */ }
    setLoading(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function convert() {
    if (!previewUrl) return;
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/worksheet-scan/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: previewUrl }),
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.error || "Something went wrong."); setUploading(false); return; }
      router.push(`/dashboard/worksheet-scan/${data.id}`);
    } catch {
      setError("Could not reach the server. Check your connection.");
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="max-w-lg border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900 mb-8">
        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 text-center cursor-pointer hover:border-slate-900 dark:hover:border-white transition-all"
          >
            <p className="text-3xl mb-2">📄</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Click to upload a photo of your worksheet</p>
            <p className="text-xs text-slate-400 mt-1">JPG or PNG — a clear, well-lit photo works best</p>
          </div>
        ) : (
          <div>
            <img src={previewUrl} alt="Uploaded worksheet" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 mb-4" />
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={convert} disabled={uploading}
                className="flex-1 bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
              >
                {uploading ? "Reading worksheet…" : "✨ Convert to digital worksheet"}
              </button>
              <button
                onClick={() => { setPreviewUrl(null); setError(""); }}
                disabled={uploading}
                className="border border-slate-300 dark:border-slate-700 px-4 py-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Past conversions</h2>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : scans.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing converted yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {scans.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/worksheet-scan/${s.id}`}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-slate-900 dark:hover:border-white hover:shadow-md transition-all"
            >
              <p className="font-medium text-slate-900 dark:text-white text-sm">{s.title}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
