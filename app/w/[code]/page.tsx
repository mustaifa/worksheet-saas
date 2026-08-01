import Link from "next/link";
import PublicWorksheetViewer from "@/components/customworksheet/PublicViewer";

export const metadata = { title: "Shared Worksheet | Practice Sheet" };

export default function SharedWorksheetPage({ params }: { params: { code: string } }) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link href="/" className="font-bold text-slate-900 dark:text-white">Practice Sheet</Link>
      </div>
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <PublicWorksheetViewer code={params.code} />
      </div>
    </main>
  );
}
