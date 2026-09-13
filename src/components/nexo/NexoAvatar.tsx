import {
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

export type NexoMood = 'idle' | 'guide' | 'success'

type NexoAvatarProps = {
  mood?: NexoMood
  active?: boolean
  compact?: boolean
  interactive?: boolean
  className?: string
  onInteract?: () => void
}

type Tilt = {
  x: number
  y: number
}

const MAX_TILT_X = 4
const MAX_TILT_Y = 6

export function NexoAvatar({
  mood = 'idle',
  active = false,
  compact = false,
  interactive = true,
  className = '',
  onInteract,
}: NexoAvatarProps) {
  const reactId = useId()
  const id = reactId.replace(/:/g, '')

  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 })
  const [localActive, setLocalActive] = useState(false)

  const isActive = active || localActive
  const isHappy = mood === 'success' || isActive

  const ids = useMemo(
    () => ({
      body: `nexo-body-${id}`,
      bodyShade: `nexo-body-shade-${id}`,
      visor: `nexo-visor-${id}`,
      blue: `nexo-blue-${id}`,
      eye: `nexo-eye-${id}`,
      core: `nexo-core-${id}`,
      glow: `nexo-glow-${id}`,
      shadow: `nexo-shadow-${id}`,
      softBlur: `nexo-soft-blur-${id}`,
    }),
    [id],
  )

  useEffect(() => {
    if (!localActive) return undefined

    const timer = window.setTimeout(() => {
      setLocalActive(false)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [localActive])

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return

    const bounds = event.currentTarget.getBoundingClientRect()
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5

    setTilt({
      x: normalizedY * -MAX_TILT_X * 2,
      y: normalizedX * MAX_TILT_Y * 2,
    })
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 })
  }

  function interact() {
    if (!interactive) return
    setLocalActive(true)
    onInteract?.()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    interact()
  }

  const eyeOffsetX = Math.max(-5, Math.min(5, tilt.y * 0.55))
  const eyeOffsetY = Math.max(-2.5, Math.min(2.5, tilt.x * -0.35))

  const stateLabel = isActive
    ? 'Nexo reagindo à interação'
    : mood === 'success'
      ? 'Nexo celebrando seu progresso'
      : 'Nexo online e pronto para ajudar'

  return (
    <div
      className={`relative mx-auto outline-none ${
        compact
          ? 'w-[220px] sm:w-[250px]'
          : 'w-[340px] sm:w-[420px] lg:w-[500px] xl:w-[560px]'
      } ${interactive ? 'cursor-pointer' : ''} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onClick={interact}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? 'Interagir com o Nexo' : undefined}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[57%] h-[74%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-soul-sky/20 blur-[78px]"
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[53%] h-[88%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 ${
          isActive
            ? 'scale-105 border-soul-sky/30 shadow-[0_0_70px_rgba(92,200,255,0.18)]'
            : 'border-soul-blue/10'
        }`}
      />

      <div
        className="relative z-10 transition-transform duration-300 ease-out will-change-transform motion-reduce:transform-none"
        style={{
          transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
            isActive ? 'scale(1.02)' : 'scale(1)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 560 650"
          role="img"
          aria-label="Nexo, avatar interativo da experiência Soul Up"
          className="h-auto w-full overflow-visible animate-nexo-float drop-shadow-[0_34px_40px_rgba(7,26,71,0.16)] motion-reduce:animate-none"
        >
          <defs>
            <linearGradient id={ids.body} x1="130" y1="105" x2="390" y2="550" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.38" stopColor="#fbfdff" />
              <stop offset="0.72" stopColor="#eef5ff" />
              <stop offset="1" stopColor="#d7e8ff" />
            </linearGradient>

            <linearGradient id={ids.bodyShade} x1="180" y1="260" x2="390" y2="540" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.55" stopColor="#7fb8ff" stopOpacity="0.08" />
              <stop offset="1" stopColor="#1f5fe0" stopOpacity="0.18" />
            </linearGradient>

            <linearGradient id={ids.visor} x1="180" y1="160" x2="390" y2="255" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#123375" />
              <stop offset="0.42" stopColor="#081e50" />
              <stop offset="1" stopColor="#020b21" />
            </linearGradient>

            <linearGradient id={ids.blue} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#74ddff" />
              <stop offset="0.5" stopColor="#338bf2" />
              <stop offset="1" stopColor="#1f5fe0" />
            </linearGradient>

            <radialGradient id={ids.eye} cx="42%" cy="36%" r="72%">
              <stop offset="0" stopColor="#f5feff" />
              <stop offset="0.32" stopColor="#a2edff" />
              <stop offset="0.72" stopColor="#4fc7ff" />
              <stop offset="1" stopColor="#2674ed" />
            </radialGradient>

            <radialGradient id={ids.core} cx="50%" cy="34%" r="68%">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.28" stopColor="#b9f3ff" />
              <stop offset="0.66" stopColor="#5cc8ff" />
              <stop offset="1" stopColor="#296fe5" />
            </radialGradient>

            <filter id={ids.glow} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={ids.shadow} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#071a47" floodOpacity="0.16" />
            </filter>

            <filter id={ids.softBlur} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
          </defs>

          <ellipse
            cx="280"
            cy="604"
            rx="128"
            ry="22"
            fill="#4b9cf7"
            opacity={isActive ? 0.2 : 0.11}
            className="animate-nexo-shadow motion-reduce:animate-none"
          />
          <ellipse cx="280" cy="598" rx="108" ry="8" fill="#8ee6ff" opacity="0.28" filter={`url(#${ids.softBlur})`} />

          <g filter={`url(#${ids.shadow})`}>
            <ellipse cx="229" cy="562" rx="42" ry="27" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="2" />
            <ellipse cx="331" cy="562" rx="42" ry="27" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="2" />

            <g
              className={`${isActive ? 'animate-nexo-wave' : ''} [transform-box:fill-box] origin-bottom-right motion-reduce:animate-none`}
            >
              <ellipse cx="161" cy="301" rx="22" ry="18" fill={`url(#${ids.blue})`} opacity="0.96" />

              <path
                d="M164 294C139 271 120 243 110 216C104 199 109 183 123 177C138 171 153 180 158 195C166 218 182 239 199 254C211 264 212 280 201 290C190 301 176 305 164 294Z"
                fill={`url(#${ids.body})`}
                stroke="#d4e5fb"
                strokeWidth="2"
              />

              <ellipse cx="110" cy="184" rx="26" ry="32" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="2" />

              <rect x="78" y="143" width="15" height="46" rx="8" transform="rotate(-17 85 166)" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="1.3" />
              <rect x="94" y="137" width="15" height="49" rx="8" transform="rotate(-7 101 162)" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="1.3" />
              <rect x="111" y="140" width="15" height="47" rx="8" transform="rotate(4 118 164)" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="1.3" />
              <rect x="127" y="149" width="14" height="40" rx="7" transform="rotate(15 134 169)" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="1.3" />
            </g>

            <g>
              <ellipse cx="399" cy="314" rx="20" ry="16" fill={`url(#${ids.blue})`} opacity="0.96" />
              <path
                d="M395 309C418 330 432 369 431 416C431 446 419 469 399 475C381 481 365 468 367 449C371 411 366 377 350 347C341 329 349 309 366 303C377 299 388 302 395 309Z"
                fill={`url(#${ids.body})`}
                stroke="#d4e5fb"
                strokeWidth="2"
              />
              <ellipse cx="400" cy="468" rx="27" ry="31" fill={`url(#${ids.body})`} stroke="#d4e5fb" strokeWidth="2" />
              <path d="M388 452C397 443 409 443 417 449" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="5" strokeLinecap="round" />
            </g>

            <path
              d="M174 316C195 281 232 264 280 264C328 264 365 281 386 316C411 358 421 428 402 500C389 550 347 578 280 578C213 578 171 550 158 500C139 428 149 358 174 316Z"
              fill={`url(#${ids.body})`}
              stroke="#d4e5fb"
              strokeWidth="2.3"
            />

            <path
              d="M174 316C195 281 232 264 280 264C328 264 365 281 386 316C402 343 412 383 411 425C376 446 335 456 280 456C225 456 184 446 149 425C148 383 158 343 174 316Z"
              fill={`url(#${ids.bodyShade})`}
            />

            <path d="M170 330C153 372 153 426 164 474" fill="none" stroke={`url(#${ids.blue})`} strokeWidth="9" strokeLinecap="round" opacity="0.9" />
            <path d="M390 330C407 372 407 426 396 474" fill="none" stroke={`url(#${ids.blue})`} strokeWidth="7" strokeLinecap="round" opacity="0.72" />

            <path d="M205 333C234 302 332 297 361 326" fill="none" stroke="#ffffff" strokeOpacity="0.86" strokeWidth="12" strokeLinecap="round" />

            <path
              d="M151 190C154 129 203 95 280 95C357 95 406 129 409 190C412 248 374 286 280 286C186 286 148 248 151 190Z"
              fill={`url(#${ids.body})`}
              stroke="#d4e5fb"
              strokeWidth="2.4"
            />

            <path d="M191 135C229 101 323 99 372 128" fill="none" stroke="#ffffff" strokeOpacity="0.92" strokeWidth="13" strokeLinecap="round" />

            <ellipse cx="158" cy="207" rx="15" ry="31" fill={`url(#${ids.blue})`} />
            <ellipse cx="402" cy="207" rx="15" ry="31" fill={`url(#${ids.blue})`} />
            <ellipse cx="154" cy="201" rx="5" ry="15" fill="#ddf7ff" opacity="0.62" />
            <ellipse cx="398" cy="201" rx="5" ry="15" fill="#ddf7ff" opacity="0.62" />

            <rect x="175" y="165" width="210" height="79" rx="39.5" fill={`url(#${ids.visor})`} stroke="#1f5fe0" strokeOpacity="0.18" strokeWidth="2" />
            <path d="M198 183C221 166 252 160 281 162" fill="none" stroke="#97e7ff" strokeOpacity="0.16" strokeWidth="9" strokeLinecap="round" />

            <g transform={`translate(${eyeOffsetX} ${eyeOffsetY})`}>
              <g className="animate-nexo-blink [transform-box:fill-box] origin-center motion-reduce:animate-none" filter={`url(#${ids.glow})`}>
                {isHappy ? (
                  <>
                    <path d="M214 209Q227 194 240 209" fill="none" stroke="#6bdcff" strokeWidth="8" strokeLinecap="round" />
                    <path d="M320 209Q333 194 346 209" fill="none" stroke="#6bdcff" strokeWidth="8" strokeLinecap="round" />
                    <path d="M240 208H320" stroke="#6bdcff" strokeWidth="6" strokeLinecap="round" opacity="0.86" />
                  </>
                ) : (
                  <>
                    <circle cx="228" cy="207" r="13" fill={`url(#${ids.eye})`} />
                    <rect x="228" y="203" width="104" height="8" rx="4" fill="#68dfff" opacity="0.9" />
                    <circle cx="332" cy="207" r="13" fill={`url(#${ids.eye})`} />
                    <circle cx="224" cy="203" r="4" fill="#f3feff" opacity="0.95" />
                    <circle cx="328" cy="203" r="4" fill="#f3feff" opacity="0.95" />
                  </>
                )}
              </g>
            </g>

            <g
              className="animate-nexo-core [transform-box:fill-box] origin-center motion-reduce:animate-none"
              filter={`url(#${ids.glow})`}
            >
              <path
                d="M280 414C265 389 231 387 217 410C203 434 221 461 280 496C339 461 357 434 343 410C329 387 295 389 280 414Z"
                fill={`url(#${ids.core})`}
              />
              <path
                d="M280 417C266 404 249 403 239 416C232 430 246 447 280 469C314 447 328 430 321 416C311 403 294 404 280 417Z"
                fill="#92e8ff"
                opacity="0.36"
              />
              <path d="M280 413V473" stroke="#effcff" strokeWidth="3" strokeLinecap="round" opacity="0.86" />
            </g>

            <ellipse cx="359" cy="394" rx="14" ry="18" fill="#f7fbff" stroke="#9fc4f5" strokeWidth="2" opacity="0.95" />

            <path d="M280 501V548" stroke="#a8c9ef" strokeOpacity="0.38" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {interactive && (
        <div
          className={`pointer-events-none absolute bottom-[2.5%] left-1/2 z-20 -translate-x-1/2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] shadow-[0_10px_28px_rgba(7,26,71,0.08)] backdrop-blur-xl transition-all duration-300 ${
            isActive
              ? 'border-soul-sky/35 bg-white/95 text-soul-blue'
              : 'border-soul-blue/10 bg-white/80 text-soul-navy/55'
          }`}
        >
          {isActive ? 'Oi! Estou aqui ✦' : 'Clique para interagir'}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {stateLabel}
      </span>
    </div>
  )
}
