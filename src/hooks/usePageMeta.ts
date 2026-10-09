import { useEffect } from 'react'
import { SITE_URL } from '../config/siteUrl'

export interface PageMetaOptions {
  title: string
  description: string
  canonical: string
  robots?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

function buildPageJsonLd(title: string, canonical: string): Record<string, unknown> {
  const path = canonical.startsWith(SITE_URL) ? canonical.slice(SITE_URL.length).split('?')[0] : ''
  const segments = path.split('/').filter(Boolean)
  const itemListElement: Record<string, unknown>[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ]
  let parentPath = ''

  segments.forEach((segment, index) => {
    parentPath += `/${segment}`
    const name =
      index === segments.length - 1
        ? title.split('|')[0].trim()
        : segment.replaceAll('-', ' ').replace(/\b\w/g, (character) => character.toUpperCase())
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name,
      item: `${SITE_URL}${parentPath}`,
    })
  })

  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement },
      {
        '@type': 'WebPage',
        name: title,
        url: canonical,
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
    ],
  }
}

export function usePageMeta({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogType = 'website',
  ogImage = `${SITE_URL}/logo.png`,
  twitterCard = 'summary_large_image',
  jsonLd,
}: PageMetaOptions) {
  useEffect(() => {
    // 1. Page Title
    document.title = title

    // Helper for unique meta tag management
    const setMetaTag = (selectorKey: string, selectorVal: string, content: string) => {
      const existing = Array.from(document.querySelectorAll(`meta[${selectorKey}="${selectorVal}"]`))
      if (existing.length > 0) {
        existing[0].setAttribute('content', content)
        for (let i = 1; i < existing.length; i++) {
          existing[i].remove()
        }
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute(selectorKey, selectorVal)
        meta.setAttribute('content', content)
        document.head.appendChild(meta)
      }
    }

    // 2. Meta description
    setMetaTag('name', 'description', description)

    // 3. Canonical Tag (Strictly Single)
    const canonicalTags = Array.from(document.querySelectorAll('link[rel="canonical"]'))
    if (canonicalTags.length > 0) {
      canonicalTags[0].setAttribute('href', canonical)
      for (let i = 1; i < canonicalTags.length; i++) {
        canonicalTags[i].remove()
      }
    } else {
      const canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      canonicalTag.setAttribute('href', canonical)
      document.head.appendChild(canonicalTag)
    }

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:url', canonical)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:site_name', 'Synergy Brix')

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', twitterCard)
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    // 6. Robots Tag
    setMetaTag('name', 'robots', robots)

    // 7. Keep a page-specific schema on client-side navigation.
    let scriptTag = document.querySelector('script[data-page-jsonld="true"]')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.setAttribute('type', 'application/ld+json')
      scriptTag.setAttribute('data-page-jsonld', 'true')
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(jsonLd ?? buildPageJsonLd(title, canonical))
  }, [title, description, canonical, robots, ogType, ogImage, twitterCard, jsonLd])
}
