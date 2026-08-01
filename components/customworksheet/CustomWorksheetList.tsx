"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type WorksheetSummary = { id: string; title: string; subject: string | null; grade: number | null; shareCode: string; pageCount: number; updatedAt: string };

export default function CustomWorksheetList() {
  const router = useRouter();
  const [worksheets, setWorksheets] = useState<WorksheetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/custom-worksheet/list");
      const data = await res.json();
      if (res.ok) setWorksheets(data.worksheets);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    const res = await fetch("/api/custom-worksheet/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject: subject || null, grade: grade || null }),
    });
    let data: any = {};
    try { data = await res.json(); } catch {}
    setCreating(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push(`/dashboard/custom-worksheet/${data.id}`);
  }

  if (loading) return <p className="text-slate-400">Loading…</p>;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {worksheets.map((w) => (
          <Link
            key={w.id}
            href={`/dashboard/custom-worksheet/${w.id}`}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-slate-900 dark:hover:border-white hover:shadow-md transition-all"
          >
            <p className="font-medium text-slate-900 dark:text-white">{w.title}</p>
            <p className="text-xs text-slate-400 mt-1">
              {[w.subject, w.grade ? `Grade ${w.grade}` : null].filter(Boolean).join(" · ") || "No subject/grade set"}
            </p>
            <p className="text-xs text-slate-400">{w.pageCount} page{w.pageCount === 1 ? "" : "s"}</p>
          </Link>
        ))}
        <button
          onClick={() => setShowCreate(true)}
          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-slate-400 dark:text-slate-500 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white transition-all min-h-[92px]"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm font-medium">New worksheet</span>
        </button>
      </div>

      {showCreate && (
        <div className="mt-6 max-w-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">New custom worksheet</h3>
          <form onSubmit={create} className="space-y-3">
            <input
              value={title} onChange={(e) => setTitle(e.target.value)} required
              placeholder="Title (e.g. Friday Fractions Quiz)"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2 py-2 text-sm">
                <option value="">Subject (optional)</option>
                <option value="math">Math</option>
                <option value="english">English</option>
                <option value="science">Science</option>
              </select>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2 py-2 text-sm">
                <option value="">Grade (optional)</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={creating} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                {creating ? "Creating…" : "Create"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
