import { z } from 'zod'
import { normalizePhone } from '@/lib/phone'

// ---------------------------------------------------------------------------
// Post-workshop qualification survey (/workshops/ai-automation/next-step).
//
// This config drives the survey steps, branching, progress count, validation
// (client and server) and CRM labels. Each field `key` is also the column
// name in workshop_qualifications. `value`s are stored in the database; don't
// change existing ones — add new ones (and extend the migration's CHECK).
// ---------------------------------------------------------------------------

export const QUALIFICATION_PATH = '/workshops/ai-automation/next-step'

type Option = { readonly value: string; readonly label: string }

type BaseField = {
  key: string
  label: string
  /** Short label used in the CRM profile. */
  crmLabel: string
  optional?: boolean
}
export type ChoiceField = BaseField & { kind: 'choice'; options: readonly Option[] }
export type TextField = BaseField & {
  kind: 'text' | 'textarea' | 'tel' | 'email'
  placeholder?: string
  maxLength: number
  autoComplete?: string
}
export type Field = ChoiceField | TextField
export type Step = { id: string; title: string; fields: readonly Field[] }
export type Answers = Record<string, string>

const choice = (key: string, label: string, crmLabel: string, options: readonly Option[]): ChoiceField => ({
  kind: 'choice',
  key,
  label,
  crmLabel,
  options,
})

const CONTEXT_MAX = 2000

// ---------------------------------------------------------------------------
// Step 1 — primary path
// ---------------------------------------------------------------------------
export const PRIMARY_PATH_OPTIONS = [
  { value: 'learn_to_build', label: 'Learn to build AI-powered systems' },
  { value: 'existing_project', label: "I'm already building something and want to move it forward" },
  { value: 'idea_to_project', label: 'I have an idea I want to turn into a working project' },
  { value: 'business_automation', label: 'I want to apply AI automation to a business' },
] as const

export type PrimaryPath = (typeof PRIMARY_PATH_OPTIONS)[number]['value']

/** Short labels for the CRM, filters and counts. */
export const PRIMARY_PATH_SHORT_LABELS: Record<PrimaryPath, string> = {
  learn_to_build: 'Learn to build',
  existing_project: 'Existing project',
  idea_to_project: 'Idea to project',
  business_automation: 'Business automation',
}

const PRIMARY_STEP: Step = {
  id: 'primary_path',
  title: 'What best describes what you want to do next?',
  fields: [choice('primary_path', 'What best describes what you want to do next?', 'Primary path', PRIMARY_PATH_OPTIONS)],
}

// ---------------------------------------------------------------------------
// Path-specific steps
// ---------------------------------------------------------------------------
const single = (field: Field): Step => ({ id: field.key, title: field.label, fields: [field] })

