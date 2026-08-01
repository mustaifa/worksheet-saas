import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SNAPSHOT_SIZE = 3 * 1024 * 1024; // ~3MB of base64, generous for a simple drawing

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const board = await prisma.whiteboard.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!board || board.hostUserId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { snapshot } = await req.json();
  if (typeof snapshot !== "string" || !snapshot.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid snapshot." }, { status: 400 });
  }
  if (snapshot.length > MAX_SNAPSHOT_SIZE) {
    return NextResponse.json({ error: "Board image is too large." }, { status: 400 });
  }

  await prisma.whiteboard.update({ where: { id: board.id }, data: { snapshot } });
  return NextResponse.json({ success: true });
}
