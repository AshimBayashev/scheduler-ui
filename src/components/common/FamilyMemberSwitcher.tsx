import { useAuth } from '../../context/AuthContext'
import { useFamily } from '../../context/FamilyContext'
import { getMemberDisplayName } from '../../api/family'
import type { CalendarMemberScope } from '../../types/event'
import './FamilyMemberSwitcher.css'

interface FamilyMemberSwitcherProps {
  value: CalendarMemberScope
  onChange: (scope: CalendarMemberScope) => void
  showCombined?: boolean
  className?: string
}

export function FamilyMemberSwitcher({
  value,
  onChange,
  showCombined = false,
  className,
}: FamilyMemberSwitcherProps) {
  const { user } = useAuth()
  const { overview } = useFamily()

  if (!overview?.inFamily || overview.members.length <= 1) {
    return null
  }

  const selfLabel = user?.name?.trim() || 'Я'

  return (
    <div
      className={['family-member-switcher', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label="Чей календарь показывать"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 'self'}
        className={[
          'family-member-switcher-btn',
          value === 'self' && 'family-member-switcher-btn--active',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onChange('self')}
      >
        {selfLabel}
      </button>

      {overview.members
        .filter((member) => member.userId !== user?.id)
        .map((member) => (
          <button
            key={member.userId}
            type="button"
            role="tab"
            aria-selected={value === member.userId}
            className={[
              'family-member-switcher-btn',
              value === member.userId && 'family-member-switcher-btn--active',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange(member.userId)}
          >
            {getMemberDisplayName(member)}
          </button>
        ))}

      {showCombined && (
        <button
          type="button"
          role="tab"
          aria-selected={value === 'family'}
          className={[
            'family-member-switcher-btn',
            'family-member-switcher-btn--combined',
            value === 'family' && 'family-member-switcher-btn--active',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange('family')}
        >
          Вся семья
        </button>
      )}
    </div>
  )
}
