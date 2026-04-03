import { siteConfig } from "@/../site.config"
import { networkSites } from "./network-config"

export type AdPosition = "banner" | "sidebar" | "in-article"

export interface HouseAd {
  title: string
  description: string
  url: string
  cta: string
  accent: string
}

export function getAd(position: AdPosition): HouseAd | null {
  if (!siteConfig.ads.houseAds) return null

  // Primary cross-promo for prominent positions
  if (position === "sidebar" || position === "banner") {
    return {
      title: siteConfig.crossPromo.primary.label,
      description: "Compare prices from local tradies. Free, no obligation.",
      url: siteConfig.crossPromo.primary.url,
      cta: siteConfig.crossPromo.primary.cta,
      accent: "#0d9488",
    }
  }

  // In-article: rotate through network sites
  const otherSites = networkSites.filter(
    (s) => !s.url.includes(siteConfig.domain)
  )
  if (otherSites.length === 0) return null
  const site = otherSites[Math.floor(Math.random() * otherSites.length)]
  return {
    title: site.name,
    description: site.description,
    url: site.url,
    cta: "Visit",
    accent: site.accent,
  }
}
