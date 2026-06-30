import type { Metadata } from "next"
import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"
import { ArchiveClient } from "./ArchiveClient"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Archive",
  description: `Browse all articles on ${siteConfig.name}`,
}

export default async function ArchivePage() {
  const articles = await getAllArticles()
  const categories = Array.from(new Set(articles.map((a) => a.category)))
  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)))

  // Group by month
  const grouped: Record<string, typeof articles> = {}
  for (const article of articles) {
    const date = new Date(article.publishedAt)
    const key = date.toLocaleDateString("en-AU", {
      month: "long",
      year: "numeric",
    })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(article)
  }

  return (
    <ArchiveClient
      articles={articles}
      grouped={grouped}
      categories={categories}
      allTags={allTags}
    />
  )
}
