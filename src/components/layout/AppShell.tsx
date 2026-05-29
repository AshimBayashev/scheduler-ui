import { Outlet } from 'react-router-dom'
import { TelegramBanner } from '../common/TelegramBanner'
import { NavRail } from './NavRail'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="app-shell">
      <NavRail />
      <div className="app-shell-main">
        <TelegramBanner />
        <Outlet />
      </div>
    </div>
  )
}
