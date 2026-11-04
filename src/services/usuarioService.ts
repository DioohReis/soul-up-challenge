import type { Usuario, UsuarioPayload } from '../types/api'
import { buscarOuNulo, requisicao } from './api'

const BASE = '/usuario'

/** Endpoints de usuário da API Java. */
export const usuarioService = {
  /** GET /usuario — lista todos os usuários. */
  async listar(): Promise<Usuario[]> {
    return (await requisicao<Usuario[]>('GET', BASE)) ?? []
  },

  /** GET /usuario/{id} — devolve `null` quando o usuário não existe. */
  buscarPorId(id: number): Promise<Usuario | null> {
    return buscarOuNulo<Usuario>(`${BASE}/${id}`)
  },

  /** POST /usuario — cadastra um novo usuário. */
  async criar(usuario: UsuarioPayload): Promise<void> {
    await requisicao<void>('POST', BASE, usuario)
  },

  /** PUT /usuario/{id} — atualiza nome e e-mail. */
  async atualizar(usuario: UsuarioPayload): Promise<void> {
    await requisicao<void>('PUT', `${BASE}/${usuario.idUsuario}`, usuario)
  },

  /** DELETE /usuario/{id} — remove o usuário e toda a jornada dele. */
  async excluir(id: number): Promise<void> {
    await requisicao<void>('DELETE', `${BASE}/${id}`)
  },
}
