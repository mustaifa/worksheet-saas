import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const scans = await prisma.scannedWorksheet.findMany({
    where: { hostUserId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });

  return NextResponse.json({ scans });
}
