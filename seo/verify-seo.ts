import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { getAllRoutesMeta, getNotFoundRouteMeta } from './routesMeta.ts'

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
  const locCount = (sitemapContent.match(/<loc>/g) || []).length
  console.log(`\n✅ [PASS] sitemap.xml verified (${locCount} URLs total, all on https://www.synergybrix.com)`)
} else {
  console.error(`\n❌ [FAIL] sitemap.xml missing in dist/`)
}

// Check robots.txt
const robotsPath = resolve(distDir, 'robots.txt')
if (existsSync(robotsPath)) {
  const robotsContent = readFileSync(robotsPath, 'utf-8')
  if (robotsContent.includes('Disallow: /404') && robotsContent.includes('Sitemap: https://www.synergybrix.com/sitemap.xml')) {
    console.log(`✅ [PASS] robots.txt verified (Disallow: /404, Sitemap: https://www.synergybrix.com/sitemap.xml included)`)
  } else {
    console.error(`❌ [FAIL] robots.txt missing required directives`)
  }
} else {
  console.error(`\n❌ [FAIL] robots.txt missing in dist/`)
}

console.log(`\n----------------------------------------`)
console.log(`Summary: ${passed} PASSED | ${failed} FAILED`)
console.log(`----------------------------------------\n`)

if (failed > 0) process.exit(1)
