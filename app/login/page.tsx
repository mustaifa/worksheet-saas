"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GOOGLE_ENABLED, GoogleButton, OrDivider, PasswordField, authErrorMessage, inputClass, labelClass } from "@/components/AuthParts";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  // NextAuth sends failed Google sign-ins back here as ?error=…
  const [error, setError] = useState(authErrorMessage(params.get("error")));
  const [loading, setLoading] = useState(false);
  // Where to go after logging in: the page the visitor asked for (same site only), else the dashboard.
  const asked = params.get("callbackUrl") || "";
  const next = asked.startsWith("/") && !asked.startsWith("//") ? asked : "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });
      if (result?.ok) router.push(next);
      else setError(`That email and password don't match.${GOOGLE_ENABLED ? " If you signed up with Google, use the Google button above." : ""}`);
    } catch {
      setError("We couldn't reach the server. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex-1 w-full max-w-md mx-auto px-5 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">Log in to your Practice Sheet account.</p>

        <div className="mt-6">
          <GoogleButton label="Log in with Google" callbackUrl={next} />
        </div>
        <OrDivider text="or log in with email" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="li-email" className={labelClass}>Email</label>
            <input id="li-email" name="email" type="email" required autoComplete="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <PasswordField id="li-password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} autoComplete="current-password" />
            <p className="text-right mt-1.5"><Link href="/forgot-password" className="text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:underline">Forgot password?</Link></p>
          </div>
          {error && (
            <div role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300">{error}</div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
      <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-6">
        New here? <Link href="/signup" className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Create a free account</Link>
      </p>
    </section>
  );
}

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1" />}>
        <LoginForm />
      </Suspense>
      <Footer />
    </main>
  );
}
