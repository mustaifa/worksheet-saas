import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import HostCanvas from "@/components/whiteboard/HostCanvas";

export default async function HostBoardPage({ params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  const board = await prisma.whiteboard.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!board || board.hostUserId !== (session!.user as any).id) notFound();

  return (
    <main>
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-8">
        <HostCanvas code={board.code} />
      </section>
    </main>
  );
}
