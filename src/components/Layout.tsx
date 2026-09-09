import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#00140f] text-white selection:bg-cyan-300 selection:text-[#00140f]">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_85%_35%,rgba(110,231,183,0.08),transparent_30%)]" />
      <div className="relative z-10">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
