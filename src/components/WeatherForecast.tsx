'use client'

import { ForecastData, WeatherData } from '@/types/weather'
import { WeatherGlyph } from '@/components/WeatherGlyph'
import {
  cityDate,
  conditionTitle,
  dailySummaries,
  hourlySlots,
  toDisplayTemp,
  Unit,
} from '@/lib/atmos'

interface WeatherForecastProps {
  current: WeatherData
  data: ForecastData
  unit: Unit
  onUnitChange: (unit: Unit) => void
}

export function WeatherForecast({ current, data, unit, onUnitChange }: WeatherForecastProps) {
  const now = cityDate(current.timezone, current.dt)
  const hours = hourlySlots(current, data)
  const days = dailySummaries(data, now, current.timezone)
  const rangeMin = Math.min(...days.map((d) => d.min))
  const rangeMax = Math.max(...days.map((d) => d.max))
  const span = Math.max(rangeMax - rangeMin, 1)

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="atmos-label">The next hours</h3>
          <div className="flex items-center gap-0.5 text-[11px] tracking-[0.16em] text-ink-muted">
            <button
              type="button"
              onClick={() => onUnitChange('C')}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-md ${
                unit === 'C' ? 'text-ink' : 'hover:text-ink'
              }`}
              aria-pressed={unit === 'C'}
            >
              °C
            </button>
            <span className="text-ink-faint" aria-hidden>
              /
            </span>
            <button
              type="button"
              onClick={() => onUnitChange('F')}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-md ${
                unit === 'F' ? 'text-ink' : 'hover:text-ink'
              }`}
              aria-pressed={unit === 'F'}
            >
              °F
            </button>
          </div>
        </div>

        <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {hours.map((hour, index) => (
            <div
              key={hour.dt}
              className={`flex min-w-[64px] flex-col items-center rounded-[18px] px-2 py-3 ${
                index === 0 ? 'bg-paper-2' : ''
              }`}
            >
              <span className="mb-3 text-[11px] text-ink-muted">{hour.label}</span>
              <WeatherGlyph
                main={hour.main}
                description={hour.description}
                icon={hour.icon}
                className="h-6 w-6 text-ink-soft"
              />
              <span className="mt-3 text-[17px] tracking-tight text-ink">
                {toDisplayTemp(hour.temp, unit)}°
              </span>
              {hour.pop > 0.05 && (
                <span className="mt-1 text-[10px] text-ink-faint">{Math.round(hour.pop * 100)}%</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="atmos-label">A little further out</h3>
          <span className="atmos-label">5 days</span>
        </div>
        <ul className="divide-y divide-line/80">
          {days.map((day) => {
            const left = ((day.min - rangeMin) / span) * 100
            const width = ((day.max - day.min) / span) * 100
            return (
              <li
                key={day.label + day.date.toISOString()}
                className="grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-[42px_1fr_auto] sm:items-center sm:gap-3"
              >
                <span className="text-[15px] text-ink">{day.label}</span>
                <div className="flex min-w-0 items-center gap-3">
                  <WeatherGlyph
                    main={day.item.weather[0].main}
                    description={day.item.weather[0].description}
                    icon={day.item.weather[0].icon}
                    className="h-5 w-5 shrink-0 text-ink-soft"
                  />
                  <span className="hidden truncate text-[14px] text-ink-soft sm:inline">
                    {conditionTitle(day.item.weather[0].description)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="w-8 text-right text-[15px] text-ink sm:text-right">
                    {toDisplayTemp(day.max, unit)}°
                  </span>
                  <div className="relative h-[3px] w-16 overflow-hidden rounded-full bg-paper-3 sm:w-24">
                    <div
                      className="absolute top-0 h-full rounded-full bg-ink/80"
                      style={{ left: `${left}%`, width: `${Math.max(width, 12)}%` }}
                    />
                  </div>
                  <span className="w-8 text-[15px] text-ink-muted">
                    {toDisplayTemp(day.min, unit)}°
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
