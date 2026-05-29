import {
  createTelegramLink,
  type TelegramLinkResponse,
} from '../../api/notifications'
import { useTelegramStatus } from '../../hooks/useTelegramStatus'
import { useState } from 'react'
import './TelegramConnect.css'

/** Баннер только для пользователей без Telegram. При linked=true ничего не рендерится. */
export function TelegramBanner() {
  const { status } = useTelegramStatus(8000)
  const [link, setLink] = useState<TelegramLinkResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!status?.enabled || status.linked) {
    return null
  }

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await createTelegramLink()
      setLink(data)
      if (data.botUrl) {
        window.open(data.botUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать ссылку')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell-notices">
      <div className="telegram-connect" role="region" aria-label="Telegram">
        <div className="telegram-connect-text">
          <strong>Telegram</strong>
          <span>Напоминания о делах и рутинах прямо в Telegram</span>
        </div>
        <button
          type="button"
          className="telegram-connect-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? '…' : 'Подключить'}
        </button>
        {link?.botUrl && (
          <a
            className="telegram-connect-link"
            href={link.botUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть @{link.botUsername}
          </a>
        )}
        {error && <p className="telegram-connect-error">{error}</p>}
      </div>
    </div>
  )
}
