export interface HanjaState {
  type: 'hanja'
  category: string
  page: number
}

export interface CircleState {
  type: 'circle'
  input: string
}

export type GlyphsState = HanjaState | CircleState

export type StateTransitionFn = (
  state: GlyphsState | null,
  action: KeyboardEvent,
) => {
  newState: GlyphsState | null
  input: string | null
}
