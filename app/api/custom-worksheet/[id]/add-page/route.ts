import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedWorksheet, WorksheetPage } from "@/lib/customWorksheet";
import { randomUUID } from "crypto";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const ws = await getOwnedWorksheet((session.user as any).id, params.id);
  if (!ws) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const pages = ws.pages as unknown as WorksheetPage[];
  if (pages.length >= 20) {
    return NextResponse.json({ error: "Worksheets are capped at 20 pages." }, { status: 400 });
  }
  const newPage: WorksheetPage = { id: randomUUID(), snapshot: null };
  const updated = [...pages, newPage];

  await prisma.customWorksheet.update({ where: { id: ws.id }, data: { pages: updated as any } });
  return NextResponse.json({ pages: updated });
}
