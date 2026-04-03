"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Article } from "@/lib/articles"
import { siteConfig } from "@/../site.config"

interface Props {
  articles: Article[]
  grouped: Record<string, Article[]>
  categories: string[]
  allTags: string[]
}

export function ArchiveClient({ articles, grouped, categories, allTags }: Props) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = articles
    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory)
    }
    if (activeTag) {
      result = result.filter((a) => a.tags.includes(activeTag))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [articles, activeCategory, activeTag, search])

  // Re-group filtered results by month
  const filteredGrouped: Record<string, Article[]> = {}
  for (const article of filtered) {
    const date = new Date(article.publishedAt)
    const key = date.toLocaleDateString("en-AU", {
      month: "long",
      year: "numeric",
    })
    if (!filteredGrouped[key]) filteredGrouped[key] = []
    filteredGrouped[key].push(article)
  }

  const hasFilters = !!search || !!activeCategory || !!activeTag

  return (
    <>
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Archive</h1>
        <p className="mt-1 text-zinc-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""} published
        </p>
      </section>

      {/* Search */}
      <section className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[var(--accent)] focus:outline-none"
        />
      </section>

      {/* Category filter */}
      <section className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            !activeCategory
              ? "bg-[var(--accent)] text-black font-medium"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              activeCategory === cat
                ? "bg-[var(--accent)] text-black font-medium"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <section className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                activeTag === tag
                  ? "bg-zinc-200 text-zinc-900 font-medium"
                  : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              #{tag}
            </button>
          ))}
        </section>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => {
            setSearch("")
            setActiveCategory(null)
            setActiveTag(null)
          }}
          className="mb-6 text-sm text-[var(--accent)] hover:underline"
        >
          Clear all filters ({filtered.length} result{filtered.length !== 1 ? "s" : ""})
        </button>
      )}

      {/* Grouped results */}
      {Object.keys(filteredGrouped).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(filteredGrouped).map(([month, monthArticles]) => (
            <section key={month}>
              <h2 className="mb-4 text-lg font-semibold text-zinc-300 border-b border-zinc-800 pb-2">
                {month}
              </h2>
              <div className="space-y-3">
                {monthArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className="group flex items-start gap-4 rounded-lg border border-transparent p-3 -mx-3 hover:border-zinc-800 hover:bg-zinc-900/50 transition-all"
                  >
                    <div className="shrink-0 w-20 text-right">
                      <span className="text-sm text-zinc-500">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "en-AU",
                          { day: "numeric", month: "short" }
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                          style={{ background: "var(--accent)" }}
                        >
                          {article.category}
                        </span>
                      </div>
                      <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {article.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-500 line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <p className="text-zinc-400">No articles match your filters.</p>
        </div>
      )}
    </>
  )
}
