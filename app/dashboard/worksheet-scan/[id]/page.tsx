import Navbar from "@/components/Navbar";
import ScanPreview from "@/components/worksheetscan/ScanPreview";

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-8">
        <ScanPreview id={params.id} />
      </section>
    </main>
  );
}
