import { Outlet } from 'react-router-dom'
import { ReminderPermissionBanner } from '../common/ReminderPermissionBanner'
import { TelegramConnect } from '../common/TelegramConnect'
import { useForegroundReminders } from '../../hooks/useForegroundReminders'
import { NavRail } from './NavRail'
import './AppShell.css'

function ReminderGate() {
  useForegroundReminders()
  return (
    <>
      <TelegramConnect />
      <ReminderPermissionBanner />
    </>
  )
}

export function AppShell() {
  return (
    <div className="app-shell">
      <NavRail />
      <div className="app-shell-main">
        <ReminderGate />
        <Outlet />
      </div>
    </div>
  )
}
