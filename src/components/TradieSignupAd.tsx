import { siteConfig } from "@/../site.config"

/**
 * House ad recruiting tradies for TradiHub AI — same message as the Facebook
 * ad. Static (no fetch), so it always renders; the ?ref tag shows which hub a
 * sign-up came from. nofollow because it's a promotional placement across our
 * own sites, not an editorial link.
 */
export function TradieSignupAd() {
  const href = `https://tradihubai.com.au/register?ref=${siteConfig.name.toLowerCase()}`

  return (
    <section className="my-12">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        For tradies
      </h3>
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-teal-500/40 sm:flex-row"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tradihub-tradie.jpg"
          alt="A tradie at work on a Queensland home"
          width={640}
          height={400}
          loading="lazy"
          className="h-48 w-full object-cover sm:w-64 sm:shrink-0"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-semibold text-black">
              TradiHub AI
            </span>
            <span className="text-xs text-zinc-500">South Brisbane &amp; Logan</span>
          </div>
          <p className="font-semibold text-zinc-100 group-hover:text-white">
            Tradies: get found by local homeowners
          </p>
          <p className="mt-1 flex-1 text-sm text-zinc-400">
            A free-to-start local directory with your real Google reviews and an ABN-checked tick. No per-lead
            fees, no lock-in. Founding members wanted.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-teal-400">Free to start</span>
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
              List your business &rarr;
            </span>
          </div>
        </div>
      </a>
    </section>
  )
}
