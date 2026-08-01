import { Suspense } from "react";
import Link from "next/link";
import JoinBoardForm from "@/components/whiteboard/JoinBoardForm";

export const metadata = { title: "Join a Whiteboard | Practice Sheet" };

export default function WhiteboardJoinPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link href="/" className="font-bold text-slate-900 dark:text-white">Practice Sheet</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
          <JoinBoardForm />
        </Suspense>
      </div>
    </main>
  );
}
