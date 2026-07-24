"use client";
import { useState, useMemo, useRef } from "react";
import { TOPICS, topicsForGrade, generateWorksheet, Difficulty, Question } from "@/lib/generators";

function newSeed() {
  return Math.floor(Math.random() * 2147483647);
}

function parseCommand(text: string, current: { grade: number; topic: string; difficulty: Difficulty; count: number }) {
  const t = text.toLowerCase();

  let grade: number | null = null;
  const gm = t.match(/grade\s*(\d{1,2})/) || t.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s*grade\b/);
  if (gm) grade = Math.max(1, Math.min(8, parseInt(gm[1], 10)));

  let difficulty: Difficulty | null = null;
  if (/\b(easy|simple|basic)\b/.test(t)) difficulty = "easy";
  else if (/\b(hard|difficult|advanced|challenging)\b/.test(t)) difficulty = "hard";
  else if (/\b(medium|moderate|normal)\b/.test(t)) difficulty = "medium";

  let count: number | null = null;
  const cm = t.match(/(\d{1,2})\s*(questions|problems|q\b)/);
  if (cm) count = Math.max(3, Math.min(30, parseInt(cm[1], 10)));

  const aliasMap: Record<string, string[]> = {
    addsub: ["addition", "subtraction", "add and subtract"],
    counting: ["counting", "number sequence", "skip counting"],
    comparing: ["comparing numbers", "compare numbers", "greater than", "less than"],
    shapes: ["shapes", "sides and corners", "vertices"],
    placevalue: ["place value", "rounding"],
    multdiv: ["multiplication", "division", "times table", "multiply", "divide"],
    fractions_intro: ["intro fraction", "simple fraction", "basic fraction"],
    decimals_intro: ["intro decimal", "simple decimal", "basic decimal"],
    wordproblems: ["word problem"],
    fractions: ["fraction"],
    decimals: ["decimal"],
    geometry: ["geometry", "area", "perimeter", "volume"],
    stats: ["statistic", "mean", "median", "mode", "range of data"],
    order: ["order of operations", "pemdas", "bodmas"],
    ratios: ["ratio", "unit rate"],
    percent: ["percent", "percentage"],
    integers: ["integer", "negative number"],
    expressions: ["expression", "algebra", "one-step equation"],
    proportions: ["proportion"],
    linear: ["linear equation", "two-step equation"],
    exponents: ["exponent", "power of", "squared number", "cubed number"],
  };

  let topicId: string | null = null;
  for (const top of TOPICS) {
    const aliases = aliasMap[top.id] || [];
    if (aliases.some((alias) => t.includes(alias))) { topicId = top.id; break; }
  }

  if (topicId && grade) {
    const top = TOPICS.find((x) => x.id === topicId)!;
    if (!top.grades.includes(grade)) {
      grade = top.grades.reduce((best, g) => (Math.abs(g - grade!) < Math.abs(best - grade!) ? g : best), top.grades[0]);
    }
  } else if (topicId && !grade) {
    const top = TOPICS.find((x) => x.id === topicId)!;
    grade = top.grades.includes(current.grade) ? current.grade : top.grades[0];
  } else if (!topicId && grade) {
    const available = topicsForGrade(grade);
    topicId = available.find((x) => x.id === current.topic) ? current.topic : available[0].id;
  }

  return {
    grade: grade ?? current.grade,
    topic: topicId ?? current.topic,
    difficulty: difficulty ?? current.difficulty,
    count: count ?? current.count,
  };
}

