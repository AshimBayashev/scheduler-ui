import { describe, expect, it } from 'vitest'
import {
  DEFAULT_REMINDER_MINUTES,
  normalizeReminderMinutes,
  reminderLabel,
} from './reminders'

describe('reminders', () => {
  it('reminderLabel handles null and known values', () => {
    expect(reminderLabel(null)).toBe('Без напоминания')
    expect(reminderLabel(15)).toBe('За 15 минут')
    expect(reminderLabel(60)).toBe('За 1 час')
  })

  it('normalizeReminderMinutes uses default and validates options', () => {
    expect(normalizeReminderMinutes(undefined)).toBe(DEFAULT_REMINDER_MINUTES)
    expect(normalizeReminderMinutes(null)).toBeNull()
    expect(normalizeReminderMinutes(30)).toBe(30)
    expect(normalizeReminderMinutes(999)).toBe(DEFAULT_REMINDER_MINUTES)
  })
})
