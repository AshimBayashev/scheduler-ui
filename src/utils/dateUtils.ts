import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CalendarView } from '../types/event'

export const HOURS = Array.from({ length: 24 }, (_, i) => i)
export const HOUR_HEIGHT = 72
export const SLOTS_PER_HOUR = 2
export const SLOT_HEIGHT = HOUR_HEIGHT / SLOTS_PER_HOUR
export const MIN_EVENT_HEIGHT = HOUR_HEIGHT / 2
export const DAY_SLOTS = HOURS.length * SLOTS_PER_HOUR

export function formatDateRange(date: Date, view: CalendarView): string {
  switch (view) {
    case 'day':
      return format(date, 'd MMMM yyyy', { locale: ru })
    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: 1 })
      const end = endOfWeek(date, { weekStartsOn: 1 })
      if (isSameMonth(start, end)) {
        return `${format(start, 'd', { locale: ru })} – ${format(end, 'd MMMM yyyy', { locale: ru })}`
      }
      return `${format(start, 'd MMM', { locale: ru })} – ${format(end, 'd MMM yyyy', { locale: ru })}`
    }
    case 'month':
      return format(date, 'LLLL yyyy', { locale: ru })
  }
}

export function navigateDate(date: Date, view: CalendarView, direction: -1 | 1): Date {
  const delta = direction === 1 ? 1 : -1
  switch (view) {
    case 'day':
      return delta > 0 ? addDays(date, 1) : subDays(date, 1)
    case 'week':
      return delta > 0 ? addWeeks(date, 1) : subWeeks(date, 1)
    case 'month':
      return delta > 0 ? addMonths(date, 1) : subMonths(date, 1)
  }
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end: addDays(start, 6) })
}

export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

export function getEventTop(start: Date, hourHeight = HOUR_HEIGHT): number {
  const hours = start.getHours() + start.getMinutes() / 60
  return hours * hourHeight
}

export function getEventHeight(start: Date, end: Date, hourHeight = HOUR_HEIGHT): number {
  const durationMs = end.getTime() - start.getTime()
  const hours = durationMs / (1000 * 60 * 60)
  const minHeight = hourHeight / 2
  return Math.max(hours * hourHeight, minHeight)
}

export function roundToHalfHour(date: Date): Date {
  const rounded = new Date(date)
  const minutes = rounded.getMinutes()
  rounded.setMinutes(minutes < 30 ? 0 : 30, 0, 0)
  return rounded
}

export function createDefaultEnd(start: Date): Date {
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + 30)
  return end
}

export { isSameDay, isSameMonth, isToday, startOfDay, format }
