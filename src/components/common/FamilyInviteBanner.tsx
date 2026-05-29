import { useState } from 'react'
import {
  acceptFamilyInvitation,
  declineFamilyInvitation,
  type IncomingFamilyInvitation,
} from '../../api/family'
import { useFamily } from '../../context/FamilyContext'
import './FamilyInviteBanner.css'

export function FamilyInviteBanner() {
  const { overview, refreshFamily } = useFamily()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const invite = overview?.incomingInvitations[0]
  if (!invite || overview.inFamily) {
    return null
  }

  const handleAccept = async (item: IncomingFamilyInvitation) => {
    setLoadingId(item.id)
    setError(null)
    try {
      await acceptFamilyInvitation(item.id)
      await refreshFamily()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось принять')
    } finally {
      setLoadingId(null)
    }
  }

  const handleDecline = async (item: IncomingFamilyInvitation) => {
    setLoadingId(item.id)
    setError(null)
    try {
      await declineFamilyInvitation(item.id)
      await refreshFamily()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отклонить')
    } finally {
      setLoadingId(null)
    }
  }

  const inviter = invite.inviterName?.trim() || 'Кто-то'

  return (
    <div className="app-shell-notices">
      <div className="family-invite-banner" role="region" aria-label="Приглашение в семью">
        <div className="family-invite-banner-text">
          <strong>Семья</strong>
          <span>
            {inviter} приглашает в «{invite.familyName}»
          </span>
        </div>
        <div className="family-invite-banner-actions">
          <button
            type="button"
            className="family-invite-banner-btn family-invite-banner-btn--primary"
            disabled={loadingId === invite.id}
            onClick={() => handleAccept(invite)}
          >
            {loadingId === invite.id ? '…' : 'Принять'}
          </button>
          <button
            type="button"
            className="family-invite-banner-btn family-invite-banner-btn--secondary"
            disabled={loadingId === invite.id}
            onClick={() => handleDecline(invite)}
          >
            Отклонить
          </button>
        </div>
        {error && <p className="family-invite-banner-error">{error}</p>}
      </div>
    </div>
  )
}
