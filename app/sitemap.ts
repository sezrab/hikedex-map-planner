import { MetadataRoute } from "next";
import { guidesConfig } from "@/app/guides/guidesConfig";
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hikedex.app";
  const now = new Date();

  // Static routes
  const staticRoutes = [
    "/",
    "/guides",
    "/about",
    "/privacy-policy",
    "/sunrise-radar",
    "/map",
  ];

  // Dynamic guide routes
  const dynamicRoutes: string[] = [];
  for (const [collection, guide] of Object.entries(guidesConfig)) {
    // Collection root page
    dynamicRoutes.push(`/g/${collection}`);
    for (const pageSlug of Object.keys(guide.pages)) {
      dynamicRoutes.push(`/g/${collection}/${pageSlug}`);
    }
  }

  // Map routes for each guide page (if mapUrl is present and not already included)
  for (const guide of Object.values(guidesConfig)) {
    for (const page of Object.values(guide.pages)) {
      if (page.mapUrl && !dynamicRoutes.includes(page.mapUrl)) {
        dynamicRoutes.push(page.mapUrl);
      }
    }
  }

  // Combine all routes
  const routes = [...staticRoutes, ...dynamicRoutes];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
  }));
}
