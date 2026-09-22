'use client'

import type { ReactNode } from 'react'

export function ScrollToRegisterButton({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  function handleClick() {
    const target = document.getElementById('register')
    if (!target) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
