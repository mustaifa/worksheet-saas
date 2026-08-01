import { prisma } from "@/lib/prisma";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I — avoids mix-ups

function randomCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

// Shared across every join-code feature (Live Quiz, Whiteboard, and anything
// added later) so the same 6-character code can never mean two different
// things — avoids confusion if a code gets shared out of context.
export async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    const [existingQuiz, existingBoard] = await Promise.all([
      prisma.liveSession.findUnique({ where: { code } }),
      prisma.whiteboard.findUnique({ where: { code } }),
    ]);
    if (!existingQuiz && !existingBoard) return code;
  }
  throw new Error("Could not generate a unique join code — try again.");
}