const BRANCH_STEPS: Record<PrimaryPath, readonly Step[]> = {
  learn_to_build: [
    single(
      choice('learning_direction', 'What do you most want to learn to build?', 'Wants to learn', [
        { value: 'ai_products', label: 'AI applications and products' },
        { value: 'ai_automations', label: 'AI automations and workflows' },
        { value: 'ai_integrations', label: 'AI integrations, APIs and assistants' },
        { value: 'not_sure', label: "I'm not sure yet" },
      ]),
    ),
    single(
      choice('current_building_level', 'Where are you right now?', 'Current level', [
        { value: 'not_started', label: "I haven't built anything yet" },
        { value: 'experimenting', label: "I've started experimenting/building" },
        { value: 'struggling_to_finish', label: "I've built things but struggle to make them fully work" },
        { value: 'improving', label: "I'm already building and want to get better" },
      ]),
    ),
    single(
      choice('support_need', 'What would help you move forward most?', 'Would help most', [
        { value: 'practical_path', label: 'A practical path where I build real projects' },
        { value: 'guidance_when_stuck', label: 'Guidance when I get stuck' },
        { value: 'deeper_understanding', label: 'Deeper technical understanding' },
        { value: 'help_finishing', label: 'Help finishing what I start' },
      ]),
    ),
    single(
      choice('desired_outcome', 'What would you most like to achieve next?', 'Wants to achieve', [
        { value: 'first_project', label: 'Build my first complete AI project' },
        { value: 'confidence', label: 'Become confident building AI systems' },
        { value: 'client_projects', label: 'Build projects I can use for clients' },
        { value: 'future_business', label: 'Build something I can eventually turn into a business' },
      ]),
    ),
    single({
      kind: 'textarea',
      key: 'contextual_notes',
      label: "Is there something specific you'd like to learn or build?",
      crmLabel: 'What they want to build',
      optional: true,
      maxLength: CONTEXT_MAX,
    }),
  ],

  existing_project: [
    single({
      kind: 'text',
      key: 'current_project',
      label: 'What are you currently building?',
      crmLabel: 'Currently building',
      maxLength: 300,
    }),
    single(
      choice('project_stage', 'Where are you currently with it?', 'Project stage', [
        { value: 'early', label: "I've started but it's still early" },
        { value: 'prototype', label: 'I have a working prototype' },
        { value: 'mostly_working', label: 'Most of it works but some parts are missing' },
        { value: 'stuck', label: "I'm stuck and can't move forward" },
      ]),
    ),
    single(
      choice('current_blocker', 'What are you currently stuck on?', 'Stuck on', [
        { value: 'ai_api_integration', label: 'AI/API integrations' },
        { value: 'automation_workflow', label: 'Automation/workflow' },
        { value: 'backend_data', label: 'Backend/data' },
        { value: 'debugging_integration', label: 'Debugging or getting everything to work together' },
        { value: 'unsure', label: "I'm not sure what the problem is" },
      ]),
    ),
    single(
      choice('support_level', 'What would help you move it forward?', 'Support wanted', [
        { value: 'self_build', label: "I'll build it myself if I know what to do" },
        { value: 'guided_build', label: 'I want someone to guide me while I build' },
        { value: 'technical_help', label: 'I need help solving the technical parts' },
        { value: 'project_help', label: 'I want help getting the project working' },
      ]),
    ),
    single({
      kind: 'textarea',
      key: 'project_context',
      label: 'What would you like us to know about the project?',
      crmLabel: 'Project context',
      optional: true,
      maxLength: CONTEXT_MAX,
      placeholder: 'What is it supposed to do, who is it for, or where are you currently stuck?',
    }),
  ],

  idea_to_project: [
    single({
      kind: 'text',
      key: 'project_idea',
      label: 'What are you thinking of building?',
      crmLabel: 'Idea',
      maxLength: 300,
    }),
    single(
      choice('idea_type', 'What is the idea mainly for?', 'Idea is for', [
        { value: 'product_saas', label: 'A product or SaaS' },
        { value: 'internal_tool', label: 'A business process or internal tool' },
        { value: 'client_solution', label: 'A solution I can offer businesses/clients' },
        { value: 'not_sure', label: "I'm not sure yet" },
      ]),
    ),
    single(
      choice('idea_stage', 'How far have you taken it?', 'Idea stage', [
        { value: 'idea_only', label: "It's just an idea" },
        { value: 'planned', label: "I've researched/planned it" },
        { value: 'started_building', label: "I've started trying to build it" },
        { value: 'stuck', label: 'I tried building it and got stuck' },
      ]),
    ),
    single(
      choice('support_need', 'What do you need most right now?', 'Needs most', [
        { value: 'figure_out_what', label: 'Help figuring out what to build' },
        { value: 'clear_plan', label: 'A clear plan for building it' },
        { value: 'guided_build', label: 'Someone to guide me through the build' },
        { value: 'technical_help', label: 'Technical help implementing it' },
      ]),
    ),
    single({
      kind: 'textarea',
      key: 'idea_context',
      label: 'Tell us a little more about the idea.',
      crmLabel: 'Idea context',
      optional: true,
      maxLength: CONTEXT_MAX,
      placeholder: 'What problem would it solve, who would use it, or what would you like it to do?',
    }),
  ],

  business_automation: [
    single(
      choice('automation_area', 'What would you most like AI to help with?', 'Automation area', [
        { value: 'customer_leads_sales', label: 'Customer enquiries, leads or sales' },
        { value: 'operations_admin', label: 'Operations and repetitive admin' },
        { value: 'marketing_booking_processes', label: 'Marketing, booking or other business processes' },
        { value: 'not_sure', label: "I'm not sure what I should automate" },
      ]),
    ),
    single(
      choice('current_automation_state', 'How is that currently handled?', 'Currently handled', [
        { value: 'manual', label: 'Mostly manually' },
        { value: 'several_tools', label: 'With several tools but a lot of manual work' },
        { value: 'some_automation', label: 'I already have some automation' },
        { value: 'process_unclear', label: "I haven't really figured out the process yet" },
      ]),
    ),
    single(
      choice('automation_goal', 'What would you most like the automation to achieve?', 'Automation goal', [
        { value: 'save_time', label: 'Save time and reduce repetitive work' },
        { value: 'handle_customers', label: 'Handle customers/leads more efficiently' },
        { value: 'easier_process', label: 'Make a business process easier to manage' },
        { value: 'not_sure', label: "I'm not sure yet" },
      ]),
    ),
    single(
      choice('implementation_support', 'What kind of help would be most useful?', 'Help wanted', [
        { value: 'identify', label: 'Help me identify what to automate' },
        { value: 'design', label: 'Help me design the automation' },
        { value: 'teach', label: 'Teach me how to build it' },
        { value: 'implement', label: 'Help me implement it' },
      ]),
    ),
    single(
      choice('business_relationship', 'What type of business is this?', 'Business relationship', [
        { value: 'own_business', label: 'My own business' },
        { value: 'employer', label: 'A business I work for' },
        { value: 'client', label: 'A client/business I want to help' },
        { value: 'exploring', label: "I'm exploring an idea" },
      ]),
    ),
    single({
      kind: 'textarea',
      key: 'business_automation_context',
      label: "Tell us a little about the business and the process you'd like to improve.",
      crmLabel: 'Business context',
      optional: true,
      maxLength: CONTEXT_MAX,
      placeholder:
        'What does the business do? What process is currently manual? What happens today? What would you like the automation to handle?',
    }),
  ],
}

