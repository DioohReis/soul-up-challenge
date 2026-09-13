import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { EcologicalProblem } from '../../types'

type ConversationForm = {
  message: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'nexo'
  content: string
}

export type NexoReplyContext = {
  message: string
  userName: string
  problem: EcologicalProblem
  points: number
  completed: number
  levelName: string
}

export type NexoReplyProvider = (context: NexoReplyContext) => Promise<string>

type NexoConversationProps = {
  userName: string
  currentProblem: EcologicalProblem
  problems: EcologicalProblem[]
  points: number
  completed: number
  levelName: string
  onProblemChange: (problemId: string) => void
  onRevealMissions: () => void
  replyProvider?: NexoReplyProvider
}

const quickPrompts = [
  'Quero uma missão rápida',
  'Como está meu progresso?',
  'Como funcionam as recompensas?',
]

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  }
}

export function NexoConversation({
  userName,
  currentProblem,
  problems,
  points,
  completed,
  levelName,
  onProblemChange,
  onRevealMissions,
  replyProvider,
}: NexoConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage(
      'nexo',
      `Olá, ${userName}. Eu sou o Nexo. Posso te ajudar a transformar pequenas ações em progresso visível. Por onde você quer começar?`,
    ),
  ])
  const [thinking, setThinking] = useState(false)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const lastProblemIdRef = useRef(currentProblem.id)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConversationForm>({
    defaultValues: { message: '' },
  })

  const context = useMemo(
    () => ({
      userName,
      currentProblem,
      points,
      completed,
      levelName,
    }),
    [completed, currentProblem, levelName, points, userName],
  )

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, thinking])

  useEffect(() => {
    if (lastProblemIdRef.current === currentProblem.id) return
    lastProblemIdRef.current = currentProblem.id

    setMessages((current) => [
      ...current,
      createMessage(
        'nexo',
        `Ótima escolha. Agora estamos falando sobre ${currentProblem.titulo}. ${currentProblem.mensagem}`,
      ),
    ])
  }, [currentProblem])

  async function getLocalReply(message: string): Promise<string> {
    const normalized = message.toLocaleLowerCase('pt-BR')

    if (normalized.includes('missão') || normalized.includes('missao') || normalized.includes('quest')) {
      const easyQuest = currentProblem.quests.find((quest) => quest.dificuldade === 'facil') ?? currentProblem.quests[0]
      onRevealMissions()
      return `Para começar sem fricção, eu recomendo “${easyQuest.titulo}”. Ela vale ${easyQuest.pontos} pontos e leva ${easyQuest.tempo}. Abri as missões logo abaixo para você escolher.`
    }

    if (normalized.includes('progresso') || normalized.includes('ponto') || normalized.includes('nível') || normalized.includes('nivel')) {
      return `Você está no nível ${levelName}, com ${points} pontos e ${completed} missão${completed === 1 ? '' : 'ões'} concluída${completed === 1 ? '' : 's'}. O mais importante agora é manter constância, não velocidade.`
    }

    if (normalized.includes('recompensa') || normalized.includes('ganho') || normalized.includes('benefício') || normalized.includes('beneficio')) {
      return 'Nesta experiência, cada missão concluída gera pontos, feedback visual e avanço de nível. A estrutura foi preparada para receber recompensas mais personalizadas quando a camada de IA generativa for conectada em uma etapa futura.'
    }

    if (normalized.includes('tema') || normalized.includes('problema')) {
      return `No momento estamos em ${currentProblem.titulo}. Você pode trocar de tema pelos atalhos abaixo e eu adapto a conversa ao novo contexto.`
    }

    return `Entendi. Nesta Sprint 03 eu estou operando em modo guiado local, sem consumo de API. Posso falar sobre ${currentProblem.titulo}, sugerir uma missão, explicar seu progresso ou mostrar como as recompensas funcionam.`
  }

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim()
    if (!message || thinking) return

    setMessages((current) => [...current, createMessage('user', message)])
    setThinking(true)

    try {
      const reply = replyProvider
        ? await replyProvider({
            message,
            userName: context.userName,
            problem: context.currentProblem,
            points: context.points,
            completed: context.completed,
            levelName: context.levelName,
          })
        : await getLocalReply(message)

      setMessages((current) => [...current, createMessage('nexo', reply)])
    } catch {
      setMessages((current) => [
        ...current,
        createMessage('nexo', 'Não consegui processar essa mensagem agora. Tente novamente em alguns instantes.'),
      ])
    } finally {
      setThinking(false)
    }
  }

  function submitForm(values: ConversationForm) {
    void sendMessage(values.message)
    reset()
  }

  return (
    <section className="rounded-[2rem] border border-soul-blue/15 bg-white/85 p-4 shadow-[0_28px_70px_rgba(7,26,71,0.12)] backdrop-blur-xl sm:p-5" aria-label="Conversa com o Nexo">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-soul-blue/10 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.17em] text-soul-blue">Conversa guiada</span>
          <h2 className="mt-1 text-xl font-black text-soul-navy sm:text-2xl">Fale com o Nexo</h2>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-soul-blue/15 bg-soul-mist px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-soul-navy/65">
          <span className="h-2 w-2 animate-nexo-signal rounded-full bg-soul-blue" />
          Modo local • pronto para IA
        </span>
      </div>

      <div ref={transcriptRef} className="mt-4 max-h-[330px] space-y-3 overflow-y-auto pr-1" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${message.role === 'user' ? 'rounded-br-md bg-soul-blue text-white shadow-[0_10px_22px_rgba(31,95,224,0.18)]' : 'rounded-bl-md border border-soul-blue/10 bg-soul-mist text-soul-navy/80'}`}>
              <span className={`mb-1 block text-[9px] font-black uppercase tracking-[0.14em] ${message.role === 'user' ? 'text-white/65' : 'text-soul-blue/65'}`}>
                {message.role === 'user' ? 'Você' : 'Nexo'}
              </span>
              {message.content}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-soul-blue/10 bg-soul-mist px-4 py-3" aria-label="Nexo está preparando uma resposta">
              <span className="h-2 w-2 animate-nexo-signal rounded-full bg-soul-blue" />
              <span className="h-2 w-2 animate-nexo-signal rounded-full bg-soul-blue [animation-delay:120ms]" />
              <span className="h-2 w-2 animate-nexo-signal rounded-full bg-soul-blue [animation-delay:240ms]" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => void sendMessage(prompt)} disabled={thinking} className="rounded-full border border-soul-blue/15 bg-white px-3 py-2 text-xs font-bold text-soul-navy/70 transition hover:-translate-y-0.5 hover:border-soul-blue/35 hover:text-soul-blue disabled:cursor-not-allowed disabled:opacity-50">
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-soul-blue/10 bg-soul-cloud p-3">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/45">Trocar contexto</span>
        <div className="mt-2 flex flex-wrap gap-2" role="tablist" aria-label="Temas da conversa">
          {problems.map((problem) => (
            <button key={problem.id} type="button" onClick={() => onProblemChange(problem.id)} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${currentProblem.id === problem.id ? 'border-soul-blue bg-soul-blue text-white shadow-[0_8px_20px_rgba(31,95,224,0.16)]' : 'border-soul-blue/12 bg-white text-soul-navy/60 hover:border-soul-blue/30 hover:text-soul-blue'}`}>
              {problem.titulo}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="mt-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="nexo-message">Mensagem para o Nexo</label>
          <input
            id="nexo-message"
            type="text"
            placeholder="Pergunte sobre uma missão, seus pontos ou recompensas..."
            {...register('message', {
              required: 'Digite uma mensagem antes de enviar.',
              minLength: { value: 3, message: 'Use pelo menos 3 caracteres.' },
              maxLength: { value: 220, message: 'Use no máximo 220 caracteres.' },
            })}
            className="min-h-12 flex-1 rounded-2xl border border-soul-blue/15 bg-white px-4 text-sm text-soul-navy outline-none placeholder:text-soul-navy/35 focus:border-soul-blue focus:ring-2 focus:ring-soul-blue/10"
          />
          <button type="submit" disabled={thinking} className="min-h-12 rounded-2xl bg-soul-navy px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-soul-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soul-blue disabled:cursor-not-allowed disabled:opacity-50">
            Enviar
          </button>
        </div>
        {errors.message && <p className="mt-2 text-xs font-semibold text-[#b42318]">{errors.message.message}</p>}
      </form>
    </section>
  )
}
