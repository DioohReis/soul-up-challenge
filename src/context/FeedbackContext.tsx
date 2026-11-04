import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

export type TipoFeedback = 'sucesso' | 'erro' | 'info'

export interface Feedback {
  id: number
  tipo: TipoFeedback
  titulo: string
  mensagem?: string
}

type NovoFeedback = Omit<Feedback, 'id'>

interface FeedbackContextValue {
  notificar: (feedback: NovoFeedback) => void
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

const estilos: Record<TipoFeedback, string> = {
  sucesso: 'border-emerald-300/40 bg-[#002a1f] text-emerald-50',
  erro: 'border-rose-400/45 bg-[#2a0a12] text-rose-50',
  info: 'border-cyan-300/40 bg-[#00222a] text-cyan-50',
}

const icones: Record<TipoFeedback, string> = { sucesso: '✓', erro: '!', info: 'i' }

/** Avisos globais (toasts) usados após ações e redirecionamentos. */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Feedback[]>([])
  const proximoId = useRef(1)

  const fechar = useCallback((id: number) => setAvisos((lista) => lista.filter((aviso) => aviso.id !== id)), [])

  const notificar = useCallback((feedback: NovoFeedback) => {
    const id = proximoId.current++
    setAvisos((lista) => [...lista.slice(-2), { ...feedback, id }])
    window.setTimeout(() => fechar(id), 6000)
  }, [fechar])

  const valor = useMemo(() => ({ notificar }), [notificar])

  return (
    <FeedbackContext.Provider value={valor}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:w-96">
        {avisos.map((aviso) => (
          <div key={aviso.id} role={aviso.tipo === 'erro' ? 'alert' : 'status'} className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md ${estilos[aviso.tipo]}`}>
            <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-black">{icones[aviso.tipo]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">{aviso.titulo}</p>
              {aviso.mensagem && <p className="mt-1 break-words text-xs leading-5 opacity-80">{aviso.mensagem}</p>}
            </div>
            <button type="button" onClick={() => fechar(aviso.id)} aria-label="Fechar aviso" className="rounded-lg px-2 text-lg leading-none opacity-70 transition hover:bg-white/10 hover:opacity-100">×</button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  )
}

export function useFeedback(): FeedbackContextValue {
  const contexto = useContext(FeedbackContext)
  if (!contexto) throw new Error('useFeedback deve ser usado dentro de <FeedbackProvider>.')
  return contexto
}
