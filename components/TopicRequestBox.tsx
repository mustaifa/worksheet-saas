"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

type Props = { subject?: string; grade?: number; compact?: boolean };

// "Can't find the topic you need?" — sends a topic request to the site owner.
export default function TopicRequestBox({ subject = "", grade, compact = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(!compact);
  const [topic, setTopic] = useState("");
  const [subj, setSubj] = useState(subject);
  const [gr, setGr] = useState(grade ? String(grade) : "");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setState("sending");
    try {
      const res = await fetch("/api/topic-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject: subj, grade: gr, role, email, website, page: pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Something went wrong."); setState("idle"); return; }
      setState("sent");
    } catch {
      setError("Could not send right now. Please try again."); setState("idle");
    }
  }

  const field = "w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm";

  return (
    <div className="print:hidden rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5 sm:p-6">
      {state === "sent" ? (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">Thanks — request received!</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">We read every request and use them to decide which worksheets to add next.</p>
        </div>
      ) : !open ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-700 dark:text-slate-200"><span className="font-semibold">Can't find what you need?</span> Tell us which worksheet to make next.</p>
          <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900">Request a topic</button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="font-semibold text-slate-900 dark:text-white">Can't find the topic you need?</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Tell us and we'll consider it for the next worksheets we add.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <label className="sm:col-span-2 text-sm">
              <span className="block text-slate-700 dark:text-slate-300 mb-1">Topic you need *</span>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} required minLength={3} maxLength={300} placeholder="e.g. Grade 5 long division with remainders" className={field} />
            </label>
            <label className="text-sm">
              <span className="block text-slate-700 dark:text-slate-300 mb-1">Subject</span>
              <select value={subj} onChange={(e) => setSubj(e.target.value)} className={field}>
                <option value="">Choose…</option><option value="math">Math</option><option value="english">English</option><option value="science">Science</option><option value="other">Other</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-slate-700 dark:text-slate-300 mb-1">Grade</span>
              <select value={gr} onChange={(e) => setGr(e.target.value)} className={field}>
                <option value="">Choose…</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-slate-700 dark:text-slate-300 mb-1">I'm a…</span>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={field}>
                <option value="">Choose…</option><option value="teacher">Teacher</option><option value="parent">Parent</option><option value="tutor">Tutor</option><option value="student">Student</option><option value="other">Other</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-slate-700 dark:text-slate-300 mb-1">Email for a reply (optional, adults only)</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} placeholder="you@example.com" className={field} />
            </label>
            {/* honeypot — hidden from people, filled in by bots */}
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" name="website" />
          </div>
          {role === "student" && email && <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">Students: please leave the email blank — we don't need it.</p>}
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={state === "sending"} className="shrink-0 whitespace-nowrap bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50">
              {state === "sending" ? "Sending…" : "Send request"}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">Please don't include personal details in your request.</p>
          </div>
        </form>
      )}
    </div>
  );
}
