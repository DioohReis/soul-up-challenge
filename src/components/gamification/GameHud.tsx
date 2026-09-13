type GameHudProps = {
  points: number
  levelName: string
  levelPercent: number
  nextGoal: string
  streak: number
  completed: number
  total: number
}

function getBadge(completed: number) {
  if (completed >= 10) return { name: 'Impacto em série', progress: 100 }
  if (completed >= 5) return { name: 'Ritmo Soul', progress: Math.min((completed / 10) * 100, 100) }
  if (completed >= 3) return { name: 'Em movimento', progress: Math.min((completed / 5) * 100, 100) }
  if (completed >= 1) return { name: 'Primeiro passo', progress: Math.min((completed / 3) * 100, 100) }
  return { name: 'Primeira conquista', progress: 0 }
}

export function GameHud({ points, levelName, levelPercent, nextGoal, streak, completed, total }: GameHudProps) {
  const badge = getBadge(completed)

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo da gamificação">
      <article className="rounded-2xl border border-soul-blue/12 bg-white/80 p-4 shadow-[0_14px_32px_rgba(7,26,71,0.07)] backdrop-blur-xl">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/45">Pontos</span>
        <div className="mt-2 flex items-end justify-between gap-3">
          <strong className="text-2xl font-black text-soul-navy">{points}</strong>
          <span className="rounded-full bg-soul-mist px-2 py-1 text-[10px] font-black text-soul-blue">XP</span>
        </div>
      </article>

      <article className="rounded-2xl border border-soul-blue/12 bg-white/80 p-4 shadow-[0_14px_32px_rgba(7,26,71,0.07)] backdrop-blur-xl">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/45">Nível</span>
        <strong className="mt-2 block text-base font-black text-soul-navy">{levelName}</strong>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soul-mist">
          <span className="block h-full rounded-full bg-gradient-to-r from-soul-sky to-soul-blue transition-all duration-500" style={{ width: `${levelPercent}%` }} />
        </div>
        <span className="mt-1 block text-[9px] text-soul-navy/42">{nextGoal}</span>
      </article>

      <article className="rounded-2xl border border-soul-blue/12 bg-white/80 p-4 shadow-[0_14px_32px_rgba(7,26,71,0.07)] backdrop-blur-xl">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/45">Sequência</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-soul-mist text-lg" aria-hidden="true">✦</span>
          <strong className="text-2xl font-black text-soul-navy">{streak}</strong>
          <span className="text-xs font-bold text-soul-navy/45">dia{streak === 1 ? '' : 's'}</span>
        </div>
      </article>

      <article className="rounded-2xl border border-soul-blue/12 bg-white/80 p-4 shadow-[0_14px_32px_rgba(7,26,71,0.07)] backdrop-blur-xl">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/45">Conquista</span>
        <strong className="mt-2 block truncate text-sm font-black text-soul-navy">{badge.name}</strong>
        <div className="mt-2 flex items-center justify-between text-[9px] font-bold text-soul-navy/42">
          <span>{completed}/{total} missões</span>
          <span>{Math.round(badge.progress)}%</span>
        </div>
      </article>
    </div>
  )
}
