/**
 * Tipos das respostas e requisições da API Java (Spring Boot) da SoulUp.
 * Todos os dados que chegam do back-end passam por estes tipos antes de
 * chegar aos componentes.
 */

// ---------------------------------------------------------------------------
// Union types — valores aceitos pelo back-end
// ---------------------------------------------------------------------------

export type Personalidade = 'Motivador' | 'Educativo' | 'Desafiador'
export type TipoAcao = 'Reciclagem' | 'Economia de energia' | 'Transporte Verde'
export type Dificuldade = 'Facil' | 'Medio' | 'Dificil'
export type CategoriaMissao = 'Reciclagem' | 'Energia' | 'Transporte' | 'Consumo'
export type StatusMissao = 'Pendente' | 'Em Andamento' | 'Concluida'
export type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** Recursos da jornada; cada um é acessado em `/{recurso}/{idUsuario}`. */
export type RecursoJornada = 'avatar' | 'acao' | 'missao' | 'publicacao'

// ---------------------------------------------------------------------------
// Interfaces — entidades devolvidas pela API
// ---------------------------------------------------------------------------

export interface Usuario {
  idUsuario: number
  nome: string
  email: string
  nivelEngajamento: string
  missoesCompletas: number
  pontosAcumulados: number
}

export interface Avatar {
  nomeAvatar: string
  personalidade: Personalidade
  totalInteracoes: number
}

export interface AcaoSustentavel {
  nomeAcao: string
  descricao: string
  tipoAcao: TipoAcao
  dificuldade: Dificuldade
  pontosGerados: number
  realizada: boolean
}

export interface Missao {
  titulo: string
  descricao: string
  categoria: CategoriaMissao
  pontosRecompensa: number
  progressoAtual: number
  metaProgresso: number
  concluida: boolean
  status: StatusMissao
}

export interface Publicacao {
  conteudo: string
  categoria: string
  publicada: boolean
  nomeAutor?: string
}

/** Corpo de erro padrão enviado pelo back-end (`{ "message": "..." }`). */
export interface ErroApiCorpo {
  message?: string
  error?: string
  status?: number
}

export interface RespostaRealizacao {
  pontosGanhos: number
}

// ---------------------------------------------------------------------------
// Payloads — o que o front envia (sem campos calculados pelo back-end)
// ---------------------------------------------------------------------------

export type UsuarioPayload = Pick<Usuario, 'idUsuario' | 'nome' | 'email'>
export type AvatarPayload = Avatar
export type AcaoPayload = Omit<AcaoSustentavel, 'realizada'>
export type MissaoPayload = Omit<Missao, 'concluida' | 'status' | 'metaProgresso'>
export type PublicacaoPayload = Omit<Publicacao, 'nomeAutor'>

/** Mapa recurso -> entidade, usado para tipar os serviços genéricos. */
export interface EntidadesJornada {
  avatar: Avatar
  acao: AcaoSustentavel
  missao: Missao
  publicacao: Publicacao
}

// ---------------------------------------------------------------------------
// Intersection types
// ---------------------------------------------------------------------------

/** Algumas respostas trazem o usuário dono do registro junto. */
export type ComVinculo<T> = T & { usuarioVinculado?: Partial<Usuario> }

/** Jornada completa: cada recurso pode ainda não ter sido cadastrado. */
export type JornadaUsuario = { [K in RecursoJornada]: EntidadesJornada[K] | null }

/** Usuário + toda a jornada dele, montado a partir de 5 requisições GET. */
export type UsuarioComJornada = Usuario & JornadaUsuario

// ---------------------------------------------------------------------------
// Estado de uma requisição (discriminated union)
// ---------------------------------------------------------------------------

export type EstadoRequisicao<T> =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string; codigo: number }
  | { status: 'sucesso'; dados: T }
