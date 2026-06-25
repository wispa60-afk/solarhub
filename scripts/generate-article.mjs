/**
 * Weekly article generator for a DLK Network site.
 *
 * Reads this site's ./site.config.ts (name + categories), generates a fresh
 * SEO article with Claude, fetches a matching Unsplash hero image, and writes
 * content/articles/{slug}.json. A GitHub Action runs it weekly and commits the
 * result (Vercel then rebuilds). Run locally:  node scripts/generate-article.mjs [Category]
 *
 * Env: ANTHROPIC_API_KEY (required), UNSPLASH_ACCESS_KEY (optional — image).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

// --- tiny .env loader (local runs; CI passes real env) ---
for (const f of [".env", ".env.local"]) {
  const p = path.join(ROOT, f)
  if (!fs.existsSync(p)) continue
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "")
  }
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY
if (!ANTHROPIC_KEY) {
  console.error("ANTHROPIC_API_KEY is required.")
  process.exit(1)
}

// --- read site.config.ts (name + categories) without a TS import ---
const cfgSrc = fs.readFileSync(path.join(ROOT, "site.config.ts"), "utf8")
const siteName = (cfgSrc.match(/name:\s*"([^"]+)"/) || [])[1] || "Hub"
const tagline = (cfgSrc.match(/tagline:\s*"([^"]+)"/) || [])[1] || ""
const domain = (cfgSrc.match(/domain:\s*"([^"]+)"/) || [])[1] || ""
const INDEXNOW_KEY = "80561c0fdb213e3217bf3eb8ab94e40c"
const catBlock = (cfgSrc.match(/categories:\s*\[([\s\S]*?)\]/) || [])[1] || ""
const categories = [...catBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1])
if (!categories.length) {
  console.error("No categories found in site.config.ts")
  process.exit(1)
}

// --- pick a category (CLI arg, else one we've written about least) ---
const articlesDir = path.join(ROOT, "content", "articles")
fs.mkdirSync(articlesDir, { recursive: true })
const existing = fs.existsSync(articlesDir) ? fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json")) : []
const existingSlugs = new Set(existing.map((f) => f.replace(/\.json$/, "")))
const argCat = process.argv[2]
const category = argCat && categories.includes(argCat) ? argCat : categories[Math.floor(Math.random() * categories.length)]

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70)

// --- generate the article with Claude ---
const SYSTEM = `You write practical, trustworthy, SEO-friendly articles for ${siteName} — ${tagline}. Australian audience and context (AUD, AU spelling, AU regulations, seasons). Be specific and genuinely useful, never fluffy or salesy. No fabricated statistics or fake expert quotes.

Return ONLY a JSON object (no markdown fence, no prose) with exactly these keys:
{
  "title": "compelling, specific, <70 chars, no clickbait",
  "excerpt": "one-sentence summary, <160 chars",
  "body": "the full article in GitHub-flavoured Markdown — 600-900 words, with ## headings, short paragraphs, at least one bullet list or table, and an actionable takeaway. Do NOT repeat the title as an H1.",
  "tags": ["3-6 lowercase tags"]
}`
const USER = `Today's date is ${new Date().toISOString().slice(0, 10)}. Write a fresh ${siteName} article in the "${category}" category for Australian readers. Pick a specific, useful angle (a how-to, a cost guide, a comparison, a mistakes-to-avoid list, or a seasonal guide). Use the current year where a year is relevant — never present a past year as "current". Avoid these existing topics: ${[...existingSlugs].join(", ") || "(none yet)"}.`

async function generate() {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: "user", content: USER }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
  const data = await res.json()
  let text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("")
  text = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim()
  return JSON.parse(text)
}

async function unsplashImage(query) {
  if (!UNSPLASH_KEY) return undefined
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } },
    )
    if (!r.ok) return undefined
    const d = await r.json()
    return d.results?.[0]?.urls?.regular
  } catch {
    return undefined
  }
}

const art = await generate()
let slug = slugify(art.title)
let n = 2
while (existingSlugs.has(slug)) slug = `${slugify(art.title)}-${n++}`

const image = await unsplashImage(art.tags?.[0] ? `${art.tags[0]} ${category}` : category)

const article = {
  slug,
  title: art.title,
  excerpt: art.excerpt,
  body: art.body,
  category,
  tags: Array.isArray(art.tags) ? art.tags.slice(0, 6) : [],
  author: `${siteName} Editorial`,
  publishedAt: new Date().toISOString(),
  ...(image ? { image } : {}),
}

const outPath = path.join(articlesDir, `${slug}.json`)
fs.writeFileSync(outPath, JSON.stringify(article, null, 2))
console.log(`Wrote ${path.relative(ROOT, outPath)}`)
console.log(`  ${siteName} · ${category} · "${article.title}"`)
console.log(`  image: ${image ? "yes" : "none"} · ${article.body.length} chars`)

// Ping IndexNow (Bing, Yandex, etc.) so the new article gets crawled quickly.
if (domain) {
  try {
    const host = `www.${domain}` // apex 307-redirects to www; IndexNow needs the direct host
    const liveUrl = `https://${host}/${slug}`
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
        urlList: [liveUrl],
      }),
    })
    console.log(`  IndexNow: ${res.status} (${liveUrl})`)
  } catch (e) {
    console.log(`  IndexNow ping failed: ${e.message}`)
  }
}
