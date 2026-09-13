import type { RefObject } from 'react'
import type { JourneyQuest } from '../../types/journey'
import { ecologicalProblems } from '../../data/quests'
import { TOPIC_LABELS } from '../../data/experience'
import { ActiveMissionCard } from './ActiveMissionCard'
import { MissionCard } from './MissionCard'
import { JourneyIcon } from './JourneyIcon'

type ExperienceMissionsProps = {
  missionRef: RefObject<HTMLElement>
  activeProblemId: string
  activeQuest: JourneyQuest | null
  quests: JourneyQuest[]
  completedIds: string[]
  onSelectProblem: (problemId: string) => void
  onStartQuest: (questId: string) => void
  onCompleteQuest: () => void
  onCancelQuest: () => void
}

export function ExperienceMissions({
  missionRef,
  activeProblemId,
  activeQuest,
  quests,
  completedIds,
  onSelectProblem,
  onStartQuest,
  onCompleteQuest,
  onCancelQuest,
}: ExperienceMissionsProps) {
  return (
    <section
      className="
min-w-0 scroll-mt-[90px] rounded-[19px] border border-[#e0e8f3] bg-[#ffffffc7] p-[19px]
shadow-[0_6px_25px_#314c7404] lg:p-[21px] min-[1101px]:p-[26px]
"
      ref={missionRef}
      id="missoes"
      aria-labelledby="missions-title"
    >
      <div
        className="
flex items-center justify-between [&_h2]:mt-1.5 [&_h2]:text-[19px] [&_h2]:font-bold
[&_h2]:tracking-[-.6px] lg:[&_h2]:text-[21px]
"
      >
        <div>
          <p className="text-[9px] font-[750] tracking-[.19em] text-[#537db8]">
            DO PROPÓSITO À AÇÃO
          </p>
          <h2 id="missions-title">Sua próxima boa atitude</h2>
        </div>
        <span className="rounded-[14px] border border-[#d8eee5] bg-[#eaf6f2] p-2.5 text-[#539ca2]">
          <JourneyIcon
            name="leaf"
            size={22}
          />
        </span>
      </div>
      <p className="mt-2 text-[10px] text-[#8191a9] lg:text-[11px]">
        Escolha uma missão. Faça acontecer. Volte para celebrar.
      </p>
      <div
        className="
mb-2 mt-[21px] flex flex-wrap gap-0.5 lg:gap-[5px] [&_button]:min-h-[33px]
[&_button]:rounded-lg [&_button]:border [&_button]:border-transparent [&_button]:px-2
[&_button]:py-[7px] [&_button]:text-[8px] [&_button]:font-semibold
[&_button]:text-[#7186a4] [&_button:hover]:bg-[#eef4fb]
[&_button[aria-pressed=true]]:border-[#d9e7fb] [&_button[aria-pressed=true]]:bg-[#e9f1ff]
[&_button[aria-pressed=true]]:text-[#3368b4] lg:[&_button]:px-2.5
lg:[&_button]:text-[9px]
"
        role="group"
        aria-label="Tema das missões"
      >
        {ecologicalProblems.map((problem) => (
          <button
            type="button"
            key={problem.id}
            aria-pressed={activeProblemId === problem.id}
            onClick={() => onSelectProblem(problem.id)}
          >
            {TOPIC_LABELS[problem.id]}
          </button>
        ))}
      </div>

      {activeQuest && (
        <ActiveMissionCard
          quest={activeQuest}
          onComplete={onCompleteQuest}
          onCancel={onCancelQuest}
        />
      )}

      <div>
        {quests.map((quest, index) => (
          <MissionCard
            key={quest.id}
            quest={quest}
            index={index}
            completed={completedIds.includes(quest.id)}
            active={activeQuest?.id === quest.id}
            hasActiveQuest={Boolean(activeQuest)}
            onStart={onStartQuest}
          />
        ))}
      </div>
    </section>
  )
}
