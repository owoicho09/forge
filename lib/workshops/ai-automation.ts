export const WORKSHOP_ID = 'ai-automation'
export const WORKSHOP_PATH = '/workshops/ai-automation'
export const WORKSHOP_TITLE = 'AI Automation for Businesses'

// When the workshop runs, as shown on the page. The only place to change it.
export const WORKSHOP_WHEN = 'this Saturday'

// ---------------------------------------------------------------------------
// Pre-qualification options. `value` is stored in the database; `label` is
// what visitors and the CRM see. Don't change existing values — add new ones.
// ---------------------------------------------------------------------------
type Option = { readonly value: string; readonly label: string }

export const PERSONA_OPTIONS = [
  { value: 'business_owner', label: 'Business owner / founder' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'agency_owner', label: 'Agency owner' },
  { value: 'developer', label: 'Developer / builder' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'employee', label: 'Professional / employee' },
  { value: 'student', label: 'Student / learner' },
  { value: 'other', label: 'Other' },
] as const

export const ACTIVITY_OPTIONS = [
  { value: 'running_business', label: 'Running a business' },
  { value: 'selling_services', label: 'Selling services' },
  { value: 'running_agency', label: 'Running an agency' },
  { value: 'building_product', label: 'Building a product/startup' },
  { value: 'working_in_company', label: 'Working in a company' },
  { value: 'learning_ai', label: 'Learning / exploring AI' },
  { value: 'other', label: 'Other' },
] as const

export const INDUSTRY_OPTIONS = [
  { value: 'ecommerce_retail', label: 'E-commerce / retail' },
  { value: 'real_estate', label: 'Real estate' },
  { value: 'education_training', label: 'Education / training' },
  { value: 'professional_services', label: 'Professional services' },
  { value: 'health_wellness', label: 'Health / wellness' },
  { value: 'hospitality_food', label: 'Hospitality / food' },
  { value: 'finance', label: 'Finance' },
  { value: 'recruitment_hr', label: 'Recruitment / HR' },
  { value: 'marketing_agency', label: 'Marketing / agency' },
  { value: 'technology_saas', label: 'Technology / SaaS' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'beauty_fashion', label: 'Beauty / fashion' },
  { value: 'construction', label: 'Construction' },
  { value: 'other', label: 'Other' },
  { value: 'not_applicable', label: 'Not applicable' },
] as const

// Personas for whom the industry question is required.
export const BUSINESS_PERSONAS: readonly string[] = ['business_owner', 'agency_owner']

// ---------------------------------------------------------------------------
// Attribution. Visitors arrive with ?source=... (or utm_source=...). The raw
// value is kept in utm_source; `source` is normalized to one of these buckets.
// ---------------------------------------------------------------------------
export const SOURCE_OPTIONS = [
  { value: 'community', label: 'Community (warm)' },
  { value: 'x', label: 'X / ads (cold)' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Unknown / direct' },
] as const

export type Source = (typeof SOURCE_OPTIONS)[number]['value']

const SOURCE_ALIASES: Record<string, Source> = {
  community: 'community',
  warm: 'community',
  whatsapp: 'community',
  forgebuilds: 'community',
  x: 'x',
  'x.com': 'x',
  twitter: 'x',
  x_ads: 'x',
  twitter_ads: 'x',
}

export function normalizeSource(raw: string | null | undefined): Source {
  const key = raw?.trim().toLowerCase()
  if (!key) return 'unknown'
  return SOURCE_ALIASES[key] ?? 'other'
}

// ---------------------------------------------------------------------------
// CRM pipeline status, updated manually from the admin view.
// ---------------------------------------------------------------------------
export const STATUS_OPTIONS = [
  { value: 'registered', label: 'Registered' },
  { value: 'attended', label: 'Attended' },
  { value: 'post_qualified', label: 'Post-workshop qualification done' },
  { value: 'consultation_requested', label: 'Consultation requested' },
  { value: 'consultation_completed', label: 'Consultation completed' },
] as const

export function optionValues<T extends readonly Option[]>(options: T) {
  return options.map((o) => o.value) as unknown as [T[number]['value'], ...T[number]['value'][]]
}

export function labelFor(options: readonly Option[], value: string | null | undefined): string {
  if (!value) return ''
  return options.find((o) => o.value === value)?.label ?? value
}
