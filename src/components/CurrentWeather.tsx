'use client'

import type { ReactNode } from 'react'
import { AirQualityData, ForecastData, UVIndexData, WeatherData } from '@/types/weather'
import { WeatherSearch } from '@/components/WeatherSearch'
import { WeatherGlyph } from '@/components/WeatherGlyph'
import {
  aqiInfo,
  cityDate,
  cloudAdjustedUv,
  conditionTitle,
  countryLabel,
  formatClock,
  formatHemisphere,
  msToKmh,
  todayHiLo,
  toDisplayTemp,
  Unit,
  uvBand,
  windCompass,
} from '@/lib/atmos'
import { Crosshair, Droplets, Eye, Gauge, Sun, Sunrise, Sunset, Wind } from 'lucide-react'

interface CurrentWeatherProps {
  data: WeatherData
  forecast: ForecastData | null
  unit: Unit
  loading: boolean
  airQuality?: AirQualityData | null
  uvIndex?: UVIndexData | null
  onSearch: (location: string) => void
  onGeolocation: () => void
}

export function CurrentWeather({
  data,
  forecast,
  unit,
  loading,
  airQuality,
  uvIndex,
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

  const aqi =
    airQuality?.list[0]?.main.aqi != null ? aqiInfo(airQuality.list[0].main.aqi) : null
  const todayTemps = todayHiLo(data, forecast)
  const hiLo = todayTemps ?? { min: data.main.temp_min, max: data.main.temp_max }
  const adjustedUvi =
    uvIndex != null ? cloudAdjustedUv(uvIndex.value, data.clouds.all) : null
  const uv = adjustedUvi != null ? uvBand(adjustedUvi) : null
  const sunrise = formatClock(cityDate(data.timezone, data.sys.sunrise))
  const sunset = formatClock(cityDate(data.timezone, data.sys.sunset))
  const visibilityKm = (data.visibility / 1000).toFixed(1)

  return (
    <section className="relative h-full overflow-hidden rounded-atmos bg-card px-5 pb-5 pt-5 text-snow shadow-atmos sm:px-6 sm:pb-6 sm:pt-6">
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-snow/70 transition hover:border-white/25 hover:text-snow disabled:opacity-50"
            aria-label="Use my location"
          >
            <Crosshair className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-start">
              <span className="text-[clamp(3.5rem,18vw,5.5rem)] font-light leading-none tracking-tight">
                {toDisplayTemp(data.main.temp, unit)}
              </span>
              <span className="mt-2 text-lg font-normal text-snow/80">°{unit}</span>
            </div>
            <p className="mt-4 text-[17px] text-snow/90">{conditionTitle(weather.description)}</p>
            <p className="mt-1 text-[12px] tracking-wide text-snow/40">
              H:{toDisplayTemp(hiLo.max, unit)}°{' '}
              <span className="mx-1 text-snow/25">L:</span>
              {toDisplayTemp(hiLo.min, unit)}°
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

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
          <DetailChip icon={<Eye className="h-3.5 w-3.5" />} label="Visibility" value={`${visibilityKm} km`} />
          <DetailChip icon={<Gauge className="h-3.5 w-3.5" />} label="Pressure" value={`${data.main.pressure} hPa`} />
          <DetailChip icon={<Sunrise className="h-3.5 w-3.5" />} label="Sunrise" value={sunrise} />
          <DetailChip icon={<Sunset className="h-3.5 w-3.5" />} label="Sunset" value={sunset} />
        </div>

        {(aqi || uv) && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {aqi && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-snow/70">
                AQI {airQuality!.list[0].main.aqi} · {aqi.level}
              </span>
            )}
            {uv && adjustedUvi != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-snow/70">
                <Sun className="h-3 w-3" strokeWidth={1.5} />
                UV {adjustedUvi.toFixed(1)} · {uv.label}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function DetailChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center">
      <div className="mb-1 flex justify-center text-snow/55">{icon}</div>
      <p className="text-[9px] uppercase tracking-[0.16em] text-snow/40">{label}</p>
      <p className="mt-0.5 text-[12px] text-snow/80">{value}</p>
    </div>
  )
}
