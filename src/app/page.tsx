'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { CurrentWeather } from '@/components/CurrentWeather'
import { WeatherForecast } from '@/components/WeatherForecast'
import { WeatherMap } from '@/components/WeatherMap'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Footer } from '@/components/Footer'
import { WeatherService } from '@/services/weatherService'
import { ForecastData, WeatherData } from '@/types/weather'
import { cityDate, formatClock, formatWeekday, Unit } from '@/lib/atmos'
import { sampleForecast, sampleWeather } from '@/lib/sampleWeather'
import toast from 'react-hot-toast'

const hasApiKey = Boolean(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY)

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<Unit>('C')
  const weatherService = new WeatherService()

  const fetchWeatherData = async (location: string) => {
    if (!hasApiKey) {
      setWeatherData({ ...sampleWeather, name: location.split(',')[0] || sampleWeather.name })
      setForecastData(sampleForecast)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [weather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location),
      ])

      setWeatherData(weather)
      setForecastData(forecast)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const location = await weatherService.getLocationFromCoords(latitude, longitude)
          await fetchWeatherData(location)
        } catch {
          toast.error('Failed to get location from coordinates')
          setLoading(false)
        }
      },
      () => {
        toast.error('Failed to get your location')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('atmos-unit')
    if (stored === 'C' || stored === 'F') setUnit(stored)
    fetchWeatherData('San Francisco')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUnitChange = (next: Unit) => {
    setUnit(next)
    window.localStorage.setItem('atmos-unit', next)
  }

  const localNow = weatherData ? cityDate(weatherData.timezone, weatherData.dt) : new Date()
  const timeLabel = `${formatWeekday(localNow)}  ·  ${formatClock(localNow)}`

  return (
    <div className="min-h-[100dvh] bg-paper">
      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 sm:py-10">
        <ErrorBoundary>
          {loading && !weatherData && <LoadingSpinner />}

          {error && !weatherData && (
            <div className="rounded-atmos border border-line bg-snow px-5 py-5 text-sm text-ink">
              {error}
            </div>
          )}

          {!hasApiKey && (
            <p className="mb-6 text-[12px] tracking-[0.04em] text-ink-muted">
              Sample briefing. Add NEXT_PUBLIC_OPENWEATHER_API_KEY for live conditions.
            </p>
          )}

          {weatherData && (
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Header timeLabel={timeLabel} />
                <CurrentWeather
                  data={weatherData}
                  unit={unit}
                  loading={loading}
                  onSearch={fetchWeatherData}
                  onGeolocation={handleGeolocation}
                />
                {forecastData && (
                  <div className="mt-10">
                    <WeatherForecast
                      current={weatherData}
                      data={forecastData}
                      unit={unit}
                      onUnitChange={handleUnitChange}
                    />
                  </div>
                )}
              </div>

              <WeatherMap
                weatherData={weatherData}
                forecastData={forecastData}
                unit={unit}
                loading={loading}
                onSearch={fetchWeatherData}
                onRefresh={() => fetchWeatherData(`${weatherData.name}, ${weatherData.sys.country}`)}
              />
            </div>
          )}
        </ErrorBoundary>
        <Footer />
      </main>
    </div>
  )
}
