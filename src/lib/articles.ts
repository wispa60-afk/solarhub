import { neon } from "@neondatabase/serverless"
import { siteConfig } from "@/../site.config"

// Articles are stored in the shared `hub_articles` table (Car Scout's Neon),
// keyed by `site` so every hub uses one table + one DATABASE_URL. This replaced
// the old flat-file store (read-only on Vercel → the article cron couldn't
// publish at runtime). `status` gates published vs draft.
export interface Article {
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  image?: string
  status?: string
}

const SITE = siteConfig.domain
const sql = neon(process.env.DATABASE_URL!)

function toArticle(r: Record<string, unknown>): Article {
  const pub = r.published_at
  return {
    slug: r.slug as string,
    title: r.title as string,
    excerpt: (r.excerpt as string) ?? "",
    body: r.body as string,
    category: r.category as string,
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    author: (r.author as string) ?? "Editorial",
    publishedAt: pub instanceof Date ? pub.toISOString() : String(pub),
    image: (r.image as string) ?? undefined,
    status: r.status as string,
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const rows = await sql`
    SELECT * FROM hub_articles
    WHERE site = ${SITE} AND status = 'published'
    ORDER BY published_at DESC`
  return rows.map(toArticle)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await sql`
    SELECT * FROM hub_articles
    WHERE site = ${SITE} AND slug = ${slug}
    LIMIT 1`
  return rows.length ? toArticle(rows[0]) : null
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const rows = await sql`
    SELECT * FROM hub_articles
    WHERE site = ${SITE} AND status = 'published' AND lower(category) = lower(${category})
    ORDER BY published_at DESC`
  return rows.map(toArticle)
}

export async function getCategories(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT category FROM hub_articles
    WHERE site = ${SITE} AND status = 'published'`
  return rows.map((r) => r.category as string)
}

export async function saveArticle(article: Article): Promise<void> {
  await sql`
    INSERT INTO hub_articles
      (site, slug, title, excerpt, body, category, tags, author, image, status, published_at, updated_at)
    VALUES
      (${SITE}, ${article.slug}, ${article.title}, ${article.excerpt}, ${article.body}, ${article.category},
       ${JSON.stringify(article.tags ?? [])}::jsonb, ${article.author ?? "Editorial"}, ${article.image ?? null},
       ${article.status ?? "published"}, ${article.publishedAt ?? new Date().toISOString()}::timestamptz, now())
    ON CONFLICT (site, slug) DO UPDATE SET
      title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, body = EXCLUDED.body,
      category = EXCLUDED.category, tags = EXCLUDED.tags, author = EXCLUDED.author,
      image = EXCLUDED.image, status = EXCLUDED.status, updated_at = now()`
}
