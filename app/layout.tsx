import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Practice Sheet — Worksheets for Grades 1–8",
  description: "Generate accurate, printable math worksheets in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
