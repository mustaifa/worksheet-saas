"use client";
/**
 * Builds a real (text, not screenshot) PDF of a worksheet in the same
 * teacher-style layout as the on-screen sheet: subject band with a doodle,
 * score circle, Name/Class/Date, learning goal, directions, word bank,
 * numbered question cards with pictures, tick-box choices, answer boxes or
 * writing lines, a "How did I do?" self-check and an answer-key page.
 * Uses a bundled DejaVu Sans subset so symbols like √ π ≈ θ Ω ₂ → render.
 */
import type { jsPDF as JsPDF } from "jspdf";
import { BRAND } from "./brand";
import type { WorksheetLayout, LaidOutQuestion } from "./worksheetLayout";
import { splitBlanks } from "./worksheetLayout";
import { subjectDoodle, topicDoodle, selfCheckFaces, type Visual } from "./worksheetVisuals";

export type WorksheetPdfOptions = {
  title: string;
  meta: string; // e.g. "Grade 6 · Math · Medium · 10 questions"
  layout: WorksheetLayout;
  includeAnswerKey?: boolean;
  filename: string;
};

const PAGE_W = 210, PAGE_H = 297, M = 14, CONTENT_W = PAGE_W - M * 2;
const HEADER_Y = 11, BODY_TOP = 22, FOOTER_Y = PAGE_H - 9, BOTTOM = FOOTER_Y - 9;
const PX = 0.2646; // mm per CSS px
const PT = 0.3528; // mm per pt

type RGB = [number, number, number];
const INK: RGB = [15, 23, 42], MUTED: RGB = [100, 116, 139], LINE: RGB = [148, 163, 184], FAINT: RGB = [226, 232, 240];
const TINT: Record<string, { band: RGB; border: RGB; badge: RGB }> = {
  math: { band: [240, 249, 255], border: [186, 230, 253], badge: [2, 132, 199] },
  english: { band: [255, 241, 242], border: [254, 205, 211], badge: [225, 29, 72] },
  science: { band: [236, 253, 245], border: [167, 243, 208], badge: [5, 150, 105] },
};

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

const hex = (h: string): RGB => {
  let s = h.replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};

/** Draws a worksheet picture at (x, y) in mm; returns its height in mm. */
function drawVisual(doc: JsPDF, v: Visual, x: number, y: number, scale = PX): number {
  const X = (px: number) => x + px * scale, Y = (py: number) => y + py * scale;
  for (const s of v.shapes) {
    const sw = ("sw" in s && s.sw ? s.sw : 1) * scale;
    doc.setLineWidth(sw);
    const stroke = "stroke" in s && s.stroke ? hex(s.stroke) : null;
    const fill = "fill" in s && s.fill ? hex(s.fill) : null;
    if (stroke) doc.setDrawColor(...stroke);
    if (fill) doc.setFillColor(...fill);
    const style = fill && stroke ? "FD" : fill ? "F" : "S";
    if ("dash" in s && s.dash) doc.setLineDashPattern([1.2, 1], 0);
    switch (s.k) {
      case "rect":
        if (s.r) doc.roundedRect(X(s.x), Y(s.y), s.w * scale, s.h * scale, s.r * scale, s.r * scale, style);
        else doc.rect(X(s.x), Y(s.y), s.w * scale, s.h * scale, style);
        break;
      case "circle":
        doc.circle(X(s.cx), Y(s.cy), s.r * scale, style);
        break;
      case "line":
        doc.line(X(s.x1), Y(s.y1), X(s.x2), Y(s.y2));
        break;
      case "poly": {
        const [first, ...rest] = s.pts;
        const deltas: [number, number][] = [];
        let [px, py] = first;
        for (const [qx, qy] of rest) { deltas.push([(qx - px) * scale, (qy - py) * scale]); px = qx; py = qy; }
        doc.lines(deltas, X(first[0]), Y(first[1]), [1, 1], s.closed ? style : "S", !!s.closed);
        break;
      }
      case "text":
        doc.setFont("DejaVu", s.bold ? "bold" : "normal");
        doc.setFontSize((s.size || 12) * scale / PT);
        doc.setTextColor(...(s.fill ? hex(s.fill) : INK));
        doc.text(s.t, X(s.x), Y(s.y), { align: s.anchor === "middle" ? "center" : s.anchor === "end" ? "right" : "left" });
        break;
    }
    if ("dash" in s && s.dash) doc.setLineDashPattern([], 0);
  }
  return v.h * scale;
}

