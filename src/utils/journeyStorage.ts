import { questCatalog } from '../data/nexoJourney'
import type { JourneySnapshot } from '../types/journey'
import { getCompletedQuests, getStoredPoints, getStoredUser } from './storage'

export const JOURNEY_KEY = 'nexoJourneySoulUp'
export const POINTS_KEY = 'pontosSoulUp'
export const COMPLETED_KEY = 'questsConcluidasSoulUp'
export const USER_KEY = 'usuarioSoulUp'

function validPoints(value: unknown): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0
}

function validIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return questCatalog.filter((quest) => value.includes(quest.id)).map((quest) => quest.id)
}

function completedPoints(completedIds: string[]): number {
  return questCatalog.reduce((total, quest) => {
    return completedIds.includes(quest.id) ? total + quest.pontos : total
  }, 0)
}

export function readJourney() {
  const snapshot: JourneySnapshot = {
    points: 0,
    completedIds: [],
    activeQuestId: null,
  }
  let persistenceAvailable = true
  let userName = 'você'

  try {
    const user = getStoredUser()
    if (user) {
      userName = user.nome.split(/\s+/)[0].slice(0, 36)
    }
    snapshot.points = getStoredPoints()
    snapshot.completedIds = validIds(getCompletedQuests())
    const raw = localStorage.getItem(JOURNEY_KEY)
    let saved: unknown = null

    if (raw) {
      try {
        saved = JSON.parse(raw)
      } catch {
        saved = null
      }
    }

    if (saved && typeof saved === 'object' && 'version' in saved && saved.version === 1) {
      const journal = saved as Record<string, unknown>
      snapshot.points = Math.max(snapshot.points, validPoints(journal.points))
      snapshot.completedIds = validIds([
        ...snapshot.completedIds,
        ...validIds(journal.completedIds),
      ])

      const activeQuest = questCatalog.find((quest) => quest.id === journal.activeQuestId)
      if (activeQuest && !snapshot.completedIds.includes(activeQuest.id)) {
        snapshot.activeQuestId = activeQuest.id
      }
    }
  } catch {
    persistenceAvailable = false
  }

  snapshot.points = Math.max(snapshot.points, completedPoints(snapshot.completedIds))
  return {
    snapshot,
    persistenceAvailable,
    userName,
  }
}

export function mergeProgress(current: JourneySnapshot, stored: JourneySnapshot): JourneySnapshot {
  const completedIds = validIds([...current.completedIds, ...stored.completedIds])
  const activeQuestId = current.activeQuestId ?? stored.activeQuestId

  return {
    points: Math.max(current.points, stored.points, completedPoints(completedIds)),
    completedIds,
    activeQuestId: activeQuestId && !completedIds.includes(activeQuestId) ? activeQuestId : null,
  }
}

export function saveJourney(snapshot: JourneySnapshot): boolean {
  try {
    localStorage.setItem(
      JOURNEY_KEY,
      JSON.stringify({
        version: 1,
        ...snapshot,
      }),
    )
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(snapshot.completedIds))
    localStorage.setItem(POINTS_KEY, String(snapshot.points))
    return true
  } catch {
    return false
  }
}

export function canPersistJourney(): boolean {
  try {
    const probeKey = 'nexoStorageProbeSoulUp'
    localStorage.setItem(probeKey, '1')
    localStorage.removeItem(probeKey)
    return true
  } catch {
    return false
  }
}
