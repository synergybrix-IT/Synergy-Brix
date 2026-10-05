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

export default async function handler(req: { method: string; body: string }, res: { status: (code: number) => { json: (payload: unknown) => void } }) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let data: ProjectInquiryPayload
  try {
    data = JSON.parse(req.body || '{}') as ProjectInquiryPayload
  } catch {
    res.status(400).json({ error: 'Invalid request body.' })
    return
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = data[field.key]
    if (Array.isArray(value)) return value.length === 0
    return !value || String(value).trim().length === 0
  })

  if (missing.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missing.map((field) => field.label).join(', ')}.` })
    return
  }

  const contactEmail = process.env.CONTACT_EMAIL
  if (!contactEmail) {
    res.status(500).json({ error: 'Server configuration error.' })
    return
  }

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ error: 'Email service is not configured.' })
    return
  }

  try {
    await resend.emails.send({
      from: `Synergy Brix <${contactEmail}>`,
      to: [contactEmail],
      replyTo: data.businessEmail,
      subject: `New Project Inquiry – Synergy Brix – ${data.fullName}`,
      text: buildEmailBody(data),
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Project inquiry email failed', error)
    res.status(500).json({ error: 'Failed to send inquiry. Please try again later.' })
  }
}
