'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  aiAutomationRegistrationSchema,
  type AiAutomationRegistrationInput,
} from '@/lib/validations/ai-automation-registration'
import {
  ACTIVITY_OPTIONS,
  BUSINESS_PERSONAS,
  INDUSTRY_OPTIONS,
  PERSONA_OPTIONS,
  WORKSHOP_WHEN,
} from '@/lib/workshops/ai-automation'

type SubmitState = 'idle' | 'submitting'

function Optional() {
  return <span className="font-normal text-slate-400">(optional)</span>
}

function OptionSelect({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[]
  value: string | null | undefined
  onChange: (value: string) => void
}) {
  return (
    <Select onValueChange={onChange} value={value ?? ''}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function AiAutomationRegistrationForm() {
  const searchParams = useSearchParams()
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ registrationId: string; whatsappInviteUrl: string } | null>(null)
  const inFlight = useRef(false)

  const form = useForm<AiAutomationRegistrationInput>({
    resolver: zodResolver(aiAutomationRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      persona: undefined,
      currentActivity: undefined,
      industry: null,
      industryOther: '',
      businessDescription: '',
      source: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
    },
  })

  useEffect(() => {
    form.setValue('source', searchParams.get('source'))
    form.setValue('utmSource', searchParams.get('utm_source'))
    form.setValue('utmMedium', searchParams.get('utm_medium'))
    form.setValue('utmCampaign', searchParams.get('utm_campaign'))
    form.setValue('utmContent', searchParams.get('utm_content'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persona = form.watch('persona')
  const industry = form.watch('industry')
  const industryRequired = !!persona && BUSINESS_PERSONAS.includes(persona)

  async function onSubmit(values: AiAutomationRegistrationInput) {
    if (inFlight.current) return
    inFlight.current = true
    setSubmitState('submitting')
    setServerError(null)
    try {
      const res = await fetch('/api/workshops/ai-automation/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.registrationId) {
        const fieldErrors = (json.fieldErrors ?? {}) as Record<string, string[] | undefined>
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages?.[0]) {
            form.setError(field as keyof AiAutomationRegistrationInput, { message: messages[0] })
          }
        }
        setServerError(json.error || 'Something went wrong. Please try again.')
        return
      }
      setSuccess({ registrationId: json.registrationId, whatsappInviteUrl: json.whatsappInviteUrl })
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      inFlight.current = false
      setSubmitState('idle')
    }
  }

  function handleWhatsAppClick() {
    if (!success) return
    fetch('/api/workshops/ai-automation/invite-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: success.registrationId }),
      keepalive: true,
    }).catch(() => {})
  }

  if (success) {
    return (
      <div
        role="status"
        className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8"
      >
        <CheckCircle2 className="mx-auto h-9 w-9 text-[#e85d26] sm:h-10 sm:w-10" />
        <h3 className="mt-3 font-syne text-lg font-bold text-[#1a1714] sm:mt-4 sm:text-xl">Your spot is reserved!</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          See you {WORKSHOP_WHEN}.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Next step: join the WhatsApp community to get the joining link and reminders.
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

  const submitting = submitState === 'submitting'

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate aria-busy={submitting}>
          <p className="text-xs text-slate-500">All fields are required unless marked optional.</p>

          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>

          <FormField
            control={form.control}
            name="persona"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which best describes you?</FormLabel>
                <OptionSelect options={PERSONA_OPTIONS} value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentActivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you currently working on?</FormLabel>
                <OptionSelect options={ACTIVITY_OPTIONS} value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex-wrap gap-1 leading-snug">
                  If you run a business, what industry are you in? {!industryRequired && <Optional />}
                </FormLabel>
                <OptionSelect
                  options={INDUSTRY_OPTIONS}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    if (value !== 'other') form.setValue('industryOther', '')
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {industry === 'other' && (
            <FormField
              control={form.control}
              name="industryOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which industry?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Agriculture" maxLength={120} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex-wrap gap-1 leading-snug">
                  Tell us briefly about your business, product or service. <Optional />
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    maxLength={1000}
                    placeholder="Briefly describe what you do, what your business offers, or what you're currently building."
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
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
            disabled={submitting}
            className="h-auto w-full min-w-0 whitespace-normal break-words bg-[#e85d26] px-4 py-3 text-sm font-semibold leading-snug text-white hover:bg-[#d54f1c] sm:py-3.5 sm:text-base"
          >
            {submitting && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
            {submitting ? 'Reserving your spot…' : 'Reserve My Free Spot'}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Free · Join us {WORKSHOP_WHEN}
          </p>
        </form>
      </Form>
    </div>
  )
}
