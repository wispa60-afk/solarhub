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

// The live site (hub_articles table) is the source of truth — the local JSON
// folder only has what this script wrote, so checking it alone let the same
// topic and the same hero photo come up again and again.
const live = domain
  ? await fetch(`https://www.${domain}/api/articles`).then((r) => (r.ok ? r.json() : [])).catch(() => [])
  : []
for (const a of live) existingSlugs.add(a.slug)
const usedImages = new Set(live.map((a) => (a.image || "").split("?")[0]).filter(Boolean))
const liveTitles = live.map((a) => `"${a.title}" (${a.category})`)

const argCat = process.argv[2]
// Least-covered category first, ties broken at random.
const catCount = (c) => live.filter((a) => a.category === c).length
const fewest = Math.min(...categories.map(catCount))
const thin = categories.filter((c) => catCount(c) === fewest)

// Topic queue: content/topic-queue.json lists articles we want written next
// (e.g. topics where TradiHub AI has tradies, so the article's "Local
// tradies" box shows someone relevant). Taken first-in-first-out; when it's
// empty the thinnest category is picked as before.
const queuePath = path.join(ROOT, "content", "topic-queue.json")
const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, "utf8")) : []
const queued = !argCat && queue.find((q) => categories.includes(q.category))
const category = queued ? queued.category : argCat && categories.includes(argCat) ? argCat : thin[Math.floor(Math.random() * thin.length)]

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70)

// --- generate the article with Claude ---
const SYSTEM = `You write practical, trustworthy, SEO-friendly articles for ${siteName} — ${tagline}. Australian audience and context (AUD, AU spelling, AU regulations, seasons). Be specific and genuinely useful, never fluffy or salesy. No fabricated statistics or fake expert quotes.

Return ONLY a JSON object (no markdown fence, no prose) with exactly these keys:
{
  "title": "compelling, specific, <70 chars, no clickbait",
  "excerpt": "one-sentence summary, <160 chars",
  "body": "the full article in GitHub-flavoured Markdown — 600-900 words, with ## headings, short paragraphs, at least one bullet list or table, and an actionable takeaway. Do NOT repeat the title as an H1.",
  "tags": ["3-6 lowercase tags"],
  "imageQuery": "2-5 word stock photo search for the physical thing this article is about, e.g. timber side gate house, electrician switchboard, pool pump filter. Plain visible objects only, no abstract words like cost, guide or rights."
}`
const USER = `Today's date is ${new Date().toISOString().slice(0, 10)}. Write a fresh ${siteName} article in the "${category}" category for Australian readers. ${queued ? `Write about this topic: ${queued.brief}` : "Pick a specific, useful angle (a how-to, a cost guide, a comparison, a mistakes-to-avoid list, or a seasonal guide)."} Use the current year where a year is relevant — never present a past year as "current". These articles already exist — pick a clearly different topic, not a reworded version of any of them:\n${liveTitles.join("\n") || [...existingSlugs].join(", ") || "(none yet)"}`

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

async function unsplashPhotos(query) {
  if (!UNSPLASH_KEY) return []
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } },
    )
    if (!r.ok) return []
    const d = await r.json()
    // Similar topics return the same top result — skip photos another article
    // on this site is already using.
    return (d.results || [])
      .filter((p) => p.urls?.regular && p.urls?.small && !usedImages.has(p.urls.regular.split("?")[0]))
      .slice(0, 8)
  } catch {
    return []
  }
}

// Search words alone go wrong ("current" found a beach warning sign, "paint"
// an abstract artwork), so Claude looks at the photos. Returns the best one,
// null if none fit, undefined if the check itself failed.
async function bestPhoto(photos, article) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 10,
        messages: [{
          role: "user",
          content: [
            ...photos.map((p) => ({ type: "image", source: { type: "url", url: p.urls.small } })),
            {
              type: "text",
              text: `These are photos 1 to ${photos.length}, in order. Pick the hero photo for this Australian home article: "${article.title}". It must plainly show the article's subject and look like a normal home or trade setting. Reply with only the photo's number, or 0 if none of them fit.`,
            },
          ],
        }],
      }),
    })
    if (!res.ok) throw new Error(`Anthropic ${res.status}`)
    const data = await res.json()
    const n = parseInt((data.content || []).find((b) => b.type === "text")?.text ?? "", 10)
    if (Number.isNaN(n)) throw new Error("no number in reply")
    return n === 0 ? null : (photos[n - 1] ?? null)
  } catch (e) {
    console.log(`  Photo check failed: ${e.message}`)
    return undefined
  }
}

async function pickImage(article) {
  const queries = [article.imageQuery, article.tags?.[0] ? `${article.tags[0]} ${category}` : "", article.title, category].filter(Boolean)
  let fallback
  for (const q of queries) {
    const photos = await unsplashPhotos(q)
    if (!photos.length) continue
    fallback ??= photos[0]
    const best = await bestPhoto(photos, article)
    if (best) return best.urls.regular
    if (best === undefined) break
  }
  // An unchecked photo beats no article: the weekly run must still publish.
  if (fallback) console.log("  WARNING: no photo passed the check, using the top search result")
  return fallback?.urls.regular
}

const art = await generate()
let slug = slugify(art.title)
let n = 2
while (existingSlugs.has(slug)) slug = `${slugify(art.title)}-${n++}`

const image = await pickImage(art)

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
if (queued) {
  fs.writeFileSync(queuePath, JSON.stringify(queue.filter((q) => q !== queued), null, 2) + "\n")
  console.log(`  from topic queue (${queue.length - 1} left)`)
}
console.log(`  ${siteName} · ${category} · "${article.title}"`)
console.log(`  image: ${image ? "yes" : "none"} · ${article.body.length} chars`)

// Publish to the live site. Since the Jun 30 move to the shared hub_articles
// table the site no longer reads content/articles — the JSON above is only a
// backup (its commit also keeps GitHub from disabling this schedule). Without
// this POST, generated articles never appeared. Fail the run if it doesn't
// land, so a broken publish is visible instead of silent.
{
  const SITE_API_KEY = process.env.SITE_API_KEY
  if (!domain || !SITE_API_KEY) {
    console.error("SITE_API_KEY (and site domain) are required to publish.")
    process.exit(1)
  }
  const res = await fetch(`https://www.${domain}/api/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": SITE_API_KEY },
    body: JSON.stringify(article),
  })
  const out = await res.text()
  if (!res.ok) {
    console.error(`Publish failed: ${res.status} ${out.slice(0, 200)}`)
    process.exit(1)
  }
  console.log(`  Published: https://www.${domain}/${slug}`)
}

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
