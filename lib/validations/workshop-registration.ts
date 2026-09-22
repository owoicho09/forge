import { z } from 'zod'
import { EXPERIENCE_OPTIONS, INTEREST_OPTIONS } from '@/lib/workshops/telegrambot'

export const workshopRegistrationSchema = z.object({
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
  interest: z.enum(INTEREST_OPTIONS, {
    message: 'Choose what you\'re most interested in learning.',
  }),
  experienceLevel: z.enum(EXPERIENCE_OPTIONS, {
    message: 'Choose your experience level.',
  }),
  utmSource: z.string().trim().max(200).nullish(),
  utmMedium: z.string().trim().max(200).nullish(),
  utmCampaign: z.string().trim().max(200).nullish(),
  utmContent: z.string().trim().max(200).nullish(),
})

export type WorkshopRegistrationInput = z.infer<typeof workshopRegistrationSchema>
