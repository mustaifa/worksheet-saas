import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedChild } from "@/lib/family";

export async function DELETE(req: Request, { params }: { params: { id: string; rewardId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const child = await getOwnedChild((session.user as any).id, params.id);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const item = await prisma.rewardItem.findUnique({ where: { id: params.rewardId } });
  if (!item || item.childId !== params.id) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.rewardItem.delete({ where: { id: params.rewardId } });
  return NextResponse.json({ success: true });
}
