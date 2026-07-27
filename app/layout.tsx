import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Practice Sheet — Math, English & Science Worksheets, Grades 1–12",
  description: "Generate accurate, printable worksheets in seconds.",
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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
