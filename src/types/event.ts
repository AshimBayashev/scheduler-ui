export type CalendarView = 'day' | 'week' | 'month'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: string
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
}
