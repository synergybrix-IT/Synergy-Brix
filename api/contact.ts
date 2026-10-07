import {
  GOOGLE_FORM_URL,
  GOOGLE_FORM_ENTRIES,
} from './googleFormsConfig.js'

interface ContactPayload {
  fullName?: string
  name?: string
  company?: string
  businessEmail?: string
  email?: string
  phone?: string
  mainGoal?: string
  budget?: string
  description?: string
  message?: string
}

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

async function parseRequestBody(req: Request | NodeServerlessRequest) {
  if (typeof (req as Request).json === 'function') {
    return (await (req as Request).json()) as ContactPayload
  }
  const nodeReq = req as NodeServerlessRequest
  if (nodeReq.body) {
    if (typeof nodeReq.body === 'string') {
      return JSON.parse(nodeReq.body) as ContactPayload
    }
    if (typeof nodeReq.body === 'object') {
      return nodeReq.body as ContactPayload
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

function normalizeInput(raw: ContactPayload) {
  const data = raw || {}
  const fullName = String(data.fullName || data.name || '').trim()
  const company = String(data.company || '').trim()
  const businessEmail = String(data.businessEmail || data.email || '').trim()
  const phone = String(data.phone || '').trim()
  const mainGoal = String(data.mainGoal || '').trim()
  const budget = String(data.budget || '').trim()
  const description = String(data.description || data.message || '').trim()

  return {
    fullName,
    company,
    businessEmail,
    phone,
    mainGoal,
    budget,
    description,
  }
}

function validateInput(data: ReturnType<typeof normalizeInput>) {
  if (!data.fullName) {
    return 'Full Name is required.'
  }
  if (!data.businessEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail)) {
    return 'A valid Business Email is required.'
  }
  if (!data.phone || data.phone.length < 7) {
    return 'A valid Phone / WhatsApp Number is required.'
  }
  if (!data.mainGoal) {
    return 'Main Goal is required.'
  }
  if (!data.description || data.description.length < 10) {
    return 'Project Description must be at least 10 characters.'
  }
  return null
}

function buildGoogleFormPayload(data: ReturnType<typeof normalizeInput>) {
  const params = new URLSearchParams()

  params.set(GOOGLE_FORM_ENTRIES.fullName, data.fullName)
  params.set(GOOGLE_FORM_ENTRIES.email, data.businessEmail)
  params.set(GOOGLE_FORM_ENTRIES.phone, data.phone)
  params.set(GOOGLE_FORM_ENTRIES.mainGoal, data.mainGoal)
  params.set(GOOGLE_FORM_ENTRIES.projectDescription, data.description)

  if (data.company) {
    params.set(GOOGLE_FORM_ENTRIES.company, data.company)
  }
  if (data.budget) {
    params.set(GOOGLE_FORM_ENTRIES.budget, data.budget)
  }

  params.set('fvv', '1')
  params.set('pageHistory', '0')

  return params
}

export default async function handler(req: Request | NodeServerlessRequest, res?: NodeServerlessResponse) {
  try {
    const method = req.method || 'GET'

    if (method !== 'POST') {
      console.log('[contact] rejected method:', method)
      return sendResponse(405, { success: false, error: 'Method not allowed.' }, res)
    }

    let raw: ContactPayload
    try {
      raw = await parseRequestBody(req)
    } catch {
      console.error('[contact] failed to parse JSON request body')
      return sendResponse(400, { success: false, error: 'Invalid JSON request body.' }, res)
    }

    const data = normalizeInput(raw)
    const validationError = validateInput(data)

    if (validationError) {
      console.log('[contact] validation error:', validationError)
      return sendResponse(400, { success: false, error: validationError }, res)
    }

    console.log('[contact] forwarding submission to Google Forms server-side')
    const formPayload = buildGoogleFormPayload(data)

    const result = await withTimeout(
      fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formPayload.toString(),
      }),
      15000,
      'Google Forms submit',
    )

    console.log('[contact] Google Forms response status:', result.status)

    const isSuccess = result.ok || (result.status >= 200 && result.status < 400)

    if (!isSuccess) {
      console.error('[contact] Google Forms returned non-success status:', result.status)
      const errorMsg =
        result.status === 401
          ? 'Google Form requires sign-in. Set "Collect email addresses" to "Do not collect" and "Limit to 1 response" to OFF in Google Form settings.'
          : 'Unable to process submission at this time. Please try again later.'
      return sendResponse(500, { success: false, error: errorMsg }, res)
    }

    console.log('[contact] submission successful')
    return sendResponse(200, { success: true, message: 'Message sent successfully' }, res)
  } catch (error) {
    console.error('[contact] server error during handler execution:', error)
    return sendResponse(
      500,
      { success: false, error: 'Unable to send enquiry right now. Please try again.' },
      res,
    )
  }
}
