import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAccess } from "@/lib/access";
import { checkAndIncrementChatUsage } from "@/lib/chatUsage";
import { askTutor, ChatMessage } from "@/lib/anthropicChat";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user || !hasAccess(user)) {
    return NextResponse.json({ error: "Your trial or subscription isn't active." }, { status: 403 });
  }

  const { messages, grade } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }
  if (messages.length > 20) {
    return NextResponse.json({ error: "This conversation has gotten long — start a new chat." }, { status: 400 });
  }

  const usage = await checkAndIncrementChatUsage(user.id);
  if (!usage.allowed) {
    return NextResponse.json({ error: "You've reached today's tutor chat limit. Try again tomorrow." }, { status: 429 });
  }

  const result = await askTutor(messages as ChatMessage[], grade);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ reply: result.reply, remaining: usage.remaining });
}
