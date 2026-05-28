import { apiFetch } from './client'

export interface PushSubscriptionPayload {
  subscription: {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }
  timezone?: string
}

export interface TelegramStatus {
  enabled: boolean
  linked: boolean
  botUsername: string | null
}

export interface TelegramLinkResponse {
  enabled: boolean
  token?: string
  botUsername?: string
  botUrl?: string
  expiresAt?: string
}

export function fetchVapidPublicKey() {
  return apiFetch<{ publicKey: string | null }>('/notifications/vapid-public-key')
}

export function subscribePush(data: PushSubscriptionPayload) {
  return apiFetch<{ success: boolean }>('/notifications/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function unsubscribePush(endpoint: string) {
  return apiFetch<{ success: boolean }>('/notifications/push/subscribe', {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
  })
}

export function fetchTelegramStatus() {
  return apiFetch<TelegramStatus>('/notifications/telegram/status')
}

export function createTelegramLink() {
  return apiFetch<TelegramLinkResponse>('/notifications/telegram/link', {
    method: 'POST',
  })
}

export function unlinkTelegram() {
  return apiFetch<{ success: boolean }>('/notifications/telegram', {
    method: 'DELETE',
  })
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null
  return navigator.serviceWorker.register('/sw.js')
}

export async function subscribeBrowserPush(publicKey: string) {
  const registration = await registerServiceWorker()
  if (!registration) throw new Error('Service Worker недоступен')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Разрешение на уведомления не получено')
  }

  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  }

  const json = subscription.toJSON()
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error('Не удалось оформить подписку')
  }

  return {
    subscription: {
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}
