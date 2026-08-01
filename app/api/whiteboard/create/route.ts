import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/live";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { title } = await req.json().catch(() => ({}));
  const code = await generateUniqueCode();

  const board = await prisma.whiteboard.create({
    data: {
      hostUserId: (session.user as any).id,
      code,
      title: title || null,
    },
  });

  return NextResponse.json({ code: board.code });
}
