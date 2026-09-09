import type { StoredUser } from '../types'

export const TOTAL_QUESTS = 15

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('usuarioSoulUp')
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    localStorage.removeItem('usuarioSoulUp')
    return null
  }
}

export function getStoredPoints(): number {
  return Number(localStorage.getItem('pontosSoulUp')) || 0
}

export function getCompletedQuests(): string[] {
  const raw = localStorage.getItem('questsConcluidasSoulUp')
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    localStorage.removeItem('questsConcluidasSoulUp')
    return []
  }
}

export function getLevel(points: number) {
  if (points >= 500) return { nome: 'Guardião Verde', atual: 500, proximo: 500 }
  if (points >= 300) return { nome: 'Eco Líder', atual: 300, proximo: 500 }
  if (points >= 120) return { nome: 'Eco Ativo', atual: 120, proximo: 300 }
  return { nome: 'Eco Iniciante', atual: 0, proximo: 120 }
}

export function getImpactSummary(completed: number, points: number, level: string) {
  if (completed === 0) return 'Complete quests para visualizar seu impacto ambiental.'
  if (completed <= 2) return 'Você iniciou uma rotina mais consciente, reduzindo desperdícios e observando melhor seus hábitos.'
  if (completed <= 5) return 'Suas quests indicam avanço em economia de água, energia, descarte correto e consumo consciente.'
  return `Com ${points} pontos e nível ${level}, você demonstra constância em escolhas ambientais melhores.`
}
