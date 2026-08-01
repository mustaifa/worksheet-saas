import Link from "next/link";
import ViewerBoard from "@/components/whiteboard/ViewerBoard";

export const metadata = { title: "Whiteboard | Practice Sheet" };

export default function WhiteboardViewPage({ params }: { params: { code: string } }) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link href="/" className="font-bold text-slate-900 dark:text-white">Practice Sheet</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <ViewerBoard code={params.code.toUpperCase()} />
      </div>
    </main>
  );
}
