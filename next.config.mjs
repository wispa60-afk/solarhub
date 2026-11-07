/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Retired duplicates that still get seen in Google: send them to the live article.
  async redirects() {
    return [
      { source: '/off-grid-solar-systems-australia-guide', destination: '/off-grid-solar-systems-australia', permanent: true },
      { source: '/solar-panel-maintenance-guide-australian-homeowners', destination: '/solar-panel-maintenance-tips', permanent: true },
      { source: '/solar-rebates-incentives-australia-2024', destination: '/solar-rebates-stcs-explained-2026', permanent: true },
    ]
  },
}

export default nextConfig
