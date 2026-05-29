import { apiFetch } from './client'
import type { AuthUser } from './auth'

export function updateProfile(data: {
  name?: string
  email?: string
  avatarUrl?: string | null
}) {
  return apiFetch<AuthUser>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<{ success: boolean }>('/profile/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
