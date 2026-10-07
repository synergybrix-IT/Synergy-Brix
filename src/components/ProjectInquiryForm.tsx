import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Loader2 } from 'lucide-react'

const BUDGET_OPTIONS = [
  'Below ₹10,000',
  '₹10,000–₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000+',
  'Not decided',
]

const MAIN_GOAL_OPTIONS = [
  'Custom Software',
  'Web Application',
  'Business Website',
  'Business Automation',
  'Dashboard / Reporting System',
  'Cloud Solution',
  'SaaS Application',
  'Maintenance / Improvements',
  'Other',
]

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ProjectInquiryFormProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  company: string
  businessEmail: string
  phone: string
  mainGoal: string
  budget: string
  description: string
}

const initialFormData: FormData = {
  fullName: '',
  company: '',
  businessEmail: '',
  phone: '',
  mainGoal: '',
  budget: '',
  description: '',
}

export default function ProjectInquiryForm({ isOpen, onClose }: ProjectInquiryFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState<string>('')

  const reset = () => {
    setFormData(initialFormData)
    setFormState('idle')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const validate = (): string | null => {
    if (!formData.fullName.trim()) return 'Full name is required.'
    if (!formData.businessEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) return 'A valid business email is required.'
    if (!formData.phone.trim() || formData.phone.trim().length < 7) return 'A valid phone or WhatsApp number is required.'
    if (!formData.mainGoal) return 'Please select a main goal.'
    if (!formData.description.trim() || formData.description.trim().length < 10) return 'Please provide a brief project description (min 10 characters).'
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setFormState('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`API returned an unexpected response (${response.status}): ${text.slice(0, 300)}`)
      }

      const result = await response.json()

      if (!response.ok || !result.success) {
        let errMsg = 'Something went wrong. Please try again.'
        if (result && typeof result === 'object') {
          if (typeof result.error === 'string') {
            errMsg = result.error
          } else if (result.error && typeof result.error === 'object' && 'message' in result.error) {
            errMsg = String((result.error as { message: unknown }).message)
          } else if (typeof result.message === 'string') {
            errMsg = result.message
          }
        }
        throw new Error(errMsg)
      }

      setFormState('success')
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : String(err || 'Something went wrong. Please try again.')
      setError(errorMsg)
      setFormState('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-xl" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-2xl glass-panel max-h-[90vh] overflow-y-auto rounded-3xl border border-white/8 bg-ink-900/95 p-6 sm:p-8"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow">Project Inquiry</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">Start your project</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-slate-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {formState === 'success' ? (
              <motion.div
                className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/8 p-10 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 className="text-emerald-300" size={48} />
                <h4 className="text-xl font-semibold text-white">Thank you!</h4>
                <p className="max-w-md text-sm leading-7 text-slate-300">
                  Thank you! Your project inquiry has been submitted successfully. Our team will review your requirements and get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-primary mt-4 px-6 py-3 text-sm font-medium"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name *" required>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Company / Organization Name">
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                      className="form-input"
                      placeholder="Company name"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Business Email *" required>
                    <input
                      type="email"
                      required
                      value={formData.businessEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, businessEmail: e.target.value }))}
                      className="form-input"
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Phone / WhatsApp Number *" required>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="form-input"
                      placeholder="+91 98765 43210"
                    />
                  </Field>
                </div>

                <Field label="What is the main goal of this project? *" required>
                  <select
                    required
                    value={formData.mainGoal}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mainGoal: e.target.value }))}
                    className="form-input"
                  >
                    <option value="">Select a goal</option>
                    {MAIN_GOAL_OPTIONS.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Approximate Budget">
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                    className="form-input"
                  >
                    <option value="">Select budget range</option>
                    {BUDGET_OPTIONS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Project Description *" required>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="form-input resize-none"
                    placeholder="Briefly describe your project, goals, and any specific requirements..."
                  />
                </Field>

                {error && (
                  <motion.p
                    className="text-sm text-rose-300"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                  <button type="button" onClick={handleClose} className="text-sm text-slate-400 transition hover:text-white">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="btn-primary flex w-full items-center justify-center gap-2 px-8 py-3 text-sm font-medium disabled:opacity-60 sm:w-auto"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-emerald-300/80">
        {label}
        {required && <span className="ml-1 text-rose-300">*</span>}
      </label>
      {children}
    </div>
  )
}
