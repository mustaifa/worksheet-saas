import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAccess, daysLeftInTrial } from "@/lib/access";
import Navbar from "@/components/Navbar";
import WorksheetGenerator from "@/components/WorksheetGenerator";
import UpgradeButtons from "@/components/UpgradeButtons";
import ManageBillingButton from "@/components/ManageBillingButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: (session!.user as any).id } });

  if (!user) {
    return (
      <main>
        <Navbar />
        <p className="text-center py-16">Something went wrong loading your account.</p>
      </main>
    );
  }

  const allowed = hasAccess(user);
  const trialing = user.subscriptionStatus === "trialing";
  const daysLeft = daysLeftInTrial(user);

  return (
    <main>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-8">
        {trialing && allowed && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
            You have {daysLeft} day{daysLeft === 1 ? "" : "s"} left in your free trial.{" "}
            <a href="/pricing" className="underline font-medium">Subscribe anytime</a> to keep access after it ends.
          </div>
        )}

        {user.subscriptionStatus === "active" && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm">
            <span>You're subscribed ({user.subscriptionPlan}). Thanks for supporting the project!</span>
            <ManageBillingButton />
          </div>
        )}

        {allowed ? (
          <WorksheetGenerator />
        ) : (
          <div className="text-center py-24">
            <h1 className="text-2xl font-bold">Your free trial has ended</h1>
            <p className="text-slate-600 mt-2">Subscribe to keep generating worksheets.</p>
            <div className="mt-8 max-w-md mx-auto">
              <UpgradeButtons />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
