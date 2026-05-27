import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createEvent,
  deleteEventApi,
  fetchEvents,
  mapApiEvent,
  updateEventApi,
} from '../api/events'
import { useAuth } from './AuthContext'
import type { CalendarEvent, EventFormData } from '../types/event'

interface EventsContextValue {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  addEvent: (data: EventFormData) => Promise<CalendarEvent>
  updateEvent: (id: string, data: EventFormData) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  refreshEvents: () => Promise<void>
}

const EventsContext = createContext<EventsContextValue | null>(null)

export function EventsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshEvents = useCallback(async () => {
    if (!user) {
      setEvents([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchEvents()
      setEvents(data.map(mapApiEvent))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить дела')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshEvents()
  }, [refreshEvents])

  const addEvent = useCallback(async (data: EventFormData) => {
    const created = await createEvent(data)
    const event = mapApiEvent(created)
    setEvents((prev) => [...prev, event])
    return event
  }, [])

  const updateEvent = useCallback(async (id: string, data: EventFormData) => {
    const updated = await updateEventApi(id, data)
    const event = mapApiEvent(updated)
    setEvents((prev) => prev.map((e) => (e.id === id ? event : e)))
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    await deleteEventApi(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      events,
      loading,
      error,
      addEvent,
      updateEvent,
      deleteEvent,
      refreshEvents,
    }),
    [events, loading, error, addEvent, updateEvent, deleteEvent, refreshEvents],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}
