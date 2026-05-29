import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CalendarEvent } from '../../types/event'
import { UserAvatar } from '../common/UserAvatar'
import { OverflowTooltipText } from '../common/OverflowTooltipText'
import { getEventHeight, getEventTop } from '../../utils/dateUtils'
import {
  getFamilyMemberVisual,
  type FamilyMemberVisual,
} from '../../utils/familyMemberVisuals'
import './EventBlock.css'

interface EventBlockProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
  compact?: boolean
  familyMemberVisuals?: Map<string, FamilyMemberVisual>
  dense?: boolean
  hourHeight?: number
}

function memberTooltip(event: CalendarEvent, member: FamilyMemberVisual) {
  return `${member.name}: ${event.title}`
}

function OwnerBadge({
  member,
  compact,
}: {
  member: FamilyMemberVisual
  compact?: boolean
}) {
  return (
    <span
      className={['event-block-owner-badge', compact && 'event-block-owner-badge--compact']
        .filter(Boolean)
        .join(' ')}
      style={{ '--owner-accent': member.accentColor } as React.CSSProperties}
    >
      <UserAvatar
        name={member.name}
        email={member.email}
        avatarUrl={member.avatarUrl}
        size="xs"
      />
    </span>
  )
}

export function EventBlock({
  event,
  onClick,
  compact,
  familyMemberVisuals,
  dense,
  hourHeight,
}: EventBlockProps) {
  const color = event.color ?? 'var(--accent-primary)'
  const isRoutine = event.isRoutine
  const owner = getFamilyMemberVisual(familyMemberVisuals, event.ownerUserId)
  const tooltipExtra = owner ? memberTooltip(event, owner) : event.title

  if (compact) {
    return (
      <button
        type="button"
        className={[
          'event-block',
          'event-block--compact',
          isRoutine && 'event-block--routine',
          owner && 'event-block--family-owner',
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          {
            '--block-color': color,
            '--owner-accent': owner?.accentColor,
          } as React.CSSProperties
        }
        onClick={(e) => {
          e.stopPropagation()
          onClick(event)
        }}
        title={owner ? tooltipExtra : undefined}
      >
        {owner && <OwnerBadge member={owner} compact />}
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
        owner && 'event-block--family-owner',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        '--block-color': color,
        '--owner-accent': owner?.accentColor,
        zIndex: isRoutine ? 1 : 2,
      } as React.CSSProperties}
      title={owner ? tooltipExtra : undefined}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
    >
      {owner && <OwnerBadge member={owner} />}
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
