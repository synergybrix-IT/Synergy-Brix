import {
  GOOGLE_FORM_URL,
  GOOGLE_FORM_ENTRIES,
} from './googleFormsConfig.js'

function sendResponse(status, body, res) {
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

async function parseRequestBody(req) {
  if (typeof req.json === 'function') {
    return await req.json()
  }
  if (req.body) {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body)
    }
    if (typeof req.body === 'object') {
      return req.body
    }
  }
  throw new Error('No valid body provided')
}

async function withTimeout(promise, ms, label) {
  let timeoutId
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${label} timed out after ${ms}ms`))
        }, ms)
      }),
    ])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

function normalizeInput(raw) {
  const data = raw || {}
  const fullName = String(data.fullName || '').trim()
  const company = String(data.company || '').trim()
  const businessEmail = String(data.businessEmail || '').trim()
  const phone = String(data.phone || '').trim()
  const mainGoal = String(data.mainGoal || '').trim()
  const budget = String(data.budget || '').trim()
  const description = String(data.description || '').trim()

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

function validateInput(data) {
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

function buildGoogleFormPayload(data) {
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

export default async function handler(req, res) {
  try {
    const method = req.method || 'GET'

    if (method !== 'POST') {
      console.log('[project-inquiry] rejected method:', method)
      return sendResponse(405, { success: false, error: 'Method not allowed.' }, res)
    }

    let raw
    try {
      raw = await parseRequestBody(req)
    } catch {
      console.error('[project-inquiry] failed to parse JSON request body')
      return sendResponse(400, { success: false, error: 'Invalid JSON request body.' }, res)
    }

    const data = normalizeInput(raw)
    const validationError = validateInput(data)

    if (validationError) {
      console.log('[project-inquiry] validation error:', validationError)
      return sendResponse(400, { success: false, error: validationError }, res)
    }

    console.log('[project-inquiry] forwarding submission to Google Forms server-side')
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

    console.log('[project-inquiry] Google Forms response status:', result.status)

    const isSuccess = result.ok || (result.status >= 200 && result.status < 400)

    if (!isSuccess) {
      console.error('[project-inquiry] Google Forms returned non-success status:', result.status)
      const errorMsg =
        result.status === 401
          ? 'Google Form requires sign-in. Set "Collect email addresses" to "Do not collect" and "Limit to 1 response" to OFF in Google Form settings.'
          : 'Unable to process submission at this time. Please try again later.'
      return sendResponse(500, { success: false, error: errorMsg }, res)
    }

    console.log('[project-inquiry] submission successful')
    return sendResponse(200, { success: true, message: 'Message sent successfully' }, res)
  } catch (error) {
    console.error('[project-inquiry] server error during handler execution:', error)
    return sendResponse(
      500,
      { success: false, error: 'Unable to send enquiry right now. Please try again.' },
      res,
    )
  }
}
