import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}${SITE.resume}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
