import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed.' })
  }

  let data: ProjectInquiryPayload
  try {
    data = (await req.json()) as ProjectInquiryPayload
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid request body.' })
  }

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
      subject: `New Project Inquiry – Synergy Brix – ${data.fullName}`,
      text: buildEmailBody(data),
    })

    if (result.error) {
      console.error('Resend error', result.error)
      return jsonResponse(500, { success: false, error: 'Failed to send inquiry. Please try again later.' })
    }

    return jsonResponse(200, { success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Project inquiry email failed', error)
    return jsonResponse(500, { success: false, error: 'Failed to send inquiry. Please try again later.' })
  }
}
