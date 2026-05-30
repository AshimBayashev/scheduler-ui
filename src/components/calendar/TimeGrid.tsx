import { useEffect, useRef, useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useClock } from '../../hooks/useClock'
import type { CalendarEvent } from '../../types/event'
import {
  DAY_SLOTS,
  HOUR_HEIGHT,
  HOURS,
} from '../../utils/dateUtils'
import {
  getSlotIndexFromOffset,
  getSlotRangeBounds,
  slotIndexToDate,
} from '../../utils/timeGridUtils'
import {
  MOBILE_WEEK_HOUR_HEIGHT_OVERVIEW,
  type WeekMobileZoom,
} from '../../utils/weekMobileZoom'
import { EventBlock } from './EventBlock'
import './TimeGrid.css'

import type { FamilyMemberVisual } from '../../utils/familyMemberColors'

interface ActiveSelection {
  day: Date
  anchorSlot: number
  currentSlot: number
}

interface TimeGridProps {
  days: Date[]
  events: CalendarEvent[]
  onSlotSelect?: (start: Date, end: Date) => void
  onEventClick: (event: CalendarEvent) => void
  memberVisuals?: Record<string, FamilyMemberVisual>
  /** Только неделя на телефоне */
  mobileWeekZoom?: WeekMobileZoom
}

export function TimeGrid({
  days,
  events,
  onSlotSelect,
  onEventClick,
  memberVisuals,
  mobileWeekZoom,
}: TimeGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeSelection, setActiveSelection] = useState<ActiveSelection | null>(null)
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

  const getSlotFromPointer = (column: HTMLElement, clientY: number) => {
    const rect = column.getBoundingClientRect()
    return getSlotIndexFromOffset(clientY - rect.top, slotHeight)
  }

  const finishSelection = (selection: ActiveSelection) => {
    const { startSlot, endSlot } = getSlotRangeBounds(
      selection.anchorSlot,
      selection.currentSlot,
    )
    const start = slotIndexToDate(selection.day, startSlot)
    const end = slotIndexToDate(selection.day, endSlot + 1)
    onSlotSelect?.(start, end)
  }

  const handleColumnPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    day: Date,
  ) => {
    if (!onSlotSelect || event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    const slot = getSlotFromPointer(event.currentTarget, event.clientY)
    setActiveSelection({ day, anchorSlot: slot, currentSlot: slot })
  }

  const handleColumnPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
    day: Date,
  ) => {
    if (!activeSelection) return

    const slot = getSlotFromPointer(event.currentTarget, event.clientY)
    setActiveSelection((prev) => {
      if (!prev || !isSameDay(prev.day, day)) return prev
      if (slot === prev.currentSlot) return prev
      return { ...prev, currentSlot: slot }
    })
  }

  const handleColumnPointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
    day: Date,
  ) => {
    if (!activeSelection || !isSameDay(activeSelection.day, day)) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    finishSelection(activeSelection)
    setActiveSelection(null)
  }

  const handleColumnPointerCancel = (
    event: React.PointerEvent<HTMLDivElement>,
    day: Date,
  ) => {
    if (!activeSelection || !isSameDay(activeSelection.day, day)) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setActiveSelection(null)
  }

  const renderSelectionOverlay = (day: Date) => {
    if (!activeSelection || !isSameDay(activeSelection.day, day)) return null

    const { startSlot, endSlot } = getSlotRangeBounds(
      activeSelection.anchorSlot,
      activeSelection.currentSlot,
    )

    return (
      <div
        className="time-grid-selection"
        style={{
          top: startSlot * slotHeight,
          height: (endSlot - startSlot + 1) * slotHeight,
        }}
        aria-hidden
      />
    )
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
            {days.map((day) => {
              const isSelecting =
                !!activeSelection && isSameDay(activeSelection.day, day)

              return (
                <div
                  key={day.toISOString()}
                  className={[
                    'time-grid-column',
                    isSelecting && 'time-grid-column--selecting',
                    onSlotSelect && 'time-grid-column--interactive',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onPointerDown={
                    onSlotSelect
                      ? (event) => handleColumnPointerDown(event, day)
                      : undefined
                  }
                  onPointerMove={
                    onSlotSelect
                      ? (event) => handleColumnPointerMove(event, day)
                      : undefined
                  }
                  onPointerUp={
                    onSlotSelect
                      ? (event) => handleColumnPointerUp(event, day)
                      : undefined
                  }
                  onPointerCancel={
                    onSlotSelect
                      ? (event) => handleColumnPointerCancel(event, day)
                      : undefined
                  }
                >
                  {Array.from({ length: DAY_SLOTS }, (_, slotIndex) => (
                    <div
                      key={slotIndex}
                      className={[
                        'time-slot',
                        slotIndex % 2 === 1 && 'time-slot--hour-end',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ height: slotHeight }}
                      aria-hidden
                    />
                  ))}

                  {renderSelectionOverlay(day)}

                  {isSameDay(day, now) && (
                    <div className="now-line" style={{ top: nowTop }} />
                  )}

                  {getItemsForDay(day).map((event) => (
                    <EventBlock
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      memberVisuals={memberVisuals}
                      dense={denseEvents}
                      hourHeight={hourHeight}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export { createDefaultEnd } from '../../utils/dateUtils'
