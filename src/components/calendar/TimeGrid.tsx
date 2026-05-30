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

const DRAG_THRESHOLD_PX = 8

interface SlotSelection {
  day: Date
  anchorSlot: number
  currentSlot: number
}

interface PendingPointer {
  day: Date
  anchorSlot: number
  currentSlot: number
  pointerId: number
  startY: number
  mode: 'pending' | 'dragging'
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
  const pointerRef = useRef<PendingPointer | null>(null)
  const [dragSelection, setDragSelection] = useState<SlotSelection | null>(null)
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

  const finishSelection = (selection: SlotSelection) => {
    const { startSlot, endSlot } = getSlotRangeBounds(
      selection.anchorSlot,
      selection.currentSlot,
    )
    const start = slotIndexToDate(selection.day, startSlot)
    const end = slotIndexToDate(selection.day, endSlot + 1)
    onSlotSelect?.(start, end)
  }

  const resetPointer = () => {
    pointerRef.current = null
    setDragSelection(null)
  }

  const handleSlotPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    day: Date,
    slotIndex: number,
  ) => {
    if (!onSlotSelect || event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    pointerRef.current = {
      day,
      anchorSlot: slotIndex,
      currentSlot: slotIndex,
      pointerId: event.pointerId,
      startY: event.clientY,
      mode: 'pending',
    }
  }

  const handleSlotPointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
    day: Date,
  ) => {
    const interaction = pointerRef.current
    if (
      !interaction
      || interaction.pointerId !== event.pointerId
      || !isSameDay(interaction.day, day)
    ) {
      return
    }

    const column = event.currentTarget.closest('.time-grid-column')
    if (!(column instanceof HTMLElement)) return

    const slot = getSlotFromPointer(column, event.clientY)

    if (interaction.mode === 'pending') {
      const movedEnough =
        Math.abs(event.clientY - interaction.startY) >= DRAG_THRESHOLD_PX
      const slotChanged = slot !== interaction.anchorSlot
      if (!movedEnough && !slotChanged) return

      interaction.mode = 'dragging'
      interaction.currentSlot = slot
      setDragSelection({
        day: interaction.day,
        anchorSlot: interaction.anchorSlot,
        currentSlot: slot,
      })
      return
    }

    if (slot === interaction.currentSlot) return

    interaction.currentSlot = slot
    setDragSelection({
      day: interaction.day,
      anchorSlot: interaction.anchorSlot,
      currentSlot: slot,
    })
  }

  const handleSlotPointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
    day: Date,
    slotIndex: number,
  ) => {
    const interaction = pointerRef.current
    if (
      !interaction
      || interaction.pointerId !== event.pointerId
      || !isSameDay(interaction.day, day)
    ) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (interaction.mode === 'dragging') {
      finishSelection(interaction)
    } else {
      const start = slotIndexToDate(day, slotIndex)
      const end = slotIndexToDate(day, slotIndex + 1)
      onSlotSelect?.(start, end)
    }

    resetPointer()
  }

  const handleSlotPointerCancel = (
    event: React.PointerEvent<HTMLButtonElement>,
    day: Date,
  ) => {
    const interaction = pointerRef.current
    if (
      !interaction
      || interaction.pointerId !== event.pointerId
      || !isSameDay(interaction.day, day)
    ) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    resetPointer()
  }

  const renderSelectionOverlay = (day: Date) => {
    if (!dragSelection || !isSameDay(dragSelection.day, day)) return null

    const { startSlot, endSlot } = getSlotRangeBounds(
      dragSelection.anchorSlot,
      dragSelection.currentSlot,
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
              const isDragging =
                !!dragSelection && isSameDay(dragSelection.day, day)

              return (
                <div
                  key={day.toISOString()}
                  className={[
                    'time-grid-column',
                    isDragging && 'time-grid-column--dragging',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
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
                      onPointerDown={
                        onSlotSelect
                          ? (event) => handleSlotPointerDown(event, day, slotIndex)
                          : undefined
                      }
                      onPointerMove={
                        onSlotSelect
                          ? (event) => handleSlotPointerMove(event, day)
                          : undefined
                      }
                      onPointerUp={
                        onSlotSelect
                          ? (event) => handleSlotPointerUp(event, day, slotIndex)
                          : undefined
                      }
                      onPointerCancel={
                        onSlotSelect
                          ? (event) => handleSlotPointerCancel(event, day)
                          : undefined
                      }
                      aria-label={`Создать дело ${format(day, 'd MMM', { locale: ru })} ${String(Math.floor(slotIndex / 2)).padStart(2, '0')}:${slotIndex % 2 === 0 ? '00' : '30'}`}
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
