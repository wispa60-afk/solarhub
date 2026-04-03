import { getAd, type AdPosition } from "@/lib/ad-engine"

export function AdSlot({ position }: { position: AdPosition }) {
  const ad = getAd(position)
  if (!ad) return null

  if (position === "banner") {
    return (
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 text-center hover:border-zinc-700 transition-all"
      >
        <p className="text-sm text-zinc-400 mb-1">{ad.description}</p>
        <p className="text-lg font-bold text-white">{ad.title}</p>
        <span
          className="mt-3 inline-block rounded-lg px-5 py-2 text-sm font-semibold text-black"
          style={{ background: ad.accent }}
        >
          {ad.cta}
        </span>
      </a>
    )
  }

  if (position === "sidebar") {
    return (
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 hover:border-zinc-700 transition-all"
      >
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
          Sponsored
        </p>
        <p className="font-semibold text-white mb-1">{ad.title}</p>
        <p className="text-sm text-zinc-400 mb-3">{ad.description}</p>
        <span
          className="inline-block rounded-md px-4 py-1.5 text-sm font-medium text-black"
          style={{ background: ad.accent }}
        >
          {ad.cta}
        </span>
      </a>
    )
  }

  // in-article
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-all"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-black text-sm"
        style={{ background: ad.accent }}
      >
        {ad.title.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-200">{ad.title}</p>
        <p className="text-sm text-zinc-500">{ad.description}</p>
      </div>
      <span className="shrink-0 text-sm font-medium" style={{ color: ad.accent }}>
        {ad.cta} &rarr;
      </span>
    </a>
  )
}
