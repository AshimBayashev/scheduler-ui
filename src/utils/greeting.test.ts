import { describe, expect, it } from 'vitest'
import {
  getDisplayName,
  getGreeting,
  isLikelyFeminineName,
} from './greeting'

describe('greeting utils', () => {
  it('detects likely feminine names', () => {
    expect(isLikelyFeminineName('Анна')).toBe(true)
    expect(isLikelyFeminineName('Иван')).toBe(false)
  })

  it('returns time-based greeting', () => {
    expect(getGreeting(8, false)).toBe('Доброе утро')
    expect(getGreeting(14, false)).toBe('Добрый день')
    expect(getGreeting(20, true)).toBe('Добрый вечер')
    expect(getGreeting(2, true)).toBe('Доброй ночи')
  })

  it('builds display name from name or email', () => {
    expect(getDisplayName(' Ash ', 'x@y.com')).toBe('Ash')
    expect(getDisplayName(null, 'ivan@test.com')).toBe('Ivan')
  })
})
