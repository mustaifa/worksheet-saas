import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChallengeRunner from "@/components/family/ChallengeRunner";
import { getOwnedChild } from "@/lib/family";

export default async function ChallengePage({ params }: { params: { childId: string } }) {
  const session = await getServerSession(authOptions);
  const child = await getOwnedChild((session!.user as any).id, params.childId);
  if (!child) notFound();

  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-8">
        <ChallengeRunner childId={child.id} childName={child.name} childAvatar={child.avatar} defaultGrade={child.gradeDefault} />
      </section>
    </main>
  );
}
