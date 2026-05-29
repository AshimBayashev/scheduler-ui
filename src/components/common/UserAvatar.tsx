import { getDisplayName } from '../../utils/greeting'
import './UserAvatar.css'

interface UserAvatarProps {
  name?: string | null
  email: string
  avatarUrl?: string | null
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

function initials(name: string, email: string) {
  const trimmed = name.trim()
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return trimmed.slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function UserAvatar({
  name,
  email,
  avatarUrl,
  size = 'md',
  className,
}: UserAvatarProps) {
  const label = getDisplayName(name ?? null, email)
  const classes = ['user-avatar', `user-avatar--${size}`, className]
    .filter(Boolean)
    .join(' ')

  if (avatarUrl) {
    return (
      <img
        className={classes}
        src={avatarUrl}
        alt=""
        aria-hidden="true"
        title={label}
      />
    )
  }

  return (
    <span className={classes} aria-hidden="true" title={label}>
      {initials(name ?? '', email)}
    </span>
  )
}
