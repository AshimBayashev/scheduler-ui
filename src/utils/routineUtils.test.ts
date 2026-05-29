import { describe, expect, it } from 'vitest'
import { findRoutineById, formatRoutineDays } from './routineUtils'
import type { Routine } from '../types/routine'

describe('routineUtils', () => {
  it('formats preset day groups', () => {
    expect(formatRoutineDays([1, 2, 3, 4, 5])).toBe('Будни')
    expect(formatRoutineDays([6, 7])).toBe('Выходные')
    expect(formatRoutineDays([1, 2, 3, 4, 5, 6, 7])).toBe('Каждый день')
  })

  it('findRoutineById returns routine or null', () => {
    const routines = [{ id: 'a' }, { id: 'b' }] as Routine[]
    expect(findRoutineById(routines, 'b')?.id).toBe('b')
    expect(findRoutineById(routines, 'missing')).toBeNull()
  })
})
