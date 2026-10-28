export const SITE_NAME = "Practice Sheet";
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://aethelsystems.com").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
export const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Practice Sheet — free printable worksheets with answer keys, grades 1–12" };
