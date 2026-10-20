export type WorkerId = 'peon' | 'peasant' | 'acolyte'
export type PeonState = 'ready' | 'working' | 'done' | 'attention' | 'error' | 'selected'

/** What the pane draws: the chosen worker, its current state and the phrase last spoken. */
export type PeonView = {
  worker: WorkerId
  state: PeonState
  phrase: string
  muted: boolean
  /** Kept across sessions: a new session starts with a random worker. */
  isRandom: boolean
  /** This session only: no reactions, no sound, the pane shows just a way back. */
  isOff: boolean
  /** True once worker and muted were copied in from the store (session.start or a handler). */
  isLoaded: boolean
}

declare module 'claude-code' {
  interface PluginState {
    'unit-war3-claude': { view: PeonView }
  }
}
