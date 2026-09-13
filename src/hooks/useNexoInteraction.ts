import { useEffect, useRef, useState } from 'react'
import type { NexoInteractionMode, NexoState } from '../types/nexo'

const MODES: Record<NexoState, NexoInteractionMode> = {
  idle: {
    state: 'idle',
    label: 'Online',
    message: 'Olá! Eu sou o Nexo. Mova o cursor perto de mim ou clique para começarmos.',
  },
  looking: {
    state: 'looking',
    label: 'Observando',
    message: 'Estou acompanhando você. Meu olhar reage ao seu movimento em tempo real.',
  },
  listening: {
    state: 'listening',
    label: 'Escutando',
    message: 'Pode falar. Este estado será conectado à entrada da IA quando a camada generativa chegar.',
  },
  thinking: {
    state: 'thinking',
    label: 'Pensando',
    message: 'Estou analisando o contexto. A postura muda para deixar o processamento visível para o usuário.',
  },
  talking: {
    state: 'talking',
    label: 'Conversando',
    message: 'Quando eu responder, braços, núcleo e visor poderão acompanhar o ritmo da conversa.',
  },
  happy: {
    state: 'happy',
    label: 'Feliz',
    message: 'Eu percebi sua interação! Expressões positivas reforçam vínculo sem interromper sua jornada.',
  },
  celebrating: {
    state: 'celebrating',
    label: 'Comemorando',
    message: 'Conquista desbloqueada! Este estado será usado para pontos, missões e evolução na gamificação.',
  },
  sleeping: {
    state: 'sleeping',
    label: 'Descansando',
    message: 'Quando não houver atividade, eu reduzo os movimentos para manter a interface calma e eficiente.',
  },
}

const TEMPORARY_STATES: Partial<Record<NexoState, number>> = {
  happy: 1700,
  celebrating: 2600,
}

export function useNexoInteraction() {
  const [state, setState] = useState<NexoState>('idle')
  const [interactionCount, setInteractionCount] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = TEMPORARY_STATES[state]
    if (!duration) return undefined

    timerRef.current = window.setTimeout(() => {
      setState('idle')
    }, duration)

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [state])

  function chooseState(nextState: NexoState) {
    setState(nextState)
  }

  function handlePresence(present: boolean) {
    setState((current) => {
      if (present && current === 'idle') return 'looking'
      if (!present && current === 'looking') return 'idle'
      return current
    })
  }

  function handleAvatarInteraction() {
    setInteractionCount((current) => {
      const next = current + 1
      setState(next % 4 === 0 ? 'celebrating' : 'happy')
      return next
    })
  }

  return {
    state,
    mode: MODES[state],
    interactionCount,
    chooseState,
    handlePresence,
    handleAvatarInteraction,
  }
}
