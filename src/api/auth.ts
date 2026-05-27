import { apiFetch, setToken, clearToken } from './client'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  createdAt: string
}

interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export async function register(email: string, password: string, name?: string) {
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
  setToken(data.accessToken)
  return data
}

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.accessToken)
  return data
}

export async function fetchMe() {
  return apiFetch<AuthUser>('/auth/me')
}

export function logout() {
  clearToken()
}
