import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAccess } from "@/lib/access";
import { checkAndIncrementScanUsage } from "@/lib/worksheetScanUsage";
import { extractWorksheetFromImage } from "@/lib/worksheetScanAI";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // ~8MB of base64

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user || !hasAccess(user)) {
    return NextResponse.json({ error: "Your trial or subscription isn't active." }, { status: 403 });
  }

  const { image } = await req.json();
  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "Please upload a valid image." }, { status: 400 });
  }
  if (image.length > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "That image is too large — try a smaller photo." }, { status: 400 });
  }

  const usage = await checkAndIncrementScanUsage(user.id);
  if (!usage.allowed) {
    return NextResponse.json({ error: "You've reached today's worksheet-scan limit. Try again tomorrow." }, { status: 429 });
  }

  const match = image.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Could not read that image file." }, { status: 400 });
  }
  const [, mediaType, base64Data] = match;

  const result = await extractWorksheetFromImage(base64Data, mediaType);
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error || "Extraction failed." }, { status: 500 });
  }

  const scan = await prisma.scannedWorksheet.create({
    data: {
      hostUserId: user.id,
      title: result.data.title,
      extractedData: result.data as any,
    },
  });

  return NextResponse.json({ id: scan.id, remaining: usage.remaining });
}
