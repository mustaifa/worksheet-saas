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
  const [showForm, setShowForm] = useState(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED !== "true");

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

        {process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === "true" && (
          <div className="mt-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59A9 9 0 009 0 9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-900 mt-4 underline"
              >
                Don't have a Google account? Log in with email instead
              </button>
            )}
          </div>
        )}

        {showForm && (
          <>
            {process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === "true" && (
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
          </>
        )}
      </section>
    </main>
  );
}
