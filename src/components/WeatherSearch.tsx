'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react'
import { WeatherService } from '@/services/weatherService'
import { LocationData } from '@/types/weather'

interface WeatherSearchProps {
  onSearch: (location: string) => void
  onGeolocation: () => void
  loading: boolean
}

export function WeatherSearch({ onSearch, onGeolocation, loading }: WeatherSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchLoading, setSearchLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const weatherService = new WeatherService()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = async (value: string) => {
    setQuery(value)
    setSelectedIndex(-1)

    if (value.length >= 2) {
      setSearchLoading(true)
      try {
        const results = await weatherService.searchLocations(value)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
      } finally {
        setSearchLoading(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSearchLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectSuggestion = (location: LocationData) => {
    const locationString = `${location.name}, ${location.country}`
    setQuery(locationString)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onSearch(locationString)
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const formatLocationName = (location: LocationData) => {
    const parts = [location.name]
    if (location.state) parts.push(location.state)
    parts.push(location.country)
    return parts.join(', ')
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="group relative rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-2xl dark:bg-gray-900/60 dark:ring-gray-800/50 sm:p-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-indigo-950/20"></div>
      
      <div className="relative space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h2 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:via-gray-100 dark:to-white sm:text-3xl">
            Discover Weather
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Search any location worldwide for instant weather updates
          </p>
        </div>
        
        {/* Search Input Section */}
        <div className="relative">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <div className="group/input relative flex-1">
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
                {searchLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                ) : (
                  <Search className="h-5 w-5 text-gray-400 transition-colors group-focus-within/input:text-blue-500" />
                )}
              </div>
              
              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search cities, countries..."
                className="w-full rounded-xl border-0 bg-white/80 py-4 pl-12 pr-4 text-gray-900 shadow-md ring-1 ring-gray-200/80 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 dark:bg-gray-800/80 dark:text-white dark:ring-gray-700/80 dark:placeholder:text-gray-400 dark:focus:ring-blue-400/50 sm:py-3.5"
                disabled={loading}
              />
              
              {/* Enhanced Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-hidden rounded-xl bg-white/95 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-xl dark:bg-gray-800/95 dark:ring-gray-700/50"
                >
                  <div className="overflow-y-auto">
                    {suggestions.map((location, index) => (
                      <button
                        key={`${location.lat}-${location.lon}`}
                        onClick={() => selectSuggestion(location)}
                        className={`group/item w-full border-b border-gray-100/50 px-4 py-4 text-left transition-all duration-150 last:border-b-0 dark:border-gray-700/50 ${
                          index === selectedIndex
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300'
                            : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5 flex-shrink-0">
                            <MapPin className={`h-4 w-4 transition-colors ${
                              index === selectedIndex 
                                ? 'text-blue-500 dark:text-blue-400' 
                                : 'text-gray-400 group-hover/item:text-gray-600 dark:group-hover/item:text-gray-300'
                            }`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-gray-900 dark:text-white">
                              {location.name}
                            </div>
                            <div className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                              {[location.state, location.country].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none sm:px-8 sm:py-3.5"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                </div>
              )}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full"></div>
            </button>
          </div>
        </div>

        {/* Location & Helper Section */}
        <div className="flex flex-col-reverse items-center justify-between space-y-4 space-y-reverse border-t border-gray-200/50 pt-6 dark:border-gray-700/50 sm:flex-row sm:space-y-0">
          <button
            onClick={onGeolocation}
            disabled={loading}
            className="group/geo flex items-center space-x-2 rounded-lg px-4 py-2.5 text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:text-gray-400 disabled:hover:bg-transparent dark:text-blue-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 dark:disabled:text-gray-500"
          >
            <Navigation className="h-4 w-4 transition-transform duration-200 group-hover/geo:scale-110" />
            <span className="font-medium">Use my location</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span>Real-time global weather data</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}