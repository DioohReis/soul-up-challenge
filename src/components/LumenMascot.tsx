import { useEffect, useState } from 'react'

type LumenMascotProps = {
  compact?: boolean
  interactive?: boolean
}

export function LumenMascot({ compact = false, interactive = true }: LumenMascotProps) {
  const [energized, setEnergized] = useState(false)

  useEffect(() => {
    if (!energized) return undefined
    const timer = window.setTimeout(() => setEnergized(false), 1600)
    return () => window.clearTimeout(timer)
  }, [energized])

  const size = compact ? 'h-52 w-44 sm:h-56 sm:w-48' : 'h-72 w-60 sm:h-80 sm:w-64'

  const avatar = (
    <div className={`group relative mx-auto ${size} select-none`}>
      <div className={`absolute inset-x-4 bottom-3 top-8 rounded-full blur-3xl transition duration-500 ${energized ? 'bg-emerald-300/30' : 'bg-cyan-300/15'}`} />
      <div className="absolute left-1/2 top-[46%] h-[72%] w-[86%] -translate-x-1/2 -translate-y-1/2 animate-lumen-breathe rounded-full border border-cyan-200/10 opacity-70" />
      <div className="absolute left-1/2 top-[46%] h-[56%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/10 opacity-60" />

      <span className="absolute left-[8%] top-[28%] h-1.5 w-1.5 animate-lumen-orbit rounded-full bg-cyan-100 shadow-[0_0_12px_white]" />
      <span className="absolute right-[7%] top-[43%] h-2 w-2 animate-lumen-orbit-delayed rounded-full bg-emerald-200 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
      <span className="absolute left-[17%] top-[69%] h-1 w-1 animate-pulse rounded-full bg-lime-100" />

      <div className={`absolute left-1/2 top-3 h-[92%] w-[82%] -translate-x-1/2 animate-lumen-float transition-transform duration-500 ${energized ? 'scale-105' : ''}`}>
        <div className="absolute left-1/2 top-[2%] z-10 h-[31%] w-[58%] -translate-x-1/2">
          <span className="absolute left-[4%] top-[31%] h-[57%] w-[34%] origin-bottom -rotate-[24deg] animate-lumen-flame rounded-[80%_20%_70%_30%] bg-gradient-to-t from-cyan-400 via-emerald-200 to-lime-100 shadow-[0_0_24px_rgba(110,231,183,0.52)]" />
          <span className="absolute left-[30%] top-[2%] h-[82%] w-[40%] origin-bottom animate-lumen-flame-main rounded-[60%_40%_76%_24%] bg-gradient-to-t from-cyan-400 via-emerald-200 to-yellow-100 shadow-[0_0_34px_rgba(34,211,238,0.64)]" />
          <span className="absolute right-[2%] top-[28%] h-[59%] w-[34%] origin-bottom rotate-[21deg] animate-lumen-flame-delayed rounded-[30%_70%_24%_76%] bg-gradient-to-t from-cyan-400 via-emerald-200 to-lime-100 shadow-[0_0_24px_rgba(110,231,183,0.5)]" />
          <span className="absolute left-[40%] top-[31%] h-[46%] w-[22%] origin-bottom animate-lumen-flame-core rounded-[60%_40%_70%_30%] bg-gradient-to-t from-white via-lime-100 to-yellow-50 shadow-[0_0_22px_rgba(255,255,255,0.8)]" />
        </div>

        <div className="absolute left-[2%] top-[34%] z-20 h-[18%] w-[21%] rounded-[50%_42%_42%_50%] border border-cyan-100/40 bg-gradient-to-br from-cyan-200 to-emerald-400 shadow-[0_0_18px_rgba(34,211,238,0.42)]">
          <div className="absolute inset-[28%] rounded-full bg-[#004c45]/65" />
        </div>
        <div className="absolute right-[2%] top-[34%] z-20 h-[18%] w-[21%] rounded-[42%_50%_50%_42%] border border-cyan-100/40 bg-gradient-to-bl from-cyan-200 to-emerald-400 shadow-[0_0_18px_rgba(34,211,238,0.42)]">
          <div className="absolute inset-[28%] rounded-full bg-[#004c45]/65" />
        </div>

        <div className="absolute left-1/2 top-[23%] z-30 h-[37%] w-[78%] -translate-x-1/2 rounded-[46%_54%_49%_51%] border border-cyan-50/65 bg-gradient-to-br from-[#bafff5] via-[#34dfcb] to-[#38e88f] shadow-[inset_0_8px_22px_rgba(255,255,255,0.34),inset_0_-16px_26px_rgba(0,73,65,0.28),0_0_34px_rgba(34,211,238,0.48)]">
          <div className="absolute left-[12%] top-[9%] h-[22%] w-[38%] -rotate-12 rounded-full bg-white/25 blur-md" />
          <div className="absolute left-1/2 top-[23%] h-[52%] w-[72%] -translate-x-1/2 overflow-hidden rounded-[48%_52%_48%_52%] border border-cyan-100/20 bg-[#001b1a] shadow-[inset_0_0_18px_rgba(0,0,0,0.72),0_0_12px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-[18%] top-[27%] flex items-center justify-between">
              <span className="h-5 w-3 animate-lumen-blink rounded-full bg-cyan-50 shadow-[0_0_14px_white] sm:h-6 sm:w-3.5" />
              <span className="h-5 w-3 animate-lumen-blink rounded-full bg-cyan-50 shadow-[0_0_14px_white] sm:h-6 sm:w-3.5" />
            </div>
            <span className={`absolute bottom-[18%] left-1/2 h-[8%] -translate-x-1/2 rounded-full bg-emerald-200/70 transition-all ${energized ? 'w-[24%]' : 'w-[16%]'}`} />
            <span className="absolute left-[8%] top-[18%] h-[52%] w-[8%] rounded-full bg-cyan-300/10 blur-sm" />
          </div>
        </div>

        <div className="absolute left-1/2 top-[58%] z-20 h-[34%] w-[57%] -translate-x-1/2 rounded-[45%_45%_38%_38%] border border-cyan-100/35 bg-gradient-to-b from-[#22d3c5] via-[#10a88f] to-[#075d53] shadow-[inset_0_8px_20px_rgba(255,255,255,0.16),0_0_28px_rgba(34,211,238,0.28)]">
          <div className="absolute left-1/2 top-[17%] grid h-[31%] w-[31%] -translate-x-1/2 place-items-center rounded-full border border-emerald-100/50 bg-[#002923]/70 shadow-[0_0_20px_rgba(110,231,183,0.52)]">
            <svg viewBox="0 0 32 32" className="h-[62%] w-[62%] text-emerald-100" aria-hidden="true">
              <path d="M25.8 5.8C17 6.6 10.2 10.2 7.8 16.5c-1.4 3.6-.4 7 1.6 9.2 1.5-6.3 5.6-10.9 11.9-13.8-4.6 3.5-7.8 7.8-9.1 13.2 3.1.8 6.9-.2 9.4-3.3 3.8-4.5 4.4-10.5 4.2-16Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-[13%] left-1/2 h-[11%] w-[52%] -translate-x-1/2 rounded-full bg-black/15" />
        </div>

        <div className="absolute left-[-7%] top-[61%] z-10 h-[13%] w-[42%] rotate-[21deg] rounded-full border border-cyan-100/20 bg-gradient-to-r from-[#087d70] to-[#27d5ba] shadow-[0_0_18px_rgba(34,211,238,0.22)]" />
        <div className={`absolute right-[-7%] top-[61%] z-10 h-[13%] w-[42%] origin-left rounded-full border border-cyan-100/20 bg-gradient-to-l from-[#087d70] to-[#27d5ba] shadow-[0_0_18px_rgba(34,211,238,0.22)] ${energized ? 'animate-lumen-wave-fast' : 'animate-lumen-wave'}`} />
        <div className="absolute right-[-8%] top-[55%] z-20 h-[15%] w-[18%] rounded-[48%] border border-cyan-100/25 bg-gradient-to-br from-cyan-200 to-emerald-300" />

        <div className="absolute bottom-[1%] left-1/2 z-10 h-[12%] w-[46%] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-emerald-400/10 via-cyan-200/65 to-emerald-400/10 blur-md" />
      </div>

      <div className="absolute bottom-0 left-1/2 h-3 w-[65%] -translate-x-1/2 rounded-full bg-cyan-200/25 blur-lg" />
      {interactive && (
        <span className={`absolute bottom-1 right-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] backdrop-blur transition sm:right-0 ${energized ? 'border-emerald-200/55 bg-emerald-300/15 text-emerald-100' : 'border-cyan-200/25 bg-black/35 text-cyan-100/65 group-hover:text-cyan-100'}`}>
          {energized ? 'Lumën online' : 'Toque na Lumën'}
        </span>
      )}
    </div>
  )

  if (!interactive) return avatar

  return (
    <button
      type="button"
      onClick={() => setEnergized(true)}
      className="mx-auto block rounded-[2rem] outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#00140f]"
      aria-label="Interagir com a avatar Lumën"
    >
      {avatar}
    </button>
  )
}
