import { getTradies, suburbLinks, tradesFor, type TradieCard } from "@/lib/tradie-feed"
import { siteConfig } from "@/../site.config"

/**
 * "Local tradies on TradiHub AI" — live profiles matching this page's topic,
 * linking to their profile (with a ?ref tag so the tradie's lead report shows
 * the hub). Falls back to the hub's trades. With no match it offers "post a
 * job". Spare slots go to other members under their own heading: the hubs are
 * part of what members get, but a bike shop must not read as a solar match.
 *
 * Shows a few at a time, not the whole list: the best match for this page
 * stays first, the other slots rotate through everyone else by `seed`, so
 * each article (and the homepage, hour to hour) shows different tradies.
 */
export async function LocalTradies({ category, seed = "", show = 3 }: { category?: string | null; seed?: string; show?: number }) {
  const trades = tradesFor(category)
  const [pool, all] = await Promise.all([getTradies(trades, 8), getTradies(trades, 8, true)])
  const tradies = rotate(pool, seed, show)
  const matched = new Set(pool.map((t) => t.slug))
  const others = spin(all.filter((t) => !matched.has(t.slug)), seed, show - tradies.length)
  const links = suburbLinks(category, seed)
  if (!tradies.length && !others.length && !links.length) return null

  const ref = siteConfig.name.toLowerCase()
  const withRef = (url: string) => `${url}${url.includes("?") ? "&" : "?"}ref=${ref}`

  return (
    <section className="my-12">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Local tradies on TradiHub AI</h3>
        <a
          href={withRef("https://tradihubai.com.au/trades")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-white"
        >
          See all →
        </a>
      </div>
      {tradies.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-sm text-zinc-300">
            We don&apos;t have a matching tradie listed yet. Post your job free and local tradies can quote you directly.
          </p>
          <a
            href={withRef(`https://tradihubai.com.au/jobs/new${trades[0] ? `?trade=${trades[0]}` : ""}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-white hover:underline"
          >
            Post a job, free →
          </a>
        </div>
      )}
      {tradies.length > 0 && <Cards tradies={tradies} withRef={withRef} />}
      {others.length > 0 && (
        <>
          <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-500">More tradies on TradiHub AI</h4>
          <Cards tradies={others} withRef={withRef} />
        </>
      )}
      {links.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          <span>Find local:</span>
          {links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-zinc-400 hover:text-white">
              {l.label}
            </a>
          ))}
        </p>
      )}
    </section>
  )
}

function Cards({ tradies, withRef }: { tradies: TradieCard[]; withRef: (url: string) => string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tradies.map((t) => (
        <a
          key={t.slug}
          href={withRef(t.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700"
        >
          <div className="relative h-24 bg-zinc-800">
            {t.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.cover} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" />
            )}
            <div className="absolute -bottom-6 left-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-zinc-700 bg-white">
              {t.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.logo} alt="" loading="lazy" className="h-full w-full object-contain" />
              ) : (
                <span className="text-lg font-bold text-zinc-700">{t.name.charAt(0)}</span>
              )}
            </div>
          </div>
          <div className="p-4 pt-8">
            <p className="line-clamp-2 font-semibold text-white group-hover:underline">{t.name}</p>
            <p className="mt-1 text-xs text-zinc-400">{t.trades.join(" · ")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
              {t.suburb && <span>{t.suburb}</span>}
              {t.rating != null && (
                <span className="text-amber-400">
                  ★ {t.rating.toFixed(1)} <span className="text-zinc-500">({t.reviewCount})</span>
                </span>
              )}
              {t.abnVerified && <span className="text-teal-400">✓ ABN checked</span>}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

/** First card fixed, then `show - 1` from the rest starting at a seed-picked offset. */
function rotate<T>(pool: T[], seed: string, show: number): T[] {
  const [first, ...rest] = pool
  if (!first) return []
  return [first, ...spin(rest, seed, show - 1)]
}

/** `count` items starting at a seed-picked offset. */
function spin<T>(pool: T[], seed: string, count: number): T[] {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return Array.from({ length: Math.max(0, Math.min(count, pool.length)) }, (_, i) => pool[(h + i) % pool.length])
}
