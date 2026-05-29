import { getMemberDisplayName } from '../../api/family'
import type { FamilyMember } from '../../api/family'
import type { FamilyMemberVisual } from '../../utils/familyMemberColors'
import './FamilyMemberLegend.css'

interface FamilyMemberLegendProps {
  members: FamilyMember[]
  memberVisuals: Record<string, FamilyMemberVisual>
}

export function FamilyMemberLegend({ members, memberVisuals }: FamilyMemberLegendProps) {
  const sorted = [...members].sort((a, b) => a.userId.localeCompare(b.userId))

  return (
    <div className="family-member-legend" aria-label="Участники семьи">
      {sorted.map((member) => {
        const visual = memberVisuals[member.userId]
        if (!visual) return null

        return (
          <span key={member.userId} className="family-member-legend-item">
            <span
              className="family-member-legend-stripe"
              style={{ backgroundColor: visual.color }}
              aria-hidden
            />
            {getMemberDisplayName(member)}
          </span>
        )
      })}
    </div>
  )
}
