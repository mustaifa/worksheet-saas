import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const board = await prisma.whiteboard.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!board) return NextResponse.json({ error: "Board not found. Check the code and try again." }, { status: 404 });

  const { nickname } = await req.json();
  if (!nickname || !nickname.trim()) {
    return NextResponse.json({ error: "Please enter a name." }, { status: 400 });
  }
  if (nickname.trim().length > 20) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }

  const viewer = await prisma.whiteboardViewer.create({
    data: { whiteboardId: board.id, nickname: nickname.trim() },
  });

  return NextResponse.json({ viewerId: viewer.id });
}
