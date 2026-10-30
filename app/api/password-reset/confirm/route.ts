import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { parseResetToken, verifyResetToken } from "@/lib/passwordReset";

const EXPIRED = "This reset link has expired or was already used. Please ask for a new one.";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json().catch(() => ({}));
    if (!password || String(password).length < 8) {
      return NextResponse.json({ error: "Please choose a password of at least 8 characters." }, { status: 400 });
    }
    const t = parseResetToken(token);
    if (!t) return NextResponse.json({ error: EXPIRED }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: t.userId } });
    if (!user || !verifyResetToken(t, user.passwordHash)) return NextResponse.json({ error: EXPIRED }, { status: 400 });
    const passwordHash = await bcrypt.hash(String(password), 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    return NextResponse.json({ ok: true, email: user.email });
  } catch (err) {
    console.error("Password reset confirm error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
