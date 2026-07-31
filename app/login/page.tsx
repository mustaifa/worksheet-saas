"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (result?.ok) router.push("/dashboard");
    else setError("Incorrect email or password.");
  }

  return (
    <main>
      <Navbar />
      <section className="max-w-sm mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
          <input
            type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}
