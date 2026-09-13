import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import type { NexoState } from '../../types/nexo'
import { STATE_LABELS } from '../../data/experience'
import { JourneyIcon } from './JourneyIcon'

const Nexo3D = lazy(() => import('../nexo3d/Nexo3D').then((module) => ({ default: module.Nexo3D })))

type ExperienceHeroProps = {
  avatarState: NexoState
  paused: boolean
  thinking: boolean
  lastMessage: string
  hasActiveQuest: boolean
  hasRecommendedQuest: boolean
  onStartQuest: () => void
  onInteract: () => void
  onPresenceChange: (present: boolean) => void
  children: ReactNode
}

export function ExperienceHero({
  avatarState,
  paused,
  thinking,
  lastMessage,
  hasActiveQuest,
  hasRecommendedQuest,
  onStartQuest,
  onInteract,
  onPresenceChange,
  children,
}: ExperienceHeroProps) {
  return (
    <section
      className="
relative isolate flex min-h-0 flex-col items-center justify-between overflow-hidden
rounded-[20px]
bg-[radial-gradient(ellipse_at_52%_45%,#609be0_0,#28538c_42%,#0a2855_77%,#061d45_100%)]
text-white shadow-[0_18px_45px_#1b457426,inset_0_0_0_1px_#ffffff20] lg:min-h-[530px]
lg:flex-row lg:rounded-[23px] lg:p-[25px] min-[1101px]:min-h-[552px]
min-[1101px]:p-[38px] after:pointer-events-none after:absolute after:inset-0 after:z-[1]
after:hidden
after:bg-[linear-gradient(90deg,#061e4dea_0,#082653b3_20%,transparent_41%,transparent_67%,#0c2a5640_100%)]
after:content-[''] lg:after:block
"
      aria-label="Seu ambiente com o Nexo"
    >
      <div
        className="
pointer-events-none relative z-[3] w-full
bg-[linear-gradient(180deg,#082752,transparent)] px-[25px] pt-7 md:px-8 md:pt-[30px]
lg:w-1/4 lg:bg-none lg:p-0 min-[1101px]:w-[26%] [&_button]:pointer-events-auto
[&_h2]:mb-[11px] [&_h2]:mt-3.5 [&_h2]:text-[32px] [&_h2]:font-[720] [&_h2]:leading-[1.1]
[&_h2]:tracking-[-1.1px] lg:[&_h2]:mb-[18px] lg:[&_h2]:mt-[21px] lg:[&_h2]:text-[34px]
min-[1101px]:[&_h2]:text-[clamp(32px,3.3vw,45px)] [&_h2_span]:text-[#8fe2ff]
[&_h2_br]:hidden lg:[&_h2_br]:block [&>p]:max-w-[350px] [&>p]:text-[11px]
[&>p]:leading-[1.9] [&>p]:text-[#d0e2fa] md:[&>p]:max-w-[470px] lg:[&>p]:max-w-[244px]
min-[1101px]:[&>p]:text-[12px]
"
      >
        <span
          className="
inline-flex items-center gap-[7px] whitespace-nowrap text-[7px] font-semibold
tracking-[.14em] text-[#a3cff8] lg:text-[8px] [&>span]:size-[5px] [&>span]:rounded-full
[&>span]:bg-[#78deff] [&>span]:shadow-[0_0_8px_#81d7ff]
"
        >
          <span /> SEU PARCEIRO DE EVOLUÇÃO
        </span>
        <h2>
          Vamos evoluir <br />
          juntos<span>?</span>
        </h2>
        <p>
          Pequenas ações fazem uma grande diferença. Complete missões, descubra seu potencial e
          celebre cada passo comigo.
        </p>
        <button
          type="button"
          className="
pointer-events-auto mt-[17px] inline-flex min-h-11 items-center justify-center gap-3
whitespace-nowrap rounded-[24px] border border-white
bg-[linear-gradient(120deg,#fff,#d9efff)] px-[18px] py-3 text-[10px] font-bold
text-[#184689] shadow-[0_0_22px_#85caff30] hover:-translate-y-0.5 hover:bg-white
hover:bg-none hover:shadow-[0_0_26px_#8bd4ff55] lg:mt-7 [&_svg]:box-content
[&_svg]:-mr-[9px] [&_svg]:rounded-full [&_svg]:bg-[#ffffff99] [&_svg]:p-[5px]
"
          onClick={onStartQuest}
        >
          {hasActiveQuest
            ? 'Continuar minha missão'
            : hasRecommendedQuest
              ? 'Começar uma missão'
              : 'Explorar outros temas'}
          <JourneyIcon
            name="arrow"
            size={18}
          />
        </button>
        <div className="mt-6 hidden items-center gap-2 text-[9px] text-[#aac9ed] lg:flex [&_svg]:text-[#99dfd3]">
          <JourneyIcon
            name="leaf"
            size={17}
          />
          <span>No seu ritmo. Pelo nosso planeta.</span>
        </div>
      </div>

      <div className="relative inset-0 z-0 mt-1 h-[425px] w-full md:h-[470px] lg:absolute lg:mt-0 lg:h-auto">
        <Suspense
          fallback={
            <div
              className="grid h-full place-items-center text-[12px] text-[#d5ecff]"
              role="status"
            >
              Preparando seu encontro com o Nexo…
            </div>
          }
        >
          <Nexo3D
            state={avatarState}
            paused={paused}
            className="
journey-avatar h-full focus-visible:rounded-[23px] focus-visible:outline
focus-visible:outline-[3px] focus-visible:outline-[#b5e6ff]
focus-visible:outline-offset-[-6px]
"
            onInteract={onInteract}
            onPresenceChange={onPresenceChange}
          />
        </Suspense>
        <div
          className="
pointer-events-none absolute right-3.5 top-3 z-[4] flex max-h-[120px] w-[184px]
items-start gap-1.5 rounded-[18px_18px_18px_4px] border border-[#ffffffd0]
bg-[linear-gradient(125deg,#f7fcfff5,#dfedffd9)] p-2.5 text-[8px] leading-[1.65]
text-[#264776] shadow-[0_10px_32px_#082d6230] md:right-[12%] md:top-5 md:w-[210px]
md:text-[10px] lg:left-[53%] lg:right-auto lg:top-6 lg:max-h-none lg:w-[205px]
lg:gap-[9px] lg:p-3.5 lg:text-[9px] min-[1101px]:left-[57%] min-[1101px]:w-[225px]
min-[1101px]:text-[10px] after:absolute after:-bottom-3 after:left-[9px]
after:border-[12px_12px_0_0] after:border-transparent after:border-t-[#edf6ffed]
after:content-['']
"
        >
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[#5c8dd6] lg:size-[25px]">
            <JourneyIcon
              name="sparkles"
              size={16}
            />
          </span>
          <p>{thinking ? 'Deixa eu pensar em um próximo passo para você…' : lastMessage}</p>
        </div>
        <div
          className="
absolute bottom-[9px] left-1/2 flex -translate-x-1/2 items-center justify-center
gap-[7px] whitespace-nowrap rounded-[18px] border border-[#c6e8ff30] bg-[#143d7755]
px-[13px] py-1.5 text-[8px] text-[#e3f2ff] backdrop-blur-[8px] lg:bottom-[18px]
lg:text-[9px]
"
        >
          <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#60d2b2] shadow-[0_0_6px_#66dbb945]" />
          <strong>Nexo</strong>
          <span>·</span>
          <span>{STATE_LABELS[avatarState]}</span>
        </div>
      </div>

      {children}
    </section>
  )
}
