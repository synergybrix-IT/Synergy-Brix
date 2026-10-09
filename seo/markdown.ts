import { getAllRoutesMeta } from './routesMeta.ts'
import { SITE_URL } from './siteUrl.ts'
import { buildSeoBody } from './seoBodyContent.ts'
import { API_CATALOG_LINK } from './apiCatalog.ts'
import type { IncomingMessage } from 'node:http'

const LINK_HEADER = `${API_CATALOG_LINK}, <${SITE_URL}/llms.txt>; rel="describedby"; type="text/plain"`

function getHeader(req: Request | IncomingMessage, name: string): string {
  if (req instanceof Request) return req.headers.get(name) ?? ''
  const value = req.headers[name.toLowerCase()]
  return Array.isArray(value) ? value.join(', ') : value ?? ''
}

function getRequestMethod(req: Request | IncomingMessage): string {
  return req.method?.toUpperCase() ?? 'GET'
}

function getRequestUrl(req: Request | IncomingMessage): URL {
  if (req instanceof Request) return new URL(req.url)
  const host = req.headers.host ?? 'www.synergybrix.com'
  return new URL(req.url ?? '/', `https://${host}`)
}

export function acceptsMarkdown(accept: string): boolean {
  return accept.split(',').some((candidate) => {
    const [mediaType, ...parameters] = candidate.trim().split(';')
    if (mediaType?.trim().toLowerCase() !== 'text/markdown') return false

    const quality = parameters.find((parameter) => /^\s*q\s*=/i.test(parameter))
    if (!quality) return true

    const value = Number(quality.split('=')[1]?.trim())
    return Number.isFinite(value) && value > 0 && value <= 1
  })
}

function decodeHtml(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    bull: '•',
    copy: '©',
    gt: '>',
    ldquo: '“',
    lsquo: '‘',
    mdash: '—',
    nbsp: ' ',
    ndash: '–',
    quot: '"',
    rdquo: '”',
    rsquo: '’',
    lt: '<',
  }

  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, key: string) => {
    if (key[0] === '#') {
      const codePoint = key[1]?.toLowerCase() === 'x'
        ? Number.parseInt(key.slice(2), 16)
        : Number.parseInt(key.slice(1), 10)
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity
    }
    return namedEntities[key.toLowerCase()] ?? entity
  })
}

function plainText(html: string): string {
  return decodeHtml(html.replace(/<[^>]*>/g, '')).trim()
}

function htmlToMarkdown(html: string): string {
  let markdown = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_match, code: string) => `\n\n\`\`\`\n${plainText(code)}\n\`\`\`\n\n`)
    .replace(/<img\b([^>]*)>/gi, (_match, attributes: string) => {
      const alt = attributes.match(/\balt=(["'])(.*?)\1/i)?.[2] ?? ''
      const src = attributes.match(/\bsrc=(["'])(.*?)\1/i)?.[2] ?? ''
      return src ? `![${decodeHtml(alt)}](${decodeHtml(src)})` : ''
    })
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_match, attributes: string, content: string) => {
      const href = attributes.match(/\bhref=(["'])(.*?)\1/i)?.[2]
      const text = plainText(content)
      return href ? `[${text}](${decodeHtml(href)})` : text
    })
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_match, level: string, content: string) => {
      return `\n\n${'#'.repeat(Number(level))} ${plainText(content)}\n\n`
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, _tag: string, content: string) => {
      return `**${plainText(content)}**`
    })
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, _tag: string, content: string) => {
      return `*${plainText(content)}*`
    })
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_match, content: string) => `\`${plainText(content)}\``)
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/(ul|ol)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|section|article|div|main|nav|header|footer|blockquote|table|tr|h[1-6])>/gi, '\n\n')
    .replace(/<[^>]*>/g, ' ')

  markdown = decodeHtml(markdown)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return markdown
}

function response(status: number, body: string, headers: Record<string, string> = {}): Response {
  const responseHeaders = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
    'Vary': 'Accept',
    'X-Content-Type-Options': 'nosniff',
    Link: LINK_HEADER,
    ...headers,
  })
  return new Response(body, { status, headers: responseHeaders })
}

export function createMarkdownResponse(req: Request | IncomingMessage): Response {
  const method = getRequestMethod(req)
  if (method !== 'GET' && method !== 'HEAD') {
    return response(405, 'Method not allowed.', { Allow: 'GET, HEAD' })
  }

  if (!acceptsMarkdown(getHeader(req, 'accept'))) {
    return response(406, 'This endpoint requires Accept: text/markdown.')
  }

  const url = getRequestUrl(req)
  const requestedPath = url.searchParams.get('path') ?? url.pathname
  const path = requestedPath === '/' ? '/' : `/${requestedPath.replace(/^\/+|\/+$/g, '')}`
  const route = getAllRoutesMeta().find((candidate) => candidate.path === path && path !== '/404')
  if (!route) return response(404, 'No Markdown representation is available for this page.')

  const seoHtml = buildSeoBody(route.path, route.title, route.description)
  const main = seoHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
  if (!main) {
    console.error(`[markdown] generated SEO body is missing <main> for ${route.path}`)
    return response(500, 'Markdown representation could not be generated.')
  }

  const markdown = htmlToMarkdown(main)
  return response(200, method === 'HEAD' ? '' : markdown, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    Link: `${LINK_HEADER}, <${route.canonical}>; rel="canonical"`,
  })
}
