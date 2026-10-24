import { getTradies, tradesFor } from "@/lib/tradie-feed"
import { siteConfig } from "@/../site.config"

/**
 * "Local tradies on TradiHub AI" — live profiles matching this page's topic,
 * linking to their profile (with a ?ref tag so the tradie's lead report shows
 * the hub). Falls back to the hub's trades; renders nothing if the feed is
 * empty or unreachable.
 */
export async function LocalTradies({ category, limit = 3 }: { category?: string | null; limit?: number }) {
  // Matching trades first, then every other live tradie fills the rest.
  const tradies = await getTradies(tradesFor(category), limit, true)
  if (!tradies.length) return null

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
    </section>
  )
}
