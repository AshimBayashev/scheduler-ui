import { Outlet } from 'react-router-dom'
import { TelegramConnect } from '../common/TelegramConnect'
import { NavRail } from './NavRail'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="app-shell">
      <NavRail />
      <div className="app-shell-main">
        <TelegramConnect />
        <Outlet />
      </div>
    </div>
  )
}
