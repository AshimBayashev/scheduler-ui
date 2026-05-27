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
  createRoutine,
  deleteRoutineApi,
  fetchRoutines,
  mapApiRoutine,
  updateRoutineApi,
} from '../api/routines'
import { useAuth } from './AuthContext'
import type { Routine, RoutineFormData } from '../types/routine'

interface RoutinesContextValue {
  routines: Routine[]
  loading: boolean
  addRoutine: (data: RoutineFormData) => Promise<Routine>
  updateRoutine: (id: string, data: RoutineFormData) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>
  refreshRoutines: () => Promise<void>
}

const RoutinesContext = createContext<RoutinesContextValue | null>(null)

export function RoutinesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(false)

  const refreshRoutines = useCallback(async () => {
    if (!user) {
      setRoutines([])
      return
    }

    setLoading(true)
    try {
      const data = await fetchRoutines()
      setRoutines(data.map(mapApiRoutine))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshRoutines()
  }, [refreshRoutines])

  const addRoutine = useCallback(async (data: RoutineFormData) => {
    const created = await createRoutine(data)
    const routine = mapApiRoutine(created)
    setRoutines((prev) =>
      [...prev, routine].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    )
    return routine
  }, [])

  const updateRoutine = useCallback(async (id: string, data: RoutineFormData) => {
    const updated = await updateRoutineApi(id, data)
    const routine = mapApiRoutine(updated)
    setRoutines((prev) =>
      prev
        .map((r) => (r.id === id ? routine : r))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    )
  }, [])

  const deleteRoutine = useCallback(async (id: string) => {
    await deleteRoutineApi(id)
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      routines,
      loading,
      addRoutine,
      updateRoutine,
      deleteRoutine,
      refreshRoutines,
    }),
    [routines, loading, addRoutine, updateRoutine, deleteRoutine, refreshRoutines],
  )

  return (
    <RoutinesContext.Provider value={value}>{children}</RoutinesContext.Provider>
  )
}

export function useRoutines() {
  const ctx = useContext(RoutinesContext)
  if (!ctx) throw new Error('useRoutines must be used within RoutinesProvider')
  return ctx
}
