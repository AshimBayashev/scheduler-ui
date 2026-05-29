import { type FormEvent, useRef, useState } from 'react'
import { ApiError, useAuth } from '../context/AuthContext'
import { changePassword, updateProfile } from '../api/profile'
import { TelegramConnect } from '../components/common/TelegramConnect'
import { UserAvatar } from '../components/common/UserAvatar'
import { resizeAvatar } from '../utils/resizeAvatar'
import './ProfilePage.css'

export function ProfilePage() {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileSaving, setProfileSaving] = useState(false)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  if (!user) return null

  const handleAvatarPick = async (file: File | undefined) => {
    if (!file) return
    setAvatarSaving(true)
    setAvatarError(null)
    try {
      const dataUrl = await resizeAvatar(file)
      const updated = await updateProfile({ avatarUrl: dataUrl })
      updateUser(updated)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Не удалось загрузить фото')
    } finally {
      setAvatarSaving(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatarSaving(true)
    setAvatarError(null)
    try {
      const updated = await updateProfile({ avatarUrl: null })
      updateUser(updated)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Не удалось удалить фото')
    } finally {
      setAvatarSaving(false)
    }
  }

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMessage(null)
    setProfileError(null)
    try {
      const payload: { name?: string; email?: string } = {}
      const trimmedName = name.trim()
      if (trimmedName !== (user.name ?? '')) {
        payload.name = trimmedName
      }
      if (email.trim().toLowerCase() !== user.email) {
        payload.email = email.trim()
      }
      if (Object.keys(payload).length === 0) {
        setProfileMessage('Нечего сохранять')
        return
      }
      const updated = await updateProfile(payload)
      updateUser(updated)
      setName(updated.name ?? '')
      setEmail(updated.email)
      setProfileMessage('Сохранено')
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Не удалось сохранить')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают')
      return
    }

    setPasswordSaving(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Пароль обновлён')
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : 'Не удалось сменить пароль')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">Профиль</h1>
        <p className="profile-subtitle">Имя, почта, пароль и уведомления</p>
      </header>

      <section className="profile-card" aria-labelledby="profile-avatar-heading">
        <h2 id="profile-avatar-heading" className="profile-card-title">
          Фото
        </h2>
        <div className="profile-avatar-row">
          <UserAvatar
            name={user.name}
            email={user.email}
            avatarUrl={user.avatarUrl}
            size="lg"
          />
          <div className="profile-avatar-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="profile-file-input"
              onChange={(e) => handleAvatarPick(e.target.files?.[0])}
            />
            <button
              type="button"
              className="profile-btn profile-btn--secondary"
              disabled={avatarSaving}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarSaving ? 'Загрузка…' : 'Выбрать фото'}
            </button>
            {user.avatarUrl && (
              <button
                type="button"
                className="profile-btn profile-btn--ghost"
                disabled={avatarSaving}
                onClick={handleRemoveAvatar}
              >
                Удалить
              </button>
            )}
          </div>
        </div>
        {avatarError && <p className="profile-error">{avatarError}</p>}
      </section>

      <section className="profile-card" aria-labelledby="profile-info-heading">
        <h2 id="profile-info-heading" className="profile-card-title">
          Основное
        </h2>
        <form className="profile-form" onSubmit={handleProfileSave}>
          <label className="profile-field">
            <span>Имя</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к тебе обращаться"
              maxLength={100}
              autoComplete="name"
            />
          </label>
          <label className="profile-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              autoComplete="email"
              required
            />
          </label>
          <div className="profile-form-footer">
            <button type="submit" className="profile-btn" disabled={profileSaving}>
              {profileSaving ? 'Сохранение…' : 'Сохранить'}
            </button>
            {profileMessage && <p className="profile-success">{profileMessage}</p>}
            {profileError && <p className="profile-error">{profileError}</p>}
          </div>
        </form>
      </section>

      <section className="profile-card" aria-labelledby="profile-password-heading">
        <h2 id="profile-password-heading" className="profile-card-title">
          Пароль
        </h2>
        <form className="profile-form" onSubmit={handlePasswordSave}>
          <label className="profile-field">
            <span>Текущий пароль</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label className="profile-field">
            <span>Новый пароль</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </label>
          <label className="profile-field">
            <span>Повтор нового пароля</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </label>
          <div className="profile-form-footer">
            <button type="submit" className="profile-btn" disabled={passwordSaving}>
              {passwordSaving ? 'Сохранение…' : 'Сменить пароль'}
            </button>
            {passwordMessage && <p className="profile-success">{passwordMessage}</p>}
            {passwordError && <p className="profile-error">{passwordError}</p>}
          </div>
        </form>
      </section>

      <section className="profile-card" aria-labelledby="profile-telegram-heading">
        <h2 id="profile-telegram-heading" className="profile-card-title">
          Telegram
        </h2>
        <TelegramConnect />
      </section>
    </div>
  )
}
