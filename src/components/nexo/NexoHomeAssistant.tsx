import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Nexo3D = lazy(() => import('../nexo3d/Nexo3D').then((module) => ({ default: module.Nexo3D })))

type NexoHomeAssistantProps = {
  eyebrow?: string
  title?: string
  messages: string[]
  status?: string
  action?: { label: string; to: string }
}

export function NexoHomeAssistant({
  eyebrow = 'Seu companheiro de evolução',
  title = 'Eu sou o Nexo',
  messages,
  status = 'Pronto para ajudar',
  action,
}: NexoHomeAssistantProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [present, setPresent] = useState(false)
  const [active, setActive] = useState(false)
  const [interaction, setInteraction] = useState(0)
  const [paused, setPaused] = useState(false)
  const messagesKey = messages.join('::')

  useEffect(() => {
    setMessageIndex(0)
  }, [messagesKey])

  useEffect(() => {
    if (interaction === 0) return undefined
    const timer = window.setTimeout(() => setActive(false), 2400)
    return () => window.clearTimeout(timer)
  }, [interaction])

  function interact() {
    setActive(true)
    setInteraction((current) => current + 1)
    if (messages.length > 1) setMessageIndex((current) => (current + 1) % messages.length)
  }

  const currentMessage = messages[messageIndex] ?? 'Vamos continuar sua jornada sustentável.'

  return (
    <section
      className="relative isolate min-w-0 overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-gradient-to-b from-[#15365b] via-[#08282e] to-[#001b16] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.30)] sm:p-6"
      aria-label="Assistente Nexo"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">{eyebrow}</span>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-3 py-1.5 text-[10px] font-bold text-cyan-100">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
          {status}
        </span>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[1.4rem] border border-cyan-100/15 bg-[#163d71]">
        <Suspense fallback={
          <div className="relative h-[330px] sm:h-[350px]" role="status">
            <img
              src="/image/nexo-stage.png"
              alt="Nexo, um robô branco com visor azul luminoso, em seu ambiente."
              className="h-full w-full object-contain"
            />
            <span className="absolute inset-x-4 bottom-4 rounded-full bg-[#0b2351]/90 px-3 py-2 text-center text-xs text-white">Preparando o Nexo…</span>
          </div>
        }>
          <Nexo3D
            className="!h-[330px] sm:!h-[350px]"
            state={active ? 'happy' : present ? 'looking' : 'idle'}
            paused={paused}
            onInteract={interact}
            onPresenceChange={setPresent}
          />
        </Suspense>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/15 bg-[#0b2351]/75 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-100 backdrop-blur-md">Nexo online</span>
          <button
            type="button"
            onClick={() => setPaused((current) => !current)}
            aria-label={paused ? 'Retomar animações do Nexo' : 'Pausar animações do Nexo'}
            aria-pressed={paused}
            className="pointer-events-auto inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/20 bg-[#0b2351]/80 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md transition hover:bg-[#163d71] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
            {paused ? 'Retomar' : 'Pausar'}
          </button>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] font-semibold tracking-wide text-cyan-100/65">Clique ou toque no Nexo para receber uma dica</p>

      <div className={`mt-4 rounded-2xl border p-4 transition-colors ${active ? 'border-cyan-200/35 bg-cyan-200/[0.08]' : 'border-white/10 bg-black/15'}`}>
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">Orientação do Nexo</span>
        <p className="mt-2 text-sm leading-6 text-white/80" aria-live="polite" aria-atomic="true">{currentMessage}</p>
        {messages.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
            <span className="text-xs text-white/50">Dica {messageIndex + 1} de {messages.length}</span>
            <button
              type="button"
              onClick={interact}
              className="rounded-full border border-cyan-200/25 bg-cyan-300/[0.08] px-4 py-2 text-xs font-black text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            >
              Próxima dica
            </button>
          </div>
        )}
      </div>

      {action && (
        <Link
          to={action.to}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-black text-[#00140f] shadow-[0_12px_30px_rgba(34,211,238,0.13)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {action.label}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </section>
  )
}
