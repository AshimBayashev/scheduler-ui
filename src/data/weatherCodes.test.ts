import { describe, expect, it } from 'vitest'
import { weatherCodeToKind, WEATHER_LABELS } from './weatherCodes'

describe('weatherCodeToKind', () => {
  it('maps WMO codes to weather kinds', () => {
    expect(weatherCodeToKind(0)).toBe('clear')
    expect(weatherCodeToKind(3)).toBe('cloudy')
    expect(weatherCodeToKind(61)).toBe('rain')
    expect(weatherCodeToKind(95)).toBe('thunderstorm')
  })

  it('defaults unknown codes to partly-cloudy', () => {
    expect(weatherCodeToKind(42)).toBe('partly-cloudy')
    expect(weatherCodeToKind(null)).toBe('partly-cloudy')
  })

  it('has labels for every kind', () => {
    const kinds = ['clear', 'rain', 'snow', 'thunderstorm'] as const
    for (const kind of kinds) {
      expect(WEATHER_LABELS[kind]).toBeTruthy()
    }
  })
})
