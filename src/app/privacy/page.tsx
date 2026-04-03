import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}`,
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Last updated: {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>
          This Privacy Policy describes how {siteConfig.name} ("{siteConfig.name}",
          "we", "us", or "our"), operated by DLK Studio Technology Pty Ltd
          (ABN pending), collects, uses, and discloses your personal
          information when you visit {siteConfig.domain} (the "Site").
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Information We Collect
        </h2>
        <p>We may collect the following information:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong className="text-zinc-200">Email address</strong> — if you
            subscribe to our newsletter
          </li>
          <li>
            <strong className="text-zinc-200">Usage data</strong> — pages
            visited, time on site, referring URL, browser type, and device
            information collected automatically via analytics tools
          </li>
          <li>
            <strong className="text-zinc-200">Cookies</strong> — we use
            essential cookies for site functionality and analytics cookies to
            understand how visitors use the Site
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To send you newsletter emails (only if you have subscribed)</li>
          <li>To analyse site traffic and improve our content</li>
          <li>To display relevant advertisements</li>
          <li>To maintain and improve the Site</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-2">
          Third-Party Services
        </h2>
        <p>We may use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong className="text-zinc-200">Google Analytics</strong> — for
            website traffic analysis. Google may collect data as described in
            their{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline"
            >
              Privacy Policy
            </a>.
          </li>
          <li>
            <strong className="text-zinc-200">Google AdSense</strong> — for
            displaying advertisements. AdSense may use cookies to serve ads
            based on your browsing history.
          </li>
          <li>
            <strong className="text-zinc-200">Unsplash</strong> — for article
            imagery. Images are served from Unsplash's CDN.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-2">
          Your Rights Under Australian Privacy Law
        </h2>
        <p>
          Under the Australian Privacy Act 1988 and the Australian Privacy
          Principles (APPs), you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Unsubscribe from marketing communications at any time</li>
          <li>
            Complain to the Office of the Australian Information Commissioner
            (OAIC) if you believe your privacy has been breached
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-2">
          Newsletter Unsubscribe
        </h2>
        <p>
          You can unsubscribe from our newsletter at any time by clicking the
          unsubscribe link in any email, or by contacting us directly.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Data Retention
        </h2>
        <p>
          We retain your email address for as long as you remain subscribed to
          our newsletter. Analytics data is retained in accordance with our
          analytics provider's policies.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated "Last updated" date.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us via our{" "}
          <a href="/contact" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">
            contact page
          </a>.
        </p>
      </div>
    </div>
  )
}
