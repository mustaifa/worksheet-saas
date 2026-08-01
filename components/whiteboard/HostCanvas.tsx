"use client";
import { useState, useEffect, useCallback } from "react";
import DrawingSurface from "./DrawingSurface";

export default function HostCanvas({ code }: { code: string }) {
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [viewers, setViewers] = useState<{ id: string; nickname: string }[]>([]);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [grantLoading, setGrantLoading] = useState<string | null>(null);

  const pollState = useCallback(async () => {
    try {
      const res = await fetch(`/api/whiteboard/${code}/state`);
      const data = await res.json();
      if (res.ok) {
        setViewers(data.viewers || []);
        setActiveDrawerId(data.activeDrawerId || null);
        if (!loaded) { setInitialSnapshot(data.snapshot); setLoaded(true); }
      }
    } catch { /* ignore transient errors */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, loaded]);

  useEffect(() => {
    pollState();
    const interval = setInterval(pollState, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function uploadSnapshot(dataUrl: string) {
    await fetch(`/api/whiteboard/${code}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snapshot: dataUrl }),
    });
  }

  async function grantControl(viewerId: string | null) {
    setGrantLoading(viewerId || "revoke");
    await fetch(`/api/whiteboard/${code}/grant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId }),
    });
    setActiveDrawerId(viewerId);
    setGrantLoading(null);
  }

  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/whiteboard?code=${code}` : `/whiteboard?code=${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(joinUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", joinUrl);
    }
  }

  if (!loaded) return <p className="text-slate-400 text-center py-16">Loading board…</p>;

  const activeDrawer = viewers.find((v) => v.id === activeDrawerId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-2xl px-4 py-2 rounded-lg tracking-widest">
            {code}
          </div>
          <img src={qrUrl} alt="QR code to join" className="rounded-lg border border-slate-200 dark:border-slate-700" width={64} height={64} />
          <button onClick={copyLink} className="text-xs border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300">
            {copied ? "Copied ✓" : "Copy join link"}
          </button>
        </div>
      </div>

      <div className="mb-4 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Students {viewers.length > 0 && `(${viewers.length})`}
        </p>
        {viewers.length === 0 ? (
          <p className="text-sm text-slate-400">No students watching yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {viewers.map((v) => (
              <div
                key={v.id}
                className={`flex items-center gap-2 rounded-full pl-3 pr-1.5 py-1 text-sm ${
                  activeDrawerId === v.id ? "bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <span className="text-slate-800 dark:text-slate-200">{activeDrawerId === v.id ? "✏️ " : ""}{v.nickname}</span>
                {activeDrawerId === v.id ? (
                  <button
                    onClick={() => grantControl(null)}
                    disabled={grantLoading !== null}
                    className="text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700"
                  >
                    Take back
                  </button>
                ) : (
                  <button
                    onClick={() => grantControl(v.id)}
                    disabled={grantLoading !== null}
                    className="text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700"
                  >
                    Give pen
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {activeDrawer && (
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">{activeDrawer.nickname} currently has the pen — you can still draw too.</p>
        )}
      </div>

      <DrawingSurface initialSnapshot={initialSnapshot} onUpload={uploadSnapshot} />
      <p className="text-xs text-slate-400 mt-2">Draw with a mouse, finger, or stylus — students' screens update every couple of seconds.</p>
    </div>
  );
}
