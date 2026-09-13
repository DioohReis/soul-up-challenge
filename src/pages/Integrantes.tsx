import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { SocialIcon } from '../components/SocialIcon'
import { TeamCarousel } from '../components/TeamCarousel'
import { team } from '../data/team'
import type { TeamMember } from '../types'

export function Integrantes() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<TeamMember>(team[0])

  return (
    <main className="pb-20">
      <PageHero
        tag="Equipe"
        title="Integrantes"
        description="Conheça quem faz parte da Soul UP. Explore o carrossel e selecione uma foto para conhecer o integrante e acessar seu perfil completo."
      />

      <section className="w-full">
        <TeamCarousel members={team} selectedRm={selected.rm} onSelect={setSelected} />
      </section>

      <section id="integrante-detalhes" className="mx-auto mt-10 max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8" aria-live="polite">
        <article className="grid overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-[#002019]/95 to-black/45 shadow-neon md:grid-cols-[minmax(260px,380px)_1fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-[#00140f] md:min-h-[430px]">
            <img src={selected.imagem} alt={`Foto de ${selected.nome}`} className="absolute inset-0 h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00140f]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#00140f]/40" />
            <span className="absolute bottom-5 left-5 rounded-full border border-emerald-200/30 bg-black/55 px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-emerald-100 backdrop-blur">
              RM {selected.rm}
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Integrante selecionado</span>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{selected.nome}</h2>
            <p className="mt-2 text-lg font-bold text-emerald-200">{selected.cargo}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Turma {selected.turma}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">RM {selected.rm}</span>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{selected.descricao}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={selected.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2.5 text-sm font-black text-white/75 transition hover:border-cyan-200/45 hover:text-cyan-100">
                <SocialIcon type="github" /> GitHub
              </a>
              <a href={selected.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2.5 text-sm font-black text-white/75 transition hover:border-cyan-200/45 hover:text-cyan-100">
                <SocialIcon type="linkedin" /> LinkedIn
              </a>
              <button type="button" onClick={() => navigate(`/integrantes/${selected.rm}`)} className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-2.5 text-sm font-black text-[#00140f] transition hover:-translate-y-0.5 hover:brightness-110">
                Ver perfil completo →
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
