'use client'

import { WeatherData } from '@/types/weather'
import { WeatherSearch } from '@/components/WeatherSearch'
import { WeatherGlyph } from '@/components/WeatherGlyph'
import {
  conditionTitle,
  countryLabel,
  formatHemisphere,
  msToKmh,
  toDisplayTemp,
  Unit,
  windCompass,
} from '@/lib/atmos'
import { Crosshair, Droplets, Wind } from 'lucide-react'

interface CurrentWeatherProps {
  data: WeatherData
  unit: Unit
  loading: boolean
  onSearch: (location: string) => void
  onGeolocation: () => void
}

export function CurrentWeather({
  data,
  unit,
  loading,
  onSearch,
  onGeolocation,
}: CurrentWeatherProps) {
  const weather = data.weather[0]
  const placeMeta = [
    data.sys.country ? countryLabel(data.sys.country) : null,
    formatHemisphere(data.coord.lat, data.coord.lon),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <section className="relative overflow-hidden rounded-atmos bg-card px-5 pb-5 pt-5 text-snow shadow-atmos sm:px-6 sm:pb-6 sm:pt-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 88% 12%, rgba(255,255,255,0.12), transparent 52%), radial-gradient(circle at 20% 110%, rgba(255,255,255,0.04), transparent 42%)',
        }}
      />

      <div className="relative">
        <div className="mb-8 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <WeatherSearch
              currentName={data.name}
              onSearch={onSearch}
              loading={loading}
              variant="dark"
            />
            <p className="mt-1 truncate pl-6 text-[11px] tracking-[0.01em] text-snow/45">
              {placeMeta}
            </p>
          </div>
          <button
            type="button"
            onClick={onGeolocation}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-snow/70 transition hover:border-white/25 hover:text-snow disabled:opacity-50"
            aria-label="Use my location"
          >
            <Crosshair className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-start">
              <span className="text-[88px] font-light leading-none tracking-tight">
                {toDisplayTemp(data.main.temp, unit)}
              </span>
              <span className="mt-2 text-lg font-normal text-snow/80">°{unit}</span>
            </div>
            <p className="mt-4 text-[17px] text-snow/90">{conditionTitle(weather.description)}</p>
            <p className="mt-1 text-[12px] tracking-wide text-snow/40">
              H:{toDisplayTemp(data.main.temp_max, unit)}°{' '}
              <span className="mx-1 text-snow/25">L:</span>
              {toDisplayTemp(data.main.temp_min, unit)}°
            </p>
          </div>
          <WeatherGlyph
            main={weather.main}
            description={weather.description}
            icon={weather.icon}
            className="mt-2 h-16 w-16 text-snow/80"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-[12px] text-snow/55">
          <span className="inline-flex items-center gap-1.5">
            <Wind className="h-3.5 w-3.5" strokeWidth={1.5} />
            {msToKmh(data.wind.speed)} km/h {windCompass(data.wind.deg)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5" strokeWidth={1.5} />
            {data.main.humidity}% humidity
          </span>
          <span className="tracking-[0.14em] text-[10px] text-snow/45">
            FEELS {toDisplayTemp(data.main.feels_like, unit)}°
          </span>
        </div>
      </div>
    </section>
  )
}
