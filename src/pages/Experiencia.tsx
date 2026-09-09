import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { LumenMascot } from '../components/LumenMascot'
import { Modal } from '../components/Modal'
import { PageHero } from '../components/PageHero'
import { QuestCard } from '../components/QuestCard'
import { ecologicalProblems } from '../data/quests'
import type { Difficulty } from '../types'
import { getCompletedQuests, getLevel, getStoredPoints, getStoredUser } from '../utils/storage'

type Filter = 'todas' | Difficulty

export function Experiencia() {
  const [problemId, setProblemId] = useState('clima')
  const [filter, setFilter] = useState<Filter>('todas')
  const [points, setPoints] = useState(() => getStoredPoints())
  const [completed, setCompleted] = useState<string[]>(() => getCompletedQuests())
  const [modal, setModal] = useState<{ open: boolean; points: number }>({ open: false, points: 0 })
  const [userName, setUserName] = useState('Visitante Soul UP')

  useEffect(() => {
    const user = getStoredUser()
    if (user?.nome) setUserName(user.nome)
  }, [])

  const currentProblem = ecologicalProblems.find((problem) => problem.id === problemId) ?? ecologicalProblems[0]
  const visibleQuests = useMemo(
    () => currentProblem.quests.filter((quest) => filter === 'todas' || quest.dificuldade === filter),
    [currentProblem, filter],
  )
  const level = getLevel(points)
  const range = level.proximo - level.atual
  const levelPercent = level.proximo === level.atual ? 100 : Math.min(((points - level.atual) / range) * 100, 100)

  function completeQuest(questId: string, questPoints: number) {
    if (completed.includes(questId)) return
    const nextPoints = points + questPoints
    const nextCompleted = [...completed, questId]
    setPoints(nextPoints)
    setCompleted(nextCompleted)
    localStorage.setItem('pontosSoulUp', String(nextPoints))
    localStorage.setItem('questsConcluidasSoulUp', JSON.stringify(nextCompleted))
    setModal({ open: true, points: questPoints })
  }

  return (
    <main className="pb-20">
      <PageHero tag="Experiência interativa" title="Missões sustentáveis com a Lumën" description="Escolha um problema ecológico, veja a causa principal e complete quests com pontuação por dificuldade. O progresso fica salvo localmente no navegador." />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.15fr_0.95fr] lg:px-8">
        <GlassCard>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Seu progresso</span>
          <h2 className="mt-3 text-2xl font-black">{userName}</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Complete quests para ganhar Pontos Verdes e subir seu nível sustentável.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-xs text-white/45">Nível atual</span>
            <strong className="mt-1 block text-xl text-emerald-200">{level.nome}</strong>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm"><span className="text-white/55">Pontos acumulados</span><strong className="text-2xl text-cyan-200">{points}</strong></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500" style={{ width: `${levelPercent}%` }} /></div>
          <small className="mt-3 block text-white/45">{level.proximo === level.atual ? 'Você atingiu o maior nível desta demonstração.' : `Faltam ${level.proximo - points} pontos para o próximo nível.`}</small>
        </GlassCard>

        <div className="rounded-3xl border border-cyan-200/15 bg-gradient-to-b from-cyan-300/10 to-transparent p-5 text-center shadow-neon">
          <div className="rounded-2xl border border-cyan-200/20 bg-black/25 p-5 text-left">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Plano da Lumën para {userName}</span>
            <h2 className="mt-2 text-2xl font-black">{currentProblem.titulo}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">{currentProblem.mensagem}</p>
          </div>
          <LumenMascot compact />
        </div>

        <GlassCard>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Causa principal</span>
          <h2 className="mt-3 text-2xl font-black">{currentProblem.causa}</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{currentProblem.resumo}</p>
          <label className="mt-6 block text-sm font-bold text-white/75">
            Filtrar dificuldade
            <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="mt-2 w-full rounded-xl border border-white/15 bg-[#002019] px-4 py-3 text-sm text-white outline-none focus:border-cyan-200">
              <option value="todas">Todas</option>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </label>
        </GlassCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-200/15 bg-white/[0.025] p-5 sm:p-7">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Escolha um tema</span>
            <h2 className="mt-3 text-3xl font-black">Problemas ecológicos</h2>
            <p className="mt-3 text-sm leading-7 text-white/55">As quests foram pensadas para a rotina de um estudante e não dependem de API ou banco de dados nesta Sprint 03.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Problemas ecológicos">
            {ecologicalProblems.map((problem) => (
              <button key={problem.id} type="button" onClick={() => setProblemId(problem.id)} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${problemId === problem.id ? 'border-cyan-200 bg-cyan-300/15 text-cyan-100' : 'border-white/10 bg-black/20 text-white/55 hover:border-cyan-200/30 hover:text-white'}`}>
                {problem.titulo}
              </button>
            ))}
          </div>

          <div className="mt-9 flex items-end justify-between gap-4 border-t border-white/10 pt-7">
            <div><h3 className="text-2xl font-black">Quests recomendadas</h3><p className="mt-1 text-sm text-white/50">Complete uma missão por vez e acompanhe sua pontuação.</p></div>
            <span className="hidden text-sm text-emerald-200 sm:block">{completed.length} concluída(s)</span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleQuests.map((quest) => {
              const originalIndex = currentProblem.quests.findIndex((item) => item.titulo === quest.titulo)
              const questId = `${currentProblem.id}-${quest.dificuldade}-${originalIndex}`
              return <QuestCard key={questId} quest={quest} questId={questId} completed={completed.includes(questId)} onComplete={completeQuest} />
            })}
          </div>
        </div>
      </section>

      <Modal open={modal.open} title="Quest concluída!" onClose={() => setModal({ open: false, points: 0 })}>
        <p>Você ganhou <strong className="text-emerald-200">{modal.points} Pontos Verdes</strong>. A Lumën atualizou seu progresso sustentável.</p>
      </Modal>
    </main>
  )
}