export default function WorksheetGenerator() {
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

  const availableTopics = useMemo(() => topicsForGrade(grade), [grade]);
  const topicLabel = (id: string) => TOPICS.find((t) => t.id === id)?.label || id;

  function toast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((m) => (m === msg ? "" : m)), 3500);
  }

  function handleGradeChange(g: number) {
    setGrade(g);
    const avail = topicsForGrade(g);
    if (!avail.find((t) => t.id === topic)) setTopic(avail[0].id);
  }

  function generate(overrides?: Partial<{ grade: number; topic: string; difficulty: Difficulty; count: number }>) {
    const g = overrides?.grade ?? grade;
    const t = overrides?.topic ?? topic;
    const d = overrides?.difficulty ?? difficulty;
    const c = overrides?.count ?? count;
    seedRef.current = newSeed();
    setShowAnswers(false);
    setQuestions(generateWorksheet({ grade: g, topic: t, difficulty: d, count: c, seed: seedRef.current }));
  }

  function handleCommandGo() {
    if (!command.trim()) { setFeedback('Type a request first, e.g. "grade 5 percentages, 12 hard questions".'); return; }
    const parsed = parseCommand(command, { grade, topic, difficulty, count });
    setGrade(parsed.grade);
    setTopic(parsed.topic);
    setDifficulty(parsed.difficulty);
    setCount(parsed.count);
    generate(parsed);
    setFeedback(`Understood: Grade ${parsed.grade} · ${topicLabel(parsed.topic)} · ${parsed.difficulty} · ${parsed.count} questions.`);
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
      pdf.save(`${topic}-grade${grade}-worksheet.pdf`);
      toast("Downloaded.");
    } catch {
      toast("Could not generate the PDF — try Print instead.");
    }
  }

  function buildShareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("wsg_grade", String(grade));
    url.searchParams.set("wsg_topic", topic);
    url.searchParams.set("wsg_diff", difficulty);
    url.searchParams.set("wsg_count", String(count));
    url.searchParams.set("wsg_seed", String(seedRef.current));
    return url.toString();
  }

  async function handleShare() {
    const url = buildShareUrl();
    const shareData = { title: `${topicLabel(topic)} — Grade ${grade} Math`, url };
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Grade</p>
          <div className="grid grid-cols-8 lg:grid-cols-4 gap-1.5">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((g) => (
              <button
                key={g}
                onClick={() => handleGradeChange(g)}
                className={`aspect-square rounded-md text-sm font-semibold border ${
                  grade === g ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Topic</p>
          <div className="grid grid-cols-2 gap-2">
            {availableTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`text-xs rounded-lg border px-2 py-2 text-left ${
                  topic === t.id ? "border-slate-900 bg-slate-100 font-medium" : "border-slate-300 text-slate-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Difficulty</p>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  difficulty === d ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"
                }`}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Questions</p>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  count === n ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => generate()}
          className="w-full bg-amber-400 text-amber-950 font-semibold py-3 rounded-lg hover:bg-amber-300"
        >
          ✎ Generate Worksheet
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Or describe what you need</p>
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='e.g. "grade 4 fractions, 15 hard questions"'
            className="w-full text-sm border border-slate-300 rounded-lg p-2 min-h-[56px]"
          />
          <button
            onClick={handleCommandGo}
            className="w-full mt-2 border border-dashed border-amber-500 text-amber-700 text-xs font-semibold py-2 rounded-lg hover:bg-amber-50"
          >
            ⌨ Generate from request
          </button>
          {feedback && <p className="text-xs text-slate-500 mt-2">{feedback}</p>}
        </div>
      </aside>

      {/* ---------- Worksheet ---------- */}
      <div className="flex justify-center">
        {questions.length === 0 ? (
          <div className="text-center text-slate-400 py-24">Pick a grade and topic, then generate a worksheet.</div>
        ) : (
          <div className="w-full max-w-xl">
            <div id="worksheet-print-area" ref={printRef} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-2">
                <h2 className="text-2xl font-bold">{topicLabel(topic)}</h2>
                <div className="text-right text-xs text-slate-500 uppercase tracking-wide">
                  Grade {grade} · Math<br />{difficulty} · {questions.length} questions
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
              <button onClick={() => setShowAnswers(!showAnswers)} className="border border-slate-900 text-sm px-4 py-2 rounded-lg">
                {showAnswers ? "Hide key" : "Show key"}
              </button>
              <button onClick={handlePrint} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg">Print (A4)</button>
              <button onClick={handleDownload} className="border border-slate-900 text-sm px-4 py-2 rounded-lg">Download PDF</button>
              <button onClick={handleShare} className="border border-slate-900 text-sm px-4 py-2 rounded-lg">Share</button>
              <button onClick={() => generate()} className="border border-slate-900 text-sm px-4 py-2 rounded-lg">New set</button>
            </div>
            {toastMsg && <p className="text-xs text-red-600 mt-2">{toastMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
