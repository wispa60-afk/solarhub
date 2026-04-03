import { siteConfig } from "../../site.config"

type Position = "top" | "mid" | "bottom"

const COPY: Record<Position, { heading: string; sub?: string; cta: string }> = {
  top: {
    heading: "Getting quotes? Compare prices from 3 local tradies — free.",
    cta: "Get My Quotes →",
    sub: "Free \u00b7 60 seconds \u00b7 No obligation",
  },
  mid: {
    heading: "Ready to get started? Local tradies are available now.",
    cta: "Get 3 Free Quotes",
    sub: "Free \u00b7 60 seconds \u00b7 No obligation",
  },
  bottom: {
    heading: "Done researching? The next step is getting real quotes.",
    cta: "Get My Quotes — It\u2019s Free →",
    sub: "No obligation. Takes 60 seconds.",
  },
}

function getTradeSlug(): string {
  const name = siteConfig.name.toLowerCase()
  if (name.includes("pool")) return "pool-building"
  if (name.includes("reno")) return "renovations"
  if (name.includes("solar")) return "solar"
  if (name.includes("property")) return "renovations"
  return ""
}

function getRefSlug(): string {
  return siteConfig.domain.replace(".com.au", "").replace(/\./g, "-")
}

export function QuoteCTA({
  position = "mid",
  category,
}: {
  position?: Position
  category?: string
}) {
  const copy = COPY[position]
  const trade = getTradeSlug()
  const ref = getRefSlug()
  const href = `https://tradihubai.com.au/jobs/new?trade=${trade}&ref=${ref}`

  // Inject category name into heading if provided
  const heading = category
    ? copy.heading.replace("tradies", `${category.toLowerCase()} tradies`)
    : copy.heading

  if (position === "top" || position === "mid") {
    return (
      <div className="my-6 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-transparent p-5 sm:p-6">
        <p className="text-sm sm:text-base font-medium text-zinc-200 mb-3">
          {heading}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={href}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 hover:bg-teal-400 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {copy.cta}
          </a>
          {copy.sub && <span className="text-xs text-zinc-500">{copy.sub}</span>}
        </div>
      </div>
    )
  }

  // bottom — more prominent
  return (
    <div className="my-8 rounded-xl border border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-transparent p-6 sm:p-8 text-center">
      <p className="text-base sm:text-lg font-semibold text-white mb-4">
        {heading}
      </p>
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-all shadow-lg shadow-teal-500/25"
      >
        {copy.cta}
      </a>
      {copy.sub && (
        <p className="mt-3 text-xs text-zinc-500">{copy.sub}</p>
      )}
    </div>
  )
}
