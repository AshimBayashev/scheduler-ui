import { useCallback, useEffect, useState } from 'react'
import {
  fetchVapidPublicKey,
  subscribeBrowserPush,
  subscribePush,
} from '../api/notifications'

const STORAGE_KEY = 'scheduler-push-enabled'

export function usePushNotifications() {
  const [supported] = useState(
    () =>
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window,
  )
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enable = useCallback(async () => {
    if (!supported) {
      setError('Браузер не поддерживает push-уведомления')
      return false
    }

    setLoading(true)
    setError(null)
    try {
      const { publicKey } = await fetchVapidPublicKey()
      if (!publicKey) {
        throw new Error('Push не настроен на сервере')
      }

      const payload = await subscribeBrowserPush(publicKey)
      await subscribePush(payload)
      localStorage.setItem(STORAGE_KEY, '1')
      setEnabled(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось включить напоминания')
      return false
    } finally {
      setLoading(false)
    }
  }, [supported])

  useEffect(() => {
    if (!supported || !enabled || Notification.permission !== 'granted') return
    fetchVapidPublicKey()
      .then(({ publicKey }) => {
        if (!publicKey) return
        return subscribeBrowserPush(publicKey).then(subscribePush)
      })
      .catch(() => {
        /* re-subscribe on next explicit enable */
      })
  }, [supported, enabled])

  return { supported, enabled, loading, error, enable }
}
