import { createMarkdownResponse } from '../seo/markdown.ts'

export default async function handler(req, res) {
  const response = await createMarkdownResponse(req)

  if (!res) return response

  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(req.method === 'HEAD' ? undefined : await response.text())
}
