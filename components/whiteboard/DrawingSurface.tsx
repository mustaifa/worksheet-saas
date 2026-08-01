"use client";
import { useRef, useState, useEffect, useCallback } from "react";

const COLORS = ["#0f172a", "#dc2626", "#2563eb", "#16a34a", "#ea580c"];
const CANVAS_W = 1200;
const CANVAS_H = 675;
const HEADER_H = 155; // content starts below this — includes a full blank line of breathing room after the Name/Date fields
const FOOTER_H = 40;  // content ends above this
const MARGIN_X = 76;  // where questions/text start, to the right of the vertical margin line
const MARGIN_LINE_X = 48; // classic ruled-paper vertical margin line, like real notebook paper
const LINE_SPACING = 40; // equal width/height for math grid squares, and equal gap for ruled lines

export type WorksheetTemplate = {
  title: string;
  subject?: string | null;
  grade?: number | null;
  pageNumber: number;
};

type Tool = "pen" | "eraser" | "text";

export default function DrawingSurface({
  remoteSnapshot, remoteVersion, onUpload, showClear = true, template, autoNumberQuestions = false,
}: {
  remoteSnapshot: string | null;
  remoteVersion: string | number | null; // changes whenever the server's copy changes (e.g. updatedAt) — triggers a re-sync
  onUpload: (dataUrl: string) => Promise<void>;
  showClear?: boolean;
  template?: WorksheetTemplate; // when set, draws a professional header/footer frame (used by Custom Worksheets, not the live Whiteboard)
  autoNumberQuestions?: boolean; // when set, the Type tool auto-numbers and left-aligns entries instead of placing text freely
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const appliedVersion = useRef<string | number | null>(null);
  const questionCounter = useRef(1);
  const [color, setColor] = useState(COLORS[0]);
  const [tool, setTool] = useState<Tool>(autoNumberQuestions ? "text" : "pen");
  const [lineWidth, setLineWidth] = useState(4);
  const [toast, setToast] = useState("");
  const [textBox, setTextBox] = useState<{
    canvasX: number; canvasY: number; screenX: number; screenY: number; value: string;
    mode: "cell" | "line" | "free"; col?: number; row?: number; lineIndex?: number;
  } | null>(null);

  useEffect(() => {
    if (textBox && textInputRef.current) {
      // a short delay helps mobile browsers actually raise the keyboard,
      // since focusing immediately during React's render commit is often
      // too early for them to treat it as tied to the user's tap
      const t = setTimeout(() => textInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    // re-fires whenever a *new* box opens (including auto-advancing to the
    // next cell/line), not just when one opens or closes — that's what
    // makes the refocus actually happen on each advance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textBox ? `${textBox.canvasX}-${textBox.canvasY}` : null]);

  function drawFrame(ctx: CanvasRenderingContext2D) {
    if (!template) return;
    ctx.fillStyle = "#0f172a";
    ctx.textBaseline = "top";
    ctx.font = "bold 34px system-ui, sans-serif";
    ctx.fillText(template.title, MARGIN_X, 28);

    const metaParts = [template.subject ? template.subject[0].toUpperCase() + template.subject.slice(1) : null, template.grade ? `Grade ${template.grade}` : null].filter(Boolean);
    if (metaParts.length) {
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillStyle = "#64748b";
      const metaText = metaParts.join(" · ");
      const w = ctx.measureText(metaText).width;
      ctx.fillText(metaText, CANVAS_W - MARGIN_X - w, 36);
    }

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(MARGIN_X, 74);
    ctx.lineTo(CANVAS_W - MARGIN_X, 74);
    ctx.stroke();

    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("Name: ______________________", MARGIN_X, 90);
    ctx.fillText("Date: ______________________", CANVAS_W / 2 + 20, 90);

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(MARGIN_X, CANVAS_H - FOOTER_H);
    ctx.lineTo(CANVAS_W - MARGIN_X, CANVAS_H - FOOTER_H);
    ctx.stroke();

    ctx.font = "13px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Page ${template.pageNumber}`, MARGIN_X, CANVAS_H - FOOTER_H + 12);
    const brand = "Practice Sheet";
    const brandW = ctx.measureText(brand).width;
    ctx.fillText(brand, CANVAS_W - MARGIN_X - brandW, CANVAS_H - FOOTER_H + 12);

    // classic vertical margin line, like real ruled notebook paper — spans
    // nearly the full page height, content sits to the right of it
    ctx.strokeStyle = "#fca5a5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(MARGIN_LINE_X, 14);
    ctx.lineTo(MARGIN_LINE_X, CANVAS_H - 14);
    ctx.stroke();
  }

  function drawContentRuling(ctx: CanvasRenderingContext2D) {
    if (!template) return;
    const top = HEADER_H, bottom = CANVAS_H - FOOTER_H;
    const left = MARGIN_X, right = CANVAS_W - MARGIN_X;
    ctx.save();
    ctx.strokeStyle = "#94a3b8"; // darkened from the original — the light version was nearly invisible once the canvas is scaled down for display
    ctx.lineWidth = 1.25;

    if (template.subject === "math") {
      for (let x = left; x <= right; x += LINE_SPACING) {
        ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
      }
      for (let y = top; y <= bottom; y += LINE_SPACING) {
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
      }
    } else {
      for (let y = top; y <= bottom; y += LINE_SPACING) {
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function blankPage(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawFrame(ctx);
    drawContentRuling(ctx);
  }

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
    if (remoteSnapshot) {
      drawImageOnto(remoteSnapshot);
    } else {
      blankPage(ctx);
    }
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

  const maxCol = Math.floor((CANVAS_W - MARGIN_X * 2) / LINE_SPACING) - 1;
  const maxRow = Math.floor((CANVAS_H - FOOTER_H - HEADER_H) / LINE_SPACING) - 1;
  const maxLineIndex = Math.floor((CANVAS_H - FOOTER_H - HEADER_H) / LINE_SPACING) - 1;

  function openCell(col: number, row: number) {
    const clampedCol = Math.min(Math.max(col, 0), Math.max(maxCol, 0));
    const clampedRow = Math.min(Math.max(row, 0), Math.max(maxRow, 0));
    const cellCenterX = MARGIN_X + clampedCol * LINE_SPACING + LINE_SPACING / 2;
    const cellCenterY = HEADER_H + clampedRow * LINE_SPACING + LINE_SPACING / 2;
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width, scaleY = CANVAS_H / rect.height;
    setTextBox({
      canvasX: cellCenterX, canvasY: cellCenterY,
      screenX: cellCenterX / scaleX, screenY: cellCenterY / scaleY,
      value: "", mode: "cell", col: clampedCol, row: clampedRow,
    });
  }

  function openLine(lineIndex: number) {
    const clampedIndex = Math.min(Math.max(lineIndex, 0), Math.max(maxLineIndex, 0));
    const snappedY = HEADER_H + clampedIndex * LINE_SPACING;
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width, scaleY = CANVAS_H / rect.height;
    setTextBox({
      canvasX: MARGIN_X, canvasY: snappedY,
      screenX: MARGIN_X / scaleX, screenY: snappedY / scaleY,
      value: "", mode: "line", lineIndex: clampedIndex,
    });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "text") {
      const canvasPos = getCanvasPos(e.clientX, e.clientY);
      const containerRect = containerRef.current!.getBoundingClientRect();

      if (autoNumberQuestions && template?.subject === "math") {
        // snap to the single grid cell that was clicked, so a digit/answer
        // can be typed into one specific square — like real graph paper
        // used for column arithmetic, not a left-aligned list
        const colIndex = Math.floor((canvasPos.x - MARGIN_X) / LINE_SPACING);
        const rowIndex = Math.floor((canvasPos.y - HEADER_H) / LINE_SPACING);
        openCell(colIndex, rowIndex);
        return;
      }

      if (autoNumberQuestions && template) {
        // snap to the nearest ruled line and force the left margin — this is
        // what makes typed questions look like they were placed on real
        // ruled paper instead of floating at an arbitrary click point
        const rawY = Math.min(Math.max(canvasPos.y, HEADER_H), CANVAS_H - FOOTER_H - LINE_SPACING);
        const lineIndex = Math.round((rawY - HEADER_H) / LINE_SPACING);
        openLine(lineIndex);
        return;
      }

      setTextBox({
        canvasX: canvasPos.x, canvasY: canvasPos.y,
        screenX: e.clientX - containerRect.left, screenY: e.clientY - containerRect.top,
        value: "", mode: "free",
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

  function commitText(advance: boolean = true) {
    if (!textBox) return;
    const current = textBox;
    if (current.value.trim()) {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        if (current.mode === "cell") {
          // centered in a single grid cell — no numbering, short entries like a digit or short answer
          ctx.font = "24px system-ui, sans-serif";
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(current.value, current.canvasX, current.canvasY);
          ctx.textAlign = "left"; // reset — other draw calls assume default left alignment
        } else if (current.mode === "line") {
          const fontSize = lineWidth >= 8 ? 26 : 20;
          ctx.font = `${fontSize}px system-ui, sans-serif`;
          ctx.fillStyle = color;
          ctx.textBaseline = "alphabetic";
          const text = `${questionCounter.current}. ${current.value}`;
          ctx.fillText(text, current.canvasX, current.canvasY - 6); // small lift so text sits just above the rule line
          questionCounter.current += 1;
        } else {
          const fontSize = lineWidth >= 8 ? 44 : 28;
          ctx.font = `${fontSize}px system-ui, sans-serif`;
          ctx.fillStyle = color;
          ctx.textBaseline = "top";
          ctx.fillText(current.value, current.canvasX, current.canvasY);
        }
        dirty.current = true;
        upload();
      }
    }
    setTextBox(null);

    // auto-advance to the next cell/line so typing can continue without a
    // fresh click each time — Tab, Enter, or clicking the next spot all work
    if (advance && current.mode === "cell" && current.col !== undefined && current.row !== undefined) {
      if (current.col >= maxCol) openCell(0, current.row + 1);
      else openCell(current.col + 1, current.row);
    } else if (advance && current.mode === "line" && current.lineIndex !== undefined) {
      openLine(current.lineIndex + 1);
    }
  }

  function clearBoard() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    blankPage(ctx);
    if (autoNumberQuestions) questionCounter.current = 1;
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
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          {template?.subject === "math"
            ? "Click any grid cell to type a number into it."
            : autoNumberQuestions
              ? "Click anywhere to add the next numbered question on a line."
              : "Click anywhere on the board to type text there."}
        </p>
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
            onKeyDown={(e) => {
              if (e.key === "Enter") { commitText(true); }
              else if (e.key === "Tab") { e.preventDefault(); commitText(true); }
              else if (e.key === "Escape") { setTextBox(null); }
            }}
            onBlur={() => commitText(false)}
            placeholder={textBox.mode === "cell" ? "" : "Type…"}
            className={`absolute border-2 border-slate-900 rounded outline-none ${textBox.mode === "cell" ? "text-center px-0 py-1" : "px-2 py-1.5"}`}
            style={{
              left: textBox.screenX, top: textBox.screenY,
              color: "#0f172a", backgroundColor: "#ffffff", fontSize: 16, zIndex: 20,
              ...(textBox.mode === "cell"
                ? { width: 34, transform: "translate(-50%, -50%)" } // small box, truly centered on the clicked cell
                : { minWidth: 160 }),
            }}
          />
        )}
      </div>
      {toast && <p className="text-xs text-red-600 mt-2">{toast}</p>}
    </div>
  );
}
