import { getBusinessAds } from "@/lib/business-ads"
import { siteConfig } from "@/../site.config"

/**
 * "Business for Sale" house ad — pulls live listings from TradiHub and links
 * back to the listing (with a ?ref tag for tracking). Renders nothing if the
 * feed is empty/unreachable.
 */
export async function BusinessAd() {
  const ads = await getBusinessAds()
  if (!ads.length) return null

  const ad = ads[0]
  const ref = siteConfig.name.toLowerCase()
  const href = `${ad.url}?ref=${ref}`
  const where = [ad.suburb, ad.state].filter(Boolean).join(", ")

  return (
    <section className="my-12">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Business for sale
      </h3>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 sm:flex-row"
      >
        {ad.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.image}
            alt={ad.title}
            className="h-48 w-full object-cover sm:w-64 sm:shrink-0"
          />
        )}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-black"
              style={{ background: siteConfig.accent.primary }}
            >
              For Sale
            </span>
            {ad.trade && (
              <span className="text-xs text-zinc-500">
                {ad.trade}
                {where ? ` · ${where}` : ""}
              </span>
            )}
          </div>
          <p className="font-semibold text-zinc-100 group-hover:text-white">{ad.title}</p>
          <p className="mt-1 flex-1 text-sm text-zinc-400 line-clamp-2">{ad.summary}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: siteConfig.accent.primary }}>
              {ad.priceText || "Enquire"}
            </span>
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
              View listing &rarr;
            </span>
          </div>
        </div>
      </a>
    </section>
  )
}
