import { describe, expect, it } from 'vitest'
import {
  formatDateRange,
  getEventHeight,
  getEventTop,
  HOUR_HEIGHT,
  MIN_EVENT_HEIGHT,
  navigateDate,
  roundToHalfHour,
} from './dateUtils'

describe('dateUtils', () => {
  it('calculates event position from time', () => {
    const start = new Date(2026, 4, 28, 10, 30, 0);
    expect(getEventTop(start)).toBe(10.5 * HOUR_HEIGHT);
  });

  it('calculates event height with minimum', () => {
    const start = new Date(2026, 4, 28, 10, 0, 0);
    const end = new Date(2026, 4, 28, 10, 15, 0);
    expect(getEventHeight(start, end)).toBe(MIN_EVENT_HEIGHT);
  });

  it('rounds to half hour', () => {
    const date = new Date(2026, 4, 28, 10, 40, 0)
    expect(roundToHalfHour(date).getMinutes()).toBe(30)
  })

  it('navigates day forward', () => {
    const date = new Date(2026, 4, 28);
    const next = navigateDate(date, 'day', 1);
    expect(next.getDate()).toBe(29);
  });

  it('formats day view range', () => {
    const date = new Date(2026, 4, 28);
    expect(formatDateRange(date, 'day')).toMatch(/28/);
  });
});
