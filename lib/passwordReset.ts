/**
 * Password-reset links without a database table: the token is
 * userId.expiry.signature, signed with NEXTAUTH_SECRET over the user's
 * current password hash. Changing the password changes the hash, so a link
 * works once; it also expires after an hour.
 */
import { createHmac, timingSafeEqual } from "crypto";

const TTL_MS = 60 * 60 * 1000;

function sign(userId: string, expires: number, passwordHash: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return createHmac("sha256", secret).update(`${userId}.${expires}.${passwordHash}`).digest("base64url");
}

export function makeResetToken(userId: string, passwordHash: string, now = Date.now()): string {
  const expires = now + TTL_MS;
  return `${userId}.${expires}.${sign(userId, expires, passwordHash)}`;
}

/** Splits a token; returns null if it is malformed or expired (check the signature with verifyResetToken). */
export function parseResetToken(token: string, now = Date.now()): { userId: string; expires: number; sig: string } | null {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expires = Number(exp);
  if (!userId || !Number.isFinite(expires) || expires < now || !sig) return null;
  return { userId, expires, sig };
}

export function verifyResetToken(t: { userId: string; expires: number; sig: string }, passwordHash: string): boolean {
  const want = Buffer.from(sign(t.userId, t.expires, passwordHash));
  const got = Buffer.from(t.sig);
  return want.length === got.length && timingSafeEqual(want, got);
}
