import { getAllRoutesMeta, type RouteMeta } from './routesMeta.ts'
import { resolveSiteUrl, SITE_URL } from './siteUrl.ts'

export type SitemapEntry = Pick<RouteMeta, 'canonical'>

export function getSitemapBaseUrl(): string {
  return resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VITE_SITE_URL ?? SITE_URL)
}

export function getSitemapEntries(): SitemapEntry[] {
  const allRoutes = getAllRoutesMeta()
  const seen = new Set<string>()

  return allRoutes
    .filter((route) => {
      // Exclude any noindex or non-public routes
      if (route.robots.includes('noindex') || route.path === '/404') return false
      if (seen.has(route.canonical)) return false
      seen.add(route.canonical)
      return true
    })
    .map((route: RouteMeta) => ({ canonical: route.canonical }))
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function buildSitemapXml(): string {
  const entries = getSitemapEntries()

  const urls = entries
    .map((entry) => {
      return `  <url>
    <loc>${escapeXml(entry.canonical)}</loc>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobotsTxt(): string {
  const baseUrl = getSitemapBaseUrl()
  return `User-agent: *
Allow: /

Disallow: /404

# llms.txt: ${baseUrl}/llms.txt

Sitemap: ${baseUrl}/sitemap.xml
`
}
