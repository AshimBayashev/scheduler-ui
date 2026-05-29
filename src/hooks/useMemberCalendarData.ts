import { useEffect, useState } from 'react'
import { fetchEvents, mapApiEvent } from '../api/events'
import { fetchRoutines, mapApiRoutine } from '../api/routines'
import type { CalendarMemberScope } from '../types/event'
import type { CalendarEvent } from '../types/event'
import type { Routine } from '../types/routine'

interface UseMemberCalendarDataOptions {
  scope: CalendarMemberScope
  from?: Date
  to?: Date
  enabled?: boolean
}

export function useMemberCalendarData({
  scope,
  from,
  to,
  enabled = true,
}: UseMemberCalendarDataOptions) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || scope === 'self') {
      setEvents([])
      setRoutines([])
      setError(null)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const fromIso = from?.toISOString()
        const toIso = to?.toISOString()

        if (scope === 'family') {
          const [eventData, routineData] = await Promise.all([
            fetchEvents({ from: fromIso, to: toIso, scope: 'family' }),
            fetchRoutines({ scope: 'family' }),
          ])
          if (cancelled) return
          setEvents(eventData.map(mapApiEvent))
          setRoutines(routineData.map(mapApiRoutine))
          return
        }

        const [eventData, routineData] = await Promise.all([
          fromIso && toIso
            ? fetchEvents({ from: fromIso, to: toIso, forUserId: scope })
            : fetchEvents({ forUserId: scope }),
          fetchRoutines({ forUserId: scope }),
        ])
        if (cancelled) return
        setEvents(eventData.map(mapApiEvent))
        setRoutines(routineData.map(mapApiRoutine))
      } catch (err) {
        if (cancelled) return
        setEvents([])
        setRoutines([])
        setError(err instanceof Error ? err.message : 'Не удалось загрузить календарь')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [scope, from, to, enabled])

  return { events, routines, loading, error }
}
