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
