"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { isFreeMode } from "@/lib/access";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const freeMode = isFreeMode();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (result?.ok) router.push("/dashboard");
    else setError("Account created, but sign-in failed — try logging in.");
  }

  return (
    <main>
      <Navbar />
      <section className="max-w-sm mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">{freeMode ? "Create your free account" : "Start your free trial"}</h1>
        <p className="text-slate-600 mt-1 text-sm">
          {freeMode ? "Free to use — no card, ever, during our launch." : `${process.env.NEXT_PUBLIC_TRIAL_DAYS || "7"} days free, no card required.`}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text" placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
          <input
            type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
          <input
            type="password" required minLength={8} placeholder="Password (min 8 characters)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create free account"}
          </button>
        </form>
      </section>
    </main>
  );
}
