import { apiFetch } from './client'

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
