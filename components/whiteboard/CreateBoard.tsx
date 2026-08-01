"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBoard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function create() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/whiteboard/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    let data: any = {};
    try { data = await res.json(); } catch {}
    setLoading(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push(`/dashboard/whiteboard/${data.code}`);
  }

  return (
    <div className="max-w-sm mx-auto border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lesson title (optional)</label>
      <input
        value={title} onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Adding fractions"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1"
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      <button
        onClick={create} disabled={loading}
        className="w-full mt-4 bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Start Whiteboard ✏️"}
      </button>
    </div>
  );
}
