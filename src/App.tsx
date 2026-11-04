import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { RedirecionarComAviso } from './components/RedirecionarComAviso'
import { FeedbackProvider } from './context/FeedbackContext'

// Páginas carregadas sob demanda (code splitting): cada rota vira um arquivo .js
// separado no build e só é baixada quando o usuário acessa a página.
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Sobre = lazy(() => import('./pages/Sobre').then((m) => ({ default: m.Sobre })))
const Solucao = lazy(() => import('./pages/Solucao').then((m) => ({ default: m.Solucao })))
const Experiencia = lazy(() => import('./pages/Experiencia').then((m) => ({ default: m.Experiencia })))
const Painel = lazy(() => import('./pages/Painel').then((m) => ({ default: m.Painel })))
const UsuarioDetalhe = lazy(() => import('./pages/UsuarioDetalhe').then((m) => ({ default: m.UsuarioDetalhe })))
const Integrantes = lazy(() => import('./pages/Integrantes').then((m) => ({ default: m.Integrantes })))
const IntegranteDetalhe = lazy(() => import('./pages/IntegranteDetalhe').then((m) => ({ default: m.IntegranteDetalhe })))
const Contato = lazy(() => import('./pages/Contato').then((m) => ({ default: m.Contato })))
const Faq = lazy(() => import('./pages/Faq').then((m) => ({ default: m.Faq })))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

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
