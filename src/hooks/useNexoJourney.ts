import { useCallback, useEffect, useRef, useState } from 'react'
import { ecologicalProblems } from '../data/quests'
import { getJourneyAchievements, getJourneyReply, questCatalog } from '../data/nexoJourney'
import type { JourneyMessage } from '../data/nexoJourney'
import type { NexoState } from '../types/nexo'
import { getCompletedQuests, getLevel, getStoredPoints, getStoredUser } from '../utils/storage'

export { questCatalog } from '../data/nexoJourney'
export type { JourneyQuest, JourneyMessage, JourneyAchievement } from '../data/nexoJourney'

const JOURNEY_KEY = 'nexoJourneySoulUp'
const POINTS_KEY = 'pontosSoulUp'
const COMPLETED_KEY = 'questsConcluidasSoulUp'
const MAX_MESSAGES = 40

type JourneySnapshot = {
  points: number
  completedIds: string[]
  activeQuestId: string | null
}

const emptySnapshot = (): JourneySnapshot => ({ points: 0, completedIds: [], activeQuestId: null })
const validPoints = (value: unknown): number => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
const validIds = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string'))] : []

function readJourney() {
  const snapshot = emptySnapshot()
  let persistenceAvailable = true
  let userName = 'você'
  try {
    const user = getStoredUser()
    if (typeof user?.nome === 'string' && user.nome.trim()) userName = user.nome.trim().split(/\s+/)[0].slice(0, 36)
  } catch { persistenceAvailable = false }
  try { snapshot.points = validPoints(getStoredPoints()) } catch { persistenceAvailable = false }
  try { snapshot.completedIds = validIds(getCompletedQuests()) } catch { persistenceAvailable = false }
  try {
    const raw = localStorage.getItem(JOURNEY_KEY)
    if (raw) {
      let saved: unknown
      try { saved = JSON.parse(raw) } catch { saved = null }
      if (saved && typeof saved === 'object' && 'version' in saved && saved.version === 1) {
        const journal = saved as Record<string, unknown>
        snapshot.points = Math.max(snapshot.points, validPoints(journal.points))
        snapshot.completedIds = [...new Set([...snapshot.completedIds, ...validIds(journal.completedIds)])]
        if (typeof journal.activeQuestId === 'string' && questCatalog.some((quest) => quest.id === journal.activeQuestId) && !snapshot.completedIds.includes(journal.activeQuestId)) {
          snapshot.activeQuestId = journal.activeQuestId
        }
      }
    }
  } catch {
    persistenceAvailable = false
  }
  return { snapshot, persistenceAvailable, userName }
}

function mergeProgress(current: JourneySnapshot, stored: JourneySnapshot): JourneySnapshot {
  const completedIds = [...new Set([...current.completedIds, ...stored.completedIds])]
  return {
    points: Math.max(current.points, stored.points),
    completedIds,
    activeQuestId: current.activeQuestId && !completedIds.includes(current.activeQuestId) ? current.activeQuestId : null,
  }
}

