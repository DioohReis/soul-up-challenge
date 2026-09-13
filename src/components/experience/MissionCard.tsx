import type { JourneyQuest } from '../../types/journey'
import { JourneyIcon } from './JourneyIcon'

type MissionCardProps = {
  quest: JourneyQuest
  index: number
  completed: boolean
  active: boolean
  hasActiveQuest: boolean
  onStart: (questId: string) => void
}

export function MissionCard({
  quest,
  index,
  completed,
  active,
  hasActiveQuest,
  onStart,
}: MissionCardProps) {
  return (
    <article
      className="
group flex items-center gap-2.5 border-b border-[#eaf0f7] py-5 last:border-b-0
last:pb-1.5 lg:gap-3.5 [&_h3]:my-1 [&_h3]:text-[12px] [&_h3]:font-[650]
[&_h3]:leading-[1.5] lg:[&_h3]:text-[13px]
"
      data-complete={completed}
    >
      <span
        className="
grid h-[39px] w-[35px] shrink-0 place-items-center rounded-xl border border-[#e4edf9]
bg-[#f0f5fc] text-[11px] font-[650] text-[#7d9cc6]
group-data-[complete=true]:bg-[#e8f7ef] group-data-[complete=true]:text-[#319e89]
lg:size-[43px] lg:text-[13px]
"
      >
        {completed ? (
          <JourneyIcon
            name="check"
            size={20}
          />
        ) : (
          String(index + 1).padStart(2, '0')
        )}
      </span>
      <div className="min-w-0 flex-1 [&>p]:flex [&>p]:items-center [&>p]:gap-[5px] [&>p]:text-[9px] [&>p]:text-[#8b9bb2]">
        <div
          className="
flex items-center gap-[9px] text-[6px] font-bold tracking-[.08em] text-[#91a1b9]
lg:gap-3.5 lg:text-[7px] [&>span]:whitespace-nowrap [&>span]:text-[9px]
[&>span]:tracking-normal [&>span]:text-[#4a91a4]
"
        >
          {quest.dificuldade === 'facil'
            ? 'PRIMEIRO PASSO'
            : quest.dificuldade === 'medio'
              ? 'UM POUCO MAIS ALÉM'
              : 'NOVO DESAFIO'}
          <span>+{quest.pontos} XP</span>
        </div>
        <h3>{quest.titulo}</h3>
        <p>
          <JourneyIcon
            name="clock"
            size={12}
          />
          {quest.tempo}
        </p>
      </div>
      <button
        type="button"
        className="
grid h-[34px] min-w-[34px] shrink-0 place-items-center rounded-full border
border-[#dce8f8] px-[7px] text-[8px] text-[#527fb9] enabled:hover:border-[#a8c9f2]
enabled:hover:bg-[#e2eeff] disabled:opacity-[.55]
group-data-[complete=true]:border-[#b7e3d2] group-data-[complete=true]:text-[#2c977f]
group-data-[complete=true]:opacity-100
"
        onClick={() => onStart(quest.id)}
        disabled={completed || Boolean(hasActiveQuest)}
        aria-label={
          completed
            ? `${quest.titulo}: concluída`
            : active
              ? `${quest.titulo}: em andamento`
              : `Iniciar missão: ${quest.titulo}`
        }
        title={
          hasActiveQuest && !active && !completed
            ? 'Conclua ou deixe a missão atual para depois'
            : undefined
        }
      >
        {completed ? (
          'Feito'
        ) : active ? (
          'Ativa'
        ) : (
          <JourneyIcon
            name="arrow"
            size={18}
          />
        )}
      </button>
    </article>
  )
}
