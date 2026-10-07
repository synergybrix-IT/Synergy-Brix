export const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfULk7ZMRSZ9krewdbd1elEYa8jLu0qmj3051MAKiYAqxCHcw/formResponse'

export const GOOGLE_FORM_ENTRY_IDS = {
  fullName: 'entry.815668572',
  company: 'entry.573827680',
  email: 'entry.607333772',
  phone: 'entry.1933332059',
  mainGoal: 'entry.1788871398',
  budget: 'entry.108835069',
  projectDescription: 'entry.1569156212',
} as const

export const GOOGLE_FORM_FIELD_MAP = {
  fullName: GOOGLE_FORM_ENTRY_IDS.fullName,
  company: GOOGLE_FORM_ENTRY_IDS.company,
  businessEmail: GOOGLE_FORM_ENTRY_IDS.email,
  phone: GOOGLE_FORM_ENTRY_IDS.phone,
  mainGoal: GOOGLE_FORM_ENTRY_IDS.mainGoal,
  budget: GOOGLE_FORM_ENTRY_IDS.budget,
  description: GOOGLE_FORM_ENTRY_IDS.projectDescription,
} as const

export type GoogleFormField = keyof typeof GOOGLE_FORM_FIELD_MAP
