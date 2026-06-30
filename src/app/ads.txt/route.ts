// Dynamic ads.txt — declares Google AdSense as an authorised seller so ad
// revenue isn't blocked. Serves the record only when NEXT_PUBLIC_ADSENSE_CLIENT
// (e.g. "ca-pub-...") is set; 404 until then, so it's inert before activation.
export const dynamic = "force-dynamic"

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const pub = client?.replace(/^ca-/, "")
  if (!pub) return new Response("", { status: 404 })
  // f08c47fec0942fa0 is Google's fixed AdSense certification-authority ID.
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0
`, {
    headers: { "content-type": "text/plain" },
  })
}
