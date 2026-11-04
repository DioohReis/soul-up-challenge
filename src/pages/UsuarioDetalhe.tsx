import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiBadge, ErrorState, LoadingState } from '../components/api/ApiFeedback'
import { GlassCard } from '../components/GlassCard'
import { botaoPerigo, botaoPrimario, botaoSecundario, campoInput } from '../components/painel/estilos'
import { RecursoForm, type CampoRecurso } from '../components/painel/RecursoForm'
import { UsuarioForm } from '../components/painel/UsuarioForm'
import { ProgressBar } from '../components/ProgressBar'
import { RedirecionarComAviso } from '../components/RedirecionarComAviso'
import { useFeedback } from '../context/FeedbackContext'
import { useApiRequest } from '../hooks/useApiRequest'
import { mensagemDeErro } from '../services/api'
import { acaoService, avatarService, missaoService, obterUsuarioComJornada, publicacaoService } from '../services/jornadaService'
import { usuarioService } from '../services/usuarioService'
import type {
  AcaoPayload,
  AvatarPayload,
  MissaoPayload,
  Personalidade,
  PublicacaoPayload,
  RecursoJornada,
  UsuarioComJornada,
  UsuarioPayload,
} from '../types/api'

// ---------------------------------------------------------------------------
// Configuração dos formulários de cada recurso
// ---------------------------------------------------------------------------

const PERSONALIDADES: readonly Personalidade[] = ['Motivador', 'Educativo', 'Desafiador']

const camposAvatar: CampoRecurso<AvatarPayload>[] = [
  { chave: 'nomeAvatar', rotulo: 'Nome do avatar', tipo: 'texto', obrigatorio: true },
  { chave: 'personalidade', rotulo: 'Personalidade', tipo: 'opcoes', opcoes: PERSONALIDADES },
  { chave: 'totalInteracoes', rotulo: 'Total de interações', tipo: 'numero', min: 0 },
]
const padraoAvatar: AvatarPayload = { nomeAvatar: 'Lumen.AI', personalidade: 'Motivador', totalInteracoes: 0 }

const camposAcao: CampoRecurso<AcaoPayload>[] = [
  { chave: 'nomeAcao', rotulo: 'Nome da ação', tipo: 'texto', obrigatorio: true },
  { chave: 'tipoAcao', rotulo: 'Tipo', tipo: 'opcoes', opcoes: ['Reciclagem', 'Economia de energia', 'Transporte Verde'] },
  { chave: 'descricao', rotulo: 'Descrição', tipo: 'area' },
  { chave: 'dificuldade', rotulo: 'Dificuldade', tipo: 'opcoes', opcoes: ['Facil', 'Medio', 'Dificil'] },
  { chave: 'pontosGerados', rotulo: 'Pontos gerados', tipo: 'numero', min: 0, max: 1000 },
]
const padraoAcao: AcaoPayload = { nomeAcao: '', descricao: '', tipoAcao: 'Reciclagem', dificuldade: 'Facil', pontosGerados: 20 }

const camposMissao: CampoRecurso<MissaoPayload>[] = [
  { chave: 'titulo', rotulo: 'Título', tipo: 'texto', obrigatorio: true },
  { chave: 'categoria', rotulo: 'Categoria', tipo: 'opcoes', opcoes: ['Reciclagem', 'Energia', 'Transporte', 'Consumo'] },
  { chave: 'descricao', rotulo: 'Descrição', tipo: 'area' },
  { chave: 'pontosRecompensa', rotulo: 'Recompensa (pontos)', tipo: 'numero', min: 0, max: 1000 },
  { chave: 'progressoAtual', rotulo: 'Progresso (0 a 100)', tipo: 'numero', min: 0, max: 100 },
]
const padraoMissao: MissaoPayload = { titulo: '', descricao: '', categoria: 'Reciclagem', pontosRecompensa: 50, progressoAtual: 0 }

const camposPublicacao: CampoRecurso<PublicacaoPayload>[] = [
  { chave: 'conteudo', rotulo: 'Conteúdo', tipo: 'area', obrigatorio: true },
  { chave: 'categoria', rotulo: 'Categoria', tipo: 'texto' },
  { chave: 'publicada', rotulo: 'Publicada', tipo: 'marcar' },
]
const padraoPublicacao: PublicacaoPayload = { conteudo: '', categoria: 'Reflexão', publicada: false }

