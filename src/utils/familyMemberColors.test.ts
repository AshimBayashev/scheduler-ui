import { describe, expect, it } from 'vitest'
import { buildMemberColorMap, MEMBER_STRIPE_COLORS } from './familyMemberColors'

describe('buildMemberColorMap', () => {
  it('assigns stable colors sorted by userId', () => {
    const members = [
      { userId: 'b-user' },
      { userId: 'a-user' },
      { userId: 'c-user' },
    ]

    const map = buildMemberColorMap(members)

    expect(map['a-user']).toBe(MEMBER_STRIPE_COLORS[0])
    expect(map['b-user']).toBe(MEMBER_STRIPE_COLORS[1])
    expect(map['c-user']).toBe(MEMBER_STRIPE_COLORS[2])
  })

  it('reuses palette for large families', () => {
    const members = Array.from({ length: 10 }, (_, i) => ({
      userId: `user-${String(i).padStart(2, '0')}`,
    }))

    const map = buildMemberColorMap(members)

    expect(Object.keys(map)).toHaveLength(10)
    expect(map['user-08']).toBe(MEMBER_STRIPE_COLORS[8 % MEMBER_STRIPE_COLORS.length])
  })
})
