import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">404</span>
      <h1 className="mt-4 text-5xl font-black">Página não encontrada</h1>
      <p className="mt-4 text-white/60">A rota acessada não faz parte da experiência atual da Lumen AI.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-[#00140f]">Voltar ao início</Link>
    </main>
  )
}
