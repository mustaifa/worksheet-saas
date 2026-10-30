"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PasswordField } from "@/components/AuthParts";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState(token ? "" : "This page needs the link from your reset email.");
  const [expired, setExpired] = useState(!token);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/password-reset/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "We couldn't change your password just now. Please try again.");
        if (/expired|already used/i.test(data.error || "")) setExpired(true);
        return;
      }
      const result = await signIn("credentials", { email: data.email, password, redirect: false });
      router.push(result?.ok ? "/dashboard" : "/login");
    } catch {
      setError("We couldn't reach the server. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex-1 w-full max-w-md mx-auto px-5 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Choose a new password</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">After saving, we&apos;ll log you straight in.</p>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <PasswordField id="rp-password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} hint="At least 8 characters." />
          {error && (
            <div role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error} {expired && <Link href="/forgot-password" className="font-semibold underline">Get a new link →</Link>}
            </div>
          )}
          <button type="submit" disabled={loading || !token} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 disabled:opacity-50">
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>
      </div>
      <p className="text-center text-sm text-slate-600 dark:text-slate-300 mt-6">
        <Link href="/login" className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Back to log in</Link>
      </p>
    </section>
  );
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1" />}>
        <ResetForm />
      </Suspense>
      <Footer />
    </main>
  );
}
