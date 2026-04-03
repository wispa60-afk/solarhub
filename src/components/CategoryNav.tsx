import Link from "next/link"
import { siteConfig } from "@/../site.config"

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

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
          href={`/category/${slugify(cat)}`}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            active === slugify(cat)
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
