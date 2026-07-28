"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SUBJECTS, SubjectId, Difficulty, topicsForGrade, topicLabel, allGrades } from "@/lib/subjects";

type Stage = "setup" | "playing" | "result";
type Question = { q: string };
type Result = { score: number; total: number; passed: boolean; prize: string | null; results: { q: string; correctAnswer: string; submitted: string; correct: boolean }[] };

export default function ChallengeRunner({ childId, childName, childAvatar, defaultGrade }: { childId: string; childName: string; childAvatar: string; defaultGrade: number }) {
  const [stage, setStage] = useState<Stage>("setup");
  const [subject, setSubject] = useState<SubjectId>("math");
  const [grade, setGrade] = useState(defaultGrade);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const availableTopics = useMemo(() => topicsForGrade(subject, grade), [subject, grade]);
  const currentTopic = topic && availableTopics.find((t) => t.id === topic) ? topic : availableTopics[0]?.id || "";

  async function startChallenge() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/challenge/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, subject, grade, topic: currentTopic, difficulty }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    setAttemptId(data.attemptId);
    setQuestions(data.questions);
    setAnswers(new Array(data.questions.length).fill(""));
    setStage("playing");
  }

  async function submitChallenge() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/challenge/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, answers }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    setResult(data);
    setStage("result");
  }

  function playAgain() {
    setStage("setup");
    setAttemptId(null);
    setQuestions([]);
    setAnswers([]);
    setResult(null);
  }

  if (stage === "setup") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <span className="text-4xl">{childAvatar}</span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{childName}'s Challenge</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pick what to practice today.</p>
        </div>

        <div className="space-y-5 border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Subject</p>
            <div className="flex gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id} onClick={() => { setSubject(s.id); setTopic(""); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${subject === s.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Grade</p>
            <div className="grid grid-cols-6 gap-1.5">
              {allGrades().map((g) => (
                <button
                  key={g} onClick={() => { setGrade(g); setTopic(""); }}
                  className={`aspect-square rounded-md text-sm font-semibold border ${grade === g ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Topic</p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {availableTopics.map((t) => (
                <button
                  key={t.id} onClick={() => setTopic(t.id)}
                  className={`text-xs rounded-lg border px-2 py-2 text-left ${currentTopic === t.id ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Difficulty</p>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${difficulty === d ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
                >
                  {d[0].toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={startChallenge} disabled={loading || !currentTopic}
            className="w-full bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
          >
            {loading ? "Getting ready…" : "Start Challenge 🎯"}
          </button>
        </div>
      </div>
    );
  }

  if (stage === "playing") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-slate-900 dark:text-white">{childAvatar} {childName}'s Challenge</p>
          <p className="text-xs text-slate-400">{answers.filter((a) => a.trim()).length}/{questions.length} answered</p>
        </div>
        <div className="space-y-3 border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900">
          {questions.map((q, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-400 font-mono text-sm w-6">{i + 1}.</span>
              <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">{q.q}</span>
              <input
                value={answers[i]}
                onChange={(e) => { const next = [...answers]; next[i] = e.target.value; setAnswers(next); }}
                className="w-28 border border-slate-300 rounded-lg px-2 py-1 text-sm"
                placeholder="answer"
              />
            </div>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={submitChallenge} disabled={loading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3 rounded-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Submit Answers"}
          </button>
        </div>
      </div>
    );
  }

  // stage === "result"
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="text-6xl mb-3">{result?.passed ? "🎉" : "💪"}</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {result?.passed ? `Great job, ${childName}!` : `Good try, ${childName}!`}
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
        You got <strong>{result?.score}</strong> out of <strong>{result?.total}</strong> correct.
      </p>

      {result?.passed && result.prize && (
        <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 p-6">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">You won a prize!</p>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-1">🏆 {result.prize}</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">Show this screen to a parent to claim it.</p>
        </div>
      )}
      {result?.passed && !result.prize && (
        <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">You passed! Ask a parent to add some rewards so next time you can win a prize too.</p>
        </div>
      )}
      {!result?.passed && (
        <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">Almost there — try again to earn a reward!</p>
        </div>
      )}

      <div className="mt-6 text-left border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-h-64 overflow-y-auto">
        {result?.results.map((r, i) => (
          <div key={i} className={`flex justify-between gap-2 text-sm py-1.5 ${i > 0 ? "border-t border-dotted border-slate-100 dark:border-slate-800" : ""}`}>
            <span className="text-slate-600 dark:text-slate-300">{r.q}</span>
            <span className={r.correct ? "text-emerald-600" : "text-red-500"}>
              {r.correct ? "✓" : `✗ (${r.correctAnswer})`}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={playAgain} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-medium">
          New Challenge
        </button>
        <Link href={`/dashboard/family/${childId}`} className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-medium text-center">
          Back to profile
        </Link>
      </div>
    </div>
  );
}
