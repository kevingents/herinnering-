import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private app + individual memorials out of search.
        disallow: ["/dashboard", "/legacy/", "/graf/", "/auth/", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
