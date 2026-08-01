import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import CustomWorksheetEditor from "@/components/customworksheet/Editor";
import { getOwnedWorksheet } from "@/lib/customWorksheet";

export default async function EditWorksheetPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const ws = await getOwnedWorksheet((session!.user as any).id, params.id);
  if (!ws) notFound();

  return (
    <main>
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-8">
        <CustomWorksheetEditor id={ws.id} />
      </section>
    </main>
  );
}
