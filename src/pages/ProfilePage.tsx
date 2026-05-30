import { type FormEvent, useRef, useState } from 'react'
import { ApiError, useAuth } from '../context/AuthContext'
import { changePassword, updateProfile } from '../api/profile'
import { TelegramConnect } from '../components/common/TelegramConnect'
import { FamilySection } from '../components/common/FamilySection'
import { UserAvatar } from '../components/common/UserAvatar'
import { resizeAvatar } from '../utils/resizeAvatar'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_HINT,
  validatePassword,
} from '../utils/passwordPolicy'
import './ProfilePage.css'

const SECTIONS = [
  { id: 'profile-about', label: 'Обо мне' },
  { id: 'profile-security', label: 'Безопасность' },
  { id: 'profile-notify', label: 'Напоминания' },
  { id: 'profile-family', label: 'Семья' },
] as const

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

    const passwordValidationError = validatePassword(newPassword)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
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
    <div className="profile-page ambient-glow-page">
      <header className="profile-header">
        <h1 className="profile-title">Настройки</h1>
      </header>

      <div className="profile-shell">
        <nav className="profile-nav" aria-label="Разделы настроек">
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="profile-nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="profile-zones">
          <section id="profile-about" className="profile-zone profile-zone--about">
            <div className="profile-zone-head">
              <h2 className="profile-zone-title">Обо мне</h2>
              <p className="profile-zone-lead">Имя и фото — так тебя видят на главной</p>
            </div>

            <div className="profile-about-body">
              <div className="profile-about-photo">
                <UserAvatar
                  name={user.name}
                  email={user.email}
                  avatarUrl={user.avatarUrl}
                  size="lg"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="profile-file-input"
                  onChange={(e) => handleAvatarPick(e.target.files?.[0])}
                />
                <div className="profile-avatar-actions">
                  <button
                    type="button"
                    className="profile-btn profile-btn--secondary"
                    disabled={avatarSaving}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarSaving ? 'Загрузка…' : 'Фото'}
                  </button>
                  {user.avatarUrl && (
                    <button
                      type="button"
                      className="profile-btn profile-btn--ghost"
                      disabled={avatarSaving}
                      onClick={handleRemoveAvatar}
                    >
                      Убрать
                    </button>
                  )}
                </div>
                {avatarError && <p className="profile-error">{avatarError}</p>}
              </div>

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
            </div>
          </section>

          <div className="profile-zones-row">
            <section id="profile-security" className="profile-zone profile-zone--compact">
              <div className="profile-zone-head">
                <h2 className="profile-zone-title">Безопасность</h2>
                <p className="profile-zone-lead">Пароль — только когда нужно сменить</p>
              </div>

              <details className="profile-password-panel">
                <summary className="profile-password-summary">Сменить пароль</summary>
                <form className="profile-form profile-form--nested" onSubmit={handlePasswordSave}>
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
                      minLength={PASSWORD_MIN_LENGTH}
                      maxLength={PASSWORD_MAX_LENGTH}
                      placeholder={PASSWORD_REQUIREMENTS_HINT}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                  <label className="profile-field">
                    <span>Ещё раз</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={PASSWORD_MIN_LENGTH}
                      maxLength={PASSWORD_MAX_LENGTH}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                  <div className="profile-form-footer">
                    <button type="submit" className="profile-btn" disabled={passwordSaving}>
                      {passwordSaving ? 'Сохранение…' : 'Обновить пароль'}
                    </button>
                    {passwordMessage && <p className="profile-success">{passwordMessage}</p>}
                    {passwordError && <p className="profile-error">{passwordError}</p>}
                  </div>
                </form>
              </details>
            </section>

            <section id="profile-notify" className="profile-zone profile-zone--compact">
              <div className="profile-zone-head">
                <h2 className="profile-zone-title">Напоминания</h2>
                <p className="profile-zone-lead">Telegram — пинги о делах и рутинах</p>
              </div>
              <TelegramConnect embedded />
            </section>
          </div>

          <section id="profile-family" className="profile-zone">
            <div className="profile-zone-head">
              <h2 className="profile-zone-title">Семья</h2>
              <p className="profile-zone-lead">Общий календарь и дела близких</p>
            </div>
            <FamilySection />
          </section>
        </div>
      </div>
    </div>
  )
}
