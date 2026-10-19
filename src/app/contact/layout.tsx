import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} — questions, feedback or content suggestions.`,
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
