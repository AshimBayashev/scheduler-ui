import type { CalendarEvent } from '../../types/event'
import { TimeGrid } from './TimeGrid'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function DayView({ date, events, onSlotClick, onEventClick }: DayViewProps) {
  return (
    <TimeGrid
      days={[date]}
      events={events}
      onSlotClick={onSlotClick}
      onEventClick={onEventClick}
    />
  )
}
