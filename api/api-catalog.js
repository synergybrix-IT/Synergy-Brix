import {
  API_CATALOG_CONTENT_TYPE,
  API_CATALOG_DOCUMENT,
  API_CATALOG_LINK,
} from '../seo/apiCatalog.ts'

const headers = {
  'Content-Type': API_CATALOG_CONTENT_TYPE,
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  Link: API_CATALOG_LINK,
  'X-Content-Type-Options': 'nosniff',
}

export default function handler(req, res) {
  const method = req.method || 'GET'

  if (method !== 'GET' && method !== 'HEAD') {
    const responseHeaders = { ...headers, Allow: 'GET, HEAD' }
    if (res) {
      res.statusCode = 405
      Object.entries(responseHeaders).forEach(([key, value]) => res.setHeader(key, value))
      res.end()
      return
    }
    return new Response(null, { status: 405, headers: responseHeaders })
  }

  const body = method === 'HEAD' ? null : JSON.stringify(API_CATALOG_DOCUMENT)
  if (res) {
    res.statusCode = 200
    Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value))
    res.end(body ?? undefined)
    return
  }
  return new Response(body, { status: 200, headers })
}
