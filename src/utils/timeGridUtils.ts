import { DAY_SLOTS } from './dateUtils'

export function slotIndexToDate(day: Date, slotIndex: number): Date {
  const date = new Date(day)
  date.setHours(Math.floor(slotIndex / 2), (slotIndex % 2) * 30, 0, 0)
  return date
}

export function getSlotIndexFromOffset(offsetY: number, slotHeight: number): number {
  const slot = Math.floor(offsetY / slotHeight)
  return Math.max(0, Math.min(DAY_SLOTS - 1, slot))
}

export function getSlotRangeBounds(anchorSlot: number, currentSlot: number) {
  return {
    startSlot: Math.min(anchorSlot, currentSlot),
    endSlot: Math.max(anchorSlot, currentSlot),
  }
}
