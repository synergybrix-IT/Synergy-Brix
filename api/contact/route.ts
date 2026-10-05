import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactPayload {
  fullName?: string
  name?: string
  company?: string
  businessEmail?: string
  email?: string
  phone?: string
  businessType?: string
  services?: string | string[]
  budget?: string
  description?: string
  message?: string
}

const REQUIRED_FIELDS: Array<{ key: keyof ContactPayload; label: string }> = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'businessEmail', label: 'Business Email' },
  { key: 'phone', label: 'Phone / WhatsApp Number' },
  { key: 'businessType', label: 'Business Type' },
  { key: 'services', label: 'Service Required' },
  { key: 'description', label: 'Project Description' },
]

function normalise(data: ContactPayload) {
  const fullName = (data.fullName || data.name || '').trim()
  const email = (data.businessEmail || data.email || '').trim()
  const services = Array.isArray(data.services)
    ? data.services
    : data.services
      ? [data.services]
      : []
  const message = (data.description || data.message || '').trim()

  return {
    fullName,
    company: (data.company || '').trim(),
    businessEmail: email,
    phone: (data.phone || '').trim(),
    businessType: (data.businessType || '').trim(),
    services,
    budget: (data.budget || '').trim(),
    description: message,
  }
}

function buildEmailBody(data: ReturnType<typeof normalise>) {
  const submittedAt = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date())

  return [
    'New Website Enquiry',
    '',
    `Name: ${data.fullName || '-'}`,
    `Email: ${data.businessEmail || '-'}`,
    `Phone: ${data.phone || '-'}`,
    `Company: ${data.company || '-'}`,
    `Service: ${data.services.join(', ') || '-'}`,
    `Message: ${data.description || '-'}`,
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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' })
  }

  let raw: ContactPayload
  try {
    raw = await req.json()
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid request body.' })
  }

  const data = normalise(raw)

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = data[field.key]
    if (Array.isArray(value)) return value.length === 0
    return !value || String(value).trim().length === 0
  })

  if (missing.length > 0) {
    return jsonResponse(400, {
      success: false,
      error: `Missing required fields: ${missing.map((field) => field.label).join(', ')}.`,
    })
  }

  const contactEmail = process.env.CONTACT_EMAIL
  if (!contactEmail) {
    return jsonResponse(500, { success: false, error: 'Server configuration error.' })
  }

  if (!process.env.RESEND_API_KEY) {
    return jsonResponse(500, { success: false, error: 'Email service is not configured.' })
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || `Synergy Brix <${contactEmail}>`,
      to: [contactEmail],
      replyTo: data.businessEmail,
      subject: `New Website Enquiry — ${data.fullName}`,
      text: buildEmailBody(data),
    })

    if (result.error) {
      console.error('Resend error', result.error)
      return jsonResponse(500, { success: false, error: 'Failed to send enquiry. Please try again later.' })
    }

    return jsonResponse(200, { success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact email failed', error)
    return jsonResponse(500, { success: false, error: 'Failed to send enquiry. Please try again later.' })
  }
}
