import { SITE_URL } from './siteUrl.ts'

export const API_CATALOG_URL = `${SITE_URL}/.well-known/api-catalog`
export const API_CATALOG_LINK = `<${API_CATALOG_URL}>; rel="api-catalog"`
export const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'

export const API_CATALOG_DOCUMENT = {
  linkset: [
    {
      anchor: API_CATALOG_URL,
      item: [
        { href: `${SITE_URL}/api/contact` },
        { href: `${SITE_URL}/api/project-inquiry` },
      ],
    },
    {
      anchor: `${SITE_URL}/api/contact`,
      'service-doc': [{ href: `${SITE_URL}/api/contact.md` }],
    },
    {
      anchor: `${SITE_URL}/api/project-inquiry`,
      'service-doc': [{ href: `${SITE_URL}/api/contact.md` }],
    },
  ],
} as const
