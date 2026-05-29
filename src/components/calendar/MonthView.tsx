import { format, isSameDay, isSameMonth, isToday } from 'date-fns'
import type { CalendarEvent } from '../../types/event'
import { getMonthDays } from '../../utils/dateUtils'
import { EventBlock } from './EventBlock'
import './MonthView.css'

import type { FamilyMemberVisual } from '../../utils/familyMemberColors'

interface MonthViewProps {
  date: Date
  events: CalendarEvent[]
  onDayClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  memberVisuals?: Record<string, FamilyMemberVisual>
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function MonthView({
  date,
  events,
  onDayClick,
  onEventClick,
  memberVisuals,
}: MonthViewProps) {
  const days = getMonthDays(date)

  const getEventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(e.start, day))

  return (
    <div className="month-view">
      <div className="month-view-weekdays">
        {WEEKDAYS.map((d) => (
          <div key={d} className="month-weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="month-view-grid">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const outside = !isSameMonth(day, date)
          const today = isToday(day)

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={[
                'month-cell',
                outside && 'month-cell--outside',
                today && 'month-cell--today',
                dayEvents.length > 0 && 'has-events',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onDayClick(day)}
            >
              <span className="month-cell-date">{format(day, 'd')}</span>
              <div
                className={[
                  'month-cell-events',
                  memberVisuals && 'month-cell-events--family-badges',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {dayEvents.slice(0, 3).map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    compact
                    memberVisuals={memberVisuals}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="month-cell-more">+{dayEvents.length - 3} ещё</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
