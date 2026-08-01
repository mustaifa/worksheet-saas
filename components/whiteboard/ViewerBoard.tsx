"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DrawingSurface from "./DrawingSurface";

export default function ViewerBoard({ code }: { code: string }) {
  const router = useRouter();
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [hasPen, setHasPen] = useState(false);
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`whiteboard-viewer-${code}`);
    if (!stored) { router.push(`/whiteboard?code=${code}`); return; }
    setViewerId(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (!viewerId) return;
    poll();
    intervalRef.current = setInterval(poll, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerId]);

  async function poll() {
    try {
      const res = await fetch(`/api/whiteboard/${code}/state`);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.error || "Board not found."); return; }
      setSnapshot(data.snapshot);
      setTitle(data.title);
      setViewerCount((data.viewers || []).length);
      setHasPen(data.activeDrawerId === viewerId);
      setError("");
    } catch {
      setError("Could not reach the server.");
    }
  }

  async function uploadSnapshot(dataUrl: string) {
    const res = await fetch(`/api/whiteboard/${code}/draw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId, snapshot: dataUrl }),
    });
    if (res.status === 403) setHasPen(false); // pen was taken back mid-stroke
  }

  if (error) return <p className="text-sm text-red-600 text-center">{error}</p>;
  if (!viewerId) return <p className="text-slate-400 text-center">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-slate-900 dark:text-white">{title || "Live Whiteboard"}</p>
        <p className="text-xs text-slate-400">{viewerCount} watching</p>
      </div>

      {hasPen && (
        <div className="mb-3 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 rounded-lg px-4 py-2 text-sm text-amber-800 dark:text-amber-300 text-center">
          ✏️ You have the pen — draw your answer!
        </div>
      )}

      {hasPen ? (
        <DrawingSurface initialSnapshot={snapshot} onUpload={uploadSnapshot} showClear={false} />
      ) : (
        <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-white">
          {snapshot ? (
            <img src={snapshot} alt="Whiteboard" className="w-full h-auto" />
          ) : (
            <div className="aspect-video flex items-center justify-center text-slate-400 text-sm">
              Waiting for the teacher to start drawing…
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2 text-center">
        {hasPen ? "Your drawing syncs automatically as you draw." : "Updates automatically every couple of seconds."}
      </p>
    </div>
  );
}
