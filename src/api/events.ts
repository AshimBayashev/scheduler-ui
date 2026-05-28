import { apiFetch } from './client'
import type { EventFormData } from '../types/event'

export interface ApiEvent {
  id: string
  title: string
  description: string | null
  start: string
  end: string
  allDay: boolean
  color: string
  reminderMinutesBefore: number | null
}

function toPayload(data: EventFormData) {
  return {
    title: data.title,
    description: data.description || undefined,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
    allDay: data.allDay,
    color: data.color,
    reminderMinutesBefore: data.reminderMinutesBefore,
  }
}

export function fetchEvents(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const query = params.toString()
  return apiFetch<ApiEvent[]>(`/events${query ? `?${query}` : ''}`)
}

export function createEvent(data: EventFormData) {
  return apiFetch<ApiEvent>('/events', {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  })
}

export function updateEventApi(id: string, data: EventFormData) {
  return apiFetch<ApiEvent>(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  })
}

export function deleteEventApi(id: string) {
  return apiFetch<{ success: boolean }>(`/events/${id}`, {
    method: 'DELETE',
  })
}

export function mapApiEvent(event: ApiEvent) {
  return {
    id: event.id,
    title: event.title,
    description: event.description ?? undefined,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: event.allDay,
    color: event.color,
    reminderMinutesBefore: event.reminderMinutesBefore,
  }
}
