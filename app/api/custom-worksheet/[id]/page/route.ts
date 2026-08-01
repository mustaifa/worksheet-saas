import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedWorksheet, WorksheetPage } from "@/lib/customWorksheet";

const MAX_SNAPSHOT_SIZE = 3 * 1024 * 1024;

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const ws = await getOwnedWorksheet((session.user as any).id, params.id);
  if (!ws) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { pageId, snapshot } = await req.json();
  if (typeof snapshot !== "string" || !snapshot.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid snapshot." }, { status: 400 });
  }
  if (snapshot.length > MAX_SNAPSHOT_SIZE) {
    return NextResponse.json({ error: "Page image is too large." }, { status: 400 });
  }

  const pages = (ws.pages as unknown as WorksheetPage[]).map((p) => (p.id === pageId ? { ...p, snapshot } : p));
  await prisma.customWorksheet.update({ where: { id: ws.id }, data: { pages: pages as any } });

  return NextResponse.json({ success: true });
}
