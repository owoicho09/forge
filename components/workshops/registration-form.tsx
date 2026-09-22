'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  workshopRegistrationSchema,
  type WorkshopRegistrationInput,
} from '@/lib/validations/workshop-registration'
import { EXPERIENCE_OPTIONS, INTEREST_OPTIONS } from '@/lib/workshops/telegrambot'

type SubmitState = 'idle' | 'submitting'

export function RegistrationForm() {
  const searchParams = useSearchParams()
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ registrationId: string; whatsappInviteUrl: string } | null>(null)

  const form = useForm<WorkshopRegistrationInput>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      interest: undefined,
      experienceLevel: undefined,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
    },
  })

  useEffect(() => {
    form.setValue('utmSource', searchParams.get('utm_source'))
    form.setValue('utmMedium', searchParams.get('utm_medium'))
    form.setValue('utmCampaign', searchParams.get('utm_campaign'))
    form.setValue('utmContent', searchParams.get('utm_content'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(values: WorkshopRegistrationInput) {
    setSubmitState('submitting')
    setServerError(null)
    try {
      const res = await fetch('/api/workshops/telegrambot/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error || 'Something went wrong. Please try again.')
        setSubmitState('idle')
        return
      }
      setSuccess({ registrationId: json.registrationId, whatsappInviteUrl: json.whatsappInviteUrl })
    } catch {
      setServerError('Network error. Please check your connection and try again.')
      setSubmitState('idle')
    }
  }

  function handleWhatsAppClick() {
    if (!success) return
    fetch('/api/workshops/telegrambot/invite-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: success.registrationId }),
      keepalive: true,
    }).catch(() => {})
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8">
        <CheckCircle2 className="mx-auto h-9 w-9 text-[#e85d26] sm:h-10 sm:w-10" />
        <h3 className="mt-3 font-syne text-lg font-bold text-[#1a1714] sm:mt-4 sm:text-xl">You&apos;re registered!</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Thanks for signing up for the AI Job Finder Telegram Bot workshop.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Join the WhatsApp community to receive workshop announcements, resources, and joining instructions.
        </p>
        <a
          href={success.whatsappInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#20ba58] hover:shadow-lg active:scale-[0.98] sm:px-6 sm:py-3.5 sm:text-base"
        >
          Join the WhatsApp Community
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you most interested in learning?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INTEREST_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How much experience do you have building with AI?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitState === 'submitting'}
            className="h-auto w-full min-w-0 whitespace-normal break-words bg-[#e85d26] px-4 py-3 text-sm font-semibold leading-snug text-white hover:bg-[#d54f1c] sm:py-3.5 sm:text-base"
          >
            {submitState === 'submitting' && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
            Register &amp; Get WhatsApp Access
          </Button>
        </form>
      </Form>
    </div>
  )
}
