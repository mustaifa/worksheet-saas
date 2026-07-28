import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedChild } from "@/lib/family";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const child = await getOwnedChild((session.user as any).id, params.id);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [claims, attempts] = await Promise.all([
    prisma.rewardClaim.findMany({
      where: { childId: params.id },
      include: { attempt: { select: { subject: true, topic: true, difficulty: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.challengeAttempt.findMany({
      where: { childId: params.id, status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return NextResponse.json({ claims, attempts });
}
