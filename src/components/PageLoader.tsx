interface PageLoaderProps {
  /** Usa cores escuras para páginas de fundo claro (ex.: /experiencia). */
  claro?: boolean
}

/** Fallback exibido enquanto o código de uma página é baixado (React.lazy). */
export function PageLoader({ claro = false }: PageLoaderProps) {
  return (
    <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span
        aria-hidden="true"
        className={`h-10 w-10 animate-spin rounded-full border-4 ${claro ? 'border-[#235dc8]/20 border-t-[#235dc8]' : 'border-cyan-300/20 border-t-cyan-300'}`}
      />
      <p className={`text-sm font-bold ${claro ? 'text-[#64738c]' : 'text-white/70'}`}>Carregando página…</p>
    </div>
  )
}
