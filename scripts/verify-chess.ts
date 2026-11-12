/**
 * Checks the chess rules against published perft counts and the computer
 * opponent against a few simple positions. Run: npx -y tsx scripts/verify-chess.ts
 */
import { Chess, squareName } from "../lib/chess/engine";
import { bestMove, LEVELS } from "../lib/chess/ai";

let failed = 0;
const check = (name: string, got: unknown, want: unknown) => {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got}${ok ? "" : ` (expected ${want})`}`);
};

const PERFT: [string, string, number[]][] = [
  ["start", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [20, 400, 8902, 197281]],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", [48, 2039, 97862]],
  ["endgame", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", [14, 191, 2812, 43238]],
  ["promotions", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", [6, 264, 9467]],
  ["tricky", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", [44, 1486, 62379]],
  ["middlegame", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", [46, 2079, 89890]],
];
for (const [name, fen, counts] of PERFT) {
  const g = new Chess(fen);
  counts.forEach((want, i) => check(`perft ${name} depth ${i + 1}`, g.perft(i + 1), want));
  check(`perft ${name} leaves position unchanged`, new Chess(fen).key(), g.key());
}

// Notation and game-end detection.
{
  const g = new Chess();
  for (const [f, t] of [["f2", "f3"], ["e7", "e5"], ["g2", "g4"], ["d8", "h4"]]) {
    const sq = (n: string) => (n.charCodeAt(0) - 97) + (8 - Number(n[1])) * 8;
    g.move(g.find(sq(f), sq(t))!);
  }
  check("fool's mate notation", g.history.map((h) => h.san).join(" "), "f3 e5 g4 Qh4#");
  const st = g.status();
  check("fool's mate status", `${st.over} ${st.reason} ${st.winner}`, "true checkmate 1");
  g.undo();
  check("undo restores turn", g.turn, 1);
}
check("stalemate", new Chess("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1").status().reason, "stalemate");
check("insufficient material", new Chess("8/8/4k3/8/8/3KB3/8/8 w - - 0 1").status().reason, "insufficient material");
{
  const g = new Chess("4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
  const sans = g.legalMoves().map((m) => g.san(m));
  check("castling both sides offered", sans.includes("O-O") && sans.includes("O-O-O"), true);
}
{
  const g = new Chess("6k1/8/8/8/8/8/8/RN2KN1R w - - 0 1");
  check("disambiguation", g.legalMoves().map((m) => g.san(m)).includes("Nbd2"), true);
}

// Computer opponent: finds mate in one, takes a free queen, never returns an illegal move.
for (const lv of LEVELS.filter((l) => l.random === 0)) {
  const mate = new Chess("6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1");
  const m = bestMove(mate, lv.id)!;
  check(`${lv.name} finds mate in one`, squareName(m.from) + squareName(m.to), "a1a8");
  const hang = new Chess("4k3/8/8/3q4/4P3/8/8/4K3 w - - 0 1");
  const c = bestMove(hang, lv.id)!;
  check(`${lv.name} takes the free queen`, squareName(c.from) + squareName(c.to), "e4d5");
}
{
  // Self-play at each level: every move must be legal and the game must end or reach 120 moves.
  for (const lv of LEVELS) {
    const g = new Chess();
    let illegal = 0, t0 = Date.now(), slowest = 0;
    while (!g.status().over && g.history.length < (lv.id === 4 ? 30 : 120)) {
      const s = Date.now();
      const m = bestMove(g, lv.id);
      slowest = Math.max(slowest, Date.now() - s);
      if (!m || !g.legalMoves().some((x) => x.from === m.from && x.to === m.to && x.promo === m.promo)) { illegal++; break; }
      g.move(m);
    }
    check(`${lv.name} self-play illegal moves`, illegal, 0);
    console.log(`     ${lv.name}: ${g.history.length} moves in ${Date.now() - t0} ms, slowest move ${slowest} ms, ended: ${g.status().reason || "move limit"}`);
  }
}
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll chess checks passed");
process.exit(failed ? 1 : 0);
