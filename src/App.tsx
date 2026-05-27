import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppShell } from './components/layout/AppShell'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { CalendarPage } from './pages/CalendarPage'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="auth-loading">Загрузка...</div>
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
