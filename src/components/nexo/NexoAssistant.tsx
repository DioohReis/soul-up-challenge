import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NexoAvatar, type NexoMood } from './NexoAvatar'

type NexoAction = {
  label: string
  to: string
}

type NexoAssistantProps = {
  eyebrow?: string
  title?: string
  messages: string[]
  status?: string
  action?: NexoAction
  mood?: NexoMood
}

export function NexoAssistant({
  eyebrow = 'Companheiro Soul Up',
  title = 'Eu sou o Nexo',
  messages,
  status = 'Pronto para ajudar',
  action,
  mood = 'guide',
}: NexoAssistantProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [active, setActive] = useState(false)
  const messagesKey = messages.join('::')

  useEffect(() => {
    setMessageIndex(0)
  }, [messagesKey])

  useEffect(() => {
    if (!active) return undefined
    const timer = window.setTimeout(() => setActive(false), 1800)
    return () => window.clearTimeout(timer)
  }, [active])

  const currentMessage = messages[messageIndex] ?? 'Vamos continuar sua jornada.'

  function interact() {
    setActive(true)
    if (messages.length > 1) setMessageIndex((current) => (current + 1) % messages.length)
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-soul-sky/20 bg-gradient-to-br from-soul-navy via-[#0a2a62] to-soul-blue p-5 text-white shadow-[0_28px_70px_rgba(7,26,71,0.28)] sm:p-6" aria-label="Assistente Nexo">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-soul-sky/20 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-[90px]" />

      <div className="relative z-10 grid items-center gap-4 sm:grid-cols-[1fr_230px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-soul-ice/80">{eyebrow}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-soul-sky" />
              {status}
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>

          <div className="mt-4 rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-soul-sky">Orientação atual</span>
            <p className="mt-2 text-sm leading-7 text-white/80" aria-live="polite">{currentMessage}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {messages.length > 1 && (
              <button type="button" onClick={interact} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soul-sky">
                Outra dica
              </button>
            )}
            {action && (
              <Link to={action.to} className="rounded-full bg-white px-4 py-2 text-xs font-black text-soul-navy transition hover:-translate-y-0.5 hover:bg-soul-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soul-sky">
                {action.label} →
              </Link>
            )}
          </div>
        </div>

        <button type="button" onClick={interact} className="group mx-auto rounded-[2rem] outline-none transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-soul-sky" aria-label="Interagir com o Nexo">
          <NexoAvatar compact mood={mood} active={active} />
          <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.14em] text-white/45 transition group-hover:text-white/80">Toque para interagir</span>
        </button>
      </div>
    </section>
  )
}
