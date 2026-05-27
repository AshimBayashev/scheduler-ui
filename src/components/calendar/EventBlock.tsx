import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CalendarEvent } from '../../types/event'
import { getEventHeight, getEventTop } from '../../utils/dateUtils'
import './EventBlock.css'

interface EventBlockProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
  compact?: boolean
}

export function EventBlock({ event, onClick, compact }: EventBlockProps) {
  const color = event.color ?? 'var(--accent-primary)'
  const isRoutine = event.isRoutine

  if (compact) {
    return (
      <button
        type="button"
        className={['event-block', 'event-block--compact', isRoutine && 'event-block--routine']
          .filter(Boolean)
          .join(' ')}
        style={{ '--block-color': color } as React.CSSProperties}
        onClick={(e) => {
          e.stopPropagation()
          onClick(event)
        }}
        title={event.title}
      >
        <span className="event-block-title">{event.title}</span>
      </button>
    )
  }

  const top = getEventTop(event.start)
  const height = getEventHeight(event.start, event.end)

  return (
    <button
      type="button"
      className={['event-block', isRoutine && 'event-block--routine'].filter(Boolean).join(' ')}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        '--block-color': color,
        zIndex: isRoutine ? 1 : 2,
      } as React.CSSProperties}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
    >
      <span className="event-block-title">{event.title}</span>
      {!isRoutine && (
        <span className="event-block-time">
          {format(event.start, 'HH:mm', { locale: ru })} –{' '}
          {format(event.end, 'HH:mm', { locale: ru })}
        </span>
      )}
      {isRoutine && (
        <span className="event-block-time">рутина · {format(event.start, 'HH:mm', { locale: ru })}</span>
      )}
    </button>
  )
}
