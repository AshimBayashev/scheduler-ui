export const THEMES = [
  { id: 'light', label: 'Светлая' },
  { id: 'dark', label: 'Тёмная' },
  { id: 'synthwave', label: 'Synthwave' },
  { id: 'retro', label: 'Retro' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'comfy', label: 'Comfy' },
  { id: 'futuristic', label: 'Futuristic' },
] as const

export type Theme = (typeof THEMES)[number]['id']

const THEME_IDS = new Set<string>(THEMES.map((t) => t.id))

export function isTheme(value: string | null): value is Theme {
  return value !== null && THEME_IDS.has(value)
}

export const DEFAULT_THEME: Theme = 'light'
