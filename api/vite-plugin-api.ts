import type { Plugin, PreviewServer, ViteDevServer } from 'vite'
import apiCatalog from './api-catalog.js'
import contact from './contact.js'
import markdown from './markdown.js'
import projectInquiry from './project-inquiry.js'
import { API_CATALOG_LINK } from '../seo/apiCatalog.ts'

export function apiDevPlugin(): Plugin {
  const handlers: Record<string, (request: Request) => Promise<Response> | Response> = {
    '/api/api-catalog': apiCatalog,
    '/api/contact': contact,
    '/api/markdown': markdown,
    '/api/project-inquiry': projectInquiry,
  }

  const installMiddleware = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use(async (req, res, next) => {
      res.setHeader(
        'Link',
        `${API_CATALOG_LINK}, <https://www.synergybrix.com/llms.txt>; rel="describedby"; type="text/plain"`,
      )

      const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
      const pathname = requestUrl.pathname
      const wantsMarkdown = /text\/markdown/i.test(String(req.headers.accept ?? ''))
      const isPagePath = !pathname.startsWith('/api/')
        && !pathname.startsWith('/.well-known/')
        && !/\.[^/]+$/.test(pathname)
      const apiPath = pathname === '/.well-known/api-catalog'
        ? '/api/api-catalog'
        : pathname === '/api/markdown' || (wantsMarkdown && isPagePath)
        ? '/api/markdown'
        : pathname in handlers
        ? pathname
        : undefined

      if (!apiPath || !handlers[apiPath]) {
        next()
        return
      }

      try {
        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        }
        const rawBody = Buffer.concat(chunks).toString('utf-8')

        const headers = new Headers()
        for (const [key, value] of Object.entries(req.headers)) {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((item) => headers.append(key, item))
            } else {
              headers.set(key, value)
            }
          }
        }

        const protocol = (req.socket as { encrypted?: boolean }).encrypted ? 'https' : 'http'
        const request = new Request(`${protocol}://${req.headers.host ?? 'localhost:5173'}${req.url}`, {
          method: req.method,
          headers,
          body: req.method !== 'GET' && req.method !== 'HEAD' && rawBody ? rawBody : undefined,
        })

        const response = await handlers[apiPath](request)
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(req.method === 'HEAD' ? undefined : await response.text())
      } catch (err) {
        console.error(`[api-dev-server] Error handling ${pathname}:`, err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            success: false,
            error: err instanceof Error ? err.message : 'Internal Server Error',
          }),
        )
      }
    })
  }

  return {
    name: 'api-dev-routes',
    configureServer: installMiddleware,
    configurePreviewServer: installMiddleware,
  }
}
