'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { CurrentWeather } from '@/components/CurrentWeather'
import { WeatherForecastDaily, WeatherForecastHourly } from '@/components/WeatherForecast'
import { WeatherMap } from '@/components/WeatherMap'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Footer } from '@/components/Footer'
import { AirQuality } from '@/components/AirQuality'
import { WeatherAlerts } from '@/components/WeatherAlerts'
import { WeatherService } from '@/services/weatherService'
import { AirQualityData, AlertData, ForecastData, UVIndexData, WeatherData } from '@/types/weather'
import { cityDate, formatClock, formatWeekday, Unit } from '@/lib/atmos'
import { sampleAirQuality, sampleForecast, sampleUV, sampleWeather } from '@/lib/sampleWeather'
import toast from 'react-hot-toast'

const hasApiKey = Boolean(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY)

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null)
  const [alertsData, setAlertsData] = useState<AlertData[]>([])
  const [uvIndex, setUvIndex] = useState<UVIndexData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<Unit>('C')
  const weatherService = new WeatherService()

  const fetchWeatherData = async (location: string) => {
    if (!hasApiKey) {
      setWeatherData({ ...sampleWeather, name: location.split(',')[0] || sampleWeather.name })
      setForecastData(sampleForecast)
      setAirQualityData(sampleAirQuality)
      setAlertsData([])
      setUvIndex(sampleUV)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [weather, forecast, airQuality, alerts, uv] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location),
        weatherService.getAirQuality(location),
        weatherService.getWeatherAlerts(location),
        weatherService.getUVIndex(location),
      ])

      setWeatherData(weather)
      setForecastData(forecast)
      setAirQualityData(airQuality)
      setAlertsData(alerts)
      setUvIndex(uv)
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
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-10">
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
            <>
              <Header timeLabel={timeLabel} />

              <div className="bento-grid">
                <div className="bento-cell max-lg:order-1 lg:col-span-12">
                  <WeatherAlerts alerts={alertsData} locationName={weatherData.name} />
                </div>

                <div className="bento-cell max-lg:contents lg:col-span-5 lg:flex lg:flex-col lg:gap-6 lg:min-h-0">
                  <div
                    className={`min-h-0 max-lg:order-2 md:max-lg:order-2 lg:min-h-0 ${
                      airQualityData ? 'md:col-span-1' : 'md:col-span-2'
                    }`}
                  >
                    <CurrentWeather
                      data={weatherData}
                      forecast={forecastData}
                      unit={unit}
                      loading={loading}
                      airQuality={airQualityData}
                      uvIndex={uvIndex}
                      onSearch={fetchWeatherData}
                      onGeolocation={handleGeolocation}
                    />
                  </div>

                  {airQualityData && (
                    <div className="min-h-0 max-lg:order-6 md:max-lg:order-3 md:col-span-1 lg:min-h-0">
                      <AirQuality data={airQualityData} />
                    </div>
                  )}
                </div>

                <div className="bento-cell bento-panel flex h-full min-h-0 flex-col max-lg:order-3 md:max-lg:order-4 md:col-span-2 lg:col-span-7">
                  <WeatherMap
                    weatherData={weatherData}
                    forecastData={forecastData}
                    loading={loading}
                    onSearch={fetchWeatherData}
                    onRefresh={() =>
                      fetchWeatherData(`${weatherData.name}, ${weatherData.sys.country}`)
                    }
                  />
                </div>

                {forecastData && (
                  <>
                    <div className="bento-cell bento-panel max-lg:order-4 md:max-lg:order-5 md:col-span-2 lg:col-span-12">
                      <WeatherForecastHourly
                        current={weatherData}
                        data={forecastData}
                        unit={unit}
                        onUnitChange={handleUnitChange}
                      />
                    </div>

                    <div className="bento-cell bento-panel max-lg:order-5 md:max-lg:order-6 md:col-span-2 lg:col-span-12">
                      <WeatherForecastDaily
                        current={weatherData}
                        data={forecastData}
                        unit={unit}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </ErrorBoundary>
        <Footer />
      </main>
    </div>
  )
}
