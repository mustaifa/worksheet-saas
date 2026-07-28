import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAccess } from "@/lib/access";
import Navbar from "@/components/Navbar";
import FamilyDashboard from "@/components/family/FamilyDashboard";
import UpgradeButtons from "@/components/UpgradeButtons";

export default async function FamilyPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: (session!.user as any).id } });

  if (!user) {
    return <main><Navbar /><p className="text-center py-16">Something went wrong.</p></main>;
  }

  if (!hasAccess(user)) {
    return (
      <main>
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <h1 className="text-xl font-bold">Trial ended</h1>
          <p className="text-slate-600 mt-2 mb-6">Subscribe to keep using family challenges.</p>
          <UpgradeButtons />
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Family Challenges</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Set up a profile for each kid, pick a challenge, and reward them for doing well.
        </p>
        <FamilyDashboard />
      </section>
    </main>
  );
}
