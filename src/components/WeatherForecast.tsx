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

export function WeatherForecastHourly({ current, data, unit, onUnitChange }: WeatherForecastProps) {
  const hours = hourlySlots(current, data)

  return (
    <section>
      <div className="bento-card-header mb-4">
        <h3 className="atmos-label">The next hours</h3>
        <div className="atmos-unit-toggle" role="group" aria-label="Temperature unit">
          <button type="button" onClick={() => onUnitChange('C')} aria-pressed={unit === 'C'}>
            °C
          </button>
          <button type="button" onClick={() => onUnitChange('F')} aria-pressed={unit === 'F'}>
            °F
          </button>
        </div>
      </div>

      <div className="-mx-1 hourly-strip">
        {hours.map((hour, index) => (
          <div
            key={hour.dt}
            className={`hourly-strip__item flex flex-col items-center rounded-[18px] px-2 py-3 ${
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
  )
}

export function WeatherForecastDaily({ current, data, unit }: Omit<WeatherForecastProps, 'onUnitChange'>) {
  const now = cityDate(current.timezone, current.dt)
  const days = dailySummaries(data, now, current.timezone)
  const weekMin = Math.min(...days.map((d) => d.min))
  const weekMax = Math.max(...days.map((d) => d.max))
  const weekSpan = Math.max(weekMax - weekMin, 1)

  return (
    <section>
      <div className="bento-card-header mb-4">
        <h3 className="atmos-label">A little further out</h3>
        <span className="atmos-label">5 days</span>
      </div>
      <ul className="divide-y divide-line/80">
        <li
          className="mb-1 hidden grid-cols-[3.5rem_minmax(0,1fr)_2.5rem_minmax(0,min(280px,100%))_2.5rem] items-center gap-x-3 py-1 sm:grid"
          aria-hidden
        >
          <span />
          <span />
          <span className="text-right text-[10px] uppercase tracking-[0.12em] text-ink-faint">Rain</span>
          <span />
          <span />
        </li>
        {days.map((day) => {
          const left = ((day.min - weekMin) / weekSpan) * 100
          const width = ((day.max - day.min) / weekSpan) * 100
          const popPct = Math.round((day.item.pop ?? 0) * 100)
          return (
            <li
              key={day.label + day.date.toISOString()}
              className="grid grid-cols-[auto_minmax(0,1fr)_2.25rem] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[3.5rem_minmax(0,1fr)_2.5rem_minmax(0,min(280px,100%))_2.5rem]"
            >
              <span className="text-[15px] text-ink">{day.label}</span>
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <WeatherGlyph
                  main={day.item.weather[0].main}
                  description={day.item.weather[0].description}
                  icon={day.item.weather[0].icon}
                  className="h-5 w-5 shrink-0 text-ink-soft"
                />
                <span className="min-w-0 truncate text-[13px] text-ink-soft sm:text-[14px]">
                  {conditionTitle(day.item.weather[0].description)}
                </span>
              </div>
              <span
                className="text-right text-[12px] tabular-nums text-ink-muted sm:text-[13px]"
                title="Probability of precipitation"
              >
                {popPct}%
              </span>
              <DailyTempRange
                left={left}
                width={width}
                pointDay={day.min === day.max}
                maxTemp={toDisplayTemp(day.max, unit)}
                minTemp={toDisplayTemp(day.min, unit)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function DailyTempRange({
  left,
  width,
  pointDay,
  maxTemp,
  minTemp,
}: {
  left: number
  width: number
  pointDay: boolean
  maxTemp: number
  minTemp: number
}) {
  return (
    <div className="col-span-full flex items-center justify-between gap-3 sm:col-span-1 sm:justify-end">
      <span className="w-8 text-right text-[15px] text-ink sm:text-right">{maxTemp}°</span>
      <div className="relative h-[3px] w-full max-w-[280px] overflow-hidden rounded-full bg-paper-3">
        <div
          className="absolute top-0 h-full rounded-full bg-ink/80"
          style={
            pointDay
              ? { left: `calc(${left}% - 1px)`, width: 2 }
              : { left: `${left}%`, width: `${width}%` }
          }
        />
      </div>
      <span className="w-8 text-[15px] text-ink-muted">{minTemp}°</span>
    </div>
  )
}

/** @deprecated Use WeatherForecastHourly / WeatherForecastDaily in the page grid */
export function WeatherForecast(props: WeatherForecastProps) {
  return (
    <div className="space-y-10">
      <WeatherForecastHourly {...props} />
      <WeatherForecastDaily current={props.current} data={props.data} unit={props.unit} />
    </div>
  )
}