// ---------------------------------------------------------------------------
// Final steps (all paths)
// ---------------------------------------------------------------------------
export const NEXT_STEP_OPTIONS = [
  { value: 'self_build_guidance', label: 'Build it myself with the right guidance' },
  { value: 'build_with_expert', label: 'Build it with someone experienced' },
  { value: 'implementation_help', label: 'Get help implementing it' },
  { value: 'exploring', label: "I'm still figuring out the right direction" },
] as const

export const FOLLOW_UP_OPTIONS = [
  { value: 'discuss_next_step', label: "Yes, I'd like to discuss my next step" },
  { value: 'help_with_project', label: "Yes, I'd like help with my project/business" },
  { value: 'not_yet', label: "Not yet, I'll continue with the community sessions" },
] as const

const NEXT_STEP_STEP = single(
  choice('preferred_next_step', 'What would you like to do next?', 'Preferred next step', NEXT_STEP_OPTIONS),
)

const FOLLOW_UP_STEP = single(
  choice('follow_up_intent', 'Would you like us to follow up with you about your answer?', 'Follow-up', FOLLOW_UP_OPTIONS),
)

export const CONTACT_FIELD_KEYS = ['name', 'phone', 'email'] as const

const CONTACT_STEP: Step = {
  id: 'contact',
  title: 'First, your details',
  fields: [
    { kind: 'text', key: 'name', label: 'Name', crmLabel: 'Name', maxLength: 120, autoComplete: 'name', placeholder: 'Your full name' },
    {
      kind: 'tel',
      key: 'phone',
      label: 'WhatsApp number',
      crmLabel: 'WhatsApp',
      maxLength: 30,
      autoComplete: 'tel',
      placeholder: 'e.g. 0803 123 4567',
    },
    {
      kind: 'email',
      key: 'email',
      label: 'Email',
      crmLabel: 'Email',
      optional: true,
      maxLength: 254,
      autoComplete: 'email',
      placeholder: 'The email you registered with',
    },
  ],
}

