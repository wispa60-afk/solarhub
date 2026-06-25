/**
 * Pulls active business-for-sale listings from TradiHub so they can flow
 * through this site as house ads. Server-side, cached (revalidate 10 min).
 */
const TRADIHUB = process.env.NEXT_PUBLIC_TRADIHUB_URL || "https://tradihubai.com.au"

export interface BusinessAd {
  slug: string
  title: string
  trade: string | null
  suburb: string | null
  state: string | null
  priceText: string | null
  established: string | null
  summary: string
  image: string | null
  url: string
}

export async function getBusinessAds(): Promise<BusinessAd[]> {
  try {
    const res = await fetch(`${TRADIHUB}/api/public/businesses`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.businesses) ? data.businesses : []
  } catch {
    return []
  }
}
