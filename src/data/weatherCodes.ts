export type WeatherKind =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'

export function weatherCodeToKind(code: number | null | undefined): WeatherKind {
  if (code === null || code === undefined) return 'partly-cloudy'

  if (code === 0) return 'clear'
  if (code === 1 || code === 2) return 'partly-cloudy'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 55) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow'
  if (code >= 95) return 'thunderstorm'

  return 'partly-cloudy'
}

export const WEATHER_LABELS: Record<WeatherKind, string> = {
  clear: 'Ясно',
  'partly-cloudy': 'Переменная облачность',
  cloudy: 'Облачно',
  fog: 'Туман',
  drizzle: 'Морось',
  rain: 'Дождь',
  snow: 'Снег',
  thunderstorm: 'Гроза',
}
