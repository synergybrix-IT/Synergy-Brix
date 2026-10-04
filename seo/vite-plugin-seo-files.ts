import { resolve } from 'node:path'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'
import { prerenderAllRoutes } from './prerender.ts'
import { buildRobotsTxt, buildSitemapXml } from './sitemap.ts'

function attachSeoRoutes(server: ViteDevServer | PreviewServer) {
  server.middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path === '/sitemap.xml') {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.end(buildSitemapXml())
      return
    }
    if (path === '/robots.txt') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(buildRobotsTxt())
      return
    }
    next()
  })
}

export function seoFilesPlugin(): Plugin {
  return {
    name: 'seo-files',
    configureServer(server) {
      attachSeoRoutes(server)
    },
    configurePreviewServer(server) {
      attachSeoRoutes(server)
    },
    closeBundle() {
      const distDir = resolve(process.cwd(), 'dist')
      const publicDir = resolve(process.cwd(), 'public')
      prerenderAllRoutes(distDir, publicDir)
    },
  }
}
