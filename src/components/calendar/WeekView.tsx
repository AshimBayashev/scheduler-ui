import type { CalendarEvent } from '../../types/event'
import { getWeekDays } from '../../utils/dateUtils'
import { TimeGrid } from './TimeGrid'

interface WeekViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotClick?: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  showOwnerLabels?: boolean
}

export function WeekView({
  date,
  events,
  onSlotClick,
  onEventClick,
  showOwnerLabels,
}: WeekViewProps) {
  const days = getWeekDays(date)

  return (
    <TimeGrid
      days={days}
      events={events}
      onSlotClick={onSlotClick}
      onEventClick={onEventClick}
      showOwnerLabels={showOwnerLabels}
    />
  )
}
