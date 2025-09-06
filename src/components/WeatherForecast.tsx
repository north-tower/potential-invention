'use client'

import { ForecastData } from '@/types/weather'
import { WeatherService } from '@/services/weatherService'
import { format, isToday, isTomorrow } from 'date-fns'
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Wind
} from 'lucide-react'

interface WeatherForecastProps {
  data: ForecastData
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const weatherService = new WeatherService()

  // Group forecast by day
  const groupedForecast = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000)
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(item)
    
    return acc
  }, {} as Record<string, typeof data.list>)

  // Get daily forecasts (one per day)
  const dailyForecasts = Object.entries(groupedForecast).map(([dateKey, items]) => {
    const date = new Date(dateKey)
    const dayItems = items.filter(item => {
      const itemDate = new Date(item.dt * 1000)
      return itemDate.getHours() >= 6 && itemDate.getHours() <= 18
    })
    
    const representativeItem = dayItems[Math.floor(dayItems.length / 2)] || items[0]
    
    return {
      date,
      dateKey,
      item: representativeItem,
      minTemp: Math.min(...items.map(i => i.main.temp_min)),
      maxTemp: Math.max(...items.map(i => i.main.temp_max)),
      hourlyData: items.slice(0, 8) // First 8 hours of the day
    }
  }).slice(0, 5) // Next 5 days

  const getWeatherIcon = (main: string, size: string = 'h-6 w-6') => {
    const iconClass = `${size} drop-shadow-sm transition-transform duration-300 hover:scale-110`
    
    switch (main) {
      case 'Clear':
        return <Sun className={`${iconClass} text-yellow-500`} />
      case 'Clouds':
        return <Cloud className={`${iconClass} text-gray-500 dark:text-gray-400`} />
      case 'Rain':
      case 'Drizzle':
        return <CloudRain className={`${iconClass} text-blue-500`} />
      case 'Snow':
        return <Snowflake className={`${iconClass} text-blue-300`} />
      default:
        return <Cloud className={`${iconClass} text-gray-500 dark:text-gray-400`} />
    }
  }

  const getDayLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'EEEE')
  }

  const getTemperatureRange = () => {
    const allTemps = dailyForecasts.flatMap(f => [f.minTemp, f.maxTemp])
    return {
      min: Math.min(...allTemps),
      max: Math.max(...allTemps)
    }
  }

  const tempRange = getTemperatureRange()

  const getTemperatureBarWidth = (temp: number) => {
    const range = tempRange.max - tempRange.min
    return ((temp - tempRange.min) / range) * 100
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="group relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-2xl dark:bg-gray-900/60 dark:ring-gray-800/50 sm:p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-950/10 dark:to-indigo-950/10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:via-gray-100 dark:to-white sm:text-3xl">
                5-Day Forecast
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Extended weather outlook
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-gray-100/80 px-3 py-1.5 dark:bg-gray-800/80">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Detailed View
            </span>
          </div>
        </div>

        {/* Daily Forecast Cards */}
        <div className="space-y-4 mb-8">
          {dailyForecasts.map((forecast, index) => (
            <div 
              key={forecast.dateKey} 
              className="group/card transform rounded-xl bg-white/40 p-4 backdrop-blur-sm ring-1 ring-gray-200/30 transition-all duration-300 hover:bg-white/60 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800/40 dark:ring-gray-700/30 dark:hover:bg-gray-800/60 sm:p-6"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Day Header */}
              <div className="mb-4 flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    index === 0 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'
                  }`}>
                    {getDayLabel(forecast.date)}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {format(forecast.date, 'MMM d')}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Weather Condition */}
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(forecast.item.weather[0].main, 'h-5 w-5 sm:h-6 sm:w-6')}
                    <span className="hidden text-sm font-medium text-gray-600 dark:text-gray-300 capitalize sm:inline">
                      {forecast.item.weather[0].description}
                    </span>
                  </div>
                  
                  {/* Temperature Display */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {Math.round(forecast.maxTemp)}°
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="h-3.5 w-3.5 text-blue-500" />
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {Math.round(forecast.minTemp)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temperature Range Visualization */}
              <div className="mb-4 hidden sm:block">
                <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-blue-400 to-red-400 transition-all duration-700"
                    style={{
                      left: `${getTemperatureBarWidth(forecast.minTemp)}%`,
                      width: `${getTemperatureBarWidth(forecast.maxTemp) - getTemperatureBarWidth(forecast.minTemp)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="overflow-x-auto">
                <div className="flex space-x-3 pb-2 sm:grid sm:grid-cols-4 sm:gap-3 sm:space-x-0 sm:pb-0 lg:grid-cols-8">
                  {forecast.hourlyData.map((hourlyItem) => (
                    <div 
                      key={hourlyItem.dt} 
                      className="group/hour flex-shrink-0 transform rounded-lg bg-white/50 p-3 text-center transition-all duration-200 hover:bg-white/70 hover:scale-105 hover:shadow-md dark:bg-gray-700/50 dark:hover:bg-gray-700/70"
                      style={{ minWidth: '80px' }}
                    >
                      <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        {format(new Date(hourlyItem.dt * 1000), 'h a')}
                      </div>
                      <div className="mb-2 flex justify-center">
                        <img
                          src={weatherService.getWeatherIconUrl(hourlyItem.weather[0].icon)}
                          alt={hourlyItem.weather[0].description}
                          className="h-8 w-8 transition-transform duration-300 group-hover/hour:scale-110"
                        />
                      </div>
                      <div className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                        {Math.round(hourlyItem.main.temp)}°
                      </div>
                      <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Wind className="h-3 w-3" />
                        <span>{Math.round(hourlyItem.wind.speed)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Weather Summary */}
        <div className="transform rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-6 backdrop-blur-sm ring-1 ring-blue-200/50 transition-all duration-300 hover:shadow-lg dark:from-blue-950/30 dark:to-indigo-950/30 dark:ring-blue-800/30">
          <div className="mb-4 flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Weather Insights
            </h4>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
              <div className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Temperature
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(dailyForecasts.reduce((sum, day) => sum + day.item.main.temp, 0) / dailyForecasts.length)}°
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Next 5 days
              </div>
            </div>
            
            <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
              <div className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Dominant Condition
              </div>
              <div className="flex items-center space-x-2">
                {getWeatherIcon(dailyForecasts[0]?.item.weather[0].main || 'Clear', 'h-6 w-6')}
                <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {dailyForecasts[0]?.item.weather[0].main || 'Clear'}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Most common
              </div>
            </div>
            
            <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
              <div className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Wind
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(dailyForecasts.reduce((sum, day) => sum + day.item.wind.speed, 0) / dailyForecasts.length)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">m/s</span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Wind speed
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    </div>
  )
}