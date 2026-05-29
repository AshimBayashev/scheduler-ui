import { useEffect, useRef } from 'react'
import { format, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useClock } from '../../hooks/useClock'
import type { CalendarEvent } from '../../types/event'
import {
  createDefaultEnd,
  HOUR_HEIGHT,
  HOURS,
  roundToHalfHour,
} from '../../utils/dateUtils'
import { EventBlock } from './EventBlock'
import './TimeGrid.css'

interface TimeGridProps {
  days: Date[]
  events: CalendarEvent[]
  onSlotClick?: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  showOwnerLabels?: boolean
}

export function TimeGrid({ days, events, onSlotClick, onEventClick, showOwnerLabels }: TimeGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const now = useClock()
  const nowTop =
    now.getHours() * HOUR_HEIGHT +
    (now.getMinutes() / 60) * HOUR_HEIGHT +
    (now.getSeconds() / 3600) * HOUR_HEIGHT

  useEffect(() => {
    if (scrollRef.current) {
      const initial = new Date()
      const top =
        initial.getHours() * HOUR_HEIGHT + (initial.getMinutes() / 60) * HOUR_HEIGHT
      scrollRef.current.scrollTop = Math.max(top - 120, 0)
    }
  }, [])

  const getItemsForDay = (day: Date) =>
    events
      .filter((e) => !e.allDay && isSameDay(e.start, day))
      .sort((a, b) => {
        if (a.isRoutine === b.isRoutine) return a.start.getTime() - b.start.getTime()
        return a.isRoutine ? -1 : 1
      })

  const handleSlotClick = (day: Date, hour: number) => {
    if (!onSlotClick) return
    const slot = new Date(day)
    slot.setHours(hour, 0, 0, 0)
    onSlotClick(roundToHalfHour(slot))
  }

  return (
    <div className="time-grid-wrapper" ref={scrollRef}>
      <div
        className="time-grid"
        data-multi-day={days.length > 1 ? 'true' : undefined}
        style={{ '--day-count': days.length } as React.CSSProperties}
      >
        <div className="time-grid-gutter">
          <div className="time-grid-corner" />
          {HOURS.map((hour) => {
            const label = new Date()
            label.setHours(hour, 0, 0, 0)
            return (
              <div key={hour} className="time-label" style={{ height: HOUR_HEIGHT }}>
                {hour > 0 ? format(label, 'HH:mm') : ''}
              </div>
            )
          })}
        </div>

        <div className="time-grid-days">
          <div className="time-grid-day-headers">
            {days.map((day) => (
              <div key={day.toISOString()} className="day-header">
                <span className="day-header-weekday">
                  {format(day, 'EEE', { locale: ru })}
                </span>
                <span
                  className={[
                    'day-header-date',
                    isSameDay(day, now) && 'day-header-date--today',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {format(day, 'd')}
                </span>
              </div>
            ))}
          </div>

          <div className="time-grid-body">
            {days.map((day) => (
              <div key={day.toISOString()} className="time-grid-column">
                {HOURS.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    className="time-slot"
                    style={{ height: HOUR_HEIGHT }}
                    onClick={() => handleSlotClick(day, hour)}
                    aria-label={`Создать дело ${format(day, 'd MMM', { locale: ru })} ${hour}:00`}
                  />
                ))}

                {isSameDay(day, now) && (
                  <div className="now-line" style={{ top: nowTop }} />
                )}

                {getItemsForDay(day).map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    showOwnerLabel={showOwnerLabels}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { createDefaultEnd }
