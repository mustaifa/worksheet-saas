import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWorksheetPdfBuffer } from "@/lib/worksheetScanPdf";
import { ExtractedWorksheet } from "@/lib/worksheetScanTypes";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const scan = await prisma.scannedWorksheet.findUnique({ where: { id: params.id } });
  if (!scan || scan.hostUserId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const buffer = generateWorksheetPdfBuffer(scan.extractedData as unknown as ExtractedWorksheet);
  const filename = `${scan.title.replace(/[^a-z0-9]/gi, "-")}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
