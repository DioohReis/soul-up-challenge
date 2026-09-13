import { Link } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { PageHero } from '../components/PageHero'

export function Solucao() {
  const flow = [
    ['1', 'Orientação inicial', 'O Nexo apresenta missões e sugestões de acordo com o progresso salvo nesta jornada.'],
    ['2', 'Missão recomendada', 'A interface mostra uma missão sustentável simples, com objetivo, recompensa e impacto esperado.'],
    ['3', 'Feedback visual', 'Após a ação, o usuário visualiza pontos, progresso, nível e próxima recomendação.'],
  ]

  return (
    <main className="pb-20">
      <PageHero tag="Solução do projeto" title="Como a Lumen AI funciona" description="A solução transforma tarefas, pontos e recompensas em uma jornada guiada, visual e simples de entender dentro da Soul UP." />

      <section className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {flow.map(([number, title, description]) => (
          <GlassCard key={number}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 font-black text-[#00140f]">{number}</span>
            <h2 className="mt-5 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <GlassCard className="bg-gradient-to-br from-cyan-300/10 to-transparent">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Lumen AI</span>
          <h2 className="mt-4 text-3xl font-black">Olá! Quer ganhar pontos hoje?</h2>
          <p className="mt-4 text-base leading-8 text-white/65">Complete uma missão rápida: escolha um tema sustentável e registre sua ação. Cada dificuldade oferece uma pontuação diferente.</p>
          <Link to="/experiencia" className="mt-7 inline-flex rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-6 py-3 text-sm font-black text-[#00140f] transition hover:brightness-110">
            Testar protótipo
          </Link>
        </GlassCard>

        <GlassCard>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Progresso demonstrativo</span>
          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between text-sm"><span className="text-white/60">Missão atual</span><strong>65%</strong></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-[65%] rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" /></div>
            </div>
            {[
              ['Pontos verdes', '1.280'],
              ['Nível', 'Eco Starter'],
              ['Próxima recompensa', 'Desconto sustentável'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm">
                <span className="text-white/55">{label}</span><strong className="text-right text-cyan-100">{value}</strong>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  )
}
