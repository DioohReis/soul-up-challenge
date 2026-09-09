import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-cyan-300/10 bg-black/25">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 Soul UP. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link className="transition hover:text-cyan-200" to="/sobre">Sobre</Link>
          <Link className="transition hover:text-cyan-200" to="/contato">Contato</Link>
          <a className="transition hover:text-cyan-200" href="https://github.com/DioohReis/soul-up-challenge" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
