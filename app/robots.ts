import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://aethelsystems.com";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/worksheets", "/pricing", "/about", "/contact", "/blog"],
      disallow: ["/dashboard", "/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
