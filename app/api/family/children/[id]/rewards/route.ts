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

  const items = await prisma.rewardItem.findMany({ where: { childId: params.id }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const child = await getOwnedChild((session.user as any).id, params.id);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { difficulty, label } = await req.json();
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty." }, { status: 400 });
  }
  if (!label || !label.trim()) {
    return NextResponse.json({ error: "Please describe the reward." }, { status: 400 });
  }

  const item = await prisma.rewardItem.create({
    data: { childId: params.id, difficulty, label: label.trim() },
  });

  return NextResponse.json({ item });
}
