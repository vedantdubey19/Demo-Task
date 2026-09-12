import { MetadataRoute } from "next";
import collegesData from "@/data/colleges.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const collegeRoutes: MetadataRoute.Sitemap = (collegesData as any[]).map(
    (c) => ({
      url: `${baseUrl}/colleges/${c.slug}`,
      lastModified: new Date(c.updatedAt || c.createdAt || new Date()),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...collegeRoutes];
}
