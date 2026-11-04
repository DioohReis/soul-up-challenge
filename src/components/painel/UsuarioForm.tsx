import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { UsuarioPayload } from '../../types/api'
import { botaoPrimario, botaoSecundario, campoErro, campoInput, campoLabel } from './estilos'

interface UsuarioFormProps {
  /** Quando informado, o formulário entra em modo edição (ID bloqueado). */
  usuarioEmEdicao?: UsuarioPayload | null
  ocupado: boolean
  onSalvar: (usuario: UsuarioPayload, editando: boolean) => Promise<boolean>
  onCancelar?: () => void
}

type Campos = { idUsuario: string; nome: string; email: string }

const vazio: Campos = { idUsuario: '', nome: '', email: '' }

export function UsuarioForm({ usuarioEmEdicao, ocupado, onSalvar, onCancelar }: UsuarioFormProps) {
  const editando = Boolean(usuarioEmEdicao)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Campos>({ defaultValues: vazio })

  useEffect(() => {
    reset(usuarioEmEdicao ? { idUsuario: String(usuarioEmEdicao.idUsuario), nome: usuarioEmEdicao.nome, email: usuarioEmEdicao.email } : vazio)
  }, [usuarioEmEdicao, reset])

  const enviar = handleSubmit(async (campos) => {
    const usuario: UsuarioPayload = { idUsuario: Number(campos.idUsuario), nome: campos.nome.trim(), email: campos.email.trim() }
    const salvou = await onSalvar(usuario, editando)
    if (salvou && !editando) reset(vazio)
  })

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <label className={campoLabel}>
        ID do usuário
        <input
          className={campoInput}
          type="number"
          inputMode="numeric"
          min={1}
          disabled={editando}
          placeholder="Ex.: 10"
          aria-invalid={Boolean(errors.idUsuario)}
          {...register('idUsuario', {
            required: 'Informe o ID.',
            validate: (valor) => (Number.isInteger(Number(valor)) && Number(valor) > 0) || 'O ID deve ser um número inteiro maior que zero.',
          })}
        />
        {errors.idUsuario && <span className={campoErro}>{errors.idUsuario.message}</span>}
      </label>

      <label className={campoLabel}>
        Nome
        <input
          className={campoInput}
          placeholder="Nome completo"
          aria-invalid={Boolean(errors.nome)}
          {...register('nome', { required: 'Informe o nome.', minLength: { value: 2, message: 'Use pelo menos 2 caracteres.' }, maxLength: { value: 100, message: 'Máximo de 100 caracteres.' } })}
        />
        {errors.nome && <span className={campoErro}>{errors.nome.message}</span>}
      </label>

      <label className={campoLabel}>
        E-mail
        <input
          className={campoInput}
          type="email"
          placeholder="nome@email.com"
          aria-invalid={Boolean(errors.email)}
          {...register('email', { required: 'Informe o e-mail.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Informe um e-mail válido.' } })}
        />
        {errors.email && <span className={campoErro}>{errors.email.message}</span>}
      </label>

      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" className={botaoPrimario} disabled={ocupado}>
          {ocupado ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar usuário'}
        </button>
        {editando && onCancelar && (
          <button type="button" className={botaoSecundario} onClick={onCancelar}>Cancelar</button>
        )}
      </div>
    </form>
  )
}
