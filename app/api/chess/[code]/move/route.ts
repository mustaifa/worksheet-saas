import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureChessTable, parseMoves, publicState, replay } from "@/lib/chess/online";

export const dynamic = "force-dynamic";

const SIDES = ["white", "black"];
const sq = (v: unknown) => (Number.isInteger(v) && (v as number) >= 0 && (v as number) < 64 ? (v as number) : -1);

/** Plays a move (or resigns) for the player holding `token`. The server checks every move. */
export async function POST(req: Request, { params }: { params: { code: string } }) {
  const body = await req.json().catch(() => ({}));
  try {
    await ensureChessTable();
    const match = await prisma.chessMatch.findUnique({ where: { code: params.code.toUpperCase() } });
    if (!match) return NextResponse.json({ error: "Game not found." }, { status: 404 });
    const color = body.token && body.token === match.whiteToken ? 0 : body.token && body.token === match.blackToken ? 1 : -1;
    if (color < 0) return NextResponse.json({ error: "You are not a player in this game." }, { status: 403 });
    if (match.status === "waiting") return NextResponse.json({ error: "Waiting for the other player to join." }, { status: 409 });
    if (match.status !== "active") return NextResponse.json({ error: "This game is over." }, { status: 409 });

    if (body.resign === true) {
      const done = await prisma.chessMatch.update({ where: { id: match.id }, data: { status: "over", result: `${SIDES[1 - color]}:resignation` } });
      return NextResponse.json(publicState(done));
    }

    const moves = parseMoves(match.moves);
    const g = replay(moves);
    if (!g) return NextResponse.json({ error: "This game could not be loaded." }, { status: 500 });
    if (g.turn !== color) return NextResponse.json({ error: "It is not your turn." }, { status: 409 });
    const from = sq(body.from), to = sq(body.to), promo = [0, 2, 3, 4, 5].includes(body.promo) ? body.promo : 0;
    const m = from < 0 || to < 0 ? undefined : g.find(from, to, promo);
    if (!m) return NextResponse.json({ error: "That move is not allowed." }, { status: 400 });
    g.move(m);
    const st = g.status();
    const data = {
      moves: JSON.stringify([...moves, [m.from, m.to, m.promo]]),
      status: st.over ? "over" : "active",
      result: st.over ? (st.winner !== null ? `${SIDES[st.winner]}:checkmate` : `draw:${st.reason}`) : null,
    };
    // Only applies if nobody else changed the game in the meantime.
    const saved = await prisma.chessMatch.updateMany({ where: { id: match.id, moves: match.moves, status: "active" }, data });
    if (saved.count === 0) return NextResponse.json({ error: "The game changed. Please try again." }, { status: 409 });
    return NextResponse.json(publicState({ ...match, ...data }));
  } catch (e) {
    console.error("chess move failed", e);
    return NextResponse.json({ error: "Could not play that move. Please try again." }, { status: 500 });
  }
}
