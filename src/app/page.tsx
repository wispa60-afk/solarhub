import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/../site.config"
import { ArticleCard } from "@/components/ArticleCard"
import { CategoryNav } from "@/components/CategoryNav"
import { QuoteCTA } from "@/components/QuoteCTA"
import { CrossPromo } from "@/components/CrossPromo"
import { NewsletterSignup } from "@/components/NewsletterSignup"
import { BusinessAd } from "@/components/BusinessAd"

export const revalidate = 300

export default function HomePage() {
  const articles = getAllArticles()
  const featured = articles.slice(0, 1)[0]
  const rest = articles.slice(1)

  return (
    <>
      {/* Hero with CTA */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Going Solar?{" "}
          <span style={{ color: "var(--accent)" }}>Get 3 Free Quotes from Local Installers</span>
        </h1>
        <p className="mt-3 text-lg text-zinc-400 max-w-2xl">
          Compare prices from licensed solar installers in your area. Free, no obligation.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="https://tradihubai.com.au/jobs/new?trade=solar&ref=solarhub"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all shadow-lg"
            style={{ background: "var(--accent)" }}
          >
            Get My Quotes &rarr;
          </a>
          <span className="text-sm text-zinc-500">Or browse our guides &darr;</span>
        </div>
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

      {/* Business for sale — flows in from TradiHub */}
      <div className="mb-10">
        <BusinessAd />
      </div>

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

      {/* Bottom CTA */}
      <QuoteCTA position="bottom" category="solar" />

      {/* Newsletter (secondary) */}
      <section className="mb-10 max-w-md mx-auto">
        <NewsletterSignup />
      </section>

      {/* Cross-promo */}
      <CrossPromo />
    </>
  )
}
