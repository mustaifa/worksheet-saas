// Single source for how Practice Sheet appears on printed and downloaded work.
export const BRAND = {
  name: "Practice Sheet",
  domain: "aethelsystems.com",
  tagline: "Free printable worksheets with answer keys",
  logoPath: "/logo-mark.png",
};

/** "Practice-Sheet_Grade-6_Math_Adding-Subtracting-Fractions.pdf" */
export function brandedFilename(parts: (string | number | undefined | null)[], ext: string) {
  const slug = (s: string) => s.replace(/&/g, "and").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return [BRAND.name, ...parts].filter((p) => p !== undefined && p !== null && `${p}`.trim() !== "").map((p) => slug(String(p))).join("_") + "." + ext;
}
