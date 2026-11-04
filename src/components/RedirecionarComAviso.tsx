import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeedback, type TipoFeedback } from '../context/FeedbackContext'

interface RedirecionarComAvisoProps {
  para: string
  tipo: TipoFeedback
  titulo: string
  mensagem?: string
}

/** Mostra um aviso personalizado e redireciona o usuário (substitui o histórico). */
export function RedirecionarComAviso({ para, tipo, titulo, mensagem }: RedirecionarComAvisoProps) {
  const navigate = useNavigate()
  const { notificar } = useFeedback()
  const executado = useRef(false)

  useEffect(() => {
    if (executado.current) return
    executado.current = true
    notificar({ tipo, titulo, mensagem })
    navigate(para, { replace: true })
  }, [navigate, notificar, para, tipo, titulo, mensagem])

  return null
}
