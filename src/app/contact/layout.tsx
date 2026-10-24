import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} about our guides, corrections, partnerships or advertising, or ask how to get quotes from local tradies.`,
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
