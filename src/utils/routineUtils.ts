import type { Routine } from '../types/routine'
import { DAY_PRESETS, WEEKDAY_LABELS } from '../types/routine'

export function formatRoutineDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b)
  const key = sorted.join(',')

  if (key === DAY_PRESETS.everyDay.join(',')) return 'Каждый день'
  if (key === DAY_PRESETS.weekdays.join(',')) return 'Будни'
  if (key === DAY_PRESETS.weekend.join(',')) return 'Выходные'

  return sorted
    .map((d) => WEEKDAY_LABELS.find((w) => w.iso === d)?.label ?? '')
    .filter(Boolean)
    .join(', ')
}

export function findRoutineById(routines: Routine[], id: string) {
  return routines.find((r) => r.id === id) ?? null
}
