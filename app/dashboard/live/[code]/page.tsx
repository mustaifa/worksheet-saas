import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import HostPanel from "@/components/live/HostPanel";

export default async function HostSessionPage({ params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  const liveSession = await prisma.liveSession.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!liveSession || liveSession.hostUserId !== (session!.user as any).id) notFound();

  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-8">
        <HostPanel code={liveSession.code} />
      </section>
    </main>
  );
}
