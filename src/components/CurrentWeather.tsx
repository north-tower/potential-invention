'use client'

import { WeatherData, AirQualityData } from '@/types/weather'
import { WeatherService } from '@/services/weatherService'
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake,
  Eye,
  Droplet,
  Wind,
  ArrowUp,
  ArrowDown,
  Sunrise,
  Sunset,
  Gauge,
  Thermometer
} from 'lucide-react'
import { format } from 'date-fns'

interface CurrentWeatherProps {
  data: WeatherData
  airQuality?: AirQualityData | null
}

export function CurrentWeather({ data, airQuality }: CurrentWeatherProps) {
  const weatherService = new WeatherService()
  const weatherMain = data.weather[0].main
  const backgroundClass = weatherService.getWeatherBackground(weatherMain)
  
  const getWeatherIcon = (main: string, size: string = 'h-8 w-8') => {
    const iconClass = `${size} drop-shadow-lg transition-transform duration-300 hover:scale-110`
    
    switch (main) {
      case 'Clear':
        return <Sun className={`${iconClass} text-yellow-400`} />
      case 'Clouds':
        return <Cloud className={`${iconClass} text-gray-300`} />
      case 'Rain':
      case 'Drizzle':
        return <CloudRain className={`${iconClass} text-blue-300`} />
      case 'Snow':
        return <Snowflake className={`${iconClass} text-blue-100`} />
      default:
        return <Cloud className={`${iconClass} text-gray-300`} />
    }
  }

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  const getAirQualityInfo = () => {
    if (!airQuality || !airQuality.list[0]) return null
    return weatherService.getAirQualityIndex(airQuality.list[0].main.aqi)
  }

  const weatherDetails = [
    {
      icon: <Wind className="h-5 w-5 text-blue-600 dark:text-white/90" />,
      label: 'Wind',
      value: `${data.wind.speed} m/s`,
      subValue: getWindDirection(data.wind.deg)
    },
    {
      icon: <Droplet className="h-5 w-5 text-blue-600 dark:text-white/90" />,
      label: 'Humidity',
      value: `${data.main.humidity}%`,
      subValue: null
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-600 dark:text-white/90" />,
      label: 'Visibility',
      value: `${(data.visibility / 1000).toFixed(1)} km`,
      subValue: null
    },
    {
      icon: <Gauge className="h-5 w-5 text-blue-600 dark:text-white/90" />,
      label: 'Pressure',
      value: `${data.main.pressure}`,
      subValue: 'hPa'
    }
  ]

  const airQualityInfo = getAirQualityInfo()

  return (
    <div className="mx-auto max-w-7xl">
      <div className={`group relative rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-2xl dark:bg-gray-900/60 dark:ring-gray-800/50 sm:p-8`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-white/10 to-white/5 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-white/8 to-white/3 blur-2xl transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>

      <div className="relative z-10 text-gray-900 dark:text-white">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold drop-shadow-lg sm:text-3xl lg:text-4xl">
              {data.name}
              <span className="ml-2 text-lg font-medium opacity-80 sm:text-xl lg:text-2xl">
                {data.sys.country}
              </span>
            </h2>
            <p className="text-base opacity-90 drop-shadow sm:text-lg">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
            <p className="text-sm opacity-75 drop-shadow sm:text-base">
              {format(new Date(), 'h:mm a')}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-2">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weatherMain, 'h-10 w-10 sm:h-12 sm:w-12')}
              <div className="sm:text-right">
                <div className="text-lg font-semibold capitalize drop-shadow sm:text-xl">
                  {data.weather[0].description}
                </div>
                <div className="text-sm opacity-80 sm:text-base">
                  Current conditions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Temperature Display */}
        <div className="mb-8 text-center">
          <div className="relative">
            <div className="text-7xl font-light drop-shadow-2xl sm:text-8xl lg:text-9xl">
              {Math.round(data.main.temp)}
              <span className="text-4xl sm:text-5xl lg:text-6xl">°</span>
            </div>
            <div className="absolute -inset-4 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-3xl"></div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="text-lg opacity-90 drop-shadow sm:text-xl">
              Feels like {Math.round(data.main.feels_like)}°
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm opacity-80 sm:text-base">
              <div className="flex items-center space-x-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <ArrowUp className="h-4 w-4" />
                <span className="font-medium">{Math.round(data.main.temp_max)}°</span>
              </div>
              <div className="flex items-center space-x-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <ArrowDown className="h-4 w-4" />
                <span className="font-medium">{Math.round(data.main.temp_min)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {weatherDetails.map((detail, index) => (
            <div
              key={index}
              className="group/card transform rounded-xl bg-white/40 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/50 hover:scale-105 hover:shadow-lg border border-gray-200/50 dark:bg-white/20 dark:border-white/30"
            >
              <div className="mb-3 flex justify-center transition-transform duration-300 group-hover/card:scale-110">
                {detail.icon}
              </div>
              <div className="text-xs opacity-90 drop-shadow sm:text-sm">
                {detail.label}
              </div>
              <div className="mt-1 text-sm font-semibold drop-shadow sm:text-base">
                {detail.value}
              </div>
              {detail.subValue && (
                <div className="text-xs opacity-75 drop-shadow">
                  {detail.subValue}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Air Quality Section */}
        {airQualityInfo && (
          <div className="mb-8 transform rounded-xl bg-white/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/50 hover:scale-[1.02] border border-gray-200/50 dark:bg-white/20 dark:border-white/30">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-blue-600 dark:text-white/90" />
                  <span className="text-sm opacity-80">Air Quality</span>
                </div>
                <div className={`text-lg font-bold ${airQualityInfo.color}`}>
                  {airQualityInfo.level}
                </div>
                <div className="text-xs opacity-70">
                  {airQualityInfo.description}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {airQuality?.list[0]?.main.aqi}
                </div>
                <div className="text-xs opacity-70">AQI Index</div>
              </div>
            </div>
            
            {/* AQI Visual Indicator */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200/50 dark:bg-white/30">
              <div 
                className={`h-full transition-all duration-700 ${
                  airQuality?.list[0]?.main.aqi === 1 ? 'bg-green-400 w-1/5' :
                  airQuality?.list[0]?.main.aqi === 2 ? 'bg-yellow-400 w-2/5' :
                  airQuality?.list[0]?.main.aqi === 3 ? 'bg-orange-400 w-3/5' :
                  airQuality?.list[0]?.main.aqi === 4 ? 'bg-red-400 w-4/5' :
                  'bg-purple-400 w-full'
                }`}
              ></div>
            </div>
          </div>
        )}

        {/* Sunrise/Sunset Section */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="group/sun transform rounded-xl bg-orange-100/60 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg border border-orange-200/50 dark:bg-orange-500/20 dark:border-orange-400/30">
            <div className="mb-3 flex justify-center transition-transform duration-300 group-hover/sun:scale-110">
              <Sunrise className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="text-xs opacity-90 sm:text-sm">Sunrise</div>
            <div className="mt-1 text-base font-semibold sm:text-lg">
              {format(new Date(data.sys.sunrise * 1000), 'h:mm a')}
            </div>
          </div>
          
          <div className="group/sunset transform rounded-xl bg-purple-100/60 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg border border-purple-200/50 dark:bg-purple-500/20 dark:border-purple-400/30">
            <div className="mb-3 flex justify-center transition-transform duration-300 group-hover/sunset:scale-110">
              <Sunset className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-xs opacity-90 sm:text-sm">Sunset</div>
            <div className="mt-1 text-base font-semibold sm:text-lg">
              {format(new Date(data.sys.sunset * 1000), 'h:mm a')}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}