export type Difficulty = 'facil' | 'medio' | 'dificil'

export type Quest = {
  titulo: string
  dificuldade: Difficulty
  pontos: number
  tempo: string
  descricao: string
}

export type EcologicalProblem = {
  id: string
  titulo: string
  causa: string
  resumo: string
  mensagem: string
  quests: Quest[]
}

export type TeamMember = {
  nome: string
  rm: string
  turma: string
  cargo: string
  descricao: string
  imagem: string
  github: string
  linkedin: string
}

export type StoredUser = {
  nome: string
  email: string
}
