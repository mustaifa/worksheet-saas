import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedChild } from "@/lib/family";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const child = await getOwnedChild((session.user as any).id, params.id);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { name, avatar, gradeDefault, pin } = await req.json();
  if (pin && !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: "PIN must be exactly 4 digits." }, { status: 400 });
  }

  const updated = await prisma.childProfile.update({
    where: { id: params.id },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(avatar ? { avatar } : {}),
      ...(gradeDefault ? { gradeDefault: Math.max(1, Math.min(12, parseInt(gradeDefault, 10))) } : {}),
      ...(pin !== undefined ? { pin: pin || null } : {}),
    },
  });

  return NextResponse.json({ child: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const child = await getOwnedChild((session.user as any).id, params.id);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.childProfile.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
