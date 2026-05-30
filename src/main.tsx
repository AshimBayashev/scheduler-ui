import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
import { EventsProvider } from './context/EventsContext'
import { RoutinesProvider } from './context/RoutinesContext'
import './styles/themes.css'
import './styles/ambientGlows.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FamilyProvider>
          <EventsProvider>
            <RoutinesProvider>
              <App />
            </RoutinesProvider>
          </EventsProvider>
        </FamilyProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
