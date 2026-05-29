import type { FamilyMember } from '../api/family'
import { getMemberDisplayName } from '../api/family'

/** Цвета рамки/аватара — не путать с цветом самого дела */
export const FAMILY_MEMBER_ACCENT_COLORS = [
  '#0078D4',
  '#107C10',
  '#C239B3',
  '#D83B01',
  '#038387',
  '#8764B8',
  '#FF8C00',
  '#00B7C3',
] as const

export interface FamilyMemberVisual {
  userId: string
  accentColor: string
  name: string
  email: string
  avatarUrl: string | null
}

export function buildFamilyMemberVisuals(
  members: FamilyMember[],
): Map<string, FamilyMemberVisual> {
  const sorted = [...members].sort((a, b) => a.userId.localeCompare(b.userId))
  const map = new Map<string, FamilyMemberVisual>()

  sorted.forEach((member, index) => {
    map.set(member.userId, {
      userId: member.userId,
      accentColor:
        FAMILY_MEMBER_ACCENT_COLORS[index % FAMILY_MEMBER_ACCENT_COLORS.length],
      name: getMemberDisplayName(member),
      email: member.email,
      avatarUrl: member.avatarUrl,
    })
  })

  return map
}

export function getFamilyMemberVisual(
  visuals: Map<string, FamilyMemberVisual> | undefined,
  ownerUserId: string | undefined,
): FamilyMemberVisual | undefined {
  if (!visuals || !ownerUserId) return undefined
  return visuals.get(ownerUserId)
}
