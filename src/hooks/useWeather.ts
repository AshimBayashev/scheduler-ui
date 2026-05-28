import { useEffect, useState } from 'react'

interface WeatherState {
  temperature: number | null
  weatherCode: number | null
  loading: boolean
  error: string | null
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    temperature: null,
    weatherCode: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    const load = async (latitude: number, longitude: number) => {
      try {
        const url = new URL('https://api.open-meteo.com/v1/forecast')
        url.searchParams.set('latitude', String(latitude))
        url.searchParams.set('longitude', String(longitude))
        url.searchParams.set('current', 'temperature_2m,weather_code')
        url.searchParams.set('timezone', 'auto')

        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Не удалось получить погоду')
        const data = await res.json()
        const temp = data?.current?.temperature_2m
        const code = data?.current?.weather_code
        if (typeof temp !== 'number') throw new Error('Нет данных о температуре')

        if (!cancelled) {
          setState({
            temperature: Math.round(temp),
            weatherCode: typeof code === 'number' ? code : null,
            loading: false,
            error: null,
          })
        }
      } catch {
        if (!cancelled) {
          setState({
            temperature: null,
            weatherCode: null,
            loading: false,
            error: 'Погода недоступна',
          })
        }
      }
    }

    if (!navigator.geolocation) {
      setState({ temperature: null, weatherCode: null, loading: false, error: 'Геолокация недоступна' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => load(pos.coords.latitude, pos.coords.longitude),
      () => {
        if (!cancelled) {
          setState({ temperature: null, weatherCode: null, loading: false, error: 'Нет доступа к геолокации' })
        }
      },
      { timeout: 12000, maximumAge: 600_000 },
    )

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
