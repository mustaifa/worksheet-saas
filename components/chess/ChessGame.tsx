"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, Move, START_FEN, WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, colorOf, typeOf, squareName } from "@/lib/chess/engine";
import { bestMove, LEVELS } from "@/lib/chess/ai";

const STORE = "ps-chess-v1";
// Text-style glyphs (the trailing selector stops phones drawing them as emoji).
const GLYPH: Record<number, string> = { [PAWN]: "♟︎", [KNIGHT]: "♞︎", [BISHOP]: "♝︎", [ROOK]: "♜︎", [QUEEN]: "♛︎", [KING]: "♚︎" };
const NAME: Record<number, string> = { [PAWN]: "pawn", [KNIGHT]: "knight", [BISHOP]: "bishop", [ROOK]: "rook", [QUEEN]: "queen", [KING]: "king" };
const WORTH: Record<number, number> = { [PAWN]: 1, [KNIGHT]: 3, [BISHOP]: 3, [ROOK]: 5, [QUEEN]: 9, [KING]: 0 };
const SIDE = ["White", "Black"];

const pieceStyle = (color: number): React.CSSProperties =>
  color === WHITE
    ? { color: "#ffffff", textShadow: "-1px 0 #1e293b, 1px 0 #1e293b, 0 -1px #1e293b, 0 1px #1e293b, 0 2px 3px rgba(15,23,42,.35)" }
    : { color: "#1e293b", textShadow: "0 0 1px rgba(255,255,255,.7), 0 2px 3px rgba(15,23,42,.25)" };

type Mode = "cpu" | "two";
type Saved = { moves: [number, number, number][]; mode: Mode; human: number; level: number };

