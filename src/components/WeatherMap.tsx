'use client'

import { useState } from 'react'
import { WeatherData } from '@/types/weather'
import { Map, Globe, Navigation, MapPin } from 'lucide-react'

interface WeatherMapProps {
  location: string
  weatherData: WeatherData
}

export function WeatherMap({ location, weatherData }: WeatherMapProps) {
  const [showMap, setShowMap] = useState(false)

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const getOpenStreetMapUrl = () => {
    const { lat, lon } = weatherData.coord
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`
  }

  const getGoogleMapsUrl = () => {
    const { lat, lon } = weatherData.coord
    return `https://www.google.com/maps?q=${lat},${lon}&z=10`
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="group relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-2xl dark:bg-gray-900/60 dark:ring-gray-800/50 sm:p-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-green-950/10 dark:to-blue-950/10"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-blue-600 p-2.5 shadow-lg">
                <Map className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:via-gray-100 dark:to-white sm:text-3xl">
                  Weather Map
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Location visualization
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleMap}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {showMap ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide Map</span>
                </>
              ) : (
                <>
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Show Map</span>
                </>
              )}
            </button>
          </div>

          {showMap && (
            <div className="space-y-6">
              {/* Map Container */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
                <div className="relative h-96 w-full">
                  {/* Static Map using OpenStreetMap */}
                  <iframe
                    src={getOpenStreetMapUrl()}
                    className="h-full w-full border-0"
                    title="Weather Location Map"
                  />
                  
                  {/* Overlay with location info */}
                  <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-gray-800/90">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {weatherData.name}, {weatherData.sys.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Information Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="transform rounded-xl bg-white/40 p-4 backdrop-blur-sm ring-1 ring-gray-200/30 transition-all duration-300 hover:bg-white/60 hover:scale-105 hover:shadow-lg dark:bg-gray-800/40 dark:ring-gray-700/30 dark:hover:bg-gray-800/60">
                  <div className="mb-3 flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Coordinates</h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>Lat: {weatherData.coord.lat.toFixed(4)}°</div>
                    <div>Lon: {weatherData.coord.lon.toFixed(4)}°</div>
                  </div>
                </div>

                <div className="transform rounded-xl bg-white/40 p-4 backdrop-blur-sm ring-1 ring-gray-200/30 transition-all duration-300 hover:bg-white/60 hover:scale-105 hover:shadow-lg dark:bg-gray-800/40 dark:ring-gray-700/30 dark:hover:bg-gray-800/60">
                  <div className="mb-3 flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>{weatherData.name}</div>
                    <div>{weatherData.sys.country}</div>
                  </div>
                </div>

                <div className="transform rounded-xl bg-white/40 p-4 backdrop-blur-sm ring-1 ring-gray-200/30 transition-all duration-300 hover:bg-white/60 hover:scale-105 hover:shadow-lg dark:bg-gray-800/40 dark:ring-gray-700/30 dark:hover:bg-gray-800/60">
                  <div className="mb-3 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Weather</h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>{weatherData.weather[0].main}</div>
                    <div>{Math.round(weatherData.main.temp)}°C</div>
                  </div>
                </div>
              </div>

              {/* External Map Links */}
              <div className="transform rounded-xl bg-gradient-to-br from-green-50/80 to-blue-50/80 p-6 backdrop-blur-sm ring-1 ring-green-200/50 transition-all duration-300 hover:shadow-lg dark:from-green-950/30 dark:to-blue-950/30 dark:ring-green-800/30">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
                    <Navigation className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    External Maps
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={getGoogleMapsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:scale-105 hover:shadow-md dark:bg-gray-800/60 dark:hover:bg-gray-800/80"
                  >
                    <div className="rounded-lg bg-red-100 p-2 group-hover:bg-red-200 dark:bg-red-900/50 dark:group-hover:bg-red-900/70">
                      <Map className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Google Maps</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">View in Google Maps</div>
                    </div>
                  </a>
                  
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${weatherData.coord.lat}&mlon=${weatherData.coord.lon}&zoom=10`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:scale-105 hover:shadow-md dark:bg-gray-800/60 dark:hover:bg-gray-800/80"
                  >
                    <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 dark:bg-blue-900/50 dark:group-hover:bg-blue-900/70">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">OpenStreetMap</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">View in OSM</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

