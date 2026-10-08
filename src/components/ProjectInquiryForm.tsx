import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Check, CheckCircle2, ChevronDown, Loader2, X } from 'lucide-react'

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

interface GoalDropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  label: string
  required?: boolean
}

function GoalDropdown({ value, onChange, options, placeholder, label, required = false }: GoalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => options.indexOf(value))
  const [menuPosition, setMenuPosition] = useState({ left: 0, width: 0, top: 0, maxHeight: 320, openAbove: false })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const listboxId = useId()
  const selectedIndex = options.indexOf(value)

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const updateMenuPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return

      const viewportPadding = 12
      const gap = 8
      const below = window.innerHeight - rect.bottom - viewportPadding - gap
      const above = rect.top - viewportPadding - gap
      const openAbove = below < 200 && above > below
      const availableHeight = Math.max(100, openAbove ? above : below)
      const maxHeight = Math.min(320, availableHeight)

      setMenuPosition({
        left: rect.left,
        width: rect.width,
        top: openAbove ? rect.top - gap - maxHeight : rect.bottom + gap,
        maxHeight,
        openAbove,
      })
    }

    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.children.item(activeIndex)?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Node &&
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const openAt = (index: number) => {
    setActiveIndex(index < 0 ? 0 : index)
    setIsOpen(true)
  }

  const selectOption = (option: string) => {
    onChange(option)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      if (!isOpen) {
        openAt(selectedIndex >= 0 ? selectedIndex : direction > 0 ? 0 : options.length - 1)
      } else {
        setActiveIndex((current) => (current + direction + options.length) % options.length)
      }
    } else if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault()
      const option = options[activeIndex]
      if (option !== undefined) selectOption(option)
    } else if ((event.key === 'Enter' || event.key === ' ') && !isOpen) {
      event.preventDefault()
      openAt(selectedIndex >= 0 ? selectedIndex : 0)
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-required={required}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
          } else {
            openAt(selectedIndex >= 0 ? selectedIndex : 0)
          }
        }}
        onKeyDown={handleKeyDown}
        className={`form-input goal-select flex items-center justify-between text-left ${isOpen ? 'goal-select-open' : ''}`}
      >
        <span className={value ? 'text-slate-100' : 'text-slate-400'}>{value || placeholder}</span>
        <ChevronDown size={17} aria-hidden="true" className={`goal-select-chevron ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              ref={menuRef}
              id={listboxId}
              role="listbox"
              aria-label={label}
              className="goal-select-menu"
              style={{
                left: menuPosition.left,
                width: menuPosition.width,
                top: menuPosition.top,
                maxHeight: menuPosition.maxHeight,
              }}
              initial={{ opacity: 0, y: menuPosition.openAbove ? 6 : -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: menuPosition.openAbove ? 6 : -6, scale: 0.99 }}
              transition={{ duration: 0.17, ease: 'easeOut' }}
            >
              {options.map((option, index) => (
                <li
                  key={option || placeholder}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={value === option}
                  className={`goal-select-option ${activeIndex === index ? 'goal-select-option-active' : ''} ${value === option ? 'goal-select-option-selected' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  <span>{option || placeholder}</span>
                  {value === option && <Check size={16} aria-hidden="true" />}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
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
                  <GoalDropdown
                    value={formData.mainGoal}
                    onChange={(mainGoal) => setFormData((prev) => ({ ...prev, mainGoal }))}
                    options={['', ...MAIN_GOAL_OPTIONS]}
                    placeholder="Select a goal"
                    label="What is the main goal of this project?"
                    required
                  />
                </Field>

                <Field label="Approximate Budget">
                  <GoalDropdown
                    value={formData.budget}
                    onChange={(budget) => setFormData((prev) => ({ ...prev, budget }))}
                    options={['', ...BUDGET_OPTIONS]}
                    placeholder="Select budget range"
                    label="Approximate Budget"
                  />
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
