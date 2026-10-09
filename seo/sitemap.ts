import { getAllRoutesMeta, type RouteMeta } from './routesMeta.ts'
import { resolveSiteUrl, SITE_URL } from './siteUrl.ts'

export type SitemapChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export type SitemapEntry = {
  path: string
  changeFrequency: SitemapChangeFrequency
  priority: number
  lastmod?: string
}

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
      if (seen.has(route.path)) return false
      seen.add(route.path)
      return true
    })
    .map((route: RouteMeta) => ({
      path: route.path,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function buildSitemapXml(lastModified = new Date()): string {
  const baseUrl = getSitemapBaseUrl()
  const lastmod = lastModified.toISOString().split('T')[0]
  const entries = getSitemapEntries()

  const urls = entries
    .map((entry) => {
      const loc = entry.path === '/' ? `${baseUrl}/` : `${baseUrl}${entry.path}`
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
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
