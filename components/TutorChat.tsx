"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function TutorChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [grade, setGrade] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const newMessages: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, grade }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }

      if (!res.ok) {
        setError(data.error || `Something went wrong (status ${res.status}).`);
        setLoading(false);
        return;
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch {
      setError("Could not reach the tutor. Check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[70vh] border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold">Homework Tutor</p>
          <p className="text-xs text-slate-500">Share a specific problem you're stuck on.</p>
        </div>
        <select
          value={grade}
          onChange={(e) => setGrade(parseInt(e.target.value, 10))}
          className="text-sm border border-slate-300 rounded-lg px-2 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-8">
            Try: "I'm stuck on 3/4 + 1/2, can you help?" or "Explain what a metaphor is with an example."
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400">Tutor is thinking…</div>}
        <div ref={endRef} />
      </div>

      {error && <p className="text-xs text-red-600 px-4">{error}</p>}
      {remaining !== null && <p className="text-xs text-slate-400 px-4 pb-1">{remaining} messages left today</p>}

      <div className="border-t border-slate-200 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Ask about a specific problem…"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
