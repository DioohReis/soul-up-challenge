import type { JourneyQuest } from '../../types/journey'
import { JourneyIcon } from './JourneyIcon'

type ActiveMissionCardProps = {
  quest: JourneyQuest
  onComplete: () => void
  onCancel: () => void
}

export function ActiveMissionCard({ quest, onComplete, onCancel }: ActiveMissionCardProps) {
  return (
    <div
      className="
mt-[18px] rounded-[13px] border border-[#c5ddf5]
bg-[linear-gradient(120deg,#f1f8ff,#f1fbf7)] p-[17px] [&_h3]:mb-1.5 [&_h3]:mt-[11px]
[&_h3]:text-[15px] [&_h3]:font-bold [&>p]:text-[11px] [&>p]:leading-[1.8]
[&>p]:text-[#647e9c] [&>small]:mt-2.5 [&>small]:flex [&>small]:items-center
[&>small]:gap-1.5 [&>small]:text-[10px] [&>small]:text-[#7b95ad]
[&_button:first-child]:px-[13px] [&_button:first-child]:py-2.5
[&_button:first-child]:text-[10px]
"
      aria-live="polite"
    >
      <div
        className="
flex items-center justify-between text-[8px] tracking-[.06em] text-[#4c89ac]
[&>span]:flex [&>span]:items-center [&>span]:gap-1.5
"
      >
        <span>
          <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#60d2b2] shadow-[0_0_6px_#66dbb945]" />{' '}
          MISSÃO EM ANDAMENTO
        </span>
        <strong>+{quest.pontos} XP</strong>
      </div>
      <h3>{quest.titulo}</h3>
      <p>{quest.descricao}</p>
      <small>
        <JourneyIcon
          name="clock"
          size={14}
        />
        {quest.tempo}
      </small>
      <div className="mt-[15px] flex flex-wrap items-center gap-[13px]">
        <button
          type="button"
          className="
inline-flex min-h-11 items-center justify-center gap-3 rounded-[24px] bg-[#2866d0]
px-[18px] py-3 text-[11px] font-bold text-white hover:bg-[#1956bc]
hover:shadow-[0_5px_20px_#1d58b32e]
"
          onClick={() => onComplete()}
        >
          <JourneyIcon
            name="check"
            size={17}
          />
          Já fiz! Concluir missão
        </button>
        <button
          type="button"
          className="min-h-9 text-[10px] text-[#6a85a3]"
          onClick={onCancel}
        >
          Deixar para depois
        </button>
      </div>
      <p className="mt-[11px] !text-[9px] !text-[#879ab0]">
        Conclua depois de realizar a ação. Cada passo real importa.
      </p>
    </div>
  )
}
