import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const scan = await prisma.scannedWorksheet.findUnique({ where: { id: params.id } });
  if (!scan || scan.hostUserId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ scan });
}
