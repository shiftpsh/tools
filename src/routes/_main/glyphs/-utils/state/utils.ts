import { VALID_HANJA_CATEGORIES } from './hanja'

export const isValidHanjaCategoryKey = (action: KeyboardEvent) => {
  const { key, shiftKey } = action
  if (shiftKey) {
    return VALID_HANJA_CATEGORIES.includes(key.toUpperCase())
  } else {
    return VALID_HANJA_CATEGORIES.includes(key.toLowerCase())
  }
}
