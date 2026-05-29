import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchFamilyOverview,
  type FamilyOverview,
} from '../api/family'
import { useAuth } from './AuthContext'

interface FamilyContextValue {
  overview: FamilyOverview | null
  loading: boolean
  error: string | null
  refreshFamily: () => Promise<void>
}

const emptyOverview: FamilyOverview = {
  inFamily: false,
  family: null,
  role: null,
  members: [],
  sentInvitations: [],
  incomingInvitations: [],
}

const FamilyContext = createContext<FamilyContextValue | null>(null)

export function FamilyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [overview, setOverview] = useState<FamilyOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshFamily = useCallback(async () => {
    if (!user) {
      setOverview(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchFamilyOverview()
      setOverview(data)
    } catch (err) {
      setOverview(emptyOverview)
      setError(err instanceof Error ? err.message : 'Не удалось загрузить семью')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshFamily()
  }, [refreshFamily])

  const value = useMemo(
    () => ({
      overview,
      loading,
      error,
      refreshFamily,
    }),
    [overview, loading, error, refreshFamily],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider')
  return ctx
}
