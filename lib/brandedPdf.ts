"use client";
/**
 * Builds a real (text, not screenshot) PDF of a worksheet with Practice Sheet
 * branding: logo + name in the header, site and page numbers in the footer,
 * Name/Date lines, as many pages as needed, and an optional answer-key page.
 * Uses a bundled DejaVu Sans subset so symbols like √ π ≈ θ Ω ₂ → render.
 */
import type { jsPDF as JsPDF } from "jspdf";
import { BRAND } from "./brand";

export type PdfQuestion = { q: string; a: string };
export type WorksheetPdfOptions = {
  title: string;
  meta: string; // e.g. "Grade 6 · Math · Medium · 10 questions"
  questions: PdfQuestion[];
  passage?: { title?: string; text: string } | null;
  includeAnswerKey?: boolean;
  filename: string;
};

const PAGE_W = 210, PAGE_H = 297, M = 16, CONTENT_W = PAGE_W - M * 2;
const HEADER_Y = 12, BODY_TOP = 26, FOOTER_Y = PAGE_H - 10;

let assets: Promise<{ regular: string; bold: string; logo: string | null }> | null = null;

async function toBase64(url: string): Promise<string> {
  const buf = await (await fetch(url)).arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function loadAssets() {
  if (!assets) {
    assets = Promise.all([
      toBase64("/fonts/DejaVuSans.ttf"),
      toBase64("/fonts/DejaVuSans-Bold.ttf"),
      toBase64(BRAND.logoPath).then((b) => `data:image/png;base64,${b}`).catch(() => null),
    ]).then(([regular, bold, logo]) => ({ regular, bold, logo }));
    assets.catch(() => { assets = null; }); // allow a retry after a network error
  }
  return assets;
}

function setupFonts(doc: JsPDF, a: { regular: string; bold: string }) {
  doc.addFileToVFS("DejaVuSans.ttf", a.regular);
  doc.addFont("DejaVuSans.ttf", "DejaVu", "normal");
  doc.addFileToVFS("DejaVuSans-Bold.ttf", a.bold);
  doc.addFont("DejaVuSans-Bold.ttf", "DejaVu", "bold");
  doc.setFont("DejaVu", "normal");
}

function drawHeader(doc: JsPDF, logo: string | null) {
  // Restore the caller's text settings afterwards — the header is drawn in
  // the middle of laying out a question when a new page starts.
  const size = doc.getFontSize(), font = doc.getFont(), color = doc.getTextColor();
  let x = M;
  if (logo) { doc.addImage(logo, "PNG", M, HEADER_Y - 5, 7, 7); x += 9; }
  doc.setFont("DejaVu", "bold"); doc.setFontSize(11); doc.setTextColor(15, 23, 42);
  doc.text(BRAND.name, x, HEADER_Y);
  doc.setFont("DejaVu", "normal"); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139);
  doc.text(BRAND.domain, PAGE_W - M, HEADER_Y, { align: "right" });
  doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
  doc.line(M, HEADER_Y + 4, PAGE_W - M, HEADER_Y + 4);
  doc.setFont(font.fontName, font.fontStyle); doc.setFontSize(size); doc.setTextColor(color);
}

function drawFooters(doc: JsPDF) {
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
    doc.line(M, FOOTER_Y - 5, PAGE_W - M, FOOTER_Y - 5);
    doc.setFont("DejaVu", "normal"); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
    doc.text(`${BRAND.tagline} · ${BRAND.domain}`, M, FOOTER_Y);
    doc.text(`Page ${i} of ${n}`, PAGE_W - M, FOOTER_Y, { align: "right" });
  }
}

export async function downloadWorksheetPdf(o: WorksheetPdfOptions) {
  const [{ jsPDF }, a] = await Promise.all([import("jspdf"), loadAssets()]);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  setupFonts(doc, a);
  doc.setProperties({
    title: `${o.title} — ${o.meta}`,
    subject: "Worksheet",
    author: BRAND.name,
    creator: `${BRAND.name} — ${BRAND.domain}`,
    keywords: `worksheet, answer key, ${o.meta}`,
  });

  let y = BODY_TOP;
  const newPage = () => { doc.addPage(); drawHeader(doc, a.logo); y = BODY_TOP; };
  const ensure = (h: number) => { if (y + h > FOOTER_Y - 10) newPage(); };
  drawHeader(doc, a.logo);

  // Title block
  doc.setFont("DejaVu", "bold"); doc.setFontSize(18); doc.setTextColor(15, 23, 42);
  const titleLines: string[] = doc.splitTextToSize(o.title, CONTENT_W);
  doc.text(titleLines, M, y + 4); y += titleLines.length * 7.5 + 2;
  doc.setFont("DejaVu", "normal"); doc.setFontSize(9.5); doc.setTextColor(100, 116, 139);
  doc.text(o.meta, M, y + 2); y += 8;
  doc.setTextColor(51, 65, 85); doc.setFontSize(10.5);
  doc.text("Name:", M, y + 2); doc.line(M + 13, y + 2.6, M + 85, y + 2.6);
  doc.text("Date:", M + 100, y + 2); doc.line(M + 111, y + 2.6, PAGE_W - M, y + 2.6);
  y += 7;
  doc.setDrawColor(15, 23, 42); doc.setLineWidth(0.6); doc.line(M, y, PAGE_W - M, y); y += 7;

  // Reading passage
  if (o.passage?.text) {
    doc.setFontSize(10.5); doc.setTextColor(15, 23, 42);
    if (o.passage.title) { ensure(8); doc.setFont("DejaVu", "bold"); doc.text(o.passage.title, M, y); y += 6; }
    doc.setFont("DejaVu", "normal");
    for (const line of doc.splitTextToSize(o.passage.text, CONTENT_W) as string[]) { ensure(5.5); doc.text(line, M, y); y += 5.2; }
    y += 5;
  }

  // Questions, each followed by a writing line
  doc.setTextColor(15, 23, 42);
  o.questions.forEach((item, i) => {
    doc.setFontSize(11);
    const lines: string[] = doc.splitTextToSize(item.q, CONTENT_W - 10);
    ensure(lines.length * 5.5 + 11);
    doc.setFont("DejaVu", "bold"); doc.setTextColor(148, 163, 184); doc.text(`${i + 1}.`, M, y);
    doc.setFont("DejaVu", "normal"); doc.setTextColor(15, 23, 42);
    doc.text(lines, M + 9, y);
    y += lines.length * 5.5 + 4;
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.line(M + 9, y, M + 110, y);
    y += 8;
  });

  // Answer key on its own page
  if (o.includeAnswerKey) {
    newPage();
    doc.setFont("DejaVu", "bold"); doc.setFontSize(15); doc.setTextColor(15, 23, 42);
    doc.text(`Answer key — ${o.title}`, M, y + 2); y += 8;
    doc.setFont("DejaVu", "normal"); doc.setFontSize(9.5); doc.setTextColor(100, 116, 139);
    doc.text(o.meta, M, y); y += 8;
    o.questions.forEach((item, i) => {
      doc.setFontSize(10.5);
      const lines: string[] = doc.splitTextToSize(item.a, CONTENT_W - 10);
      ensure(lines.length * 5 + 3);
      doc.setFont("DejaVu", "bold"); doc.setTextColor(148, 163, 184); doc.text(`${i + 1}.`, M, y);
      doc.setFont("DejaVu", "normal"); doc.setTextColor(15, 23, 42); doc.text(lines, M + 9, y);
      y += lines.length * 5 + 3;
    });
  }

  drawFooters(doc);
  doc.save(o.filename);
}
