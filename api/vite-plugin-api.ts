import type { Plugin, ViteDevServer } from 'vite'

export function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-routes',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/api/contact' || url === '/api/project-inquiry') {
          try {
            const chunks: Buffer[] = []
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
            }
            const rawBody = Buffer.concat(chunks).toString('utf-8')

            const filePath = url === '/api/contact' ? '/api/contact.ts' : '/api/project-inquiry.ts'
            const mod = await server.ssrLoadModule(filePath)

            const host = req.headers.host || 'localhost:5173'
            const protocol = (req.socket as { encrypted?: boolean }).encrypted ? 'https' : 'http'
            const fullUrl = `${protocol}://${host}${req.url}`

            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (value !== undefined) {
                if (Array.isArray(value)) {
                  value.forEach((v) => headers.append(key, v))
                } else {
                  headers.set(key, value)
                }
              }
            }

            const request = new Request(fullUrl, {
              method: req.method,
              headers,
              body: req.method !== 'GET' && req.method !== 'HEAD' && rawBody ? rawBody : undefined,
            })

            const response: Response = await mod.default(request)

            res.statusCode = response.status
            response.headers.forEach((value, key) => {
              res.setHeader(key, value)
            })

            const resText = await response.text()
            res.end(resText)
          } catch (err) {
            console.error(`[api-dev-server] Error handling ${url}:`, err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : 'Internal Server Error',
              }),
            )
          }
          return
        }
        next()
      })
    },
  }
}
