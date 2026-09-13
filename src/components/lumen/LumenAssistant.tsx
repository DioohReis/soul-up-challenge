import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LumenAvatar, type LumenMood } from './LumenAvatar'

type LumenAction = {
  label: string
  to: string
}

type LumenAssistantProps = {
  eyebrow?: string
  title?: string
  messages: string[]
  status?: string
  action?: LumenAction
  mood?: LumenMood
  compact?: boolean
}

export function LumenAssistant({
  eyebrow = 'Assistente sustentável',
  title = 'Eu sou a Lumën',
  messages,
  status = 'Assistente online',
  action,
  mood = 'guide',
  compact = false,
}: LumenAssistantProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [active, setActive] = useState(false)
  const messagesKey = messages.join('::')

  useEffect(() => {
    setMessageIndex(0)
  }, [messagesKey])

  useEffect(() => {
    if (!active) return undefined
    const timer = window.setTimeout(() => setActive(false), 2200)
    return () => window.clearTimeout(timer)
  }, [active])

  const currentMessage = messages[messageIndex] ?? 'Vamos continuar sua jornada sustentável.'

  function interactWithLumen() {
    setActive(true)
    if (messages.length <= 1) return
    setMessageIndex((current) => (current + 1) % messages.length)
  }

  return (
    <section
      className={`relative isolate overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-gradient-to-b from-cyan-300/[0.08] via-[#002018]/70 to-[#00110e]/90 shadow-[0_30px_80px_rgba(0,0,0,0.30)] ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      }`}
      aria-label="Assistente Lumën"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-24 -z-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-[90px]" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">{eyebrow}</span>
          <h2 className={`mt-1 font-black tracking-tight text-white ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>{title}</h2>
        </div>

        <span className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-[10px] font-bold text-emerald-100 sm:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          {status}
        </span>
      </div>

      <div className={`mt-5 grid items-center ${compact ? 'gap-3 md:grid-cols-[minmax(0,1fr)_170px]' : 'gap-5 sm:grid-cols-[minmax(0,1fr)_220px]'}`}>
        <div
          className={`relative rounded-2xl border p-4 transition-all duration-300 ${
            active ? 'border-emerald-200/35 bg-emerald-300/[0.07]' : 'border-white/10 bg-black/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-200/20 bg-cyan-300/10 text-lg" aria-hidden="true">
              ✦
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200/70">Orientação da Lumën</span>
              <p className="mt-1 text-sm leading-7 text-white/75 sm:text-base" aria-live="polite">
                {currentMessage}
              </p>
            </div>
          </div>

          {messages.length > 1 && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
              <span className="text-xs text-white/35">Dica {messageIndex + 1} de {messages.length}</span>
              <button
                type="button"
                onClick={interactWithLumen}
                className="rounded-full border border-cyan-200/25 bg-cyan-300/[0.08] px-4 py-2 text-xs font-black text-cyan-100 transition-all hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Próxima dica
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={interactWithLumen}
          className="group mx-auto rounded-[2rem] outline-none transition-transform duration-300 hover:scale-[1.025] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#00140f]"
          aria-label="Interagir com a Lumën"
        >
          <LumenAvatar compact={compact} mood={mood} active={active} />
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 transition group-hover:text-cyan-100/70">
            Clique ou toque
          </span>
        </button>
      </div>

      {action && (
        <div className="mt-5 border-t border-white/[0.08] pt-5">
          <Link
            to={action.to}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-black text-[#00140f] shadow-[0_12px_30px_rgba(34,211,238,0.13)] transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {action.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  )
}
