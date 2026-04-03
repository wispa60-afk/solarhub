"use client"

import { useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/../site.config"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}
import { networkSites } from "@/lib/network-config"

export function NetworkHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      {/* Network bar */}
      <div className="border-b border-zinc-800/50 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1 text-xs text-zinc-500">
          <div className="relative">
            <button
              onClick={() => setNetworkOpen(!networkOpen)}
              className="hover:text-zinc-300 transition-colors"
            >
              DLK Network
              <span className="ml-1">&#9662;</span>
            </button>
            {networkOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
                {networkSites.map((site) => (
                  <a
                    key={site.url}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <span className="font-medium">{site.name}</span>
                    <span className="block text-xs text-zinc-500">
                      {site.description}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <span className="hidden sm:inline">
            Part of the DLK Network
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-black text-sm"
            style={{ background: siteConfig.accent.primary }}
          >
            {siteConfig.name.charAt(0)}
          </div>
          <span className="text-lg font-bold text-white">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.categories.slice(0, 5).map((cat) => (
            <Link
              key={cat}
              href={`/category/${slugify(cat)}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {cat}
            </Link>
          ))}
          <Link
            href="/archive"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Archive
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-zinc-400 hover:text-white md:hidden"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-zinc-800 px-4 py-3 md:hidden">
          {siteConfig.categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${slugify(cat)}`}
              className="block py-2 text-sm text-zinc-400 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
          <Link
            href="/archive"
            className="block py-2 text-sm text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Archive
          </Link>
        </nav>
      )}
    </header>
  )
}
