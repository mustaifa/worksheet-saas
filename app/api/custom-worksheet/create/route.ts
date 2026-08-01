import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueShareCode, WorksheetPage } from "@/lib/customWorksheet";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { title, subject, grade } = await req.json();
  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Please give the worksheet a title." }, { status: 400 });
  }

  const shareCode = await generateUniqueShareCode();
  const initialPages: WorksheetPage[] = [{ id: randomUUID(), snapshot: null }];

  const ws = await prisma.customWorksheet.create({
    data: {
      hostUserId: (session.user as any).id,
      title: title.trim(),
      subject: subject || null,
      grade: grade ? parseInt(grade, 10) : null,
      shareCode,
      pages: initialPages as any,
    },
  });

  return NextResponse.json({ id: ws.id });
}
