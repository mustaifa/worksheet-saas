import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAnthropic } from "@/lib/aiHealth";

export const dynamic = "force-dynamic";

// Admin-only: reports whether the tutor/scanner can reach the Anthropic API.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!me || (me as any).role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const tutor = await checkAnthropic();
  const scanModel = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  const scanner = scanModel === tutor.model ? tutor : await checkAnthropic(scanModel);
  return NextResponse.json({ tutor, scanner });
}
