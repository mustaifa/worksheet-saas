import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWorksheetDocxBuffer } from "@/lib/worksheetScanDocx";
import { ExtractedWorksheet } from "@/lib/worksheetScanTypes";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const scan = await prisma.scannedWorksheet.findUnique({ where: { id: params.id } });
  if (!scan || scan.hostUserId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const buffer = await generateWorksheetDocxBuffer(scan.extractedData as unknown as ExtractedWorksheet);
  const filename = `${scan.title.replace(/[^a-z0-9]/gi, "-")}.docx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
