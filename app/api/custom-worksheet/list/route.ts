import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const worksheets = await prisma.customWorksheet.findMany({
    where: { hostUserId: (session.user as any).id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, subject: true, grade: true, shareCode: true, updatedAt: true, pages: true },
  });

  const withPageCount = worksheets.map((w) => ({
    ...w,
    pageCount: Array.isArray(w.pages) ? w.pages.length : 0,
    pages: undefined,
  }));

  return NextResponse.json({ worksheets: withPageCount });
}