// ---------------------------------------------------------------------------
// Branching
// ---------------------------------------------------------------------------
function isPrimaryPath(value: string | undefined): value is PrimaryPath {
  return PRIMARY_PATH_OPTIONS.some((o) => o.value === value)
}

export function hasChosenPath(answers: Answers): boolean {
  return isPrimaryPath(answers.primary_path)
}

/** Every field key that belongs to a path branch (used to clear stale answers). */
export const BRANCH_FIELD_KEYS: readonly string[] = Array.from(
  new Set(Object.values(BRANCH_STEPS).flatMap((steps) => steps.flatMap((s) => s.fields.map((f) => f.key)))),
)

/**
 * The steps this person sees, in order. Until a path is chosen only the
 * contact and direction steps are known, so the total is never a guess.
 */
export function getVisibleSteps(answers: Answers): Step[] {
  const path = answers.primary_path
  if (!isPrimaryPath(path)) return [CONTACT_STEP, PRIMARY_STEP]
  return [CONTACT_STEP, PRIMARY_STEP, ...BRANCH_STEPS[path], NEXT_STEP_STEP, FOLLOW_UP_STEP]
}

/** Answers with any fields from other branches removed (after changing path). */
export function withAnswer(answers: Answers, key: string, value: string): Answers {
  const next = { ...answers, [key]: value }
  if (key === 'primary_path' && isPrimaryPath(value)) {
    const keep = new Set(BRANCH_STEPS[value].flatMap((s) => s.fields.map((f) => f.key)))
    for (const k of BRANCH_FIELD_KEYS) if (!keep.has(k)) delete next[k]
  }
  return next
}

// ---------------------------------------------------------------------------
// Validation (shared by the survey and the API route)
// ---------------------------------------------------------------------------
const emailSchema = z.string().email()

export function validateField(field: Field, raw: string | undefined): string | null {
  const value = raw?.trim() ?? ''
  if (!value) return field.optional ? null : field.kind === 'choice' ? 'Choose an option.' : 'This is required.'
  if (field.kind === 'choice') {
    return field.options.some((o) => o.value === value) ? null : 'Choose an option.'
  }
  if (value.length > field.maxLength) return `Keep this under ${field.maxLength} characters.`
  if (field.key === 'name' && value.length < 2) return 'Enter your name.'
  if (field.kind === 'tel' && !normalizePhone(value)) {
    return 'Enter a valid phone number. Include the country code if you are outside Nigeria.'
  }
  if (field.kind === 'email' && !emailSchema.safeParse(value).success) return 'Enter a valid email address.'
  return null
}

export function validateStep(step: Step, answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of step.fields) {
    const error = validateField(field, answers[field.key])
    if (error) errors[field.key] = error
  }
  return errors
}

export type QualificationValues = Record<string, string | null> & {
  primary_path: PrimaryPath
  name: string
  phone: string
  preferred_next_step: string
  follow_up_intent: string
}

/**
 * Validates a full submission against the steps for its path. Answers that
 * aren't on those steps are dropped; empty optional answers become null.
 */
export function validateQualification(
  answers: Answers,
): { ok: true; values: QualificationValues } | { ok: false; errors: Record<string, string> } {
  const steps = getVisibleSteps(answers)
  const errors: Record<string, string> = {}
  const values: Record<string, string | null> = {}
  if (!isPrimaryPath(answers.primary_path)) errors.primary_path = 'Choose an option.'
  for (const step of steps) {
    for (const field of step.fields) {
      const error = validateField(field, answers[field.key])
      if (error) errors[field.key] = error
      values[field.key] = answers[field.key]?.trim() || null
    }
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, values: values as QualificationValues }
}

