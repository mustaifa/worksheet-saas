import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
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
        <Link
          href={`/chess?name=${encodeURIComponent(child.name)}`}
          className="mt-6 flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-slate-900 dark:hover:border-white hover:shadow-md transition-all"
        >
          <span className="text-4xl" aria-hidden="true">♞</span>
          <span>
            <span className="block font-semibold text-slate-900 dark:text-white">Play chess</span>
            <span className="block text-sm text-slate-500 dark:text-slate-400">Play the computer, or start a game and invite a brother, sister or friend with a code.</span>
          </span>
        </Link>
      </section>
    </main>
  );
}
