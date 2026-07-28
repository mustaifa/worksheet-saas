"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  SUBJECTS, SubjectId, Difficulty, Question,
  topicsForGrade, topicLabel, generateWorksheet, parseCommand, allGrades,
} from "@/lib/subjects";

function newSeed() {
  return Math.floor(Math.random() * 2147483647);
}

const QUICK_START_PRESETS: { label: string; subject: SubjectId; grade: number; topic: string; icon: string }[] = [
  { label: "Grade 2 Addition", subject: "math", grade: 2, topic: "addsub", icon: "➕" },
  { label: "Grade 6 Fractions", subject: "math", grade: 6, topic: "fractions", icon: "🍰" },
  { label: "Grade 9 Algebra", subject: "math", grade: 9, topic: "algebra_basics", icon: "𝑥" },
  { label: "Grade 3 Spelling", subject: "english", grade: 3, topic: "spelling", icon: "✏️" },
  { label: "Grade 7 Vocabulary", subject: "english", grade: 7, topic: "vocabulary", icon: "📖" },
  { label: "Grade 2 Living vs Non-living", subject: "science", grade: 2, topic: "living_nonliving", icon: "🌱" },
  { label: "Grade 6 Human Body", subject: "science", grade: 6, topic: "human_body_systems", icon: "🫀" },
  { label: "Grade 11 Physics", subject: "science", grade: 11, topic: "physics_formulas", icon: "⚛️" },
];

