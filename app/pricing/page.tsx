"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function PlanCard({
  title, price, period, plan, highlighted,
}: { title: string; price: string; period: string; plan: "monthly" | "yearly"; highlighted?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!session) { router.push("/signup"); return; }
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Something went wrong.");
  }

  return (
    <div className={`rounded-2xl border p-8 flex-1 ${highlighted ? "border-slate-900 shadow-lg" : "border-slate-200"}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-3xl font-bold">{price}<span className="text-base font-normal text-slate-500">/{period}</span></p>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="mt-6 w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "Redirecting…" : session ? "Subscribe" : "Sign up first"}
      </button>
    </div>
  );
}

export default function Pricing() {
  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-center">Simple pricing</h1>
        <p className="text-center text-slate-600 mt-2">
          Start with a free trial — no card required. Subscribe whenever you're ready.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
          <PlanCard title="Monthly" price="$9" period="month" plan="monthly" />
          <PlanCard title="Yearly" price="$79" period="year" plan="yearly" highlighted />
        </div>
      </section>
      <Footer />
    </main>
  );
}
