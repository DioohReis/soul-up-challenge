import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PageHero } from '../components/PageHero'

type ContactFormData = {
  nome: string
  email: string
  mensagem: string
}

export function Contato() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>()

  const onSubmit = () => {
    setSent(true)
    reset()
  }

  const fieldBase = 'mt-2 w-full rounded-xl border bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300/10'

  return (
    <main className="pb-20">
      <PageHero tag="Fale conosco" title="Entre em contato" description="Conte sua dúvida ou compartilhe uma sugestão para tornar a jornada Soul UP melhor." />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ['@', 'Email', 'lumen.ai@gmail.com', 'mailto:lumen.ai@gmail.com'],
            ['↗', 'Repositório', 'Soul UP Challenge', 'https://github.com/DioohReis/soul-up-challenge'],
            ['⌖', 'Endereço', 'São Paulo/SP - FIAP Paulista 1100', ''],
          ].map(([icon, label, value, href]) => (
            <article key={label} className="rounded-2xl border border-cyan-200/15 bg-black/20 p-5">
              <span className="text-xl text-cyan-300">{icon}</span>
              <strong className="mt-3 block">{label}</strong>
              {href ? <a className="mt-1 block break-all text-sm text-white/55 hover:text-cyan-200" href={href}>{value}</a> : <span className="mt-1 block text-sm leading-6 text-white/55">{value}</span>}
            </article>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} onChange={() => setSent(false)} noValidate className="rounded-3xl border border-cyan-200/15 bg-black/25 p-6 shadow-neon sm:p-8">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Contato direto</span>
          <h2 className="mt-3 text-2xl font-black">Mensagem rápida</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Todos os campos são obrigatórios. Este formulário é uma demonstração: sua mensagem não será enviada. Para falar com a equipe, use os canais ao lado.</p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold text-white/80">
              Nome
              <input
                autoComplete="name"
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={errors.nome ? 'contact-name-error' : undefined}
                className={`${fieldBase} ${errors.nome ? 'border-rose-400/80' : 'border-white/15'}`}
                placeholder="Digite seu nome"
                {...register('nome', { setValueAs: (value: string) => value.trim(), required: 'Informe seu nome.', minLength: { value: 2, message: 'Use pelo menos 2 caracteres.' } })}
              />
              {errors.nome && <span id="contact-name-error" role="alert" className="mt-2 block text-xs text-rose-300">{errors.nome.message}</span>}
            </label>

            <label className="text-sm font-bold text-white/80">
              E-mail
              <input
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={`${fieldBase} ${errors.email ? 'border-rose-400/80' : 'border-white/15'}`}
                placeholder="seuemail@exemplo.com"
                {...register('email', {
                  setValueAs: (value: string) => value.trim(),
                  required: 'Informe seu e-mail.',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Digite um e-mail válido.' },
                })}
              />
              {errors.email && <span id="contact-email-error" role="alert" className="mt-2 block text-xs text-rose-300">{errors.email.message}</span>}
            </label>

            <label className="text-sm font-bold text-white/80 sm:col-span-2">
              Mensagem
              <textarea
                rows={6}
                aria-invalid={Boolean(errors.mensagem)}
                aria-describedby={errors.mensagem ? 'contact-message-error' : undefined}
                className={`${fieldBase} resize-y ${errors.mensagem ? 'border-rose-400/80' : 'border-white/15'}`}
                placeholder="Escreva sua dúvida ou sugestão aqui"
                {...register('mensagem', { setValueAs: (value: string) => value.trim(), required: 'Escreva uma mensagem.', minLength: { value: 10, message: 'A mensagem deve ter pelo menos 10 caracteres.' } })}
              />
              {errors.mensagem && <span id="contact-message-error" role="alert" className="mt-2 block text-xs text-rose-300">{errors.mensagem.message}</span>}
            </label>
          </div>

          <button className="mt-6 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-6 py-3 text-sm font-black text-[#00140f] transition hover:brightness-110" type="submit">
            Testar mensagem
          </button>
          {sent && <p className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-200" role="status">Teste concluído! Todos os campos estão válidos. Esta demonstração não enviou nem armazenou sua mensagem.</p>}
        </form>
      </section>
    </main>
  )
}
