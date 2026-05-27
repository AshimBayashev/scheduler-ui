import { useMemo } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import { useRoutines } from '../context/RoutinesContext'
import { ThemeSelect } from '../components/common/ThemeSelect'
import { useClock } from '../hooks/useClock'
import { useWeather } from '../hooks/useWeather'
import { getDisplayName, getGreeting, isLikelyFeminineName } from '../utils/greeting'
import { getTodayPlans } from '../utils/todayPlans'
import type { CalendarEvent } from '../types/event'
import './HomePage.css'

const ORBIT_RADIUS = 210
const MAX_ORBIT_ITEMS = 9
const ORBIT_START_DEG = -58
const ORBIT_END_DEG = 58

function orbitPosition(index: number, total: number) {
  const count = Math.min(total, MAX_ORBIT_ITEMS)
  const angleDeg =
    count <= 1
      ? 12
      : ORBIT_START_DEG + ((ORBIT_END_DEG - ORBIT_START_DEG) * index) / (count - 1)
  const rad = (angleDeg * Math.PI) / 180
  const x = Math.cos(rad) * ORBIT_RADIUS
  const y = Math.sin(rad) * ORBIT_RADIUS
  const centerX = 38
  return {
    left: `calc(${centerX}% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
  }
}

export function HomePage() {
  const { user } = useAuth()
  const { events, loading: eventsLoading } = useEvents()
  const { routines, loading: routinesLoading } = useRoutines()
  const now = useClock()
  const { temperature, loading: weatherLoading, error: weatherError } = useWeather()

  const displayName = user ? getDisplayName(user.name, user.email) : ''
  const feminine = isLikelyFeminineName(displayName)
  const greeting = getGreeting(now.getHours(), feminine)

  const todayPlans = useMemo(
    () => getTodayPlans(events, routines),
    [events, routines],
  )

  const visiblePlans = todayPlans.slice(0, MAX_ORBIT_ITEMS)
  const hiddenCount = Math.max(0, todayPlans.length - MAX_ORBIT_ITEMS)
  const loading = eventsLoading || routinesLoading

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-greeting">
          <p className="home-greeting-line">{greeting},</p>
          <h1 className="home-greeting-name">{displayName}</h1>
        </div>
        <ThemeSelect />
      </header>

      <section className="home-hero" aria-label="Сегодня">
        <div className="home-hero-scene">
          <svg
            className="home-orbit-ring"
            viewBox="0 0 500 500"
            aria-hidden="true"
          >
            <circle cx="200" cy="250" r={ORBIT_RADIUS} className="home-orbit-ring-stroke" />
          </svg>

          <div className="home-hero-core">
            <div className="home-clock-circle">
              <time className="home-clock-time" dateTime={now.toISOString()}>
                {format(now, 'HH:mm')}
              </time>
              <time className="home-clock-date" dateTime={format(now, 'yyyy-MM-dd')}>
                {format(now, 'd MMMM yyyy', { locale: ru })}
              </time>
              <p className="home-clock-weather">
                {weatherLoading && 'Загрузка погоды…'}
                {!weatherLoading && temperature !== null && `${temperature}°C`}
                {!weatherLoading && temperature === null && (weatherError ?? '—')}
              </p>
            </div>
          </div>

          <div className="home-orbit-layer">
            {loading && visiblePlans.length === 0 && (
              <p className="home-orbit-empty home-orbit-empty--loading">Загрузка планов…</p>
            )}
            {!loading && todayPlans.length === 0 && (
              <p className="home-orbit-empty">
                Сегодня свободно —{' '}
                <Link to="/calendar">добавить дело</Link>
              </p>
            )}
            {visiblePlans.map((plan, index) => (
              <HomePlanChip
                key={plan.id}
                plan={plan}
                style={orbitPosition(index, visiblePlans.length)}
              />
            ))}
            {hiddenCount > 0 && (
              <Link
                to="/calendar"
                className="home-orbit-more"
                style={orbitPosition(visiblePlans.length, visiblePlans.length + 1)}
              >
                +{hiddenCount} ещё
              </Link>
            )}
          </div>
        </div>

        <p className="home-hero-caption">
          Планы на сегодня · {todayPlans.length}{' '}
          {todayPlans.length === 1 ? 'запись' : todayPlans.length < 5 ? 'записи' : 'записей'}
        </p>
      </section>
    </div>
  )
}

function HomePlanChip({
  plan,
  style,
}: {
  plan: CalendarEvent
  style: React.CSSProperties
}) {
  const color = plan.color ?? 'var(--accent-primary)'

  return (
    <Link
      to="/calendar"
      className={['home-plan-chip', plan.isRoutine && 'home-plan-chip--routine']
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, '--plan-color': color } as React.CSSProperties}
      title={plan.title}
    >
      <span className="home-plan-chip-time">
        {plan.allDay ? 'весь день' : format(plan.start, 'HH:mm')}
      </span>
      <span className="home-plan-chip-title">{plan.title}</span>
    </Link>
  )
}
