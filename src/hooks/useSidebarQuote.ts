import { useMemo } from 'react'
import { SIDEBAR_QUOTES, type Quote } from '../data/sidebarQuotes'

const STORAGE_PREFIX = 'scheduler-seen-quotes'

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`
}

function readSeenIds(userId: string): number[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : []
  } catch {
    return []
  }
}

function writeSeenIds(userId: string, ids: number[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(ids))
}

export function pickUnseenQuote(userId: string): Quote {
  const seen = readSeenIds(userId)
  let pool = SIDEBAR_QUOTES.filter((q) => !seen.includes(q.id))

  if (pool.length === 0) {
    pool = SIDEBAR_QUOTES
    writeSeenIds(userId, [])
  }

  const quote = pool[Math.floor(Math.random() * pool.length)]
  writeSeenIds(userId, [...seen, quote.id])
  return quote
}

export function useSidebarQuote(userId: string | undefined): Quote | null {
  return useMemo(() => {
    if (!userId) return null
    return pickUnseenQuote(userId)
  }, [userId])
}
