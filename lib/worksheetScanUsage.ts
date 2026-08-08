import { prisma } from "@/lib/prisma";

const DAILY_LIMIT = parseInt(process.env.WORKSHEET_SCAN_DAILY_LIMIT || "10", 10);

export async function checkAndIncrementScanUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, remaining: 0 };

  const now = new Date();
  const resetAt = new Date((user as any).worksheetScanUsageResetAt);
  const isNewDay = now.toDateString() !== resetAt.toDateString();

  let used = isNewDay ? 0 : (user as any).worksheetScansUsedToday;

  if (used >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  used += 1;
  await prisma.user.update({
    where: { id: userId },
    data: {
      worksheetScansUsedToday: used,
      worksheetScanUsageResetAt: isNewDay ? now : (user as any).worksheetScanUsageResetAt,
    } as any,
  });

  return { allowed: true, remaining: DAILY_LIMIT - used };
}
