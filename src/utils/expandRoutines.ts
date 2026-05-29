import { eachDayOfInterval, format, getISODay } from 'date-fns'
import type { CalendarEvent } from '../types/event'
import type { Routine } from '../types/routine'

export function expandRoutines(
  routines: Routine[],
  from: Date,
  to: Date,
): CalendarEvent[] {
  if (routines.length === 0) return []

  const days = eachDayOfInterval({ start: from, end: to })
  const result: CalendarEvent[] = []

  for (const routine of routines) {
    for (const day of days) {
      if (!routine.daysOfWeek.includes(getISODay(day))) continue

      const [hours, minutes] = routine.startTime.split(':').map(Number)
      const start = new Date(day)
      start.setHours(hours, minutes, 0, 0)

      const end = new Date(start)
      end.setMinutes(end.getMinutes() + routine.durationMinutes)

      result.push({
        id: `routine-${routine.id}-${format(day, 'yyyy-MM-dd')}`,
        routineId: routine.id,
        title: routine.title,
        description: routine.description,
        start,
        end,
        color: routine.color,
        reminderMinutesBefore: routine.reminderMinutesBefore,
        hiddenFromFamily: routine.hiddenFromFamily,
        ownerUserId: routine.ownerUserId,
        ownerName: routine.ownerName,
        isRoutine: true,
      })
    }
  }

  return result
}

export function getVisibleRange(date: Date, view: 'day' | 'week' | 'month') {
  const start = new Date(date)
  const end = new Date(date)

  if (view === 'day') {
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return { from: start, to: end }
  }

  if (view === 'week') {
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diff)
    start.setHours(0, 0, 0, 0)
    end.setTime(start.getTime())
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return { from: start, to: end }
  }

  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  end.setMonth(end.getMonth() + 1, 0)
  end.setHours(23, 59, 59, 999)
  return { from: start, to: end }
}