function drawHeader(doc: JsPDF, logo: string | null) {
  const size = doc.getFontSize(), font = doc.getFont(), color = doc.getTextColor();
  let x = M;
  if (logo) { doc.addImage(logo, "PNG", M, HEADER_Y - 4.6, 6, 6); x += 8; }
  doc.setFont("DejaVu", "bold"); doc.setFontSize(10); doc.setTextColor(...INK);
  doc.text(BRAND.name, x, HEADER_Y);
  doc.setFont("DejaVu", "normal"); doc.setFontSize(8); doc.setTextColor(...MUTED);
  doc.text(BRAND.domain, PAGE_W - M, HEADER_Y, { align: "right" });
  doc.setDrawColor(...FAINT); doc.setLineWidth(0.3);
  doc.line(M, HEADER_Y + 3.5, PAGE_W - M, HEADER_Y + 3.5);
  doc.setFont(font.fontName, font.fontStyle); doc.setFontSize(size); doc.setTextColor(color);
}

function drawFooters(doc: JsPDF) {
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setDrawColor(...FAINT); doc.setLineWidth(0.3);
    doc.line(M, FOOTER_Y - 4.5, PAGE_W - M, FOOTER_Y - 4.5);
    doc.setFont("DejaVu", "normal"); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
    doc.text(`${BRAND.tagline} · ${BRAND.domain}`, M, FOOTER_Y);
    doc.text(`Page ${i} of ${n}`, PAGE_W - M, FOOTER_Y, { align: "right" });
  }
}

export async function downloadWorksheetPdf(o: WorksheetPdfOptions) {
  const doc = await buildWorksheetPdf(o);
  doc.save(o.filename);
}

