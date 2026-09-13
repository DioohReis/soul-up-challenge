import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const isExperience = useLocation().pathname === '/experiencia'
  return (
    <div className={`min-h-screen overflow-x-hidden selection:bg-cyan-300 selection:text-[#00140f] ${isExperience ? 'bg-[#f4f7fc] text-[#102951] [&_footer]:border-[#dbe5f3] [&_footer]:bg-[#edf2fa] [&_footer_p]:text-[#687d9d] [&_footer_a]:text-[#687d9d]' : 'bg-[#00140f] text-white'}`}>
      {!isExperience && <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_85%_35%,rgba(110,231,183,0.08),transparent_30%)]" />}
      <div className="relative z-10">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
