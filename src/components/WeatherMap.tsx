'use client'

import { useState, useEffect } from 'react'
import { WeatherData } from '@/types/weather'
import { Map, Globe } from 'lucide-react'

interface WeatherMapProps {
  location: string
  weatherData: WeatherData
}

export function WeatherMap({ location, weatherData }: WeatherMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        try {
          const L = await import('leaflet')
          await import('leaflet/dist/leaflet.css')
          
          // Fix for default markers in Leaflet
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          })
          
          setMapLoaded(true)
        } catch (error) {
          console.error('Failed to load map:', error)
        }
      }
    }

    loadMap()
  }, [])

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const getWeatherMapUrl = () => {
    const { lat, lon } = weatherData.coord
    const layer = weatherData.weather[0].main.toLowerCase()
    
    // OpenWeatherMap layer types
    const layerMap: Record<string, string> = {
      'clear': 'temp_new',
      'clouds': 'clouds_new',
      'rain': 'precipitation_new',
      'snow': 'precipitation_new',
      'thunderstorm': 'precipitation_new'
    }
    
    const mapLayer = layerMap[layer] || 'temp_new'
    
    return `https://tile.openweathermap.org/map/${mapLayer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
  }

  return (
    <div className="weather-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Weather Map
        </h3>
        <button
          onClick={toggleMap}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showMap ? (
            <>
              <Globe className="h-5 w-5" />
              <span>Hide Map</span>
            </>
          ) : (
            <>
              <Map className="h-5 w-5" />
              <span>Show Map</span>
            </>
          )}
        </button>
      </div>

      {showMap && (
        <div className="space-y-4">
          {/* Map Container */}
          <div className="relative">
            <div 
              id="weather-map" 
              className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              {mapLoaded ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Interactive map will be displayed here
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Location: {weatherData.name}, {weatherData.sys.country}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Coordinates
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>Latitude: {weatherData.coord.lat.toFixed(4)}°</div>
                <div>Longitude: {weatherData.coord.lon.toFixed(4)}°</div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Map Layers
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>Temperature</div>
                <div>Precipitation</div>
                <div>Clouds</div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Weather Data
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>Current: {weatherData.weather[0].main}</div>
                <div>Temperature: {Math.round(weatherData.main.temp)}°C</div>
                <div>Humidity: {weatherData.main.humidity}%</div>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Map Legend
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Hot</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Warm</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Cool</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Cold</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

