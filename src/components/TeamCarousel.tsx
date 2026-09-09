import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import type { TeamMember } from '../types'

type TeamCarouselProps = {
  members: TeamMember[]
  selectedRm?: string
  onSelect: (member: TeamMember) => void
}

/**
 * O projeto original completava uma volta em aproximadamente 20 segundos.
 *
 * 360 / 20 = 18 graus por segundo.
 */
const AUTO_ROTATION_SPEED = 18

/**
 * Sensibilidade do movimento quando o usuário arrasta o carrossel.
 */
const DRAG_SENSITIVITY = 0.35

export function TeamCarousel({
  members,
  selectedRm,
  onSelect,
}: TeamCarouselProps) {
  const ringRef = useRef<HTMLDivElement>(null)

  const rotationRef = useRef(0)

  const animationFrameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)

  const mouseInsideRef = useRef(false)
  const focusInsideRef = useRef(false)
  const draggingRef = useRef(false)

  const pointerIdRef = useRef<number | null>(null)

  const pointerStartXRef = useRef(0)
  const lastPointerXRef = useRef(0)
  const dragDistanceRef = useRef(0)

  const suppressClickUntilRef = useRef(0)

  const reducedMotionRef = useRef(false)

  const quantity = members.length

  const itemAngle =
    quantity > 0
      ? 360 / quantity
      : 0

  /**
   * Atualiza apenas o transform do carrossel.
   *
   * Não usamos setState a cada frame porque isso faria
   * React renderizar o componente aproximadamente 60 vezes
   * por segundo.
   *
   * Com ref, somente o transform do DOM é atualizado.
   */
  const paintRotation = useCallback(() => {
    if (!ringRef.current) return

    ringRef.current.style.transform = `
      perspective(var(--carousel-perspective))
      rotateX(var(--carousel-tilt))
      rotateY(${rotationRef.current}deg)
    `
  }, [])

  /**
   * Acessibilidade:
   * se o usuário tiver redução de movimento ativada no SO,
   * a rotação automática é desativada.
   *
   * Ainda é possível interagir manualmente.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches
    }

    updatePreference()

    mediaQuery.addEventListener(
      'change',
      updatePreference,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        updatePreference,
      )
    }
  }, [])

  /**
   * Rotação automática.
   *
   * requestAnimationFrame deixa o movimento muito mais natural
   * que atualizar state usando setInterval.
   */
  useEffect(() => {
    if (quantity <= 1) return undefined

    function animate(time: number) {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = time
      }

      /**
       * Limitamos o delta para evitar saltos grandes,
       * por exemplo ao voltar para uma aba que ficou inativa.
       */
      const deltaSeconds = Math.min(
        (time - lastFrameTimeRef.current) / 1000,
        0.05,
      )

      lastFrameTimeRef.current = time

      const shouldRotate =
        !mouseInsideRef.current &&
        !focusInsideRef.current &&
        !draggingRef.current &&
        !reducedMotionRef.current

      if (shouldRotate) {
        rotationRef.current +=
          AUTO_ROTATION_SPEED * deltaSeconds

        /**
         * Evita que o valor cresça infinitamente.
         */
        if (rotationRef.current >= 360) {
          rotationRef.current -= 360
        }

        paintRotation()
      }

      animationFrameRef.current =
        window.requestAnimationFrame(animate)
    }

    animationFrameRef.current =
      window.requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        )
      }

      animationFrameRef.current = null
      lastFrameTimeRef.current = null
    }
  }, [paintRotation, quantity])

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    /**
     * Impede clique com botão direito do mouse
     * de iniciar o drag.
     */
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    draggingRef.current = true

    pointerIdRef.current = event.pointerId

    pointerStartXRef.current = event.clientX
    lastPointerXRef.current = event.clientX

    dragDistanceRef.current = 0
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!draggingRef.current) return

    const deltaX =
      event.clientX -
      lastPointerXRef.current

    const totalDistance =
      event.clientX -
      pointerStartXRef.current

    lastPointerXRef.current =
      event.clientX

    dragDistanceRef.current =
      Math.abs(totalDistance)

    /**
     * Só fazemos pointer capture depois que ficou claro
     * que o usuário está arrastando.
     *
     * Isso permite clicar normalmente nas imagens.
     */
    if (
      dragDistanceRef.current > 4 &&
      pointerIdRef.current !== null &&
      !event.currentTarget.hasPointerCapture(
        pointerIdRef.current,
      )
    ) {
      event.currentTarget.setPointerCapture(
        pointerIdRef.current,
      )
    }

    /**
     * Arrastou para a direita -> gira para a direita.
     * Arrastou para esquerda -> gira para esquerda.
     */
    rotationRef.current +=
      deltaX * DRAG_SENSITIVITY

    paintRotation()
  }

  function finishPointerInteraction(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!draggingRef.current) return

    draggingRef.current = false

    /**
     * Se houve movimento real, evitamos que o browser
     * interprete o fim do drag como clique em uma foto.
     */
    if (dragDistanceRef.current > 6) {
      suppressClickUntilRef.current =
        performance.now() + 250
    }

    if (
      pointerIdRef.current !== null &&
      event.currentTarget.hasPointerCapture(
        pointerIdRef.current,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        pointerIdRef.current,
      )
    }

    pointerIdRef.current = null
  }

  function handleSelect(member: TeamMember) {
    /**
     * Não seleciona o integrante caso o usuário
     * estivesse apenas arrastando o carrossel.
     */
    if (
      performance.now() <
      suppressClickUntilRef.current
    ) {
      return
    }

    onSelect(member)

    /**
     * Mesmo comportamento do projeto original:
     * após selecionar, desce suavemente para os detalhes.
     */
    window.requestAnimationFrame(() => {
      document
        .getElementById('integrante-detalhes')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    })
  }

  if (members.length === 0) {
    return (
      <p className="text-center text-white/60">
        Nenhum integrante cadastrado.
      </p>
    )
  }

  return (
    <div
      className="
        absolute
        left-1/2
        top-[42%]
        z-[2]

        h-[7.5rem]
        w-24

        -translate-x-1/2

        select-none
        touch-pan-y

        sm:top-[35%]
        sm:h-40
        sm:w-32

        md:h-[12.5rem]
        md:w-40

        lg:top-[25%]
        lg:h-[15.63rem]
        lg:w-[12.5rem]
      "
      onMouseEnter={() => {
        mouseInsideRef.current = true
      }}
      onMouseLeave={() => {
        mouseInsideRef.current = false
      }}
      onFocus={() => {
        focusInsideRef.current = true
      }}
      onBlur={(event) => {
        const nextElement =
          event.relatedTarget as Node | null

        if (
          !nextElement ||
          !event.currentTarget.contains(nextElement)
        ) {
          focusInsideRef.current = false
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerInteraction}
      onPointerCancel={finishPointerInteraction}
      aria-label="Carrossel de integrantes"
    >
      <div
        ref={ringRef}
        className="
          relative
          h-full
          w-full

          cursor-grab

          [transform-style:preserve-3d]
          will-change-transform

          active:cursor-grabbing

          [--carousel-perspective:30rem]
          [--carousel-radius:11rem]
          [--carousel-tilt:-6deg]

          sm:[--carousel-perspective:40rem]
          sm:[--carousel-radius:16rem]
          sm:[--carousel-tilt:-8deg]

          md:[--carousel-radius:25rem]

          lg:[--carousel-perspective:62.5rem]
          lg:[--carousel-radius:28rem]
          lg:[--carousel-tilt:-10deg]

          xl:[--carousel-radius:35.38rem]
        "
        style={{
          transform:
            'perspective(var(--carousel-perspective)) rotateX(var(--carousel-tilt)) rotateY(0deg)',
        }}
      >
        {members.map((member, index) => {
          const isSelected =
            selectedRm === member.rm

          return (
            <button
              key={member.rm}
              type="button"
              aria-label={`Ver informações de ${member.nome}`}
              aria-pressed={isSelected}
              onClick={() =>
                handleSelect(member)
              }
              className={`
                group

                absolute
                inset-0

                overflow-hidden

                rounded-2xl

                border

                bg-transparent

                shadow-[0_18px_46px_rgba(0,0,0,0.32)]

                outline-none

                transition-[filter,border-color,box-shadow]
                duration-300

                hover:border-cyan-300/60
                hover:brightness-110
                hover:saturate-110
                hover:shadow-[0_0_34px_rgba(0,247,255,0.42)]

                focus-visible:border-cyan-300
                focus-visible:shadow-[0_0_34px_rgba(0,247,255,0.42)]

                ${
                  isSelected
                    ? `
                      border-emerald-300/80
                      shadow-[0_0_34px_rgba(110,231,183,0.4)]
                    `
                    : `
                      border-cyan-100/20
                    `
                }
              `}
              style={{
                transform: `
                  rotateY(${index * itemAngle}deg)
                  translateZ(var(--carousel-radius))
                `,
              }}
            >
              <img
                src={member.imagem}
                alt={member.nome}
                draggable={false}
                className="
                  h-full
                  w-full
                  object-cover

                  transition-transform
                  duration-500

                  group-hover:scale-[1.03]
                "
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}