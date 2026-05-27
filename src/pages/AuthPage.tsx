import { useState, type FormEvent } from 'react'
import { ApiError, useAuth } from '../context/AuthContext'
import { ThemeSelect } from '../components/common/ThemeSelect'
import './AuthPage.css'

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name || undefined)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Что-то пошло не так')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-theme">
        <ThemeSelect />
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1>Scheduler</h1>
        </div>

        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Войди, чтобы не забыть важное'
            : 'Создай аккаунт и начни записывать дела'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="name">Имя</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к тебе обращаться?"
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting
              ? 'Подождите...'
              : mode === 'login'
                ? 'Войти'
                : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError(null)
            }}
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  )
}
