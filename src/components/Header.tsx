import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'INÍCIO', end: true },
  { to: '/sobre', label: 'SOBRE' },
  { to: '/solucao', label: 'SOLUÇÃO' },
  { to: '/experiencia', label: 'EXPERIÊNCIA' },
  { to: '/integrantes', label: 'INTEGRANTES' },
  { to: '/contato', label: 'CONTATO' },
  { to: '/faq', label: 'FAQ' },
]

export function Header() {
  const { pathname } = useLocation()
  const isExperience = pathname === '/experiencia'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${isExperience ? 'border-[#dbe5f3] bg-[#f9fbff]/95' : 'border-cyan-300/15 bg-[#00140f]/90'}`}>
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Ir para a página inicial">
          {isExperience ? <span className="text-[30px] font-extrabold tracking-[-2px] text-[#102859]">soul·up</span> : <><img src="/image/logo.png" alt="Lumen AI" className="h-9 w-9 rounded-xl object-cover ring-1 ring-cyan-300/30" /><span className="hidden text-sm font-black tracking-[0.22em] text-cyan-100 sm:inline">LUMEN AI</span></>}
        </NavLink>

        <button
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((value) => !value)}
          className={`grid h-11 w-11 place-items-center rounded-xl border transition lg:hidden ${isExperience ? 'border-[#cbdcf9] bg-[#f0f5ff] text-[#235dc8]' : 'border-cyan-300/25 bg-black/20 text-cyan-100 hover:border-cyan-200/60'}`}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 w-full bg-current transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-full bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-full bg-current transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </span>
        </button>

        <nav
          id="menu-principal"
          aria-label="Menu principal"
          className={`${menuOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[4.5rem] flex-col gap-1 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${isExperience ? 'border-[#dbe5f3] bg-[#f8fbff]' : 'border-cyan-300/20 bg-[#001b15]/95'}`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 font-extrabold transition ${isExperience ? 'text-[10px] tracking-[0.075em]' : 'text-xs tracking-[0.12em]'} ${
                  isExperience ? (isActive ? 'bg-[#e9f0ff] text-[#235dc8] ring-1 ring-[#cbdcf9]' : 'text-[#64738c] hover:bg-[#e9f0ff]') : isActive
                    ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/45'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/login" onClick={() => setMenuOpen(false)} className={`rounded-full px-3 py-2 text-xs font-extrabold tracking-[0.12em] sm:hidden ${isExperience ? 'text-[#235dc8]' : 'text-cyan-100'}`}>LOGIN</NavLink>
        </nav>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `hidden rounded-full border px-4 py-2 text-xs font-extrabold tracking-[0.14em] transition sm:block ${
              isExperience ? 'border-[#cbdcf9] bg-[#f0f5ff] text-[#235dc8]' : isActive
                ? 'border-emerald-300 bg-emerald-300 text-[#00140f]'
                : 'border-cyan-300/35 text-white hover:border-cyan-200 hover:bg-cyan-300/10'
            }`
          }
        >
          LOGIN
        </NavLink>
      </div>
    </header>
  )
}
