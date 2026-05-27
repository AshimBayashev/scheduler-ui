import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { EventsProvider } from './context/EventsContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <App />
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
