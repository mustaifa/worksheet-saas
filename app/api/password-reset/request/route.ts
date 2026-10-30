import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/email";

// Light per-instance throttle so the form can't be used to flood an inbox.
const recent = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    const normalized = String(email || "").toLowerCase().trim();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const last = recent.get(normalized) || 0;
    if (Date.now() - last > 60_000) {
      recent.set(normalized, Date.now());
      const user = await prisma.user.findUnique({ where: { email: normalized } });
      if (user) await sendPasswordResetEmail(user.email, user.name, makeResetToken(user.id, user.passwordHash));
    }
    // Same answer whether or not the email has an account, so the form can't be used to look up accounts.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Password reset request error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
