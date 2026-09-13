export type NexoState =
  | 'idle'
  | 'looking'
  | 'listening'
  | 'thinking'
  | 'talking'
  | 'happy'
  | 'celebrating'
  | 'sleeping'

export type NexoPointer = {
  x: number
  y: number
}

export type NexoInteractionMode = {
  state: NexoState
  label: string
  message: string
}
