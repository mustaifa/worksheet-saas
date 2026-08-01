import { prisma } from "@/lib/prisma";

const CODE_CHARS = "abcdefghijkmnpqrstuvwxyz23456789"; // lowercase, no 0/o/1/l — this is clicked, not typed, but still avoid ambiguous chars

function randomShareCode(length = 10): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export async function generateUniqueShareCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomShareCode();
    const existing = await prisma.customWorksheet.findUnique({ where: { shareCode: code } });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique share link — try again.");
}

export type WorksheetPage = { id: string; snapshot: string | null };

export async function getOwnedWorksheet(userId: string, worksheetId: string) {
  const ws = await prisma.customWorksheet.findUnique({ where: { id: worksheetId } });
  if (!ws || ws.hostUserId !== userId) return null;
  return ws;
}
