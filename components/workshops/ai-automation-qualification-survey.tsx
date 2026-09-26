'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  getVisibleSteps,
  hasChosenPath,
  validateStep,
  withAnswer,
  type Answers,
  type Field,
} from '@/lib/workshops/ai-automation-qualification'

// Survey progress survives a refresh (answers stay on this device only).
const DRAFT_KEY = 'fb-ai-automation-next-step-draft'

function loadDraft(): { answers: Answers; stepIndex: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const draft = JSON.parse(raw)
    if (!draft || typeof draft.answers !== 'object') return null
    const answers: Answers = {}
    for (const [key, value] of Object.entries(draft.answers)) {
      if (typeof value === 'string') answers[key] = value
    }
    return { answers, stepIndex: Number(draft.stepIndex) || 0 }
  } catch {
    return null
  }
}

function saveDraft(answers: Answers, stepIndex: number) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, stepIndex }))
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {}
}

function Optional() {
  return <span className="font-normal text-slate-400">(optional)</span>
}

function ChoiceOptions({
  field,
  value,
  onChange,
  labelledBy,
}: {
  field: Extract<Field, { kind: 'choice' }>
  value: string | undefined
  onChange: (value: string) => void
  labelledBy: string
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="space-y-3">
      {field.options.map((option) => {
        const selected = value === option.value
        return (
          <label
            key={option.value}
            className={cn(
              'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[15px] leading-snug transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-[#e85d26]/30 sm:text-base',
              selected
                ? 'border-[#e85d26] bg-[#e85d26]/5 font-medium text-[#1a1714]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            <input
              type="radio"
              name={field.key}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                selected ? 'border-[#e85d26] bg-[#e85d26] text-white' : 'border-slate-300',
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            {option.label}
          </label>
        )
      })}
    </div>
  )
}

export function AiAutomationQualificationSurvey() {
  const [answers, setAnswers] = useState<Answers>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const inFlight = useRef(false)
  const hasNavigated = useRef(false)

  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setAnswers(draft.answers)
      setStepIndex(draft.stepIndex)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && !done) saveDraft(answers, stepIndex)
  }, [ready, done, answers, stepIndex])

  const steps = getVisibleSteps(answers)
  const index = Math.min(stepIndex, steps.length - 1)
  const step = steps[index]
  const pathChosen = hasChosenPath(answers)
  const isLast = pathChosen && index === steps.length - 1
  const errors = validateStep(step, answers)
  const missingRequired = step.fields.some((f) => !f.optional && !answers[f.key]?.trim())

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!hasNavigated.current) return
    headingRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [index])

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => withAnswer(prev, key, value))
    setServerError(null)
  }

  function goTo(nextIndex: number) {
    hasNavigated.current = true
    setShowErrors(false)
    setStepIndex(nextIndex)
  }

  async function submit() {
    if (inFlight.current) return
    inFlight.current = true
    setSubmitting(true)
    setServerError(null)
    try {
      const params = new URLSearchParams(window.location.search)
      const res = await fetch('/api/workshops/ai-automation/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          source: params.get('source'),
          utmSource: params.get('utm_source'),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        // Send them back to the first step the server rejected, if any.
        const fieldErrors = (json.fieldErrors ?? {}) as Record<string, string>
        const badStep = steps.findIndex((s) => s.fields.some((f) => fieldErrors[f.key]))
        if (badStep !== -1 && badStep !== index) goTo(badStep)
        if (badStep !== -1) setShowErrors(true)
        setServerError(json.error || 'Something went wrong. Please try again.')
        return
      }
      clearDraft()
      setDone(true)
      window.scrollTo({ top: 0 })
    } catch {
      setServerError('Network error. Your answers are still here — check your connection and try again.')
    } finally {
      inFlight.current = false
      setSubmitting(false)
    }
  }

  function handleNext(event: React.FormEvent) {
    event.preventDefault()
    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      return
    }
    if (isLast) submit()
    else goTo(index + 1)
  }

  if (done) {
    return (
      <div role="status" className="py-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#e85d26]" />
        <h2 className="mt-4 font-syne text-xl font-bold text-[#1a1714]">You&apos;re all set.</h2>
        <p className="mx-auto mt-2 max-w-sm text-balance text-sm leading-relaxed text-slate-600 sm:text-base">
          Thanks — we&apos;ve got your responses. We&apos;ll use them to understand what you&apos;re working toward and
          what support makes sense next.
        </p>
      </div>
    )
  }

  const headingId = `step-${step.id}-title`
  const singleField = step.fields.length === 1

  return (
    <form onSubmit={handleNext} noValidate aria-busy={submitting} className="flex flex-1 flex-col">
      <div className="flex-1 sm:flex-none">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#e85d26]">
          {pathChosen ? `Step ${index + 1} of ${steps.length}` : `Step ${index + 1}`}
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[#e85d26]"
            style={{ width: `${pathChosen ? ((index + 1) / steps.length) * 100 : (index + 1) * 8}%` }}
          />
        </div>

        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 text-balance font-dm-sans text-xl font-bold leading-snug text-[#1a1714] outline-none sm:text-2xl"
        >
          {step.title}
          {singleField && step.fields[0].optional && (
            <span className="ml-1.5 align-middle text-sm font-normal text-slate-400">(optional)</span>
          )}
        </h2>

        <div className="mt-5 space-y-5">
          {step.fields.map((field) => {
            const inputId = `q-${field.key}`
            const error = showErrors ? errors[field.key] : undefined
            const showLabel = !singleField
            return (
              <div key={field.key}>
                {showLabel && field.kind !== 'choice' && (
                  <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[#1a1714]">
                    {field.label} {field.optional && <Optional />}
                  </label>
                )}

                {field.kind === 'choice' ? (
                  <ChoiceOptions
                    field={field}
                    value={answers[field.key]}
                    onChange={(value) => setAnswer(field.key, value)}
                    labelledBy={headingId}
                  />
                ) : field.kind === 'textarea' ? (
                  <Textarea
                    id={inputId}
                    aria-labelledby={singleField ? headingId : undefined}
                    aria-invalid={!!error}
                    rows={5}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    value={answers[field.key] ?? ''}
                    onChange={(e) => setAnswer(field.key, e.target.value)}
                    className="min-h-32 bg-white text-base md:text-base"
                  />
                ) : (
                  <Input
                    id={inputId}
                    type={field.kind}
                    inputMode={field.kind === 'tel' ? 'tel' : field.kind === 'email' ? 'email' : undefined}
                    aria-labelledby={singleField ? headingId : undefined}
                    aria-invalid={!!error}
                    maxLength={field.maxLength}
                    autoComplete={field.autoComplete ?? 'off'}
                    placeholder={field.placeholder}
                    value={answers[field.key] ?? ''}
                    onChange={(e) => setAnswer(field.key, e.target.value)}
                    className="h-12 bg-white text-base md:text-base"
                  />
                )}

                {error && (
                  <p role="alert" className="mt-1.5 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {serverError && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        )}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0 sm:py-0">
        {index > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo(index - 1)}
            disabled={submitting}
            className="h-12 px-5 text-base"
          >
            Previous
          </Button>
        )}
        <Button
          type="submit"
          disabled={missingRequired || submitting}
          className="h-12 flex-1 bg-[#e85d26] text-base font-semibold text-white hover:bg-[#d54f1c]"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLast ? (submitting ? 'Submitting…' : serverError ? 'Try again' : 'Submit') : 'Next'}
        </Button>
      </div>
    </form>
  )
}
