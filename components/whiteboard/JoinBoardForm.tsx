"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinBoardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code")?.toUpperCase() || "");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function join(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !nickname.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/whiteboard/${code.trim().toUpperCase()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.error || "Could not join."); setLoading(false); return; }
      router.push(`/whiteboard/${code.trim().toUpperCase()}`);
    } catch {
      setError("Could not reach the server. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="text-5xl mb-3">✏️</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Join a Whiteboard</h1>
      <form onSubmit={join} className="mt-6 space-y-3 text-left">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Board Code</label>
          <input
            value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123" maxLength={6}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Your Name</label>
          <input
            value={nickname} onChange={(e) => setNickname(e.target.value)}
            placeholder="First name is fine" maxLength={20}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit" disabled={loading || !code.trim() || !nickname.trim()}
          className="w-full bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          {loading ? "Joining…" : "Join"}
        </button>
      </form>
    </div>
  );
}
