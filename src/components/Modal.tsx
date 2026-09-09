import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={onClose}>
      <article className="w-full max-w-md rounded-3xl border border-cyan-200/25 bg-[#00231b] p-7 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Lumen AI</span>
        <h2 id="modal-title" className="mt-3 text-2xl font-black text-white">{title}</h2>
        <div className="mt-4 text-sm leading-7 text-white/70">{children}</div>
        <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-4 py-3 text-sm font-black text-[#00140f] transition hover:brightness-110">
          Continuar
        </button>
      </article>
    </div>
  )
}
