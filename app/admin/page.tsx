import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    trialing: "bg-amber-100 text-amber-700",
    past_due: "bg-orange-100 text-orange-700",
    canceled: "bg-red-100 text-red-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const me = await prisma.user.findUnique({ where: { id: (session.user as any).id } });

  if (!me || (me as any).role !== "admin") {
    return (
      <main>
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="text-xl font-bold">Access denied</h1>
          <p className="text-slate-600 mt-2">This page is for admin accounts only.</p>
        </div>
      </main>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  const total = users.length;
  const trialing = users.filter((u) => u.subscriptionStatus === "trialing").length;
  const active = users.filter((u) => u.subscriptionStatus === "active").length;
  const churned = users.filter((u) => u.subscriptionStatus === "canceled" || u.subscriptionStatus === "past_due").length;
  const monthlyActive = users.filter((u) => u.subscriptionPlan === "monthly" && u.subscriptionStatus === "active").length;
  const yearlyActive = users.filter((u) => u.subscriptionPlan === "yearly" && u.subscriptionStatus === "active").length;
  const mrrEstimate = monthlyActive * 9 + yearlyActive * (79 / 12);

  // last 7 days of signups, for a quick trend read
  const last7 = users.filter((u) => Date.now() - new Date(u.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;

  return (
    <main>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mb-6">Visible to admin accounts only.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total users" value={total} />
          <StatCard label="Signups (7d)" value={last7} />
          <StatCard label="On trial" value={trialing} />
          <StatCard label="Active subs" value={active} />
          <StatCard label="Canceled/past due" value={churned} />
          <StatCard label="Est. MRR" value={`$${mrrEstimate.toFixed(0)}`} />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Signed up</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Plan</th>
                <th className="px-4 py-2 font-medium">Trial ends</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.name || "—"}</td>
                  <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2"><StatusBadge status={u.subscriptionStatus} /></td>
                  <td className="px-4 py-2">{u.subscriptionPlan || "—"}</td>
                  <td className="px-4 py-2">{new Date(u.trialEndsAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
