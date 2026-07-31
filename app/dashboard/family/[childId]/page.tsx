import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChildManager from "@/components/family/ChildManager";
import { getOwnedChild } from "@/lib/family";

export default async function ChildPage({ params }: { params: { childId: string } }) {
  const session = await getServerSession(authOptions);
  const child = await getOwnedChild((session!.user as any).id, params.childId);
  if (!child) notFound();

  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-8">
        <ChildManager
          childId={child.id}
          childName={child.name}
          childAvatar={child.avatar}
          childGrade={child.gradeDefault}
          childHasPin={!!child.pin}
        />
      </section>
    </main>
  );
}
