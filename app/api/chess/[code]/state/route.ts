import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureChessTable, publicState } from "@/lib/chess/online";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  try {
    await ensureChessTable();
    const match = await prisma.chessMatch.findUnique({ where: { code: params.code.toUpperCase() } });
    if (!match) return NextResponse.json({ error: "Game not found." }, { status: 404 });
    return NextResponse.json(publicState(match), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("chess state failed", e);
    return NextResponse.json({ error: "Could not load the game." }, { status: 500 });
  }
}
