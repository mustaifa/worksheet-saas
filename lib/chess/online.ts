/** Server-side helpers for online chess (two devices, join by code). */
import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/live";
import { Chess } from "./engine";

export type WireMove = [number, number, number];

// Schema changes on this project are applied by hand, so this feature creates
// its own table the first time it is used. Both statements are safe to repeat.
let ready: Promise<void> | null = null;
export function ensureChessTable(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ChessMatch" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "code" TEXT NOT NULL,
        "whiteName" TEXT NOT NULL,
        "blackName" TEXT,
        "whiteToken" TEXT NOT NULL,
        "blackToken" TEXT,
        "moves" TEXT NOT NULL DEFAULT '[]',
        "status" TEXT NOT NULL DEFAULT 'waiting',
        "result" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ChessMatch_code_key" ON "ChessMatch"("code")`);
    })().catch((e) => { ready = null; throw e; });
  }
  return ready;
}

/** A join code not used by a quiz, a whiteboard or another chess game. */
export async function newChessCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = await generateUniqueCode();
    if (!(await prisma.chessMatch.findUnique({ where: { code } }))) return code;
  }
  throw new Error("Could not generate a unique join code — try again.");
}

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.replace(/\s+/g, " ").trim().slice(0, 20);
  return name || null;
}

export function parseMoves(json: string): WireMove[] {
  try { const v = JSON.parse(json); return Array.isArray(v) ? v : []; } catch { return []; }
}

/** Rebuilds the position from the stored moves; null if the record is corrupt. */
export function replay(moves: WireMove[]): Chess | null {
  const g = new Chess();
  for (const [from, to, promo] of moves) {
    const m = g.find(from, to, promo);
    if (!m) return null;
    g.move(m);
  }
  return g;
}

/** What both players may see. Tokens never leave the server after being issued. */
export function publicState(m: { code: string; whiteName: string; blackName: string | null; moves: string; status: string; result: string | null }) {
  return { code: m.code, white: m.whiteName, black: m.blackName, moves: parseMoves(m.moves), status: m.status, result: m.result };
}
