import type { MetadataRoute } from "next";
import { routes } from "@/data/routes";
import { getArticles, getProjects, getSite } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, projects, articles] = await Promise.all([getSite(), getProjects(), getArticles()]);
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...routes.map((r) => ({ url: `${site.url}${r.href}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.id}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...articles.flatMap((a) => (a.slug ? [{ url: `${site.url}/writing/${a.slug}`, changeFrequency: "yearly" as const, priority: 0.5 }] : [])),
  ];
}
