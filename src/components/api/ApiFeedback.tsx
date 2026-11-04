import type { ReactNode } from 'react'
import { API_URL } from '../../services/api'

export function LoadingState({ mensagem = 'Carregando dados da API…' }: { mensagem?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 rounded-3xl border border-cyan-200/15 bg-black/20 px-6 py-12 text-center">
      <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-300" />
      <p className="text-sm font-bold text-white/80">{mensagem}</p>
      <p className="max-w-md text-xs leading-5 text-white/45">A API Java está no Render (plano gratuito). Na primeira chamada ela pode levar até 1 minuto para responder.</p>
    </div>
  )
}

interface ErrorStateProps {
  mensagem: string
  onTentarNovamente?: () => void
}

export function ErrorState({ mensagem, onTentarNovamente }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-3xl border border-rose-400/35 bg-rose-400/[0.07] px-6 py-10 text-center">
      <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-rose-400/20 text-xl font-black text-rose-100">!</span>
      <p className="text-base font-black text-rose-50">Não foi possível carregar os dados</p>
      <p className="max-w-lg break-words text-sm text-rose-100/75">{mensagem}</p>
      {onTentarNovamente && (
        <button type="button" onClick={onTentarNovamente} className="mt-2 rounded-xl border border-rose-300/40 px-5 py-2 text-xs font-extrabold tracking-[0.1em] text-rose-50 transition hover:bg-rose-400/15">
          TENTAR NOVAMENTE
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  titulo: string
  descricao?: string
  children?: ReactNode
}

export function EmptyState({ titulo, descricao, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-white/15 px-6 py-10 text-center">
      <p className="text-base font-black text-white/85">{titulo}</p>
      {descricao && <p className="max-w-md text-sm text-white/55">{descricao}</p>}
      {children}
    </div>
  )
}

export function ApiBadge() {
  return (
    <p className="break-all text-xs text-white/45">
      <span className="font-black uppercase tracking-[0.14em] text-cyan-100/70">API:</span> {API_URL}
    </p>
  )
}
