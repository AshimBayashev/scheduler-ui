import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CalendarEvent, CalendarView, EventFormData } from '../../types/event'
import type { Routine } from '../../types/routine'
import { useEvents } from '../../context/EventsContext'
import { useRoutines } from '../../context/RoutinesContext'
import { MOBILE_BREAKPOINT, useMediaQuery } from '../../hooks/useMediaQuery'
import { expandRoutines, getVisibleRange } from '../../utils/expandRoutines'
import { findRoutineById } from '../../utils/routineUtils'
import { createDefaultEnd, navigateDate } from '../../utils/dateUtils'
import { DayView } from '../calendar/DayView'
import { WeekView } from '../calendar/WeekView'
import { MonthView } from '../calendar/MonthView'
import { EventModal } from '../modals/EventModal'
import { RoutineModal } from '../modals/RoutineModal'
import { CalendarHeader } from './CalendarHeader'
import { Sidebar } from './Sidebar'
import './AppLayout.css'

export function AppLayout() {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [routineModalOpen, setRoutineModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [draftSlot, setDraftSlot] = useState<{ start: Date; end: Date } | null>(null)

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

  const loading = eventsLoading || routinesLoading

  const calendarItems = useMemo(() => {
    const { from, to } = getVisibleRange(currentDate, view)
    const expanded = expandRoutines(routines, from, to)
    return [...expanded, ...events]
  }, [routines, events, currentDate, view])

  const eventDates = useMemo(
    () => calendarItems.map((e) => e.start),
    [calendarItems],
  )

  const openNewEventModal = useCallback((start?: Date) => {
    const slotStart = start ?? new Date()
    setEditingEvent(null)
    setDraftSlot({ start: slotStart, end: createDefaultEnd(slotStart) })
    setEventModalOpen(true)
  }, [])

  const openNewRoutineModal = useCallback(() => {
    setEditingRoutine(null)
    setRoutineModalOpen(true)
  }, [])

  const openEditEventModal = useCallback((event: CalendarEvent) => {
    if (event.isRoutine && event.routineId) {
      const routine = findRoutineById(routines, event.routineId)
      if (routine) {
        setEditingRoutine(routine)
        setRoutineModalOpen(true)
      }
      return
    }
    setEditingEvent(event)
    setDraftSlot(null)
    setEventModalOpen(true)
  }, [routines])

  const openEditRoutineFromSidebar = useCallback((routine: Routine) => {
    setEditingRoutine(routine)
    setRoutineModalOpen(true)
  }, [])

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
      const start = new Date(date)
      start.setHours(9, 0, 0, 0)
      openNewEventModal(start)
    },
    [openNewEventModal, isMobile],
  )

  const eventModalInitialData = editingEvent && !editingEvent.isRoutine
    ? {
        title: editingEvent.title,
        description: editingEvent.description ?? '',
        start: editingEvent.start,
        end: editingEvent.end,
        allDay: editingEvent.allDay ?? false,
        color: editingEvent.color,
      }
    : draftSlot
      ? { start: draftSlot.start, end: draftSlot.end }
      : undefined

  return (
    <div className="app-layout">
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
        routines={routines}
        onClose={isMobile ? () => setSidebarOpen(false) : undefined}
        isOpen={!isMobile || sidebarOpen}
        eventDates={eventDates}
      />

      <main className="calendar-main">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={(dir) => setCurrentDate((d) => navigateDate(d, view, dir))}
          onToday={() => setCurrentDate(new Date())}
          onMenuClick={isMobile ? () => setSidebarOpen(true) : undefined}
        />

        <div className="calendar-content">
          {loading && calendarItems.length === 0 ? (
            <div className="calendar-loading">Загрузка...</div>
          ) : (
            <>
              {view === 'day' && (
                <DayView
                  date={currentDate}
                  events={calendarItems}
                  onSlotClick={openNewEventModal}
                  onEventClick={openEditEventModal}
                />
              )}
              {view === 'week' && (
                <WeekView
                  date={currentDate}
                  events={calendarItems}
                  onSlotClick={openNewEventModal}
                  onEventClick={openEditEventModal}
                />
              )}
              {view === 'month' && (
                <MonthView
                  date={currentDate}
                  events={calendarItems}
                  onDayClick={handleDayClick}
                  onEventClick={openEditEventModal}
                />
              )}
            </>
          )}
        </div>
      </main>

      {isMobile && (
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
      />

      <RoutineModal
        isOpen={routineModalOpen}
        onClose={closeRoutineModal}
        onSave={handleRoutineSave}
        onDelete={editingRoutine ? handleRoutineDelete : undefined}
        editingRoutine={editingRoutine}
      />
    </div>
  )
}
