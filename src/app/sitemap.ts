import type { MetadataRoute } from "next"
import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${siteConfig.domain}`
  const articles = getAllArticles()

  const articleUrls = articles.map((a) => ({
    url: `${base}/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryUrls = siteConfig.categories.map((cat) => ({
    url: `${base}/category/${encodeURIComponent(cat.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...categoryUrls,
    ...articleUrls,
  ]
}
