import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { getAllRoutesMeta, getNotFoundRouteMeta } from './routesMeta.ts'
import {
  API_CATALOG_CONTENT_TYPE,
  API_CATALOG_DOCUMENT,
  API_CATALOG_LINK,
  API_CATALOG_URL,
} from './apiCatalog.ts'
import { createMarkdownResponse } from './markdown.ts'
import apiCatalogHandler from '../api/api-catalog.js'

const distDir = resolve(process.cwd(), 'dist')
const allRoutes = [...getAllRoutesMeta(), getNotFoundRouteMeta()]

function unescapeHtml(str: string | null): string | null {
  if (!str) return str
  return str
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

let passed = 0
let failed = 0
const results = []

console.log(`\n========================================`)
console.log(`   TECHNICAL SEO VERIFICATION SUITE    `)
console.log(`========================================\n`)

for (const route of allRoutes) {
  const filePath =
    route.path === '/'
      ? resolve(distDir, 'index.html')
      : route.path === '/404'
      ? resolve(distDir, '404.html')
      : resolve(distDir, route.path.replace(/^\//, ''), 'index.html')

  if (!existsSync(filePath)) {
    console.error(`❌ [FAIL] Missing file for route ${route.path}: ${filePath}`)
    failed++
    continue
  }

  const html = readFileSync(filePath, 'utf-8')
  const jsonLdMatches = Array.from(
    html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis),
  )

  // 1. Verify Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i)
  const canonical = canonicalMatch ? unescapeHtml(canonicalMatch[1]) : null
  const allCanonicals = html.match(/<link\s+rel=["']canonical["']/gi) || []

  // 2. Verify Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i)
  const title = titleMatch ? unescapeHtml(titleMatch[1]) : null

  // 3. Verify Description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)
  const desc = descMatch ? unescapeHtml(descMatch[1]) : null

  // 4. Verify OG URL
  const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["'](.*?)["']/i)
  const ogUrl = ogUrlMatch ? unescapeHtml(ogUrlMatch[1]) : null

  // 5. Verify Robots
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i)
  const robots = robotsMatch ? unescapeHtml(robotsMatch[1]) : null

  const errors: string[] = []
  if (allCanonicals.length !== 1) {
    errors.push(`Found ${allCanonicals.length} canonical tags (must be exactly 1)`)
  }
  if (canonical !== route.canonical) {
    errors.push(`Canonical mismatch: got "${canonical}", expected "${route.canonical}"`)
  }
  if (title !== route.title) {
    errors.push(`Title mismatch: got "${title}", expected "${route.title}"`)
  }
  if (desc !== route.description) {
    errors.push(`Description mismatch: got "${desc}", expected "${route.description}"`)
  }
  if (ogUrl !== route.canonical) {
    errors.push(`og:url mismatch: got "${ogUrl}", expected "${route.canonical}"`)
  }
  if (robots !== route.robots) {
    errors.push(`robots mismatch: got "${robots}", expected "${route.robots}"`)
  }
  if (jsonLdMatches.length !== 1) {
    errors.push(`Found ${jsonLdMatches.length} JSON-LD scripts (must be exactly 1)`)
  } else {
    try {
      const schema = JSON.parse(jsonLdMatches[0][1]) as {
        '@type'?: string
        '@graph'?: { '@type'?: string }[]
      }
      const schemaTypes = new Set(
        [schema, ...(schema['@graph'] ?? [])]
          .map((item) => item['@type'])
          .filter((type): type is string => typeof type === 'string'),
      )
      if (route.path === '/' && (!schemaTypes.has('Organization') || !schemaTypes.has('WebSite'))) {
        errors.push('Home JSON-LD must include Organization and WebSite')
      }
      if (route.path === '/faq' && !schemaTypes.has('FAQPage')) {
        errors.push('FAQ route is missing FAQPage JSON-LD')
      }
      if (route.path.startsWith('/services/') && (!schemaTypes.has('Service') || !schemaTypes.has('BreadcrumbList'))) {
        errors.push('Service route must include Service and BreadcrumbList JSON-LD')
      }
    } catch (error) {
      errors.push(`Invalid JSON-LD: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (errors.length === 0) {
    console.log(`✅ [PASS] ${route.path.padEnd(52)} | Canonical: ${canonical}`)
    passed++
    results.push({ path: route.path, canonical, title, status: 'PASS' })
  } else {
    console.error(`❌ [FAIL] ${route.path}`)
    errors.forEach((err) => console.error(`   - ${err}`))
    failed++
    results.push({ path: route.path, errors, status: 'FAIL' })
  }
}

// Check sitemap.xml
const sitemapPath = resolve(distDir, 'sitemap.xml')
if (existsSync(sitemapPath)) {
  const sitemapContent = readFileSync(sitemapPath, 'utf-8')
  const sitemapUrls = Array.from(sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1])
  const expectedUrls = getAllRoutesMeta()
    .filter((route) => !route.robots.includes('noindex') && route.path !== '/404')
    .map((route) => route.canonical)
  const sitemapSet = new Set(sitemapUrls)
  const sitemapErrors: string[] = []
  if (sitemapSet.size !== sitemapUrls.length) sitemapErrors.push('contains duplicate URLs')
  if (sitemapUrls.some((url) => !url.startsWith('https://www.synergybrix.com/'))) {
    sitemapErrors.push('contains a URL outside the canonical production origin')
  }
  if (sitemapUrls.some((url) => !expectedUrls.includes(url))) sitemapErrors.push('contains a noncanonical or noindex URL')
  if (expectedUrls.some((url) => !sitemapSet.has(url))) sitemapErrors.push('is missing an indexable route')
  if (sitemapErrors.length) {
    console.error(`\n❌ [FAIL] sitemap.xml ${sitemapErrors.join('; ')}`)
    failed++
  } else {
    console.log(`\n✅ [PASS] sitemap.xml verified (${sitemapUrls.length} canonical, indexable URLs)`)
  }
} else {
  console.error(`\n❌ [FAIL] sitemap.xml missing in dist/`)
  failed++
}

// Check robots.txt
const robotsPath = resolve(distDir, 'robots.txt')
if (existsSync(robotsPath)) {
  const robotsContent = readFileSync(robotsPath, 'utf-8')
  if (
    robotsContent.includes('Disallow: /404') &&
    robotsContent.includes('Sitemap: https://www.synergybrix.com/sitemap.xml') &&
    robotsContent.includes('# llms.txt: https://www.synergybrix.com/llms.txt')
  ) {
    console.log(`✅ [PASS] robots.txt verified (crawl access, sitemap, and llms.txt discovery comment)`)
  } else {
    console.error(`❌ [FAIL] robots.txt missing required directives`)
    failed++
  }
} else {
  console.error(`\n❌ [FAIL] robots.txt missing in dist/`)
  failed++
}

const llmsPath = resolve(distDir, 'llms.txt')
if (existsSync(llmsPath)) {
  const llmsContent = readFileSync(llmsPath, 'utf-8')
  const requiredLinks = [
    'https://www.synergybrix.com/services',
    'https://www.synergybrix.com/about',
    'https://www.synergybrix.com/work',
    'https://www.synergybrix.com/contact',
    'https://www.synergybrix.com/.well-known/api-catalog',
    'https://www.synergybrix.com/api/contact.md',
  ]
  const missingLinks = requiredLinks.filter((url) => !llmsContent.includes(url))
  if (missingLinks.length) {
    console.error(`❌ [FAIL] llms.txt missing required public links: ${missingLinks.join(', ')}`)
    failed++
  } else {
    console.log('✅ [PASS] llms.txt verified (company facts and core public links included)')
  }
} else {
  console.error('❌ [FAIL] llms.txt missing in dist/')
  failed++
}

function reportCheck(label: string, errors: string[]): void {
  if (errors.length) {
    console.error(`❌ [FAIL] ${label}: ${errors.join('; ')}`)
    failed++
  } else {
    console.log(`✅ [PASS] ${label}`)
    passed++
  }
}

const catalogErrors: string[] = []
const catalogPath: string[] = API_CATALOG_DOCUMENT.linkset[0]?.item.map((item) => item.href) ?? []
const expectedCatalogEndpoints = [
  'https://www.synergybrix.com/api/contact',
  'https://www.synergybrix.com/api/project-inquiry',
]
if (API_CATALOG_CONTENT_TYPE !== 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"') {
  catalogErrors.push('does not declare the RFC 9727 Linkset profile')
}
if (API_CATALOG_DOCUMENT.linkset[0]?.anchor !== API_CATALOG_URL) {
  catalogErrors.push('does not anchor its endpoint list at the well-known catalog URI')
}
if (expectedCatalogEndpoints.some((endpoint) => !catalogPath.includes(endpoint))) {
  catalogErrors.push('does not link to each existing enquiry endpoint')
}
if (API_CATALOG_LINK !== `<${API_CATALOG_URL}>; rel="api-catalog"`) {
  catalogErrors.push('does not expose the RFC 9727 Link relation')
}
reportCheck('RFC 9727 API catalog data', catalogErrors)

const catalogResponse = apiCatalogHandler(new Request(API_CATALOG_URL))
const catalogResponseBody = await catalogResponse.json() as typeof API_CATALOG_DOCUMENT
const catalogResponseErrors: string[] = []
if (catalogResponse.status !== 200) catalogResponseErrors.push(`GET returned ${catalogResponse.status}`)
if (!catalogResponse.headers.get('content-type')?.includes(API_CATALOG_CONTENT_TYPE)) {
  catalogResponseErrors.push('GET has the wrong Linkset content type/profile')
}
if (catalogResponse.headers.get('link') !== API_CATALOG_LINK) {
  catalogResponseErrors.push('GET is missing the api-catalog Link header')
}
if (JSON.stringify(catalogResponseBody) !== JSON.stringify(API_CATALOG_DOCUMENT)) {
  catalogResponseErrors.push('GET body differs from the validated catalog data')
}
const catalogHeadResponse = apiCatalogHandler(new Request(API_CATALOG_URL, { method: 'HEAD' }))
if (catalogHeadResponse.status !== 200 || catalogHeadResponse.headers.get('link') !== API_CATALOG_LINK) {
  catalogResponseErrors.push('HEAD does not return 200 with the api-catalog Link header')
}
reportCheck('API catalog GET and HEAD responses', catalogResponseErrors)

const markdownErrors: string[] = []
const markdownResponse = createMarkdownResponse(
  new Request('https://www.synergybrix.com/services/web-development', {
    headers: { Accept: 'text/markdown' },
  }),
)
const markdownBody = await markdownResponse.text()
if (markdownResponse.status !== 200) markdownErrors.push(`Markdown request returned ${markdownResponse.status}`)
if (!markdownResponse.headers.get('content-type')?.startsWith('text/markdown')) {
  markdownErrors.push('Markdown request has the wrong Content-Type')
}
if (!markdownResponse.headers.get('vary')?.toLowerCase().includes('accept')) {
  markdownErrors.push('Markdown response does not vary by Accept')
}
if (!markdownBody.includes('# Web Application Development')) {
  markdownErrors.push('Markdown response is missing the service page heading')
}
if (/<\/?[a-z][^>]*>/i.test(markdownBody)) markdownErrors.push('Markdown response contains HTML tags')
const markdownHeadResponse = createMarkdownResponse(
  new Request('https://www.synergybrix.com/services/web-development', {
    method: 'HEAD',
    headers: { Accept: 'text/markdown' },
  }),
)
if (markdownHeadResponse.status !== 200 || (await markdownHeadResponse.text()) !== '') {
  markdownErrors.push('HEAD did not return an empty Markdown response with status 200')
}
const markdownQZeroResponse = createMarkdownResponse(
  new Request('https://www.synergybrix.com/services/web-development', {
    headers: { Accept: 'text/markdown;q=0' },
  }),
)
if (markdownQZeroResponse.status !== 406) markdownErrors.push('q=0 was not rejected with 406')
const unsupportedMarkdownResponse = createMarkdownResponse(
  new Request('https://www.synergybrix.com/not-a-page', {
    headers: { Accept: 'text/markdown' },
  }),
)
if (unsupportedMarkdownResponse.status !== 404) markdownErrors.push('unsupported page did not return 404')
const markdownPostResponse = createMarkdownResponse(
  new Request('https://www.synergybrix.com/services/web-development', {
    method: 'POST',
    headers: { Accept: 'text/markdown' },
  }),
)
if (markdownPostResponse.status !== 405) markdownErrors.push('non-GET/HEAD method did not return 405')
reportCheck('Markdown negotiation responses', markdownErrors)

const vercelPath = resolve(process.cwd(), 'vercel.json')
const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf-8')) as {
  rewrites: { source: string; destination: string; has?: { type: string; key: string; value: string }[] }[]
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const vercelErrors: string[] = []
const markdownRoutes = getAllRoutesMeta().filter((route) => route.path !== '/404')
for (const route of markdownRoutes) {
  const rewrite = vercelConfig.rewrites.find((item) => item.source === route.path)
  if (!rewrite || !rewrite.destination.startsWith('/api/markdown?path=')) {
    vercelErrors.push(`missing Markdown rewrite for ${route.path}`)
  } else if (!rewrite.has?.some((condition) => condition.type === 'header' && condition.key === 'accept')) {
    vercelErrors.push(`Markdown rewrite for ${route.path} lacks an Accept condition`)
  }
}
if (!vercelConfig.rewrites.some((rewrite) => rewrite.source === '/.well-known/api-catalog' && rewrite.destination === '/api/api-catalog')) {
  vercelErrors.push('missing well-known API catalog rewrite')
}
if (!vercelConfig.headers.some((rule) => rule.headers.some((header) => header.key === 'Link' && header.value.includes(API_CATALOG_URL)))) {
  vercelErrors.push('missing global discovery Link response header')
}
if (!existsSync(resolve(distDir, 'api', 'contact.md'))) {
  vercelErrors.push('API endpoint documentation was not copied into the production build')
}
reportCheck('Vercel discovery and Markdown routing configuration', vercelErrors)

console.log(`\n----------------------------------------`)
console.log(`Summary: ${passed} PASSED | ${failed} FAILED`)
console.log(`----------------------------------------\n`)

if (failed > 0) process.exit(1)
