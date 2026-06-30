import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticlesByCategory } from "@/lib/articles"
import { siteConfig } from "@/../site.config"
import { ArticleCard } from "@/components/ArticleCard"
import { CategoryNav } from "@/components/CategoryNav"
import { AdSlot } from "@/components/AdSlot"
import { CrossPromo } from "@/components/CrossPromo"

export const revalidate = 300

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export async function generateStaticParams() {
  return siteConfig.categories.map((cat) => ({
    cat: slugify(cat),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { cat: string }
}): Promise<Metadata> {
  const label =
    siteConfig.categories.find((c) => slugify(c) === params.cat) ??
    params.cat
  return {
    title: `${label} Articles`,
    description: `Browse ${label.toLowerCase()} articles on ${siteConfig.name}`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { cat: string }
}) {
  const label = siteConfig.categories.find(
    (c) => slugify(c) === params.cat
  )
  if (!label) notFound()

  const articles = await getArticlesByCategory(label)

  return (
    <>
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{label}</h1>
        <p className="mt-1 text-zinc-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
      </section>

      <section className="mb-8">
        <CategoryNav active={params.cat} />
      </section>

      <section className="mb-10">
        <AdSlot position="banner" />
      </section>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <p className="text-zinc-400">No articles in this category yet.</p>
        </div>
      )}

      <CrossPromo />
    </>
  )
}
