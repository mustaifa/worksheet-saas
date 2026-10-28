// Single source for how Practice Sheet presents itself — names, contact,
// and how it appears on printed and downloaded work.
export const BRAND = {
  name: "Practice Sheet",
  company: "Aethel Systems",
  byline: "by Aethel Systems",
  domain: "aethelsystems.com",
  tagline: "Free printable worksheets with answer keys",
  logoPath: "/logo-mark.png",
  contactEmail: "aethelsystems@gmail.com",
  launched: 2026,
  founder: {
    name: "Ghulam Malik",
    linkedin: "https://www.linkedin.com/in/gmmalik/",
  },
  // Honest, verifiable reach: countries with Google Search clicks, Jul–Oct 2026.
  countriesReached: "90+",
};

/** "Practice-Sheet_Grade-6_Math_Adding-Subtracting-Fractions.pdf" */
export function brandedFilename(parts: (string | number | undefined | null)[], ext: string) {
  const slug = (s: string) => s.replace(/&/g, "and").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return [BRAND.name, ...parts].filter((p) => p !== undefined && p !== null && `${p}`.trim() !== "").map((p) => slug(String(p))).join("_") + "." + ext;
}
