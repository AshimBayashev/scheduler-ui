import { useTheme } from '../../context/ThemeContext'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
      aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
    >
      {theme === 'light' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM4.22 5.64a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41zm14.14 12.02a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41zM3 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1zM5.64 19.78a1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41 0zm12.02-14.14a1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41 0zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 14.5A7.5 7.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}
