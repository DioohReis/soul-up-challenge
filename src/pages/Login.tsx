import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { PageHero } from '../components/PageHero'

type LoginData = { email: string; senha: string }

type DemoUser = { nome: string; email: string; senha: string }

const users: DemoUser[] = [
  { nome: 'Diogo Guilherme', email: 'diogo@soulup.com', senha: 'diogo123' },
  { nome: 'Gabriel Ricardo', email: 'gabriel@soulup.com', senha: 'gabriel123' },
  { nome: 'Matheus Rodrigues', email: 'matheus@soulup.com', senha: 'matheus123' },
  { nome: 'Luiz Henrique', email: 'luiz@soulup.com', senha: 'luiz123' },
  { nome: 'Gabriel Razo', email: 'razo@soulup.com', senha: 'razo123' },
]

export function Login() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<{ open: boolean; success: boolean; title: string; message: string }>({ open: false, success: false, title: '', message: '' })
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginData>()

  function onSubmit(data: LoginData) {
    const user = users.find((item) => item.email.toLowerCase() === data.email.toLowerCase())
    if (!user) {
      setModal({ open: true, success: false, title: 'Usuário não cadastrado', message: 'Verifique o endereço digitado ou use uma das contas de demonstração.' })
      return
    }
    if (user.senha !== data.senha) {
      setModal({ open: true, success: false, title: 'Senha incorreta', message: 'A senha não corresponde ao usuário selecionado.' })
      return
    }
    localStorage.setItem('usuarioSoulUp', JSON.stringify({ nome: user.nome, email: user.email }))
    setModal({ open: true, success: true, title: `Bem-vindo, ${user.nome}!`, message: 'Login realizado localmente. Feche esta mensagem para abrir a experiência.' })
  }

  function closeModal() {
    const shouldNavigate = modal.success
    setModal((value) => ({ ...value, open: false }))
    if (shouldNavigate) navigate('/experiencia')
  }

  const field = 'mt-2 w-full rounded-xl border bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-200'

  return (
    <main className="pb-20">
      <PageHero tag="Acesso interativo" title="Entrar na Soul UP" description="Use uma conta de teste para simular autenticação apenas no front-end e personalizar a mensagem da Lumën." />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-3xl border border-cyan-200/15 bg-black/25 p-6 shadow-neon sm:p-8">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Login de demonstração</span>
          <h2 className="mt-3 text-2xl font-black">Identifique seu perfil</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">O estado do usuário é salvo com localStorage, sem backend e sem requisições HTTP.</p>

          <label className="mt-6 block text-sm font-bold text-white/80">E-mail
            <input type="email" autoComplete="email" placeholder="Digite seu e-mail" className={`${field} ${errors.email ? 'border-rose-400' : 'border-white/15'}`} {...register('email', { required: 'Informe o e-mail.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Digite um e-mail válido.' } })} />
            {errors.email && <span className="mt-2 block text-xs text-rose-300">{errors.email.message}</span>}
          </label>

          <label className="mt-5 block text-sm font-bold text-white/80">Senha
            <input type="password" autoComplete="current-password" placeholder="Digite sua senha" className={`${field} ${errors.senha ? 'border-rose-400' : 'border-white/15'}`} {...register('senha', { required: 'Informe a senha.' })} />
            {errors.senha && <span className="mt-2 block text-xs text-rose-300">{errors.senha.message}</span>}
          </label>

          <button type="submit" className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 text-sm font-black text-[#00140f] transition hover:brightness-110">Entrar e abrir experiência</button>
        </form>

        <aside className="rounded-3xl border border-emerald-200/15 bg-emerald-300/[0.035] p-6 sm:p-8">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Usuários cadastrados</span>
          <h2 className="mt-3 text-2xl font-black">Contas para teste</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">Clique em uma conta para preencher o formulário.</p>
          <div className="mt-6 grid gap-3">
            {users.map((user) => (
              <button key={user.email} type="button" onClick={() => { setValue('email', user.email, { shouldValidate: true }); setValue('senha', user.senha, { shouldValidate: true }) }} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-cyan-200/35 hover:bg-cyan-300/5">
                <strong className="block text-sm text-white">{user.nome}</strong>
                <span className="mt-1 block text-xs text-white/45">{user.email} • {user.senha}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <Modal open={modal.open} title={modal.title} onClose={closeModal}>
        <p className={modal.success ? 'text-emerald-100' : 'text-rose-100'}>{modal.message}</p>
      </Modal>
    </main>
  )
}
