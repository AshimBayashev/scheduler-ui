import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CalendarEvent } from '../../types/event'
import { OverflowTooltipText } from '../common/OverflowTooltipText'
import { getEventHeight, getEventTop } from '../../utils/dateUtils'
import './EventBlock.css'

interface EventBlockProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
  compact?: boolean
  showOwnerLabel?: boolean
  dense?: boolean
  hourHeight?: number
}

export function EventBlock({
  event,
  onClick,
  compact,
  showOwnerLabel,
  dense,
  hourHeight,
}: EventBlockProps) {
  const color = event.color ?? 'var(--accent-primary)'
  const isRoutine = event.isRoutine
  const ownerLabel = showOwnerLabel && event.ownerName ? event.ownerName : null

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
      >
        {ownerLabel && (
          <OverflowTooltipText text={ownerLabel} className="event-block-owner" />
        )}
        <OverflowTooltipText text={event.title} className="event-block-title" />
      </button>
    )
  }

  const top = getEventTop(event.start, hourHeight)
  const height = getEventHeight(event.start, event.end, hourHeight)

  return (
    <button
      type="button"
      className={[
        'event-block',
        isRoutine && 'event-block--routine',
        dense && 'event-block--dense',
      ]
        .filter(Boolean)
        .join(' ')}
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
      {ownerLabel && (
        <OverflowTooltipText text={ownerLabel} className="event-block-owner" />
      )}
      <OverflowTooltipText text={event.title} className="event-block-title" />
      {!dense && !isRoutine && (
        <span className="event-block-time">
          {format(event.start, 'HH:mm', { locale: ru })} –{' '}
          {format(event.end, 'HH:mm', { locale: ru })}
        </span>
      )}
      {!dense && isRoutine && (
        <span className="event-block-time">рутина · {format(event.start, 'HH:mm', { locale: ru })}</span>
      )}
    </button>
  )
}
