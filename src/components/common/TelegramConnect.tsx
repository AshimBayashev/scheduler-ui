import { useState } from 'react'
import {
  createTelegramLink,
  unlinkTelegram,
  type TelegramLinkResponse,
} from '../../api/notifications'
import { useTelegramStatus } from '../../hooks/useTelegramStatus'
import './TelegramConnect.css'

interface TelegramConnectProps {
  /** На странице настроек — без дублирующего заголовка «Telegram». */
  embedded?: boolean
}

/** Секция Telegram на странице профиля — всегда видна, если бот включён на сервере. */
export function TelegramConnect({ embedded = false }: TelegramConnectProps) {
  const { status, failed, refresh } = useTelegramStatus()
  const [link, setLink] = useState<TelegramLinkResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!status && !failed) return null

  if (failed) {
    return (
      <div className="telegram-connect telegram-connect--settings telegram-connect--warn">
        <div className="telegram-connect-text">
          {!embedded && <strong>Telegram</strong>}
          <span>Не удалось проверить статус. Обнови страницу.</span>
        </div>
      </div>
    )
  }

  if (status && !status.enabled) {
    return (
      <div className="telegram-connect telegram-connect--settings telegram-connect--warn">
        <div className="telegram-connect-text">
          {!embedded && <strong>Telegram</strong>}
          <span>Бот не настроен на сервере — напоминания в Telegram недоступны.</span>
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
    <div className="telegram-connect telegram-connect--settings" role="region" aria-label="Telegram">
      <div className="telegram-connect-text">
        {!embedded && <strong>Telegram</strong>}
        {status.linked ? (
          <span>
            Подключён{status.botUsername ? ` (@${status.botUsername})` : ''} — напоминания
            приходят в бота
          </span>
        ) : (
          <span>
            {embedded
              ? 'Подключи бота — и напоминания будут приходить сюда'
              : 'Напоминания о делах и рутинах прямо в Telegram'}
          </span>
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
