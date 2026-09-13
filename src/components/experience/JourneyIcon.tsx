import type { CSSProperties, ReactNode } from 'react'

export type JourneyIconName = 'leaf' | 'star' | 'recycle' | 'drop' | 'arrow' | 'sparkles' | 'wave' | 'chat' | 'clock' | 'check' | 'send' | 'volume' | 'mute' | 'pause' | 'play' | 'lock' | 'target'

const paths: Record<JourneyIconName, ReactNode> = {
  leaf: <><path d="M12 21V11m0 6C4 17 3 10 3 4c6 0 9 3 9 8 0-5 3-8 9-8 0 6-1 13-9 13Z" /><path d="m7 9 5 5 5-5" /></>,
  star: <path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z" />,
  recycle: <path d="m8 6 2-3a2 2 0 0 1 3.5.1L17 9m-4-1 4 1 1-4M19 12l2 3a2 2 0 0 1-1.8 3H13m3-3-3 3 3 3M9 18H5a2 2 0 0 1-1.8-3L7 9m-4 1 4-1 1 4" />,
  drop: <path d="M12 3C10 7 5 11 5 15a7 7 0 0 0 14 0c0-4-5-8-7-12Zm-3 12a3 3 0 0 0 3 3" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  sparkles: <><path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z" /><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" /></>,
  wave: <><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6-8a1.5 1.5 0 0 1 3 0v8-6a1.5 1.5 0 0 1 3 0v7-3a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-12 5l-4-5a1.5 1.5 0 0 1 2-2l2 2" /><path d="M3 5 2 8m19-4 1 3" /></>,
  chat: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3h2a8.5 8.5 0 0 1 8.5 8.5ZM7 10h9M7 14h6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  send: <path d="m21 3-7 18-4-7-7-4 18-7Zm0 0L10 14" />,
  volume: <path d="m11 4-6 5H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />,
  mute: <path d="m11 4-6 5H2v6h3l6 5ZM16 9l6 6m0-6-6 6" />,
  pause: <path d="M8 5v14M16 5v14" />,
  play: <path d="m8 4 12 8-12 8Z" />,
  lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="m12 12 9-9m-4 0h4v4" /></>,
}

export function JourneyIcon({ name, size = 20, style }: { name: JourneyIconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>
}
