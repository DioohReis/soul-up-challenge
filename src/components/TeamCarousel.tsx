import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { TeamMember } from '../types'
import type { CSSProperties } from 'react'

type TeamCarouselProps = {
  members: TeamMember[]
  onSelect: (member: TeamMember) => void
  selectedRm?: string
}

const ROTATION_SPEED = 18
const DRAG_SENSITIVITY = 0.35
const controlClassName = 'team-carousel-control grid place-items-center rounded-full border border-white/[0.15] bg-black/[0.35] text-white hover:border-cyan-200/50 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 disabled:cursor-default disabled:opacity-40'

export function TeamCarousel({ members, onSelect, selectedRm }: TeamCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const targetRotation = useRef<number | null>(null)
  const hovered = useRef(false)
  const focused = useRef(false)
  const visible = useRef(true)
  const frontIndex = useRef(0)
  const pointer = useRef<{ id: number; startX: number; lastX: number; dragged: boolean } | null>(null)
  const suppressClickUntil = useRef(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const quantity = members.length
  const angle = quantity > 0 ? 360 / quantity : 0

  const paint = useCallback(() => {
    ringRef.current?.style.setProperty('--carousel-rotation', `${rotation.current}deg`)
    if (quantity > 0) {
      const nearest = ((Math.round(-rotation.current / angle) % quantity) + quantity) % quantity
      if (frontIndex.current !== nearest) {
        frontIndex.current = nearest
        setActiveIndex(nearest)
      }
    }
  }, [angle, quantity])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting })
    if (stageRef.current) observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (quantity < 2) return undefined
    let frame = 0
    let previous: number | null = null

    function animate(time: number) {
      const delta = previous === null ? 0 : Math.min((time - previous) / 1000, 0.05)
      previous = time
      if (!document.hidden && visible.current) {
        if (targetRotation.current !== null) {
          const distance = targetRotation.current - rotation.current
          if (reducedMotion || Math.abs(distance) < 0.05) {
            rotation.current = targetRotation.current
            targetRotation.current = null
          } else {
            rotation.current += distance * (1 - Math.exp(-10 * delta))
          }
          paint()
        } else if (!paused && !reducedMotion && !hovered.current && !focused.current && !pointer.current) {
          rotation.current = (rotation.current + ROTATION_SPEED * delta) % 360
          paint()
        }
      }
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [paint, paused, quantity, reducedMotion])

  function focusMember(index: number, showDetails = false) {
    if (quantity === 0 || performance.now() < suppressClickUntil.current) return
    const normalizedIndex = ((index % quantity) + quantity) % quantity
    const desired = -normalizedIndex * angle
    const distance = ((desired - rotation.current + 540) % 360 + 360) % 360 - 180
    targetRotation.current = rotation.current + distance
    onSelect(members[normalizedIndex])
    if (showDetails) {
      window.requestAnimationFrame(() => {
        document.getElementById('integrante-detalhes')?.scrollIntoView({
          behavior: reducedMotion ? 'instant' : 'smooth',
          block: 'start',
        })
      })
    }
  }

  function move(direction: number, focusPhoto = false) {
    if (quantity < 2) return
    const current = Math.round(-(targetRotation.current ?? rotation.current) / angle)
    const next = ((current + direction) % quantity + quantity) % quantity
    focusMember(next)
    if (focusPhoto) ringRef.current?.querySelectorAll('button')[next]?.focus({ preventScroll: true })
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (quantity < 2 || !event.isPrimary || event.button !== 0) return
    targetRotation.current = null
    pointer.current = { id: event.pointerId, startX: event.clientX, lastX: event.clientX, dragged: false }
  }

  function drag(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = pointer.current
    if (!gesture || gesture.id !== event.pointerId) return
    if (!gesture.dragged && Math.abs(event.clientX - gesture.startX) > 6) {
      gesture.dragged = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (gesture.dragged) {
      rotation.current += (event.clientX - gesture.lastX) * DRAG_SENSITIVITY
      paint()
    }
    gesture.lastX = event.clientX
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const gesture = pointer.current
    if (!gesture || gesture.id !== event.pointerId) return
    pointer.current = null
    if (gesture.dragged) suppressClickUntil.current = performance.now() + 300
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  if (quantity === 0) return <p className="text-center text-white/60">Nenhum integrante cadastrado.</p>

  return (
    <div
      className="team-carousel relative mx-auto w-full overflow-hidden pb-8 [--carousel-height:15.63rem] [--carousel-perspective:62.5rem] [--carousel-radius:35.38rem] [--carousel-tilt:-10deg] [--carousel-width:12.5rem] max-[1024px]:[--carousel-height:12.5rem] max-[1024px]:[--carousel-radius:25rem] max-[1024px]:[--carousel-width:10rem] max-[768px]:[--carousel-height:10rem] max-[768px]:[--carousel-perspective:40rem] max-[768px]:[--carousel-radius:16rem] max-[768px]:[--carousel-tilt:-8deg] max-[768px]:[--carousel-width:8rem] max-[480px]:[--carousel-height:7.5rem] max-[480px]:[--carousel-perspective:30rem] max-[480px]:[--carousel-radius:11rem] max-[480px]:[--carousel-tilt:-6deg] max-[480px]:[--carousel-width:6rem]"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Integrantes da equipe"
    >
      <div
        ref={stageRef}
        className="team-carousel-stage relative h-[53rem] cursor-grab touch-pan-y select-none active:cursor-grabbing max-[1024px]:h-[34rem] max-[768px]:h-[27rem] max-[480px]:h-[21rem]"
        onPointerLeave={(event) => {
          hovered.current = false
          if (!pointer.current?.dragged) finishDrag(event)
        }}
        onFocusCapture={() => { focused.current = true }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) focused.current = false
        }}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1, true)
          }
        }}
      >
        <div className="team-carousel-position absolute left-1/2 top-[36%] h-[var(--carousel-height)] w-[var(--carousel-width)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] max-[1024px]:top-[40%] max-[768px]:top-[43%]">
          <div
            ref={ringRef}
            className="team-carousel-ring h-full w-full [transform-style:preserve-3d] [transform:perspective(var(--carousel-perspective))_rotateX(var(--carousel-tilt))_rotateY(var(--carousel-rotation,0deg))] motion-safe:will-change-transform"
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') hovered.current = true }}
            onPointerLeave={() => { hovered.current = false }}
          >
            {members.map((member, index) => (
              <button
                key={member.rm}
                type="button"
                onClick={() => focusMember(index, true)}
                className="team-carousel-card absolute inset-0 h-full w-full cursor-[inherit] overflow-hidden rounded-2xl border border-[#c4fff6]/[0.18] bg-transparent p-0 shadow-[0_18px_46px_rgba(0,0,0,0.32)] transition-[border-color,box-shadow,filter] duration-300 [transform:rotateY(var(--card-angle))_translateZ(var(--carousel-radius))] hover:border-[#00f7ff]/[0.55] hover:brightness-[1.12] hover:saturate-[1.05] hover:shadow-[0_0_34px_rgba(0,247,255,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                style={{ '--card-angle': `${index * angle}deg` } as CSSProperties}
                aria-label={`Selecionar ${member.nome}`}
                aria-pressed={member.rm === selectedRm}
              >
                <img src={member.imagem} alt={`Foto de ${member.nome}`} draggable={false} className="pointer-events-none h-full w-full object-cover object-center" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex flex-wrap items-center justify-center gap-3">
        <button type="button" disabled={quantity < 2} onClick={() => move(-1)} className={`${controlClassName} h-11 w-11 text-xl`} aria-label="Integrante anterior">←</button>
        <div className="flex items-center" aria-label="Posição do carrossel">
          {members.map((member, index) => (
            <button key={member.rm} type="button" onClick={() => focusMember(index)} className="grid h-11 w-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200" aria-label={`Ir para ${member.nome}`} aria-current={index === activeIndex ? 'true' : undefined}>
              <span className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-cyan-200' : 'w-2.5 bg-white/25'}`} />
            </button>
          ))}
        </div>
        <button type="button" disabled={quantity < 2} onClick={() => move(1)} className={`${controlClassName} h-11 w-11 text-xl`} aria-label="Próximo integrante">→</button>
        {!reducedMotion && quantity > 1 && (
          <button type="button" onClick={() => setPaused((current) => !current)} className={`${controlClassName} min-h-11 px-4 text-xs font-bold`} aria-label={paused ? 'Retomar rotação automática' : 'Pausar rotação automática'} aria-pressed={paused}>
            {paused ? 'Retomar' : 'Pausar'}
          </button>
        )}
      </div>
      <p className="relative z-10 mx-auto mt-4 max-w-lg px-3 text-center text-xs leading-6 text-white/[0.55]">
        {reducedMotion ? 'Use as setas ou arraste para conhecer a equipe.' : 'Giro automático. Arraste para explorar ou passe o mouse sobre as fotos para pausar.'}
        {' '}Selecione uma foto para ver o perfil.
      </p>
    </div>
  )
}
