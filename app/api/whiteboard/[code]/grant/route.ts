import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const board = await prisma.whiteboard.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!board || board.hostUserId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { viewerId } = await req.json(); // null/undefined revokes, back to host-only

  if (viewerId) {
    const viewer = await prisma.whiteboardViewer.findUnique({ where: { id: viewerId } });
    if (!viewer || viewer.whiteboardId !== board.id) {
      return NextResponse.json({ error: "That student isn't in this session." }, { status: 400 });
    }
  }

  await prisma.whiteboard.update({ where: { id: board.id }, data: { activeDrawerId: viewerId || null } });
  return NextResponse.json({ success: true });
}
