import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOwnedChild } from "@/lib/family";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { childId, pin } = await req.json();
  const child = await getOwnedChild((session.user as any).id, childId);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (!child.pin) return NextResponse.json({ ok: true }); // no PIN set — nothing to check
  return NextResponse.json({ ok: child.pin === pin });
}
