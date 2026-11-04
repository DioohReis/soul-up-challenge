import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, mensagemDeErro } from '../services/api'
import type { EstadoRequisicao } from '../types/api'

/**
 * Executa uma função assíncrona da camada de serviço e controla os estados
 * de carregamento, erro e sucesso. Ignora respostas de requisições antigas.
 */
export function useApiRequest<T>(carregar: () => Promise<T>) {
  const [estado, setEstado] = useState<EstadoRequisicao<T>>({ status: 'carregando' })
  const ultimaRequisicao = useRef(0)

  const recarregar = useCallback(async (silencioso = false) => {
    const atual = ++ultimaRequisicao.current
    if (!silencioso) setEstado({ status: 'carregando' })
    try {
      const dados = await carregar()
      if (atual === ultimaRequisicao.current) setEstado({ status: 'sucesso', dados })
    } catch (erro) {
      if (atual === ultimaRequisicao.current) {
        setEstado({ status: 'erro', mensagem: mensagemDeErro(erro), codigo: erro instanceof ApiError ? erro.status : -1 })
      }
    }
  }, [carregar])

  useEffect(() => {
    void recarregar()
  }, [recarregar])

  return { estado, recarregar }
}
