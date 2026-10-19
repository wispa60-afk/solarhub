import { ImageResponse } from "next/og"
import { siteConfig } from "@/../site.config"

// Default share card for pages without their own image (home, categories,
// static pages). Articles override it with their hero image.
export const runtime = "edge"
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  const accent = siteConfig.accent.primary
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "16px", background: accent }} />
          <div style={{ fontSize: "72px", fontWeight: 700 }}>{siteConfig.name}</div>
        </div>
        <div style={{ marginTop: "36px", fontSize: "44px", color: accent }}>{siteConfig.tagline}</div>
        <div style={{ marginTop: "20px", fontSize: "30px", color: "#a1a1aa" }}>
          Guides and free quotes from local Australian tradies
        </div>
        <div style={{ marginTop: "56px", width: "160px", height: "8px", borderRadius: "4px", background: accent }} />
        <div style={{ marginTop: "28px", fontSize: "26px", color: "#71717a" }}>{siteConfig.domain}</div>
      </div>
    ),
    size,
  )
}
