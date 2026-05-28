/** null = напоминание выключено */
export const REMINDER_MINUTES_OPTIONS = [0, 5, 10, 15, 30, 60] as const

export const DEFAULT_REMINDER_MINUTES = 15

export type ReminderMinutes =
  | (typeof REMINDER_MINUTES_OPTIONS)[number]
  | null

export const REMINDER_LABELS: Record<number, string> = {
  0: 'В момент начала',
  5: 'За 5 минут',
  10: 'За 10 минут',
  15: 'За 15 минут',
  30: 'За 30 минут',
  60: 'За 1 час',
}

export function reminderLabel(minutes: ReminderMinutes): string {
  if (minutes === null) return 'Без напоминания'
  return REMINDER_LABELS[minutes] ?? `За ${minutes} мин`
}

export function normalizeReminderMinutes(value?: number | null): ReminderMinutes {
  if (value === null) return null
  if (value === undefined) return DEFAULT_REMINDER_MINUTES
  if ((REMINDER_MINUTES_OPTIONS as readonly number[]).includes(value)) {
    return value as (typeof REMINDER_MINUTES_OPTIONS)[number]
  }
  return DEFAULT_REMINDER_MINUTES
}
