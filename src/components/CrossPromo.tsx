import { networkSites } from "@/lib/network-config"
import { siteConfig } from "@/../site.config"

export function CrossPromo() {
  const otherSites = networkSites.filter(
    (s) => !s.url.includes(siteConfig.domain)
  )
  if (otherSites.length === 0) return null

  return (
    <section className="mt-12">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        More from our network
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherSites.map((site) => (
          <a
            key={site.url}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-black text-xs"
                style={{ background: site.accent }}
              >
                {site.name.charAt(0)}
              </div>
              <span className="font-semibold text-zinc-100 group-hover:text-white">
                {site.name}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{site.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
