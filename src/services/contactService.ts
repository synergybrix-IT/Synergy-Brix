export type ContactFormValues = {
  fullName?: string
  name?: string
  company?: string
  businessEmail?: string
  email?: string
  phone?: string
  mainGoal?: string
  projectType?: string
  budget?: string
  timeline?: string
  description?: string
  message?: string
}

export type ContactSubmissionResult = {
  success: boolean
  message: string
}

const providerEndpoint = import.meta.env.VITE_CONTACT_PROVIDER_URL

function normalizeContactPayload(values: ContactFormValues) {
  const fullName = String(values.fullName ?? values.name ?? '').trim()
  const company = String(values.company ?? '').trim()
  const businessEmail = String(values.businessEmail ?? values.email ?? '').trim()
  const phone = String(values.phone ?? '').trim()
  const mainGoal = String(values.mainGoal ?? values.projectType ?? '').trim()
  const budget = String(values.budget ?? '').trim()
  const description = String(values.description ?? values.message ?? '').trim()

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

function validateContactPayload(payload: ReturnType<typeof normalizeContactPayload>) {
  if (!payload.fullName) return 'Full name is required.'
  if (!payload.businessEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.businessEmail)) {
    return 'A valid business email is required.'
  }
  if (!payload.phone || payload.phone.length < 7) return 'A valid phone or WhatsApp number is required.'
  if (!payload.mainGoal) return 'Please select a project goal.'
  if (!payload.description || payload.description.length < 10) {
    return 'Please provide a brief project description with at least 10 characters.'
  }
  return null
}

export async function submitContactForm(values: ContactFormValues): Promise<ContactSubmissionResult> {
  const payload = normalizeContactPayload(values)
  const validationError = validateContactPayload(payload)

  if (validationError) {
    return { success: false, message: validationError }
  }

  if (providerEndpoint) {
    try {
      const response = await fetch(providerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })

      const contentType = response.headers.get('content-type') || ''
      let result: { success?: boolean; message?: string; error?: unknown } | undefined

      if (contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        if (text) {
          try {
            result = JSON.parse(text)
          } catch {
            result = { message: text }
          }
        }
      }

      if (!response.ok || result?.success === false) {
        const message =
          typeof result?.error === 'string'
            ? result.error
            : typeof result?.message === 'string'
              ? result.message
              : 'Submission could not be completed. Please email us directly or try again later.'
        return { success: false, message }
      }

      return { success: true, message: result?.message || 'Your message has been sent successfully.' }
    } catch (error) {
      console.error('Contact submission failed', error)
      return { success: false, message: 'Submission could not be completed. Please email us directly or try again later.' }
    }
  }

  return new Promise((resolve) => {
    globalThis.setTimeout(() => {
      resolve({
        success: true,
        message: 'Demo submission received. Connect a backend or form provider later to store submissions.',
      })
    }, 700)
  })
}
