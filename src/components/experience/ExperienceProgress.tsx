import { useState } from 'react'
import type { JourneyAchievement } from '../../types/journey'
import type { JourneyLevel } from '../../utils/storage'
import { BADGE_STYLES } from '../../data/experience'
import { JourneyIcon } from './JourneyIcon'

type ExperienceProgressProps = {
  points: number
  level: JourneyLevel
  levelPercent: number
  completedCount: number
  totalQuests: number
  achievements: JourneyAchievement[]
}

export function ExperienceProgress({
  points,
  level,
  levelPercent,
  completedCount,
  totalQuests,
  achievements,
}: ExperienceProgressProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const badge = achievements.find((item) => item.id === selectedBadge)
  return (
    <aside
      className="
relative z-[3] m-0 flex w-full flex-row flex-wrap gap-2
bg-[linear-gradient(0deg,#0a2551,transparent)] px-3.5 pb-4 pt-1.5 md:flex-nowrap md:px-6
md:pb-6 md:pt-2.5 lg:mt-[46px] lg:w-[188px] lg:flex-col lg:gap-3 lg:bg-none lg:p-0
min-[1101px]:w-[210px]
"
      aria-label="Seu progresso e conquistas"
    >
      <div
        className="
rounded-xl border border-[#c7e1ff29] bg-[linear-gradient(120deg,#102c58d9,#15305bcc)] p-3
backdrop-blur-[16px] lg:rounded-[15px] lg:p-[13px] min-[1101px]:p-[17px]
max-lg:min-w-[130px] max-lg:flex-1
"
      >
        <div
          className="
flex items-center justify-between text-[10px] font-[650] text-[#ecf5ff] lg:text-[11px]
[&>svg]:text-[#a4c7ef] [&>span]:text-[#a4c7ef]
"
        >
          Seu progresso{' '}
          <JourneyIcon
            name="sparkles"
            size={15}
          />
        </div>
        <div
          className="
my-[11px] flex items-center gap-2 lg:mb-3 lg:mt-[15px] lg:gap-[11px]
[&_strong]:text-[12px] [&_strong]:font-[650] lg:[&_strong]:text-[14px] [&_small]:mt-0.5
[&_small]:block [&_small]:text-[8px] [&_small]:text-[#b4cde9] lg:[&_small]:text-[9px]
"
        >
          <span
            className="
grid size-[34px] shrink-0 place-items-center rounded-full border border-[#8ee1d550]
bg-[radial-gradient(circle_at_35%_25%,#579f9d,#154d64)] text-[#9ff3d7]
shadow-[0_0_16px_#6ef7d215] lg:size-11 max-lg:[&_svg]:w-[23px]
"
          >
            <JourneyIcon
              name="leaf"
              size={29}
            />
          </span>
          <div>
            <strong>Nível {level.number}</strong>
            <small>{level.nome}</small>
          </div>
        </div>
        <div
          className="
h-1.5 overflow-hidden rounded-lg bg-[#a6c7f133] [&>span]:block [&>span]:h-full
[&>span]:rounded-[inherit] [&>span]:bg-[linear-gradient(90deg,#399df0,#99e9ff)]
[&>span]:shadow-[0_0_7px_#6cd8ff70] [&>span]:transition-[width] [&>span]:duration-[800ms]
[&>span]:ease-[cubic-bezier(.2,.8,.2,1)]
"
          role="progressbar"
          aria-label="Progresso para o próximo nível"
          aria-valuenow={levelPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${levelPercent}%` }} />
        </div>
        <p
          className="
mt-[9px] text-[8px] leading-[1.6] text-[#b5cdeb] lg:text-[9px] [&_strong]:font-medium
[&_strong]:text-[#e3f4ff]
"
        >
          <strong>{points}</strong>
          {level.number === 4 ? ' XP · Nível máximo' : ' / ' + level.proximo + ' XP'}
        </p>
      </div>
      <div
        className="
rounded-xl border border-[#c7e1ff29] bg-[linear-gradient(120deg,#102c58d9,#15305bcc)] p-3
backdrop-blur-[16px] lg:rounded-[15px] lg:p-[13px] min-[1101px]:p-[17px]
max-lg:min-w-[130px] max-lg:flex-1
"
      >
        <div
          className="
flex items-center justify-between text-[10px] font-[650] text-[#ecf5ff] lg:text-[11px]
[&>svg]:text-[#a4c7ef] [&>span]:text-[#a4c7ef]
"
        >
          Conquistas{' '}
          <span>
            {achievements.filter((item) => item.unlocked).length}/{achievements.length}
          </span>
        </div>
        <div className="mb-[13px] mt-4 flex gap-[7px] lg:mb-0 lg:mt-[13px] min-[1101px]:gap-[9px]">
          {achievements.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`relative grid h-[33px] w-[27px] flex-1 place-items-center rounded-lg border border-[#ffffff45] text-[#ebfff9] opacity-[.55] hover:opacity-100 hover:outline hover:outline-2 hover:outline-[#bbebff] hover:outline-offset-2 aria-pressed:opacity-100 aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-[#bbebff] aria-pressed:outline-offset-2 lg:h-[39px] lg:w-[33px] lg:flex-none lg:rounded-[10px] min-[1101px]:w-9 max-lg:[&>svg]:w-[21px] ${BADGE_STYLES[item.icon]} ${item.unlocked ? '!opacity-100 shadow-[0_0_12px_#77efd322]' : ''}`}
              aria-label={`${item.title}: ${item.unlocked ? 'conquistada' : 'bloqueada'}`}
              aria-pressed={selectedBadge === item.id}
              onClick={() => setSelectedBadge(selectedBadge === item.id ? null : item.id)}
            >
              <JourneyIcon
                name={item.icon}
                size={25}
              />
              {!item.unlocked && (
                <span className="absolute -bottom-[3px] -right-[3px] rounded-full bg-[#243e62] p-[3px] text-[#e5f0ff]">
                  <JourneyIcon
                    name="lock"
                    size={9}
                  />
                </span>
              )}
            </button>
          ))}
        </div>
        <p
          className="
mt-[9px] text-[8px] leading-[1.6] text-[#b5cdeb] lg:text-[9px] [&_strong]:font-medium
[&_strong]:text-[#e3f4ff]
"
          aria-live="polite"
        >
          {badge ? `${badge.title}: ${badge.description}` : 'Cada atitude conta uma história.'}
        </p>
      </div>
      <div
        className="
rounded-xl border border-[#c7e1ff29] bg-[linear-gradient(120deg,#102c58d9,#15305bcc)] p-3
backdrop-blur-[16px] lg:rounded-[15px] lg:p-[13px] min-[1101px]:p-[17px] grid basis-full
grid-cols-2 items-center gap-x-[15px] md:block md:max-lg:flex-1
[&>div:first-child]:col-start-1 [&>div:last-child]:col-start-2
[&>div:last-child]:row-start-1 [&>div:last-child]:row-end-3
"
      >
        <div
          className="
flex items-center justify-between text-[10px] font-[650] text-[#ecf5ff] lg:text-[11px]
[&>svg]:text-[#a4c7ef] [&>span]:text-[#a4c7ef]
"
        >
          Sua jornada{' '}
          <JourneyIcon
            name="target"
            size={16}
          />
        </div>
        <p
          className="
col-start-1 mb-0 mt-1 text-[9px] text-[#b7d1ed] md:my-[17px] lg:my-[11px] lg:text-[10px]
[&_strong]:text-[#f1faff]
"
        >
          <strong>{completedCount}</strong> de {totalQuests} missões concluídas
        </p>
        <div
          className="
h-1.5 overflow-hidden rounded-lg bg-[#a6c7f133] [&>span]:block [&>span]:h-full
[&>span]:rounded-[inherit] [&>span]:bg-[linear-gradient(90deg,#399df0,#99e9ff)]
[&>span]:shadow-[0_0_7px_#6cd8ff70] [&>span]:transition-[width] [&>span]:duration-[800ms]
[&>span]:ease-[cubic-bezier(.2,.8,.2,1)]
[&>span]:!bg-[linear-gradient(90deg,#33bcac,#a3e5bd)]
"
          role="progressbar"
          aria-label="Missões concluídas"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalQuests}
        >
          <span style={{ width: `${(completedCount / totalQuests) * 100}%` }} />
        </div>
      </div>
    </aside>
  )
}
