import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { JourneyIcon } from '../components/experience/JourneyIcon'
import { useNexoJourney } from '../hooks/useNexoJourney'
import { ecologicalProblems } from '../data/quests'
import type { JourneyAchievement } from '../data/nexoJourney'

const Nexo3D = lazy(() =>
  import('../components/nexo3d/Nexo3D').then((module) => ({
    default: module.Nexo3D,
  }))
)

const TOPIC_LABELS: Record<string, string> = {
  clima: 'Energia e clima',
  residuos: 'Reciclagem',
  agua: 'Água',
  biodiversidade: 'Natureza',
  poluicao: 'Vida urbana',
}

const STATE_LABELS = {
  idle: 'Pronto para ajudar',
  looking: 'Aqui com você',
  listening: 'Pode falar comigo',
  thinking: 'Pensando com carinho',
  talking: 'Uma ideia para você',
  happy: 'Feliz em te ver',
  celebrating: 'Você fez a diferença!',
  sleeping: 'Recarregando as energias',
}

const BADGE_STYLES: Record<JourneyAchievement['icon'], string> = {
  leaf: 'bg-[linear-gradient(135deg,#64c5b3,#258679)]',
  star: 'bg-[linear-gradient(135deg,#9294ec,#5158bd)]',
  recycle: 'bg-[linear-gradient(135deg,#62baa6,#248877)]',
  drop: 'bg-[linear-gradient(135deg,#66b2e9,#3669c1)]',
}

type NexoMessageForm = { message: string }

