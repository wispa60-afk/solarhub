/**
 * Live tradie profiles from TradiHub AI for the "Local tradies" box.
 * Server-side, cached (revalidate 10 min). Same feed on every DLK Network hub;
 * which trades to ask for comes from the article's category, else the hub.
 */
import { siteConfig } from "@/../site.config"

const TRADIHUB = process.env.NEXT_PUBLIC_TRADIHUB_URL || "https://tradihubai.com.au"

export interface TradieCard {
  name: string
  slug: string
  suburb: string | null
  trades: string[]
  logo: string | null
  cover: string | null
  rating: number | null
  reviewCount: number
  abnVerified: boolean
  url: string
}

// Hub → the trades its readers are most likely to need.
const HUB_TRADES: Record<string, string[]> = {
  RenoHub: ["renovations", "carpentry", "tiling", "plastering", "painting", "handyman", "flooring"],
  PoolHub: ["pool-building", "pool-maintenance", "fencing", "landscaping", "paving"],
  SolarHub: ["solar", "electrical", "air-conditioning"],
  PropertyHub: ["handyman", "cleaning", "mowing", "landscaping", "pest-control", "painting"],
}

// Article category (lowercased) → trades that do that work.
const CATEGORY_TRADES: Record<string, string[]> = {
  bathroom: ["plumbing", "tiling", "waterproofing", "renovations"],
  kitchen: ["cabinet-making", "renovations", "electrical", "plumbing"],
  outdoor: ["decking", "landscaping", "paving", "fencing"],
  electrical: ["electrical"],
  plumbing: ["plumbing", "gas-fitting"],
  roofing: ["roofing", "guttering"],
  flooring: ["flooring", "tiling"],
  painting: ["painting", "plastering", "rendering"],
  "pool building": ["pool-building", "concreting", "excavation"],
  "pool maintenance": ["pool-maintenance"],
  "pool equipment": ["pool-maintenance"],
  "pool safety": ["fencing", "glass-glazing"],
  "pool heating": ["solar", "electrical", "gas-fitting"],
  "outdoor living": ["decking", "paving", "landscaping"],
  "spa & hot tubs": ["pool-maintenance", "electrical"],
  "pool renovations": ["pool-building", "tiling"],
  "solar panels": ["solar"],
  "battery storage": ["solar", "electrical"],
  "ev charging": ["electrical"],
  "solar hot water": ["solar", "plumbing"],
  "commercial solar": ["solar", "electrical"],
  "off-grid": ["solar", "electrical"],
  maintenance: ["solar", "electrical"],
  selling: ["handyman", "painting", "cleaning", "landscaping", "rubbish-removal"],
  renting: ["cleaning", "handyman", "rubbish-removal", "pest-control", "locksmith"],
  renovating: ["renovations", "painting", "handyman"],
  buying: ["pest-control", "handyman", "roofing"],
}

export function tradesFor(category?: string | null): string[] {
  const own = category ? CATEGORY_TRADES[category.toLowerCase()] : undefined
  return own?.length ? own : HUB_TRADES[siteConfig.name] ?? []
}

/** fill: top up with other live tradies when too few match the trades. */
export async function getTradies(trades: string[], limit = 3, fill = false): Promise<TradieCard[]> {
  if (!trades.length && !fill) return []
  try {
    const res = await fetch(
      `${TRADIHUB}/api/public/network-tradies?trades=${encodeURIComponent(trades.join(","))}&limit=${limit}${fill ? "&fill=1" : ""}`,
      { next: { revalidate: 600 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.tradies) ? data.tradies : []
  } catch {
    return []
  }
}

// TradiHub AI builds trade × suburb pages for these trades (its top 15).
const SUBURB_PAGE_TRADES: Record<string, string> = {
  "pool-building": "Pool builders", "pool-maintenance": "Pool technicians", plumbing: "Plumbers",
  renovations: "Renovation builders", electrical: "Electricians", carpentry: "Carpenters",
  painting: "Painters", roofing: "Roofers", tiling: "Tilers", concreting: "Concreters",
  landscaping: "Landscapers", fencing: "Fencers", flooring: "Flooring installers",
  "air-conditioning": "Air-con installers", solar: "Solar installers",
}

// A spread of SEQ suburbs TradiHub AI has pages for.
const SUBURBS: [string, string][] = [
  ["brisbane-cbd", "Brisbane CBD"], ["chermside", "Chermside"], ["nundah", "Nundah"], ["carindale", "Carindale"],
  ["coorparoo", "Coorparoo"], ["mount-gravatt", "Mount Gravatt"], ["sunnybank", "Sunnybank"], ["acacia-ridge", "Acacia Ridge"],
  ["indooroopilly", "Indooroopilly"], ["toowong", "Toowong"], ["bulimba", "Bulimba"], ["logan", "Logan"],
  ["springfield", "Springfield"], ["ipswich", "Ipswich"], ["southport", "Southport"], ["robina", "Robina"],
  ["maroochydore", "Maroochydore"], ["caloundra", "Caloundra"],
]

/**
 * Links into TradiHub AI's "{trade} in {suburb}" pages for this page's topic —
 * the network linking to those pages helps them get crawled and ranked. Four
 * suburbs per page, rotated by `seed` so the whole set gets linked over time.
 */
export function suburbLinks(category: string | null | undefined, seed: string): { label: string; href: string }[] {
  const trade = tradesFor(category).find((t) => SUBURB_PAGE_TRADES[t])
  if (!trade) return []
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const ref = siteConfig.name.toLowerCase()
  return Array.from({ length: 4 }, (_, i) => SUBURBS[(h + i) % SUBURBS.length]).map(([slug, name]) => ({
    label: `${SUBURB_PAGE_TRADES[trade]} in ${name}`,
    href: `${TRADIHUB}/trades/${trade}/${slug}?ref=${ref}`,
  }))
}
