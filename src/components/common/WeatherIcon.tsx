import type { ReactElement } from 'react'
import { weatherCodeToKind, WEATHER_LABELS, type WeatherKind } from '../../data/weatherCodes'

interface WeatherIconProps {
  code?: number | null
  kind?: WeatherKind
  className?: string
}

function IconClear() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.8 5.8 7.6 7.6M16.4 16.4l1.8 1.8M18.2 5.8l-1.8 1.8M7.6 16.4 5.8 18.2"
      />
    </svg>
  )
}

function IconPartlyCloudy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="3.25" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M8 3.5v1.5M4.2 5.8l1 1.7M12.2 5.8l-1 1.7"
      />
      <path
        fill="currentColor"
        d="M7 17.5h9.5a3.5 3.5 0 0 0 .4-7 4.2 4.2 0 0 0-8.1-1.1A3.4 3.4 0 0 0 7 17.5Z"
        opacity="0.9"
      />
    </svg>
  )
}

function IconCloudy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 18h10a3.5 3.5 0 0 0 .35-7A4.5 4.5 0 0 0 7.2 8.5 4 4 0 0 0 6.5 18Z"
      />
      <path
        fill="currentColor"
        d="M4 14.5h11.5a3 3 0 0 0 .25-6 3.8 3.8 0 0 0-7.2-1.2A2.8 2.8 0 0 0 4 14.5Z"
        opacity="0.55"
      />
    </svg>
  )
}

function IconFog() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="M4 8h16M3 12h18M5 16h14" />
    </svg>
  )
}

function IconDrizzle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 14.5h10a3.5 3.5 0 0 0 .35-7A4.2 4.2 0 0 0 8.2 5.8 3.4 3.4 0 0 0 7 14.5Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M9 18.5v2M12 17.5v2M15 18.5v2"
      />
    </svg>
  )
}

function IconRain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 13.5h10a3.5 3.5 0 0 0 .35-7A4.2 4.2 0 0 0 8.2 4.8 3.4 3.4 0 0 0 7 13.5Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M8.5 17.5v3M12 16.5v3M15.5 17.5v3"
      />
    </svg>
  )
}

function IconSnow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 13h10a3.5 3.5 0 0 0 .35-7A4.2 4.2 0 0 0 8.2 4.5 3.4 3.4 0 0 0 7 13Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M8.5 17.5 9 18.5M12 16.5l.5 1M15.5 17.5l.5 1M8.5 20.5 9 19.5M12 21.5l.5-1M15.5 20.5l.5-1"
      />
    </svg>
  )
}

function IconThunderstorm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 12.5h10a3.5 3.5 0 0 0 .35-7A4.2 4.2 0 0 0 8.2 4.2 3.4 3.4 0 0 0 7 12.5Z"
      />
      <path fill="currentColor" d="M13.5 14.5 11 19h2.5l-1.5 3.5 4.5-5.5h-2.5l1.5-2.5Z" />
    </svg>
  )
}

const ICONS: Record<WeatherKind, () => ReactElement> = {
  clear: IconClear,
  'partly-cloudy': IconPartlyCloudy,
  cloudy: IconCloudy,
  fog: IconFog,
  drizzle: IconDrizzle,
  rain: IconRain,
  snow: IconSnow,
  thunderstorm: IconThunderstorm,
}

export function WeatherIcon({ code, kind, className }: WeatherIconProps) {
  const resolved = kind ?? weatherCodeToKind(code)
  const Icon = ICONS[resolved]

  return (
    <span className={className} title={WEATHER_LABELS[resolved]} aria-hidden="true">
      <Icon />
    </span>
  )
}
