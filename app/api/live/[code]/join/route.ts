import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const liveSession = await prisma.liveSession.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!liveSession) return NextResponse.json({ error: "Session not found. Check the code and try again." }, { status: 404 });
  if (liveSession.status === "finished") {
    return NextResponse.json({ error: "This quiz has already ended." }, { status: 400 });
  }

  const { nickname } = await req.json();
  if (!nickname || !nickname.trim()) {
    return NextResponse.json({ error: "Please enter a name." }, { status: 400 });
  }
  if (nickname.trim().length > 20) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }

  const participant = await prisma.liveParticipant.create({
    data: { sessionId: liveSession.id, nickname: nickname.trim() },
  });

  return NextResponse.json({ participantId: participant.id });
}
