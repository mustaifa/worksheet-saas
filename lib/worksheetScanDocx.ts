import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, WidthType, BorderStyle, AlignmentType, ShadingType,
} from "docx";
import { ExtractedWorksheet } from "./worksheetScanTypes";

const CELL_BORDER = { style: BorderStyle.SINGLE, size: 2, color: "94A3B8" };
const BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

export async function generateWorksheetDocxBuffer(data: ExtractedWorksheet): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: data.title, bold: true, size: 40 })],
    })
  );

  const fields = data.studentInfoFields.length > 0 ? data.studentInfoFields : ["Name", "Date"];
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 300 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "0F172A" } },
      children: fields.map(
        (f, i) => new TextRun({ text: `${f}: ______________________${i < fields.length - 1 ? "    " : ""}`, size: 22 })
      ),
    })
  );

  for (const section of data.sections) {
    children.push(
      new Paragraph({
        spacing: { before: 300, after: 150 },
        children: [new TextRun({ text: `${section.number}. ${section.instructions}`, bold: true, size: 24 })],
      })
    );

    if (section.table) {
      const headerRow = new TableRow({
        children: section.table.headers.map(
          (h) =>
            new TableCell({
              borders: BORDERS,
              shading: { type: ShadingType.SOLID, color: "F1F5F9", fill: "F1F5F9" },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 20 })] })],
            })
        ),
      });
      const dataRows = section.table.rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  borders: BORDERS,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(cell), size: 20 })] })],
                })
            ),
          })
      );
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...dataRows] }));
      children.push(new Paragraph({ text: "" }));
    }

    if (section.chart) {
      // Word doesn't lend itself to drawing a real chart the way a PDF can —
      // this is a clearly labeled placeholder with the chart's actual data,
      // not a visual recreation. The PDF export draws the real chart axes.
      const c = section.chart;
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 50 },
          children: [new TextRun({ text: `📊 Chart: ${c.title} (draw axes: ${c.xLabel} vs ${c.yLabel}, 0–${c.yMax})`, italics: true, size: 20, color: "64748B" })],
        })
      );
      const chartRow = new TableRow({
        children: c.categories.map(
          (cat) =>
            new TableCell({
              borders: BORDERS,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: cat, size: 18 })] })],
            })
        ),
      });
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [chartRow] }));
      children.push(new Paragraph({ text: "" }));
    }

    for (const sq of section.subQuestions) {
      children.push(
        new Paragraph({
          spacing: { before: 120 },
          indent: { left: 300 },
          children: [new TextRun({ text: `${sq.label} ${sq.text}`, size: 22 })],
        })
      );
      if (sq.hint) {
        children.push(
          new Paragraph({
            indent: { left: 500 },
            children: [new TextRun({ text: sq.hint, italics: true, size: 19, color: "64748B" })],
          })
        );
      }
    }
  }

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}
