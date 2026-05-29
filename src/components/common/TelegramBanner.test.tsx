import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TelegramBanner } from './TelegramBanner'

vi.mock('../../hooks/useTelegramStatus', () => ({
  useTelegramStatus: vi.fn(),
}))

import { useTelegramStatus } from '../../hooks/useTelegramStatus'

const mockedHook = vi.mocked(useTelegramStatus)

describe('TelegramBanner', () => {
  it('renders nothing when telegram linked', () => {
    mockedHook.mockReturnValue({
      status: { enabled: true, linked: true, botUsername: 'bot' },
      failed: false,
      refresh: vi.fn(),
    })

    const { container } = render(<TelegramBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders connect banner when not linked', () => {
    mockedHook.mockReturnValue({
      status: { enabled: true, linked: false, botUsername: 'bot' },
      failed: false,
      refresh: vi.fn(),
    })

    render(<TelegramBanner />)
    expect(screen.getByRole('button', { name: 'Подключить' })).toBeInTheDocument()
  })

  it('renders nothing when bot disabled', () => {
    mockedHook.mockReturnValue({
      status: { enabled: false, linked: false, botUsername: null },
      failed: false,
      refresh: vi.fn(),
    })

    const { container } = render(<TelegramBanner />)
    expect(container).toBeEmptyDOMElement()
  })
})
