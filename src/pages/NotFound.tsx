import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">404</span>
      <h1 className="mt-4 text-5xl font-black">Página não encontrada</h1>
      <p className="mt-4 text-white/60">A rota acessada não faz parte da experiência atual da SoulUp.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-[#00140f]">Voltar ao início</Link>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <span className="w-full text-white/50">Ou tente uma destas páginas:</span>
        <Link to="/painel" className="rounded-full border border-cyan-300/30 px-4 py-2 font-bold text-white hover:bg-cyan-300/10">Painel</Link>
        <Link to="/experiencia" className="rounded-full border border-cyan-300/30 px-4 py-2 font-bold text-white hover:bg-cyan-300/10">Experiência</Link>
        <Link to="/faq" className="rounded-full border border-cyan-300/30 px-4 py-2 font-bold text-white hover:bg-cyan-300/10">FAQ</Link>
      </div>
    </main>
  )
}