export function Experiencia() {
  const journey = useNexoJourney()
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<NexoMessageForm>({
    defaultValues: { message: '' },
    mode: 'onTouched',
  })
  const [paused, setPaused] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLElement>(null)
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    const transcript = transcriptRef.current
    if (transcript) transcript.scrollTop = transcript.scrollHeight
  }, [journey.messages, journey.thinking])

  useEffect(() => {
    if (!voiceEnabled || !canSpeak || journey.thinking) return
    window.speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(journey.lastMessage)
    speech.lang = 'pt-BR'
    speech.rate = 0.95
    window.speechSynthesis.speak(speech)
    return () => window.speechSynthesis.cancel()
  }, [journey.lastMessage, journey.thinking, voiceEnabled, canSpeak])

  function revealMissions() {
    missionRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    })
  }

  function submitMessage({ message }: NexoMessageForm) {
    if (journey.sendMessage(message)) reset()
  }

  const badge = journey.achievements.find((item) => item.id === selectedBadge)

  return (
    <main className="text-[#16305b] [background:radial-gradient(ellipse_at_18%_0,#e9f2ff,transparent_40%),#f5f8fd] font-['Segoe_UI',sans-serif] [&_button]:transition-[background,border-color,box-shadow,transform] [&_button]:duration-200 [&_button:disabled]:cursor-default [&_button:focus-visible]:outline [&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-[#2b9fe8] [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline [&_input:focus-visible]:outline-[3px] [&_input:focus-visible]:outline-[#2b9fe8] [&_input:focus-visible]:outline-offset-4 motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!scroll-auto motion-reduce:[&_*::before]:!animate-none motion-reduce:[&_*::before]:!transition-none motion-reduce:[&_*::after]:!animate-none motion-reduce:[&_*::after]:!transition-none">
      <div className="mx-auto max-w-[1344px] px-4 pt-6 md:px-6 md:pt-7 min-[1101px]:px-10 min-[1101px]:pt-10">
        <div className="mb-[23px] flex items-center justify-between gap-[30px] lg:mb-[29px] [&_h1]:my-[9px] [&_h1]:text-[25px] [&_h1]:font-[750] [&_h1]:leading-[1.25] [&_h1]:tracking-[-.8px] lg:[&_h1]:text-[clamp(25px,2.5vw,34px)] lg:[&_h1]:tracking-[-1px] [&_h1_span]:block [&_h1_span]:text-[#3b70b8] md:[&_h1_span]:inline [&>div>p:last-child]:mt-3 [&>div>p:last-child]:max-w-[350px] [&>div>p:last-child]:text-[11px] [&>div>p:last-child]:leading-[1.8] [&>div>p:last-child]:text-[#77869e] md:[&>div>p:last-child]:max-w-none lg:[&>div>p:last-child]:mt-0 lg:[&>div>p:last-child]:text-[12px]">
          <div>
            <p className="text-[9px] font-[750] tracking-[.19em] text-[#537db8]">
              SUA JORNADA TEM COMPANHIA
            </p>
            <h1>
              Um pequeno passo. <span>Um futuro melhor.</span>
            </h1>
            <p>
              Conheça o Nexo, seu parceiro para transformar boas intenções em
              novas conquistas.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2.5 text-[12px] font-[650] min-[1101px]:flex [&>span]:grid [&>span]:size-[39px] [&>span]:place-items-center [&>span]:rounded-full [&>span]:border-[3px] [&>span]:border-white [&>span]:bg-[#dfebfc] [&>span]:text-[#4779bf] [&_small]:mt-[3px] [&_small]:block [&_small]:text-[10px] [&_small]:font-normal [&_small]:text-[#8392a8]">
            <span>{journey.userName.slice(0, 1).toUpperCase()}</span>
            <div>
              Olá, {journey.userName}
              <small>Vamos fazer a diferença hoje?</small>
            </div>
          </div>
        </div>

        <section
          className="relative isolate flex min-h-0 flex-col items-center justify-between overflow-hidden rounded-[20px] bg-[radial-gradient(ellipse_at_52%_45%,#609be0_0,#28538c_42%,#0a2855_77%,#061d45_100%)] text-white shadow-[0_18px_45px_#1b457426,inset_0_0_0_1px_#ffffff20] lg:min-h-[530px] lg:flex-row lg:rounded-[23px] lg:p-[25px] min-[1101px]:min-h-[552px] min-[1101px]:p-[38px] after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:hidden after:bg-[linear-gradient(90deg,#061e4dea_0,#082653b3_20%,transparent_41%,transparent_67%,#0c2a5640_100%)] after:content-[''] lg:after:block"
          aria-label="Seu ambiente com o Nexo"
        >
          <div className="pointer-events-none relative z-[3] w-full bg-[linear-gradient(180deg,#082752,transparent)] px-[25px] pt-7 md:px-8 md:pt-[30px] lg:w-1/4 lg:bg-none lg:p-0 min-[1101px]:w-[26%] [&_button]:pointer-events-auto [&_h2]:mb-[11px] [&_h2]:mt-3.5 [&_h2]:text-[32px] [&_h2]:font-[720] [&_h2]:leading-[1.1] [&_h2]:tracking-[-1.1px] lg:[&_h2]:mb-[18px] lg:[&_h2]:mt-[21px] lg:[&_h2]:text-[34px] min-[1101px]:[&_h2]:text-[clamp(32px,3.3vw,45px)] [&_h2_span]:text-[#8fe2ff] [&_h2_br]:hidden lg:[&_h2_br]:block [&>p]:max-w-[350px] [&>p]:text-[11px] [&>p]:leading-[1.9] [&>p]:text-[#d0e2fa] md:[&>p]:max-w-[470px] lg:[&>p]:max-w-[244px] min-[1101px]:[&>p]:text-[12px]">
            <span className="inline-flex items-center gap-[7px] whitespace-nowrap text-[7px] font-semibold tracking-[.14em] text-[#a3cff8] lg:text-[8px] [&>span]:size-[5px] [&>span]:rounded-full [&>span]:bg-[#78deff] [&>span]:shadow-[0_0_8px_#81d7ff]">
              <span /> SEU PARCEIRO DE EVOLUÇÃO
            </span>
            <h2>
              Vamos evoluir <br />
              juntos<span>?</span>
            </h2>
            <p>
              Pequenas ações fazem uma grande diferença. Complete missões,
              descubra seu potencial e celebre cada passo comigo.
            </p>
            <button
              className="pointer-events-auto mt-[17px] inline-flex min-h-11 items-center justify-center gap-3 whitespace-nowrap rounded-[24px] border border-white bg-[linear-gradient(120deg,#fff,#d9efff)] px-[18px] py-3 text-[10px] font-bold text-[#184689] shadow-[0_0_22px_#85caff30] hover:-translate-y-0.5 hover:bg-white hover:bg-none hover:shadow-[0_0_26px_#8bd4ff55] lg:mt-7 [&_svg]:box-content [&_svg]:-mr-[9px] [&_svg]:rounded-full [&_svg]:bg-[#ffffff99] [&_svg]:p-[5px]"
              onClick={() => {
                if (!journey.activeQuest) journey.startQuest()
                revealMissions()
              }}
            >
              {journey.activeQuest
                ? 'Continuar minha missão'
                : journey.recommendedQuest
                ? 'Começar uma missão'
                : 'Explorar outros temas'}
              <JourneyIcon name="arrow" size={18} />
            </button>
            <div className="mt-6 hidden items-center gap-2 text-[9px] text-[#aac9ed] lg:flex [&_svg]:text-[#99dfd3]">
              <JourneyIcon name="leaf" size={17} />
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
                state={journey.avatarState}
                paused={paused}
                className="journey-avatar h-full focus-visible:rounded-[23px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#b5e6ff] focus-visible:outline-offset-[-6px]"
                onInteract={() => journey.reactToAvatar('wave')}
                onPresenceChange={journey.handlePresence}
              />
            </Suspense>
            <div className="pointer-events-none absolute right-3.5 top-3 z-[4] flex max-h-[120px] w-[184px] items-start gap-1.5 rounded-[18px_18px_18px_4px] border border-[#ffffffd0] bg-[linear-gradient(125deg,#f7fcfff5,#dfedffd9)] p-2.5 text-[8px] leading-[1.65] text-[#264776] shadow-[0_10px_32px_#082d6230] md:right-[12%] md:top-5 md:w-[210px] md:text-[10px] lg:left-[53%] lg:right-auto lg:top-6 lg:max-h-none lg:w-[205px] lg:gap-[9px] lg:p-3.5 lg:text-[9px] min-[1101px]:left-[57%] min-[1101px]:w-[225px] min-[1101px]:text-[10px] after:absolute after:-bottom-3 after:left-[9px] after:border-[12px_12px_0_0] after:border-transparent after:border-t-[#edf6ffed] after:content-['']">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[#5c8dd6] lg:size-[25px]">
                <JourneyIcon name="sparkles" size={16} />
              </span>
              <p>
                {journey.thinking
                  ? 'Deixa eu pensar em um próximo passo para você…'
                  : journey.lastMessage}
              </p>
            </div>
            <div className="absolute bottom-[9px] left-1/2 flex -translate-x-1/2 items-center justify-center gap-[7px] whitespace-nowrap rounded-[18px] border border-[#c6e8ff30] bg-[#143d7755] px-[13px] py-1.5 text-[8px] text-[#e3f2ff] backdrop-blur-[8px] lg:bottom-[18px] lg:text-[9px]">
              <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#60d2b2] shadow-[0_0_6px_#66dbb945]" />
              <strong>Nexo</strong>
              <span>·</span>
              <span>{STATE_LABELS[journey.avatarState]}</span>
            </div>
          </div>

          <aside
            className="relative z-[3] m-0 flex w-full flex-row flex-wrap gap-2 bg-[linear-gradient(0deg,#0a2551,transparent)] px-3.5 pb-4 pt-1.5 md:flex-nowrap md:px-6 md:pb-6 md:pt-2.5 lg:mt-[46px] lg:w-[188px] lg:flex-col lg:gap-3 lg:bg-none lg:p-0 min-[1101px]:w-[210px]"
            aria-label="Seu progresso e conquistas"
          >
            <div className="rounded-xl border border-[#c7e1ff29] bg-[linear-gradient(120deg,#102c58d9,#15305bcc)] p-3 backdrop-blur-[16px] lg:rounded-[15px] lg:p-[13px] min-[1101px]:p-[17px] max-lg:min-w-[130px] max-lg:flex-1">
              <div className="flex items-center justify-between text-[10px] font-[650] text-[#ecf5ff] lg:text-[11px] [&>svg]:text-[#a4c7ef] [&>span]:text-[#a4c7ef]">
                Seu progresso <JourneyIcon name="sparkles" size={15} />
              </div>
              <div className="my-[11px] flex items-center gap-2 lg:mb-3 lg:mt-[15px] lg:gap-[11px] [&_strong]:text-[12px] [&_strong]:font-[650] lg:[&_strong]:text-[14px] [&_small]:mt-0.5 [&_small]:block [&_small]:text-[8px] [&_small]:text-[#b4cde9] lg:[&_small]:text-[9px]">
                <span className="grid size-[34px] shrink-0 place-items-center rounded-full border border-[#8ee1d550] bg-[radial-gradient(circle_at_35%_25%,#579f9d,#154d64)] text-[#9ff3d7] shadow-[0_0_16px_#6ef7d215] lg:size-11 max-lg:[&_svg]:w-[23px]">
                  <JourneyIcon name="leaf" size={29} />
                </span>
                <div>
                  <strong>Nível {journey.levelNumber}</strong>
                  <small>{journey.level.nome}</small>
                </div>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-lg bg-[#a6c7f133] [&>span]:block [&>span]:h-full [&>span]:rounded-[inherit] [&>span]:bg-[linear-gradient(90deg,#399df0,#99e9ff)] [&>span]:shadow-[0_0_7px_#6cd8ff70] [&>span]:transition-[width] [&>span]:duration-[800ms] [&>span]:ease-[cubic-bezier(.2,.8,.2,1)]"
                role="progressbar"
                aria-label="Progresso para o próximo nível"
                aria-valuenow={journey.levelPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${journey.levelPercent}%` }} />
              </div>
              <p className="mt-[9px] text-[8px] leading-[1.6] text-[#b5cdeb] lg:text-[9px] [&_strong]:font-medium [&_strong]:text-[#e3f4ff]">
                <strong>{journey.points}</strong>
                {journey.levelNumber === 4
                  ? ' XP · Nível máximo'
                  : ' / ' + journey.level.proximo + ' XP'}
              </p>
            </div>
            <div className="rounded-xl border border-[#c7e1ff29] bg-[linear-gradient(120deg,#102c58d9,#15305bcc)] p-3 backdrop-blur-[16px] lg:rounded-[15px] lg:p-[13px] min-[1101px]:p-[17px] max-lg:min-w-[130px] max-lg:flex-1">
              <div className="flex items-center justify-between text-[10px] font-[650] text-[#ecf5ff] lg:text-[11px] [&>svg]:text-[#a4c7ef] [&>span]:text-[#a4c7ef]">
                Conquistas{' '}
                <span>
                  {journey.achievements.filter((item) => item.unlocked).length}/
                  {journey.achievements.length}
                </span>
              </div>
              <div className="mb-[13px] mt-4 flex gap-[7px] lg:mb-0 lg:mt-[13px] min-[1101px]:gap-[9px]">
                {journey.achievements.map((item) => (
                  <button
                    key={item.id}
                    className={`relative grid h-[33px] w-[27px] flex-1 place-items-center rounded-lg border border-[#ffffff45] text-[#ebfff9] opacity-[.55] hover:opacity-100 hover:outline hover:outline-2 hover:outline-[#bbebff] hover:outline-offset-2 aria-pressed:opacity-100 aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-[#bbebff] aria-pressed:outline-offset-2 lg:h-[39px] lg:w-[33px] lg:flex-none lg:rounded-[10px] min-[1101px]:w-9 max-lg:[&>svg]:w-[21px] ${
                      BADGE_STYLES[item.icon]
                    } ${
                      item.unlocked
                        ? '!opacity-100 shadow-[0_0_12px_#77efd322]'
                        : ''
                    }`}
                    aria-label={`${item.title}: ${
                      item.unlocked ? 'conquistada' : 'bloqueada'
                    }`}
                    aria-pressed={selectedBadge === item.id}
                    onClick={() =>
                      setSelectedBadge(
                        selectedBadge === item.id ? null : item.id
                      )
                    }
                  >
                    <JourneyIcon name={item.icon} size={25} />
                    {!item.unlocked && (
                      <span className="absolute -bottom-[3px] -right-[3px] rounded-full bg-[#243e62] p-[3px] text-[#e5f0ff]">
                        <JourneyIcon name="lock" size={9} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p
                className="mt-[9px] text-[8px] leading-[1.6] text-[#b5cdeb] lg:text-[9px] [&_strong]:font-medium [&_strong]:text-[#e3f4ff]"
                aria-live="polite"
              >
                {badge
                  ? `${badge.title}: ${badge.description}`
                  : 'Cada atitude conta uma história.'}
              </p>
            </div>
            <div className="rounded-xl border border-[#c7e1ff29] bg-[linear-gradient(120deg,#102c58d9,#15305bcc)] p-3 backdrop-blur-[16px] lg:rounded-[15px] lg:p-[13px] min-[1101px]:p-[17px] grid basis-full grid-cols-2 items-center gap-x-[15px] md:block md:max-lg:flex-1 [&>div:first-child]:col-start-1 [&>div:last-child]:col-start-2 [&>div:last-child]:row-start-1 [&>div:last-child]:row-end-3">
              <div className="flex items-center justify-between text-[10px] font-[650] text-[#ecf5ff] lg:text-[11px] [&>svg]:text-[#a4c7ef] [&>span]:text-[#a4c7ef]">
                Sua jornada <JourneyIcon name="target" size={16} />
              </div>
              <p className="col-start-1 mb-0 mt-1 text-[9px] text-[#b7d1ed] md:my-[17px] lg:my-[11px] lg:text-[10px] [&_strong]:text-[#f1faff]">
                <strong>{journey.completedCount}</strong> de{' '}
                {journey.questCatalog.length} missões concluídas
              </p>
              <div
                className="h-1.5 overflow-hidden rounded-lg bg-[#a6c7f133] [&>span]:block [&>span]:h-full [&>span]:rounded-[inherit] [&>span]:bg-[linear-gradient(90deg,#399df0,#99e9ff)] [&>span]:shadow-[0_0_7px_#6cd8ff70] [&>span]:transition-[width] [&>span]:duration-[800ms] [&>span]:ease-[cubic-bezier(.2,.8,.2,1)] [&>span]:!bg-[linear-gradient(90deg,#33bcac,#a3e5bd)]"
                role="progressbar"
                aria-label="Missões concluídas"
                aria-valuenow={journey.completedCount}
                aria-valuemin={0}
                aria-valuemax={journey.questCatalog.length}
              >
                <span
                  style={{
                    width: `${
                      (journey.completedCount / journey.questCatalog.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </aside>
        </section>

        <div className="mx-0 flex flex-wrap items-center justify-between gap-2.5 border-b border-[#dfe8f4] px-0 py-[13px] lg:mx-[15px] lg:flex-nowrap lg:gap-[15px] lg:px-2.5 lg:py-4 [&>p]:flex [&>p]:flex-1 [&>p]:items-center [&>p]:gap-[7px] [&>p]:text-[9px] [&>p]:leading-[1.5] [&>p]:text-[#7a8ca8] lg:[&>p]:max-w-[170px] lg:[&>p]:flex-initial lg:[&>p]:text-[10px] min-[1101px]:[&>p]:max-w-none min-[1101px]:[&>p]:leading-normal">
          <p>
            <span className="text-xl text-[#6c90c1]">↖</span> Toque no Nexo e
            veja o que acontece
          </p>
          <div className="order-3 flex w-full justify-center gap-2 md:order-none md:w-auto lg:gap-2.5 [&_button]:flex [&_button]:min-h-[38px] [&_button]:flex-1 [&_button]:items-center [&_button]:justify-center [&_button]:gap-[7px] [&_button]:rounded-[20px] [&_button]:border [&_button]:border-[#e0e8f5] [&_button]:bg-white [&_button]:p-2 [&_button]:text-[9px] [&_button]:font-semibold [&_button]:text-[#46658d] [&_button:hover]:border-[#b2ccee] [&_button:hover]:bg-[#eaf3ff] lg:[&_button]:flex-initial lg:[&_button]:px-3.5 lg:[&_button]:text-[10px] [&_svg]:text-[#5d8dcf]">
            <button onClick={() => journey.reactToAvatar('wave')}>
              <JourneyIcon name="wave" size={17} />
              Dar um oi
            </button>
            <button onClick={() => journey.sendMessage('Preciso de um incentivo')}>
              <JourneyIcon name="sparkles" size={17} />
              Me inspire
            </button>
            <button
              onClick={() => {
                setFocus('message')
                journey.reactToAvatar('listen')
              }}
            >
              <JourneyIcon name="chat" size={17} />
              Conversar
            </button>
          </div>
          <div className="flex gap-1.5 [&_button]:grid [&_button]:size-8 [&_button]:place-items-center [&_button]:rounded-full [&_button]:border [&_button]:border-[#dce7f4] [&_button]:text-[#7890af] [&_button[aria-pressed=true]]:bg-[#dcecff] [&_button[aria-pressed=true]]:text-[#245db8] lg:[&_button]:size-9">
            {canSpeak && (
              <button
                aria-label={
                  voiceEnabled
                    ? 'Desativar voz do Nexo'
                    : 'Ouvir a voz do Nexo'
                }
                title={voiceEnabled ? 'Desativar voz' : 'Ouvir o Nexo'}
                aria-pressed={voiceEnabled}
                onClick={() => setVoiceEnabled((value) => !value)}
              >
                <JourneyIcon
                  name={voiceEnabled ? 'volume' : 'mute'}
                  size={18}
                />
              </button>
            )}
            <button
              aria-label={paused ? 'Retomar animações' : 'Pausar animações'}
              title={paused ? 'Retomar animações' : 'Pausar animações'}
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              <JourneyIcon name={paused ? 'play' : 'pause'} size={18} />
            </button>
          </div>
        </div>

        {!journey.persistenceAvailable && (
          <p className="p-[13px] text-[12px] text-[#547193]" role="status">
            O armazenamento está indisponível. Seu progresso fica disponível
            enquanto esta página estiver aberta.
          </p>
        )}

        <div className="mt-[22px] grid grid-cols-1 items-start gap-[18px] md:grid-cols-[1.1fr_1fr] lg:mt-8 lg:grid-cols-[1.25fr_1fr] min-[1101px]:gap-[26px]">
          <section
            className="min-w-0 scroll-mt-[90px] rounded-[19px] border border-[#e0e8f3] bg-[#ffffffc7] p-[19px] shadow-[0_6px_25px_#314c7404] lg:p-[21px] min-[1101px]:p-[26px]"
            ref={missionRef}
            id="missoes"
            aria-labelledby="missions-title"
          >
            <div className="flex items-center justify-between [&_h2]:mt-1.5 [&_h2]:text-[19px] [&_h2]:font-bold [&_h2]:tracking-[-.6px] lg:[&_h2]:text-[21px]">
              <div>
                <p className="text-[9px] font-[750] tracking-[.19em] text-[#537db8]">
                  DO PROPÓSITO À AÇÃO
                </p>
                <h2 id="missions-title">Sua próxima boa atitude</h2>
              </div>
              <span className="rounded-[14px] border border-[#d8eee5] bg-[#eaf6f2] p-2.5 text-[#539ca2]">
                <JourneyIcon name="leaf" size={22} />
              </span>
            </div>
            <p className="mt-2 text-[10px] text-[#8191a9] lg:text-[11px]">
              Escolha uma missão. Faça acontecer. Volte para celebrar.
            </p>
            <div
              className="mb-2 mt-[21px] flex flex-wrap gap-0.5 lg:gap-[5px] [&_button]:min-h-[33px] [&_button]:rounded-lg [&_button]:border [&_button]:border-transparent [&_button]:px-2 [&_button]:py-[7px] [&_button]:text-[8px] [&_button]:font-semibold [&_button]:text-[#7186a4] [&_button:hover]:bg-[#eef4fb] [&_button[aria-pressed=true]]:border-[#d9e7fb] [&_button[aria-pressed=true]]:bg-[#e9f1ff] [&_button[aria-pressed=true]]:text-[#3368b4] lg:[&_button]:px-2.5 lg:[&_button]:text-[9px]"
              role="group"
              aria-label="Tema das missões"
            >
              {ecologicalProblems.map((problem) => (
                <button
                  key={problem.id}
                  aria-pressed={journey.activeProblemId === problem.id}
                  onClick={() => journey.setActiveProblemId(problem.id)}
                >
                  {TOPIC_LABELS[problem.id]}
                </button>
              ))}
            </div>

            {journey.activeQuest && (
              <div
                className="mt-[18px] rounded-[13px] border border-[#c5ddf5] bg-[linear-gradient(120deg,#f1f8ff,#f1fbf7)] p-[17px] [&_h3]:mb-1.5 [&_h3]:mt-[11px] [&_h3]:text-[15px] [&_h3]:font-bold [&>p]:text-[11px] [&>p]:leading-[1.8] [&>p]:text-[#647e9c] [&>small]:mt-2.5 [&>small]:flex [&>small]:items-center [&>small]:gap-1.5 [&>small]:text-[10px] [&>small]:text-[#7b95ad] [&_button:first-child]:px-[13px] [&_button:first-child]:py-2.5 [&_button:first-child]:text-[10px]"
                aria-live="polite"
              >
                <div className="flex items-center justify-between text-[8px] tracking-[.06em] text-[#4c89ac] [&>span]:flex [&>span]:items-center [&>span]:gap-1.5">
                  <span>
                    <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#60d2b2] shadow-[0_0_6px_#66dbb945]" />{' '}
                    MISSÃO EM ANDAMENTO
                  </span>
                  <strong>+{journey.activeQuest.pontos} XP</strong>
                </div>
                <h3>{journey.activeQuest.titulo}</h3>
                <p>{journey.activeQuest.descricao}</p>
                <small>
                  <JourneyIcon name="clock" size={14} />
                  {journey.activeQuest.tempo}
                </small>
                <div className="mt-[15px] flex flex-wrap items-center gap-[13px]">
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-3 rounded-[24px] bg-[#2866d0] px-[18px] py-3 text-[11px] font-bold text-white hover:bg-[#1956bc] hover:shadow-[0_5px_20px_#1d58b32e]"
                    onClick={() => journey.completeActiveQuest()}
                  >
                    <JourneyIcon name="check" size={17} />
                    Já fiz! Concluir missão
                  </button>
                  <button
                    className="min-h-9 text-[10px] text-[#6a85a3]"
                    onClick={journey.cancelActiveQuest}
                  >
                    Deixar para depois
                  </button>
                </div>
                <p className="mt-[11px] !text-[9px] !text-[#879ab0]">
                  Conclua depois de realizar a ação. Cada passo real importa.
                </p>
              </div>
            )}

            <div>
              {journey.quests.map((quest, index) => {
                const completed = journey.completedIds.includes(quest.id)
                const active = journey.activeQuest?.id === quest.id
                return (
                  <article
                    className="group flex items-center gap-2.5 border-b border-[#eaf0f7] py-5 last:border-b-0 last:pb-1.5 lg:gap-3.5 [&_h3]:my-1 [&_h3]:text-[12px] [&_h3]:font-[650] [&_h3]:leading-[1.5] lg:[&_h3]:text-[13px]"
                    data-complete={completed}
                    key={quest.id}
                  >
                    <span className="grid h-[39px] w-[35px] shrink-0 place-items-center rounded-xl border border-[#e4edf9] bg-[#f0f5fc] text-[11px] font-[650] text-[#7d9cc6] group-data-[complete=true]:bg-[#e8f7ef] group-data-[complete=true]:text-[#319e89] lg:size-[43px] lg:text-[13px]">
                      {completed ? (
                        <JourneyIcon name="check" size={20} />
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>
                    <div className="min-w-0 flex-1 [&>p]:flex [&>p]:items-center [&>p]:gap-[5px] [&>p]:text-[9px] [&>p]:text-[#8b9bb2]">
                      <div className="flex items-center gap-[9px] text-[6px] font-bold tracking-[.08em] text-[#91a1b9] lg:gap-3.5 lg:text-[7px] [&>span]:whitespace-nowrap [&>span]:text-[9px] [&>span]:tracking-normal [&>span]:text-[#4a91a4]">
                        {quest.dificuldade === 'facil'
                          ? 'PRIMEIRO PASSO'
                          : quest.dificuldade === 'medio'
                          ? 'UM POUCO MAIS ALÉM'
                          : 'NOVO DESAFIO'}
                        <span>+{quest.pontos} XP</span>
                      </div>
                      <h3>{quest.titulo}</h3>
                      <p>
                        <JourneyIcon name="clock" size={12} />
                        {quest.tempo}
                      </p>
                    </div>
                    <button
                      className="grid h-[34px] min-w-[34px] shrink-0 place-items-center rounded-full border border-[#dce8f8] px-[7px] text-[8px] text-[#527fb9] enabled:hover:border-[#a8c9f2] enabled:hover:bg-[#e2eeff] disabled:opacity-[.55] group-data-[complete=true]:border-[#b7e3d2] group-data-[complete=true]:text-[#2c977f] group-data-[complete=true]:opacity-100"
                      onClick={() => journey.startQuest(quest.id)}
                      disabled={completed || Boolean(journey.activeQuest)}
                      aria-label={
                        completed
                          ? `${quest.titulo}: concluída`
                          : active
                          ? `${quest.titulo}: em andamento`
                          : `Iniciar missão: ${quest.titulo}`
                      }
                      title={
                        journey.activeQuest && !active && !completed
                          ? 'Conclua ou deixe a missão atual para depois'
                          : undefined
                      }
                    >
                      {completed ? (
                        'Feito'
                      ) : active ? (
                        'Ativa'
                      ) : (
                        <JourneyIcon name="arrow" size={18} />
                      )}
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            className="min-w-0 rounded-[19px] border border-[#e0e8f3] bg-[#ffffffc7] p-[19px] shadow-[0_6px_25px_#314c7404] lg:p-[21px]"
            aria-labelledby="conversation-title"
          >
            <div className="flex items-center gap-3 border-b border-[#e9eff7] pb-[17px] [&>svg]:ml-auto [&>svg]:text-[#9bafcb] [&_h2]:text-[15px] [&_h2]:font-[650] [&_p]:mt-[3px] [&_p]:flex [&_p]:items-center [&_p]:gap-[5px] [&_p]:text-[9px] [&_p]:text-[#8295ae]">
              <span
                className="relative flex h-[38px] w-[43px] rotate-[-5deg] items-center justify-center gap-[13px] rounded-[17px] border-[6px] border-[#e8f0fb] bg-[#102950] shadow-[0_3px_8px_#14376718] after:absolute after:h-px after:w-[17px] after:bg-[#55c7ff] after:content-[''] [&_i]:z-[1] [&_i]:h-[7px] [&_i]:w-1.5 [&_i]:rounded-full [&_i]:bg-[#73ddff] [&_i]:shadow-[0_0_6px_#36d5ff]"
                aria-hidden="true"
              >
                <i />
                <i />
              </span>
              <div>
                <h2 id="conversation-title">Um papo com o Nexo</h2>
                <p>
                  <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#60d2b2] shadow-[0_0_6px_#66dbb945]" />{' '}
                  Seu parceiro está por aqui
                </p>
              </div>
              <JourneyIcon name="chat" size={20} />
            </div>
            <div
              className="h-[245px] overflow-y-auto overscroll-contain px-[3px] pt-3.5 [scrollbar-color:#cdddee_transparent] [scrollbar-width:thin] lg:h-[218px]"
              ref={transcriptRef}
              role="log"
              aria-label="Mensagens da conversa"
              aria-live="polite"
              aria-relevant="additions"
            >
              <div className="mb-4 text-center text-[7px] font-semibold tracking-[.13em] text-[#a0b0c5]">
                JUNTOS, UM PASSO DE CADA VEZ
              </div>
              {journey.messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2.5 max-w-[91%] border px-3.5 py-3 [&>span]:mb-1 [&>span]:block [&>span]:text-[8px] [&>span]:font-bold [&>p]:text-[11px] [&>p]:leading-[1.8] [&>p]:[overflow-wrap:anywhere] ${
                    message.role === 'user'
                      ? 'ml-auto rounded-[12px_12px_3px_12px] border-[#2866ce] bg-[#2866ce] [&>span]:text-[#cbdffb] [&>p]:text-white'
                      : 'rounded-[12px_12px_12px_3px] border-[#e4ecf8] bg-[#f0f5fc] [&>span]:text-[#688bc0] [&>p]:text-[#566e91]'
                  }`}
                >
                  <span>{message.role === 'user' ? 'Você' : 'Nexo'}</span>
                  <p>{message.text}</p>
                </div>
              ))}
              {journey.thinking && (
                <div
                  className="flex gap-1 p-3.5 [&_i]:size-[5px] [&_i]:animate-nexo-chat-pulse [&_i]:rounded-full [&_i]:bg-[#769dd2] [&_i:nth-child(2)]:[animation-delay:.15s] [&_i:nth-child(3)]:[animation-delay:.3s]"
                  role="status"
                >
                  <i />
                  <i />
                  <i />
                  <span className="sr-only">Nexo está preparando uma resposta</span>
                </div>
              )}
            </div>
            <div className="mt-3.5 flex flex-wrap gap-[5px] [&_button]:flex [&_button]:min-h-9 [&_button]:items-center [&_button]:gap-[5px] [&_button]:rounded-[7px] [&_button]:border [&_button]:border-[#dfe9f8] [&_button]:px-2 [&_button]:py-1.5 [&_button]:text-[8px] [&_button]:text-[#6f88ac] [&_button:disabled]:opacity-50 [&_button:hover:enabled]:bg-[#eaf3ff] lg:[&_button]:min-h-[31px]">
              {['Uma missão para mim', 'Meu progresso', 'Preciso de um incentivo'].map(
                (prompt) => (
                  <button
                    key={prompt}
                    onClick={() => journey.sendMessage(prompt)}
                    disabled={journey.thinking}
                  >
                    {prompt}
                    <JourneyIcon name="arrow" size={12} />
                  </button>
                )
              )}
            </div>
            <form
              onSubmit={handleSubmit(submitMessage)}
              noValidate
              className="mt-3.5 flex min-h-[47px] items-center gap-[5px] rounded-[11px] border border-[#dce7f5] bg-[#fafcff] p-[5px] focus-within:border-[#93bae9] focus-within:shadow-[0_0_0_3px_#2b7dd90a] lg:min-h-0 [&_input]:w-full [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:p-[7px] [&_input]:text-[12px] [&_input]:text-[#27476f] [&_input]:outline-none [&_input::placeholder]:text-[#9aabc1] lg:[&_input]:text-[10px] [&_button]:grid [&_button]:h-[34px] [&_button]:w-9 [&_button]:shrink-0 [&_button]:place-items-center [&_button]:rounded-lg [&_button]:bg-[#2866ce] [&_button]:text-white [&_button:disabled]:opacity-40"
            >
              <label htmlFor="journey-message" className="sr-only">
                Mensagem para o Nexo
              </label>
              <input
                id="journey-message"
                {...register('message', {
                  required: 'Escreva uma mensagem para o Nexo.',
                  setValueAs: (value: string) => value.trim(),
                  maxLength: {
                    value: 280,
                    message: 'Use até 280 caracteres na mensagem.',
                  },
                })}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message
                    ? 'journey-message-error journey-conversation-note'
                    : 'journey-conversation-note'
                }
                onFocus={() => journey.reactToAvatar('listen')}
                placeholder="Conte comigo. O que vamos fazer?"
                maxLength={280}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={journey.thinking}
                aria-label="Enviar mensagem"
              >
                <JourneyIcon name="send" size={19} />
              </button>
            </form>
            {errors.message && (
              <p
                id="journey-message-error"
                role="alert"
                className="mt-2 text-[12px] text-red-700"
              >
                {errors.message.message}
              </p>
            )}
            <p
              id="journey-conversation-note"
              className="mt-2.5 text-center text-[8px] text-[#99a9bf]"
            >
              Conversa guiada · Seu progresso fica neste navegador
            </p>
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-3 py-6 text-[#8a9bb3] lg:flex-nowrap lg:gap-4 lg:pb-[30px] lg:pt-[34px] [&_p]:border-l [&_p]:border-[#d5e0ef] [&_p]:pl-4 [&_p]:text-[10px] [&>span:last-child]:ml-0 [&>span:last-child]:w-full [&>span:last-child]:text-[9px] lg:[&>span:last-child]:ml-auto lg:[&>span:last-child]:w-auto lg:[&>span:last-child]:text-[10px]">
          <span className="text-[24px] font-extrabold tracking-[-2px] text-[#536e93]">
            soul·up
          </span>
          <p>Tecnologia para um futuro mais humano.</p>
          <span>Evoluir também pode ser leve.</span>
        </div>
      </div>
    </main>
  )
}