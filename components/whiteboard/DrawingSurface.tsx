"use client";
import { useRef, useState, useEffect, useCallback } from "react";

const COLORS = ["#0f172a", "#dc2626", "#2563eb", "#16a34a", "#ea580c"];
const CANVAS_W = 1200;
const CANVAS_H = 675;

type Tool = "pen" | "eraser" | "text";

export default function DrawingSurface({
  remoteSnapshot, remoteVersion, onUpload, showClear = true,
}: {
  remoteSnapshot: string | null;
  remoteVersion: string | number | null; // changes whenever the server's copy changes (e.g. updatedAt) — triggers a re-sync
  onUpload: (dataUrl: string) => Promise<void>;
  showClear?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const appliedVersion = useRef<string | number | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [tool, setTool] = useState<Tool>("pen");
  const [lineWidth, setLineWidth] = useState(4);
  const [toast, setToast] = useState("");
  const [textBox, setTextBox] = useState<{ canvasX: number; canvasY: number; screenX: number; screenY: number; value: string } | null>(null);

  useEffect(() => {
    if (textBox && textInputRef.current) {
      // a short delay helps mobile browsers actually raise the keyboard,
      // since focusing immediately during React's render commit is often
      // too early for them to treat it as tied to the user's tap
      const t = setTimeout(() => textInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textBox === null]);

  function drawImageOnto(dataUrl: string) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H); };
    img.src = dataUrl;
  }

  // initial load
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    if (remoteSnapshot) drawImageOnto(remoteSnapshot);
    appliedVersion.current = remoteVersion;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-sync whenever the server's version changes and we're not mid-stroke —
  // this is what makes updates from someone else (teacher or a granted
  // student) actually show up, instead of only ever showing what loaded
  // when this tab first opened
  useEffect(() => {
    if (remoteVersion === null || remoteVersion === appliedVersion.current) return;
    if (drawing.current || textBox) return; // don't stomp on in-progress work
    if (remoteSnapshot) drawImageOnto(remoteSnapshot);
    appliedVersion.current = remoteVersion;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteVersion]);

  const getCanvasPos = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "text") {
      const canvasPos = getCanvasPos(e.clientX, e.clientY);
      const containerRect = containerRef.current!.getBoundingClientRect();
      setTextBox({
        canvasX: canvasPos.x, canvasY: canvasPos.y,
        screenX: e.clientX - containerRect.left, screenY: e.clientY - containerRect.top,
        value: "",
      });
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasPos(e.clientX, e.clientY);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawing.current = true;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || tool === "text") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasPos(e.clientX, e.clientY);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = tool === "eraser" ? lineWidth * 6 : lineWidth;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
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
    if (drawing.current) { drawing.current = false; upload(); }
  }

  function commitText() {
    if (!textBox) return;
    if (textBox.value.trim()) {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const fontSize = lineWidth >= 8 ? 44 : 28;
        ctx.font = `${fontSize}px system-ui, sans-serif`;
        ctx.fillStyle = color;
        ctx.textBaseline = "top";
        ctx.fillText(textBox.value, textBox.canvasX, textBox.canvasY);
        dirty.current = true;
        upload();
      }
    }
    setTextBox(null);
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
            onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); }}
            className={`w-8 h-8 rounded-full border-2 ${tool !== "eraser" && color === c ? "border-slate-900 dark:border-white" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          onClick={() => setTool("pen")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${tool === "pen" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
        >
          ✏️ Pen
        </button>
        <button
          onClick={() => setTool("text")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${tool === "text" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
        >
          🔤 Type
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${tool === "eraser" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
        >
          Eraser
        </button>
        <div className="flex items-center gap-1.5 ml-2">
          <button onClick={() => setLineWidth(3)} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${lineWidth === 3 ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800" : "border-slate-300 dark:border-slate-700"}`} title="Thin / small text">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-slate-300" />
          </button>
          <button onClick={() => setLineWidth(8)} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${lineWidth === 8 ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800" : "border-slate-300 dark:border-slate-700"}`} title="Thick / large text">
            <span className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300" />
          </button>
        </div>
        {showClear && (
          <button onClick={clearBoard} className="ml-auto text-xs border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
            Clear board
          </button>
        )}
      </div>

      {tool === "text" && !textBox && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Click anywhere on the board to type text there.</p>
      )}

      <div ref={containerRef} className="relative">
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
        {textBox && (
          <input
            ref={textInputRef}
            value={textBox.value}
            onChange={(e) => setTextBox({ ...textBox, value: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") commitText(); if (e.key === "Escape") setTextBox(null); }}
            onBlur={commitText}
            placeholder="Type…"
            className="absolute border-2 border-slate-900 rounded px-2 py-1.5 outline-none"
            style={{ left: textBox.screenX, top: textBox.screenY, color: "#0f172a", backgroundColor: "#ffffff", fontSize: 16, minWidth: 160, zIndex: 20 }}
          />
        )}
      </div>
      {toast && <p className="text-xs text-red-600 mt-2">{toast}</p>}
    </div>
  );
}
