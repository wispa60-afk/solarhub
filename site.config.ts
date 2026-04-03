export const siteConfig = {
  name: "SolarHub",
  tagline: "Australia's Solar Energy Guide",
  domain: "solarhubai.com.au",
  port: 3202,
  accent: { primary: "#0ea5e9", hover: "#0284c7" },
  categories: [
    "Solar Panels",
    "Battery Storage",
    "EV Charging",
    "Solar Hot Water",
    "Rebates & Incentives",
    "Off-Grid",
    "Commercial Solar",
    "Maintenance",
  ],
  crossPromo: {
    primary: {
      label: "Get 3 Free Quotes",
      url: "https://tradihubai.com.au/jobs/new?trade=solar&ref=solarhub",
      cta: "Get Quotes Now",
    },
    network: ["tradihubai.com.au", "renohubai.com.au"],
  },
  newsletter: { enabled: true },
  ads: { adsense: false, houseAds: true },
  socials: { facebook: "", instagram: "", tiktok: "" },
}

export type SiteConfig = typeof siteConfig
