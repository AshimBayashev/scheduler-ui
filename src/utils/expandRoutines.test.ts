import { describe, expect, it } from 'vitest'
import { expandRoutines, getVisibleRange } from './expandRoutines'
import type { Routine } from '../types/routine'

const routine: Routine = {
  id: 'r1',
  title: 'Зарядка',
  description: null,
  startTime: '08:00',
  durationMinutes: 30,
  daysOfWeek: [1, 3, 5],
  color: '#0078D4',
  reminderMinutesBefore: 15,
  active: true,
}

describe('expandRoutines', () => {
  it('expands routines for matching weekdays in range', () => {
    const from = new Date(2026, 4, 26)
    const to = new Date(2026, 4, 28)
    const expanded = expandRoutines([routine], from, to)

    expect(expanded.length).toBeGreaterThan(0)
    expect(expanded.every((e) => e.isRoutine)).toBe(true)
    expect(expanded[0].title).toBe('Зарядка')
  })

  it('returns empty array for no routines', () => {
    const from = new Date(2026, 4, 26)
    const to = new Date(2026, 4, 28)
    expect(expandRoutines([], from, to)).toEqual([])
  })
})

describe('getVisibleRange', () => {
  it('returns day bounds for day view', () => {
    const date = new Date(2026, 4, 28, 15, 30)
    const { from, to } = getVisibleRange(date, 'day')
    expect(from.getHours()).toBe(0)
    expect(to.getHours()).toBe(23)
  })
})
