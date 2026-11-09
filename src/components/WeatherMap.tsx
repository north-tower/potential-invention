'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Clock, CloudRain, Layers, LocateFixed, Minus, Plus, RefreshCw, Wind } from 'lucide-react'
import { ForecastData, WeatherData } from '@/types/weather'
import { WeatherSearch } from '@/components/WeatherSearch'
import { WeatherGlyph } from '@/components/WeatherGlyph'
import {
  cityDate,
  conditionTitle,
  editorialHeadline,
  formatClock,
  latLonToWorld,
  msToKmh,
  nextPrecip,
  nextShowerCopy,
  rainRateInHr,
  toDisplayTemp,
  Unit,
  windCompass,
} from '@/lib/atmos'

interface WeatherMapProps {
  weatherData: WeatherData
  forecastData: ForecastData | null
  unit: Unit
  loading: boolean
  onSearch: (location: string) => void
  onRefresh: () => void
}

const TILE = 256
const GRID = 5
const HALF = Math.floor(GRID / 2)

function AtmosMark() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 20 16" className="h-4 w-5 text-ink" aria-hidden>
        <circle cx="3.2" cy="8" r="1.15" fill="currentColor" />
        <path
          d="M6.2 5.1a5 5 0 0 1 0 5.8M9.4 3.1a8 8 0 0 1 0 9.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[12px] font-medium tracking-[0.28em] text-ink">ATMOS</span>
    </span>
  )
}

