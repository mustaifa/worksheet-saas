import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import type { WorksheetLayout, LaidOutQuestion, Section } from "@/lib/worksheetLayout";
import { splitBlanks } from "@/lib/worksheetLayout";
import { subjectDoodle, topicDoodle, selfCheckFaces, type Visual, type Shape } from "@/lib/worksheetVisuals";

const TINT: Record<string, { band: string; badge: string; soft: string; ring: string }> = {
  math: { band: "bg-sky-50 border-sky-200", badge: "bg-sky-600", soft: "bg-sky-50", ring: "border-sky-300" },
  english: { band: "bg-rose-50 border-rose-200", badge: "bg-rose-600", soft: "bg-rose-50", ring: "border-rose-300" },
  science: { band: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-600", soft: "bg-emerald-50", ring: "border-emerald-300" },
};

function ShapeEl({ s }: { s: Shape }) {
  switch (s.k) {
    case "rect":
      return <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} fill={s.fill || "none"} stroke={s.stroke} strokeWidth={s.sw} strokeDasharray={s.dash ? "4 3" : undefined} />;
    case "circle":
      return <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.fill || "none"} stroke={s.stroke} strokeWidth={s.sw} />;
    case "line":
      return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.stroke} strokeWidth={s.sw} strokeLinecap="round" strokeDasharray={s.dash ? "4 3" : undefined} />;
    case "poly": {
      const pts = s.pts.map((p) => p.join(",")).join(" ");
      return s.closed
        ? <polygon points={pts} fill={s.fill || "none"} stroke={s.stroke} strokeWidth={s.sw} strokeLinejoin="round" strokeDasharray={s.dash ? "4 3" : undefined} />
        : <polyline points={pts} fill="none" stroke={s.stroke} strokeWidth={s.sw} strokeLinecap="round" strokeLinejoin="round" />;
    }
    case "text":
      return <text x={s.x} y={s.y} fontSize={s.size || 12} fontWeight={s.bold ? 700 : 400} textAnchor={s.anchor || "start"} fill={s.fill || "#1e293b"} fontFamily="ui-sans-serif, system-ui, sans-serif">{s.t}</text>;
  }
}

export function VisualSvg({ v, scale = 1, className = "" }: { v: Visual; scale?: number; className?: string }) {
  return (
    <svg viewBox={`0 0 ${v.w} ${v.h}`} width={v.w * scale} height={v.h * scale} role={v.alt ? "img" : undefined} aria-label={v.alt || undefined} aria-hidden={v.alt ? undefined : true} className={`max-w-full h-auto ${className}`}>
      {v.shapes.map((s, i) => <ShapeEl key={i} s={s} />)}
    </svg>
  );
}

function Blank({ fill, large }: { fill?: string; large: boolean }) {
  return (
    <span className={`inline-block align-baseline border-b-2 border-slate-500 mx-1 text-center ${large ? "min-w-[4.5rem]" : "min-w-[3.75rem]"} ${fill ? "text-red-600 font-semibold" : ""}`}>
      {fill || " "}
    </span>
  );
}

/** Underlines the first whole-word match of `em` in `text`. */
function Emph({ text, em }: { text: string; em?: string }) {
  if (!em) return <>{text}</>;
  const esc = em.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`(^|[^A-Za-z])(${esc})(?![A-Za-z])`, "i").exec(text);
  if (!m) return <>{text} <span className="text-slate-500">({em})</span></>;
  const i = m.index + m[1].length;
  return <>{text.slice(0, i)}<span className="underline decoration-2 underline-offset-4 font-semibold">{text.slice(i, i + m[2].length)}</span>{text.slice(i + m[2].length)}</>;
}

function QuestionText({ q, show, large }: { q: LaidOutQuestion; show: boolean; large: boolean }) {
  const parts = splitBlanks(q.text);
  if (parts.length === 1) return <Emph text={q.text} em={q.em} />;
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>{p}{i < parts.length - 1 && <Blank large={large} fill={show && i === 0 ? q.answer : undefined} />}</span>
      ))}
    </>
  );
}

