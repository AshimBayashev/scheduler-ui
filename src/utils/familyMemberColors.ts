import type { FamilyMember } from '../api/family'

/** Насыщенные цвета, хорошо читаемые на фоне событий и рутин */
export const MEMBER_STRIPE_COLORS = [
  '#E63946',
  '#1D3557',
  '#2A9D8F',
  '#E76F51',
  '#7209B7',
  '#F4A261',
  '#006D77',
  '#BC4749',
] as const

export function buildMemberColorMap(
  members: Pick<FamilyMember, 'userId'>[],
): Record<string, string> {
  const sorted = [...members].sort((a, b) => a.userId.localeCompare(b.userId))
  const map: Record<string, string> = {}

  sorted.forEach((member, index) => {
    map[member.userId] =
      MEMBER_STRIPE_COLORS[index % MEMBER_STRIPE_COLORS.length]
  })

  return map
}
