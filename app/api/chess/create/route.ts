import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { cleanName, ensureChessTable, newChessCode } from "@/lib/chess/online";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = cleanName(body.nickname);
  if (!name) return NextResponse.json({ error: "Please enter a name." }, { status: 400 });
  try {
    await ensureChessTable();
    // Tidy up: games nobody has touched for three days are removed.
    await prisma.chessMatch.deleteMany({ where: { updatedAt: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } } }).catch(() => {});
    const token = randomUUID();
    const match = await prisma.chessMatch.create({ data: { code: await newChessCode(), whiteName: name, whiteToken: token } });
    return NextResponse.json({ code: match.code, token, color: 0 });
  } catch (e) {
    console.error("chess create failed", e);
    return NextResponse.json({ error: "Online play is not available right now. Please try again in a moment." }, { status: 500 });
  }
}
