import type {
  AcaoPayload,
  AvatarPayload,
  ComVinculo,
  EntidadesJornada,
  Missao,
  MissaoPayload,
  PublicacaoPayload,
  RecursoJornada,
  RespostaRealizacao,
  UsuarioComJornada,
} from '../types/api'
import { buscarOuNulo, requisicao } from './api'
import { usuarioService } from './usuarioService'

/** Remove o campo `usuarioVinculado` que algumas respostas trazem. */
function semVinculo<T extends object>(registro: ComVinculo<T> | null): T | null {
  if (!registro) return null
  const { usuarioVinculado, ...resto } = registro
  void usuarioVinculado
  return resto as T
}

/**
 * Fábrica de serviços CRUD para os recursos 1:1 do usuário
 * (`/avatar/{id}`, `/acao/{id}`, `/missao/{id}`, `/publicacao/{id}`).
 */
function criarServico<R extends RecursoJornada, P>(recurso: R) {
  type Entidade = EntidadesJornada[R]
  const url = (idUsuario: number) => `/${recurso}/${idUsuario}`

  return {
    async obter(idUsuario: number): Promise<Entidade | null> {
      return semVinculo(await buscarOuNulo<ComVinculo<Entidade>>(url(idUsuario)))
    },
    async criar(idUsuario: number, dados: P): Promise<void> {
      await requisicao<void>('POST', url(idUsuario), dados)
    },
    async atualizar(idUsuario: number, dados: P): Promise<void> {
      await requisicao<void>('PUT', url(idUsuario), dados)
    },
    async excluir(idUsuario: number): Promise<void> {
      await requisicao<void>('DELETE', url(idUsuario))
    },
  }
}

export const avatarService = criarServico<'avatar', AvatarPayload>('avatar')

export const acaoService = {
  ...criarServico<'acao', AcaoPayload>('acao'),
  /** POST /acao/{id}/realizacao — marca a ação como feita e soma pontos. */
  async realizar(idUsuario: number): Promise<number> {
    const resposta = await requisicao<RespostaRealizacao>('POST', `/acao/${idUsuario}/realizacao`)
    return resposta?.pontosGanhos ?? 0
  },
}

export const missaoService = {
  ...criarServico<'missao', MissaoPayload>('missao'),
  /** POST /missao/{id}/progresso — avança o progresso da missão. */
  avancar(idUsuario: number, incremento: number): Promise<Missao | null> {
    return requisicao<Missao>('POST', `/missao/${idUsuario}/progresso`, { incremento })
  },
}

export const publicacaoService = criarServico<'publicacao', PublicacaoPayload>('publicacao')

/** Busca o usuário e os 4 recursos da jornada em paralelo. */
export async function obterUsuarioComJornada(idUsuario: number): Promise<UsuarioComJornada | null> {
  const [usuario, avatar, acao, missao, publicacao] = await Promise.all([
    usuarioService.buscarPorId(idUsuario),
    avatarService.obter(idUsuario),
    acaoService.obter(idUsuario),
    missaoService.obter(idUsuario),
    publicacaoService.obter(idUsuario),
  ])
  if (!usuario) return null
  return { ...usuario, avatar, acao, missao, publicacao }
}
