import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchTelegramStatus, type TelegramStatus } from '../api/notifications'

export function useTelegramStatus(pollMs?: number) {
  const [status, setStatus] = useState<TelegramStatus | null>(null)
  const [failed, setFailed] = useState(false)
  const intervalRef = useRef<number | undefined>(undefined)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchTelegramStatus()
      setStatus(data)
      setFailed(false)
      return data
    } catch {
      setFailed(true)
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      const data = await refresh()
      if (cancelled || !data || !pollMs) return
      if (data.linked && intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }

    void tick()

    if (pollMs) {
      intervalRef.current = window.setInterval(tick, pollMs)
    }

    return () => {
      cancelled = true
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [pollMs, refresh])

  return { status, failed, refresh }
}
