import { ImageResponse } from "next/og";
import { parseVariant } from "@/lib/worksheetVariant";
import { shareData, shareFonts, PinImage, OgCard, PIN_SIZE, OG_SIZE } from "@/lib/shareImage";

// /share/pin/<subject>/<grade>/<topic>  → 1000×1500 Pinterest pin
// /share/og/<subject>/<grade>/<topic>   → 1200×630 link-preview card
// Add ?v=<difficulty>-<count>-<seed> for an exact generated worksheet (see lib/worksheetVariant.ts).
// Images are deterministic per URL, so the CDN can keep them for a long time.
export const runtime = "nodejs";

type Params = { format: string; subject: string; grade: string; topic: string };

export async function GET(req: Request, { params }: { params: Params }) {
  const v = new URL(req.url).searchParams.get("v");
  const d = shareData(params.subject, params.grade, params.topic, v ? parseVariant(v) : null);
  if (v && !parseVariant(v)) return new Response("Not found", { status: 404 });
  if (!d || (params.format !== "pin" && params.format !== "og")) {
    return new Response("Not found", { status: 404 });
  }
  const pin = params.format === "pin";
  // Bundled font; if it can't load, fall back to the built-in one rather than fail.
  const fonts = await shareFonts(new URL(req.url).origin).catch(() => undefined);
  return new ImageResponse(pin ? <PinImage d={d} /> : <OgCard d={d} />, {
    ...(pin ? PIN_SIZE : OG_SIZE),
    ...(fonts ? { fonts } : {}),
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400" },
  });
}
