"use client";
import { useState } from "react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Could not open billing portal.");
  }

  return (
    <button onClick={openPortal} disabled={loading} className="underline text-sm font-medium disabled:opacity-50">
      {loading ? "Opening…" : "Manage billing"}
    </button>
  );
}
