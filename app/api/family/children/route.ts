import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const children = await prisma.childProfile.findMany({
    where: { parentId: (session.user as any).id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ children });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { name, avatar, gradeDefault, pin } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Please give your child a name." }, { status: 400 });
  }
  if (pin && !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: "PIN must be exactly 4 digits, or left blank." }, { status: 400 });
  }

  const child = await prisma.childProfile.create({
    data: {
      parentId: (session.user as any).id,
      name: name.trim(),
      avatar: avatar || "🧒",
      gradeDefault: gradeDefault ? Math.max(1, Math.min(12, parseInt(gradeDefault, 10))) : 3,
      pin: pin || null,
    },
  });

  return NextResponse.json({ child });
}
