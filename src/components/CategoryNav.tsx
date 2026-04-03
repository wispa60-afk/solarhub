import Link from "next/link"
import { siteConfig } from "@/../site.config"

export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-full px-3 py-1 text-sm transition-colors ${
          !active
            ? "bg-[var(--accent)] text-black font-medium"
            : "bg-zinc-800 text-zinc-400 hover:text-white"
        }`}
      >
        All
      </Link>
      {siteConfig.categories.map((cat) => (
        <Link
          key={cat}
          href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            active?.toLowerCase() === cat.toLowerCase()
              ? "bg-[var(--accent)] text-black font-medium"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          {cat}
        </Link>
      ))}
    </nav>
  )
}
