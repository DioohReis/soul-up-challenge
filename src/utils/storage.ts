import type { StoredUser } from '../types'

export const TOTAL_QUESTS = 15

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('usuarioSoulUp')
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const user = parsed as Record<string, unknown>
    if (typeof user.nome !== 'string' || typeof user.email !== 'string') return null
    const nome = user.nome.trim()
    const email = user.email.trim()
    return nome && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { nome, email } : null
  } catch {
    return null
  }
}

export function getStoredPoints(): number {
  const points = Number(localStorage.getItem('pontosSoulUp'))
  return Number.isSafeInteger(points) && points >= 0 ? points : 0
}

export function getCompletedQuests(): string[] {
  const raw = localStorage.getItem('questsConcluidasSoulUp')
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? [...new Set(parsed.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())))] : []
  } catch {
    return []
  }
}

export type JourneyLevel = {
  nome: string
  atual: number
  proximo: number
  number: number
}

export function getLevel(points: number): JourneyLevel {
  if (points >= 500) {
    return { nome: 'Guardião Verde', atual: 500, proximo: 500, number: 4 }
  }

  if (points >= 300) {
    return { nome: 'Eco Líder', atual: 300, proximo: 500, number: 3 }
  }

  if (points >= 120) {
    return { nome: 'Eco Ativo', atual: 120, proximo: 300, number: 2 }
  }

  return { nome: 'Eco Iniciante', atual: 0, proximo: 120, number: 1 }
}

export function getImpactSummary(completed: number, points: number, level: string) {
  if (completed === 0) return 'Complete quests para visualizar seu impacto ambiental.'
  if (completed <= 2) return 'Você iniciou uma rotina mais consciente, reduzindo desperdícios e observando melhor seus hábitos.'
  if (completed <= 5) return 'Suas quests indicam avanço em economia de água, energia, descarte correto e consumo consciente.'
  return `Com ${points} pontos e nível ${level}, você demonstra constância em escolhas ambientais melhores.`
}
