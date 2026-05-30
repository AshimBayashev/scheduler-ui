import type { CalendarEvent } from '../../types/event'
import { TimeGrid } from './TimeGrid'

import type { FamilyMemberVisual } from '../../utils/familyMemberColors'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotSelect?: (start: Date, end: Date) => void
  onEventClick: (event: CalendarEvent) => void
  memberVisuals?: Record<string, FamilyMemberVisual>
}

export function DayView({
  date,
  events,
  onSlotSelect,
  onEventClick,
  memberVisuals,
}: DayViewProps) {
  return (
    <TimeGrid
      days={[date]}
      events={events}
      onSlotSelect={onSlotSelect}
      onEventClick={onEventClick}
      memberVisuals={memberVisuals}
    />
  )
}
