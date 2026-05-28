import { useCallback, useEffect, useState } from 'react'
import {
  createTelegramLink,
  fetchTelegramStatus,
  unlinkTelegram,
  type TelegramLinkResponse,
  type TelegramStatus,
} from '../../api/notifications'
import './TelegramConnect.css'

export function TelegramConnect() {
  const [status, setStatus] = useState<TelegramStatus | null>(null)
  const [link, setLink] = useState<TelegramLinkResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchTelegramStatus()
      setStatus(data)
      setLoadFailed(false)
    } catch {
      setLoadFailed(true)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = window.setInterval(refresh, 8000)
    return () => window.clearInterval(id)
  }, [refresh])

  if (status === null && !loadFailed) return null

  if (loadFailed) {
    return (
      <div className="telegram-connect telegram-connect--warn" role="region" aria-label="Telegram">
        <div className="telegram-connect-text">
          <strong>Telegram</strong>
          <span>Не удалось проверить статус. Обнови страницу.</span>
        </div>
      </div>
    )
  }

  if (status && !status.enabled) {
    return (
      <div className="telegram-connect telegram-connect--warn" role="region" aria-label="Telegram">
        <div className="telegram-connect-text">
          <strong>Telegram</strong>
          <span>
            Бот не настроен на сервере. Добавь <code>TELEGRAM_BOT_TOKEN</code> в{' '}
            <code>.env</code> на VPS и запусти <code>./deploy.sh</code>.
          </span>
        </div>
      </div>
    )
  }

  if (!status) return null

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

  const handleDisconnect = async () => {
    setLoading(true)
    setError(null)
    try {
      await unlinkTelegram()
      setLink(null)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отключить')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="telegram-connect" role="region" aria-label="Telegram">
      <div className="telegram-connect-text">
        <strong>Telegram</strong>
        {status.linked ? (
          <span>Подключён — напоминания приходят в бота</span>
        ) : (
          <span>Напоминания о делах и рутинах прямо в Telegram</span>
        )}
      </div>

      {status.linked ? (
        <button
          type="button"
          className="telegram-connect-btn telegram-connect-btn--secondary"
          onClick={handleDisconnect}
          disabled={loading}
        >
          Отключить
        </button>
      ) : (
        <button
          type="button"
          className="telegram-connect-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? '…' : 'Подключить'}
        </button>
      )}

      {link?.botUrl && !status.linked && (
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
  )
}
