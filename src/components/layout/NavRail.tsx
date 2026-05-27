import { NavLink } from 'react-router-dom'
import './NavRail.css'

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function NavRail() {
  return (
    <nav className="nav-rail" aria-label="Основная навигация">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          ['nav-rail-link', isActive && 'nav-rail-link--active'].filter(Boolean).join(' ')
        }
        title="Главная"
        aria-label="Главная"
      >
        <HomeIcon />
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          ['nav-rail-link', isActive && 'nav-rail-link--active'].filter(Boolean).join(' ')
        }
        title="Календарь"
        aria-label="Календарь"
      >
        <CalendarIcon />
      </NavLink>
    </nav>
  )
}
