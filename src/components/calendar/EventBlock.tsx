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
  if (compact) {
    return (
      <button
        type="button"
        className="event-block event-block--compact"
        style={{ backgroundColor: event.color ?? 'var(--accent-primary)' }}
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
      className="event-block"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: event.color ?? 'var(--accent-primary)',
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
    >
      <span className="event-block-title">{event.title}</span>
      <span className="event-block-time">
        {format(event.start, 'HH:mm', { locale: ru })} –{' '}
        {format(event.end, 'HH:mm', { locale: ru })}
      </span>
    </button>
  )
}
