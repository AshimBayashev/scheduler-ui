import type { CalendarEvent } from '../../types/event'
import type { FamilyMemberVisual } from '../../utils/familyMemberVisuals'
import { TimeGrid } from './TimeGrid'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotClick?: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  familyMemberVisuals?: Map<string, FamilyMemberVisual>
}

export function DayView({
  date,
  events,
  onSlotClick,
  onEventClick,
  familyMemberVisuals,
}: DayViewProps) {
  return (
    <TimeGrid
      days={[date]}
      events={events}
      onSlotClick={onSlotClick}
      onEventClick={onEventClick}
      familyMemberVisuals={familyMemberVisuals}
    />
  )
}
