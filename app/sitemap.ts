import { MetadataRoute } from "next";
import { SUBJECTS, allGrades, topicsForGrade } from "@/lib/subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://aethelsystems.com";
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/pricing`, priority: 0.8 },
    { url: `${base}/worksheets`, priority: 0.9 },
  ];

  for (const s of SUBJECTS) {
    entries.push({ url: `${base}/worksheets/${s.id}`, priority: 0.7 });
    for (const g of allGrades()) {
      const topics = topicsForGrade(s.id, g);
      if (topics.length === 0) continue;
      entries.push({ url: `${base}/worksheets/${s.id}/${g}`, priority: 0.6 });
      for (const t of topics) {
        entries.push({ url: `${base}/worksheets/${s.id}/${g}/${t.id}`, priority: 0.5 });
      }
    }
  }

  return entries;
}
