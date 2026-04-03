import type { MetadataRoute } from "next"
import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

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
    url: `${base}/category/${slugify(cat)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/archive`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    ...categoryUrls,
    ...articleUrls,
  ]
}
