export type CalendarView = 'day' | 'week' | 'month'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: string
  reminderMinutesBefore?: number | null
  hiddenFromFamily?: boolean
  ownerUserId?: string
  ownerName?: string
  /** Развёрнутый слот рутины (не разовое дело) */
  isRoutine?: boolean
  routineId?: string
}

export interface EventFormData {
  title: string
  description: string
  start: Date
  end: Date
  allDay: boolean
  color: string
  reminderMinutesBefore: number | null
  hiddenFromFamily?: boolean
}

/** Чей календарь смотрим: свой, участник семьи или общий */
export type CalendarMemberScope = 'self' | 'family' | string
