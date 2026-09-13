import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { NexoHomeAssistant } from '../components/nexo/NexoHomeAssistant'
import { nexoHomeMessages } from '../data/nexo'
import { getCompletedQuests, getImpactSummary, getLevel, getStoredPoints, getStoredUser, TOTAL_QUESTS } from '../utils/storage'

type HomeProgress = {
  points: number
  completed: number
  level: string
  impact: number
  impactSummary: string
  userName?: string
}

const initialProgress: HomeProgress = {
  points: 0,
  completed: 0,
  level: 'Eco Iniciante',
  impact: 0,
  impactSummary: 'Complete quests para visualizar seu impacto ambiental.',
}

export function Home() {
  const [progress, setProgress] = useState<HomeProgress>(initialProgress)
  const [storageUnavailable, setStorageUnavailable] = useState(false)

  useEffect(() => {
    const refreshProgress = () => {
      try {
        const points = getStoredPoints()
        const completed = getCompletedQuests().length
        const level = getLevel(points).nome
        const impact = Math.min(Math.round((completed / TOTAL_QUESTS) * 100), 100)
        const user = getStoredUser()
        setProgress({
          points,
          completed,
          level,
          impact,
          impactSummary: getImpactSummary(completed, points, level),
          userName: user?.nome,
        })
        setStorageUnavailable(false)
      } catch {
        setStorageUnavailable(true)
      }
    }

    refreshProgress()
    window.addEventListener('focus', refreshProgress)
    window.addEventListener('storage', refreshProgress)
    return () => {
      window.removeEventListener('focus', refreshProgress)
      window.removeEventListener('storage', refreshProgress)
    }
  }, [])

  const benefits = [
    ['01', 'Onboarding claro', 'Explica o primeiro passo do usuário sem excesso de informação.'],
    ['02', 'Feedback imediato', 'Mostra progresso, pontos e missões concluídas de forma visual.'],
    ['03', 'Motivação contínua', 'Usa níveis, recompensas e metas para aumentar engajamento.'],
  ]

  return (
    <main>
      <section className="relative isolate min-h-[82vh] overflow-hidden border-b border-cyan-300/10">
        <div className="absolute inset-0 -z-20 bg-[url('/image/fundo.gif')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#00140f]/55 via-[#00140f]/65 to-[#00140f]" />
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div className="max-w-4xl text-center lg:text-left">
            <span className="inline-flex rounded-full border border-cyan-200/35 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.19em] text-cyan-100 backdrop-blur-md">
              Soul UP • Gamificação sustentável
            </span>
            <h1 className="mt-6 text-6xl font-black tracking-tight text-cyan-300 drop-shadow-[0_0_26px_rgba(34,211,238,0.45)] sm:text-7xl lg:text-8xl">
              LUMEN AI
            </h1>
            <p className="mt-5 text-xl font-semibold text-cyan-200 sm:text-2xl">Potencializa seu tempo para o mundo e você</p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/80 sm:text-lg lg:mx-0">
              Uma inteligência interativa que orienta o usuário por meio de avatares, transformando missões, pontos e recompensas em uma jornada simples, motivadora e acessível.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/experiencia" className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-7 py-3.5 text-sm font-black text-[#00140f] transition hover:-translate-y-0.5 hover:brightness-110">
                Ver experiência
              </Link>
              <Link to="/solucao" className="rounded-full border border-white/25 bg-black/20 px-7 py-3.5 text-sm font-black text-white transition hover:border-cyan-200/60 hover:bg-cyan-300/10">
                Entender solução
              </Link>
            </div>
          </div>

          <GlassCard className="self-end bg-[#001b15]/75">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Experiência guiada</span>
            <strong className="mt-4 block text-5xl font-black text-emerald-300">+clareza</strong>
            <p className="mt-4 text-sm leading-7 text-white/70">Menos dúvida para o usuário entender o que fazer, ganhar pontos e acompanhar seu impacto.</p>
          </GlassCard>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {benefits.map(([number, title, description]) => (
          <GlassCard key={number} className="transition hover:-translate-y-1 hover:border-cyan-200/30">
            <span className="text-sm font-black text-cyan-300">{number}</span>
            <h2 className="mt-3 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8" id="lumen-app">
        <div className="mb-10 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Soul UP • Quests sustentáveis</span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Experiência guiada pelo Nexo</h2>
          <p className="mt-4 text-base leading-8 text-white/65">Escolha um problema ecológico, entenda a causa e veja missões práticas com pontuação, níveis e feedback instantâneo.</p>
        </div>

        {storageUnavailable && <p role="status" className="mb-6 rounded-xl border border-amber-200/30 bg-amber-200/10 p-4 text-sm text-amber-100">Não foi possível carregar seu progresso salvo. Você pode explorar a experiência; permita o armazenamento neste navegador para retomar seus dados.</p>}
        <div className="grid items-center gap-5 lg:grid-cols-[0.82fr_1.65fr_0.82fr]">
          <div className="grid gap-4">
            <GlassCard>
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">Nível atual</span>
              <strong className="mt-2 block text-2xl font-black text-cyan-100">{progress.level}</strong>
              <p className="mt-2 text-sm leading-6 text-white/55">Seu nível evolui conforme as quests sustentáveis são concluídas.</p>
            </GlassCard>
            <GlassCard>
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">Pontos verdes</span>
              <strong className="mt-2 block text-4xl font-black text-emerald-300">{progress.points}</strong>
              <p className="mt-2 text-sm leading-6 text-white/55">Total acumulado nas quests sustentáveis concluídas.</p>
            </GlassCard>
          </div>

          <NexoHomeAssistant
            eyebrow={progress.userName ? `Olá, ${progress.userName}` : 'Guia da experiência'}
            title="Eu sou o Nexo"
            messages={progress.completed > 0 ? nexoHomeMessages.usuarioAtivo : nexoHomeMessages.visitante}
            status="Pronto para ajudar"
            action={{ label: 'Começar uma missão', to: '/experiencia' }}
          />

          <div className="grid gap-4">
            <GlassCard>
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">Quests concluídas</span>
              <strong className="mt-2 block text-4xl font-black text-cyan-200">{progress.completed}</strong>
              <p className="mt-2 text-sm leading-6 text-white/55">Total de missões sustentáveis finalizadas até agora.</p>
            </GlassCard>
            <GlassCard>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.18em] text-white/45">Impacto estimado</span>
                <strong className="text-xl font-black text-emerald-300">{progress.impact}%</strong>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500" style={{ width: `${progress.impact}%` }} />
              </div>
              <p className="mt-3 text-sm leading-6 text-white/55">{progress.impactSummary}</p>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  )
}
