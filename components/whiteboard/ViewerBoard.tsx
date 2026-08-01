"use client";
import { useState, useEffect, useRef } from "react";

export default function ViewerBoard({ code }: { code: string }) {
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function poll() {
    try {
      const res = await fetch(`/api/whiteboard/${code}/state`);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.error || "Board not found."); return; }
      setSnapshot(data.snapshot);
      setTitle(data.title);
      setViewerCount((data.viewers || []).length);
      setError("");
    } catch {
      setError("Could not reach the server.");
    }
  }

  if (error) return <p className="text-sm text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-slate-900 dark:text-white">{title || "Live Whiteboard"}</p>
        <p className="text-xs text-slate-400">{viewerCount} watching</p>
      </div>
      <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white">
        {snapshot ? (
          <img src={snapshot} alt="Whiteboard" className="w-full h-auto" />
        ) : (
          <div className="aspect-video flex items-center justify-center text-slate-400 text-sm">
            Waiting for the teacher to start drawing…
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center">Updates automatically every couple of seconds.</p>
    </div>
  );
}
