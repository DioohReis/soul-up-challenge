import type { ErroApiCorpo, MetodoHttp } from '../types/api'

/** URL publicada da API Java no Render (usada se VITE_API_URL não for definida). */
const API_PADRAO = 'https://soulup-sprint4-java.onrender.com'

export const API_URL: string = (import.meta.env.VITE_API_URL || API_PADRAO).replace(/\/+$/, '')

/** Erro de API com o código HTTP (0 = sem conexão). */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function mensagemPadrao(status: number): string {
  if (status === 400) return 'Dados inválidos. Revise os campos e tente novamente.'
  if (status === 404) return 'Registro não encontrado na API.'
  if (status === 409) return 'Já existe um registro com esse ID.'
  if (status >= 500) return 'A API encontrou um erro interno. Tente novamente em instantes.'
  return `Erro ${status} ao chamar a API.`
}

function lerJson(texto: string): unknown {
  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

/**
 * Cliente HTTP único do projeto (fetch nativo, sem Axios).
 * Devolve o JSON tipado ou `null` quando a resposta vem sem corpo
 * (201 / 204 / registro inexistente).
 */
export async function requisicao<T>(metodo: MetodoHttp, caminho: string, corpo?: unknown): Promise<T | null> {
  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: corpo === undefined ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Ela está hospedada no Render e pode levar até 1 minuto para "acordar". Tente novamente.')
  }

  const texto = await resposta.text()
  const dados = texto ? lerJson(texto) : null

  if (!resposta.ok) {
    const erro = dados as ErroApiCorpo | null
    throw new ApiError(resposta.status, erro?.message || mensagemPadrao(resposta.status))
  }

  return dados as T | null
}

/**
 * GET de um registro que pode não existir. A API responde "não existe" de
 * duas formas (200 sem corpo ou 404); as duas viram `null`.
 */
export async function buscarOuNulo<T>(caminho: string): Promise<T | null> {
  try {
    return await requisicao<T>('GET', caminho)
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null
    throw erro
  }
}

/** Mensagem amigável a partir de qualquer erro capturado. */
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error) return erro.message
  return 'Ocorreu um erro inesperado.'
}
