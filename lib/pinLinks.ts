// Pinterest "create pin" links for each page of an exact generated worksheet.
import { pinPages, pinPagePath, pinDescription } from "@/lib/shareImage";
import type { PinItem } from "@/lib/pinItems";
import { formatVariant, variantPath, type Variant } from "@/lib/worksheetVariant";

export type PinPageLink = { page: number; of: number; image: string; href: string };

export function pinterestCreateUrl(url: string, media: string, description: string) {
  return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`;
}

export function pinPageLinks(opts: {
  origin: string; subject: string; subjectLabel: string; grade: number; topic: string; name: string;
  variant: Variant; items: PinItem[];
}): PinPageLink[] {
  const v = formatVariant(opts.variant);
  const url = opts.origin + variantPath(opts.subject, opts.grade, opts.topic, opts.variant);
  const pages = pinPages(opts.items);
  const base = pinDescription(opts.grade, opts.subjectLabel, opts.name);
  return pages.map((_, i) => {
    const image = opts.origin + pinPagePath(opts.subject, opts.grade, opts.topic, v, i + 1);
    const desc = pages.length > 1 ? `Page ${i + 1} of ${pages.length}. ${base}` : base;
    return { page: i + 1, of: pages.length, image, href: pinterestCreateUrl(url, image, desc) };
  });
}
