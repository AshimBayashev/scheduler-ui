import { useState } from 'react'
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { getMonthDays } from '../../utils/dateUtils'
import './MiniCalendar.css'

interface MiniCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  eventDates?: Date[]
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function MiniCalendar({ selectedDate, onDateSelect, eventDates = [] }: MiniCalendarProps) {
  const [month, setMonth] = useState(startOfMonth(selectedDate))
  const days = getMonthDays(month)

  const hasEvent = (date: Date) =>
    eventDates.some((d) => isSameDay(d, date))

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button
          type="button"
          className="mini-nav"
          onClick={() => setMonth(subMonths(month, 1))}
          aria-label="Предыдущий месяц"
        >
          ‹
        </button>
        <span className="mini-calendar-title">
          {format(month, 'LLLL yyyy', { locale: ru })}
        </span>
        <button
          type="button"
          className="mini-nav"
          onClick={() => setMonth(addMonths(month, 1))}
          aria-label="Следующий месяц"
        >
          ›
        </button>
      </div>

      <div className="mini-calendar-weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d} className="mini-weekday">
            {d}
          </span>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {days.map((day) => {
          const selected = isSameDay(day, selectedDate)
          const today = isToday(day)
          const outside = !isSameMonth(day, month)
          const dot = hasEvent(day)

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={[
                'mini-day',
                selected && 'mini-day--selected',
                today && 'mini-day--today',
                outside && 'mini-day--outside',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onDateSelect(day)}
            >
              {format(day, 'd')}
              {dot && <span className="mini-day-dot" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
