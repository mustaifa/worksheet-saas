"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === "true";

/** Friendly text for the ?error= codes NextAuth adds when a sign-in fails. */
export function authErrorMessage(code: string | null): string {
  if (!code) return "";
  if (code === "CredentialsSignin") return "That email and password don't match. Check them and try again.";
  if (code === "OAuthAccountNotLinked") return "That email is already registered. Log in with your email and password below.";
  if (/OAuth|Callback|google/i.test(code)) return "Google sign-in didn't work just now. You can use your email and password below instead.";
  if (code === "SessionRequired") return "Please log in to continue.";
  return "Sign-in didn't work just now. Please use your email and password below.";
}

export function GoogleButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  if (!GOOGLE_ENABLED) return null;
  return (
    <button
      type="button"
      onClick={() => { setBusy(true); signIn("google", { callbackUrl: "/dashboard" }); }}
      disabled={busy}
      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 disabled:opacity-60"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59A9 9 0 009 0 9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
      {busy ? "Opening Google…" : label}
    </button>
  );
}

export function OrDivider({ text = "or use your email" }: { text?: string }) {
  if (!GOOGLE_ENABLED) return null;
  return (
    <div className="flex items-center gap-3 my-6" aria-hidden="true">
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      <span className="text-xs text-slate-500 dark:text-slate-400">{text}</span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
export const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1";

export function PasswordField({ id, value, onChange, autoComplete, minLength, hint }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string; minLength?: number; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>Password</label>
      <div className="relative">
        <input
          id={id} name="password" type={show ? "text" : "password"} required minLength={minLength} autoComplete={autoComplete}
          value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} pr-16`} aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" aria-label={show ? "Hide password" : "Show password"}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
