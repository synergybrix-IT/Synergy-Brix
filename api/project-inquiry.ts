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

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
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

export default async function handler(req: Request) {
  console.log('[project-inquiry] function started')
  console.log('[project-inquiry] method:', req.method)

  if (req.method !== 'POST') {
    console.log('[project-inquiry] rejecting non-POST')
    return jsonResponse(405, { success: false, error: 'Method not allowed.' })
  }

  console.log('[project-inquiry] parsing request')
  let data: ProjectInquiryPayload
  try {
    data = (await req.json()) as ProjectInquiryPayload
  } catch {
    console.log('[project-inquiry] invalid json')
    return jsonResponse(400, { success: false, error: 'Invalid request body.' })
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = data[field.key]
    if (Array.isArray(value)) return value.length === 0
    return !value || String(value).trim().length === 0
  })

  if (missing.length > 0) {
    console.log('[project-inquiry] missing fields:', missing.map((f) => f.label))
    return jsonResponse(400, {
      success: false,
      error: `Missing required fields: ${missing.map((field) => field.label).join(', ')}.`,
    })
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
      return jsonResponse(502, { success: false, error: errorMsg })
    }

    console.log('[project-inquiry] submission successful')
    return jsonResponse(200, { success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('[project-inquiry] submission failed', error)
    return jsonResponse(500, { success: false, error: 'Unable to send enquiry right now. Please try again.' })
  }
}
