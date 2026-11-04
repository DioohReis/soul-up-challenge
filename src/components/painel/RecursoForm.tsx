import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { botaoPerigo, botaoPrimario, campoInput, campoLabel } from './estilos'

type ValorCampo = string | number | boolean

export type TipoCampo = 'texto' | 'numero' | 'area' | 'opcoes' | 'marcar'

/** Descrição de um campo do formulário, ligada a uma chave do tipo `T`. */
export interface CampoRecurso<T> {
  chave: Extract<keyof T, string>
  rotulo: string
  tipo: TipoCampo
  opcoes?: readonly string[]
  obrigatorio?: boolean
  min?: number
  max?: number
}

interface RecursoFormProps<T extends { [K in keyof T]: ValorCampo }> {
  titulo: string
  campos: CampoRecurso<T>[]
  /** Valores atuais vindos da API (`null` = ainda não cadastrado). */
  registro: T | null
  padrao: T
  ocupado: boolean
  onSalvar: (dados: T, existe: boolean) => Promise<void>
  onExcluir: () => Promise<void>
  children?: ReactNode
}

/** Formulário genérico de criação/edição para avatar, ação, missão e publicação. */
export function RecursoForm<T extends { [K in keyof T]: ValorCampo }>({ titulo, campos, registro, padrao, ocupado, onSalvar, onExcluir, children }: RecursoFormProps<T>) {
  const [valores, setValores] = useState<T>(registro ?? padrao)
  const [erro, setErro] = useState('')

  // Só reinicia o formulário quando o conteúdo vindo da API muda de verdade.
  const assinatura = JSON.stringify(registro ?? padrao)
  useEffect(() => {
    setValores(JSON.parse(assinatura) as T)
    setErro('')
  }, [assinatura])

  const alterar = (chave: keyof T, valor: ValorCampo) => setValores((atual) => ({ ...atual, [chave]: valor }))

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
    const faltando = campos.find((campo) => campo.obrigatorio && !String(valores[campo.chave] ?? '').trim())
    if (faltando) return setErro(`Preencha o campo "${faltando.rotulo}".`)
    const foraDoLimite = campos.find((campo) => campo.tipo === 'numero' && ((campo.min !== undefined && Number(valores[campo.chave]) < campo.min) || (campo.max !== undefined && Number(valores[campo.chave]) > campo.max)))
    if (foraDoLimite) return setErro(`"${foraDoLimite.rotulo}" deve estar entre ${foraDoLimite.min ?? '-∞'} e ${foraDoLimite.max ?? '∞'}.`)
    setErro('')
    void onSalvar(valores, registro !== null)
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4 md:grid-cols-2">
      {!registro && (
        <p className="rounded-xl border border-amber-300/30 bg-amber-300/[0.07] px-4 py-3 text-sm text-amber-100 md:col-span-2">
          Este usuário ainda não tem {titulo.toLowerCase()}. Preencha os campos e salve para criar (POST).
        </p>
      )}

      {campos.map((campo) => {
        const valor = valores[campo.chave]
        const largo = campo.tipo === 'area' ? 'md:col-span-2' : ''

        if (campo.tipo === 'marcar') {
          return (
            <label key={campo.chave} className={`${campoLabel} flex items-center gap-3 self-end py-3`}>
              <input type="checkbox" className="h-5 w-5 accent-emerald-300" checked={Boolean(valor)} onChange={(e) => alterar(campo.chave, e.target.checked)} />
              {campo.rotulo}
            </label>
          )
        }

        return (
          <label key={campo.chave} className={`${campoLabel} ${largo}`}>
            {campo.rotulo}{campo.obrigatorio && <span className="text-rose-300"> *</span>}
            {campo.tipo === 'opcoes' ? (
              <select className={campoInput} value={String(valor)} onChange={(e) => alterar(campo.chave, e.target.value)}>
                {campo.opcoes?.map((opcao) => <option key={opcao} value={opcao} className="bg-[#00231b]">{opcao}</option>)}
              </select>
            ) : campo.tipo === 'area' ? (
              <textarea className={campoInput} rows={3} maxLength={500} value={String(valor ?? '')} onChange={(e) => alterar(campo.chave, e.target.value)} />
            ) : (
              <input
                className={campoInput}
                type={campo.tipo === 'numero' ? 'number' : 'text'}
                min={campo.min}
                max={campo.max}
                value={String(valor ?? '')}
                onChange={(e) => alterar(campo.chave, campo.tipo === 'numero' ? Number(e.target.value) : e.target.value)}
              />
            )}
          </label>
        )
      })}

      {erro && <p role="alert" className="text-sm font-bold text-rose-300 md:col-span-2">{erro}</p>}

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <button type="submit" className={botaoPrimario} disabled={ocupado}>
          {ocupado ? 'Salvando…' : registro ? 'Salvar alterações (PUT)' : `Criar ${titulo.toLowerCase()} (POST)`}
        </button>
        {registro && (
          <button type="button" className={botaoPerigo} disabled={ocupado} onClick={() => { if (window.confirm(`Excluir ${titulo.toLowerCase()} deste usuário?`)) void onExcluir() }}>
            Excluir {titulo.toLowerCase()} (DELETE)
          </button>
        )}
      </div>

      {children && <div className="md:col-span-2">{children}</div>}
    </form>
  )
}
