import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Practice Sheet — Math, English & Science Worksheets, Grades 1–12",
  description: "Generate accurate, printable worksheets in seconds.",
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
