import { useNavigate, useParams } from 'react-router-dom'
import { SocialIcon } from '../components/SocialIcon'
import { team } from '../data/team'

export function IntegranteDetalhe() {
  const { rm } = useParams<{ rm: string }>()
  const navigate = useNavigate()
  const member = team.find((item) => item.rm === rm)

  if (!member) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Rota dinâmica</span>
        <h1 className="mt-4 text-4xl font-black">Integrante não encontrado</h1>
        <p className="mt-4 text-white/60">O RM informado não corresponde a um integrante cadastrado nesta versão do front-end.</p>
        <button onClick={() => navigate('/integrantes')} className="mt-8 rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-[#00140f]">Voltar para integrantes</button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <button type="button" onClick={() => navigate('/integrantes')} className="mb-6 text-sm font-bold text-cyan-200 transition hover:text-cyan-100">← Voltar para integrantes</button>
      <section className="grid overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-black/25 shadow-neon lg:grid-cols-[0.8fr_1.2fr]">
        <div className="min-h-[420px] bg-[#002019]">
          <img src={member.imagem} alt={`Foto de ${member.nome}`} className="h-full w-full object-cover object-top" />
        </div>
        <div className="p-7 sm:p-10">
          <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.17em] text-cyan-100">Integrante selecionado</span>
          <h1 className="mt-5 text-4xl font-black sm:text-5xl">{member.nome}</h1>
          <p className="mt-3 text-lg font-bold text-emerald-200">{member.cargo}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/65">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">RM {member.rm}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Turma {member.turma}</span>
          </div>
          <p className="mt-7 text-base leading-8 text-white/65">{member.descricao}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={member.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 hover:border-cyan-200/50"><SocialIcon type="github" /> GitHub</a>
            <a href={member.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 hover:border-cyan-200/50"><SocialIcon type="linkedin" /> LinkedIn</a>
          </div>
        </div>
      </section>
    </main>
  )
}
