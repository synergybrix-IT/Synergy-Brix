# Synergy Brix

Public corporate website for Synergy Brix, built with React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, and Lucide React.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React
- React Hook Form + Zod

## Getting started

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Build for production:
   npm run build

## Project notes

- The public site uses prerendered React pages and Vercel functions for its project-enquiry forms. Enquiries are forwarded to the configured Google Forms provider.
- There is no admin dashboard, database, OAuth authorization server, authenticated/private API, or MCP server.
- SEO metadata, route content, sitemap, robots.txt, `llms.txt`, and the branded favicon are included.
- `/.well-known/api-catalog` publishes an RFC 9727 Linkset for the existing enquiry endpoints. See [`/api/contact.md`](./public/api/contact.md) for their limited form-submission contract.
- Public page routes return Markdown when explicitly requested with `Accept: text/markdown`; ordinary browser requests continue to receive the existing HTML application.
- Vercel response headers and Markdown rewrites are configured in `vercel.json`. Vite development and preview also support the discovery endpoints.
- Run `npm run build` to type-check, build, prerender public routes, and refresh the sitemap and robots.txt. Then run `node --experimental-strip-types seo/verify-seo.ts` to validate route metadata, JSON-LD, sitemap entries, robots.txt, `llms.txt`, the API catalog, Markdown responses, and Vercel route configuration.

## Production deployment

Deploy the project to Vercel so its API functions, `vercel.json` Link headers, well-known API catalog rewrite, and Markdown content-negotiation rewrites are active. A static-only deployment will serve the prerendered HTML and public files, but will not implement the API endpoints or HTTP negotiation behavior.
