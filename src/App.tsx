import { useAuth } from './context/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import { AuthPage } from './pages/AuthPage'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="auth-loading">Загрузка...</div>
  }

  if (!user) {
    return <AuthPage />
  }

  return <AppLayout />
}

export default App
