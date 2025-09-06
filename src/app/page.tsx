'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { WeatherSearch } from '@/components/WeatherSearch'
import { CurrentWeather } from '@/components/CurrentWeather'
import { WeatherForecast } from '@/components/WeatherForecast'
import { WeatherMap } from '@/components/WeatherMap'
import { AirQuality } from '@/components/AirQuality'
import { WeatherAlerts } from '@/components/WeatherAlerts'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Footer } from '@/components/Footer'
import { WeatherService } from '@/services/weatherService'
import { WeatherData, ForecastData, AirQualityData, AlertData } from '@/types/weather'
import toast from 'react-hot-toast'

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null)
  const [alertsData, setAlertsData] = useState<AlertData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState('Nairobi')

  const weatherService = new WeatherService()

  const fetchWeatherData = async (location: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const [weather, forecast, airQuality, alerts] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location),
        weatherService.getAirQuality(location),
        weatherService.getWeatherAlerts(location)
      ])

      setWeatherData(weather)
      setForecastData(forecast)
      setAirQualityData(airQuality)
      setAlertsData(alerts)
      setCurrentLocation(location)
      
      toast.success(`Weather data loaded for ${location}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = (location: string) => {
    fetchWeatherData(location)
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
        } catch (err) {
          toast.error('Failed to get location from coordinates')
          setLoading(false)
        }
      },
      (error) => {
        toast.error('Failed to get your location')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    fetchWeatherData('Nairobi')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <div className="space-y-8">
            {/* Search Section */}
            <WeatherSearch 
              onSearch={handleLocationSearch}
              onGeolocation={handleGeolocation}
              loading={loading}
            />

            {loading && <LoadingSpinner />}

            {error && (
              <div className="weather-card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 text-red-500">⚠️</div>
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {weatherData && !loading && (
              <>
                {/* Current Weather */}
                <CurrentWeather 
                  data={weatherData} 
                  airQuality={airQualityData}
                />

                {/* Weather Alerts */}
                {/* <WeatherAlerts alerts={alertsData} /> */}

                {/* Forecast */}
                {forecastData && (
                  <WeatherForecast data={forecastData} />
                )}

                {/* Air Quality */}
                {airQualityData && (
                  <AirQuality data={airQualityData} />
                )}

                {/* Weather Map */}
                {/* <WeatherMap 
                  location={currentLocation}
                  weatherData={weatherData}
                /> */}
              </>
            )}
          </div>
        </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
  )
}

