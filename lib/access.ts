export type AccessUser = {
  subscriptionStatus: string;
  trialEndsAt: Date;
  currentPeriodEnd?: Date | null;
};

/**
 * Master switch: set NEXT_PUBLIC_FREE_MODE=true in your environment
 * variables to give every signed-in user full access, no payment or trial
 * limit involved — useful for a free launch period to drive traffic.
 * All Stripe/billing code stays completely intact underneath; flipping
 * this back to false restores the normal trial + paywall behavior
 * instantly, with no other code changes needed.
 */
export function isFreeMode(): boolean {
  return process.env.NEXT_PUBLIC_FREE_MODE === "true";
}

/**
 * A user has access if:
 *  - free mode is on (see isFreeMode above), OR
 *  - their subscription is active/past_due-but-still-in-grace and the current
 *    billing period hasn't ended yet, OR
 *  - they're still within their free trial window.
 */
export function hasAccess(user: AccessUser): boolean {
  if (isFreeMode()) return true;

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
