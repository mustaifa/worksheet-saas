"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { inputClass, labelClass } from "@/components/AuthParts";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/password-reset/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setSent(true);
      else setError(data.error || "We couldn't send the email just now. Please try again in a minute.");
    } catch {
      setError("We couldn't reach the server. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 w-full max-w-md mx-auto px-5 py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          {sent ? (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Check your email</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm leading-relaxed">
                If <strong>{email.trim()}</strong> has a Practice Sheet account, we&apos;ve sent it a link to choose a new password. The link expires in 1 hour.
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm leading-relaxed">
                Nothing after a few minutes? Check your spam folder, or <button type="button" onClick={() => setSent(false)} className="font-semibold underline">try again</button>. Signed up with Google? You can just use <Link href="/login" className="font-semibold underline">Log in with Google</Link>.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot your password?</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">Enter the email you signed up with and we&apos;ll send you a link to choose a new one.</p>
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <label htmlFor="fp-email" className={labelClass}>Email</label>
                  <input id="fp-email" name="email" type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                </div>
                {error && <div role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300">{error}</div>}
                <button type="submit" disabled={loading} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50">
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-6">
          Remembered it? <Link href="/login" className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Back to log in</Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
