import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CalendarEvent, CalendarView, EventFormData, CalendarMemberScope } from '../types/event'
import type { Routine } from '../types/routine'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import { useFamily } from '../context/FamilyContext'
import { useRoutines } from '../context/RoutinesContext'
import { FamilyMemberSwitcher } from '../components/common/FamilyMemberSwitcher'
import { FamilyMemberLegend } from '../components/calendar/FamilyMemberLegend'
import { buildMemberVisualMap } from '../utils/familyMemberColors'
import { MOBILE_BREAKPOINT, useMediaQuery } from '../hooks/useMediaQuery'
import { useMemberCalendarData } from '../hooks/useMemberCalendarData'
import { expandRoutines, getVisibleRange } from '../utils/expandRoutines'
import { findRoutineById } from '../utils/routineUtils'
import { createDefaultEnd, navigateDate } from '../utils/dateUtils'
import { DayView } from '../components/calendar/DayView'
import { WeekView } from '../components/calendar/WeekView'
import { MonthView } from '../components/calendar/MonthView'
import { EventModal } from '../components/modals/EventModal'
import { RoutineModal } from '../components/modals/RoutineModal'
import { CalendarHeader } from '../components/layout/CalendarHeader'
import { Sidebar } from '../components/layout/Sidebar'
import './CalendarPage.css'

