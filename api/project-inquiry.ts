import { GOOGLE_FORM_FIELD_MAP, GOOGLE_FORM_URL } from '../src/config/googleForms.ts'

interface ProjectInquiryPayload {
  fullName: string
  company?: string
  businessEmail: string
  phone: string
  mainGoal: string
  budget?: string
  description: string
}

const REQUIRED_FIELDS: Array<{ key: keyof ProjectInquiryPayload; label: string }> = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'businessEmail', label: 'Business Email' },
  { key: 'phone', label: 'Phone / WhatsApp Number' },
  { key: 'mainGoal', label: 'Main Goal' },
  { key: 'description', label: 'Project Description' },
]

interface NodeServerlessResponse {
  status: (code: number) => NodeServerlessResponse
  json: (data: unknown) => void
  setHeader: (name: string, value: string) => void
  end: (data?: unknown) => void
}

interface NodeServerlessRequest {
  method?: string
  body?: unknown
  headers?: Record<string, string | string[] | undefined>
  json?: () => Promise<unknown>
}

function sendResponse(status: number, body: unknown, res?: NodeServerlessResponse) {
  if (res && typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(status).json(body)
    return
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

async function parseBody<T>(req: Request | NodeServerlessRequest): Promise<T> {
  if (typeof (req as Request).json === 'function') {
    return (await (req as Request).json()) as T
  }
  const nodeReq = req as NodeServerlessRequest
  if (nodeReq.body) {
    if (typeof nodeReq.body === 'string') {
      return JSON.parse(nodeReq.body) as T
    }
    if (typeof nodeReq.body === 'object') {
      return nodeReq.body as T
    }
  }
  throw new Error('No valid body provided')
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${label} timed out after ${ms}ms`))
        }, ms)
      }),
    ])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

function buildGoogleFormBody(data: ProjectInquiryPayload): URLSearchParams {
  const params = new URLSearchParams()

  params.set(GOOGLE_FORM_FIELD_MAP.fullName, data.fullName)
  params.set(GOOGLE_FORM_FIELD_MAP.businessEmail, data.businessEmail)
  params.set(GOOGLE_FORM_FIELD_MAP.phone, data.phone)
  params.set(GOOGLE_FORM_FIELD_MAP.mainGoal, data.mainGoal)
  params.set(GOOGLE_FORM_FIELD_MAP.description, data.description)

  if (data.company) {
    params.set(GOOGLE_FORM_FIELD_MAP.company, data.company)
  }
  if (data.budget) {
    params.set(GOOGLE_FORM_FIELD_MAP.budget, data.budget)
  }

  params.set('fvv', '1')
  params.set('pageHistory', '0')

  return params
}

export default async function handler(req: Request | NodeServerlessRequest, res?: NodeServerlessResponse) {
  console.log('[project-inquiry] function started')
  const method = req.method || 'GET'
  console.log('[project-inquiry] method:', method)

  if (method !== 'POST') {
    console.log('[project-inquiry] rejecting non-POST')
    return sendResponse(405, { success: false, error: 'Method not allowed.' }, res)
  }

  console.log('[project-inquiry] parsing request')
  let data: ProjectInquiryPayload
  try {
    data = await parseBody<ProjectInquiryPayload>(req)
  } catch {
    console.log('[project-inquiry] invalid json')
    return sendResponse(400, { success: false, error: 'Invalid request body.' }, res)
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = data[field.key]
    if (Array.isArray(value)) return value.length === 0
    return !value || String(value).trim().length === 0
  })

  if (missing.length > 0) {
    console.log('[project-inquiry] missing fields:', missing.map((f) => f.label))
    return sendResponse(
      400,
      {
        success: false,
        error: `Missing required fields: ${missing.map((field) => field.label).join(', ')}.`,
      },
      res,
    )
  }

  try {
    console.log('[project-inquiry] submitting to Google Forms')
    const formBody = buildGoogleFormBody(data)

    const result = await withTimeout(
      fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      }),
      15000,
      'Google Forms submit',
    )

    console.log('[project-inquiry] Google Forms response status:', result.status)

    if (!result.ok) {
      console.error('[project-inquiry] Google Forms returned error status:', result.status)
      const errorMsg =
        result.status === 401
          ? 'Form submission failed: Google Form requires sign-in. Please ensure "Collect email addresses: Do not collect" and "Limit to 1 response: OFF" in Google Form settings.'
          : 'Failed to send inquiry. Please try again later.'
      return sendResponse(502, { success: false, error: errorMsg }, res)
    }

    console.log('[project-inquiry] submission successful')
    return sendResponse(200, { success: true, message: 'Message sent successfully' }, res)
  } catch (error) {
    console.error('[project-inquiry] submission failed', error)
    return sendResponse(
      500,
      { success: false, error: 'Unable to send enquiry right now. Please try again.' },
      res,
    )
  }
}
