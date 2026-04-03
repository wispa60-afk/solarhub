import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of Use for ${siteConfig.name}`,
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Use</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Last updated: {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>
          By accessing and using {siteConfig.domain} (the "Site"), you agree to
          be bound by these Terms of Use. If you do not agree, please do not
          use the Site.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Content and Information
        </h2>
        <p>
          The content on this Site is provided for general informational
          purposes only. While we strive to keep information accurate and
          up-to-date, we make no representations or warranties of any kind,
          express or implied, about the completeness, accuracy, reliability,
          or suitability of the information.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Not Professional Advice
        </h2>
        <p>
          The information on this Site does not constitute professional
          building, legal, financial, or trade advice. Always consult a
          qualified, licensed professional before undertaking any building or
          renovation work. Regulations, costs, and requirements vary by
          location and change over time.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Third-Party Links
        </h2>
        <p>
          The Site may contain links to third-party websites. We have no
          control over the content or practices of these sites and accept no
          responsibility for them. Inclusion of any link does not imply
          endorsement.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Intellectual Property
        </h2>
        <p>
          All original content on this Site, including text, graphics, and
          design, is the property of DLK Studio Technology Pty Ltd and is
          protected by Australian copyright law. You may not reproduce,
          distribute, or republish any content without prior written consent.
        </p>
        <p>
          Images sourced from Unsplash are used under the{" "}
          <a
            href="https://unsplash.com/license"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline"
          >
            Unsplash License
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, {siteConfig.name} and DLK
          Studio Technology Pty Ltd shall not be liable for any loss or damage
          arising from your use of, or reliance on, information provided on
          this Site. This includes but is not limited to direct, indirect,
          incidental, or consequential damages.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Australian Consumer Law
        </h2>
        <p>
          Nothing in these Terms excludes, restricts, or modifies any rights
          you may have under the Australian Consumer Law (Schedule 2 of the
          Competition and Consumer Act 2010) or any other applicable
          legislation that cannot be excluded by agreement.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Changes to These Terms
        </h2>
        <p>
          We reserve the right to update these Terms at any time. Continued
          use of the Site after changes constitutes acceptance of the revised
          Terms.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Governing Law
        </h2>
        <p>
          These Terms are governed by the laws of Queensland, Australia. Any
          disputes shall be subject to the exclusive jurisdiction of the
          courts of Queensland.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Contact</h2>
        <p>
          Questions about these Terms? Contact us via our{" "}
          <a href="/contact" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">
            contact page
          </a>.
        </p>
      </div>
    </div>
  )
}
