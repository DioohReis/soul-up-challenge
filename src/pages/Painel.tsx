import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiBadge, EmptyState, ErrorState, LoadingState } from '../components/api/ApiFeedback'
import { GlassCard } from '../components/GlassCard'
import { PageHero } from '../components/PageHero'
import { botaoPerigo, botaoSecundario, campoInput } from '../components/painel/estilos'
import { UsuarioForm } from '../components/painel/UsuarioForm'
import { useFeedback } from '../context/FeedbackContext'
import { useApiRequest } from '../hooks/useApiRequest'
import { mensagemDeErro } from '../services/api'
import { usuarioService } from '../services/usuarioService'
import type { Usuario, UsuarioPayload } from '../types/api'

type Ordenacao = 'id' | 'nome' | 'pontos'

const ordenadores: Record<Ordenacao, (a: Usuario, b: Usuario) => number> = {
  id: (a, b) => a.idUsuario - b.idUsuario,
  nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  pontos: (a, b) => b.pontosAcumulados - a.pontosAcumulados,
}

export function Painel() {
  const navigate = useNavigate()
  const { notificar } = useFeedback()
  const listarUsuarios = useCallback(() => usuarioService.listar(), [])
  const { estado, recarregar } = useApiRequest(listarUsuarios)

  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('id')
  const [emEdicao, setEmEdicao] = useState<UsuarioPayload | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const usuarios = estado.status === 'sucesso' ? estado.dados : []

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return usuarios
      .filter((u) => !termo || `${u.idUsuario} ${u.nome} ${u.email}`.toLowerCase().includes(termo))
      .sort(ordenadores[ordenacao])
  }, [usuarios, busca, ordenacao])

  const totalPontos = usuarios.reduce((soma, u) => soma + u.pontosAcumulados, 0)
  const totalMissoes = usuarios.reduce((soma, u) => soma + u.missoesCompletas, 0)

  async function salvarUsuario(usuario: UsuarioPayload, editando: boolean): Promise<boolean> {
    setOcupado(true)
    try {
      if (editando) {
        await usuarioService.atualizar(usuario)
        notificar({ tipo: 'sucesso', titulo: 'Usuário atualizado', mensagem: `${usuario.nome} foi atualizado no banco de dados.` })
        setEmEdicao(null)
        await recarregar(true)
      } else {
        await usuarioService.criar(usuario)
        notificar({ tipo: 'sucesso', titulo: 'Usuário cadastrado!', mensagem: `Agora monte a jornada de ${usuario.nome}.` })
        navigate(`/painel/usuarios/${usuario.idUsuario}`)
      }
      return true
    } catch (erro) {
      notificar({ tipo: 'erro', titulo: 'Não foi possível salvar', mensagem: mensagemDeErro(erro) })
      return false
    } finally {
      setOcupado(false)
    }
  }

  async function excluirUsuario(usuario: Usuario) {
    if (!window.confirm(`Excluir ${usuario.nome} (ID ${usuario.idUsuario}) e toda a jornada dele?`)) return
    setOcupado(true)
    try {
      await usuarioService.excluir(usuario.idUsuario)
      if (emEdicao?.idUsuario === usuario.idUsuario) setEmEdicao(null)
      notificar({ tipo: 'sucesso', titulo: 'Usuário excluído', mensagem: `${usuario.nome} e seus registros foram removidos.` })
      await recarregar(true)
    } catch (erro) {
      notificar({ tipo: 'erro', titulo: 'Não foi possível excluir', mensagem: mensagemDeErro(erro) })
    } finally {
      setOcupado(false)
    }
  }

  const iniciarEdicao = (u: Usuario) => {
    setEmEdicao({ idUsuario: u.idUsuario, nome: u.nome, email: u.email })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="pb-20">
      <PageHero
        tag="Painel · API Java"
        title="Usuários e jornadas sustentáveis"
        description="Dados reais vindos da API Spring Boot da SoulUp: cadastre usuários, acompanhe pontos e abra a jornada de cada um para gerenciar avatar, ações, missões e publicações."
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['Usuários', estado.status === 'sucesso' ? usuarios.length : '—'],
            ['Pontos acumulados', estado.status === 'sucesso' ? totalPontos : '—'],
            ['Missões completas', estado.status === 'sucesso' ? totalMissoes : '—'],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="rounded-2xl border border-cyan-200/15 bg-black/25 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">{rotulo}</p>
              <p className="mt-1 text-2xl font-black text-white sm:text-3xl">{valor}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <GlassCard className="h-fit">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              {emEdicao ? `Editar usuário #${emEdicao.idUsuario}` : 'Novo usuário'}
            </span>
            <p className="mb-5 mt-2 text-sm text-white/55">{emEdicao ? 'Altere nome ou e-mail (PUT /usuario/{id}).' : 'Cadastro enviado via POST /usuario.'}</p>
            <UsuarioForm usuarioEmEdicao={emEdicao} ocupado={ocupado} onSalvar={salvarUsuario} onCancelar={() => setEmEdicao(null)} />
          </GlassCard>

          <GlassCard className="min-w-0">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Usuários cadastrados</span>
                <ApiBadge />
              </div>
              <button type="button" className={botaoSecundario} onClick={() => void recarregar()}>↻ Recarregar</button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input className={`${campoInput} mt-0`} placeholder="Buscar por ID, nome ou e-mail" aria-label="Buscar usuários" value={busca} onChange={(e) => setBusca(e.target.value)} />
              <select className={`${campoInput} mt-0 sm:w-44`} aria-label="Ordenar por" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}>
                <option value="id" className="bg-[#00231b]">Ordenar: ID</option>
                <option value="nome" className="bg-[#00231b]">Ordenar: Nome</option>
                <option value="pontos" className="bg-[#00231b]">Ordenar: Pontos</option>
              </select>
            </div>

            {/* Contador de usuários (Issue #30) */}
            {estado.status === 'sucesso' && usuarios.length > 0 && (
              <p className="mt-3 text-xs text-white/50">Exibindo {filtrados.length} de {usuarios.length} usuários</p>
            )}

            {/* Botão para limpar a busca (Issue #31) */}
            {busca && (
              <button type="button" className={`${botaoSecundario} mt-3`} onClick={() => setBusca('')}>✕ Limpar busca</button>
            )}

            <div className="mt-5">
              {estado.status === 'carregando' && <LoadingState mensagem="Buscando usuários na API…" />}
              {estado.status === 'erro' && <ErrorState mensagem={estado.mensagem} onTentarNovamente={() => void recarregar()} />}
              {estado.status === 'sucesso' && usuarios.length === 0 && (
                <EmptyState titulo="Nenhum usuário cadastrado ainda" descricao="Use o formulário ao lado para cadastrar o primeiro usuário." />
              )}
              {estado.status === 'sucesso' && usuarios.length > 0 && filtrados.length === 0 && (
                <EmptyState titulo="Nenhum resultado" descricao={`Nenhum usuário corresponde a "${busca}".`} />
              )}

              {filtrados.length > 0 && (
                <>
                  {/* Mobile / tablet pequeno: cartões */}
                  <ul className="grid gap-3 md:hidden">
                    {filtrados.map((u) => (
                      <li key={u.idUsuario} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={`/painel/usuarios/${u.idUsuario}`} className="block truncate font-black text-white hover:text-cyan-200">{u.nome}</Link>
                            <p className="truncate text-xs text-white/50">{u.email}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-xs text-white/60">#{u.idUsuario}</span>
                        </div>
                        <p className="mt-3 text-xs text-white/65">{u.nivelEngajamento} · <strong className="text-emerald-200">{u.pontosAcumulados} pts</strong> · {u.missoesCompletas} missão(ões)</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link to={`/painel/usuarios/${u.idUsuario}`} className={botaoSecundario}>Ver jornada</Link>
                          <button type="button" className={botaoSecundario} onClick={() => iniciarEdicao(u)}>Editar</button>
                          <button type="button" className={botaoPerigo} disabled={ocupado} onClick={() => void excluirUsuario(u)}>Excluir</button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Tablet grande / desktop: tabela */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs uppercase tracking-[0.12em] text-white/50">
                        <tr>
                          <th scope="col" className="py-2 pr-3">ID</th>
                          <th scope="col" className="pr-3">Usuário</th>
                          <th scope="col" className="hidden pr-3 lg:table-cell">Nível</th>
                          <th scope="col" className="pr-3">Pontos</th>
                          <th scope="col" className="hidden pr-3 xl:table-cell">Missões</th>
                          <th scope="col" className="text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtrados.map((u) => (
                          <tr key={u.idUsuario} className="border-t border-white/10 transition hover:bg-white/[0.03]">
                            <td className="py-3 pr-3 text-white/60">{u.idUsuario}</td>
                            <td className="max-w-[220px] pr-3">
                              <Link to={`/painel/usuarios/${u.idUsuario}`} className="block truncate font-bold text-white hover:text-cyan-200">{u.nome}</Link>
                              <span className="block truncate text-xs text-white/45">{u.email}</span>
                            </td>
                            <td className="hidden pr-3 text-white/80 lg:table-cell">{u.nivelEngajamento}</td>
                            <td className="pr-3 font-bold text-emerald-200">{u.pontosAcumulados}</td>
                            <td className="hidden pr-3 text-white/80 xl:table-cell">{u.missoesCompletas}</td>
                            <td className="whitespace-nowrap py-3 text-right">
                              <div className="inline-flex gap-2">
                                <Link to={`/painel/usuarios/${u.idUsuario}`} className={botaoSecundario}>Jornada</Link>
                                <button type="button" className={botaoSecundario} onClick={() => iniciarEdicao(u)}>Editar</button>
                                <button type="button" className={botaoPerigo} disabled={ocupado} onClick={() => void excluirUsuario(u)}>Excluir</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  )
}
