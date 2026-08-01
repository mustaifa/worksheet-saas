"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { isFreeMode } from "@/lib/access";

export default function Navbar() {
  const { data: session, status } = useSession();
  const freeMode = isFreeMode();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
        <img src="/logo-mark.png" alt="" width={28} height={28} className="rounded-md" />
        Practice Sheet
      </Link>
      <div className="flex items-center gap-5 text-sm">
        <Link href="/worksheets" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Worksheets</Link>
        <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Blog</Link>
        {!freeMode && <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Pricing</Link>}
        {status === "authenticated" ? (
          <>
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Dashboard</Link>
            <Link href="/dashboard/family" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Family</Link>
            <Link href="/dashboard/live" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Live Quiz</Link>
            <Link href="/dashboard/whiteboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Whiteboard</Link>
            <Link href="/dashboard/custom-worksheet" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Custom</Link>
            <Link href="/dashboard/tutor" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Tutor</Link>
            <Link href="/admin" className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white">Admin</Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Log in</Link>
            <Link href="/signup" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200">
              {freeMode ? "Sign up free" : "Start free trial"}
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
