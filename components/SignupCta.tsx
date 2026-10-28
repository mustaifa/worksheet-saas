"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Signed-in visitors go to their dashboard, everyone else to signup. Done on
// the client so the public worksheet pages can stay statically rendered.
export default function SignupCta({ label, className = "" }: { label: string; className?: string }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  return (
    <Link
      href={signedIn ? "/dashboard" : "/signup"}
      className={`inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-200 ${className}`}
    >
      {signedIn ? "Go to your dashboard" : label}
    </Link>
  );
}
