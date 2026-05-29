import { useEffect, useState } from 'react'
import type { CalendarEvent } from '../../types/event'
import { MOBILE_BREAKPOINT, useMediaQuery } from '../../hooks/useMediaQuery'
import { getWeekDays } from '../../utils/dateUtils'
import {
  readWeekMobileZoom,
  writeWeekMobileZoom,
  type WeekMobileZoom,
} from '../../utils/weekMobileZoom'
import { TimeGrid } from './TimeGrid'
import { WeekMobileZoomBar } from './WeekMobileZoomBar'
import './WeekView.css'

import type { FamilyMemberVisual } from '../../utils/familyMemberColors'

interface WeekViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotClick?: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  memberVisuals?: Record<string, FamilyMemberVisual>
}

export function WeekView({
  date,
  events,
  onSlotClick,
  onEventClick,
  memberVisuals,
}: WeekViewProps) {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
  const [mobileZoom, setMobileZoom] = useState<WeekMobileZoom>(readWeekMobileZoom)
  const days = getWeekDays(date)

  useEffect(() => {
    writeWeekMobileZoom(mobileZoom)
  }, [mobileZoom])

  return (
    <div className="week-view">
      {isMobile && (
        <WeekMobileZoomBar value={mobileZoom} onChange={setMobileZoom} />
      )}
      <TimeGrid
        days={days}
        events={events}
        onSlotClick={onSlotClick}
        onEventClick={onEventClick}
        memberVisuals={memberVisuals}
        mobileWeekZoom={isMobile ? mobileZoom : undefined}
      />
    </div>
  )
}
