'use client'

import { AlertData } from '@/types/weather'
import { AlertTriangle, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface WeatherAlertsProps {
  alerts: AlertData[]
}

export function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  // Show component even when no alerts to inform about subscription requirement

  const getAlertSeverity = (event: string) => {
    const eventLower = event.toLowerCase()
    if (eventLower.includes('warning') || eventLower.includes('severe')) {
      return 'high'
    }
    if (eventLower.includes('watch') || eventLower.includes('advisory')) {
      return 'medium'
    }
    return 'low'
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
    }
  }

  const getAlertIconColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      default:
        return 'text-blue-500'
    }
  }

  return (
    <div className="weather-card">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Weather Alerts
        </h3>
        {alerts.length > 0 ? (
          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 px-2 py-1 rounded-full text-sm font-medium">
            {alerts.length} Active
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded-full text-sm font-medium">
            No Active Alerts
          </span>
        )}
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Weather Alerts
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Weather alerts require a paid OpenWeatherMap subscription.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                Free Alternative:
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You can still get comprehensive weather data including current conditions, 
                5-day forecasts, and air quality information with the free tier.
              </p>
            </div>
          </div>
        ) : (
          alerts.map((alert, index) => {
          const severity = getAlertSeverity(alert.event)
          const colorClass = getAlertColor(severity)
          const iconColor = getAlertIconColor(severity)

          return (
            <div key={index} className={`rounded-lg p-4 border ${colorClass}`}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`h-6 w-6 ${iconColor} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {alert.event}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      severity === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        : severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>
                      {severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Starts: {format(new Date(alert.start * 1000), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Ends: {format(new Date(alert.end * 1000), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                  
                  {alert.tags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {alert.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Issued by: {alert.sender_name}
                  </div>
                </div>
              </div>
            </div>
          )
          })
        )}
      </div>

      {/* Safety Tips */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Safety Tips
        </h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Stay informed about weather conditions</li>
          <li>• Follow local emergency management instructions</li>
          <li>• Have an emergency kit ready</li>
          <li>• Avoid unnecessary travel during severe weather</li>
          <li>• Check on family and neighbors</li>
        </ul>
      </div>
    </div>
  )
}