export function useNexoJourney() {
  const [initial] = useState(readJourney)
  const [snapshot, setSnapshot] = useState(initial.snapshot)
  const snapshotRef = useRef(snapshot)
  const [persistenceAvailable, setPersistenceAvailable] = useState(initial.persistenceAvailable)
  const [userName, setUserName] = useState(initial.userName)
  const initialQuest = questCatalog.find((quest) => quest.id === initial.snapshot.activeQuestId)
  const [activeProblemId, setProblemId] = useState(initialQuest?.problemId ?? ecologicalProblems[0].id)
  const problemRef = useRef(activeProblemId)
  const [messages, setMessages] = useState<JourneyMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    text: initialQuest
      ? `Que bom ter você aqui! Sua missão “${initialQuest.titulo}” está pronta para continuar. Vamos no seu ritmo?`
      : 'Olá! Eu sou o Nexo, seu parceiro de evolução. Cada pequena ação faz diferença. Vamos escolher sua próxima missão?',
  }])
  const [thinking, setThinking] = useState(false)
  const thinkingRef = useRef(false)
  const [foregroundState, setForegroundState] = useState<NexoState>('idle')
  const [present, setPresent] = useState(false)
  const priorityRef = useRef(0)
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const poseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const responseVersion = useRef(0)
  const messageSequence = useRef(0)
  const mounted = useRef(true)

  const appendMessage = useCallback((role: JourneyMessage['role'], text: string) => {
    const message = { id: `${role}-${++messageSequence.current}`, role, text }
    setMessages((previous) => [...previous, message].slice(-MAX_MESSAGES))
  }, [])

  const pose = useCallback((state: NexoState, duration: number, priority: number) => {
    if (priority < priorityRef.current) return
    if (poseTimer.current !== null) clearTimeout(poseTimer.current)
    priorityRef.current = priority
    setForegroundState(state)
    poseTimer.current = duration > 0 ? setTimeout(() => {
      if (!mounted.current) return
      priorityRef.current = 0
      setForegroundState('idle')
      poseTimer.current = null
    }, duration) : null
  }, [])

  const cancelReply = useCallback(() => {
    responseVersion.current += 1
    if (responseTimer.current !== null) clearTimeout(responseTimer.current)
    responseTimer.current = null
    thinkingRef.current = false
    setThinking(false)
  }, [])

  const commit = useCallback((next: JourneySnapshot) => {
    snapshotRef.current = next
    setSnapshot(next)
    try {
      localStorage.setItem(JOURNEY_KEY, JSON.stringify({ version: 1, ...next }))
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(next.completedIds))
      localStorage.setItem(POINTS_KEY, String(next.points))
      setPersistenceAvailable(true)
    } catch {
      setPersistenceAvailable(false)
    }
  }, [])

  const announce = useCallback((text: string, celebrate = false) => {
    cancelReply()
    appendMessage('assistant', text)
    pose(celebrate ? 'celebrating' : 'talking', celebrate ? 4200 : 3000, celebrate ? 3 : 2)
  }, [appendMessage, cancelReply, pose])

  const setActiveProblemId = useCallback((id: string) => {
    if (!ecologicalProblems.some((problem) => problem.id === id)) return
    problemRef.current = id
    setProblemId(id)
  }, [])

  const startQuest = useCallback((questId?: string) => {
    const stored = readJourney()
    const current = mergeProgress(snapshotRef.current, stored.snapshot)
    if (current.activeQuestId) {
      const active = questCatalog.find((quest) => quest.id === current.activeQuestId)!
      announce(`Você já tem uma missão em andamento: “${active.titulo}”. Conclua essa ação ou pause a missão antes de escolher outra.`)
      return false
    }
    const quest = questId
      ? questCatalog.find((item) => item.id === questId)
      : questCatalog.find((item) => item.problemId === problemRef.current && !current.completedIds.includes(item.id))
    if (!quest || current.completedIds.includes(quest.id)) return false
    commit({ ...current, activeQuestId: quest.id })
    setActiveProblemId(quest.problemId)
    announce(`Combinado! Sua missão é “${quest.titulo}”. ${quest.descricao} Depois de realizar a ação, confirme no cartão para receber ${quest.pontos} XP.`)
    return true
  }, [announce, commit, setActiveProblemId])

  const completeActiveQuest = useCallback(() => {
    const activeId = snapshotRef.current.activeQuestId
    if (!activeId) return false
    const quest = questCatalog.find((item) => item.id === activeId)
    if (!quest) return false
    const stored = readJourney()
    const current = mergeProgress(snapshotRef.current, stored.snapshot)
    if (current.completedIds.includes(activeId)) {
      commit({ ...current, activeQuestId: null })
      announce('Essa missão já foi registrada. Seu progresso está atualizado; vamos escolher o próximo passo?')
      return false
    }
    const next = { points: current.points + quest.pontos, completedIds: [...current.completedIds, activeId], activeQuestId: null }
    const previousLevel = getLevel(current.points).nome
    const nextLevel = getLevel(next.points).nome
    commit(next)
    announce(`Missão concluída! +${quest.pontos} XP pela sua ação. ${previousLevel !== nextLevel ? `Você chegou ao nível ${nextLevel}! ` : ''}Cada pequeno passo conta. Estou muito feliz por caminhar com você!`, true)
    return true
  }, [announce, commit])

  const cancelActiveQuest = useCallback(() => {
    if (!snapshotRef.current.activeQuestId) return
    const current = mergeProgress(snapshotRef.current, readJourney().snapshot)
    commit({ ...current, activeQuestId: null })
    announce('Missão pausada. Seu progresso continua com você. Quando quiser, escolha essa missão novamente ou experimente outra.')
  }, [announce, commit])

  const sendMessage = useCallback((input: string) => {
    const text = input.trim().slice(0, 280)
    if (!text || thinkingRef.current) return false
    cancelReply()
    appendMessage('user', text)
    thinkingRef.current = true
    setThinking(true)
    pose('thinking', 0, 2)
    const version = responseVersion.current
    responseTimer.current = setTimeout(() => {
      if (!mounted.current || responseVersion.current !== version) return
      const current = snapshotRef.current
      const currentProblem = ecologicalProblems.find((problem) => problem.id === problemRef.current) ?? ecologicalProblems[0]
      const reply = getJourneyReply(text, {
        userName,
        points: current.points,
        completedIds: current.completedIds,
        currentProblem,
        activeQuest: questCatalog.find((quest) => quest.id === current.activeQuestId) ?? null,
        recommendedQuest: questCatalog.find((quest) => quest.problemId === currentProblem.id && !current.completedIds.includes(quest.id)) ?? null,
      })
      responseTimer.current = null
      thinkingRef.current = false
      setThinking(false)
      appendMessage('assistant', reply)
      pose('talking', 3200, 2)
    }, 700)
    return true
  }, [appendMessage, cancelReply, pose, userName])

  const reactToAvatar = useCallback((kind: 'wave' | 'celebrate' | 'think' | 'listen' = 'wave') => {
    if (thinkingRef.current || priorityRef.current >= 2) return
    if (kind === 'celebrate') {
      appendMessage('assistant', 'Um gesto de incentivo para a sua jornada! Estou torcendo pelo seu próximo passo.')
      pose('celebrating', 2800, 1)
    } else if (kind === 'think') {
      appendMessage('assistant', 'Uma ideia: escolha uma ação pequena que caiba no seu dia. Eu ajudo você a começar.')
      pose('thinking', 2200, 1)
    } else if (kind === 'listen') {
      pose('listening', 2500, 1)
    } else {
      appendMessage('assistant', `Olá, ${userName}! Que bom ter sua companhia. Vamos evoluir juntos?`)
      pose('happy', 2500, 1)
    }
  }, [appendMessage, pose, userName])

  const handlePresence = useCallback((value: boolean) => setPresent(value), [])

  useEffect(() => {
    mounted.current = true
    try {
      const probeKey = 'nexoStorageProbeSoulUp'
      localStorage.setItem(probeKey, '1')
      localStorage.removeItem(probeKey)
    } catch { setPersistenceAvailable(false) }
    const synchronize = (event: StorageEvent) => {
      if (event.key !== null && ![JOURNEY_KEY, POINTS_KEY, COMPLETED_KEY, 'usuarioSoulUp'].includes(event.key)) return
      const stored = readJourney()
      const next = mergeProgress(snapshotRef.current, stored.snapshot)
      snapshotRef.current = next
      setSnapshot(next)
      setUserName(stored.userName)
      if (!stored.persistenceAvailable) setPersistenceAvailable(false)
    }
    window.addEventListener('storage', synchronize)
    return () => {
      mounted.current = false
      responseVersion.current += 1
      if (responseTimer.current !== null) clearTimeout(responseTimer.current)
      if (poseTimer.current !== null) clearTimeout(poseTimer.current)
      window.removeEventListener('storage', synchronize)
    }
  }, [])

  const currentProblem = ecologicalProblems.find((problem) => problem.id === activeProblemId) ?? ecologicalProblems[0]
  const quests = questCatalog.filter((quest) => quest.problemId === currentProblem.id)
  const level = getLevel(snapshot.points)
  const levelPercent = level.atual === level.proximo ? 100 : Math.min(100, Math.max(0, ((snapshot.points - level.atual) / (level.proximo - level.atual)) * 100))
  const assistantMessages = messages.filter((message) => message.role === 'assistant')

  return {
    userName,
    points: snapshot.points,
    completedIds: snapshot.completedIds,
    completedCount: questCatalog.filter((quest) => snapshot.completedIds.includes(quest.id)).length,
    level,
    levelNumber: snapshot.points >= 500 ? 4 : snapshot.points >= 300 ? 3 : snapshot.points >= 120 ? 2 : 1,
    levelPercent,
    activeProblemId,
    setActiveProblemId,
    currentProblem,
    quests,
    questCatalog,
    activeQuest: questCatalog.find((quest) => quest.id === snapshot.activeQuestId) ?? null,
    recommendedQuest: quests.find((quest) => !snapshot.completedIds.includes(quest.id)) ?? null,
    startQuest,
    completeActiveQuest,
    cancelActiveQuest,
    messages,
    lastMessage: assistantMessages[assistantMessages.length - 1].text,
    sendMessage,
    thinking,
    avatarState: foregroundState === 'idle' && present ? 'looking' as const : foregroundState,
    reactToAvatar,
    handlePresence,
    achievements: getJourneyAchievements(snapshot.completedIds),
    persistenceAvailable,
  }
}
