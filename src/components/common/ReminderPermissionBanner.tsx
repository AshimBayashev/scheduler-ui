import { usePushNotifications } from '../../hooks/usePushNotifications'
import './ReminderPermissionBanner.css'

export function ReminderPermissionBanner() {
  const { supported, enabled, loading, error, enable } = usePushNotifications()

  if (!supported || enabled) return null

  return (
    <div className="reminder-banner" role="region" aria-label="Напоминания">
      <div className="reminder-banner-text">
        <strong>Напоминания</strong>
        <span>Чтобы не пропустить дела и рутины — разреши уведомления в браузере.</span>
      </div>
      <button
        type="button"
        className="reminder-banner-btn"
        onClick={() => enable()}
        disabled={loading}
      >
        {loading ? 'Подключение…' : 'Включить'}
      </button>
      {error && <p className="reminder-banner-error">{error}</p>}
    </div>
  )
}
