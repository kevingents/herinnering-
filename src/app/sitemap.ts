import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/uitvaartondernemers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
