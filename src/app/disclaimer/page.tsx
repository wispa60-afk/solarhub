import type { Metadata } from "next"
import { siteConfig } from "@/../site.config"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Disclaimer for ${siteConfig.name}`,
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Disclaimer</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Last updated: {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <h2 className="text-xl font-semibold text-white pt-2">
          General Information Only
        </h2>
        <p>
          The information provided on {siteConfig.domain} is for general
          informational purposes only. All information is provided in good
          faith, however we make no representation or warranty of any kind,
          express or implied, regarding the accuracy, adequacy, validity,
          reliability, or completeness of any information on the Site.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Not Professional Advice
        </h2>
        <p>
          Nothing on this Site constitutes professional building advice,
          legal advice, financial advice, or any other form of professional
          advice. You should always:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Consult a licensed and qualified professional before undertaking
            any building, renovation, electrical, plumbing, or other trade
            work
          </li>
          <li>
            Verify all costs, regulations, and requirements with relevant
            authorities in your state or territory
          </li>
          <li>
            Obtain proper permits and approvals before commencing any work
          </li>
          <li>
            Ensure all tradespeople you engage are appropriately licensed and
            insured for your jurisdiction
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-2">
          Costs and Pricing
        </h2>
        <p>
          All costs, prices, and estimates mentioned on this Site are
          indicative only and based on information available at the time of
          writing. Actual costs may vary significantly based on your location,
          project scope, materials chosen, market conditions, and other
          factors. Always obtain multiple written quotes for your specific
          project.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Regulations and Compliance
        </h2>
        <p>
          Building regulations, licensing requirements, and compliance
          obligations vary between Australian states and territories and are
          subject to change. Information on this Site may not reflect the most
          current regulatory requirements in your area. Always check with your
          local council or relevant state authority before proceeding with any
          building work.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          Affiliate Links and Advertising
        </h2>
        <p>
          This Site may contain links to third-party products, services, or
          websites. Some of these may be affiliate links, meaning we may earn
          a commission if you make a purchase through them, at no additional
          cost to you. This does not influence our editorial content or
          recommendations.
        </p>
        <p>
          The Site displays advertisements from third-party ad networks.
          We are not responsible for the content of these advertisements.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          AI-Assisted Content
        </h2>
        <p>
          Some content on this Site is created with the assistance of
          artificial intelligence tools and is reviewed by our editorial team.
          While we strive for accuracy, AI-generated content may contain
          errors. We encourage readers to verify important information
          independently.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">
          External Links
        </h2>
        <p>
          This Site may contain links to external websites that are not
          operated by us. We have no control over and assume no responsibility
          for the content, privacy policies, or practices of any third-party
          sites or services.
        </p>

        <h2 className="text-xl font-semibold text-white pt-2">Contact</h2>
        <p>
          If you find any information on this Site that you believe is
          inaccurate or outdated, please let us know via our{" "}
          <a href="/contact" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">
            contact page
          </a>{" "}
          so we can review and correct it.
        </p>
      </div>
    </div>
  )
}
