import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"
import { NetworkHeader } from "@/components/NetworkHeader"
import { NetworkFooter } from "@/components/NetworkFooter"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--accent:${siteConfig.accent.primary};--accent-hover:${siteConfig.accent.hover}}`,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={siteConfig.name}
          href="/feed.xml"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
        <NetworkHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <NetworkFooter />
      </body>
    </html>
  )
}
