"use client";
import { useRef, useState, useEffect, useCallback } from "react";

const COLORS = ["#0f172a", "#dc2626", "#2563eb", "#16a34a", "#ea580c"];
const CANVAS_W = 1200;
const CANVAS_H = 675;

export default function HostCanvas({ code }: { code: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [erasing, setErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState(4);
  const [viewers, setViewers] = useState<{ id: string; nickname: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawing.current = true;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = erasing ? lineWidth * 6 : lineWidth;
    ctx.strokeStyle = erasing ? "#ffffff" : color;
    ctx.lineTo(x, y);
    ctx.stroke();
    dirty.current = true;
  }

  function handlePointerUp() {
    drawing.current = false;
    uploadSnapshot();
  }

  const uploadSnapshot = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !dirty.current) return;
    dirty.current = false;
    const dataUrl = canvas.toDataURL("image/png");
    try {
      await fetch(`/api/whiteboard/${code}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot: dataUrl }),
      });
    } catch {
      setToast("Could not sync the board — check your connection.");
    }
  }, [code]);

  function clearBoard() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    dirty.current = true;
    uploadSnapshot();
  }

  // safety net: upload periodically in case a very long stroke never fires pointerup cleanly
  useEffect(() => {
    const interval = setInterval(uploadSnapshot, 3000);
    return () => clearInterval(interval);
  }, [uploadSnapshot]);

  // poll for viewer list (who's watching), separate from drawing state
  useEffect(() => {
    async function pollViewers() {
      try {
        const res = await fetch(`/api/whiteboard/${code}/state`);
        const data = await res.json();
        if (res.ok) setViewers(data.viewers || []);
      } catch { /* ignore transient errors */ }
    }
    pollViewers();
    const interval = setInterval(pollViewers, 3000);
    return () => clearInterval(interval);
  }, [code]);

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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {viewers.length === 0 ? "No students watching yet" : `${viewers.length} watching: ${viewers.map((v) => v.nickname).join(", ")}`}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setErasing(false); }}
            className={`w-8 h-8 rounded-full border-2 ${!erasing && color === c ? "border-slate-900 dark:border-white" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          onClick={() => setErasing(!erasing)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${erasing ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
        >
          Eraser
        </button>
        <div className="flex items-center gap-1.5 ml-2">
          <button onClick={() => setLineWidth(3)} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${lineWidth === 3 ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800" : "border-slate-300 dark:border-slate-700"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-slate-300" />
          </button>
          <button onClick={() => setLineWidth(8)} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${lineWidth === 8 ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800" : "border-slate-300 dark:border-slate-700"}`}>
            <span className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300" />
          </button>
        </div>
        <button onClick={clearBoard} className="ml-auto text-xs border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
          Clear board
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white touch-none"
        style={{ touchAction: "none" }}
      />
      {toast && <p className="text-xs text-red-600 mt-2">{toast}</p>}
      <p className="text-xs text-slate-400 mt-2">Draw with a mouse, finger, or stylus — students' screens update every couple of seconds.</p>
    </div>
  );
}
