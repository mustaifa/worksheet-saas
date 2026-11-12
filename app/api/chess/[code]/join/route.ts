import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { cleanName, ensureChessTable } from "@/lib/chess/online";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const body = await req.json().catch(() => ({}));
  const name = cleanName(body.nickname);
  if (!name) return NextResponse.json({ error: "Please enter a name." }, { status: 400 });
  try {
    await ensureChessTable();
    const match = await prisma.chessMatch.findUnique({ where: { code: params.code.toUpperCase() } });
    if (!match) return NextResponse.json({ error: "Game not found. Check the code and try again." }, { status: 404 });
    const token = randomUUID();
    // Only succeeds if the second seat is still empty, so two people can't both take it.
    const taken = await prisma.chessMatch.updateMany({
      where: { id: match.id, blackToken: null, status: "waiting" },
      data: { blackName: name, blackToken: token, status: "active" },
    });
    if (taken.count === 0) return NextResponse.json({ error: "This game already has two players." }, { status: 409 });
    return NextResponse.json({ code: match.code, token, color: 1 });
  } catch (e) {
    console.error("chess join failed", e);
    return NextResponse.json({ error: "Online play is not available right now. Please try again in a moment." }, { status: 500 });
  }
}