export function CalendarPage() {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
  const { user } = useAuth()
  const { overview } = useFamily()
  const { events, loading: eventsLoading, addEvent, updateEvent, deleteEvent } = useEvents()
  const {
    routines,
    loading: routinesLoading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
  } = useRoutines()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('week')
  const [memberScope, setMemberScope] = useState<CalendarMemberScope>('self')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [routineModalOpen, setRoutineModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [draftSlot, setDraftSlot] = useState<{ start: Date; end: Date } | null>(null)

  const isReadOnly = memberScope !== 'self'
  const memberVisuals = useMemo(
    () =>
      memberScope === 'family' && overview?.members.length
        ? buildMemberVisualMap(overview.members)
        : undefined,
    [memberScope, overview?.members],
  )

  const visibleRange = useMemo(
    () => getVisibleRange(currentDate, view),
    [currentDate, view],
  )

  const memberData = useMemberCalendarData({
    scope: memberScope,
    from: visibleRange.from,
    to: visibleRange.to,
    enabled: memberScope !== 'self',
  })

  const activeEvents = memberScope === 'self' ? events : memberData.events
  const activeRoutines = memberScope === 'self' ? routines : memberData.routines

  useEffect(() => {
    if (window.matchMedia(MOBILE_BREAKPOINT).matches) {
      setView('day')
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const loading =
    memberScope === 'self'
      ? eventsLoading || routinesLoading
      : memberData.loading

  const calendarItems = useMemo(() => {
    const expanded = expandRoutines(activeRoutines, visibleRange.from, visibleRange.to)
    return [...expanded, ...activeEvents]
  }, [activeRoutines, activeEvents, visibleRange.from, visibleRange.to])

  const eventDates = useMemo(
    () => calendarItems.map((e) => e.start),
    [calendarItems],
  )

  const canEditItem = useCallback(
    (event: CalendarEvent) => {
      if (memberScope === 'self') return true
      if (memberScope === 'family') {
        if (event.isRoutine && event.routineId) {
          const routine = findRoutineById(activeRoutines, event.routineId)
          return routine?.ownerUserId === user?.id || !routine?.ownerUserId
        }
        return event.ownerUserId === user?.id || !event.ownerUserId
      }
      return false
    },
    [memberScope, activeRoutines, user?.id],
  )

  const openNewEventModal = useCallback(
    (start?: Date) => {
      if (isReadOnly) return
      const slotStart = start ?? new Date()
      setEditingEvent(null)
      setDraftSlot({ start: slotStart, end: createDefaultEnd(slotStart) })
      setEventModalOpen(true)
    },
    [isReadOnly],
  )

  const openNewRoutineModal = useCallback(() => {
    if (isReadOnly) return
    setEditingRoutine(null)
    setRoutineModalOpen(true)
  }, [isReadOnly])

  const openEditEventModal = useCallback(
    (event: CalendarEvent) => {
      if (!canEditItem(event)) return

      if (event.isRoutine && event.routineId) {
        const routine = findRoutineById(
          memberScope === 'self' ? routines : activeRoutines,
          event.routineId,
        )
        if (routine) {
          setEditingRoutine(routine)
          setRoutineModalOpen(true)
        }
        return
      }
      setEditingEvent(event)
      setDraftSlot(null)
      setEventModalOpen(true)
    },
    [canEditItem, memberScope, routines, activeRoutines],
  )

  const openEditRoutineFromSidebar = useCallback(
    (routine: Routine) => {
      if (isReadOnly) return
      setEditingRoutine(routine)
      setRoutineModalOpen(true)
    },
    [isReadOnly],
  )

  const closeEventModal = useCallback(() => {
    setEventModalOpen(false)
    setEditingEvent(null)
    setDraftSlot(null)
  }, [])

  const closeRoutineModal = useCallback(() => {
    setRoutineModalOpen(false)
    setEditingRoutine(null)
  }, [])

  const handleEventSave = useCallback(
    async (data: EventFormData) => {
      if (editingEvent && !editingEvent.isRoutine) {
        await updateEvent(editingEvent.id, data)
      } else {
        await addEvent(data)
      }
    },
    [editingEvent, addEvent, updateEvent],
  )

  const handleEventDelete = useCallback(async () => {
    if (editingEvent && !editingEvent.isRoutine) {
      await deleteEvent(editingEvent.id)
      closeEventModal()
    }
  }, [editingEvent, deleteEvent, closeEventModal])

  const handleRoutineSave = useCallback(
    async (data: Parameters<typeof addRoutine>[0]) => {
      if (editingRoutine) {
        await updateRoutine(editingRoutine.id, data)
      } else {
        await addRoutine(data)
      }
    },
    [editingRoutine, addRoutine, updateRoutine],
  )

  const handleRoutineDelete = useCallback(async () => {
    if (editingRoutine) {
      await deleteRoutine(editingRoutine.id)
      closeRoutineModal()
    }
  }, [editingRoutine, deleteRoutine, closeRoutineModal])

  const handleDayClick = useCallback(
    (date: Date) => {
      setCurrentDate(date)
      if (isMobile) setView('day')
      if (isReadOnly) return
      const start = new Date(date)
      start.setHours(9, 0, 0, 0)
      openNewEventModal(start)
    },
    [openNewEventModal, isMobile, isReadOnly],
  )

  const eventModalInitialData = editingEvent && !editingEvent.isRoutine
    ? {
        title: editingEvent.title,
        description: editingEvent.description ?? '',
        start: editingEvent.start,
        end: editingEvent.end,
        allDay: editingEvent.allDay ?? false,
        color: editingEvent.color,
        reminderMinutesBefore: editingEvent.reminderMinutesBefore ?? null,
        hiddenFromFamily: editingEvent.hiddenFromFamily ?? false,
      }
    : draftSlot
      ? { start: draftSlot.start, end: draftSlot.end }
      : undefined

  const sidebarRoutines = memberScope === 'self' ? routines : activeRoutines

  return (
    <div className="calendar-page">
      {isMobile && sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Закрыть меню"
        />
      )}

      <Sidebar
        selectedDate={currentDate}
        onDateSelect={setCurrentDate}
        onNewEvent={() => openNewEventModal()}
        onNewRoutine={() => openNewRoutineModal()}
        onEditRoutine={openEditRoutineFromSidebar}
        routines={sidebarRoutines}
        onClose={isMobile ? () => setSidebarOpen(false) : undefined}
        isOpen={!isMobile || sidebarOpen}
        eventDates={eventDates}
        readOnly={isReadOnly}
      />

      <main className="calendar-main">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={(dir) => setCurrentDate((d) => navigateDate(d, view, dir))}
          onToday={() => setCurrentDate(new Date())}
          onMenuClick={isMobile ? () => setSidebarOpen(true) : undefined}
          toolbar={
            overview?.inFamily ? (
              <FamilyMemberSwitcher
                value={memberScope}
                onChange={setMemberScope}
                showCombined
              />
            ) : undefined
          }
        />

        <div className="calendar-content">
          {memberVisuals && overview?.members && (
            <FamilyMemberLegend
              members={overview.members}
              memberVisuals={memberVisuals}
            />
          )}
          {loading && calendarItems.length === 0 ? (
            <div className="calendar-loading">Загрузка...</div>
          ) : (
            <>
              {view === 'day' && (
                <DayView
                  date={currentDate}
                  events={calendarItems}
                  onSlotClick={isReadOnly ? undefined : openNewEventModal}
                  onEventClick={openEditEventModal}
                  memberVisuals={memberVisuals}
                />
              )}
              {view === 'week' && (
                <WeekView
                  date={currentDate}
                  events={calendarItems}
                  onSlotClick={isReadOnly ? undefined : openNewEventModal}
                  onEventClick={openEditEventModal}
                  memberVisuals={memberVisuals}
                />
              )}
              {view === 'month' && (
                <MonthView
                  date={currentDate}
                  events={calendarItems}
                  onDayClick={handleDayClick}
                  onEventClick={openEditEventModal}
                  memberVisuals={memberVisuals}
                />
              )}
            </>
          )}
        </div>
      </main>

      {isMobile && !isReadOnly && (
        <button
          type="button"
          className="fab-new-event"
          onClick={() => openNewEventModal()}
          aria-label="Новое дело"
        >
          +
        </button>
      )}

      <EventModal
        isOpen={eventModalOpen}
        onClose={closeEventModal}
        onSave={handleEventSave}
        onDelete={editingEvent && !editingEvent.isRoutine ? handleEventDelete : undefined}
        initialData={eventModalInitialData}
        editingEvent={editingEvent && !editingEvent.isRoutine ? editingEvent : null}
        canHideFromFamily={overview?.inFamily ?? false}
      />

      <RoutineModal
        isOpen={routineModalOpen}
        onClose={closeRoutineModal}
        onSave={handleRoutineSave}
        onDelete={editingRoutine ? handleRoutineDelete : undefined}
        editingRoutine={editingRoutine}
        canHideFromFamily={overview?.inFamily ?? false}
      />
    </div>
  )
}
