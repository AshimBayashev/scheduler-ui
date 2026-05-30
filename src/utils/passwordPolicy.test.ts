import { describe, expect, it } from 'vitest'
import { validatePassword } from './passwordPolicy'

describe('validatePassword', () => {
  it('accepts strong passwords', () => {
    expect(validatePassword('secret12')).toBeNull()
    expect(validatePassword('Пароль12')).toBeNull()
  })

  it('rejects weak passwords', () => {
    expect(validatePassword('short1')).not.toBeNull()
    expect(validatePassword('12345678')).not.toBeNull()
    expect(validatePassword('abcdefgh')).not.toBeNull()
  })
})
