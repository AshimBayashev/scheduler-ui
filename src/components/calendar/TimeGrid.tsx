import { useEffect, useRef } from 'react'
import { format, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useClock } from '../../hooks/useClock'
import type { CalendarEvent } from '../../types/event'
import {
  createDefaultEnd,
  DAY_SLOTS,
  HOUR_HEIGHT,
  HOURS,
} from '../../utils/dateUtils'
import {
  MOBILE_WEEK_HOUR_HEIGHT_OVERVIEW,
  type WeekMobileZoom,
} from '../../utils/weekMobileZoom'
import type { FamilyMemberVisual } from '../../utils/familyMemberVisuals'
import { EventBlock } from './EventBlock'
import './TimeGrid.css'

interface TimeGridProps {
  days: Date[]
  events: CalendarEvent[]
  onSlotClick?: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  familyMemberVisuals?: Map<string, FamilyMemberVisual>
  /** Только неделя на телефоне */
  mobileWeekZoom?: WeekMobileZoom
}

export function TimeGrid({
  days,
  events,
  onSlotClick,
  onEventClick,
  familyMemberVisuals,
  mobileWeekZoom,
}: TimeGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const now = useClock()
  const isMobileWeek = days.length > 1 && !!mobileWeekZoom
  const hourHeight =
    isMobileWeek && mobileWeekZoom === 'overview'
      ? MOBILE_WEEK_HOUR_HEIGHT_OVERVIEW
      : HOUR_HEIGHT
  const slotHeight = hourHeight / 2
  const denseEvents = isMobileWeek && mobileWeekZoom === 'overview'

  const nowTop =
    now.getHours() * hourHeight +
    (now.getMinutes() / 60) * hourHeight +
    (now.getSeconds() / 3600) * hourHeight

  const scrollToNow = () => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = Math.max(nowTop - 120, 0)
  }

  useEffect(() => {
    scrollToNow()
  }, [])

  useEffect(() => {
    if (isMobileWeek) scrollToNow()
  }, [mobileWeekZoom, isMobileWeek])

  const getItemsForDay = (day: Date) =>
    events
      .filter((e) => !e.allDay && isSameDay(e.start, day))
      .sort((a, b) => {
        if (a.isRoutine === b.isRoutine) return a.start.getTime() - b.start.getTime()
        return a.isRoutine ? -1 : 1
      })

  const handleSlotClick = (day: Date, slotIndex: number) => {
    if (!onSlotClick) return
    const slot = new Date(day)
    slot.setHours(Math.floor(slotIndex / 2), (slotIndex % 2) * 30, 0, 0)
    onSlotClick(slot)
  }

  return (
    <div className="time-grid-wrapper" ref={scrollRef}>
      <div
        className="time-grid"
        data-multi-day={days.length > 1 ? 'true' : undefined}
        data-mobile-week={isMobileWeek ? mobileWeekZoom : undefined}
        style={
          {
            '--day-count': days.length,
            '--hour-height': `${hourHeight}px`,
            '--slot-height': `${slotHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className="time-grid-gutter">
          <div className="time-grid-corner" />
          {HOURS.map((hour) => {
            const label = new Date()
            label.setHours(hour, 0, 0, 0)
            return (
              <div key={hour} className="time-label" style={{ height: hourHeight }}>
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
                {Array.from({ length: DAY_SLOTS }, (_, slotIndex) => (
                  <button
                    key={slotIndex}
                    type="button"
                    className={[
                      'time-slot',
                      slotIndex % 2 === 1 && 'time-slot--hour-end',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ height: slotHeight }}
                    onClick={() => handleSlotClick(day, slotIndex)}
                    aria-label={`Создать дело ${format(day, 'd MMM', { locale: ru })} ${String(Math.floor(slotIndex / 2)).padStart(2, '0')}:${slotIndex % 2 === 0 ? '00' : '30'}`}
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
                    familyMemberVisuals={familyMemberVisuals}
                    dense={denseEvents}
                    hourHeight={hourHeight}
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
