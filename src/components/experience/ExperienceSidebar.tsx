type ExperienceSidebarProps = {
  points: number
  levelName: string
  levelPercent: number
  completed: number
  weeklyGoal?: number
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
      <path d="M37.5 8.5C25.4 8.8 16.2 13 12.6 20.7c-3.4 7.2-.3 14.7 6.5 16.2 7.4 1.7 14.6-3.3 16.8-11.5 1.6-5.7 1.3-11.8 1.6-16.9Z" fill="currentColor" opacity=".95" />
      <path d="M13 38c4.8-8.4 10.7-14.2 19.2-18.6M23 27c.5 4.2.3 7.7-.4 10.6" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".95" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-7 w-7">
      <path d="m24 7 5.1 10.4 11.5 1.7-8.3 8.1 2 11.4L24 33.2l-10.3 5.4 2-11.4-8.3-8.1 11.5-1.7L24 7Z" fill="currentColor" />
    </svg>
  )
}

function RecycleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-7 w-7">
      <path d="M17.5 11.5 22 5l4.4 7h-3.1c5.8 0 10.8 3.2 13.4 8.1l-4.6 2.4c-1.7-3.2-5-5.4-8.8-5.4H18l4.1 5.9-4.4 3-8-11.7 7.8-11.4 4.4 3-4.4 5.6ZM35.4 25.9l7.6 11.5H29.6v-5.2h4.9l-2.2-3.3 3.1-3ZM13.4 26l4.5 2.6-2.2 3.6H22v5.2H6l7.4-11.4Z" fill="currentColor" />
    </svg>
  )
}

function DropIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-7 w-7">
      <path d="M24 5c8.6 11.3 13.1 18.4 13.1 25.1A13.1 13.1 0 1 1 10.9 30C10.9 23.4 15.4 16.2 24 5Z" fill="currentColor" />
    </svg>
  )
}

export function ExperienceSidebar({ points, levelName, levelPercent, completed, weeklyGoal = 5 }: ExperienceSidebarProps) {
  const weeklyCompleted = Math.min(completed, weeklyGoal)
  const weeklyPercent = Math.round((weeklyCompleted / weeklyGoal) * 100)

  return (
    <aside className="grid gap-3 lg:w-[250px] xl:w-[275px]" aria-label="Resumo de gamificação">
      <section className="rounded-[1.35rem] border border-white/10 bg-[#092654]/78 p-4 text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <h2 className="text-sm font-extrabold">Seu progresso</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-cyan-200/20 bg-gradient-to-br from-emerald-400/35 to-cyan-400/20 text-emerald-200 shadow-[0_0_28px_rgba(52,211,153,0.14)]">
            <LeafIcon />
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-base font-black">{levelName}</strong>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 transition-all duration-500" style={{ width: `${levelPercent}%` }} />
            </div>
            <span className="mt-1.5 block text-xs text-cyan-100/75">{points} XP</span>
          </div>
        </div>
      </section>

      <section id="conquistas" className="rounded-[1.35rem] border border-white/10 bg-[#092654]/78 p-4 text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl scroll-mt-24">
        <h2 className="text-sm font-extrabold">Conquistas</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="grid aspect-square place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-teal-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.2)]" title="Consciência verde">
            <LeafIcon />
          </div>
          <div className="grid aspect-square place-items-center rounded-xl bg-gradient-to-br from-indigo-300 to-violet-600 text-white shadow-[0_8px_18px_rgba(99,102,241,0.2)]" title="Primeira conquista">
            <StarIcon />
          </div>
          <div className="grid aspect-square place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-green-600 text-white shadow-[0_8px_18px_rgba(34,197,94,0.2)]" title="Reciclagem">
            <RecycleIcon />
          </div>
          <div className="grid aspect-square place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-blue-600 text-white shadow-[0_8px_18px_rgba(59,130,246,0.2)]" title="Água">
            <DropIcon />
          </div>
        </div>
      </section>

      <section className="rounded-[1.35rem] border border-white/10 bg-[#092654]/78 p-4 text-white shadow-[0_18px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <h2 className="text-sm font-extrabold">Missões semanais</h2>
        <p className="mt-1 text-sm text-cyan-100/80">{weeklyCompleted} de {weeklyGoal} concluídas</p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
          <span className="block h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-500" style={{ width: `${weeklyPercent}%` }} />
        </div>
      </section>
    </aside>
  )
}
