"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { isFreeMode } from "@/lib/access";

type NavItem = { href: string; label: string; desc?: string };

// Visitors: what the site offers and who it's for.
const PUBLIC_LINKS: NavItem[] = [
  { href: "/worksheets", label: "Free worksheets" },
  { href: "/teachers", label: "Teachers" },
  { href: "/parents", label: "Parents" },
  { href: "/students", label: "Students" },
  { href: "/blog", label: "Blog" },
];

// Signed-in: the everyday tool first, classroom extras grouped under "Tools".
const APP_LINKS: NavItem[] = [
  { href: "/dashboard", label: "Create worksheet" },
  { href: "/dashboard/family", label: "Family" },
  { href: "/dashboard/tutor", label: "Homework help" },
  { href: "/worksheets", label: "Library" },
  { href: "/blog", label: "Blog" },
];
const TOOL_LINKS: NavItem[] = [
  { href: "/dashboard/live", label: "Live Quiz", desc: "Run a quiz students join from their own devices" },
  { href: "/dashboard/whiteboard", label: "Whiteboard", desc: "Draw live for a class, students join with a code" },
  { href: "/dashboard/custom-worksheet", label: "Custom worksheet", desc: "Type or draw your own worksheet, export to PDF" },
  { href: "/dashboard/worksheet-scan", label: "Scan a worksheet", desc: "Turn a photo of a worksheet into a clean PDF" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

const mobileCls = (active: boolean) =>
  `block px-3 py-3 rounded-lg text-base font-medium ${
    active ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
  }`;

const linkCls = (active: boolean) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    active
      ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
  }`;

/** Small dropdown that closes on outside click, Escape, or navigation. */
function Dropdown({ label, children, align = "left" }: { label: React.ReactNode; children: React.ReactNode; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={`${linkCls(false)} inline-flex items-center gap-1`}>
        {label}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl p-2 z-50`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname() || "/";
  const freeMode = isFreeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const signedIn = status === "authenticated";
  const isAdmin = (session?.user as any)?.role === "admin";
  const name = session?.user?.name?.split(" ")[0] || "Account";

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const primary = signedIn ? APP_LINKS : PUBLIC_LINKS;

  return (
    <>
    <header className="print:hidden sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 h-16" aria-label="Main">
        <Link href={signedIn ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white shrink-0">
          <img src="/logo-mark.png" alt="" width={28} height={28} className="rounded-md" />
          Practice Sheet
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {signedIn ? (
            <>
              <Link href="/dashboard" className={linkCls(isActive(pathname, "/dashboard"))}>Create worksheet</Link>
              <Dropdown label="Tools">
                {TOOL_LINKS.map((t) => (
                  <Link key={t.href} href={t.href} className="block rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-900">
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">{t.label}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</span>
                  </Link>
                ))}
              </Dropdown>
              {APP_LINKS.slice(1).map((l) => <Link key={l.href} href={l.href} className={linkCls(isActive(pathname, l.href))}>{l.label}</Link>)}
            </>
          ) : (
            PUBLIC_LINKS.map((l) => <Link key={l.href} href={l.href} className={linkCls(isActive(pathname, l.href))}>{l.label}</Link>)
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            {signedIn ? (
              <Dropdown label={name} align="right">
                {!freeMode && <Link href="/pricing" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900">Plan & billing</Link>}
                {isAdmin && <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900">Admin</Link>}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900">Sign out</button>
              </Dropdown>
            ) : status !== "loading" ? (
              <>
                <Link href="/login" className={linkCls(false)}>Log in</Link>
                <Link href="/signup" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-200">
                  {freeMode ? "Sign up free" : "Start free trial"}
                </Link>
              </>
            ) : null}
          </div>
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>
    </header>

      {/* Mobile menu panel — outside <header>: its backdrop blur would otherwise
          become the containing block for this fixed panel and clip it. */}
      {menuOpen && (
        <div id="mobile-menu" className="print:hidden lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="px-4 py-4 space-y-1">
            {primary.map((l) => (
              <Link key={l.href} href={l.href} className={mobileCls(isActive(pathname, l.href))}>{l.label}</Link>
            ))}
            {signedIn && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Classroom tools</p>
                {TOOL_LINKS.map((t) => (
                  <Link key={t.href} href={t.href} className={mobileCls(isActive(pathname, t.href))}>
                    <span className="block">{t.label}</span>
                    <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">{t.desc}</span>
                  </Link>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 space-y-1">
                  {!freeMode && <Link href="/pricing" className={mobileCls(false)}>Plan & billing</Link>}
                  {isAdmin && <Link href="/admin" className={mobileCls(isActive(pathname, "/admin"))}>Admin</Link>}
                  <button onClick={() => signOut({ callbackUrl: "/" })} className={`${mobileCls(false)} w-full text-left`}>Sign out</button>
                </div>
              </>
            )}
            {!signedIn && (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link href="/login" className="text-center px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-medium text-slate-900 dark:text-white">Log in</Link>
                <Link href="/signup" className="text-center px-4 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium">
                  {freeMode ? "Sign up free" : "Start free trial"}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
