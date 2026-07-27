import { prisma } from "@/lib/prisma";

const DAILY_LIMIT = parseInt(process.env.CHAT_DAILY_LIMIT || "25", 10);

export async function checkAndIncrementChatUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, remaining: 0 };

  const now = new Date();
  const resetAt = new Date((user as any).chatUsageResetAt);
  const isNewDay = now.toDateString() !== resetAt.toDateString();

  let used = isNewDay ? 0 : (user as any).chatMessagesUsedToday;

  if (used >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  used += 1;
  await prisma.user.update({
    where: { id: userId },
    data: {
      chatMessagesUsedToday: used,
      chatUsageResetAt: isNewDay ? now : (user as any).chatUsageResetAt,
    } as any,
  });

  return { allowed: true, remaining: DAILY_LIMIT - used };
}
