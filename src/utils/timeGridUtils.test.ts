import { describe, expect, it } from 'vitest'
import {
  getSlotIndexFromOffset,
  getSlotRangeBounds,
  slotIndexToDate,
} from './timeGridUtils'

describe('timeGridUtils', () => {
  const day = new Date(2026, 4, 28)

  it('converts slot index to date', () => {
    expect(slotIndexToDate(day, 18).getHours()).toBe(9)
    expect(slotIndexToDate(day, 18).getMinutes()).toBe(0)
    expect(slotIndexToDate(day, 25).getHours()).toBe(12)
    expect(slotIndexToDate(day, 25).getMinutes()).toBe(30)
  })

  it('maps offset to slot index', () => {
    expect(getSlotIndexFromOffset(48, 48)).toBe(1)
    expect(getSlotIndexFromOffset(-5, 48)).toBe(0)
    expect(getSlotIndexFromOffset(9999, 48)).toBe(47)
  })

  it('normalizes slot range', () => {
    expect(getSlotRangeBounds(25, 18)).toEqual({ startSlot: 18, endSlot: 25 })
    expect(getSlotRangeBounds(10, 10)).toEqual({ startSlot: 10, endSlot: 10 })
  })
})
