import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const board = await prisma.whiteboard.findUnique({
    where: { code: params.code.toUpperCase() },
    include: { viewers: { orderBy: { joinedAt: "asc" } } },
  });
  if (!board) return NextResponse.json({ error: "Board not found." }, { status: 404 });

  return NextResponse.json({
    title: board.title,
    snapshot: board.snapshot,
    updatedAt: board.updatedAt,
    viewers: board.viewers.map((v) => ({ id: v.id, nickname: v.nickname })),
  });
}
