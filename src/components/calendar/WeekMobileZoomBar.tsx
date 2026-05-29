import type { WeekMobileZoom } from '../../utils/weekMobileZoom'
import './WeekMobileZoomBar.css'

interface WeekMobileZoomBarProps {
  value: WeekMobileZoom
  onChange: (value: WeekMobileZoom) => void
}

export function WeekMobileZoomBar({ value, onChange }: WeekMobileZoomBarProps) {
  return (
    <div className="week-mobile-zoom" role="group" aria-label="Масштаб недели">
      <span className="week-mobile-zoom-label">Масштаб</span>
      <div className="week-mobile-zoom-options">
        <button
          type="button"
          className={[
            'week-mobile-zoom-btn',
            value === 'overview' && 'week-mobile-zoom-btn--active',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-pressed={value === 'overview'}
          onClick={() => onChange('overview')}
        >
          Обзор
        </button>
        <button
          type="button"
          className={[
            'week-mobile-zoom-btn',
            value === 'detail' && 'week-mobile-zoom-btn--active',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-pressed={value === 'detail'}
          onClick={() => onChange('detail')}
        >
          Крупно
        </button>
      </div>
    </div>
  )
}
