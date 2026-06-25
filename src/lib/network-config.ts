export interface NetworkSite {
  name: string
  url: string
  description: string
  accent: string
}

export const networkSites: NetworkSite[] = [
  {
    name: "TradiHub",
    url: "https://tradihubai.com.au",
    description: "Find trusted Australian tradies",
    accent: "#0d9488",
  },
  {
    name: "RenoHub",
    url: "https://renohubai.com.au",
    description: "Renovation guides & tips for Aussie homeowners",
    accent: "#f59e0b",
  },
  {
    name: "SolarHub",
    url: "https://solarhubai.com.au",
    description: "Solar energy guides for Australian homeowners",
    accent: "#0ea5e9",
  },
  {
    name: "PropertyHub",
    url: "https://propertyhubai.com.au",
    description: "Property & real estate guides for Australians",
    accent: "#10b981",
  },
  {
    name: "PoolHub",
    url: "https://poolhubai.com.au",
    description: "Pool & outdoor living guides for Australians",
    accent: "#06b6d4",
  },
  {
    name: "Car Scout",
    url: "https://car-scout.com.au",
    description: "AI car buying & research for Australians",
    accent: "#facc15",
  },
]
