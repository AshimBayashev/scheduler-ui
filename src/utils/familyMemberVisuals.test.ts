import { describe, expect, it } from 'vitest'
import { buildFamilyMemberVisuals } from './familyMemberVisuals'

describe('buildFamilyMemberVisuals', () => {
  it('assigns stable accent colors by user id', () => {
    const members = [
      {
        userId: 'b-user',
        email: 'b@test.com',
        name: 'Б',
        avatarUrl: null,
        role: 'member' as const,
      },
      {
        userId: 'a-user',
        email: 'a@test.com',
        name: 'А',
        avatarUrl: null,
        role: 'owner' as const,
      },
    ]

    const map = buildFamilyMemberVisuals(members)
    expect(map.get('a-user')?.accentColor).toBeTruthy()
    expect(map.get('b-user')?.accentColor).toBeTruthy()
    expect(map.get('a-user')?.name).toBe('А')
  })
})
