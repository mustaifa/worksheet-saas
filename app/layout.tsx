import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import GoogleAnalytics from "@/components/Analytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DEFAULT_DESCRIPTION =
  "Free printable Math, English & Science worksheets for grades 1–12, with answer keys that are checked by code — never guessed. Print or save as PDF in seconds.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Practice Sheet — Free Math, English & Science Worksheets, Grades 1–12",
    template: "%s | Practice Sheet",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    title: "Practice Sheet — Free Worksheets with Answer Keys, Grades 1–12",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  verification: {
    // Paste the content value Google Search Console gives you (Settings > Ownership verification > HTML tag method)
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

// Sets the dark/light class on <html> before paint, based on saved preference
// or system setting — avoids a flash of the wrong theme on load.
const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased transition-colors">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd
          data={[
            { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo-mark.png` },
            { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          ]}
        />
        <Providers>{children}</Providers>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
