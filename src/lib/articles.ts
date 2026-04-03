import fs from "fs"
import path from "path"

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
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles")

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"))
  const articles = files.map((f) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8")
    return JSON.parse(raw) as Article
  })
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  )
}

export function getCategories(): string[] {
  const articles = getAllArticles()
  return Array.from(new Set(articles.map((a) => a.category)))
}

export function saveArticle(article: Article): void {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  }
  const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2))
}
