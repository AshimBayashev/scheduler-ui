import { useMemo, useState } from 'react'
import { format, endOfDay, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { getMemberDisplayName } from '../api/family'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import { useFamily } from '../context/FamilyContext'
import { useRoutines } from '../context/RoutinesContext'
import { FamilyMemberSwitcher } from '../components/common/FamilyMemberSwitcher'
import { ThemeSelect } from '../components/common/ThemeSelect'
import { UserAvatar } from '../components/common/UserAvatar'
import { WeatherIcon } from '../components/common/WeatherIcon'
import { useClock } from '../hooks/useClock'
import { useMemberCalendarData } from '../hooks/useMemberCalendarData'
import { MOBILE_BREAKPOINT, useMediaQuery } from '../hooks/useMediaQuery'
import { useWeather } from '../hooks/useWeather'
import { WEATHER_LABELS, weatherCodeToKind } from '../data/weatherCodes'
import { getDisplayName, getGreeting, isLikelyFeminineName } from '../utils/greeting'
import { getTodayPlans } from '../utils/todayPlans'
import type { CalendarEvent, CalendarMemberScope } from '../types/event'
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
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)
  const { user } = useAuth()
  const { overview } = useFamily()
  const { events, loading: eventsLoading } = useEvents()
  const { routines, loading: routinesLoading } = useRoutines()
  const [memberScope, setMemberScope] = useState<CalendarMemberScope>('self')
  const now = useClock()
  const { temperature, weatherCode, loading: weatherLoading, error: weatherError } = useWeather()

  const todayRange = useMemo(
    () => ({
      from: startOfDay(now),
      to: endOfDay(now),
    }),
    [now.getFullYear(), now.getMonth(), now.getDate()],
  )

  const memberData = useMemberCalendarData({
    scope: memberScope,
    from: todayRange.from,
    to: todayRange.to,
    enabled: memberScope !== 'self',
  })

  const activeEvents = memberScope === 'self' ? events : memberData.events
  const activeRoutines = memberScope === 'self' ? routines : memberData.routines

  const displayName = user ? getDisplayName(user.name, user.email) : ''
  const feminine = isLikelyFeminineName(displayName)
  const greeting = getGreeting(now.getHours(), feminine)

  const viewedMember =
    memberScope !== 'self'
      ? overview?.members.find((m) => m.userId === memberScope)
      : null

  const plansOwnerLabel =
    memberScope === 'self'
      ? 'Планы на сегодня'
      : viewedMember
        ? `Планы ${getMemberDisplayName(viewedMember)}`
        : 'Планы на сегодня'

  const todayPlans = useMemo(
    () => getTodayPlans(activeEvents, activeRoutines),
    [activeEvents, activeRoutines],
  )

  const visiblePlans = todayPlans.slice(0, MAX_ORBIT_ITEMS)
  const hiddenCount = Math.max(0, todayPlans.length - MAX_ORBIT_ITEMS)
  const loading =
    memberScope === 'self'
      ? eventsLoading || routinesLoading
      : memberData.loading

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-greeting">
          <p className="home-greeting-line">{greeting},</p>
          <div className="home-greeting-name-row">
            {user && (
              <UserAvatar
                name={user.name}
                email={user.email}
                avatarUrl={user.avatarUrl}
                size="sm"
                className="home-greeting-avatar"
              />
            )}
            <h1 className="home-greeting-name">{displayName}</h1>
          </div>
        </div>
        <ThemeSelect />
      </header>

      {overview?.inFamily && (
        <FamilyMemberSwitcher
          value={memberScope}
          onChange={setMemberScope}
          className="home-family-switcher"
        />
      )}

      <section className="home-hero" aria-label="Сегодня">
        <div className={`home-hero-scene${isMobile ? ' home-hero-scene--mobile' : ''}`}>
          {!isMobile && (
            <svg
              className="home-orbit-ring"
              viewBox="0 0 500 500"
              aria-hidden="true"
            >
              <g className="home-orbit-ring-spin">
                <circle cx="200" cy="250" r={ORBIT_RADIUS} className="home-orbit-ring-stroke" />
              </g>
            </svg>
          )}

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
                {!weatherLoading && temperature !== null && (
                  <>
                    <WeatherIcon
                      code={weatherCode}
                      className="home-clock-weather-icon"
                    />
                    <span>{temperature}°C</span>
                    <span className="visually-hidden">
                      {WEATHER_LABELS[weatherCodeToKind(weatherCode)]}
                    </span>
                  </>
                )}
                {!weatherLoading && temperature === null && (weatherError ?? '—')}
              </p>
            </div>
          </div>

          {isMobile ? (
            <HomePlansList
              loading={loading}
              plans={visiblePlans}
              totalCount={todayPlans.length}
              hiddenCount={hiddenCount}
              title={plansOwnerLabel}
            />
          ) : (
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
          )}
        </div>

        {!isMobile && (
          <p className="home-hero-caption">
            {plansOwnerLabel} · {todayPlans.length}{' '}
            {todayPlans.length === 1 ? 'запись' : todayPlans.length < 5 ? 'записи' : 'записей'}
          </p>
        )}
      </section>
    </div>
  )
}

function HomePlansList({
  loading,
  plans,
  totalCount,
  hiddenCount,
  title,
}: {
  loading: boolean
  plans: CalendarEvent[]
  totalCount: number
  hiddenCount: number
  title: string
}) {
  return (
    <div className="home-plans-list">
      <h2 className="home-plans-list-title">
        {title}
        {totalCount > 0 && <span className="home-plans-list-count">{totalCount}</span>}
      </h2>

      {loading && plans.length === 0 && (
        <p className="home-plans-list-empty">Загрузка планов…</p>
      )}
      {!loading && totalCount === 0 && (
        <p className="home-plans-list-empty">
          Сегодня свободно — <Link to="/calendar">добавить дело</Link>
        </p>
      )}

      <ul className="home-plans-list-items">
        {plans.map((plan) => (
          <li key={plan.id}>
            <HomePlanChip plan={plan} layout="list" />
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && (
        <Link to="/calendar" className="home-plans-list-more">
          Ещё {hiddenCount} в календаре
        </Link>
      )}
    </div>
  )
}

function HomePlanChip({
  plan,
  style,
  layout = 'orbit',
}: {
  plan: CalendarEvent
  style?: React.CSSProperties
  layout?: 'orbit' | 'list'
}) {
  const color = plan.color ?? 'var(--accent-primary)'

  return (
    <Link
      to="/calendar"
      className={[
        'home-plan-chip',
        layout === 'list' && 'home-plan-chip--list',
        plan.isRoutine && 'home-plan-chip--routine',
      ]
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
