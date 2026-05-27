import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CalendarEvent, CalendarView, EventFormData } from '../../types/event'
import { useEvents } from '../../context/EventsContext'
import { MOBILE_BREAKPOINT, useMediaQuery } from '../../hooks/useMediaQuery'
import { createDefaultEnd, navigateDate } from '../../utils/dateUtils'
import { DayView } from '../calendar/DayView'
import { WeekView } from '../calendar/WeekView'
import { MonthView } from '../calendar/MonthView'
import { EventModal } from '../modals/EventModal'
import { CalendarHeader } from './CalendarHeader'
import { Sidebar } from './Sidebar'
import './AppLayout.css'

export function AppLayout() {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('week')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
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

  const eventDates = useMemo(
    () => events.map((e) => e.start),
    [events],
  )

  const openNewEventModal = useCallback((start?: Date) => {
    const slotStart = start ?? new Date()
    setEditingEvent(null)
    setDraftSlot({ start: slotStart, end: createDefaultEnd(slotStart) })
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((event: CalendarEvent) => {
    setEditingEvent(event)
    setDraftSlot(null)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingEvent(null)
    setDraftSlot(null)
  }, [])

  const handleSave = useCallback(
    async (data: EventFormData) => {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data)
      } else {
        await addEvent(data)
      }
    },
    [editingEvent, addEvent, updateEvent],
  )

  const handleDelete = useCallback(async () => {
    if (editingEvent) {
      await deleteEvent(editingEvent.id)
      closeModal()
    }
  }, [editingEvent, deleteEvent, closeModal])

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

  const modalInitialData = editingEvent
    ? {
        title: editingEvent.title,
        description: editingEvent.description ?? '',
        start: editingEvent.start,
        end: editingEvent.end,
        allDay: editingEvent.allDay ?? false,
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
          {loading && events.length === 0 ? (
            <div className="calendar-loading">Загрузка дел...</div>
          ) : (
            <>
              {view === 'day' && (
                <DayView
                  date={currentDate}
                  events={events}
                  onSlotClick={openNewEventModal}
                  onEventClick={openEditModal}
                />
              )}
              {view === 'week' && (
                <WeekView
                  date={currentDate}
                  events={events}
                  onSlotClick={openNewEventModal}
                  onEventClick={openEditModal}
                />
              )}
              {view === 'month' && (
                <MonthView
                  date={currentDate}
                  events={events}
                  onDayClick={handleDayClick}
                  onEventClick={openEditModal}
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
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={editingEvent ? handleDelete : undefined}
        initialData={modalInitialData}
        editingEvent={editingEvent}
      />
    </div>
  )
}
