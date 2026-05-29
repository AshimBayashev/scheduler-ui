import type { CalendarView } from '../../types/event'
import { formatDateRange } from '../../utils/dateUtils'
import './CalendarHeader.css'

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onNavigate: (direction: -1 | 1) => void
  onToday: () => void
  onMenuClick?: () => void
  toolbar?: React.ReactNode
}

const VIEWS: { id: CalendarView; label: string; shortLabel: string }[] = [
  { id: 'day', label: 'День', shortLabel: 'Д' },
  { id: 'week', label: 'Неделя', shortLabel: 'Н' },
  { id: 'month', label: 'Месяц', shortLabel: 'М' },
]

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onToday,
  onMenuClick,
  toolbar,
}: CalendarHeaderProps) {
  return (
    <header className="calendar-header">
      <div className="calendar-header-row">
        <div className="calendar-header-left">
          {onMenuClick && (
            <button
              type="button"
              className="btn-menu"
              onClick={onMenuClick}
              aria-label="Открыть меню"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          <button type="button" className="btn-today" onClick={onToday}>
            Сегодня
          </button>

          <div className="calendar-nav">
            <button
              type="button"
              className="btn-nav"
              onClick={() => onNavigate(-1)}
              aria-label="Назад"
            >
              ‹
            </button>
            <button
              type="button"
              className="btn-nav"
              onClick={() => onNavigate(1)}
              aria-label="Вперёд"
            >
              ›
            </button>
          </div>
        </div>

        <div className="view-switcher view-switcher--desktop" role="tablist">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={['view-tab', view === v.id && 'view-tab--active'].filter(Boolean).join(' ')}
              onClick={() => onViewChange(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <h1 className="calendar-title">{formatDateRange(currentDate, view)}</h1>

      {toolbar && <div className="calendar-toolbar">{toolbar}</div>}

      <div className="view-switcher view-switcher--mobile" role="tablist">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            aria-label={v.label}
            className={['view-tab', view === v.id && 'view-tab--active'].filter(Boolean).join(' ')}
            onClick={() => onViewChange(v.id)}
          >
            <span className="view-tab-full">{v.label}</span>
            <span className="view-tab-short">{v.shortLabel}</span>
          </button>
        ))}
      </div>
    </header>
  )
}
