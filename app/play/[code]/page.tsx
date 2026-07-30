import Link from "next/link";
import PlayerView from "@/components/live/PlayerView";

export const metadata = { title: "Live Quiz | Practice Sheet" };

export default function PlayCodePage({ params }: { params: { code: string } }) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link href="/" className="font-bold text-slate-900 dark:text-white">Practice Sheet</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <PlayerView code={params.code.toUpperCase()} />
      </div>
    </main>
  );
}
