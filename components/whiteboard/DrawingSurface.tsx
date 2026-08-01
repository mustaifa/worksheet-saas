"use client";
import { useRef, useState, useEffect, useCallback } from "react";

const COLORS = ["#0f172a", "#dc2626", "#2563eb", "#16a34a", "#ea580c"];
const CANVAS_W = 1200;
const CANVAS_H = 675;

export default function DrawingSurface({
  initialSnapshot, onUpload, showClear = true,
}: { initialSnapshot: string | null; onUpload: (dataUrl: string) => Promise<void>; showClear?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [erasing, setErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState(4);
  const [toast, setToast] = useState("");
  const [ready, setReady] = useState(false);

  // load the board's current content as a starting point, so this surface
  // never overwrites what's already been drawn
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (initialSnapshot) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H); setReady(true); };
      img.onerror = () => setReady(true);
      img.src = initialSnapshot;
    } else {
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const upload = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !dirty.current) return;
    dirty.current = false;
    try {
      await onUpload(canvas.toDataURL("image/png"));
    } catch {
      setToast("Could not sync the board — check your connection.");
    }
  }, [onUpload]);

  function handlePointerUp() {
    drawing.current = false;
    upload();
  }

  function clearBoard() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    dirty.current = true;
    upload();
  }

  // safety net: upload periodically in case a very long stroke never fires pointerup cleanly
  useEffect(() => {
    const interval = setInterval(upload, 3000);
    return () => clearInterval(interval);
  }, [upload]);

  return (
    <div>
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
        {showClear && (
          <button onClick={clearBoard} className="ml-auto text-xs border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
            Clear board
          </button>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white touch-none ${!ready ? "opacity-50" : ""}`}
        style={{ touchAction: "none" }}
      />
      {toast && <p className="text-xs text-red-600 mt-2">{toast}</p>}
    </div>
  );
}
