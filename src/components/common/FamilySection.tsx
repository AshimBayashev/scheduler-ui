import { type FormEvent, useState } from 'react'
import { ApiError, useAuth } from '../../context/AuthContext'
import {
  cancelFamilyInvitation,
  createFamily,
  deleteFamily,
  getMemberDisplayName,
  inviteToFamily,
  removeFamilyMember,
  updateFamilyName,
} from '../../api/family'
import { useFamily } from '../../context/FamilyContext'
import { UserAvatar } from './UserAvatar'
import './FamilySection.css'

export function FamilySection() {
  const { user } = useAuth()
  const { overview, loading, refreshFamily } = useFamily()
  const [familyName, setFamilyName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (loading && !overview) {
    return <p className="family-section-muted">Загрузка…</p>
  }

  if (!overview) return null

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    setError(null)
    try {
      await createFamily(familyName.trim() || undefined)
      setFamilyName('')
      setMessage('Семья создана')
      await refreshFamily()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать семью')
    } finally {
      setBusy(false)
    }
  }

  const handleRename = async (e: FormEvent) => {
    e.preventDefault()
    if (!overview.family) return
    setBusy(true)
    setMessage(null)
    setError(null)
    try {
      await updateFamilyName(familyName.trim() || overview.family.name)
      setMessage('Название сохранено')
      await refreshFamily()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить')
    } finally {
      setBusy(false)
    }
  }

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    setError(null)
    try {
      await inviteToFamily(inviteEmail.trim())
      setInviteEmail('')
      setMessage('Приглашение отправлено')
      await refreshFamily()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось пригласить')
    } finally {
      setBusy(false)
    }
  }

  const handleCancelInvite = async (invitationId: string) => {
    setBusy(true)
    setError(null)
    try {
      await cancelFamilyInvitation(invitationId)
      await refreshFamily()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось отменить')
    } finally {
      setBusy(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    setBusy(true)
    setError(null)
    try {
      await removeFamilyMember(userId)
      setMessage('Участник удалён')
      await refreshFamily()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось удалить')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteFamily = async () => {
    if (!window.confirm('Расформировать семью? Все участники потеряют общий доступ.')) {
      return
    }
    setBusy(true)
    setError(null)
    try {
      await deleteFamily()
      setMessage(null)
      await refreshFamily()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось расформировать')
    } finally {
      setBusy(false)
    }
  }

  if (!overview.inFamily) {
    return (
      <div className="family-section">
        <p className="family-section-lead">
          Общий календарь для близких — каждый видит дела друг друга, кроме скрытых.
        </p>
        <form className="family-section-form" onSubmit={handleCreate}>
          <label className="family-section-field">
            <span>Название (необязательно)</span>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Например: Мы"
              maxLength={100}
            />
          </label>
          <button type="submit" className="family-section-btn" disabled={busy}>
            {busy ? 'Создание…' : 'Создать семью'}
          </button>
        </form>
        {message && <p className="family-section-success">{message}</p>}
        {error && <p className="family-section-error">{error}</p>}
      </div>
    )
  }

  const isOwner = overview.role === 'owner'
  const currentName = overview.family?.name ?? ''

  return (
    <div className="family-section">
      {isOwner ? (
        <form className="family-section-form" onSubmit={handleRename}>
          <label className="family-section-field">
            <span>Название семьи</span>
            <input
              type="text"
              defaultValue={currentName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder={currentName}
              maxLength={100}
            />
          </label>
          <button type="submit" className="family-section-btn family-section-btn--secondary" disabled={busy}>
            Сохранить название
          </button>
        </form>
      ) : (
        <p className="family-section-family-name">{currentName}</p>
      )}

      <div className="family-section-members">
        <h3 className="family-section-subtitle">Участники</h3>
        <ul className="family-section-member-list">
          {overview.members.map((member) => (
            <li key={member.userId} className="family-section-member">
              <UserAvatar
                name={member.name}
                email={member.email}
                avatarUrl={member.avatarUrl}
                size="sm"
              />
              <div className="family-section-member-info">
                <span className="family-section-member-name">
                  {getMemberDisplayName(member)}
                </span>
                <span className="family-section-member-role">
                  {member.role === 'owner' ? 'создатель' : 'участник'}
                </span>
              </div>
              {isOwner && member.role !== 'owner' && (
                <button
                  type="button"
                  className="family-section-link-btn"
                  disabled={busy}
                  onClick={() => handleRemoveMember(member.userId)}
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isOwner && (
        <>
          <form className="family-section-form" onSubmit={handleInvite}>
            <label className="family-section-field">
              <span>Пригласить по email</span>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </label>
            <button type="submit" className="family-section-btn" disabled={busy}>
              Отправить приглашение
            </button>
          </form>

          {overview.sentInvitations.length > 0 && (
            <div className="family-section-pending">
              <h3 className="family-section-subtitle">Ожидают ответа</h3>
              <ul className="family-section-pending-list">
                {overview.sentInvitations.map((inv) => (
                  <li key={inv.id} className="family-section-pending-item">
                    <span>{inv.email}</span>
                    <button
                      type="button"
                      className="family-section-link-btn"
                      disabled={busy}
                      onClick={() => handleCancelInvite(inv.id)}
                    >
                      Отменить
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="family-section-btn family-section-btn--danger"
            disabled={busy}
            onClick={handleDeleteFamily}
          >
            Расформировать семью
          </button>
        </>
      )}

      {!isOwner && user && (
        <button
          type="button"
          className="family-section-btn family-section-btn--secondary"
          disabled={busy}
          onClick={() => handleRemoveMember(user.id)}
        >
          Выйти из семьи
        </button>
      )}

      {message && <p className="family-section-success">{message}</p>}
      {error && <p className="family-section-error">{error}</p>}
    </div>
  )
}
