"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
      <Link href="/" className="font-bold text-lg text-slate-900">
        Practice Sheet
      </Link>
      <div className="flex items-center gap-5 text-sm">
        <Link href="/worksheets" className="text-slate-600 hover:text-slate-900">Worksheets</Link>
        <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
        {status === "authenticated" ? (
          <>
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
            <Link href="/admin" className="text-slate-400 hover:text-slate-900">Admin</Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-slate-600 hover:text-slate-900">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-slate-600 hover:text-slate-900">Log in</Link>
            <Link href="/signup" className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
              Start free trial
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
