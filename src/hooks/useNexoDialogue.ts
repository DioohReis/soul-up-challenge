import { useCallback, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { ecologicalProblems } from '../data/quests'
import { getJourneyReply, questCatalog } from '../data/nexoJourney'
import type { JourneyMessage, JourneyQuest, JourneySnapshot } from '../types/journey'
import type { NexoState } from '../types/nexo'

const MAX_MESSAGES = 40

type NexoDialogueOptions = {
  snapshotRef: MutableRefObject<JourneySnapshot>
  problemRef: MutableRefObject<string>
  userName: string
  initialQuest: JourneyQuest | undefined
}

export function useNexoDialogue({
  snapshotRef,
  problemRef,
  userName,
  initialQuest,
}: NexoDialogueOptions) {
  const [messages, setMessages] = useState<JourneyMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: initialQuest
        ? `Que bom ter você aqui! Sua missão “${initialQuest.titulo}” está pronta para continuar. Vamos no seu ritmo?`
        : 'Olá! Eu sou o Nexo, seu parceiro de evolução. Cada pequena ação faz diferença. Vamos escolher sua próxima missão?',
    },
  ])
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
    const message = {
      id: `${role}-${++messageSequence.current}`,
      role,
      text,
    }
    setMessages((previous) => [...previous, message].slice(-MAX_MESSAGES))
  }, [])

  const pose = useCallback((state: NexoState, duration: number, priority: number) => {
    if (priority < priorityRef.current) {
      return
    }
    if (poseTimer.current !== null) {
      clearTimeout(poseTimer.current)
    }
    priorityRef.current = priority
    setForegroundState(state)
    poseTimer.current =
      duration > 0
        ? setTimeout(() => {
            if (!mounted.current) {
              return
            }
            priorityRef.current = 0
            setForegroundState('idle')
            poseTimer.current = null
          }, duration)
        : null
  }, [])

  const cancelReply = useCallback(() => {
    responseVersion.current += 1
    if (responseTimer.current !== null) {
      clearTimeout(responseTimer.current)
    }
    responseTimer.current = null
    thinkingRef.current = false
    setThinking(false)
  }, [])

  const announce = useCallback(
    (text: string, celebrate = false) => {
      cancelReply()
      appendMessage('assistant', text)
      pose(celebrate ? 'celebrating' : 'talking', celebrate ? 4200 : 3000, celebrate ? 3 : 2)
    },
    [appendMessage, cancelReply, pose],
  )

  const sendMessage = useCallback(
    (input: string) => {
      const text = input.trim().slice(0, 280)
      if (!text || thinkingRef.current) {
        return false
      }
      cancelReply()
      appendMessage('user', text)
      thinkingRef.current = true
      setThinking(true)
      pose('thinking', 0, 2)
      const version = responseVersion.current
      responseTimer.current = setTimeout(() => {
        if (!mounted.current || responseVersion.current !== version) {
          return
        }
        const current = snapshotRef.current
        const currentProblem =
          ecologicalProblems.find((problem) => problem.id === problemRef.current) ??
          ecologicalProblems[0]
        const reply = getJourneyReply(text, {
          userName,
          points: current.points,
          completedIds: current.completedIds,
          currentProblem,
          activeQuest: questCatalog.find((quest) => quest.id === current.activeQuestId) ?? null,
          recommendedQuest:
            questCatalog.find(
              (quest) =>
                quest.problemId === currentProblem.id && !current.completedIds.includes(quest.id),
            ) ?? null,
        })
        responseTimer.current = null
        thinkingRef.current = false
        setThinking(false)
        appendMessage('assistant', reply)
        pose('talking', 3200, 2)
      }, 700)
      return true
    },
    [appendMessage, cancelReply, pose, userName, problemRef, snapshotRef],
  )

  const reactToAvatar = useCallback(
    (kind: 'wave' | 'celebrate' | 'think' | 'listen' = 'wave') => {
      if (thinkingRef.current || priorityRef.current >= 2) {
        return
      }
      if (kind === 'celebrate') {
        appendMessage(
          'assistant',
          'Um gesto de incentivo para a sua jornada! Estou torcendo pelo seu próximo passo.',
        )
        pose('celebrating', 2800, 1)
      } else if (kind === 'think') {
        appendMessage(
          'assistant',
          'Uma ideia: escolha uma ação pequena que caiba no seu dia. Eu ajudo você a começar.',
        )
        pose('thinking', 2200, 1)
      } else if (kind === 'listen') {
        pose('listening', 2500, 1)
      } else {
        appendMessage(
          'assistant',
          `Olá, ${userName}! Que bom ter sua companhia. Vamos evoluir juntos?`,
        )
        pose('happy', 2500, 1)
      }
    },
    [appendMessage, pose, userName],
  )

  const handlePresence = useCallback((value: boolean) => setPresent(value), [])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      responseVersion.current += 1
      if (responseTimer.current !== null) {
        clearTimeout(responseTimer.current)
      }
      if (poseTimer.current !== null) {
        clearTimeout(poseTimer.current)
      }
    }
  }, [])

  const assistantMessages = messages.filter((message) => message.role === 'assistant')

  return {
    announce,
    messages,
    lastMessage: assistantMessages[assistantMessages.length - 1].text,
    sendMessage,
    thinking,
    avatarState: foregroundState === 'idle' && present ? ('looking' as const) : foregroundState,
    reactToAvatar,
    handlePresence,
  }
}
