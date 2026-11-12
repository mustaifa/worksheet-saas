/**
 * Computer opponent: alpha-beta search with capture-only extension at the
 * leaves, scored by material and piece placement. Runs in the browser.
 */
import { Chess, Move, WHITE, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING } from "./engine";

export const LEVELS = [
  { id: 1, name: "Beginner", depth: 1, quiet: false, ms: 200, random: 0.4 },
  { id: 2, name: "Easy", depth: 2, quiet: false, ms: 400, random: 0.12 },
  { id: 3, name: "Medium", depth: 3, quiet: true, ms: 900, random: 0 },
  { id: 4, name: "Hard", depth: 5, quiet: true, ms: 1600, random: 0 },
];

const VALUE = [0, 100, 320, 330, 500, 900, 20000];
const MATE = 100000;

// Piece placement bonuses from White's side (index 0 = a8). Mirrored for Black.
const PST: number[][] = [];
PST[PAWN] = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];
PST[KNIGHT] = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];
PST[BISHOP] = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
];
PST[ROOK] = [
  0, 0, 0, 0, 0, 0, 0, 0,
  5, 10, 10, 10, 10, 10, 10, 5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  0, 0, 0, 5, 5, 0, 0, 0,
];
PST[QUEEN] = [
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -5, 0, 5, 5, 5, 5, 0, -5,
  0, 0, 5, 5, 5, 5, 0, -5,
  -10, 5, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20,
];
PST[KING] = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  20, 20, 0, 0, 0, 0, 20, 20,
  20, 30, 10, 0, 0, 10, 30, 20,
];
const KING_ENDGAME = [
  -50, -40, -30, -20, -20, -30, -40, -50,
  -30, -20, -10, 0, 0, -10, -20, -30,
  -30, -10, 20, 30, 30, 20, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 20, 30, 30, 20, -10, -30,
  -30, -30, 0, 0, 0, 0, -30, -30,
  -50, -30, -30, -30, -30, -30, -30, -50,
];

/** Score in centipawns from the point of view of the side to move. */
function evaluate(g: Chess): number {
  const b = g.board;
  let score = 0, heavy = 0;
  for (let s = 0; s < 64; s++) { const t = b[s] & 7; if (t === QUEEN) heavy += 2; else if (t === ROOK) heavy += 1; }
  const endgame = heavy <= 2;
  for (let s = 0; s < 64; s++) {
    const p = b[s];
    if (!p) continue;
    const t = p & 7, white = (p >> 3) === WHITE, idx = white ? s : s ^ 56;
    const v = VALUE[t] + (t === KING && endgame ? KING_ENDGAME[idx] : PST[t][idx]);
    score += white ? v : -v;
  }
  return g.turn === WHITE ? score : -score;
}

const orderScore = (m: Move) => (m.captured ? 10 * VALUE[m.captured & 7] - VALUE[m.piece & 7] + 10000 : 0) + (m.promo ? 8000 + VALUE[m.promo] : 0);

class Timeout extends Error {}

function search(g: Chess, level: (typeof LEVELS)[number], deadline: number) {
  let nodes = 0;
  const tick = () => { if ((++nodes & 1023) === 0 && performance.now() > deadline) throw new Timeout(); };

  function quiesce(alpha: number, beta: number): number {
    tick();
    const stand = evaluate(g);
    if (stand >= beta) return beta;
    if (stand > alpha) alpha = stand;
    const us = g.turn;
    const moves = g.pseudoMoves(true).sort((a, b) => orderScore(b) - orderScore(a));
    for (const m of moves) {
      g.make(m);
      if (g.attacked(g.kings[us], 1 - us)) { g.unmake(m); continue; }
      let score: number;
      try { score = -quiesce(-beta, -alpha); } finally { g.unmake(m); }
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  function negamax(depth: number, alpha: number, beta: number, ply: number): number {
    tick();
    if (g.half >= 100) return 0;
    if (depth === 0) return level.quiet ? quiesce(alpha, beta) : evaluate(g);
    const us = g.turn;
    const moves = g.pseudoMoves().sort((a, b) => orderScore(b) - orderScore(a));
    let legal = 0;
    for (const m of moves) {
      g.make(m);
      if (g.attacked(g.kings[us], 1 - us)) { g.unmake(m); continue; }
      legal++;
      let score: number;
      try { score = -negamax(depth - 1, -beta, -alpha, ply + 1); } finally { g.unmake(m); }
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    if (legal === 0) return g.inCheck() ? -MATE + ply : 0;
    return alpha;
  }

  return { negamax };
}

/** Picks the computer's move for the side to move, or null if there is none. */
export function bestMove(g: Chess, levelId: number): Move | null {
  const level = LEVELS.find((l) => l.id === levelId) || LEVELS[2];
  const moves = g.legalMoves();
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];
  if (Math.random() < level.random) return moves[Math.floor(Math.random() * moves.length)];

  const deadline = performance.now() + level.ms;
  const { negamax } = search(g, level, deadline);
  let ranked = moves.map((m) => ({ m, score: orderScore(m) })).sort((a, b) => b.score - a.score);
  let best = ranked[0].m;
  try {
    for (let depth = 1; depth <= level.depth; depth++) {
      let alpha = -MATE * 2;
      const scored: { m: Move; score: number }[] = [];
      for (const { m } of ranked) {
        g.make(m);
        let score: number;
        try {
          // Window is widened slightly so near-best moves get exact scores for the tie-break below.
          score = -negamax(depth - 1, -MATE * 2, -(alpha - 9), 1);
          // Don't walk into a draw by repetition when a normal move is available.
          const seen = g.keys.filter((k) => k === g.key()).length;
          if (seen >= 2) score = 0; else if (seen === 1) score = Math.trunc(score / 2);
        } finally { g.unmake(m); }
        scored.push({ m, score });
        if (score > alpha) alpha = score;
      }
      ranked = scored.sort((a, b) => b.score - a.score);
      // Among near-equal top moves pick one at random so games are not identical.
      const top = ranked.filter((r) => r.score >= ranked[0].score - 8);
      best = top[Math.floor(Math.random() * top.length)].m;
      if (ranked[0].score > MATE - 1000) { best = ranked[0].m; break; }
    }
  } catch (e) {
    if (!(e instanceof Timeout)) throw e;
  }
  return best;
}
