import { SUBJECTS } from "@/lib/subjects";
import { pinSchedule } from "@/lib/pinQueue";
import { sharePaths, pinDescription } from "@/lib/shareImage";
import { SITE_URL } from "@/lib/site";

// RSS feed Pinterest auto-publishes from ("Bulk create Pins" → RSS), one per board:
//   /feeds/pins/math → "Math Worksheets", /feeds/pins/english → "English Worksheets", …
// Only pages whose drip release time has passed appear, newest first.
export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET(_req: Request, { params }: { params: { subject: string } }) {
  const subject = SUBJECTS.find((s) => s.id === params.subject);
  if (!subject) return new Response("Not found", { status: 404 });

  const now = Date.now();
  const all = pinSchedule().filter((r) => r.s === subject.id);
  let items = all.filter((r) => r.release <= now).reverse().slice(0, 100);
  // Pinterest won't accept an empty feed when it's first added, so a subject whose
  // turn hasn't come yet shows its first page early.
  if (items.length === 0 && all.length) items = [all[0]];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(`${subject.label} Worksheets — Practice Sheet`)}</title>
<link>${SITE_URL}/worksheets/${subject.id}</link>
<description>${esc(`Free printable ${subject.label} worksheets with answer keys`)}</description>
<language>en</language>
${items.map((r) => {
    const link = `${SITE_URL}/worksheets/${r.s}/${r.g}/${r.id}`;
    const img = SITE_URL + sharePaths(r.s, r.g, r.id).pin;
    return `<item>
<title>${esc(`Grade ${r.g} ${r.name} Worksheet (Free PDF + Answer Key)`)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${new Date(r.release).toUTCString()}</pubDate>
<description>${esc(pinDescription(r.g, r.label, r.name))}</description>
<enclosure url="${img}" type="image/png" length="0"/>
<media:content url="${img}" medium="image" type="image/png" width="1000" height="1500"/>
</item>`;
  }).join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=600" },
  });
}
