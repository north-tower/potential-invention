'use client'

import { AirQualityData } from '@/types/weather'
import { WeatherService } from '@/services/weatherService'
import { 
  AlertTriangle,
  CheckCircle,
  Info,
  Circle,
  BarChart3,
  Square,
  Wind,
  Heart,
  Thermometer,
  Droplet,
  Eye,
  Gauge
} from 'lucide-react'

interface AirQualityProps {
  data: AirQualityData
}

export function AirQuality({ data }: AirQualityProps) {
  const weatherService = new WeatherService()
  const airQuality = data.list[0]
  const aqiInfo = weatherService.getAirQualityIndex(airQuality.main.aqi)

  const getAQIIcon = (aqi: number, size: string = 'h-6 w-6') => {
    const iconClass = `${size} drop-shadow-sm transition-transform duration-300 hover:scale-110`
    
    if (aqi <= 2) return <CheckCircle className={`${iconClass} text-green-500`} />
    if (aqi <= 3) return <Info className={`${iconClass} text-yellow-500`} />
    return <AlertTriangle className={`${iconClass} text-red-500`} />
  }

  const getAQIGradient = (aqi: number) => {
    const gradients = [
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-400',
      'from-orange-400 to-red-500',
      'from-red-500 to-pink-600',
      'from-purple-500 to-pink-700'
    ]
    return gradients[Math.min(aqi - 1, 4)] || gradients[0]
  }

  const getAQIBackground = (aqi: number) => {
    const backgrounds = [
      'bg-green-50/80 dark:bg-green-950/30 ring-green-200/50 dark:ring-green-800/50',
      'bg-yellow-50/80 dark:bg-yellow-950/30 ring-yellow-200/50 dark:ring-yellow-800/50',
      'bg-orange-50/80 dark:bg-orange-950/30 ring-orange-200/50 dark:ring-orange-800/50',
      'bg-red-50/80 dark:bg-red-950/30 ring-red-200/50 dark:ring-red-800/50',
      'bg-purple-50/80 dark:bg-purple-950/30 ring-purple-200/50 dark:ring-purple-800/50'
    ]
    return backgrounds[Math.min(aqi - 1, 4)] || backgrounds[0]
  }

  const pollutants = [
    {
      name: 'PM2.5',
      value: airQuality.components.pm2_5,
      unit: 'μg/m³',
      description: 'Fine particulate matter',
      icon: <Circle className="h-4 w-4" />,
      severity: airQuality.components.pm2_5 > 35 ? 'high' : airQuality.components.pm2_5 > 12 ? 'moderate' : 'low'
    },
    {
      name: 'PM10',
      value: airQuality.components.pm10,
      unit: 'μg/m³',
      description: 'Coarse particulate matter',
      icon: <BarChart3 className="h-4 w-4" />,
      severity: airQuality.components.pm10 > 50 ? 'high' : airQuality.components.pm10 > 20 ? 'moderate' : 'low'
    },
    {
      name: 'NO₂',
      value: airQuality.components.no2,
      unit: 'μg/m³',
      description: 'Nitrogen dioxide',
      icon: <Wind className="h-4 w-4" />,
      severity: airQuality.components.no2 > 200 ? 'high' : airQuality.components.no2 > 100 ? 'moderate' : 'low'
    },
    {
      name: 'O₃',
      value: airQuality.components.o3,
      unit: 'μg/m³',
      description: 'Ozone',
      icon: <Square className="h-4 w-4" />,
      severity: airQuality.components.o3 > 180 ? 'high' : airQuality.components.o3 > 120 ? 'moderate' : 'low'
    },
    {
      name: 'SO₂',
      value: airQuality.components.so2,
      unit: 'μg/m³',
      description: 'Sulfur dioxide',
      icon: <Circle className="h-4 w-4" />,
      severity: airQuality.components.so2 > 150 ? 'high' : airQuality.components.so2 > 50 ? 'moderate' : 'low'
    },
    {
      name: 'CO',
      value: airQuality.components.co,
      unit: 'mg/m³',
      description: 'Carbon monoxide',
      icon: <Heart className="h-4 w-4" />,
      severity: airQuality.components.co > 10 ? 'high' : airQuality.components.co > 4 ? 'moderate' : 'low'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 dark:text-red-400'
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-green-600 dark:text-green-400'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100/80 dark:bg-red-950/30'
      case 'moderate':
        return 'bg-yellow-100/80 dark:bg-yellow-950/30'
      default:
        return 'bg-green-100/80 dark:bg-green-950/30'
    }
  }

  const getHealthRecommendation = (aqi: number) => {
    const recommendations = [
      {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: 'Excellent Air Quality',
        description: 'Perfect for outdoor activities. Enjoy the fresh air!',
        color: 'text-green-600 dark:text-green-400'
      },
      {
        icon: <Info className="h-5 w-5 text-yellow-500" />,
        title: 'Good Air Quality',
        description: 'Air quality is acceptable. Most people can enjoy outdoor activities.',
        color: 'text-yellow-600 dark:text-yellow-400'
      },
      {
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        title: 'Moderate Air Quality',
        description: 'Sensitive individuals should consider limiting outdoor activities.',
        color: 'text-orange-600 dark:text-orange-400'
      },
      {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        title: 'Poor Air Quality',
        description: 'Everyone may begin to experience health effects. Limit outdoor activities.',
        color: 'text-red-600 dark:text-red-400'
      },
      {
        icon: <AlertTriangle className="h-5 w-5 text-purple-500" />,
        title: 'Very Poor Air Quality',
        description: 'Health warnings of emergency conditions. Stay indoors if possible.',
        color: 'text-purple-600 dark:text-purple-400'
      }
    ]
    return recommendations[Math.min(aqi - 1, 4)] || recommendations[0]
  }

  const healthRec = getHealthRecommendation(airQuality.main.aqi)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="group relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-2xl dark:bg-gray-900/60 dark:ring-gray-800/50 sm:p-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-green-50/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-950/10 dark:to-green-950/10"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-blue-600 p-2.5 shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:via-gray-100 dark:to-white sm:text-3xl">
                  Air Quality
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time air pollution monitoring
                </p>
              </div>
            </div>
            {getAQIIcon(airQuality.main.aqi, 'h-8 w-8')}
          </div>

          {/* AQI Main Display */}
          <div className={`mb-8 transform rounded-2xl ${getAQIBackground(airQuality.main.aqi)} p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full bg-gradient-to-r ${getAQIGradient(airQuality.main.aqi)} p-2 shadow-lg`}>
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Air Quality Index</div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">{airQuality.main.aqi}</div>
                  </div>
                </div>
                <div className={`text-xl font-semibold ${aqiInfo.color}`}>
                  {aqiInfo.level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  {aqiInfo.description}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                  {airQuality.main.aqi}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AQI Index</div>
                
                {/* AQI Visual Indicator */}
                <div className="mt-4 w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getAQIGradient(airQuality.main.aqi)} transition-all duration-700 ${
                      airQuality.main.aqi === 1 ? 'w-1/5' :
                      airQuality.main.aqi === 2 ? 'w-2/5' :
                      airQuality.main.aqi === 3 ? 'w-3/5' :
                      airQuality.main.aqi === 4 ? 'w-4/5' :
                      'w-full'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pollutants Grid */}
          <div className="mb-8">
            <h4 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Pollutant Concentrations
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pollutants.map((pollutant, index) => (
                <div
                  key={index}
                  className="group/pollutant transform rounded-xl bg-white/40 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/50 hover:scale-105 hover:shadow-lg border border-gray-200/50 dark:bg-white/20 dark:border-white/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-600 dark:text-gray-400">
                        {pollutant.icon}
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {pollutant.name}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(pollutant.severity)} ${getSeverityColor(pollutant.severity)}`}>
                      {pollutant.severity}
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {pollutant.value.toFixed(1)}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                      {pollutant.unit}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {pollutant.description}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        pollutant.severity === 'high' ? 'bg-red-400' :
                        pollutant.severity === 'moderate' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}
                      style={{ 
                        width: `${Math.min((pollutant.value / (pollutant.name === 'CO' ? 20 : 200)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Recommendations */}
          <div className="transform rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/60 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg border border-blue-200/50 dark:from-blue-950/30 dark:to-indigo-950/20 dark:border-blue-800/30">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {healthRec.icon}
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-bold mb-2 ${healthRec.color}`}>
                  {healthRec.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {healthRec.description}
                </p>
                
                {/* Additional Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Droplet className="h-4 w-4" />
                    <span>Stay hydrated</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span>Monitor air quality</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Gauge className="h-4 w-4" />
                    <span>Limit outdoor time if needed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Heart className="h-4 w-4" />
                    <span>Protect sensitive groups</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Animations */}
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
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
        `}</style>
      </div>
    </div>
  )
}