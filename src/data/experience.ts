import type { JourneyAchievement } from '../types/journey'
import type { NexoState } from '../types/nexo'

export const TOPIC_LABELS: Record<string, string> = {
  clima: 'Energia e clima',
  residuos: 'Reciclagem',
  agua: 'Água',
  biodiversidade: 'Natureza',
  poluicao: 'Vida urbana',
}
export const STATE_LABELS: Record<NexoState, string> = {
  idle: 'Pronto para ajudar',
  looking: 'Aqui com você',
  listening: 'Pode falar comigo',
  thinking: 'Pensando com carinho',
  talking: 'Uma ideia para você',
  happy: 'Feliz em te ver',
  celebrating: 'Você fez a diferença!',
  sleeping: 'Recarregando as energias',
}
export const BADGE_STYLES: Record<JourneyAchievement['icon'], string> = {
  leaf: 'bg-[linear-gradient(135deg,#64c5b3,#258679)]',
  star: 'bg-[linear-gradient(135deg,#9294ec,#5158bd)]',
  recycle: 'bg-[linear-gradient(135deg,#62baa6,#248877)]',
  drop: 'bg-[linear-gradient(135deg,#66b2e9,#3669c1)]',
}
