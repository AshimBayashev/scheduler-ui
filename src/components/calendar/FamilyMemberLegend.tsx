import { getMemberDisplayName } from '../../api/family'
import type { FamilyMember } from '../../api/family'
import './FamilyMemberLegend.css'

interface FamilyMemberLegendProps {
  members: FamilyMember[]
  memberColors: Record<string, string>
}

export function FamilyMemberLegend({ members, memberColors }: FamilyMemberLegendProps) {
  const sorted = [...members].sort((a, b) => a.userId.localeCompare(b.userId))

  return (
    <div className="family-member-legend" aria-label="Участники семьи">
      {sorted.map((member) => {
        const color = memberColors[member.userId]
        if (!color) return null

        return (
          <span key={member.userId} className="family-member-legend-item">
            <span
              className="family-member-legend-stripe"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {getMemberDisplayName(member)}
          </span>
        )
      })}
    </div>
  )
}