export function WeatherMap({
  weatherData,
  forecastData,
  unit,
  loading,
  onSearch,
  onRefresh,
}: WeatherMapProps) {
  const [zoom, setZoom] = useState(9)
  const [showLayer, setShowLayer] = useState(true)
  const [radarHost, setRadarHost] = useState<string | null>(null)
  const [radarPath, setRadarPath] = useState<string | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState({ w: 360, h: 280 })

  const { lat, lon } = weatherData.coord
  const world = latLonToWorld(lat, lon, zoom)
  const tileX = Math.floor(world.x)
  const tileY = Math.floor(world.y)
  const fracX = world.x - tileX
  const fracY = world.y - tileY

  useEffect(() => {
    const node = frameRef.current
    if (!node) return
    const measure = () => setFrame({ w: node.clientWidth, h: node.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const last = data?.radar?.past?.at(-1)
        if (last?.path) {
          setRadarHost(data.host || 'https://tilecache.rainviewer.com')
          setRadarPath(last.path)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRadarHost(null)
          setRadarPath(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [weatherData.dt])

  const tiles = useMemo(() => {
    const cells = []
    for (let dy = -HALF; dy <= HALF; dy += 1) {
      for (let dx = -HALF; dx <= HALF; dx += 1) {
        cells.push({ x: tileX + dx, y: tileY + dy, dx, dy })
      }
    }
    return cells
  }, [tileX, tileY])

  const translateX = frame.w / 2 - (HALF + fracX) * TILE
  const translateY = frame.h / 2 - (HALF + fracY) * TILE
  const owmKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
  const rainRate = rainRateInHr(weatherData)
  const next = nextPrecip(forecastData, weatherData.dt)
  const nextTime = next ? formatClock(cityDate(weatherData.timezone, next.dt)) : null
  const markerLeft = Math.min(rainRate / 0.25, 1) * 100

  const blobs = useMemo(() => {
    const intensity = Math.min(Math.max(rainRate / 0.12, next ? 0.45 : 0.12), 1)
    const seed = Math.abs(Math.sin(lat * 12.99 + lon * 78.23))
    return [
      { x: 22, y: 38, r: 78, o: 0.28 * intensity },
      { x: 38, y: 30, r: 62, o: 0.34 * intensity },
      { x: 18, y: 58, r: 54, o: 0.22 * intensity },
      { x: 48 + seed * 10, y: 48, r: 70, o: 0.18 * intensity },
    ]
  }, [lat, lon, rainRate, next])

  return (
    <section className="flex h-full flex-col">
      <header className="mb-8 flex items-center justify-between gap-3">
        <AtmosMark />
        <WeatherSearch
          currentName={weatherData.name}
          onSearch={onSearch}
          loading={loading}
          variant="pill"
        />
      </header>

      <p className="atmos-label mb-3">Precipitation / live composite</p>
      <h2 className="font-serif-display mb-7 text-[34px] leading-[1.12] tracking-[-0.02em] text-ink sm:text-[40px]">
        {editorialHeadline(weatherData.weather[0].main, weatherData.weather[0].description)}
      </h2>

      <div className="relative mb-6 grid grid-cols-[1fr_auto] gap-2 bg-paper-2/70 p-3">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-[10px] tracking-[0.18em] text-ink-muted">
            <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
            Precipitation layer
          </div>
          <div ref={frameRef} className="atmos-map-grid relative h-[280px] overflow-hidden bg-[#efece6] sm:h-[320px]">
          <div
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: GRID * TILE,
              height: GRID * TILE,
              transform: `translate(${translateX}px, ${translateY}px)`,
            }}
          >
            {tiles.map((tile) => (
              <img
                key={`base-${tile.x}-${tile.y}`}
                src={`https://a.basemaps.cartocdn.com/light_nolabels/${zoom}/${tile.x}/${tile.y}@2x.png`}
                alt=""
                width={TILE}
                height={TILE}
                className="absolute grayscale contrast-[0.92] brightness-[1.04]"
                style={{ left: (tile.dx + HALF) * TILE, top: (tile.dy + HALF) * TILE }}
                draggable={false}
              />
            ))}
            {showLayer &&
              tiles.map((tile) => {
                const src = radarPath
                  ? `${radarHost}${radarPath}/256/${zoom}/${tile.x}/${tile.y}/4/1_1.png`
                  : `https://tile.openweathermap.org/map/precipitation_new/${zoom}/${tile.x}/${tile.y}.png?appid=${owmKey}`
                return (
                  <img
                    key={`radar-${tile.x}-${tile.y}`}
                    src={src}
                    alt=""
                    width={TILE}
                    height={TILE}
                    className="absolute opacity-70 mix-blend-multiply grayscale contrast-125"
                    style={{ left: (tile.dx + HALF) * TILE, top: (tile.dy + HALF) * TILE }}
                    draggable={false}
                  />
                )
              })}
          </div>

          {showLayer && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <filter id="precip-blob" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="16" />
                </filter>
              </defs>
              {blobs.map((blob, i) => (
                <circle
                  key={i}
                  cx={`${blob.x}%`}
                  cy={`${blob.y}%`}
                  r={blob.r}
                  fill={`rgba(80,80,76,${blob.o})`}
                  filter="url(#precip-blob)"
                />
              ))}
            </svg>
          )}

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
            <LocateFixed className="mx-auto h-4 w-4 text-ink" strokeWidth={1.6} />
            <span className="mt-1 block text-[9px] tracking-[0.16em] text-ink/70">
              {weatherData.name.toUpperCase()}
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-3 right-3 text-[9px] tracking-[0.2em] text-ink-muted">
            <span className="block text-center">N</span>
            <span className="block text-center leading-none">↑</span>
          </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pt-8">
          <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(z + 1, 12))}>
            <Plus className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(z - 1, 6))}>
            <Minus className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn
            label={showLayer ? 'Hide precipitation' : 'Show precipitation'}
            onClick={() => setShowLayer((v) => !v)}
            active={showLayer}
          >
            <Layers className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Refresh" onClick={onRefresh}>
            <RefreshCw className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-end justify-between">
          <span className="atmos-label">Rain rate</span>
          <span className="atmos-label">In / hr</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-paper-3">
          <div className="h-full w-full bg-gradient-to-r from-[#d8d6d1] via-[#8d8c87] to-[#2f2f2c]" />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-ink bg-snow"
            style={{ left: `calc(${markerLeft}% - 6px)` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-ink-muted">
          <span>0.01</span>
          <span>0.05</span>
          <span>0.10</span>
          <span>0.25+</span>
        </div>
        <p className="mt-2 text-right text-[10px] text-ink-faint">Composite reflectivity - illustrative</p>
      </div>

      <div className="border-t border-line pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="atmos-label">At your point</h3>
          <Clock className="h-4 w-4 text-ink-faint" strokeWidth={1.5} />
        </div>

        <div className="grid grid-cols-[1fr_auto] items-start gap-6">
          <div>
            <div className="flex items-start gap-3">
              <div className="flex items-start">
                <span className="text-[64px] font-light leading-none tracking-tight">
                  {toDisplayTemp(weatherData.main.temp, unit)}
                </span>
                <span className="mt-1 text-sm">°{unit}</span>
              </div>
              <WeatherGlyph
                main={weatherData.weather[0].main}
                description={weatherData.weather[0].description}
                className="mt-2 h-10 w-10 text-ink-soft"
              />
            </div>
            <p className="mt-3 text-[15px] text-ink">
              {conditionTitle(weatherData.weather[0].description)}
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              Feels like {toDisplayTemp(weatherData.main.feels_like, unit)}° · High{' '}
              {toDisplayTemp(weatherData.main.temp_max, unit)}° / Low{' '}
              {toDisplayTemp(weatherData.main.temp_min, unit)}°
            </p>
          </div>

          <div>
            <p className="atmos-label mb-3">Conditions nearby</p>
            <div className="space-y-2 text-[13px]">
              <p className="flex items-center justify-between gap-6 text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <CloudRain className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Precipitation
                </span>
                <span className="text-ink">{rainRate.toFixed(2)} in/hr</span>
              </p>
              <p className="flex items-center justify-between gap-6 text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <Wind className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Wind
                </span>
                <span className="text-ink">
                  {msToKmh(weatherData.wind.speed)} km/h {windCompass(weatherData.wind.deg)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 border-l-2 border-ink pl-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="atmos-label">Next shower</h4>
          <span className="text-[12px] text-ink-muted">{nextTime ? `~ ${nextTime}` : 'None due'}</span>
        </div>
        <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-ink-soft">
          {nextShowerCopy(weatherData, next)}
        </p>
      </div>
    </section>
  )
}

function IconBtn({
  children,
  onClick,
  label,
  active = false,
}: {
  children: ReactNode
  onClick: () => void
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md border bg-snow text-ink transition hover:bg-paper-2 ${
        active ? 'border-ink/40' : 'border-line'
      }`}
    >
      {children}
    </button>
  )
}

