import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { posts } from "@/lib/posts";
import { researchDomains } from "@/lib/research";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/careers",
    "/blog",
    "/ventures",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  const researchRoutes: MetadataRoute.Sitemap = researchDomains.map((domain) => ({
    url: `${base}/research/${domain.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes, ...researchRoutes];
}
