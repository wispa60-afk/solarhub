import { MetadataRoute } from "next"
import { siteConfig } from "@/../site.config"

// Explicitly welcome search + AI crawlers and point them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = `https://${siteConfig.domain}`
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
