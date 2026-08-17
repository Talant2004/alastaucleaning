import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          ru: `${siteUrl}/ru`,
          kk: `${siteUrl}/kz`,
        },
      },
    });
    entries.push({
      url: `${siteUrl}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          ru: `${siteUrl}/ru/privacy`,
          kk: `${siteUrl}/kz/privacy`,
        },
      },
    });
  }

  return entries;
}