const btn = "px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed";
const seg = (on: boolean) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium border ${on
    ? "border-emerald-600 bg-emerald-600 text-white"
    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"}`;

export default function ChessGame() {
  const game = useRef<Chess>(new Chess());
  const g = game.current;
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);

  const [mode, setMode] = useState<Mode>("cpu");
  const [human, setHuman] = useState(WHITE);
  const [level, setLevel] = useState(2);
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [promo, setPromo] = useState<{ from: number; to: number } | null>(null);
  const [thinking, setThinking] = useState(false);
  const [hint, setHint] = useState<Move | null>(null);
  const [loaded, setLoaded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  // Restore an unfinished game from this browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        for (const [from, to, pr] of s.moves || []) { const m = g.find(from, to, pr); if (!m) break; g.move(m); }
        if (s.mode === "cpu" || s.mode === "two") setMode(s.mode);
        if (s.human === WHITE || s.human === BLACK) { setHuman(s.human); setFlipped(s.mode === "cpu" && s.human === BLACK); }
        if (LEVELS.some((l) => l.id === s.level)) setLevel(s.level);
      }
    } catch { /* nothing saved, or storage blocked */ }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = g.status();
  const legal = useMemo(() => g.legalMoves(), [g, g.history.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const targets = selected === null ? [] : legal.filter((m) => m.from === selected);
  const last = g.history.length ? g.history[g.history.length - 1].move : null;
  const humanToMove = mode === "two" || g.turn === human;

  // Save after every change.
  useEffect(() => {
    if (!loaded) return;
    try {
      const s: Saved = { moves: g.history.map((h) => [h.move.from, h.move.to, h.move.promo]), mode, human, level };
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch { /* storage blocked: the game simply won't be remembered */ }
  });

  // Computer's turn.
  const moveCount = g.history.length;
  useEffect(() => {
    if (!loaded || mode !== "cpu" || g.turn === human || g.status().over) { setThinking(false); return; }
    setThinking(true);
    const timer = setTimeout(() => {
      const m = bestMove(g, level);
      if (m) g.move(m);
      setThinking(false);
      bump();
    }, 350);
    return () => clearTimeout(timer);
  }, [loaded, mode, human, level, moveCount, g, bump]);

  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [moveCount]);

  const play = (m: Move) => { g.move(m); setSelected(null); setPromo(null); setHint(null); bump(); };

  const onSquare = (s: number) => {
    if (status.over || thinking || promo || !humanToMove) return;
    if (selected !== null) {
      const options = targets.filter((m) => m.to === s);
      if (options.length) {
        if (options[0].promo) setPromo({ from: selected, to: s }); else play(options[0]);
        return;
      }
    }
    const p = g.board[s];
    setSelected(p && colorOf(p) === g.turn && s !== selected ? s : null);
  };

  const newGame = (nextMode = mode, nextHuman = human) => {
    g.load(START_FEN);
    setMode(nextMode); setHuman(nextHuman);
    setFlipped(nextMode === "cpu" && nextHuman === BLACK);
    setSelected(null); setPromo(null); setHint(null);
    bump();
  };

  const undo = () => {
    if (thinking || !g.history.length) return;
    g.undo();
    if (mode === "cpu" && g.turn !== human && g.history.length) g.undo();
    setSelected(null); setPromo(null); setHint(null);
    bump();
  };

  const showHint = () => {
    if (status.over || thinking || !humanToMove) return;
    setHint(bestMove(g, 3));
  };

  // Captured pieces and material balance.
  const taken: number[][] = [[], []];
  for (const h of g.history) if (h.move.captured) taken[colorOf(h.move.piece)].push(typeOf(h.move.captured));
  taken.forEach((t) => t.sort((a, b) => WORTH[b] - WORTH[a]));
  let balance = 0;
  for (let s = 0; s < 64; s++) { const p = g.board[s]; if (p) balance += (colorOf(p) === WHITE ? 1 : -1) * WORTH[typeOf(p)]; }

  let headline: string;
  if (status.over) headline = status.winner !== null ? `Checkmate. ${SIDE[status.winner]} wins!` : `Draw by ${status.reason}.`;
  else if (thinking) headline = "Computer is thinking…";
  else headline = `${SIDE[g.turn]} to move${status.check ? ". Check!" : ""}`;

  const rows: { n: number; white: string; black?: string }[] = [];
  g.history.forEach((h, i) => { if (i % 2 === 0) rows.push({ n: i / 2 + 1, white: h.san }); else rows[rows.length - 1].black = h.san; });

  const checkSquare = status.check ? g.kings[g.turn] : -1;

  const Captured = ({ by }: { by: number }) => (
    <p className="h-6 text-lg leading-6 tracking-tight" aria-label={`Pieces captured by ${SIDE[by]}`}>
      {taken[by].map((t, i) => <span key={i} style={pieceStyle(1 - by)}>{GLYPH[t]}</span>)}
      {(by === WHITE ? balance : -balance) > 0 && <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 align-middle">+{Math.abs(balance)}</span>}
    </p>
  );
  const top = flipped ? WHITE : BLACK, bottom = 1 - top;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] items-start">
      <div className="w-full max-w-[560px] mx-auto">
        <Captured by={top} />
        <div className="relative my-1">
          <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-lg ring-1 ring-slate-300 dark:ring-slate-700 select-none" role="grid" aria-label="Chess board">
            {Array.from({ length: 64 }, (_, i) => {
              const s = flipped ? 63 - i : i;
              const p = g.board[s], row = s >> 3, col = s & 7, dark = (row + col) % 2 === 1;
              const target = targets.find((m) => m.to === s);
              const isLast = last && (last.from === s || last.to === s);
              const isHint = hint && (hint.from === s || hint.to === s);
              let bg = dark ? "#6f9a78" : "#eef0e2";
              if (isLast) bg = dark ? "#b9b755" : "#e9e88a";
              if (isHint) bg = dark ? "#5b9bd5" : "#a9cdf0";
              if (selected === s) bg = "#f2c14e";
              if (checkSquare === s) bg = "#e2574c";
              const label = `${squareName(s)}${p ? `, ${SIDE[colorOf(p)].toLowerCase()} ${NAME[typeOf(p)]}` : ""}${target ? ", legal move" : ""}`;
              return (
                <button
                  key={s} type="button" role="gridcell" aria-label={label} onClick={() => onSquare(s)}
                  className="relative aspect-square flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-500"
                  style={{ background: bg, cursor: humanToMove && !status.over ? "pointer" : "default" }}
                >
                  {i % 8 === 0 && <span className="absolute top-0.5 left-1 text-[10px] font-semibold" style={{ color: dark ? "#eef0e2" : "#4d7357" }}>{8 - row}</span>}
                  {i >= 56 && <span className="absolute bottom-0 right-1 text-[10px] font-semibold" style={{ color: dark ? "#eef0e2" : "#4d7357" }}>{"abcdefgh"[col]}</span>}
                  {p !== 0 && <span className="leading-none" style={{ fontSize: "clamp(26px, 9.5vw, 56px)", ...pieceStyle(colorOf(p)) }}>{GLYPH[typeOf(p)]}</span>}
                  {target && (target.captured
                    ? <span className="absolute inset-1 rounded-full border-4 border-slate-900/30" />
                    : <span className="absolute w-[28%] h-[28%] rounded-full bg-slate-900/25" />)}
                </button>
              );
            })}
          </div>

          {promo && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg" role="dialog" aria-label="Choose a piece to promote to">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-xl text-center">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Promote your pawn to</p>
                <div className="flex gap-2">
                  {[QUEEN, ROOK, BISHOP, KNIGHT].map((t) => (
                    <button key={t} type="button" aria-label={NAME[t]} className="w-14 h-14 rounded-lg bg-[#6f9a78] hover:brightness-110 text-4xl leading-none"
                      onClick={() => { const m = g.find(promo.from, promo.to, t); if (m) play(m); }}>
                      <span style={pieceStyle(g.turn)}>{GLYPH[t]}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="mt-2 text-xs text-slate-500 underline" onClick={() => setPromo(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <Captured by={bottom} />
      </div>

      <div className="space-y-4">
        <p role="status" aria-live="polite" className={`text-lg font-bold ${status.over ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>{headline}</p>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => newGame()}>New game</button>
          <button type="button" className={btn} onClick={undo} disabled={thinking || !g.history.length}>Undo</button>
          <button type="button" className={btn} onClick={showHint} disabled={status.over || thinking || !humanToMove}>Hint</button>
          <button type="button" className={btn} onClick={() => setFlipped((f) => !f)}>Flip board</button>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Play against</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={seg(mode === "cpu")} aria-pressed={mode === "cpu"} onClick={() => mode !== "cpu" && newGame("cpu", human)}>Computer</button>
              <button type="button" className={seg(mode === "two")} aria-pressed={mode === "two"} onClick={() => mode !== "two" && newGame("two", human)}>A friend (same device)</button>
            </div>
          </div>
          {mode === "cpu" && (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Level</p>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => <button key={l.id} type="button" className={seg(level === l.id)} aria-pressed={level === l.id} onClick={() => setLevel(l.id)}>{l.name}</button>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">You play</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={seg(human === WHITE)} aria-pressed={human === WHITE} onClick={() => human !== WHITE && newGame("cpu", WHITE)}>White</button>
                  <button type="button" className={seg(human === BLACK)} aria-pressed={human === BLACK} onClick={() => human !== BLACK && newGame("cpu", BLACK)}>Black</button>
                </div>
              </div>
            </>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">Changing opponent or colour starts a new game. Your game is saved in this browser.</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Moves</p>
          {rows.length === 0
            ? <p className="text-sm text-slate-500 dark:text-slate-400">Tap a piece, then tap a highlighted square to move it.</p>
            : (
              <ol ref={listRef} className="max-h-56 overflow-y-auto text-sm font-mono text-slate-800 dark:text-slate-200 grid grid-cols-[2.5rem_1fr_1fr] gap-y-1">
                {rows.map((r) => (
                  <li key={r.n} className="contents">
                    <span className="text-slate-400">{r.n}.</span><span>{r.white}</span><span>{r.black || ""}</span>
                  </li>
                ))}
              </ol>
            )}
        </div>
      </div>
    </div>
  );
}
