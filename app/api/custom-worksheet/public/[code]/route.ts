import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const ws = await prisma.customWorksheet.findUnique({ where: { shareCode: params.code } });
  if (!ws) return NextResponse.json({ error: "Worksheet not found." }, { status: 404 });

  return NextResponse.json({
    title: ws.title,
    subject: ws.subject,
    grade: ws.grade,
    pages: ws.pages,
  });
}
