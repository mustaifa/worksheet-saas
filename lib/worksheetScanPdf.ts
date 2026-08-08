import { jsPDF } from "jspdf";
import { ExtractedWorksheet, ExtractedSection } from "./worksheetScanTypes";

const PAGE_W = 210, PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function generateWorksheetPdfBuffer(data: ExtractedWorksheet): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function ensureSpace(needed: number) {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  // ---- title + student info header ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(data.title, MARGIN, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 7;

  const fields = data.studentInfoFields.length > 0 ? data.studentInfoFields : ["Name", "Date"];
  const fieldWidth = CONTENT_W / fields.length;
  fields.forEach((f, i) => {
    doc.text(`${f}: ____________________`, MARGIN + i * fieldWidth, y);
  });
  y += 12;

  // ---- sections ----
  for (const section of data.sections) {
    ensureSpace(20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const instrLines: string[] = doc.splitTextToSize(`${section.number}. ${section.instructions}`, CONTENT_W - 6);
    ensureSpace(instrLines.length * 6 + 4);
    doc.text(instrLines, MARGIN, y);
    y += instrLines.length * 6 + 3;

    if (section.table) {
      y = drawTable(doc, section.table, MARGIN, y, CONTENT_W, ensureSpace);
      y += 4;
    }

    if (section.chart) {
      y = drawChart(doc, section.chart, MARGIN, y, CONTENT_W, ensureSpace);
      y += 6;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    for (const sq of section.subQuestions) {
      ensureSpace(14);
      const qLines: string[] = doc.splitTextToSize(`${sq.label} ${sq.text}`, CONTENT_W - 8);
      doc.text(qLines, MARGIN + 4, y);
      y += qLines.length * 5.5;
      if (sq.hint) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9.5);
        doc.setTextColor(100, 116, 139);
        const hintLines: string[] = doc.splitTextToSize(sq.hint, CONTENT_W - 12);
        ensureSpace(hintLines.length * 5);
        doc.text(hintLines, MARGIN + 8, y);
        y += hintLines.length * 5;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      }
      y += 3;
    }

    y += 6;
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

function drawTable(
  doc: jsPDF, table: { headers: string[]; rows: string[][] }, x: number, startY: number, width: number,
  ensureSpace: (n: number) => void
): number {
  let y = startY;
  const colW = width / table.headers.length;
  const rowH = 8;

  ensureSpace(rowH * (table.rows.length + 1) + 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  table.headers.forEach((h, i) => {
    doc.rect(x + i * colW, y, colW, rowH);
    doc.text(h, x + i * colW + colW / 2, y + rowH / 2 + 1.5, { align: "center" });
  });
  y += rowH;

  doc.setFont("helvetica", "normal");
  for (const row of table.rows) {
    row.forEach((cell, i) => {
      doc.rect(x + i * colW, y, colW, rowH);
      doc.text(String(cell), x + i * colW + colW / 2, y + rowH / 2 + 1.5, { align: "center" });
    });
    y += rowH;
  }

  return y;
}

function drawChart(
  doc: jsPDF, chart: NonNullable<ExtractedSection["chart"]>, x: number, startY: number, width: number,
  ensureSpace: (n: number) => void
): number {
  const chartH = 60;
  ensureSpace(chartH + 20);
  let y = startY + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(chart.title, x + width / 2, y, { align: "center" });
  y += 6;

  const axisLeft = x + 16;
  const axisBottom = y + chartH;
  const axisRight = x + width - 4;
  const axisTop = y;

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(axisLeft, axisTop, axisLeft, axisBottom); // y-axis
  doc.line(axisLeft, axisBottom, axisRight, axisBottom); // x-axis

  // gridlines + y-axis labels
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setDrawColor(226, 232, 240);
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const gy = axisBottom - (i / steps) * chartH;
    doc.line(axisLeft, gy, axisRight, gy);
    doc.text(String(Math.round((chart.yMax / steps) * i)), axisLeft - 3, gy + 1, { align: "right" });
  }

  // x-axis category labels
  const catW = (axisRight - axisLeft) / chart.categories.length;
  chart.categories.forEach((cat, i) => {
    doc.text(cat, axisLeft + catW * i + catW / 2, axisBottom + 5, { align: "center" });
  });

  doc.setFontSize(8);
  doc.text(chart.yLabel, axisLeft - 12, axisTop - 2);
  doc.text(chart.xLabel, x + width / 2, axisBottom + 11, { align: "center" });

  if (chart.legend && chart.legend.length > 0) {
    let lx = axisRight - chart.legend.length * 22;
    for (const label of chart.legend) {
      doc.setFillColor(203, 213, 225);
      doc.rect(lx, axisTop - 6, 3, 3, "F");
      doc.setFontSize(7);
      doc.text(label, lx + 4, axisTop - 3.5);
      lx += 22;
    }
  }

  return axisBottom + 14;
}
