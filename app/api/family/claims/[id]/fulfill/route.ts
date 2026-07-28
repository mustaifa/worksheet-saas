import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const claim = await prisma.rewardClaim.findUnique({ where: { id: params.id }, include: { child: true } });
  if (!claim || claim.child.parentId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await prisma.rewardClaim.update({
    where: { id: params.id },
    data: { status: "fulfilled", fulfilledAt: new Date() },
  });

  return NextResponse.json({ claim: updated });
}