// ---------------------------------------------------------------------------
// CRM: derived support category, statuses, labels
// ---------------------------------------------------------------------------
export const SUPPORT_CATEGORY_OPTIONS = [
  { value: 'self_guided', label: 'Self-build / guidance' },
  { value: 'guided_build', label: 'Guided building' },
  { value: 'technical_help', label: 'Technical help' },
  { value: 'implementation', label: 'Implementation' },
  { value: 'exploring', label: 'Still exploring' },
] as const

export type SupportCategory = (typeof SUPPORT_CATEGORY_OPTIONS)[number]['value']

/**
 * One support bucket per submission for filtering and counts. The final
 * "what next" answer decides, except that an explicit ask for technical help
 * or implementation on the path wins over the guided/self-build answers.
 */
export function deriveSupportCategory(v: Record<string, string | null>): SupportCategory {
  if (v.preferred_next_step === 'implementation_help' || v.implementation_support === 'implement') return 'implementation'
  if (v.preferred_next_step === 'exploring') return 'exploring'
  if (v.support_level === 'technical_help' || v.support_need === 'technical_help') return 'technical_help'
  if (v.preferred_next_step === 'build_with_expert') return 'guided_build'
  return 'self_guided'
}

export function wantsFollowUp(followUpIntent: string | null | undefined): boolean {
  return followUpIntent === 'discuss_next_step' || followUpIntent === 'help_with_project'
}

export const QUALIFICATION_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'contacted', label: 'Contacted' },
] as const

export const MATCH_TYPE_OPTIONS = [
  { value: 'existing_workshop_lead', label: 'Existing workshop lead' },
  { value: 'existing_crm_lead', label: 'Existing CRM lead (other workshop)' },
  { value: 'returning_community', label: 'Returning / community' },
  { value: 'new_lead', label: 'New lead' },
] as const

export type MatchType = (typeof MATCH_TYPE_OPTIONS)[number]['value']

/** Per-path fields shown as the CRM's summary columns. */
export const PATH_SUMMARY: Record<PrimaryPath, { stage: string; need: string | null; context: readonly string[] }> = {
  learn_to_build: { stage: 'current_building_level', need: 'learning_direction', context: ['contextual_notes'] },
  existing_project: { stage: 'project_stage', need: 'current_blocker', context: ['current_project', 'project_context'] },
  idea_to_project: { stage: 'idea_stage', need: 'support_need', context: ['project_idea', 'idea_context'] },
  business_automation: {
    stage: 'current_automation_state',
    need: 'automation_area',
    context: ['business_automation_context'],
  },
}

/** Every stored answer column (the survey fields minus contact details). */
export const ANSWER_COLUMNS: readonly string[] = [
  'primary_path',
  ...BRANCH_FIELD_KEYS,
  'preferred_next_step',
  'follow_up_intent',
]

/** The fields for a stored submission, in survey order (for the CRM profile). */
export function getAnswerFields(answers: Answers): Field[] {
  return getVisibleSteps(answers)
    .flatMap((s) => s.fields)
    .filter((f) => !(CONTACT_FIELD_KEYS as readonly string[]).includes(f.key))
}

/** Display text for a stored answer: the option label, or the text itself. */
export function answerLabel(field: Field, value: string | null | undefined): string {
  if (!value) return ''
  if (field.kind !== 'choice') return value
  return field.options.find((o) => o.value === value)?.label ?? value
}

/** Label for a stored value of a column on a given path (e.g. `support_need`). */
export function columnLabel(answers: Answers, key: string | null): string {
  if (!key) return ''
  const field = getAnswerFields(answers).find((f) => f.key === key)
  return field ? answerLabel(field, answers[key]) : answers[key] ?? ''
}
