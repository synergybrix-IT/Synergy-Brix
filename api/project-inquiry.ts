interface ProjectInquiryPayload {
  fullName: string
  company?: string
  businessEmail: string
  phone: string
  businessType: string
  services: string[]
  budget?: string
  description: string
}

const REQUIRED_FIELDS: Array<{ key: keyof ProjectInquiryPayload; label: string }> = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'businessEmail', label: 'Business Email' },
  { key: 'phone', label: 'Phone / WhatsApp Number' },
  { key: 'businessType', label: 'Business Type' },
  { key: 'services', label: 'Service Required' },
  { key: 'description', label: 'Project Description' },
]

function buildEmailBody(data: ProjectInquiryPayload) {
  const submittedAt = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date())

  return [
    'New Project Inquiry',
    '',
    `Full Name: ${data.fullName}`,
    `Company: ${data.company || '-'}`,
    `Business Email: ${data.businessEmail}`,
    `Phone / WhatsApp: ${data.phone}`,
    `Business Type: ${data.businessType}`,
    `Service Required: ${(data.services || []).join(', ') || '-'}`,
    `Budget: ${data.budget || '-'}`,
    `Project Description: ${data.description}`,
    '',
    `Submitted: ${submittedAt}`,
  ].join('\n')
}

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

  const contactEmail = process.env.CONTACT_EMAIL
  if (!contactEmail) {
    console.log('[project-inquiry] missing CONTACT_EMAIL')
    return jsonResponse(500, { success: false, error: 'Server configuration error.' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.log('[project-inquiry] missing RESEND_API_KEY')
    return jsonResponse(500, { success: false, error: 'Email service is not configured.' })
  }

  try {
    console.log('[project-inquiry] importing Resend')
    const { Resend } = await import('resend')

    console.log('[project-inquiry] initializing Resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log('[project-inquiry] sending email')
    const result = await withTimeout(
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || `Synergy Brix <${contactEmail}>`,
        to: [contactEmail],
        replyTo: data.businessEmail,
        subject: `New Project Inquiry – Synergy Brix – ${data.fullName}`,
        text: buildEmailBody(data),
      }),
      10000,
      'Resend send',
    )

    if ((result as { error?: unknown }).error) {
      console.error('[project-inquiry] Resend error', (result as { error: unknown }).error)
      return jsonResponse(500, { success: false, error: 'Failed to send inquiry. Please try again later.' })
    }

    console.log('[project-inquiry] email sent')
    return jsonResponse(200, { success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('[project-inquiry] email failed', error)
    return jsonResponse(500, { success: false, error: 'Unable to send enquiry right now. Please try again.' })
  }
}
