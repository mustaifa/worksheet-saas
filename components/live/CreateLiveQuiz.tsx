"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS, SubjectId, Difficulty, topicsForGrade, allGrades } from "@/lib/subjects";
import { FREE_TEXT_TOPICS } from "@/lib/challenge";

export default function CreateLiveQuiz() {
  const router = useRouter();
  const [subject, setSubject] = useState<SubjectId>("math");
  const [grade, setGrade] = useState(6);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableTopics = useMemo(
    () => topicsForGrade(subject, grade).filter((t) => !FREE_TEXT_TOPICS.has(t.id)),
    [subject, grade]
  );
  const currentTopic = topic && availableTopics.find((t) => t.id === topic) ? topic : availableTopics[0]?.id || "";

  async function createSession() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/live/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, grade, topic: currentTopic, difficulty }),
    });
    let data: any = {};
    try { data = await res.json(); } catch {}
    setLoading(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push(`/dashboard/live/${data.code}`);
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900">
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
        onClick={createSession} disabled={loading || !currentTopic}
        className="w-full bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create Live Quiz 🎮"}
      </button>
    </div>
  );
}
