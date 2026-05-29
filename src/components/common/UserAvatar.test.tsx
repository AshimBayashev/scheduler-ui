import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UserAvatar } from './UserAvatar'

describe('UserAvatar', () => {
  it('renders initials when no avatar url', () => {
    render(<UserAvatar name="Иван Петров" email="ivan@test.com" />)
    expect(screen.getByTitle('Иван Петров')).toHaveTextContent('ИП')
  })

  it('renders image when avatar url provided', () => {
    render(
      <UserAvatar
        name="Иван"
        email="ivan@test.com"
        avatarUrl="https://example.com/a.jpg"
      />,
    )
    expect(screen.getByRole('presentation', { hidden: true })).toBeTruthy()
    const img = document.querySelector('img.user-avatar')
    expect(img).toHaveAttribute('src', 'https://example.com/a.jpg')
  })
})
