import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"
import { ArticleCard } from "@/components/ArticleCard"
import { CategoryNav } from "@/components/CategoryNav"
import { AdSlot } from "@/components/AdSlot"
import { CrossPromo } from "@/components/CrossPromo"
import { NewsletterSignup } from "@/components/NewsletterSignup"

export const revalidate = 300

export default function HomePage() {
  const articles = getAllArticles()
  const featured = articles.slice(0, 1)[0]
  const rest = articles.slice(1)

  return (
    <>
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-400">{siteConfig.tagline}</p>
      </section>

      {/* Category filter */}
      <section className="mb-8">
        <CategoryNav />
      </section>

      {/* Featured article */}
      {featured && (
        <section className="mb-10">
          <a
            href={`/${featured.slug}`}
            className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all lg:flex"
          >
            <div className="aspect-video bg-zinc-800 lg:w-1/2 overflow-hidden">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <span className="text-6xl text-zinc-700">
                    {featured.category.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 lg:w-1/2 lg:p-8 flex flex-col justify-center">
              <span
                className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium text-black"
                style={{ background: "var(--accent)" }}
              >
                {featured.category}
              </span>
              <h2 className="text-2xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                {featured.title}
              </h2>
              <p className="mt-2 text-zinc-400 line-clamp-3">
                {featured.excerpt}
              </p>
              <span className="mt-4 text-sm font-medium text-[var(--accent)]">
                Read more &rarr;
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Banner ad */}
      <section className="mb-10">
        <AdSlot position="banner" />
      </section>

      {/* Article grid */}
      {rest.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 text-xl font-bold text-white">Latest Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <p className="text-zinc-400">No articles yet. Content coming soon!</p>
        </section>
      )}

      {/* Newsletter */}
      <section className="mb-10 max-w-md mx-auto">
        <NewsletterSignup />
      </section>

      {/* Cross-promo */}
      <CrossPromo />
    </>
  )
}
