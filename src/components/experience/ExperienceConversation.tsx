import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { useForm } from 'react-hook-form'
import type { JourneyMessage } from '../../types/journey'
import { JourneyIcon } from './JourneyIcon'

type MessageForm = { message: string }

type ExperienceConversationProps = {
  messages: JourneyMessage[]
  thinking: boolean
  messageInputRef: MutableRefObject<HTMLInputElement | null>
  onSendMessage: (message: string) => boolean
  onListen: () => void
}

export function ExperienceConversation({
  messages,
  thinking,
  messageInputRef,
  onSendMessage,
  onListen,
}: ExperienceConversationProps) {
  const transcriptRef = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>({
    defaultValues: { message: '' },
    mode: 'onTouched',
  })
  const messageField = register('message', {
    required: 'Escreva uma mensagem para o Nexo.',
    setValueAs: (value: string) => value.trim(),
    maxLength: {
      value: 280,
      message: 'Use até 280 caracteres na mensagem.',
    },
  })

  useEffect(() => {
    const transcript = transcriptRef.current
    if (transcript) {
      transcript.scrollTop = transcript.scrollHeight
    }
  }, [messages, thinking])

  function submitMessage({ message }: MessageForm) {
    if (onSendMessage(message)) {
      reset()
    }
  }
  return (
    <section
      className="
min-w-0 rounded-[19px] border border-[#e0e8f3] bg-[#ffffffc7] p-[19px]
shadow-[0_6px_25px_#314c7404] lg:p-[21px]
"
      aria-labelledby="conversation-title"
    >
      <div
        className="
flex items-center gap-3 border-b border-[#e9eff7] pb-[17px] [&>svg]:ml-auto
[&>svg]:text-[#9bafcb] [&_h2]:text-[15px] [&_h2]:font-[650] [&_p]:mt-[3px] [&_p]:flex
[&_p]:items-center [&_p]:gap-[5px] [&_p]:text-[9px] [&_p]:text-[#8295ae]
"
      >
        <span
          className="
relative flex h-[38px] w-[43px] rotate-[-5deg] items-center justify-center gap-[13px]
rounded-[17px] border-[6px] border-[#e8f0fb] bg-[#102950] shadow-[0_3px_8px_#14376718]
after:absolute after:h-px after:w-[17px] after:bg-[#55c7ff] after:content-['']
[&_i]:z-[1] [&_i]:h-[7px] [&_i]:w-1.5 [&_i]:rounded-full [&_i]:bg-[#73ddff]
[&_i]:shadow-[0_0_6px_#36d5ff]
"
          aria-hidden="true"
        >
          <i />
          <i />
        </span>
        <div>
          <h2 id="conversation-title">Um papo com o Nexo</h2>
          <p>
            <span className="inline-block size-[5px] shrink-0 rounded-full bg-[#60d2b2] shadow-[0_0_6px_#66dbb945]" />{' '}
            Seu parceiro está por aqui
          </p>
        </div>
        <JourneyIcon
          name="chat"
          size={20}
        />
      </div>
      <div
        className="
h-[245px] overflow-y-auto overscroll-contain px-[3px] pt-3.5
[scrollbar-color:#cdddee_transparent] [scrollbar-width:thin] lg:h-[218px]
"
        ref={transcriptRef}
        role="log"
        aria-label="Mensagens da conversa"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="mb-4 text-center text-[7px] font-semibold tracking-[.13em] text-[#a0b0c5]">
          JUNTOS, UM PASSO DE CADA VEZ
        </div>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2.5 max-w-[91%] border px-3.5 py-3 [&>span]:mb-1 [&>span]:block [&>span]:text-[8px] [&>span]:font-bold [&>p]:text-[11px] [&>p]:leading-[1.8] [&>p]:[overflow-wrap:anywhere] ${message.role === 'user' ? 'ml-auto rounded-[12px_12px_3px_12px] border-[#2866ce] bg-[#2866ce] [&>span]:text-[#cbdffb] [&>p]:text-white' : 'rounded-[12px_12px_12px_3px] border-[#e4ecf8] bg-[#f0f5fc] [&>span]:text-[#688bc0] [&>p]:text-[#566e91]'}`}
          >
            <span>{message.role === 'user' ? 'Você' : 'Nexo'}</span>
            <p>{message.text}</p>
          </div>
        ))}
        {thinking && (
          <div
            className="
flex gap-1 p-3.5 [&_i]:size-[5px] [&_i]:animate-nexo-chat-pulse [&_i]:rounded-full
[&_i]:bg-[#769dd2] [&_i:nth-child(2)]:[animation-delay:.15s]
[&_i:nth-child(3)]:[animation-delay:.3s]
"
            role="status"
          >
            <i />
            <i />
            <i />
            <span className="sr-only">Nexo está preparando uma resposta</span>
          </div>
        )}
      </div>
      <div
        className="
mt-3.5 flex flex-wrap gap-[5px] [&_button]:flex [&_button]:min-h-9
[&_button]:items-center [&_button]:gap-[5px] [&_button]:rounded-[7px] [&_button]:border
[&_button]:border-[#dfe9f8] [&_button]:px-2 [&_button]:py-1.5 [&_button]:text-[8px]
[&_button]:text-[#6f88ac] [&_button:disabled]:opacity-50
[&_button:hover:enabled]:bg-[#eaf3ff] lg:[&_button]:min-h-[31px]
"
      >
        {['Uma missão para mim', 'Meu progresso', 'Preciso de um incentivo'].map((prompt) => (
          <button
            type="button"
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            disabled={thinking}
          >
            {prompt}
            <JourneyIcon
              name="arrow"
              size={12}
            />
          </button>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(submitMessage)}
        noValidate
        className="
mt-3.5 flex min-h-[47px] items-center gap-[5px] rounded-[11px] border border-[#dce7f5]
bg-[#fafcff] p-[5px] focus-within:border-[#93bae9]
focus-within:shadow-[0_0_0_3px_#2b7dd90a] lg:min-h-0 [&_input]:w-full [&_input]:min-w-0
[&_input]:bg-transparent [&_input]:p-[7px] [&_input]:text-[12px] [&_input]:text-[#27476f]
[&_input]:outline-none [&_input::placeholder]:text-[#9aabc1] lg:[&_input]:text-[10px]
[&_button]:grid [&_button]:h-[34px] [&_button]:w-9 [&_button]:shrink-0
[&_button]:place-items-center [&_button]:rounded-lg [&_button]:bg-[#2866ce]
[&_button]:text-white [&_button:disabled]:opacity-40
"
      >
        <label
          htmlFor="journey-message"
          className="sr-only"
        >
          Mensagem para o Nexo
        </label>
        <input
          id="journey-message"
          {...messageField}
          ref={(element) => {
            messageField.ref(element)
            messageInputRef.current = element
          }}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message
              ? 'journey-message-error journey-conversation-note'
              : 'journey-conversation-note'
          }
          onFocus={onListen}
          placeholder="Conte comigo. O que vamos fazer?"
          maxLength={280}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={thinking}
          aria-label="Enviar mensagem"
        >
          <JourneyIcon
            name="send"
            size={19}
          />
        </button>
      </form>
      {errors.message && (
        <p
          id="journey-message-error"
          role="alert"
          className="mt-2 text-[12px] text-red-700"
        >
          {errors.message.message}
        </p>
      )}
      <p
        id="journey-conversation-note"
        className="mt-2.5 text-center text-[8px] text-[#99a9bf]"
      >
        Conversa guiada · Seu progresso fica neste navegador
      </p>
    </section>
  )
}
