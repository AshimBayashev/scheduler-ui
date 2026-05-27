import { Outlet } from 'react-router-dom'
import { NavRail } from './NavRail'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="app-shell">
      <NavRail />
      <div className="app-shell-main">
        <Outlet />
      </div>
    </div>
  )
}
