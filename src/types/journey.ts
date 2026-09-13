import type { Quest } from './index'

export type JourneyQuest = Quest & {
  id: string
  problemId: string
  problemTitle: string
}

export type JourneyMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

export type JourneyAchievement = {
  id: string
  title: string
  description: string
  icon: 'leaf' | 'star' | 'recycle' | 'drop'
  unlocked: boolean
}

export type JourneySnapshot = {
  points: number
  completedIds: string[]
  activeQuestId: string | null
}
