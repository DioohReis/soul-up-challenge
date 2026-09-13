import { useId } from 'react'

export type LumenMood = 'idle' | 'guide' | 'success'

type LumenAvatarProps = {
  mood?: LumenMood
  active?: boolean
  compact?: boolean
  className?: string
}

export function LumenAvatar({
  mood = 'idle',
  active = false,
  compact = false,
  className = '',
}: LumenAvatarProps) {
  const reactId = useId()
  const id = reactId.replace(/:/g, '')

  const headGradient = `lumen-head-${id}`
  const bodyGradient = `lumen-body-${id}`
  const flameGradient = `lumen-flame-${id}`
  const coreGradient = `lumen-core-${id}`
  const faceGradient = `lumen-face-${id}`
  const glowFilter = `lumen-glow-${id}`

  const isHappy = mood === 'success' || active

  return (
    <div
      className={`relative mx-auto aspect-[4/5] ${
        compact ? 'w-[160px] sm:w-[185px]' : 'w-[205px] sm:w-[235px] lg:w-[265px]'
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500 ${
          active ? 'scale-110 bg-emerald-300/25' : 'bg-cyan-300/10'
        }`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[48%] h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 animate-lumen-halo rounded-full border border-cyan-200/15 motion-reduce:animate-none"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[48%] h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 animate-lumen-halo-slow rounded-full border border-emerald-300/10 motion-reduce:animate-none"
      />

      <svg
        viewBox="0 0 320 400"
        role="img"
        aria-label="Lumën, assistente sustentável da Soul UP"
        className="relative z-10 h-full w-full overflow-visible animate-lumen-float drop-shadow-[0_20px_28px_rgba(0,0,0,0.35)] motion-reduce:animate-none"
      >
        <defs>
          <linearGradient id={headGradient} x1="60" y1="80" x2="255" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#d7fff9" />
            <stop offset="0.26" stopColor="#5ef0dc" />
            <stop offset="0.68" stopColor="#11b99f" />
            <stop offset="1" stopColor="#5cf09b" />
          </linearGradient>

          <linearGradient id={bodyGradient} x1="100" y1="245" x2="230" y2="365" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#31e4d0" />
            <stop offset="0.55" stopColor="#0da58f" />
            <stop offset="1" stopColor="#04574f" />
          </linearGradient>

          <linearGradient id={faceGradient} x1="100" y1="125" x2="225" y2="205">
            <stop offset="0" stopColor="#001f1d" />
            <stop offset="1" stopColor="#000706" />
          </linearGradient>

          <linearGradient id={flameGradient} x1="160" y1="25" x2="160" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fffcc8" />
            <stop offset="0.28" stopColor="#c7ff8b" />
            <stop offset="0.68" stopColor="#3cf0bd" />
            <stop offset="1" stopColor="#1bd6e3" />
          </linearGradient>

          <radialGradient id={coreGradient}>
            <stop offset="0" stopColor="#f3ffc7" />
            <stop offset="0.45" stopColor="#77f5b4" />
            <stop offset="1" stopColor="#08a78e" />
          </radialGradient>

          <filter id={glowFilter} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse
          cx="160"
          cy="378"
          rx="80"
          ry="13"
          fill="#66ffe2"
          opacity={active ? 0.28 : 0.16}
          className="animate-lumen-shadow motion-reduce:animate-none"
        />

        <g
          filter={`url(#${glowFilter})`}
          className="animate-lumen-energy [transform-box:fill-box] origin-bottom motion-reduce:animate-none"
        >
          <path
            d="M159 110C131 92 132 66 153 48C145 72 160 73 166 56C177 26 198 18 202 8C213 45 199 76 181 94C173 102 168 108 159 110Z"
            fill={`url(#${flameGradient})`}
          />
          <path
            d="M148 109C124 98 111 82 116 62C128 72 135 64 137 51C149 70 151 89 148 109Z"
            fill={`url(#${flameGradient})`}
            opacity="0.72"
          />
          <path
            d="M177 109C196 94 213 78 207 57C198 70 191 65 189 52C179 72 175 91 177 109Z"
            fill={`url(#${flameGradient})`}
            opacity="0.68"
          />
          <path
            d="M160 101C148 86 151 69 163 55C166 73 176 76 181 65C181 84 174 96 160 101Z"
            fill="#f7ffd8"
            opacity="0.82"
          />
        </g>

        <g>
          <rect
            x="46"
            y="267"
            width="76"
            height="30"
            rx="15"
            fill={`url(#${bodyGradient})`}
            transform="rotate(18 122 280)"
          />
          <circle cx="51" cy="296" r="20" fill="#37d8c4" />
        </g>

        <g
          className={`${active ? 'animate-lumen-wave' : ''} [transform-box:fill-box] origin-left motion-reduce:animate-none`}
        >
          <rect
            x="198"
            y="265"
            width="76"
            height="30"
            rx="15"
            fill={`url(#${bodyGradient})`}
            transform="rotate(-19 200 280)"
          />
          <circle cx="270" cy="293" r="20" fill="#37d8c4" />
        </g>

        <rect
          x="91"
          y="245"
          width="138"
          height="118"
          rx="58"
          fill={`url(#${bodyGradient})`}
          stroke="#9fffee"
          strokeOpacity="0.38"
          strokeWidth="2"
        />

        <path
          d="M112 267C130 251 188 248 209 270"
          fill="none"
          stroke="white"
          strokeOpacity="0.18"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <circle
          cx="160"
          cy="297"
          r={active ? 32 : 29}
          fill="#002721"
          stroke="#78ffe1"
          strokeOpacity="0.6"
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <circle
          cx="160"
          cy="297"
          r="22"
          fill={`url(#${coreGradient})`}
          opacity={active ? 1 : 0.78}
          filter={`url(#${glowFilter})`}
          className="animate-lumen-core [transform-box:fill-box] origin-center motion-reduce:animate-none"
        />
        <path
          d="M169 283C151 285 142 293 143 306C148 309 157 307 163 302C170 296 171 288 169 283Z"
          fill="#004c3e"
        />
        <path
          d="M146 305C153 298 159 293 167 289"
          fill="none"
          stroke="#c6ffe6"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        <rect x="55" y="149" width="34" height="62" rx="17" fill="#27d7c2" stroke="#abfff2" strokeOpacity="0.45" />
        <rect x="231" y="149" width="34" height="62" rx="17" fill="#27d7c2" stroke="#abfff2" strokeOpacity="0.45" />
        <circle cx="72" cy="180" r="7" fill="#005d53" />
        <circle cx="248" cy="180" r="7" fill="#005d53" />

        <rect
          x="67"
          y="101"
          width="186"
          height="150"
          rx="72"
          fill={`url(#${headGradient})`}
          stroke="#d9fff8"
          strokeOpacity="0.62"
          strokeWidth="2"
        />
        <path
          d="M99 126C123 103 175 96 213 119"
          fill="none"
          stroke="white"
          strokeOpacity="0.24"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <rect
          x="91"
          y="130"
          width="138"
          height="91"
          rx="43"
          fill={`url(#${faceGradient})`}
          stroke="#7affeb"
          strokeOpacity="0.15"
        />
        <path
          d="M110 148C123 137 141 134 151 134"
          fill="none"
          stroke="#65fff1"
          strokeOpacity="0.1"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <g className="animate-lumen-blink [transform-box:fill-box] origin-center motion-reduce:animate-none">
          <rect x="121" y="158" width="15" height={isHappy ? 22 : 29} rx="8" fill="#e8fffb" filter={`url(#${glowFilter})`} />
          <rect x="184" y="158" width="15" height={isHappy ? 22 : 29} rx="8" fill="#e8fffb" filter={`url(#${glowFilter})`} />
        </g>

        <path
          d={isHappy ? 'M145 194 Q160 207 176 194' : 'M150 197 Q160 201 170 197'}
          fill="none"
          stroke="#9affdf"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        <circle cx="113" cy="207" r="2.5" fill="#6affdb" opacity="0.6" />
        <circle cx="207" cy="207" r="2.5" fill="#6affdb" opacity="0.6" />
      </svg>

      <div className="absolute bottom-[4%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-cyan-100/15 bg-[#00110e]/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/80 shadow-lg backdrop-blur-xl">
        <span className={`h-2 w-2 rounded-full ${active ? 'animate-pulse bg-emerald-300' : 'bg-cyan-300'}`} />
        {active ? 'Lumën ativa' : 'Lumën online'}
      </div>
    </div>
  )
}
