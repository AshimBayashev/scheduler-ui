import { useEffect } from 'react'
import { useEvents } from '../context/EventsContext'
import { useRoutines } from '../context/RoutinesContext'
import { getTodayPlans } from '../utils/todayPlans'

function truncateMinute(date: Date) {
  const d = new Date(date)
  d.setSeconds(0, 0)
  return d
}

function fireKey(sourceType: string, sourceId: string, fireAt: Date) {
  return `reminder:${sourceType}:${sourceId}:${fireAt.toISOString()}`
}

/** Показывает уведомления, когда вкладка открыта (дублирует push как fallback). */
export function useForegroundReminders() {
  const { events } = useEvents()
  const { routines } = useRoutines()

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    const tick = () => {
      const now = new Date()
      const windowStart = truncateMinute(now)
      const windowEnd = new Date(windowStart.getTime() + 60_000)
      const plans = getTodayPlans(events, routines)

      for (const plan of plans) {
        const minutes = plan.reminderMinutesBefore
        if (minutes === null || minutes === undefined) continue

        const anchor = truncateMinute(plan.start)
        const fireAt = new Date(anchor.getTime() - minutes * 60_000)
        if (fireAt < windowStart || fireAt >= windowEnd) continue

        const key = fireKey(plan.isRoutine ? 'routine' : 'event', plan.routineId ?? plan.id, fireAt)
        if (sessionStorage.getItem(key)) continue

        const when =
          minutes === 0
            ? 'Сейчас'
            : minutes === 60
              ? 'Через час'
              : `Через ${minutes} мин`

        new Notification(when, {
          body: plan.isRoutine ? `${plan.title} (рутина)` : plan.title,
          icon: '/favicon.svg',
          tag: key,
        })
        sessionStorage.setItem(key, '1')
      }
    }

    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [events, routines])
}
