import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { getAllRoutesMeta, getNotFoundRouteMeta, type RouteMeta } from './routesMeta.ts'
import { buildRobotsTxt, buildSitemapXml } from './sitemap.ts'
import { buildSeoBody } from './seoBodyContent.ts'

function escapeAttr(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeHtml(str: string): string {
  return str
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function generatePrerenderedHtml(templateHtml: string, route: RouteMeta): string {
  let html = templateHtml

  // 1. Replace <title>
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(route.title)}</title>`)
  } else {
    html = html.replace('</head>', `  <title>${escapeHtml(route.title)}</title>\n</head>`)
  }

  // Helper to replace or inject a <meta> tag
  const replaceOrInjectMeta = (attr: 'name' | 'property', name: string, content: string) => {
    const regex = new RegExp(`<meta\\s+${attr}=["']${name}["'][^>]*>`, 'i')
    const newTag = `<meta ${attr}="${name}" content="${escapeAttr(content)}" />`
    if (regex.test(html)) {
      html = html.replace(regex, newTag)
    } else {
      html = html.replace('</head>', `    ${newTag}\n  </head>`)
    }
  }

  // 2. Meta description
  replaceOrInjectMeta('name', 'description', route.description)

  // 3. Canonical URL
  const canonicalRegex = /<link\s+rel=["']canonical["'][^>]*>/i
  const canonicalTag = `<link rel="canonical" href="${escapeAttr(route.canonical)}" />`
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, canonicalTag)
  } else {
    html = html.replace('</head>', `    ${canonicalTag}\n  </head>`)
  }

  // 4. Open Graph Tags
  replaceOrInjectMeta('property', 'og:title', route.title)
  replaceOrInjectMeta('property', 'og:description', route.description)
  replaceOrInjectMeta('property', 'og:type', route.ogType)
  replaceOrInjectMeta('property', 'og:url', route.canonical)
  replaceOrInjectMeta('property', 'og:image', route.ogImage)
  replaceOrInjectMeta('property', 'og:site_name', 'Synergy Brix')

  // 5. Twitter Card Tags
  replaceOrInjectMeta('name', 'twitter:card', route.twitterCard)
  replaceOrInjectMeta('name', 'twitter:title', route.title)
  replaceOrInjectMeta('name', 'twitter:description', route.description)
  replaceOrInjectMeta('name', 'twitter:image', route.ogImage)

  // 6. Robots Tag
  replaceOrInjectMeta('name', 'robots', route.robots)

  // 7. Structured Data (JSON-LD)
  if (route.jsonLd) {
    const jsonLdTag = `<script type="application/ld+json" data-page-jsonld="true">${JSON.stringify(
      route.jsonLd,
    )}</script>`
    const existingJsonLd = /<script\s+type=["']application\/ld\+json["'][^>]*data-page-jsonld="true"[^>]*>.*?<\/script>/is
    if (existingJsonLd.test(html)) {
      html = html.replace(existingJsonLd, jsonLdTag)
    } else {
      html = html.replace('</head>', `    ${jsonLdTag}\n  </head>`)
    }
  }

  // 8. Inject SEO body content into <div id="root"> so Googlebot can crawl the page
  //    without executing JavaScript.
  const seoBody = route.seoBody ?? buildSeoBody(route.path, route.title, route.description)
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${seoBody}</div><noscript>${seoBody}</noscript>`,
  )

  return html
}

export function prerenderAllRoutes(distDir: string, publicDir?: string) {
  const indexHtmlPath = resolve(distDir, 'index.html')
  if (!existsSync(indexHtmlPath)) {
    console.warn(`[SEO Prerender] dist/index.html not found at ${indexHtmlPath}`)
    return
  }

  const templateHtml = readFileSync(indexHtmlPath, 'utf-8')
  const allRoutes = [...getAllRoutesMeta(), getNotFoundRouteMeta()]

  console.log(`[SEO Prerender] Generating static HTML for ${allRoutes.length} routes...`)

  for (const route of allRoutes) {
    const routeHtml = generatePrerenderedHtml(templateHtml, route)

    if (route.path === '/') {
      writeFileSync(indexHtmlPath, routeHtml, 'utf-8')
    } else if (route.path === '/404') {
      const path404 = resolve(distDir, '404.html')
      writeFileSync(path404, routeHtml, 'utf-8')

      const dir404 = resolve(distDir, '404')
      if (!existsSync(dir404)) mkdirSync(dir404, { recursive: true })
      writeFileSync(resolve(dir404, 'index.html'), routeHtml, 'utf-8')
    } else {
      const cleanPath = route.path.replace(/^\//, '')
      const targetDir = resolve(distDir, cleanPath)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }

      // Write target/index.html
      writeFileSync(resolve(targetDir, 'index.html'), routeHtml, 'utf-8')

      // Also write target.html for cleanUrls compatibility
      const flatHtmlPath = resolve(distDir, `${cleanPath}.html`)
      const parentOfFlat = dirname(flatHtmlPath)
      if (!existsSync(parentOfFlat)) mkdirSync(parentOfFlat, { recursive: true })
      writeFileSync(flatHtmlPath, routeHtml, 'utf-8')
    }
  }

  // Generate sitemap.xml and robots.txt in dist/
  const sitemap = buildSitemapXml()
  const robots = buildRobotsTxt()

  writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap, 'utf-8')
  writeFileSync(resolve(distDir, 'robots.txt'), robots, 'utf-8')

  // Also sync to public/ if provided
  if (publicDir && existsSync(publicDir)) {
    writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf-8')
    writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf-8')
  }

  console.log(`[SEO Prerender] Successfully prerendered ${allRoutes.length} routes, sitemap.xml, and robots.txt.`)
}
