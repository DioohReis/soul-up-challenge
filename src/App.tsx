import { Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { RedirecionarComAviso } from './components/RedirecionarComAviso'
import { FeedbackProvider } from './context/FeedbackContext'
import { Contato } from './pages/Contato'
import { Experiencia } from './pages/Experiencia'
import { Faq } from './pages/Faq'
import { Home } from './pages/Home'
import { IntegranteDetalhe } from './pages/IntegranteDetalhe'
import { Integrantes } from './pages/Integrantes'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { Painel } from './pages/Painel'
import { Sobre } from './pages/Sobre'
import { Solucao } from './pages/Solucao'
import { UsuarioDetalhe } from './pages/UsuarioDetalhe'

export default function App() {
  return (
    <FeedbackProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* Rotas estáticas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/solucao" element={<Solucao />} />
          <Route path="/experiencia" element={<Experiencia />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/integrantes" element={<Integrantes />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas dinâmicas (com parâmetro) */}
          <Route path="/integrantes/:rm" element={<IntegranteDetalhe />} />
          <Route path="/painel/usuarios/:id" element={<UsuarioDetalhe />} />

          {/* Redirecionamentos */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/usuarios" element={<RedirecionarComAviso para="/painel" tipo="info" titulo="Os usuários agora ficam no Painel" mensagem="O endereço /usuarios mudou. Você foi levado para o Painel." />} />
          <Route path="/painel/usuarios" element={<RedirecionarComAviso para="/painel" tipo="info" titulo="Escolha um usuário" mensagem="Para ver uma jornada, selecione um usuário na lista do Painel." />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Analytics />
    </FeedbackProvider>
  )
}
