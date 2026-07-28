import { prisma } from "@/lib/prisma";

export async function getOwnedChild(userId: string, childId: string) {
  const child = await prisma.childProfile.findUnique({ where: { id: childId } });
  if (!child || child.parentId !== userId) return null;
  return child;
}
