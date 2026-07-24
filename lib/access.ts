export type AccessUser = {
  subscriptionStatus: string;
  trialEndsAt: Date;
  currentPeriodEnd?: Date | null;
};

/**
 * A user has access if:
 *  - their subscription is active/past_due-but-still-in-grace and the current
 *    billing period hasn't ended yet, OR
 *  - they're still within their free trial window.
 */
export function hasAccess(user: AccessUser): boolean {
  const now = new Date();

  if (user.subscriptionStatus === "active") {
    if (user.currentPeriodEnd && user.currentPeriodEnd < now) return false;
    return true;
  }

  return now < new Date(user.trialEndsAt);
}

export function daysLeftInTrial(user: AccessUser): number {
  const ms = new Date(user.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
