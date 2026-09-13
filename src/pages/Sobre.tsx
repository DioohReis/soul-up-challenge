import { GlassCard } from '../components/GlassCard'
import { PageHero } from '../components/PageHero'

export function Sobre() {
  const cards = [
    ['01', 'Contexto', 'A Soul UP transforma interações digitais em pontos, benefícios e impacto positivo. O desafio é explicar essa jornada de forma simples para diferentes usuários.'],
    ['02', 'Problema', 'Quando missões, pontuação e recompensas não ficam claras, o usuário pode abandonar a experiência antes de entender o valor da plataforma.'],
    ['03', 'Solução proposta', 'A Lumen AI atua como camada inteligente da experiência, orientando usuários por meio de avatares, explicando recursos, sugerindo missões e acompanhando sua evolução dentro da plataforma.'],
    ['04', 'Impacto esperado', 'A proposta busca aumentar entendimento, retenção e engajamento, criando uma experiência mais humana, acessível e preparada para personalização e integração com serviços reais da Soul UP.'],
  ]

  const journey = [
    ['1', 'Entra', 'O usuário acessa a plataforma e recebe uma orientação inicial objetiva.'],
    ['2', 'Entende', 'O Nexo apresenta missões, pontos e conquistas com linguagem direta.'],
    ['3', 'Interage', 'O usuário completa ações, acompanha evolução e recebe feedback visual.'],
    ['4', 'Retorna', 'A clareza da experiência incentiva continuidade e engajamento.'],
  ]

  return (
    <main className="pb-20">
      <PageHero tag="Sobre o projeto" title="Lumen AI para Soul UP" description="A Lumen AI é uma inteligência interativa projetada para orientar a jornada dos usuários da Soul UP por meio de avatares digitais, como o Nexo, tornando a experiência mais clara, personalizada e envolvente." />

      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8 xl:grid-cols-4">
        {cards.map(([number, title, description]) => (
          <GlassCard key={number}>
            <span className="text-sm font-black text-cyan-300">{number}</span>
            <h2 className="mt-3 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-200/15 bg-white/[0.025] p-6 sm:p-8">
          <h2 className="text-2xl font-black sm:text-3xl">Jornada simplificada do usuário</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {journey.map(([number, title, description]) => (
              <article key={number} className="relative rounded-2xl border border-white/10 bg-black/20 p-5">
                <strong className="grid h-9 w-9 place-items-center rounded-full bg-emerald-300 text-sm text-[#00140f]">{number}</strong>
                <h3 className="mt-4 font-black text-cyan-100">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pt-6 sm:px-6 lg:grid-cols-2 lg:px-8">
        <GlassCard>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Tecnologias obrigatórias da Sprint 03</span>
          <h2 className="mt-3 text-2xl font-black">Front-end moderno e componentizado</h2>
          <p className="mt-4 text-sm leading-7 text-white/65">A solução foi migrada para React + Vite + TypeScript, com navegação SPA, Tailwind CSS, React Hook Form e organização modular.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'React Router DOM', 'React Hook Form', 'Git & GitHub'].map((tech) => (
              <span key={tech} className="rounded-full border border-cyan-200/20 bg-cyan-300/5 px-3 py-1.5 text-xs font-bold text-cyan-100">{tech}</span>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Roadmap da LumenAI</span>
          <div className="mt-5 space-y-4">
            {[
              ['1', 'Interface inicial', 'Páginas, navegação, identidade visual e primeiro avatar interativo.'],
              ['2', 'Interatividade', 'Missões, progresso, feedbacks e experiência gamificada no front-end.'],
              ['3', 'Inteligência', 'Integração da Lumen AI para interpretar mensagens, orientar usuários e personalizar respostas.'],
              ['4', 'Evolução futura', 'Integração com backend, banco de dados, dados reais da Soul UP e novos avatares ou interfaces.'],
            ].map(([number, title, description]) => (
              <div key={number} className="flex gap-4 rounded-2xl bg-black/20 p-4">
                <strong className="text-cyan-300">{number}</strong>
                <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-white/55">{description}</p></div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  )
}
