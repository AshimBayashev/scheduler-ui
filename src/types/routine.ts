export interface Routine {
  id: string
  title: string
  description?: string
  startTime: string
  durationMinutes: number
  daysOfWeek: number[]
  color: string
  active: boolean
  reminderMinutesBefore: number | null
  hiddenFromFamily?: boolean
  ownerUserId?: string
  ownerName?: string
}

export interface RoutineFormData {
  title: string
  description: string
  startTime: string
  durationMinutes: number
  daysOfWeek: number[]
  color: string
  reminderMinutesBefore: number | null
  hiddenFromFamily?: boolean
}

export const WEEKDAY_LABELS = [
  { iso: 1, label: 'Пн', full: 'Понедельник' },
  { iso: 2, label: 'Вт', full: 'Вторник' },
  { iso: 3, label: 'Ср', full: 'Среда' },
  { iso: 4, label: 'Чт', full: 'Четверг' },
  { iso: 5, label: 'Пт', full: 'Пятница' },
  { iso: 6, label: 'Сб', full: 'Суббота' },
  { iso: 7, label: 'Вс', full: 'Воскресенье' },
] as const

export const DAY_PRESETS = {
  everyDay: [1, 2, 3, 4, 5, 6, 7],
  weekdays: [1, 2, 3, 4, 5],
  weekend: [6, 7],
} as const
