"use client";
import { useState, useEffect, useRef } from "react";

type Participant = { id: string; nickname: string; score: number };
type State = {
  status: "lobby" | "active" | "finished";
  currentIndex: number;
  questionCount: number;
  showAnswer: boolean;
  topicLabel: string;
  grade: number;
  question: string | null;
  correctAnswer: string | null;
  participants: Participant[];
};

export default function HostPanel({ code }: { code: string }) {
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function poll() {
    try {
      const res = await fetch(`/api/live/${code}/state`);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.error || "Could not load session."); return; }
      setState(data);
      setError("");
    } catch {
      setError("Could not reach the server.");
    }
  }

  async function hostAction(action: string) {
    setActionLoading(true);
    await fetch(`/api/live/${code}/host-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await poll();
    setActionLoading(false);
  }

  if (error) return <p className="text-sm text-red-600 text-center">{error}</p>;
  if (!state) return <p className="text-slate-400 text-center">Loading…</p>;

  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/play` : "/play";

  if (state.status === "lobby") {
    return (
      <div className="max-w-lg mx-auto text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Grade {state.grade} · {state.topicLabel}</p>
        <p className="text-xs text-slate-400 mt-1">Players go to <strong>{joinUrl}</strong> and enter this code:</p>
        <div className="my-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl py-8 text-6xl font-mono font-bold tracking-widest">
          {code}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{state.participants.length} joined</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {state.participants.map((p) => (
            <span key={p.id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm px-3 py-1.5 rounded-full">{p.nickname}</span>
          ))}
        </div>
        <button
          onClick={() => hostAction("start")} disabled={actionLoading || state.participants.length === 0}
          className="bg-amber-400 text-amber-950 font-semibold px-8 py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          {state.participants.length === 0 ? "Waiting for players…" : "Start Quiz 🚀"}
        </button>
      </div>
    );
  }

  if (state.status === "active") {
    return (
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs text-slate-400 mb-2">Question {state.currentIndex + 1} of {state.questionCount}</p>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 mb-6">
          <p className="text-xl font-semibold text-slate-900 dark:text-white">{state.question}</p>
          {state.showAnswer && (
            <p className="mt-4 text-emerald-600 font-medium">Correct answer: {state.correctAnswer}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[...state.participants].sort((a, b) => b.score - a.score).map((p, i) => (
            <span key={p.id} className={`text-sm px-3 py-1.5 rounded-full ${i === 0 ? "bg-amber-200 text-amber-900 font-semibold" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}>
              {p.nickname}: {p.score}
            </span>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          {!state.showAnswer ? (
            <button onClick={() => hostAction("reveal")} disabled={actionLoading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">
              Reveal Answer
            </button>
          ) : (
            <button onClick={() => hostAction("next")} disabled={actionLoading} className="bg-amber-400 text-amber-950 px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50">
              {state.currentIndex + 1 >= state.questionCount ? "See Final Results 🏆" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // finished
  const ranked = [...state.participants].sort((a, b) => b.score - a.score);
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="text-5xl mb-3">🏆</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Final Results</h1>
      <div className="space-y-2">
        {ranked.map((p, i) => (
          <div key={p.id} className={`flex items-center justify-between px-4 py-3 rounded-lg ${i === 0 ? "bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800" : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"}`}>
            <span className="font-medium text-slate-900 dark:text-white">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {p.nickname}</span>
            <span className="text-slate-600 dark:text-slate-300">{p.score}/{state.questionCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
