"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Child = { id: string; name: string; avatar: string; gradeDefault: number; pin: string | null };

const AVATARS = ["🧒", "👦", "👧", "🦸", "🦸‍♀️", "🐯", "🦄", "🐼", "🚀", "⭐"];

export default function FamilyDashboard() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", avatar: "🧒", gradeDefault: 3, pin: "" });
  const [error, setError] = useState("");
  const [pinPrompt, setPinPrompt] = useState<Child | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => { loadChildren(); }, []);

  async function loadChildren() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/family/children");
      let data: any = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }
      if (!res.ok) {
        setError(data.error || `Could not load family profiles (status ${res.status}).`);
      } else {
        setChildren(data.children || []);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    }
    setLoading(false);
  }

  async function addChild(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/family/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    setForm({ name: "", avatar: "🧒", gradeDefault: 3, pin: "" });
    setShowAdd(false);
    loadChildren();
  }

  async function openChild(child: Child) {
    if (!child.pin) { router.push(`/dashboard/family/${child.id}`); return; }
    setPinPrompt(child);
    setPinInput("");
    setPinError("");
  }

  async function submitPin() {
    if (!pinPrompt) return;
    const res = await fetch("/api/family/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId: pinPrompt.id, pin: pinInput }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push(`/dashboard/family/${pinPrompt.id}`);
    } else {
      setPinError("Wrong PIN — try again.");
    }
  }

  if (loading) return <p className="text-slate-400 dark:text-slate-500">Loading…</p>;
  if (error && children.length === 0) {
    return (
      <div className="text-sm text-red-600">
        {error} <button onClick={loadChildren} className="underline">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => openChild(child)}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-slate-900 dark:hover:border-white hover:shadow-md transition-all"
          >
            <span className="text-4xl">{child.avatar}</span>
            <span className="font-medium text-slate-900 dark:text-white">{child.name}</span>
            <span className="text-xs text-slate-400">Grade {child.gradeDefault}{child.pin ? " · 🔒" : ""}</span>
          </button>
        ))}

        <button
          onClick={() => setShowAdd(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5 text-slate-400 dark:text-slate-500 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <span className="text-3xl">+</span>
          <span className="text-sm font-medium">Add child</span>
        </button>
      </div>

      {showAdd && (
        <div className="mt-8 max-w-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Add a child profile</h3>
          <form onSubmit={addChild} className="space-y-3">
            <input
              placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  type="button" key={a}
                  onClick={() => setForm({ ...form, avatar: a })}
                  className={`text-xl p-1.5 rounded-lg border ${form.avatar === a ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800" : "border-transparent"}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <label className="text-sm text-slate-600 dark:text-slate-300">Default grade</label>
              <select
                value={form.gradeDefault}
                onChange={(e) => setForm({ ...form, gradeDefault: parseInt(e.target.value, 10) })}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <input
              placeholder="Optional 4-digit PIN (for shared devices)" value={form.pin} maxLength={4}
              onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium">Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {pinPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-xs w-full">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">{pinPrompt.avatar} Enter {pinPrompt.name}'s PIN</p>
            <input
              type="password" inputMode="numeric" maxLength={4} value={pinInput} autoFocus
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => { if (e.key === "Enter") submitPin(); }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest mt-3"
            />
            {pinError && <p className="text-xs text-red-600 mt-1">{pinError}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={submitPin} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg text-sm font-medium">Go</button>
              <button onClick={() => setPinPrompt(null)} className="flex-1 border border-slate-300 dark:border-slate-700 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
