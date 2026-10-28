"use client";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";

const KEY = "ps-analytics-consent"; // "granted" | "denied"

// Screens children use directly — never tracked, and no banner shown.
const CHILD_ROUTES = [/^\/play(\/|$)/, /^\/dashboard\/family(\/|$)/, /^\/whiteboard\/[^/]+/, /^\/w\//];

function readConsent(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function writeConsent(v: "granted" | "denied") {
  try { localStorage.setItem(KEY, v); } catch { /* storage blocked: choice lasts for this visit only */ }
}

/** Opens the banner again (used by the footer "Cookie settings" link). */
export function openCookieSettings() {
  window.dispatchEvent(new Event("ps-open-cookie-settings"));
}

/**
 * Google Analytics, loaded only after the visitor accepts, never on children's
 * screens, with Google Signals and ad personalisation switched off.
 */
export default function Analytics() {
  const pathname = usePathname() || "/";
  const childScreen = CHILD_ROUTES.some((r) => r.test(pathname));
  const [consent, setConsent] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const firstView = useRef(true);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setShowBanner(!c);
    setReady(true);
    const reopen = () => setShowBanner(true);
    window.addEventListener("ps-open-cookie-settings", reopen);
    return () => window.removeEventListener("ps-open-cookie-settings", reopen);
  }, []);

  // Send a page view on client-side navigation (the first one is sent by config).
  useEffect(() => {
    const w = window as any;
    if (consent !== "granted" || childScreen) return;
    if (firstView.current) { firstView.current = false; return; } // sent by the init script
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", { page_path: pathname, page_location: window.location.href, page_title: document.title });
    }
  }, [pathname, consent, childScreen]);

  function choose(v: "granted" | "denied") {
    writeConsent(v);
    setConsent(v);
    setShowBanner(false);
    if (v === "denied") {
      // Stop a previously loaded tag from collecting for the rest of the visit.
      (window as any)[`ga-disable-${BRAND.gaMeasurementId}`] = true;
    }
  }

  const load = ready && consent === "granted" && !childScreen && !!BRAND.gaMeasurementId;

  return (
    <>
      {load && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${BRAND.gaMeasurementId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${BRAND.gaMeasurementId}', {
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              send_page_view: false
            });
            gtag('event', 'page_view', { page_path: location.pathname, page_location: location.href, page_title: document.title });
          `}</Script>
        </>
      )}

      {ready && showBanner && !childScreen && (
        <div role="dialog" aria-live="polite" aria-label="Cookie choice"
          className="print:hidden fixed z-50 bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Help us improve Practice Sheet?</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            With your OK we use Google Analytics cookies to see which worksheets and pages are useful. No ads, and never on
            children's quiz or challenge screens. <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => choose("granted")} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium">Accept</button>
            <button onClick={() => choose("denied")} className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-3 py-2 rounded-lg text-sm font-medium">No thanks</button>
          </div>
        </div>
      )}
    </>
  );
}
