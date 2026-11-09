'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Loader2, MapPin, Search } from 'lucide-react'
import { WeatherService } from '@/services/weatherService'
import { LocationData } from '@/types/weather'

interface WeatherSearchProps {
  currentName: string
  onSearch: (location: string) => void
  loading: boolean
  variant?: 'dark' | 'pill'
}

export function WeatherSearch({
  currentName,
  onSearch,
  loading,
  variant = 'dark',
}: WeatherSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const weatherService = new WeatherService()

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const handleInputChange = async (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) {
      setSuggestions([])
      return
    }
    setSearchLoading(true)
    try {
      const results = await weatherService.searchLocations(value)
      setSuggestions(results)
    } catch {
      setSuggestions([])
    } finally {
      setSearchLoading(false)
    }
  }

  const selectSuggestion = (location: LocationData) => {
    const parts = [location.name]
    if (location.state) parts.push(location.state)
    parts.push(location.country)
    onSearch(parts.join(', '))
    setOpen(false)
    setQuery('')
    setSuggestions([])
  }

  const submitQuery = () => {
    if (!query.trim()) return
    onSearch(query.trim())
    setOpen(false)
    setQuery('')
    setSuggestions([])
  }

  const triggerClass =
    variant === 'pill'
      ? 'inline-flex max-w-[220px] items-center gap-2 rounded-full border border-line bg-snow px-3 py-1.5 text-[13px] text-ink shadow-[0_1px_0_rgba(28,28,26,0.04)]'
      : 'inline-flex max-w-[220px] items-center gap-2 text-left text-[15px] font-medium text-snow'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin className={`h-3.5 w-3.5 shrink-0 ${variant === 'pill' ? 'text-ink-muted' : 'text-snow/70'}`} />
        <span className="truncate">{currentName}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 ${variant === 'pill' ? 'text-ink-muted' : 'text-snow/50'}`} />
      </button>

      {open && (
        <div
          className={`absolute z-30 mt-2 w-[min(320px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-line bg-snow shadow-atmos ${
            variant === 'pill' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
            {searchLoading || loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />
            ) : (
              <Search className="h-4 w-4 text-ink-muted" />
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitQuery()
                if (e.key === 'Escape') setOpen(false)
              }}
              placeholder="Search a city"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {suggestions.length === 0 && query.length >= 2 && !searchLoading && (
              <p className="px-3 py-3 text-sm text-ink-muted">No matching places.</p>
            )}
            {suggestions.map((location) => (
              <button
                key={`${location.lat}-${location.lon}`}
                type="button"
                onClick={() => selectSuggestion(location)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-paper-2"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-ink-muted" />
                <span>
                  <span className="block text-sm text-ink">{location.name}</span>
                  <span className="block text-xs text-ink-muted">
                    {[location.state, location.country].filter(Boolean).join(', ')}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
