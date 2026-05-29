import { Outlet } from 'react-router-dom'
import { FamilyInviteBanner } from '../common/FamilyInviteBanner'
import { TelegramBanner } from '../common/TelegramBanner'
import { NavRail } from './NavRail'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="app-shell">
      <NavRail />
      <div className="app-shell-main">
        <FamilyInviteBanner />
        <TelegramBanner />
        <Outlet />
      </div>
    </div>
  )
}
