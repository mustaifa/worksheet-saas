"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type State = {
  status: "lobby" | "active" | "finished";
  currentIndex: number;
  questionCount: number;
  showAnswer: boolean;
  question: string | null;
  correctAnswer: string | null;
  participants: { id: string; nickname: string; score: number }[];
};

export default function PlayerView({ code }: { code: string }) {
  const router = useRouter();
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [lastAnsweredIndex, setLastAnsweredIndex] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`live-participant-${code}`);
    if (!stored) { router.push(`/play?code=${code}`); return; }
    setParticipantId(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (!participantId) return;
    poll();
    intervalRef.current = setInterval(poll, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId]);

  async function poll() {
    try {
      const res = await fetch(`/api/live/${code}/state`);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.error || "Session not found."); return; }
      setState(data);
      if (data.currentIndex !== lastAnsweredIndexRef.current) {
        setAnswered(false);
        setAnswer("");
      }
      setError("");
    } catch {
      setError("Could not reach the server.");
    }
  }

  // avoid stale-closure issues in the interval callback
  const lastAnsweredIndexRef = useRef(-1);
  useEffect(() => { lastAnsweredIndexRef.current = lastAnsweredIndex; }, [lastAnsweredIndex]);

  async function submitAnswer() {
    if (!participantId || !state || answered) return;
    setAnswered(true);
    setLastAnsweredIndex(state.currentIndex);
    await fetch(`/api/live/${code}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, questionIndex: state.currentIndex, answer }),
    });
    poll();
  }

  if (error) return <p className="text-sm text-red-600 text-center">{error}</p>;
  if (!state || !participantId) return <p className="text-slate-400 text-center">Loading…</p>;

  const me = state.participants.find((p) => p.id === participantId);

  if (state.status === "lobby") {
    return (
      <div className="max-w-sm mx-auto text-center">
        <div className="text-5xl mb-3">⏳</div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">You're in, {me?.nickname}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Waiting for the host to start…</p>
      </div>
    );
  }

  if (state.status === "active") {
    return (
      <div className="max-w-sm mx-auto text-center">
        <p className="text-xs text-slate-400 mb-2">Question {state.currentIndex + 1} of {state.questionCount} · Score: {me?.score ?? 0}</p>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{state.question}</p>
        </div>

        {state.showAnswer ? (
          <div className="text-emerald-600 font-medium">
            Correct answer: {state.correctAnswer}
            <p className="text-slate-400 text-sm mt-2">Waiting for the next question…</p>
          </div>
        ) : answered ? (
          <p className="text-slate-400">Answer submitted — waiting for others…</p>
        ) : (
          <div className="flex gap-2">
            <input
              value={answer} onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitAnswer(); }}
              placeholder="Your answer" autoFocus
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5"
            />
            <button onClick={submitAnswer} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 rounded-lg font-medium">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }

  // finished
  const ranked = [...state.participants].sort((a, b) => b.score - a.score);
  const myRank = ranked.findIndex((p) => p.id === participantId) + 1;
  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="text-5xl mb-3">{myRank === 1 ? "🏆" : "🎉"}</div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        {myRank === 1 ? "You won!" : `You finished #${myRank}`}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">Score: {me?.score}/{state.questionCount}</p>
      <div className="mt-6 space-y-2">
        {ranked.map((p, i) => (
          <div key={p.id} className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm ${p.id === participantId ? "bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 font-medium" : "bg-slate-50 dark:bg-slate-900"}`}>
            <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {p.nickname}</span>
            <span>{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