function AnswerArea({ q, show, large, wide }: { q: LaidOutQuestion; show: boolean; large: boolean; wide: boolean }) {
  const red = "text-red-600 font-semibold";
  if (q.mode === "choice" && q.choices) {
    const correct = q.correct;
    return (
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
        {q.choices.map((c) => {
          const on = show && c === correct;
          return (
            <span key={c} className={`inline-flex items-center gap-1.5 ${on ? red : ""}`}>
              <span className={`inline-block rounded-full border-2 ${on ? "border-red-600 bg-red-600" : "border-slate-500"} ${large ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
              {c}
            </span>
          );
        })}
      </div>
    );
  }
  if (q.mode === "blank") {
    return q.choices ? (
      <p className="mt-1.5 text-sm text-slate-600">
        <span className="font-semibold">Choose:</span> {q.choices.join("  ·  ")}
      </p>
    ) : null;
  }
  if (q.mode === "box") {
    const work = wide && q.text.length > 70;
    return (
      <div className={`mt-2 flex ${work ? "items-stretch gap-3" : "justify-end"}`}>
        {work && <div className="flex-1 rounded-md border border-dashed border-slate-300 min-h-[3.5rem] px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">Show your work</div>}
        <div className="flex items-center gap-2 self-end">
          <span className="text-xs font-semibold text-slate-500">Answer</span>
          <span className={`inline-flex items-center justify-center rounded-md border-2 border-slate-400 px-2 ${large ? "min-w-[7rem] h-11 text-lg" : "min-w-[6.5rem] h-9"} ${show ? red : ""}`}>{show ? q.answer : ""}</span>
        </div>
      </div>
    );
  }
  // lines
  return (
    <div className="mt-1">
      {Array.from({ length: Math.max(1, q.lines) }).map((_, i) => (
        <div key={i} className={`border-b border-slate-400 ${large ? "h-9" : "h-7"} flex items-end pb-0.5 ${show && i === 0 ? red : ""}`}>{show && i === 0 ? q.answer : ""}</div>
      ))}
    </div>
  );
}

type Tint = (typeof TINT)[string];

function WordBank({ words, t, large, title = "Word bank" }: { words: string[]; t: Tint; large: boolean; title?: string }) {
  return (
    <div className={`mt-3 rounded-lg border-2 ${t.ring} ${t.soft} px-4 pt-2 pb-3 break-inside-avoid`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center">
        {words.map((w) => <span key={w} className={`font-medium ${large ? "text-lg" : ""}`}>{w}</span>)}
      </div>
    </div>
  );
}

function Badge({ n, t, large }: { n: number; t: Tint; large: boolean }) {
  return <span className={`shrink-0 ${t.badge} text-white font-bold rounded-full flex items-center justify-center ${large ? "w-8 h-8 text-base" : "w-6 h-6 text-xs"}`}>{n}</span>;
}

function QuestionItem({ q, layout, t, show, compact, wide = true }: { q: LaidOutQuestion; layout: WorksheetLayout; t: Tint; show: boolean; compact?: boolean; wide?: boolean }) {
  const L = layout.large;
  if (compact) {
    return (
      <li className="py-2.5 break-inside-avoid flex items-end gap-3">
        <Badge n={q.n} t={t} large={L} />
        <span className={`shrink-0 ${L ? "text-xl" : ""}`}><QuestionText q={q} show={show} large={L} /></span>
        {q.mode === "lines" && <span className={`flex-1 border-b border-slate-400 min-w-[5rem] ${L ? "h-8" : "h-6"} ${show ? "text-red-600 font-semibold" : ""}`}>{show ? q.answer : ""}</span>}
      </li>
    );
  }
  return (
    <li className="py-3 border-b border-dotted border-slate-200 break-inside-avoid">
      <div className="flex gap-3">
        <Badge n={q.n} t={t} large={L} />
        {q.icon && <VisualSvg v={q.icon} scale={L ? 1.1 : 0.9} className="order-last shrink-0 self-start" />}
        <div className="flex-1 min-w-0">
          {q.boxed ? (
            <p className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 italic leading-relaxed">{q.text}</p>
          ) : (
            <p className={`${L ? "text-xl leading-relaxed" : "leading-relaxed"}`}><QuestionText q={q} show={show} large={L} /></p>
          )}
          {q.visual && q.mode === "box" ? (
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <VisualSvg v={q.visual} scale={L ? 1.15 : 1} />
              <AnswerArea q={q} show={show} large={L} wide={false} />
            </div>
          ) : (
            <>
              {q.visual && <div className="mt-2"><VisualSvg v={q.visual} scale={L ? 1.15 : 1} /></div>}
              <AnswerArea q={q} show={show} large={L} wide={wide} />
            </>
          )}
        </div>
      </div>
    </li>
  );
}

function SectionBlock({ sec, layout, t, show }: { sec: Section; layout: WorksheetLayout; t: Tint; show: boolean }) {
  const L = layout.large;
  const qs = sec.nums.map((n) => layout.questions[n - 1]);
  const red = "text-red-600 font-semibold";
  return (
    <section className="mt-6">
      {(sec.part || sec.heading) && (
        <div className={`flex items-center gap-3 border-b-2 ${t.ring} pb-1.5 break-after-avoid`}>
          {sec.part && <span className={`${t.badge} text-white text-xs font-bold uppercase tracking-wide rounded-md px-2 py-1 shrink-0`}>{sec.part}</span>}
          {sec.heading && <p className={`font-semibold ${L ? "text-lg" : ""}`}>{sec.heading}</p>}
        </div>
      )}
      {sec.bank && sec.kind !== "label" && <WordBank words={sec.bank} t={t} large={L} />}

      {sec.kind === "label" && sec.diagram && (
        <div className="mt-3 break-inside-avoid">
          {sec.bank && <WordBank words={sec.bank} t={t} large={L} />}
          <div className="mt-3 flex justify-center"><VisualSvg v={sec.diagram} scale={1.15} /></div>
          <ol className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
            {qs.map((q) => (
              <li key={q.n} className="flex items-end gap-2">
                <Badge n={q.n} t={t} large={L} />
                <span className={`flex-1 border-b border-slate-400 ${L ? "h-8" : "h-6"} ${show ? red : ""}`}>{show ? q.answer : ""}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {sec.kind === "match" && sec.options && (
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-6 break-inside-avoid">
          <ol className="space-y-2.5">
            {qs.map((q) => (
              <li key={q.n} className="flex items-start gap-3">
                <Badge n={q.n} t={t} large={L} />
                <span className={`flex-1 ${L ? "text-lg" : ""}`}>{q.text}</span>
                <span className={`shrink-0 inline-flex items-center justify-center w-9 h-8 rounded-md border-2 border-slate-400 ${show ? red : ""}`}>{show ? q.letter : ""}</span>
              </li>
            ))}
          </ol>
          <ul className="space-y-2.5 min-w-[9rem]">
            {sec.options.map((o) => (
              <li key={o.letter} className={`flex items-center gap-2 rounded-lg border ${t.ring} ${t.soft} px-3 py-1`}>
                <span className="font-bold text-slate-500">{o.letter}</span><span className={`font-medium ${L ? "text-lg" : ""}`}>{o.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sec.kind === "tick" && sec.tickCols && (
        <table className="mt-3 w-full border-collapse break-inside-avoid">
          <thead>
            <tr>
              <th />
              {sec.tickCols.map((c) => <th key={c} className={`text-xs font-bold uppercase tracking-wide text-slate-600 px-2 pb-1 ${L ? "text-sm" : ""}`}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {qs.map((q) => (
              <tr key={q.n} className="border-t border-slate-200">
                <td className="py-2.5 pr-3">
                  <div className="flex gap-3 items-center"><Badge n={q.n} t={t} large={L} />{q.icon && <VisualSvg v={q.icon} scale={L ? 0.9 : 0.75} className="shrink-0" />}<span className={L ? "text-lg" : ""}><Emph text={q.text} em={q.em} /></span></div>
                </td>
                {sec.tickCols!.map((c) => {
                  const on = show && c === q.correct;
                  return (
                    <td key={c} className="text-center px-2 w-16">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded border-2 ${on ? "border-red-600 text-red-600" : "border-slate-400"}`}>{on ? "✓" : ""}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {sec.kind === "list" && (
        <ol className={`mt-2 grid gap-x-6 ${sec.compact ? "grid-cols-2" : sec.columns === 2 ? "sm:grid-cols-2 print:grid-cols-2" : "grid-cols-1"}`}>
          {qs.map((q) => <QuestionItem key={q.n} q={q} layout={layout} t={t} show={show} compact={sec.compact} wide={sec.columns !== 2} />)}
        </ol>
      )}
    </section>
  );
}

export default function WorksheetSheet({
  layout, showAnswers = false, footerText, children, className = "", id = "worksheet-print-area",
}: {
  layout: WorksheetLayout;
  showAnswers?: boolean;
  footerText?: string;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  const t = TINT[layout.subject] || TINT.math;
  const L = layout.large;
  const total = layout.questions.length;

  return (
    <div id={id} className={`worksheet-sheet bg-white text-slate-900 rounded-lg shadow-lg border border-slate-200 p-6 sm:p-8 ${className}`}>
      {/* brand row */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700"><img src={BRAND.logoPath} alt="" width={16} height={16} className="rounded" />{BRAND.name}</span>
        <span>{BRAND.domain}</span>
      </div>

      {/* title band */}
      <div className={`flex items-center gap-4 rounded-xl border ${t.band} px-4 py-3`}>
        <VisualSvg v={topicDoodle(layout.subject, layout.topic || "")} className="shrink-0 hidden sm:block print:block" />
        <div className="flex-1 min-w-0">
          <h2 className={`font-extrabold leading-tight ${L ? "text-3xl" : "text-2xl"}`}>{layout.title}</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-1">Grade {layout.grade} · {layout.subjectLabel}</p>
        </div>
        <div className="shrink-0 text-center rounded-full border-2 border-slate-400 bg-white w-[4.5rem] h-[4.5rem] flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Score</span>
          <span className="text-sm font-bold text-slate-700 leading-none mt-1">___ / {total}</span>
        </div>
      </div>

      {/* name row */}
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 text-sm text-slate-600 mt-4">
        <p className="flex items-end gap-2">Name<span className="flex-1 border-b border-slate-400 h-5" /></p>
        <p className="flex items-end gap-2">Class<span className="flex-1 border-b border-slate-400 h-5" /></p>
        <p className="flex items-end gap-2">Date<span className="flex-1 border-b border-slate-400 h-5" /></p>
      </div>

      {/* goal + directions */}
      <div className="mt-4 space-y-2">
        {layout.goal && (
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Learning goal:</span> {layout.goal}
          </p>
        )}
        <div className="flex gap-3 items-start rounded-lg border-2 border-dashed border-slate-300 px-3 py-2">
          <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" className="shrink-0 mt-0.5"><path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" /><path d="M14 7l3 3" stroke="#1e293b" strokeWidth="1.5" /></svg>
          <p className={`${L ? "text-base" : "text-sm"}`}><span className="font-bold">Directions: </span>{layout.directions}</p>
        </div>
      </div>

      {/* worked example */}
      {layout.example && (
        <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 flex gap-3 items-start break-inside-avoid">
          <span className="shrink-0 rounded-full bg-amber-400 text-amber-950 text-xs font-bold uppercase tracking-wide px-2.5 py-1">Example</span>
          <div className={`flex-1 ${L ? "text-lg" : ""}`}>
            <p>{layout.example.text}</p>
            <p className="mt-1 text-slate-700">Answer: <span className="font-hand text-blue-700 text-lg">{layout.example.answer}</span></p>
          </div>
        </div>
      )}

      {/* "Remember" reference chart */}
      {layout.anchor && (
        <div className={`mt-4 rounded-xl border-2 ${t.ring} px-4 pt-2 pb-3 break-inside-avoid`}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2"><span className={`${t.badge} text-white rounded px-1.5 py-0.5 mr-2`}>Remember</span>{layout.anchor.title}</p>
          <div className="flex justify-center"><VisualSvg v={layout.anchor.visual} /></div>
        </div>
      )}

      {/* word bank (single-part worksheets) */}
      {layout.wordBank && <WordBank words={layout.wordBank} t={t} large={L} />}

      {/* passage */}
      {layout.passage && (
        <div className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-4">
          {layout.passage.title && <p className="font-bold mb-2">{layout.passage.title}</p>}
          <p className="text-sm leading-relaxed whitespace-pre-line">{layout.passage.text}</p>
        </div>
      )}

      {/* parts */}
      {layout.sections.map((sec, si) => (
        <SectionBlock key={si} sec={sec} layout={layout} t={t} show={showAnswers} />
      ))}

      {/* self-check + teacher box */}
      <div className="mt-6 grid sm:grid-cols-[auto_1fr] print:grid-cols-[auto_1fr] gap-4 items-stretch">
        <div className="rounded-lg border border-slate-300 px-4 py-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">How did I do?</p>
          <VisualSvg v={selfCheckFaces()} />
        </div>
        <div className="rounded-lg border border-slate-300 px-4 py-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Teacher&apos;s comments</p>
        </div>
      </div>

      <p className="mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-400">{footerText || `${BRAND.tagline} · ${BRAND.domain}`}</p>
      {children}
    </div>
  );
}
