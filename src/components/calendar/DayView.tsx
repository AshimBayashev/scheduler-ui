import type { CalendarEvent } from '../../types/event'
import { TimeGrid } from './TimeGrid'

import type { FamilyMemberVisual } from '../../utils/familyMemberColors'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotClick?: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  memberVisuals?: Record<string, FamilyMemberVisual>
}

export function DayView({
  date,
  events,
  onSlotClick,
  onEventClick,
  memberVisuals,
}: DayViewProps) {
  return (
    <TimeGrid
      days={[date]}
      events={events}
      onSlotClick={onSlotClick}
      onEventClick={onEventClick}
      memberVisuals={memberVisuals}
    />
  )
}
