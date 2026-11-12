"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, Move, START_FEN, WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, colorOf, typeOf, squareName } from "@/lib/chess/engine";
import { bestMove, LEVELS } from "@/lib/chess/ai";

const STORE = "ps-chess-v1";
const ONLINE_STORE = "ps-chess-online";
// Text-style glyphs (the trailing selector stops phones drawing them as emoji).
const GLYPH: Record<number, string> = { [PAWN]: "♟︎", [KNIGHT]: "♞︎", [BISHOP]: "♝︎", [ROOK]: "♜︎", [QUEEN]: "♛︎", [KING]: "♚︎" };
const NAME: Record<number, string> = { [PAWN]: "pawn", [KNIGHT]: "knight", [BISHOP]: "bishop", [ROOK]: "rook", [QUEEN]: "queen", [KING]: "king" };
const WORTH: Record<number, number> = { [PAWN]: 1, [KNIGHT]: 3, [BISHOP]: 3, [ROOK]: 5, [QUEEN]: 9, [KING]: 0 };
const SIDE = ["White", "Black"];

const pieceStyle = (color: number): React.CSSProperties =>
  color === WHITE
    ? { color: "#ffffff", textShadow: "-1px 0 #1e293b, 1px 0 #1e293b, 0 -1px #1e293b, 0 1px #1e293b, 0 2px 3px rgba(15,23,42,.35)" }
    : { color: "#1e293b", textShadow: "0 0 1px rgba(255,255,255,.7), 0 2px 3px rgba(15,23,42,.25)" };

type Mode = "cpu" | "two" | "online";
type Saved = { moves: [number, number, number][]; mode: Mode; human: number; level: number };
/** This device's seat in an online game. The token proves which side we are. */
type Seat = { code: string; token: string; color: number };
type Remote = { white: string; black: string | null; status: string; result: string | null; moves: [number, number, number][] };

