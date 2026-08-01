const CANVAS_ASPECT = 1200 / 675; // must match the drawing canvas's actual width/height ratio

export async function exportPagesToPdf(pages: { snapshot: string | null }[], filename: string) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF("l", "mm", "a4"); // landscape — matches the canvas's wide shape, portrait was squishing everything
  const pageW = 297, pageH = 210;
  const margin = 8;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;

  // fit the image within the page while preserving its actual proportions —
  // this is what was missing before, causing the stretched/distorted look
  let w = maxW, h = w / CANVAS_ASPECT;
  if (h > maxH) { h = maxH; w = h * CANVAS_ASPECT; }
  const x = margin + (maxW - w) / 2;
  const y = margin + (maxH - h) / 2;

  let addedAny = false;
  for (let i = 0; i < pages.length; i++) {
    const snap = pages[i].snapshot;
    if (!snap) continue;
    if (addedAny) pdf.addPage();
    pdf.addImage(snap, "PNG", x, y, w, h);
    addedAny = true;
  }
  if (!addedAny) {
    pdf.text("This worksheet doesn't have any content yet.", margin, margin + 10);
  }
  pdf.save(filename);
}
