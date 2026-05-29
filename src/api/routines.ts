import { apiFetch } from './client'
import type { Routine, RoutineFormData } from '../types/routine'

export interface ApiRoutine {
  id: string
  title: string
  description: string | null
  startTime: string
  durationMinutes: number
  daysOfWeek: number[]
  color: string
  active: boolean
  reminderMinutesBefore: number | null
  hiddenFromFamily: boolean
  ownerUserId?: string
  ownerName?: string | null
}

export interface FetchRoutinesOptions {
  forUserId?: string
  scope?: 'family'
}

function toPayload(data: RoutineFormData) {
  return {
    title: data.title,
    description: data.description || undefined,
    startTime: data.startTime,
    durationMinutes: data.durationMinutes,
    daysOfWeek: data.daysOfWeek,
    color: data.color,
    reminderMinutesBefore: data.reminderMinutesBefore,
    hiddenFromFamily: data.hiddenFromFamily ?? false,
  }
}

export function fetchRoutines(options: FetchRoutinesOptions = {}) {
  const params = new URLSearchParams()
  if (options.forUserId) params.set('forUserId', options.forUserId)
  if (options.scope) params.set('scope', options.scope)
  const query = params.toString()
  return apiFetch<ApiRoutine[]>(`/routines${query ? `?${query}` : ''}`)
}

export function createRoutine(data: RoutineFormData) {
  return apiFetch<ApiRoutine>('/routines', {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  })
}

export function updateRoutineApi(id: string, data: RoutineFormData) {
  return apiFetch<ApiRoutine>(`/routines/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  })
}

export function deleteRoutineApi(id: string) {
  return apiFetch<{ success: boolean }>(`/routines/${id}`, {
    method: 'DELETE',
  })
}

export function mapApiRoutine(routine: ApiRoutine): Routine {
  return {
    id: routine.id,
    title: routine.title,
    description: routine.description ?? undefined,
    startTime: routine.startTime.slice(0, 5),
    durationMinutes: routine.durationMinutes,
    daysOfWeek: routine.daysOfWeek,
    color: routine.color,
    active: routine.active,
    reminderMinutesBefore: routine.reminderMinutesBefore,
    hiddenFromFamily: routine.hiddenFromFamily,
    ownerUserId: routine.ownerUserId,
    ownerName: routine.ownerName ?? undefined,
  }
}
