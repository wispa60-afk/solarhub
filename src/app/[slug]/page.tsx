import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"
import { QuoteCTA } from "@/components/QuoteCTA"
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

/**
 * Split markdown body at roughly 40% by finding a paragraph break near that point.
 */
function splitBody(body: string): [string, string] {
  const target = Math.floor(body.length * 0.4)
  // Find the next double-newline after the target point
  const breakPoint = body.indexOf("\n\n", target)
  if (breakPoint === -1 || breakPoint > body.length * 0.7) {
    // If no good break found, just split at target
    return [body, ""]
  }
  return [body.slice(0, breakPoint), body.slice(breakPoint)]
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const [bodyFirst, bodyRest] = splitBody(article.body)

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

          {/* Body — first part */}
          <div className="prose-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {bodyFirst}
            </ReactMarkdown>
          </div>

          {/* Mid CTA — only if we successfully split the body */}
          {bodyRest && (
            <>
              <QuoteCTA position="mid" category={article.category} />
              <div className="prose-article">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {bodyRest}
                </ReactMarkdown>
              </div>
            </>
          )}

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

          {/* Bottom CTA */}
          <QuoteCTA position="bottom" category={article.category} />

          {/* Share again at bottom */}
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <ShareButtons title={article.title} slug={article.slug} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="mt-10 lg:mt-0 lg:w-72 shrink-0 space-y-6">
          <QuoteCTA position="mid" />
        </aside>
      </div>

    </>
  )
}
