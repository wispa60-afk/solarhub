import Link from "next/link"
import type { Article } from "@/lib/articles"

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/${article.slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-lg"
    >
      {article.image && (
        <div className="aspect-video bg-zinc-800 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {!article.image && (
        <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <span className="text-4xl text-zinc-700">{article.category.charAt(0)}</span>
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium text-black"
            style={{ background: "var(--accent)" }}
          >
            {article.category}
          </span>
          <span className="text-xs text-zinc-500">
            {new Date(article.publishedAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <h3 className="mb-1 font-semibold text-zinc-100 group-hover:text-white line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2">{article.excerpt}</p>
      </div>
    </Link>
  )
}
