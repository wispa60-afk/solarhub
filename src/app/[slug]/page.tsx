import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"
import { AdSlot } from "@/components/AdSlot"
import { CrossPromo } from "@/components/CrossPromo"
import { NewsletterSignup } from "@/components/NewsletterSignup"
import { ShareButtons } from "@/components/ShareButtons"

export const revalidate = 300

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.image ? [article.image] : undefined,
    },
  }
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    image: article.image,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="lg:flex lg:gap-10">
        {/* Article content */}
        <article className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-black"
                style={{ background: "var(--accent)" }}
              >
                {article.category}
              </span>
              <span className="text-sm text-zinc-500">
                {new Date(article.publishedAt).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm text-zinc-500">
                by {article.author}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-lg text-zinc-400">{article.excerpt}</p>
          </div>

          {/* Hero image */}
          {article.image && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Share */}
          <div className="mb-6">
            <ShareButtons title={article.title} slug={article.slug} />
          </div>

          {/* Body */}
          <div className="prose-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.body}
            </ReactMarkdown>
          </div>

          {/* In-article ad */}
          <AdSlot position="in-article" />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share again at bottom */}
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <ShareButtons title={article.title} slug={article.slug} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="mt-10 lg:mt-0 lg:w-72 shrink-0 space-y-6">
          <AdSlot position="sidebar" />
          <NewsletterSignup />
        </aside>
      </div>

      {/* Cross-promo */}
      <CrossPromo />
    </>
  )
}
