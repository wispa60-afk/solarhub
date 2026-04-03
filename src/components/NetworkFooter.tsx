import Link from "next/link"
import { siteConfig } from "@/../site.config"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}
import { networkSites } from "@/lib/network-config"

export function NetworkFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md font-bold text-black text-xs"
                style={{ background: siteConfig.accent.primary }}
              >
                {siteConfig.name.charAt(0)}
              </div>
              <span className="font-bold text-white">{siteConfig.name}</span>
            </div>
            <p className="text-sm text-zinc-500">{siteConfig.tagline}</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-zinc-300">
              Categories
            </h4>
            <ul className="space-y-2">
              {siteConfig.categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${slugify(cat)}`}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-zinc-300">
              DLK Network
            </h4>
            <ul className="space-y-2">
              {networkSites.map((site) => (
                <li key={site.url}>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {site.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-zinc-300">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Archive
                </Link>
              </li>
            </ul>
            <h4 className="mb-3 mt-6 text-sm font-semibold text-zinc-300">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
          <span>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          <span>A DLK Network site &middot; Powered by DLK Studio</span>
        </div>
      </div>
    </footer>
  )
}
