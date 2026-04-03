const UNSPLASH_API = "https://api.unsplash.com"

export async function searchImage(
  query: string
): Promise<string | undefined> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return undefined

  try {
    const res = await fetch(
      `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    )
    if (!res.ok) return undefined
    const data = await res.json()
    if (data.results?.length > 0) {
      // Use regular size (1080px wide) — good for hero images
      return data.results[0].urls?.regular
    }
  } catch {
    // Silent fail — article publishes without image
  }
  return undefined
}
