import { endOfDay, isSameDay, startOfDay } from 'date-fns'
import type { CalendarEvent } from '../types/event'
import type { Routine } from '../types/routine'
import { expandRoutines } from './expandRoutines'

export function getTodayPlans(
  events: CalendarEvent[],
  routines: Routine[],
): CalendarEvent[] {
  const today = new Date()
  const from = startOfDay(today)
  const to = endOfDay(today)
  const expanded = expandRoutines(routines, from, to)
  const todayEvents = events.filter((e) => isSameDay(e.start, today))
  return [...expanded, ...todayEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  )
}
