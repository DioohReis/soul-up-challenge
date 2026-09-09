import type { ReactNode } from 'react'

type GlassCardProps = {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <article className={`rounded-3xl border border-cyan-200/15 bg-black/25 p-6 shadow-neon backdrop-blur-md ${className}`}>
      {children}
    </article>
  )
}
