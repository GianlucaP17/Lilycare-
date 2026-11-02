import { availabilityOptions, collaborationOptions, roleOptions } from './job-options'

export type JobValues = {
  name: string
  email: string
  phone: string
  role: string
  roleOther: string
  collaboration: string
  availability: string
  message: string
  consent: boolean
}

export type JobErrors = Partial<Record<keyof JobValues, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s./-]{6,25}$/

const oneOf = (options: ReadonlyArray<{ value: string }>, value: string) =>
  options.some((o) => o.value === value) ? value : ''

export function readJobForm(formData: FormData): JobValues {
  const str = (key: string) => String(formData.get(key) ?? '').trim()
  return {
    name: str('name').slice(0, 120),
    email: str('email').slice(0, 160).toLowerCase(),
    phone: str('phone').slice(0, 30),
    role: oneOf(roleOptions, str('role')),
    roleOther: str('roleOther').slice(0, 120),
    collaboration: oneOf(collaborationOptions, str('collaboration')),
    availability: oneOf(availabilityOptions, str('availability')),
    message: str('message').slice(0, 3000),
    consent: formData.get('consent') === 'on',
  }
}

export function validateJob(values: JobValues): JobErrors {
  const errors: JobErrors = {}
  if (values.name.length < 3 || !/\s/.test(values.name)) errors.name = 'Inserisci nome e cognome.'
  if (!EMAIL.test(values.email)) errors.email = 'Inserisci un indirizzo email valido.'
  if (values.phone && !PHONE.test(values.phone))
    errors.phone = 'Inserisci un numero di telefono valido.'
  if (!values.role) errors.role = 'Scegli il profilo che ti interessa.'
  if (values.role === 'altro' && values.roleOther.length < 3)
    errors.roleOther = 'Indica di quale profilo si tratta.'
  if (values.message.length < 20)
    errors.message = 'Scrivi qualche riga su di te: bastano due o tre frasi.'
  if (!values.consent) errors.consent = 'Serve il consenso per poterti ricontattare.'
  return errors
}
