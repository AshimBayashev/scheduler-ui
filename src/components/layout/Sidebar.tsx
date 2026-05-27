import { MiniCalendar } from '../calendar/MiniCalendar'
import { ThemeToggle } from '../common/ThemeToggle'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

interface SidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onNewEvent: () => void
  onClose?: () => void
  isOpen?: boolean
  eventDates: Date[]
}

export function Sidebar({
  selectedDate,
  onDateSelect,
  onNewEvent,
  onClose,
  isOpen = false,
  eventDates,
}: SidebarProps) {
  const { user, logout } = useAuth()

  const handleDateSelect = (date: Date) => {
    onDateSelect(date)
    onClose?.()
  }

  const handleNewEvent = () => {
    onNewEvent()
    onClose?.()
  }

  return (
    <aside className={['sidebar', isOpen && 'sidebar--open'].filter(Boolean).join(' ')}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Scheduler</span>
        </div>
        <div className="sidebar-top-actions">
          <ThemeToggle />
          {onClose && (
            <button
              type="button"
              className="sidebar-close"
              onClick={onClose}
              aria-label="Закрыть меню"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <button type="button" className="sidebar-new-btn" onClick={handleNewEvent}>
        <span className="sidebar-new-icon">+</span>
        Новое дело
      </button>

      <MiniCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        eventDates={eventDates}
      />

      <div className="sidebar-hint">
        <p>Записывай дела сразу — потом не вспомнишь, что ел на завтрак.</p>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{user?.name || user?.email}</span>
          {user?.name && <span className="sidebar-user-email">{user.email}</span>}
        </div>
        <button type="button" className="sidebar-logout" onClick={logout}>
          Выйти
        </button>
      </div>
    </aside>
  )
}