const btn = "px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed";
const primaryBtn = "px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed";
const input = "w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg px-3 py-2";
const label = "text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5";
const seg = (on: boolean) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium border ${on
    ? "border-emerald-600 bg-emerald-600 text-white"
    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"}`;

async function post(url: string, body: unknown): Promise<{ ok: boolean; data: any }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    let data: any = {};
    try { data = await res.json(); } catch { /* empty reply */ }
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { error: "Could not reach the server. Check your connection." } };
  }
}

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

  // Online play.
  const [seat, setSeat] = useState<Seat | null>(null);
  const [remote, setRemote] = useState<Remote | null>(null);
  const [nick, setNick] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const sending = useRef(false);

  // Restore an unfinished game from this browser, or open an invite link.
  useEffect(() => {
    let resumed = false;
    try {
      const params = new URLSearchParams(window.location.search);
      const invite = (params.get("code") || "").toUpperCase().slice(0, 6);
      const name = (params.get("name") || "").slice(0, 20);
      if (name) setNick(name);
      const raw = localStorage.getItem(ONLINE_STORE);
      const s = raw ? (JSON.parse(raw) as Seat) : null;
      if (s && s.code && s.token && (!invite || invite === s.code)) {
        setSeat(s); setMode("online"); setFlipped(s.color === BLACK); resumed = true;
      } else if (invite) {
        setJoinCode(invite); setMode("online"); resumed = true;
      }
    } catch { /* storage blocked */ }
    if (!resumed) {
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
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = g.status();
  const moveCount = g.history.length;
  const legal = useMemo(() => g.legalMoves(), [g, moveCount]); // eslint-disable-line react-hooks/exhaustive-deps
  const targets = selected === null ? [] : legal.filter((m) => m.from === selected);
  const last = moveCount ? g.history[moveCount - 1].move : null;
  const online = mode === "online";
  const over = status.over || (online && remote?.status === "over");
  const humanToMove = mode === "two" || (mode === "cpu" && g.turn === human) || (online && !!seat && remote?.status === "active" && g.turn === seat.color);

  // Save local games after every change (online games live on the server).
  useEffect(() => {
    if (!loaded || online) return;
    try {
      const s: Saved = { moves: g.history.map((h) => [h.move.from, h.move.to, h.move.promo]), mode, human, level };
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch { /* storage blocked: the game simply won't be remembered */ }
  });

  // Computer's turn.
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

  const clearSelection = () => { setSelected(null); setPromo(null); setHint(null); };

  /** Brings the local board in line with the server's record of the game. */
  const applyRemote = useCallback((s: Remote) => {
    const mine = g.history.map((h) => h.move);
    const shared = Math.min(mine.length, s.moves.length);
    let prefix = true;
    for (let i = 0; i < shared; i++) if (mine[i].from !== s.moves[i][0] || mine[i].to !== s.moves[i][1] || mine[i].promo !== s.moves[i][2]) prefix = false;
    // An older reply that arrives late is behind the board on screen: ignore it.
    if (prefix && s.moves.length < mine.length) return;
    if (!prefix) g.load(START_FEN);
    for (let i = g.history.length; i < s.moves.length; i++) {
      const m = g.find(s.moves[i][0], s.moves[i][1], s.moves[i][2]);
      if (!m) break;
      g.move(m);
    }
    setRemote(s);
    bump();
  }, [g, bump]);

  const leave = useCallback((message = "") => {
    try { localStorage.removeItem(ONLINE_STORE); } catch { /* storage blocked */ }
    setSeat(null); setRemote(null); setNotice(message);
    g.load(START_FEN);
    setSelected(null); setPromo(null); setHint(null);
    bump();
  }, [g, bump]);

  // Keep an online game in step with the other player.
  const finished = remote?.status === "over";
  useEffect(() => {
    if (!online || !seat) return;
    let stop = false;
    const sync = async () => {
      if (sending.current) return;
      try {
        const res = await fetch(`/api/chess/${seat.code}/state`, { cache: "no-store" });
        if (stop || sending.current) return;
        if (res.status === 404) { leave("That game has ended and been removed."); return; }
        if (res.ok) applyRemote(await res.json());
      } catch { /* offline for a moment: try again on the next tick */ }
    };
    sync();
    if (finished) return () => { stop = true; };
    const timer = setInterval(sync, 1500);
    return () => { stop = true; clearInterval(timer); };
  }, [online, seat, finished, applyRemote, leave]);

  const play = async (m: Move) => {
    g.move(m); clearSelection(); bump();
    if (!online || !seat) return;
    sending.current = true;
    const { ok, data } = await post(`/api/chess/${seat.code}/move`, { token: seat.token, from: m.from, to: m.to, promo: m.promo });
    sending.current = false;
    if (ok) { setNotice(""); applyRemote(data); }
    else { setNotice(data.error || "That move could not be sent."); g.undo(); bump(); }
  };

  const onSquare = (s: number) => {
    if (over || thinking || promo || !humanToMove) return;
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

  const startLocal = (nextMode: "cpu" | "two", nextHuman = human) => {
    if (seat) leave();
    g.load(START_FEN);
    setMode(nextMode); setHuman(nextHuman);
    setFlipped(nextMode === "cpu" && nextHuman === BLACK);
    setNotice(""); clearSelection();
    bump();
  };

  const goOnline = () => {
    if (online) return;
    g.load(START_FEN);
    setMode("online"); setFlipped(false); setNotice(""); clearSelection();
    bump();
  };

  const takeSeat = (s: Seat) => {
    try { localStorage.setItem(ONLINE_STORE, JSON.stringify(s)); } catch { /* storage blocked: a refresh will lose the seat */ }
    g.load(START_FEN);
    setRemote(null); setSeat(s); setFlipped(s.color === BLACK); setNotice(""); clearSelection();
    bump();
  };

  const createOnline = async () => {
    if (!nick.trim() || busy) return;
    setBusy(true);
    const { ok, data } = await post("/api/chess/create", { nickname: nick });
    setBusy(false);
    if (ok) takeSeat({ code: data.code, token: data.token, color: data.color }); else setNotice(data.error || "Could not start a game.");
  };

  const joinOnline = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!nick.trim() || !code || busy) return;
    setBusy(true);
    const { ok, data } = await post(`/api/chess/${code}/join`, { nickname: nick });
    setBusy(false);
    if (ok) takeSeat({ code: data.code, token: data.token, color: data.color }); else setNotice(data.error || "Could not join that game.");
  };

  const resign = async () => {
    if (!seat || remote?.status !== "active") return;
    const { ok, data } = await post(`/api/chess/${seat.code}/move`, { token: seat.token, resign: true });
    if (ok) applyRemote(data); else setNotice(data.error || "Could not resign.");
  };

  const copyInvite = async () => {
    if (!seat) return;
    try { await navigator.clipboard.writeText(`${window.location.origin}/chess?code=${seat.code}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard blocked: the code is on screen to read out */ }
  };

  const undo = () => {
    if (online || thinking || !g.history.length) return;
    g.undo();
    if (mode === "cpu" && g.turn !== human && g.history.length) g.undo();
    clearSelection();
    bump();
  };

  const showHint = () => {
    if (online || over || thinking || !humanToMove) return;
    setHint(bestMove(g, 3));
  };

  // Captured pieces and material balance.
  const taken: number[][] = [[], []];
  for (const h of g.history) if (h.move.captured) taken[colorOf(h.move.piece)].push(typeOf(h.move.captured));
  taken.forEach((t) => t.sort((a, b) => WORTH[b] - WORTH[a]));
  let balance = 0;
  for (let s = 0; s < 64; s++) { const p = g.board[s]; if (p) balance += (colorOf(p) === WHITE ? 1 : -1) * WORTH[typeOf(p)]; }

  const players = online && remote ? [remote.white, remote.black || "Waiting…"] : SIDE;
  let headline: string;
  if (online && !seat) headline = "Play a friend online";
  else if (online && !remote) headline = "Connecting…";
  else if (online && remote?.status === "waiting") headline = "Waiting for a friend to join";
  else if (online && remote?.result?.endsWith(":resignation")) {
    const winner = remote.result.startsWith("white") ? 0 : 1;
    headline = `${players[1 - winner]} resigned. ${players[winner]} wins!`;
  }
  else if (status.over) headline = status.winner !== null ? `Checkmate. ${players[status.winner]} wins!` : `Draw by ${status.reason}.`;
  else if (thinking) headline = "Computer is thinking…";
  else if (online && seat) headline = `${g.turn === seat.color ? "Your move" : `${players[g.turn]}'s move`}${status.check ? ". Check!" : ""}`;
  else headline = `${SIDE[g.turn]} to move${status.check ? ". Check!" : ""}`;

  const rows: { n: number; white: string; black?: string }[] = [];
  g.history.forEach((h, i) => { if (i % 2 === 0) rows.push({ n: i / 2 + 1, white: h.san }); else rows[rows.length - 1].black = h.san; });

  const checkSquare = status.check ? g.kings[g.turn] : -1;

  const Captured = ({ by }: { by: number }) => (
    <p className="h-6 text-lg leading-6 tracking-tight flex items-center" aria-label={`Pieces captured by ${SIDE[by]}`}>
      {online && remote && <span className="mr-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{players[by]}{seat?.color === by ? " (you)" : ""}</span>}
      {taken[by].map((t, i) => <span key={i} style={pieceStyle(1 - by)}>{GLYPH[t]}</span>)}
      {(by === WHITE ? balance : -balance) > 0 && <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">+{Math.abs(balance)}</span>}
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
              const name = `${squareName(s)}${p ? `, ${SIDE[colorOf(p)].toLowerCase()} ${NAME[typeOf(p)]}` : ""}${target ? ", legal move" : ""}`;
              return (
                <button
                  key={s} type="button" role="gridcell" aria-label={name} onClick={() => onSquare(s)}
                  className="relative aspect-square flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-500"
                  style={{ background: bg, cursor: humanToMove && !over ? "pointer" : "default" }}
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
        <p role="status" aria-live="polite" className={`text-lg font-bold ${over ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>{headline}</p>

        <div className="flex flex-wrap gap-2">
          {!online && <button type="button" className={btn} onClick={() => startLocal(mode as "cpu" | "two")}>New game</button>}
          {!online && <button type="button" className={btn} onClick={undo} disabled={thinking || !g.history.length}>Undo</button>}
          {!online && <button type="button" className={btn} onClick={showHint} disabled={over || thinking || !humanToMove}>Hint</button>}
          <button type="button" className={btn} onClick={() => setFlipped((f) => !f)}>Flip board</button>
          {online && seat && remote?.status === "active" && <button type="button" className={btn} onClick={resign}>Resign</button>}
          {online && seat && <button type="button" className={btn} onClick={() => leave()}>{finished ? "New online game" : "Leave game"}</button>}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div>
            <p className={label}>Play against</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={seg(mode === "cpu")} aria-pressed={mode === "cpu"} onClick={() => mode !== "cpu" && startLocal("cpu")}>Computer</button>
              <button type="button" className={seg(mode === "two")} aria-pressed={mode === "two"} onClick={() => mode !== "two" && startLocal("two")}>A friend (same device)</button>
              <button type="button" className={seg(online)} aria-pressed={online} onClick={goOnline}>A friend online</button>
            </div>
          </div>

          {mode === "cpu" && (
            <>
              <div>
                <p className={label}>Level</p>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => <button key={l.id} type="button" className={seg(level === l.id)} aria-pressed={level === l.id} onClick={() => setLevel(l.id)}>{l.name}</button>)}
                </div>
              </div>
              <div>
                <p className={label}>You play</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={seg(human === WHITE)} aria-pressed={human === WHITE} onClick={() => human !== WHITE && startLocal("cpu", WHITE)}>White</button>
                  <button type="button" className={seg(human === BLACK)} aria-pressed={human === BLACK} onClick={() => human !== BLACK && startLocal("cpu", BLACK)}>Black</button>
                </div>
              </div>
            </>
          )}

          {online && !seat && (
            <div className="space-y-3">
              <div>
                <label className={`${label} block`} htmlFor="chess-nick">Your name</label>
                <input id="chess-nick" className={input} value={nick} maxLength={20} placeholder="First name or nickname" onChange={(e) => setNick(e.target.value)} />
              </div>
              <button type="button" className={`${primaryBtn} w-full`} disabled={busy || !nick.trim()} onClick={createOnline}>Start a new game and get a code</button>
              <div>
                <label className={`${label} block`} htmlFor="chess-code">Or join a friend&apos;s game</label>
                <div className="flex gap-2">
                  <input id="chess-code" className={`${input} font-mono tracking-widest uppercase`} value={joinCode} maxLength={6} placeholder="CODE" onChange={(e) => setJoinCode(e.target.value.toUpperCase())} />
                  <button type="button" className={primaryBtn} disabled={busy || !nick.trim() || !joinCode.trim()} onClick={joinOnline}>Join</button>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">No account needed. Players see each other&apos;s nickname only, and there is no chat.</p>
            </div>
          )}

          {online && seat && (
            <div className="space-y-2">
              <p className={label}>Game code</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-3xl font-bold tracking-widest text-slate-900 dark:text-white">{seat.code}</span>
                <button type="button" className={btn} onClick={copyInvite}>{copied ? "Copied" : "Copy invite link"}</button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {remote?.status === "waiting"
                  ? "Tell your friend this code. They open the Chess page, choose “A friend online” and type it in."
                  : `You are playing ${SIDE[seat.color]}.`}
              </p>
            </div>
          )}

          {notice && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{notice}</p>}
          {!online && <p className="text-xs text-slate-500 dark:text-slate-400">Changing opponent or colour starts a new game. Your game is saved in this browser.</p>}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className={`${label} mb-2`}>Moves</p>
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
