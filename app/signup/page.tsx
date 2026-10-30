"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isFreeMode } from "@/lib/access";
import { GoogleButton, OrDivider, PasswordField, inputClass, labelClass } from "@/components/AuthParts";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<{ text: string; login?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const freeMode = isFreeMode();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) setError({ text: "You already have an account with this email.", login: true });
        else setError({ text: data.error || "We couldn't create your account just now. Please try again in a minute." });
        return;
      }
      const result = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });
      if (result?.ok) router.push("/dashboard");
      else setError({ text: "Your account is ready, but we couldn't log you in automatically.", login: true });
    } catch {
      setError({ text: "We couldn't reach the server. Check your internet connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 w-full max-w-md mx-auto px-5 py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{freeMode ? "Create your free account" : "Start your free trial"}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">
            {freeMode ? "Free to use — no card needed during our launch." : `${process.env.NEXT_PUBLIC_TRIAL_DAYS || "7"} days free, no card required.`}
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>✓ Unlimited new worksheets at easy, medium or hard</li>
            <li>✓ Answer keys and PDF downloads for every sheet</li>
            <li>✓ Live class quizzes and family challenges</li>
          </ul>

          <div className="mt-6">
            <GoogleButton label="Sign up with Google" />
          </div>
          <OrDivider text="or sign up with email" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="su-name" className={labelClass}>Your name <span className="font-normal text-slate-400">(optional)</span></label>
              <input id="su-name" name="name" type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="su-email" className={labelClass}>Email</label>
              <input id="su-email" name="email" type="email" required autoComplete="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
            <PasswordField id="su-password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} autoComplete="new-password" minLength={8} hint="At least 8 characters." />
            {error && (
              <div role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {error.text} {error.login && <Link href="/login" className="font-semibold underline">Log in instead →</Link>}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50">
              {loading ? "Creating your account…" : "Create free account"}
            </button>
          </form>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            By creating an account you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>. Accounts are for parents and teachers; children don&apos;t need one.
          </p>
        </div>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-6">
          Already have an account? <Link href="/login" className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Log in</Link>
        </p>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
          Just want to print? <Link href="/worksheets" className="font-semibold hover:underline">Browse free worksheets</Link> — no account needed.
        </p>
      </section>
      <Footer />
    </main>
  );
}
