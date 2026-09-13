import { useState } from 'react'
import { PageHero } from '../components/PageHero'

const questions = [
  [
    "O que é a Lumen AI?",
    "É um avatar inteligente e interativo pensado para orientar o usuário dentro da Soul UP, explicando missões, pontuação, níveis e recompensas de forma simples.",
  ],
  [
    "Qual problema o projeto resolve?",
    "O projeto reduz dúvidas na jornada do usuário. O Nexo indica próximos passos e mostra o progresso das ações.",
  ],
  [
    "Como o usuário ganha pontos?",
    "O usuário ganha pontos ao concluir quests sustentáveis. A pontuação varia de acordo com a dificuldade da missão.",
  ],
  [
    "Por que a solução usa gamificação?",
    "A gamificação transforma tarefas em metas, progresso e recompensas, tornando a experiência mais motivadora e aumentando o engajamento.",
  ],
  [
    "O site funciona em celular?",
    "Sim. A interface foi desenvolvida com Tailwind CSS e responsividade para mobile, tablet e desktop.",
  ],
  [
    "Quais tecnologias foram usadas?",
    "React, Vite, TypeScript, Tailwind CSS, React Router DOM e React Hook Form, mantendo a experiência como uma SPA.",
  ],
  [
    "Meus dados ficam salvos?",
    "Sim, o progresso é salvo localmente no navegador (localStorage). Se trocar de dispositivo ou limpar o cache, o progresso não é sincronizado nesta versão.",
  ],
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <main className="pb-20">
      <PageHero tag="Perguntas frequentes" title="Dúvidas rápidas" description="Respostas objetivas sobre a proposta, funcionamento e valor da Lumen AI dentro da Soul UP." />
      <section className="mx-auto max-w-4xl space-y-3 px-4 sm:px-6 lg:px-8">
        {questions.map(([question, answer], index) => {
          const open = openIndex === index
          return (
            <article key={question} className="overflow-hidden rounded-2xl border border-cyan-200/15 bg-black/20">
              <button type="button" onClick={() => setOpenIndex(open ? -1 : index)} className="flex w-full items-center justify-between gap-5 p-5 text-left">
                <span className="font-black text-white">{question}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cyan-200/20 text-cyan-200 transition ${open ? 'rotate-45 bg-cyan-300/10' : ''}`}>+</span>
              </button>
              {open && <p className="border-t border-white/10 px-5 py-5 text-sm leading-7 text-white/65">{answer}</p>}
            </article>
          )
        })}
      </section>
    </main>
  )
}