/** Builds the PDF document; `preloaded` lets scripts supply fonts without fetch. */
export async function buildWorksheetPdf(o: WorksheetPdfOptions, preloaded?: { regular: string; bold: string; logo: string | null }) {
  const [{ jsPDF }, a] = await Promise.all([import("jspdf"), preloaded ? Promise.resolve(preloaded) : loadAssets()]);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  setupFonts(doc, a);
  const L = o.layout;
  const tint = TINT[L.subject] || TINT.math;
  const big = L.large;
  const qSize = big ? 13 : 10.5;
  const lh = (pt: number) => pt * PT * 1.38;
  doc.setProperties({
    title: `${o.title} — ${o.meta}`,
    subject: "Worksheet",
    author: BRAND.name,
    creator: `${BRAND.name} — ${BRAND.domain}`,
    keywords: `worksheet, answer key, ${o.meta}`,
  });

  let y = BODY_TOP;
  const newPage = () => { doc.addPage(); drawHeader(doc, a.logo); y = BODY_TOP; };
  const ensure = (h: number) => { if (y + h > BOTTOM) newPage(); };
  drawHeader(doc, a.logo);

  // ---- Title band
  const tx = M + 24;
  const titlePt = big ? 18 : 16;
  doc.setFont("DejaVu", "bold"); doc.setFontSize(titlePt);
  const titleLines: string[] = doc.splitTextToSize(L.title, CONTENT_W - 24 - 26).slice(0, 2);
  const bandH = titleLines.length > 1 ? 28 : 22;
  doc.setFillColor(...tint.band); doc.setDrawColor(...tint.border); doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CONTENT_W, bandH, 3, 3, "FD");
  drawVisual(doc, topicDoodle(L.subject, L.topic || ""), M + 3, y + (bandH - 15) / 2, 0.27);
  doc.setFont("DejaVu", "bold"); doc.setFontSize(titlePt); doc.setTextColor(...INK);
  doc.text(titleLines, tx, y + 9.5, { lineHeightFactor: 1.15 });
  doc.setFont("DejaVu", "bold"); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
  doc.text(`GRADE ${L.grade} · ${L.subjectLabel.toUpperCase()}`, tx, y + bandH - 4);
  // score circle
  const cx = PAGE_W - M - 12, cy = y + bandH / 2;
  doc.setFillColor(255, 255, 255); doc.setDrawColor(...LINE); doc.setLineWidth(0.5);
  doc.circle(cx, cy, 9, "FD");
  doc.setFontSize(6.5); doc.setTextColor(...MUTED); doc.text("SCORE", cx, cy - 2.2, { align: "center" });
  doc.setFontSize(8.5); doc.setTextColor(...INK); doc.text(`___ / ${L.questions.length}`, cx, cy + 3, { align: "center" });
  y += bandH + 7;

  // ---- Name / Class / Date
  doc.setFont("DejaVu", "normal"); doc.setFontSize(9.5); doc.setTextColor(71, 85, 105); doc.setDrawColor(...LINE); doc.setLineWidth(0.3);
  const nameW = CONTENT_W * 0.5, colW = CONTENT_W * 0.25;
  doc.text("Name", M, y); doc.line(M + 11, y + 0.6, M + nameW - 4, y + 0.6);
  doc.text("Class", M + nameW, y); doc.line(M + nameW + 10, y + 0.6, M + nameW + colW - 4, y + 0.6);
  doc.text("Date", M + nameW + colW, y); doc.line(M + nameW + colW + 9, y + 0.6, PAGE_W - M, y + 0.6);
  y += 7;

  // ---- Goal
  if (L.goal) {
    doc.setFontSize(9); doc.setTextColor(...INK);
    doc.setFont("DejaVu", "bold"); doc.text("Learning goal:", M, y);
    const gw = doc.getTextWidth("Learning goal: ");
    doc.setFont("DejaVu", "normal"); doc.text(L.goal, M + gw, y);
    y += 5;
  }

  // ---- Directions (dashed box with a pencil)
  {
    doc.setFontSize(big ? 11 : 9.5);
    const text = `Directions: ${L.directions}`;
    const lines: string[] = doc.splitTextToSize(text, CONTENT_W - 16);
    const h = lines.length * lh(big ? 11 : 9.5) + 5;
    doc.setDrawColor(...LINE); doc.setLineWidth(0.4); doc.setLineDashPattern([1.5, 1.2], 0);
    doc.roundedRect(M, y, CONTENT_W, h, 2, 2, "S"); doc.setLineDashPattern([], 0);
    doc.setFillColor(253, 230, 138); doc.setDrawColor(...INK); doc.setLineWidth(0.3);
    doc.lines([[6, -6], [1.6, 1.6], [-6, 6], [-2.2, 0.6]], M + 3, y + h / 2 + 3, [1, 1], "FD", true);
    doc.setTextColor(...INK);
    lines.forEach((ln, i) => {
      const ty = y + 4.4 + i * lh(big ? 11 : 9.5);
      if (i === 0) {
        doc.setFont("DejaVu", "bold"); doc.text("Directions:", M + 12, ty);
        const dw = doc.getTextWidth("Directions: ");
        doc.setFont("DejaVu", "normal"); doc.text(ln.replace(/^Directions:\s*/, ""), M + 12 + dw, ty);
      } else doc.text(ln, M + 12, ty);
    });
    y += h + 5;
  }

  // ---- Word bank (drawn per part, or once for single-part sheets)
  const drawBank = (words: string[], title = "WORD BANK") => {
    doc.setFontSize(big ? 12 : 10.5); doc.setFont("DejaVu", "normal");
    const rows: string[][] = [[]];
    let w = 0;
    for (const word of words) {
      const ww = doc.getTextWidth(word) + 8;
      if (w + ww > CONTENT_W - 10 && rows[rows.length - 1].length) { rows.push([]); w = 0; }
      rows[rows.length - 1].push(word); w += ww;
    }
    const h = 7 + rows.length * lh(big ? 12 : 10.5) + 2;
    ensure(h);
    doc.setFillColor(...tint.band); doc.setDrawColor(...tint.border); doc.setLineWidth(0.6);
    doc.roundedRect(M, y, CONTENT_W, h, 2, 2, "FD");
    doc.setFont("DejaVu", "bold"); doc.setFontSize(7.5); doc.setTextColor(71, 85, 105);
    doc.text(title, M + 4, y + 4.5);
    doc.setFont("DejaVu", "normal"); doc.setFontSize(big ? 12 : 10.5); doc.setTextColor(...INK);
    rows.forEach((row, i) => {
      const total = row.reduce((sum, wd) => sum + doc.getTextWidth(wd) + 8, -8);
      let x = M + (CONTENT_W - total) / 2;
      for (const wd of row) { doc.text(wd, x, y + 10 + i * lh(big ? 12 : 10.5)); x += doc.getTextWidth(wd) + 8; }
    });
    y += h + 4;
  };

  // ---- Worked example
  if (L.example) {
    doc.setFontSize(qSize);
    const lines: string[] = doc.splitTextToSize(L.example.text, CONTENT_W - 30);
    const ansLines: string[] = doc.splitTextToSize(`Answer: ${L.example.answer}`, CONTENT_W - 30);
    const h = (lines.length + ansLines.length) * lh(qSize) + 6;
    ensure(h);
    doc.setFillColor(255, 251, 235); doc.setDrawColor(252, 211, 77); doc.setLineWidth(0.6);
    doc.roundedRect(M, y, CONTENT_W, h, 2.5, 2.5, "FD");
    doc.setFillColor(251, 191, 36); doc.roundedRect(M + 3, y + 3, 20, 5.5, 2.7, 2.7, "F");
    doc.setFont("DejaVu", "bold"); doc.setFontSize(7); doc.setTextColor(69, 26, 3); doc.text("EXAMPLE", M + 13, y + 6.8, { align: "center" });
    doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize); doc.setTextColor(...INK);
    doc.text(lines, M + 27, y + 7, { lineHeightFactor: 1.38 });
    doc.setTextColor(29, 78, 216); doc.text(ansLines, M + 27, y + 7 + lines.length * lh(qSize), { lineHeightFactor: 1.38 });
    y += h + 5;
  }

  if (L.wordBank?.length) drawBank(L.wordBank);

  // ---- Passage
  if (L.passage?.text) {
    doc.setFontSize(10); doc.setTextColor(...INK);
    if (L.passage.title) { ensure(8); doc.setFont("DejaVu", "bold"); doc.text(L.passage.title, M, y); y += 5.5; }
    doc.setFont("DejaVu", "normal");
    for (const line of doc.splitTextToSize(L.passage.text, CONTENT_W) as string[]) { ensure(5.2); doc.text(line, M, y); y += 5; }
    y += 4;
  }

  // ---- Questions
  const cols = L.columns;
  const gap = 8;
  const colW2 = cols === 2 ? (CONTENT_W - gap) / 2 : CONTENT_W;
  const vScale = big ? 0.29 : 0.25;
  const badgeR = big ? 3.4 : 2.8;

  /** Draws wrapped lines and underlines the first whole-word match of `em`. */
  const emText = (lines: string[], x: number, top: number, em?: string) => {
    doc.text(lines, x, top, { lineHeightFactor: 1.38 });
    if (!em) return;
    const re = new RegExp(`(^|[^A-Za-z])(${em.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![A-Za-z])`, "i");
    for (let i = 0; i < lines.length; i++) {
      const m = re.exec(lines[i]);
      if (!m) continue;
      const x0 = x + doc.getTextWidth(lines[i].slice(0, m.index + m[1].length));
      const w = doc.getTextWidth(m[2]);
      const ly = top + i * lh(doc.getFontSize()) + 1.1;
      doc.setDrawColor(...INK); doc.setLineWidth(0.45); doc.line(x0, ly, x0 + w, ly);
      return;
    }
  };
  const badge = (n: number, x: number, top: number) => {
    doc.setFillColor(...tint.badge); doc.circle(x + badgeR, top + 3, badgeR, "F");
    doc.setFont("DejaVu", "bold"); doc.setFontSize(big ? 10 : 8); doc.setTextColor(255, 255, 255);
    doc.text(String(n), x + badgeR, top + 3 + (big ? 1.3 : 1.05), { align: "center" });
    doc.setFont("DejaVu", "normal"); doc.setTextColor(...INK);
  };

  /** Lays out (and, unless dry, draws) one question; returns its height. */
  const question = (q: LaidOutQuestion, x: number, top: number, w0: number, dry: boolean): number => {
    const iconMM = q.icon ? (big ? 15 : 13) : 0;
    const w = w0 - (iconMM ? iconMM + 3 : 0);
    const ix = x + badgeR * 2 + 3, iw = w - (ix - x);
    if (q.icon && !dry) drawVisual(doc, q.icon, x + w0 - iconMM, top, iconMM / q.icon.w);
    let yy = top + 4;
    if (!dry) badge(q.n, x, top);
    doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize); doc.setTextColor(...INK);
    const shown = splitBlanks(q.text).join(" ________ ").replace(/\s{2,}/g, " ").trim();
    const lines: string[] = doc.splitTextToSize(shown, iw - (q.boxed ? 6 : 0));
    if (q.boxed) {
      if (!dry) {
        doc.setFillColor(248, 250, 252); doc.setDrawColor(...FAINT); doc.setLineWidth(0.3);
        doc.roundedRect(ix, yy - 4, iw, lines.length * lh(qSize) + 3, 1.5, 1.5, "FD");
        doc.setTextColor(...INK); doc.text(lines, ix + 3, yy, { lineHeightFactor: 1.38 });
      }
      yy += lines.length * lh(qSize) + 1;
    } else {
      if (!dry) emText(lines, ix, yy, q.em);
      yy += (lines.length - 1) * lh(qSize) + 2;
    }

    if (q.visual) {
      yy += 1.5;
      const scale = Math.min(vScale, iw / q.visual.w);
      yy += dry ? q.visual.h * scale : drawVisual(doc, q.visual, ix, yy, scale);
      yy += 1;
    }

    doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize); doc.setTextColor(...INK);
    if (q.mode === "choice" && q.choices) {
      yy += 3.5;
      let cx2 = ix;
      for (const c of q.choices) {
        const cw = doc.getTextWidth(c) + 10;
        if (cx2 + cw > ix + iw && cx2 > ix) { cx2 = ix; yy += lh(qSize) + 1; }
        if (!dry) {
          doc.setDrawColor(71, 85, 105); doc.setLineWidth(0.4); doc.circle(cx2 + 1.8, yy - 1.2, 1.8, "S");
          doc.text(c, cx2 + 5, yy);
        }
        cx2 += cw;
      }
      yy += 2;
    } else if (q.mode === "blank" && q.choices) {
      yy += 3.5;
      if (!dry) { doc.setFontSize(qSize - 1.5); doc.setTextColor(71, 85, 105); doc.text(`Choose: ${q.choices.join("  ·  ")}`, ix, yy); }
      yy += 2;
    } else if (q.mode === "box") {
      const bw = big ? 30 : 26, bh = big ? 10 : 8;
      const work = w > CONTENT_W - 1 && q.text.length > 70 && !q.visual;
      // Next to a picture there is room beside it: tuck the box up alongside.
      if (q.visual && q.visual.w * Math.min(vScale, iw / q.visual.w) < iw - bw - 20) yy -= bh + 1;
      yy += 2;
      if (!dry) {
        if (work) {
          doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3); doc.setLineDashPattern([1.2, 1], 0);
          doc.roundedRect(ix, yy, iw - bw - 18, 14, 1.5, 1.5, "S"); doc.setLineDashPattern([], 0);
          doc.setFontSize(6.5); doc.setTextColor(...LINE); doc.text("SHOW YOUR WORK", ix + 2, yy + 3.2);
        }
        doc.setFontSize(7.5); doc.setTextColor(...MUTED); doc.setFont("DejaVu", "bold");
        doc.text("Answer", ix + iw - bw - 2, yy + (work ? 14 : bh) - bh / 2 + 1.2, { align: "right" });
        doc.setDrawColor(...LINE); doc.setLineWidth(0.5);
        doc.roundedRect(ix + iw - bw, yy + (work ? 14 - bh : 0), bw, bh, 1.5, 1.5, "S");
        doc.setFont("DejaVu", "normal");
      }
      yy += work ? 14 : bh;
    } else if (q.mode === "lines") {
      const step = big ? 9 : 7.5;
      for (let i = 0; i < Math.max(1, q.lines); i++) {
        yy += step;
        if (!dry) { doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(ix, yy, ix + iw, yy); }
      }
    }
    return Math.max(yy - top + 3, iconMM ? iconMM + 3 : 0);
  };

  const listRows = (qs: LaidOutQuestion[], nCols: number) => {
    const cw = nCols === 2 ? (CONTENT_W - gap) / 2 : CONTENT_W;
    for (let i = 0; i < qs.length; i += nCols) {
      const row = qs.slice(i, i + nCols);
      const h = Math.max(...row.map((q) => question(q, M, 0, cw, true)));
      ensure(h + 2);
      row.forEach((q, k) => question(q, M + k * (cw + gap), y, cw, false));
      y += h;
      doc.setDrawColor(...FAINT); doc.setLineWidth(0.2); doc.setLineDashPattern([0.6, 0.8], 0);
      doc.line(M, y, PAGE_W - M, y); doc.setLineDashPattern([], 0);
      y += 3;
    }
  };

  const answerLine = (x: number, top: number, w: number) => {
    doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(x, top, x + w, top);
  };

  for (const sec of L.sections) {
    const qs = sec.nums.map((n) => L.questions[n - 1]);
    // Part header
    if (sec.part || sec.heading) {
      doc.setFontSize(big ? 12 : 10.5);
      const hx = M + (sec.part ? 19 : 0);
      const hl: string[] = sec.heading ? doc.splitTextToSize(sec.heading, CONTENT_W - (hx - M)) : [""];
      const hh = hl.length * lh(big ? 12 : 10.5) + 3;
      ensure(hh + (sec.kind === "label" ? 60 : sec.kind === "match" ? 45 : 28));
      y += 2;
      if (sec.part) {
        doc.setFillColor(...tint.badge); doc.roundedRect(M, y - 4, 16, 5.6, 1.2, 1.2, "F");
        doc.setFont("DejaVu", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
        doc.text(sec.part.toUpperCase(), M + 8, y, { align: "center" });
      }
      if (sec.heading) {
        doc.setFont("DejaVu", "bold"); doc.setFontSize(big ? 12 : 10.5); doc.setTextColor(...INK);
        doc.text(hl, hx, y, { lineHeightFactor: 1.38 });
      }
      y += hh - 2;
      doc.setDrawColor(...tint.border); doc.setLineWidth(0.6); doc.line(M, y, PAGE_W - M, y);
      y += 5;
    }
    if (sec.bank && sec.kind !== "label") drawBank(sec.bank);

    if (sec.kind === "label" && sec.diagram) {
      if (sec.bank) drawBank(sec.bank);
      const scale = Math.min(0.36, CONTENT_W / sec.diagram.w);
      const dh = sec.diagram.h * scale, rows = Math.ceil(qs.length / 2);
      ensure(dh + rows * 9 + 4);
      drawVisual(doc, sec.diagram, M + (CONTENT_W - sec.diagram.w * scale) / 2, y, scale);
      y += dh + 4;
      const cw = (CONTENT_W - gap) / 2;
      qs.forEach((q, i) => {
        const x = M + (i % 2) * (cw + gap), top = y + Math.floor(i / 2) * 9;
        badge(q.n, x, top);
        answerLine(x + badgeR * 2 + 3, top + 5.5, cw - badgeR * 2 - 3);
      });
      y += rows * 9 + 3;
    } else if (sec.kind === "match" && sec.options) {
      const optW = 48, leftW = CONTENT_W - optW - 6, boxW = 9;
      doc.setFontSize(qSize);
      const heights = qs.map((q) => Math.max(9, (doc.splitTextToSize(q.text, leftW - badgeR * 2 - 5 - boxW - 4) as string[]).length * lh(qSize) + 3));
      const total = Math.max(heights.reduce((a2, b2) => a2 + b2, 0), sec.options.length * 9);
      ensure(Math.min(total, BOTTOM - BODY_TOP));
      const top0 = y;
      qs.forEach((q, i) => {
        const tw = leftW - badgeR * 2 - 5 - boxW - 4;
        badge(q.n, M, y);
        doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize); doc.setTextColor(...INK);
        doc.text(doc.splitTextToSize(q.text, tw) as string[], M + badgeR * 2 + 3, y + 4, { lineHeightFactor: 1.38 });
        doc.setDrawColor(...LINE); doc.setLineWidth(0.5); doc.roundedRect(M + leftW - boxW, y, boxW, 7, 1.2, 1.2, "S");
        y += heights[i];
      });
      sec.options.forEach((o, i) => {
        const oy = top0 + i * 9;
        doc.setFillColor(...tint.band); doc.setDrawColor(...tint.border); doc.setLineWidth(0.4);
        doc.roundedRect(M + leftW + 6, oy, optW, 7, 1.5, 1.5, "FD");
        doc.setFont("DejaVu", "bold"); doc.setFontSize(qSize - 1); doc.setTextColor(...MUTED); doc.text(o.letter, M + leftW + 9, oy + 4.9);
        doc.setFont("DejaVu", "normal"); doc.setTextColor(...INK); doc.text(o.text, M + leftW + 15, oy + 4.9);
      });
      y = Math.max(y, top0 + sec.options.length * 9) + 3;
    } else if (sec.kind === "tick" && sec.tickCols) {
      const cols2 = sec.tickCols, colW3 = Math.max(16, ...cols2.map((c) => { doc.setFont("DejaVu", "bold"); doc.setFontSize(7); return doc.getTextWidth(c.toUpperCase()) + 4; }));
      const textW = CONTENT_W - cols2.length * colW3 - badgeR * 2 - 6;
      const head = () => {
        doc.setFont("DejaVu", "bold"); doc.setFontSize(7); doc.setTextColor(71, 85, 105);
        cols2.forEach((c, k) => doc.text(c.toUpperCase(), M + CONTENT_W - (cols2.length - k - 0.5) * colW3, y, { align: "center" }));
        y += 3;
      };
      ensure(14); head();
      for (const q of qs) {
        doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize);
        const lines: string[] = doc.splitTextToSize(q.text, textW - (q.icon ? 10 : 0));
        const h = Math.max(q.icon ? 10 : 9, lines.length * lh(qSize) + 4);
        if (y + h > BOTTOM) { newPage(); head(); }
        doc.setDrawColor(...FAINT); doc.setLineWidth(0.25); doc.line(M, y, PAGE_W - M, y);
        badge(q.n, M, y + 1.5);
        let tx3 = M + badgeR * 2 + 3;
        if (q.icon) { drawVisual(doc, q.icon, tx3, y + 0.8, 8 / q.icon.w); tx3 += 10; }
        doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize); doc.setTextColor(...INK); emText(lines, tx3, y + 5.5, q.em);
        cols2.forEach((_, k) => {
          const cx2 = M + CONTENT_W - (cols2.length - k - 0.5) * colW3;
          doc.setDrawColor(...LINE); doc.setLineWidth(0.45); doc.roundedRect(cx2 - 2.6, y + 2, 5.2, 5.2, 0.8, 0.8, "S");
        });
        y += h;
      }
      y += 3;
    } else if (sec.compact) {
      const cw = (CONTENT_W - gap) / 2;
      for (let i = 0; i < qs.length; i += 2) {
        ensure(10);
        qs.slice(i, i + 2).forEach((q, k) => {
          const x = M + k * (cw + gap);
          badge(q.n, x, y);
          doc.setFont("DejaVu", "normal"); doc.setFontSize(qSize); doc.setTextColor(...INK);
          const tx = x + badgeR * 2 + 3, t = splitBlanks(q.text).join(" ________ ");
          doc.text(t, tx, y + 4.5);
          if (q.mode === "lines") answerLine(tx + doc.getTextWidth(t) + 3, y + 5, Math.max(10, cw - (tx - x) - doc.getTextWidth(t) - 3));
        });
        y += 10;
      }
      y += 2;
    } else {
      listRows(qs, sec.columns === 2 ? 2 : 1);
    }
    y += 2;
  }

  // ---- Self-check + teacher's comments
  ensure(20);
  y += 3;
  const faces = selfCheckFaces();
  const sw = faces.w * 0.3 + 8;
  doc.setDrawColor(...LINE); doc.setLineWidth(0.3);
  doc.roundedRect(M, y, sw, 17, 2, 2, "S");
  doc.roundedRect(M + sw + 4, y, CONTENT_W - sw - 4, 17, 2, 2, "S");
  doc.setFont("DejaVu", "bold"); doc.setFontSize(7); doc.setTextColor(71, 85, 105);
  doc.text("HOW DID I DO?", M + 4, y + 4.2);
  doc.text("TEACHER'S COMMENTS", M + sw + 8, y + 4.2);
  drawVisual(doc, faces, M + 4, y + 5.6, 0.3);
  y += 20;

  // ---- Answer key on its own page
  if (o.includeAnswerKey) {
    newPage();
    doc.setFont("DejaVu", "bold"); doc.setFontSize(14); doc.setTextColor(...INK);
    doc.text(`Answer key — ${o.title}`, M, y + 2); y += 7;
    doc.setFont("DejaVu", "normal"); doc.setFontSize(9); doc.setTextColor(...MUTED);
    doc.text(o.meta, M, y); y += 7;
    L.questions.forEach((item) => {
      doc.setFontSize(10);
      const lines: string[] = doc.splitTextToSize(`${item.letter ? `${item.letter} — ` : ""}${item.answer}`, CONTENT_W - 10);
      ensure(lines.length * 5 + 3);
      doc.setFont("DejaVu", "bold"); doc.setTextColor(...LINE); doc.text(`${item.n}.`, M, y);
      doc.setFont("DejaVu", "normal"); doc.setTextColor(...INK); doc.text(lines, M + 9, y);
      y += lines.length * 5 + 3;
    });
  }

  drawFooters(doc);
  return doc;
}
