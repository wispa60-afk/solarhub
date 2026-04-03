import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — ${siteConfig.tagline}`,
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        About {siteConfig.name}
      </h1>

      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>
          {siteConfig.name} is an independent Australian publication dedicated
          to helping homeowners, renovators, and property investors make
          informed decisions about their building and renovation projects.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">What We Cover</h2>
        <p>
          We publish practical, research-backed articles on renovation costs,
          building regulations, trade selection, and home improvement across
          Australia. Our content focuses on real-world advice that helps
          Australians navigate the complexities of home renovation — from
          understanding permit requirements to getting fair quotes from
          qualified tradespeople.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Our Approach</h2>
        <p>
          We aim to provide accurate, up-to-date information specific to the
          Australian market. Costs, regulations, and trade licensing
          requirements vary by state and territory, and we do our best to
          reflect those differences in our content.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Part of the DLK Network
        </h2>
        <p>
          {siteConfig.name} is part of the DLK Network, a group of Australian
          digital properties operated by DLK Studio Technology Pty Ltd.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Contact</h2>
        <p>
          Have a question, correction, or content suggestion? Get in touch via
          our{" "}
          <a href="/contact" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">
            contact page
          </a>.
        </p>
      </div>
    </div>
  )
}
