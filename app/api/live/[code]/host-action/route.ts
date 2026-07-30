import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const liveSession = await prisma.liveSession.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!liveSession || liveSession.hostUserId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { action } = await req.json();

  if (action === "start") {
    await prisma.liveSession.update({
      where: { id: liveSession.id },
      data: { status: "active", currentIndex: 0, showAnswer: false, startedAt: new Date() },
    });
  } else if (action === "reveal") {
    await prisma.liveSession.update({ where: { id: liveSession.id }, data: { showAnswer: true } });
  } else if (action === "next") {
    const nextIndex = liveSession.currentIndex + 1;
    if (nextIndex >= liveSession.questionCount) {
      await prisma.liveSession.update({
        where: { id: liveSession.id },
        data: { status: "finished", endedAt: new Date() },
      });
    } else {
      await prisma.liveSession.update({
        where: { id: liveSession.id },
        data: { currentIndex: nextIndex, showAnswer: false },
      });
    }
  } else if (action === "end") {
    await prisma.liveSession.update({ where: { id: liveSession.id }, data: { status: "finished", endedAt: new Date() } });
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
