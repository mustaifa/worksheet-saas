import { ImageResponse } from "next/og";

// Default social-share image for every page (Facebook, WhatsApp, X, Pinterest…)
export const alt = "Practice Sheet — free printable worksheets with answer keys, grades 1–12";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b1220", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", color: "#F0C94E", fontSize: 34, fontWeight: 700 }}>Practice Sheet</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "white", fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>Free printable worksheets</div>
            <div style={{ color: "white", fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>with answer keys</div>
            <div style={{ color: "#94a3b8", fontSize: 34, marginTop: 28 }}>Math · English · Science — Grades 1–12</div>
          </div>
          <div style={{ display: "flex", color: "#cbd5e1", fontSize: 28 }}>Every answer checked by code, never guessed</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 330, background: "white", borderRadius: 18, padding: 32, marginLeft: 40 }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#0f172a", borderBottom: "3px solid #0f172a", paddingBottom: 12 }}>Fractions</div>
          {["3/4 + 1/8 =", "2/3 × 3/5 =", "Simplify 12/18", "5/6 − 1/3 =", "Compare 3/5 ? 4/7"].map((q, i) => (
            <div key={q} style={{ display: "flex", fontSize: 22, color: "#334155", marginTop: 20 }}>{`${i + 1}.  ${q}`}</div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
