import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_SNAPSHOT_SIZE = 3 * 1024 * 1024;

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const board = await prisma.whiteboard.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!board) return NextResponse.json({ error: "Board not found." }, { status: 404 });

  const { viewerId, snapshot } = await req.json();
  if (!viewerId || board.activeDrawerId !== viewerId) {
    return NextResponse.json({ error: "You don't have the pen right now." }, { status: 403 });
  }
  if (typeof snapshot !== "string" || !snapshot.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid snapshot." }, { status: 400 });
  }
  if (snapshot.length > MAX_SNAPSHOT_SIZE) {
    return NextResponse.json({ error: "Board image is too large." }, { status: 400 });
  }

  await prisma.whiteboard.update({ where: { id: board.id }, data: { snapshot } });
  return NextResponse.json({ success: true });
}
