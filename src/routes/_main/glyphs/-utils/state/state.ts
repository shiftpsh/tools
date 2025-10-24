import { nextStateCircle } from './circle'
import { nextStateHanja } from './hanja'
import type { StateTransitionFn } from './types'
import { isValidHanjaCategoryKey } from './utils'

export const nextState: StateTransitionFn = (state, action) => {
  const { key, shiftKey, ctrlKey, metaKey } = action
  if (key === 'Escape') {
    action.preventDefault()
    return { newState: null, input: null }
  }
  if (ctrlKey || metaKey) {
    return { newState: state, input: null }
  }
  if (!state) {
    if (isValidHanjaCategoryKey(action)) {
      action.preventDefault()
      return {
        newState: {
          type: 'hanja',
          category: shiftKey ? key.toUpperCase() : key.toLowerCase(),
          page: 0,
        },
        input: null,
      }
    }
    if (key.toLowerCase() === 'o') {
      action.preventDefault()
      return {
        newState: {
          type: 'circle',
          input: '',
        },
        input: null,
      }
    }
  }
  if (state?.type === 'hanja') {
    return nextStateHanja(state, action)
  }
  if (state?.type === 'circle') {
    return nextStateCircle(state, action)
  }
  return {
    newState: state,
    input: null,
  }
}
