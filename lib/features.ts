/**
 * AI features (Homework helper + Worksheet scanner) are hidden unless this is
 * switched on. To turn them back on: in Vercel set NEXT_PUBLIC_AI_FEATURES=on
 * and redeploy (after adding Anthropic API credit).
 */
export const AI_FEATURES_ENABLED = process.env.NEXT_PUBLIC_AI_FEATURES === "on";

export const AI_PATHS = ["/dashboard/tutor", "/dashboard/worksheet-scan"];
