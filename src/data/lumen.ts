export const lumenHomeMessages = {
  visitante: [
    'Comece escolhendo uma missão sustentável simples. Pequenas ações já geram Pontos Verdes e ajudam você a entender como a plataforma funciona.',
    'Suas missões concluídas ficam registradas neste navegador. Conforme você avança, seu nível sustentável também evolui.',
    'Você não precisa mudar tudo de uma vez. A Soul UP transforma pequenas atitudes em uma jornada progressiva.',
  ],
  usuarioAtivo: [
    'Seu progresso já começou. Continue completando missões para aumentar seu impacto estimado.',
    'Você pode escolher missões de diferentes dificuldades. Quanto maior o desafio, maior a quantidade de Pontos Verdes.',
    'Confira seu nível e seus pontos antes de escolher a próxima missão. Isso ajuda a visualizar sua evolução.',
  ],
}

export const createExperienceMessages = ({
  problem,
  points,
  completed,
}: {
  problem: string
  points: number
  completed: number
}) => [
  `Você está explorando ${problem}. Analise a causa principal antes de escolher uma missão.`,
  `Você possui ${points} Pontos Verdes e já concluiu ${completed} missão${completed === 1 ? '' : 'ões'}.`,
  'Você pode filtrar as missões por dificuldade. Comece por uma missão fácil se quiser entender rapidamente a dinâmica da experiência.',
]
