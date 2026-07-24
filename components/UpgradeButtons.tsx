"use client";
import { useState } from "react";

export default function UpgradeButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(plan: "monthly" | "yearly") {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Something went wrong.");
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => subscribe("monthly")}
        disabled={loading !== null}
        className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50"
      >
        {loading === "monthly" ? "Redirecting…" : "Monthly — $9/mo"}
      </button>
      <button
        onClick={() => subscribe("yearly")}
        disabled={loading !== null}
        className="flex-1 border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-100 disabled:opacity-50"
      >
        {loading === "yearly" ? "Redirecting…" : "Yearly — $79/yr"}
      </button>
    </div>
  );
}
