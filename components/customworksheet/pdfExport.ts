export async function exportPagesToPdf(pages: { snapshot: string | null }[], filename: string) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = 210, pageH = 297;
  const margin = 10;
  const drawableW = pageW - margin * 2;
  const drawableH = pageH - margin * 2;

  let addedAny = false;
  for (let i = 0; i < pages.length; i++) {
    const snap = pages[i].snapshot;
    if (!snap) continue;
    if (addedAny) pdf.addPage();
    pdf.addImage(snap, "PNG", margin, margin, drawableW, drawableH);
    addedAny = true;
  }
  if (!addedAny) {
    pdf.text("This worksheet doesn't have any content yet.", margin, margin + 10);
  }
  pdf.save(filename);
}
