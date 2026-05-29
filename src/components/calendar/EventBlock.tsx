import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CalendarEvent } from '../../types/event'
import type { FamilyMemberVisual } from '../../utils/familyMemberColors'
import { OverflowTooltipText } from '../common/OverflowTooltipText'
import { UserAvatar } from '../common/UserAvatar'
import { getEventHeight, getEventTop } from '../../utils/dateUtils'
import './EventBlock.css'

interface EventBlockProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
  compact?: boolean
  memberVisuals?: Record<string, FamilyMemberVisual>
  dense?: boolean
  hourHeight?: number
}

function EventMemberBadge({
  member,
  small,
}: {
  member: FamilyMemberVisual
  small?: boolean
}) {
  return (
    <span className="event-block-member-badge" aria-hidden>
      <UserAvatar
        name={member.name}
        email={member.email}
        avatarUrl={member.avatarUrl}
        size={small ? 'xxs' : 'xs'}
        className="event-block-member-avatar"
      />
    </span>
  )
}

export function EventBlock({
  event,
  onClick,
  compact,
  memberVisuals,
  dense,
  hourHeight,
}: EventBlockProps) {
  const color = event.color ?? 'var(--accent-primary)'
  const isRoutine = event.isRoutine
  const member =
    event.ownerUserId && memberVisuals?.[event.ownerUserId]
      ? memberVisuals[event.ownerUserId]
      : null
  const showMemberBadge = !!member
  const ownerLabel = event.ownerName ?? member?.name ?? undefined

  const blockClassName = [
    'event-block',
    compact && 'event-block--compact',
    isRoutine && 'event-block--routine',
    member && 'event-block--member-stripe',
    showMemberBadge && 'event-block--member-badge',
    dense && 'event-block--dense',
  ]
    .filter(Boolean)
    .join(' ')

  const blockStyle = {
    '--block-color': color,
    '--member-stripe-color': member?.color,
  } as React.CSSProperties

  const tooltipTitle =
    member && ownerLabel ? `${event.title} · ${ownerLabel}` : undefined

  if (compact) {
    return (
      <button
        type="button"
        className={blockClassName}
        style={blockStyle}
        onClick={(e) => {
          e.stopPropagation()
          onClick(event)
        }}
        title={tooltipTitle}
      >
        {showMemberBadge && member && (
          <EventMemberBadge member={member} small />
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
      className={blockClassName}
      style={{
        ...blockStyle,
        top: `${top}px`,
        height: `${height}px`,
        zIndex: showMemberBadge ? 3 : isRoutine ? 1 : 2,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      title={tooltipTitle}
    >
      {showMemberBadge && member && (
        <EventMemberBadge member={member} small={dense} />
      )}
      <OverflowTooltipText text={event.title} className="event-block-title" />
      {!dense && !isRoutine && (
        <span className="event-block-time">
          {format(event.start, 'HH:mm', { locale: ru })} –{' '}
          {format(event.end, 'HH:mm', { locale: ru })}
        </span>
      )}
      {!dense && isRoutine && (
        <span className="event-block-time">
          рутина · {format(event.start, 'HH:mm', { locale: ru })}
        </span>
      )}
    </button>
  )
}