const abas: { chave: RecursoJornada; titulo: string; icone: string }[] = [
  { chave: 'avatar', titulo: 'Avatar', icone: '🤖' },
  { chave: 'acao', titulo: 'Ação', icone: '♻️' },
  { chave: 'missao', titulo: 'Missão', icone: '🎯' },
  { chave: 'publicacao', titulo: 'Publicação', icone: '💬' },
]

/** A API pode devolver a personalidade em caixa alta (ex.: "DESAFIADOR"). */
function normalizarPersonalidade(valor: string): Personalidade {
  return PERSONALIDADES.find((p) => p.toLowerCase() === valor.toLowerCase()) ?? 'Motivador'
}

// ---------------------------------------------------------------------------
// Página — rota dinâmica /painel/usuarios/:id
// ---------------------------------------------------------------------------

export function UsuarioDetalhe() {
  const { id = '' } = useParams<{ id: string }>()
  const idUsuario = Number(id)
  const idValido = /^\d+$/.test(id) && idUsuario > 0

  const navigate = useNavigate()
  const { notificar } = useFeedback()
  const carregar = useCallback(() => (idValido ? obterUsuarioComJornada(idUsuario) : Promise.resolve(null)), [idValido, idUsuario])
  const { estado, recarregar } = useApiRequest<UsuarioComJornada | null>(carregar)

  const [aba, setAba] = useState<RecursoJornada>('avatar')
  const [ocupado, setOcupado] = useState(false)
  const [editandoUsuario, setEditandoUsuario] = useState(false)
  const [incremento, setIncremento] = useState(10)

  if (!idValido) {
    return <RedirecionarComAviso para="/painel" tipo="erro" titulo="ID inválido" mensagem={`"${id}" não é um ID de usuário válido. Escolha um usuário da lista.`} />
  }
  if (estado.status === 'carregando') {
    return <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6"><LoadingState mensagem={`Carregando a jornada do usuário #${idUsuario}…`} /></main>
  }
  if (estado.status === 'erro') {
    return (
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-20 sm:px-6">
        <ErrorState mensagem={estado.mensagem} onTentarNovamente={() => void recarregar()} />
        <Link to="/painel" className={botaoSecundario}>← Voltar ao painel</Link>
      </main>
    )
  }
  if (!estado.dados) {
    return <RedirecionarComAviso para="/painel" tipo="info" titulo={`Usuário #${idUsuario} não encontrado`} mensagem="Ele pode ter sido excluído. Você foi redirecionado para a lista de usuários." />
  }

  const usuario = estado.dados

  /** Executa uma operação de escrita, mostra feedback e recarrega os dados. */
  async function executar(operacao: () => Promise<string>, tituloErro = 'Não foi possível concluir') {
    setOcupado(true)
    try {
      const mensagem = await operacao()
      notificar({ tipo: 'sucesso', titulo: mensagem })
      await recarregar(true)
    } catch (erro) {
      notificar({ tipo: 'erro', titulo: tituloErro, mensagem: mensagemDeErro(erro) })
    } finally {
      setOcupado(false)
    }
  }

  async function salvarUsuario(dados: UsuarioPayload): Promise<boolean> {
    setOcupado(true)
    try {
      await usuarioService.atualizar(dados)
      notificar({ tipo: 'sucesso', titulo: 'Dados do usuário atualizados' })
      setEditandoUsuario(false)
      await recarregar(true)
      return true
    } catch (erro) {
      notificar({ tipo: 'erro', titulo: 'Não foi possível salvar', mensagem: mensagemDeErro(erro) })
      return false
    } finally {
      setOcupado(false)
    }
  }

  async function excluirUsuario() {
    if (!window.confirm(`Excluir ${usuario.nome} e toda a jornada dele? Essa ação não pode ser desfeita.`)) return
    setOcupado(true)
    try {
      await usuarioService.excluir(usuario.idUsuario)
      notificar({ tipo: 'sucesso', titulo: 'Usuário excluído', mensagem: `${usuario.nome} foi removido. Você voltou para a lista.` })
      navigate('/painel', { replace: true })
    } catch (erro) {
      notificar({ tipo: 'erro', titulo: 'Não foi possível excluir', mensagem: mensagemDeErro(erro) })
      setOcupado(false)
    }
  }

  const avatarAtual: AvatarPayload | null = usuario.avatar && { ...usuario.avatar, personalidade: normalizarPersonalidade(usuario.avatar.personalidade) }
  const acaoAtual: AcaoPayload | null = usuario.acao && { nomeAcao: usuario.acao.nomeAcao, descricao: usuario.acao.descricao ?? '', tipoAcao: usuario.acao.tipoAcao, dificuldade: usuario.acao.dificuldade, pontosGerados: usuario.acao.pontosGerados }
  const missaoAtual: MissaoPayload | null = usuario.missao && { titulo: usuario.missao.titulo, descricao: usuario.missao.descricao ?? '', categoria: usuario.missao.categoria, pontosRecompensa: usuario.missao.pontosRecompensa, progressoAtual: usuario.missao.progressoAtual }
  const publicacaoAtual: PublicacaoPayload | null = usuario.publicacao && { conteudo: usuario.publicacao.conteudo, categoria: usuario.publicacao.categoria ?? '', publicada: usuario.publicacao.publicada }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <nav aria-label="Navegação estrutural" className="flex flex-wrap items-center gap-2 text-sm text-white/55">
        <Link to="/painel" className="font-bold text-cyan-200 hover:text-cyan-100">Painel</Link>
        <span aria-hidden="true">/</span>
        <span>Usuário #{usuario.idUsuario}</span>
      </nav>

      {/* Cabeçalho do usuário */}
      <GlassCard className="space-y-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-2xl font-black text-[#00140f] sm:h-16 sm:w-16">
              {usuario.nome.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Jornada do usuário #{usuario.idUsuario}</span>
              <h1 className="mt-1 truncate text-3xl font-black text-white sm:text-4xl">{usuario.nome}</h1>
              <p className="truncate text-sm text-white/55">{usuario.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={botaoSecundario} onClick={() => setEditandoUsuario((v) => !v)}>{editandoUsuario ? 'Fechar edição' : 'Editar dados'}</button>
            <button type="button" className={botaoPerigo} disabled={ocupado} onClick={() => void excluirUsuario()}>Excluir usuário</button>
          </div>
        </div>

        {editandoUsuario && (
          <div className="rounded-2xl border border-cyan-200/15 bg-black/20 p-5 md:max-w-md">
            <UsuarioForm usuarioEmEdicao={{ idUsuario: usuario.idUsuario, nome: usuario.nome, email: usuario.email }} ocupado={ocupado} onSalvar={salvarUsuario} onCancelar={() => setEditandoUsuario(false)} />
          </div>
        )}

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['Nível', usuario.nivelEngajamento],
            ['Pontos', usuario.pontosAcumulados],
            ['Missões completas', usuario.missoesCompletas],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <dt className="text-xs font-black uppercase tracking-[0.16em] text-white/50">{rotulo}</dt>
              <dd className="mt-1 text-xl font-black text-white sm:text-2xl">{valor}</dd>
            </div>
          ))}
        </dl>
        <ApiBadge />
      </GlassCard>

      {/* Abas da jornada */}
      <GlassCard className="space-y-6">
        <div role="tablist" aria-label="Recursos da jornada" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {abas.map((item) => {
            const cadastrado = usuario[item.chave] !== null
            const ativo = aba === item.chave
            return (
              <button
                key={item.chave}
                id={`aba-${item.chave}`}
                role="tab"
                type="button"
                aria-selected={ativo}
                aria-controls={`painel-${item.chave}`}
                onClick={() => setAba(item.chave)}
                className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold tracking-[0.1em] transition ${ativo ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/45' : 'text-white/70 hover:bg-white/5'}`}
              >
                <span aria-hidden="true">{item.icone}</span>
                {item.titulo.toUpperCase()}
                <span className={`h-2 w-2 rounded-full ${cadastrado ? 'bg-emerald-300' : 'bg-amber-300'}`} title={cadastrado ? 'Cadastrado' : 'Pendente'} />
              </button>
            )
          })}
        </div>

        <section id={`painel-${aba}`} role="tabpanel" aria-labelledby={`aba-${aba}`}>
          {aba === 'avatar' && (
            <RecursoForm<AvatarPayload>
              titulo="Avatar" campos={camposAvatar} registro={avatarAtual} padrao={padraoAvatar} ocupado={ocupado}
              onSalvar={(dados, existe) => executar(async () => { await (existe ? avatarService.atualizar : avatarService.criar)(usuario.idUsuario, dados); return existe ? 'Avatar atualizado' : 'Avatar criado' })}
              onExcluir={() => executar(async () => { await avatarService.excluir(usuario.idUsuario); return 'Avatar removido' })}
            />
          )}

          {aba === 'acao' && (
            <RecursoForm<AcaoPayload>
              titulo="Ação sustentável" campos={camposAcao} registro={acaoAtual} padrao={padraoAcao} ocupado={ocupado}
              onSalvar={(dados, existe) => executar(async () => { await (existe ? acaoService.atualizar : acaoService.criar)(usuario.idUsuario, dados); return existe ? 'Ação atualizada' : 'Ação criada' })}
              onExcluir={() => executar(async () => { await acaoService.excluir(usuario.idUsuario); return 'Ação removida' })}
            >
              {usuario.acao && (
                <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200/15 bg-emerald-300/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-white/75">Status: <strong className={usuario.acao.realizada ? 'text-emerald-200' : 'text-amber-200'}>{usuario.acao.realizada ? 'Realizada ✔' : 'Pendente'}</strong></p>
                  {!usuario.acao.realizada && (
                    <button type="button" className={botaoPrimario} disabled={ocupado} onClick={() => void executar(async () => `Ação realizada! +${await acaoService.realizar(usuario.idUsuario)} pontos`)}>
                      Realizar ação e ganhar pontos
                    </button>
                  )}
                </div>
              )}
            </RecursoForm>
          )}

          {aba === 'missao' && (
            <RecursoForm<MissaoPayload>
              titulo="Missão" campos={camposMissao} registro={missaoAtual} padrao={padraoMissao} ocupado={ocupado}
              onSalvar={(dados, existe) => executar(async () => { await (existe ? missaoService.atualizar : missaoService.criar)(usuario.idUsuario, dados); return existe ? 'Missão atualizada' : 'Missão criada' })}
              onExcluir={() => executar(async () => { await missaoService.excluir(usuario.idUsuario); return 'Missão removida' })}
            >
              {usuario.missao && (
                <div className="space-y-4 rounded-2xl border border-emerald-200/15 bg-emerald-300/[0.035] p-4">
                  <div className="flex flex-wrap justify-between gap-2 text-sm text-white/75">
                    <span>Status: <strong className={usuario.missao.concluida ? 'text-emerald-200' : 'text-amber-200'}>{usuario.missao.status}</strong></span>
                    <span>{usuario.missao.progressoAtual}/{usuario.missao.metaProgresso}</span>
                  </div>
                  <ProgressBar label="Progresso da missão" value={usuario.missao.progressoAtual} max={usuario.missao.metaProgresso} className="h-3 overflow-hidden rounded-full bg-white/10" indicatorClassName="block h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" />
                  {!usuario.missao.concluida && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input aria-label="Incremento de progresso" className={`${campoInput} mt-0 w-24`} type="number" min={1} max={100} value={incremento} onChange={(e) => setIncremento(Number(e.target.value))} />
                      <button
                        type="button" className={botaoPrimario} disabled={ocupado}
                        onClick={() => void executar(async () => {
                          if (!Number.isInteger(incremento) || incremento <= 0) throw new Error('Informe um incremento inteiro maior que zero.')
                          const missao = await missaoService.avancar(usuario.idUsuario, incremento)
                          return missao?.concluida ? `Missão concluída! +${missao.pontosRecompensa} pontos` : 'Progresso atualizado'
                        })}
                      >
                        Avançar progresso
                      </button>
                    </div>
                  )}
                </div>
              )}
            </RecursoForm>
          )}

          {aba === 'publicacao' && (
            <RecursoForm<PublicacaoPayload>
              titulo="Publicação" campos={camposPublicacao} registro={publicacaoAtual} padrao={padraoPublicacao} ocupado={ocupado}
              onSalvar={(dados, existe) => executar(async () => { await (existe ? publicacaoService.atualizar : publicacaoService.criar)(usuario.idUsuario, dados); return existe ? 'Publicação atualizada' : 'Publicação criada' })}
              onExcluir={() => executar(async () => { await publicacaoService.excluir(usuario.idUsuario); return 'Publicação removida' })}
            >
              {usuario.publicacao && (
                <blockquote className="rounded-2xl border border-cyan-200/15 bg-black/20 p-4 text-sm text-white/75">
                  <p className="whitespace-pre-wrap break-words">“{usuario.publicacao.conteudo}”</p>
                  <footer className="mt-2 text-xs text-white/45">
                    {usuario.publicacao.nomeAutor ?? usuario.nome} · {usuario.publicacao.categoria} · {usuario.publicacao.publicada ? 'Publicada' : 'Rascunho'}
                  </footer>
                </blockquote>
              )}
            </RecursoForm>
          )}
        </section>
      </GlassCard>
    </main>
  )
}
