import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTrialReminderEmail, sendTrialEndedEmail } from "@/lib/email";

// Vercel Cron automatically sends this header when CRON_SECRET is set in project env vars.
function isAuthorized(req: Request) {
  if (!process.env.CRON_SECRET) return true; // no secret configured yet — allow (dev/local convenience)
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  // --- "2 days left" reminder ---
  const dueForReminder = await prisma.user.findMany({
    where: {
      subscriptionStatus: "trialing",
      trialEndsAt: { gt: now, lte: twoDaysFromNow },
      trialReminderSentAt: null,
    },
  });

  let remindersSent = 0;
  for (const user of dueForReminder) {
    const daysLeft = Math.max(1, Math.ceil((new Date(user.trialEndsAt).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
    const result = await sendTrialReminderEmail(user.email, user.name, daysLeft);
    if (result.ok || result.skipped) {
      await prisma.user.update({ where: { id: user.id }, data: { trialReminderSentAt: now } });
      remindersSent++;
    }
  }

  // --- "trial ended" email ---
  const dueForEndedEmail = await prisma.user.findMany({
    where: {
      subscriptionStatus: "trialing",
      trialEndsAt: { lte: now },
      trialEndedEmailSentAt: null,
    },
  });

  let endedEmailsSent = 0;
  for (const user of dueForEndedEmail) {
    const result = await sendTrialEndedEmail(user.email, user.name);
    if (result.ok || result.skipped) {
      await prisma.user.update({ where: { id: user.id }, data: { trialEndedEmailSentAt: now } });
      endedEmailsSent++;
    }
  }

  return NextResponse.json({ remindersSent, endedEmailsSent });
}
