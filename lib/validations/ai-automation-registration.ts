import { z } from 'zod'
import {
  ACTIVITY_OPTIONS,
  BUSINESS_PERSONAS,
  INDUSTRY_OPTIONS,
  PERSONA_OPTIONS,
  optionValues,
} from '@/lib/workshops/ai-automation'

const optionalText = (max: number, tooLong: string) => z.string().trim().max(max, tooLong).nullish()

export const aiAutomationRegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Enter your full name.')
      .max(120, 'Name is too long.'),
    email: z
      .string()
      .trim()
      .min(1, 'Enter your email address.')
      .email('Enter a valid email address.')
      .max(254, 'Email is too long.'),
    persona: z.enum(optionValues(PERSONA_OPTIONS), {
      message: 'Choose what best describes you.',
    }),
    currentActivity: z.enum(optionValues(ACTIVITY_OPTIONS), {
      message: "Choose what you're currently working on.",
    }),
    industry: z.enum(optionValues(INDUSTRY_OPTIONS)).nullish(),
    industryOther: optionalText(120, 'Keep this under 120 characters.'),
    businessDescription: optionalText(1000, 'Keep this under 1000 characters.'),
    source: z.string().trim().max(200).nullish(),
    utmSource: z.string().trim().max(200).nullish(),
    utmMedium: z.string().trim().max(200).nullish(),
    utmCampaign: z.string().trim().max(200).nullish(),
    utmContent: z.string().trim().max(200).nullish(),
  })
  .superRefine((data, ctx) => {
    if (BUSINESS_PERSONAS.includes(data.persona) && !data.industry) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['industry'], message: 'Select your industry.' })
    }
    if (data.industry === 'other' && !data.industryOther) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['industryOther'], message: 'Tell us your industry.' })
    }
  })

export type AiAutomationRegistrationInput = z.infer<typeof aiAutomationRegistrationSchema>