export default function WorksheetGenerator() {
  const [subject, setSubject] = useState<SubjectId>("math");
  const [grade, setGrade] = useState(6);
  const [topic, setTopic] = useState("fractions");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [command, setCommand] = useState("");
  const [feedback, setFeedback] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const seedRef = useRef<number>(newSeed());
  const printRef = useRef<HTMLDivElement>(null);

  const availableTopics = useMemo(() => topicsForGrade(subject, grade), [subject, grade]);

  // Restore an exact shared worksheet if the URL carries wsg_* params (from the Share button)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const seedParam = p.get("wsg_seed");
    if (!seedParam) return;
    const s = (p.get("wsg_subject") as SubjectId) || "math";
    const g = parseInt(p.get("wsg_grade") || "", 10);
    const t = p.get("wsg_topic") || "";
    const d = (p.get("wsg_diff") as Difficulty) || "medium";
    const c = parseInt(p.get("wsg_count") || "", 10);
    const seed = parseInt(seedParam, 10);
    if (!t || isNaN(g) || isNaN(c) || isNaN(seed)) return;

    setSubject(s);
    setGrade(g);
    setTopic(t);
    setDifficulty(d);
    setCount(c);
    seedRef.current = seed;
    setQuestions(generateWorksheet({ subject: s, grade: g, topic: t, difficulty: d, count: c, seed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((m) => (m === msg ? "" : m)), 3500);
  }

  function pickFirstValidTopic(s: SubjectId, g: number, currentTopic: string) {
    const avail = topicsForGrade(s, g);
    return avail.find((t) => t.id === currentTopic) ? currentTopic : avail[0]?.id || "";
  }

  function handleSubjectChange(s: SubjectId) {
    setSubject(s);
    setTopic(pickFirstValidTopic(s, grade, topic));
    setQuestions([]);
  }

  function handleGradeChange(g: number) {
    setGrade(g);
    setTopic(pickFirstValidTopic(subject, g, topic));
  }

  function generate(overrides?: Partial<{ subject: SubjectId; grade: number; topic: string; difficulty: Difficulty; count: number }>) {
    const s = overrides?.subject ?? subject;
    const g = overrides?.grade ?? grade;
    const t = overrides?.topic ?? topic;
    const d = overrides?.difficulty ?? difficulty;
    const c = overrides?.count ?? count;
    seedRef.current = newSeed();
    setShowAnswers(false);
    setQuestions(generateWorksheet({ subject: s, grade: g, topic: t, difficulty: d, count: c, seed: seedRef.current }));
  }

  function handlePreset(preset: { subject: SubjectId; grade: number; topic: string }) {
    setSubject(preset.subject);
    setGrade(preset.grade);
    setTopic(preset.topic);
    generate({ subject: preset.subject, grade: preset.grade, topic: preset.topic });
  }

  function handleCommandGo() {
    if (!command.trim()) { setFeedback('Type a request first, e.g. "grade 5 science, 12 hard questions".'); return; }
    const parsed = parseCommand(command, { subject, grade, topic, difficulty, count });
    setSubject(parsed.subject);
    setGrade(parsed.grade);
    setTopic(parsed.topic);
    setDifficulty(parsed.difficulty);
    setCount(parsed.count);
    generate(parsed);
    setFeedback(`Understood: ${SUBJECTS.find((s) => s.id === parsed.subject)?.label} · Grade ${parsed.grade} · ${topicLabel(parsed.subject, parsed.topic)} · ${parsed.difficulty} · ${parsed.count} questions.`);
  }

  function handlePrint() {
    try { window.print(); }
    catch { toast("Printing was blocked by this window. Try Ctrl+P / Cmd+P directly."); }
  }

  async function handleDownload() {
    if (!printRef.current) return;
    toast("Preparing PDF…");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210;
      const imgW = pageW - 20;
      const imgH = (canvas.height * imgW) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, imgW, Math.min(imgH, 297 - 20));
      pdf.save(`${subject}-${topic}-grade${grade}-worksheet.pdf`);
      toast("Downloaded.");
    } catch {
      toast("Could not generate the PDF — try Print instead.");
    }
  }

  function buildShareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("wsg_subject", subject);
    url.searchParams.set("wsg_grade", String(grade));
    url.searchParams.set("wsg_topic", topic);
    url.searchParams.set("wsg_diff", difficulty);
    url.searchParams.set("wsg_count", String(count));
    url.searchParams.set("wsg_seed", String(seedRef.current));
    return url.toString();
  }

  async function handleShare() {
    const url = buildShareUrl();
    const shareData = { title: `${topicLabel(subject, topic)} — Grade ${grade} ${SUBJECTS.find((s) => s.id === subject)?.label}`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch { /* fall through */ }
    }
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(url); toast("Link copied — this exact worksheet will load for whoever opens it."); return; }
      catch { /* fall through */ }
    }
    window.prompt("Copy this link to share the exact same worksheet:", url);
  }

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
      {/* ---------- Controls ---------- */}
      <aside className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Subject</p>
          <div className="flex gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSubjectChange(s.id)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                  subject === s.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
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
                key={g}
                onClick={() => handleGradeChange(g)}
                className={`aspect-square rounded-md text-sm font-semibold border ${
                  grade === g ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Topic</p>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {availableTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`text-xs rounded-lg border px-2 py-2 text-left ${
                  topic === t.id ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 font-medium dark:text-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
            {availableTopics.length === 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 col-span-2">No topics yet for this grade — try another.</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Difficulty</p>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  difficulty === d ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Questions</p>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  count === n ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => generate()}
          disabled={!topic}
          className="w-full bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          ✎ Generate Worksheet
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Or describe what you need</p>
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='e.g. "grade 9 algebra, 15 hard questions" or "grade 3 science, 10 questions"'
            className="w-full text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg p-2 min-h-[56px]"
          />
          <button
            onClick={handleCommandGo}
            className="w-full mt-2 border border-dashed border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-400 text-xs font-semibold py-2 rounded-lg hover:bg-amber-50"
          >
            ⌨ Generate from request
          </button>
          {feedback && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{feedback}</p>}
        </div>
      </aside>

      {/* ---------- Worksheet ---------- */}
      <div className="flex justify-center">
        {questions.length === 0 ? (
          <div className="w-full max-w-2xl py-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ready when you are</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Pick a subject and grade on the left, or jump straight into one of these:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_START_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center hover:border-slate-900 dark:hover:border-white hover:shadow-md transition-all"
                >
                  <span className="text-2xl">{preset.icon}</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white">64+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">topics across Math, English & Science</p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white">Grades 1–12</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">every worksheet matched to grade level</p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">verified answers — never AI-guessed</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl">
            <div id="worksheet-print-area" ref={printRef} className="bg-white text-slate-900 rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-2">
                <h2 className="text-2xl font-bold">{topicLabel(subject, topic)}</h2>
                <div className="text-right text-xs text-slate-500 uppercase tracking-wide">
                  Grade {grade} · {SUBJECTS.find((s) => s.id === subject)?.label}<br />{difficulty} · {questions.length} questions
                </div>
              </div>
              <div className="flex gap-6 text-sm text-slate-500 my-4">
                <span className="border-b border-slate-400 pb-0.5">Name: ______________</span>
                <span className="border-b border-slate-400 pb-0.5">Date: {today}</span>
              </div>
              <ul>
                {questions.map((item, i) => (
                  <li key={i} className="flex gap-3 py-3 border-b border-dotted border-slate-200 last:border-0">
                    <span className="text-slate-400 font-mono text-sm w-6">{i + 1}.</span>
                    <span>
                      {item.q}
                      {showAnswers ? (
                        <span className="text-red-600 font-semibold ml-2">{item.a}</span>
                      ) : (
                        <span className="inline-block min-w-[90px] border-b border-slate-400 ml-2">&nbsp;</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setShowAnswers(!showAnswers)} className="border border-slate-900 dark:border-white text-sm text-slate-900 dark:text-white px-4 py-2 rounded-lg">
                {showAnswers ? "Hide key" : "Show key"}
              </button>
              <button onClick={handlePrint} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm px-4 py-2 rounded-lg">Print (A4)</button>
              <button onClick={handleDownload} className="border border-slate-900 dark:border-white text-sm text-slate-900 dark:text-white px-4 py-2 rounded-lg">Download PDF</button>
              <button onClick={handleShare} className="border border-slate-900 dark:border-white text-sm text-slate-900 dark:text-white px-4 py-2 rounded-lg">Share</button>
              <button onClick={() => generate()} className="border border-slate-900 dark:border-white text-sm text-slate-900 dark:text-white px-4 py-2 rounded-lg">New set</button>
            </div>
            {toastMsg && <p className="text-xs text-red-600 mt-2">{toastMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
