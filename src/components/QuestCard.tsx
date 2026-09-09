import type { Quest } from '../types'

type QuestCardProps = {
  quest: Quest
  questId: string
  completed: boolean
  onComplete: (questId: string, points: number) => void
}

const difficultyLabel = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

const difficultyClass = {
  facil: 'border-emerald-300/25 bg-emerald-300/5',
  medio: 'border-cyan-300/25 bg-cyan-300/5',
  dificil: 'border-amber-300/25 bg-amber-300/5',
}

export function QuestCard({ quest, questId, completed, onComplete }: QuestCardProps) {
  return (
    <article className={`flex h-full flex-col rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-200/50 ${difficultyClass[quest.dificuldade]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/70">
          {difficultyLabel[quest.dificuldade]}
        </span>
        <strong className="text-sm text-emerald-200">{quest.pontos} pts</strong>
      </div>
      <h3 className="mt-5 text-xl font-black text-white">{quest.titulo}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-white/65">{quest.descricao}</p>
      <small className="mt-4 text-white/45">Tempo estimado: {quest.tempo}</small>
      <button
        type="button"
        disabled={completed}
        onClick={() => onComplete(questId, quest.pontos)}
        className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-extrabold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:border-emerald-300/20 disabled:bg-emerald-300/10 disabled:text-emerald-200"
      >
        {completed ? 'Quest concluída' : 'Concluir quest'}
      </button>
    </article>
  )
}
