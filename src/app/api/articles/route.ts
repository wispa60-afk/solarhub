import { NextRequest, NextResponse } from "next/server"
import { getAllArticles, saveArticle, type Article } from "@/lib/articles"
import { searchImage } from "@/lib/unsplash"

export async function GET() {
  const articles = await getAllArticles()
  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as Partial<Article>

  if (!body.slug || !body.title || !body.body || !body.category) {
    return NextResponse.json(
      { error: "Missing required fields: slug, title, body, category" },
      { status: 400 }
    )
  }

  // Auto-fetch image from Unsplash if not provided
  let image = body.image
  if (!image) {
    image = await searchImage(`${body.category} ${body.title} australia`)
  }

  const article: Article = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt ?? body.body.slice(0, 160) + "...",
    body: body.body,
    category: body.category,
    tags: body.tags ?? [],
    author: body.author ?? "Editorial",
    publishedAt: body.publishedAt ?? new Date().toISOString(),
    image,
    // The fact-check gate can post status:"draft" to stage an unlisted article.
    status: body.status === "draft" ? "draft" : "published",
  }

  await saveArticle(article)
  return NextResponse.json({ ok: true, slug: article.slug, status: article.status }, { status: 201 })
}
