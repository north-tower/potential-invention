'use client'

import { AirQualityData } from '@/types/weather'
import { aqiBarFraction, aqiInfo } from '@/lib/atmos'
import { formatPollutantValue, POLLUTANT_SPECS } from '@/lib/pollutants'
import { Activity, Circle } from 'lucide-react'

interface AirQualityProps {
  data: AirQualityData
}

export function AirQuality({ data }: AirQualityProps) {
  const reading = data.list[0]
  if (!reading) return null

  const aqi = reading.main.aqi
  const info = aqiInfo(aqi)
  const barWidth = aqiBarFraction(aqi) * 100

  return (
    <section className="rounded-atmos border border-line bg-snow px-5 py-5 sm:px-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="atmos-label mb-2">Air quality</h3>
          <p className="text-[22px] font-light tracking-tight text-ink">{info.level}</p>
          <p className="mt-1 max-w-[36ch] text-[13px] leading-relaxed text-ink-muted">{info.description}</p>
        </div>
        <div className="text-right">
          <span className="text-[40px] font-light leading-none text-ink">{aqi}</span>
          <p className="atmos-label mt-1">AQI index</p>
        </div>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-paper-3">
        <div className="h-full rounded-full bg-ink/75 transition-all" style={{ width: `${barWidth}%` }} />
      </div>

      <h4 className="atmos-label mb-3">Pollutants</h4>
      <ul className="grid gap-2 sm:grid-cols-2">
        {POLLUTANT_SPECS.map((pollutant) => {
          const value = reading.components[pollutant.key]
          const fillPct = Math.min((value / pollutant.scale) * 100, 100)
          const goodTick = (pollutant.thresholds.good / pollutant.scale) * 100
          const fairTick = (pollutant.thresholds.fair / pollutant.scale) * 100
          const valueLabel = formatPollutantValue(value, pollutant.key)
          const band =
            value <= pollutant.thresholds.good
              ? 'good'
              : value <= pollutant.thresholds.fair
                ? 'fair'
                : 'poor'
          return (
            <li
              key={pollutant.key}
              className="rounded-xl border border-line/80 bg-paper px-3 py-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2 text-[12px]">
                <span className="inline-flex items-center gap-1.5 text-ink-soft">
                  <Circle className="h-3 w-3" strokeWidth={1.5} />
                  {pollutant.name}
                </span>
                <span className="tabular-nums text-ink">
                  {value.toFixed(1)}
                  <span className="text-ink-muted"> {pollutant.unit}</span>
                </span>
              </div>
              <div
                className="relative h-1 overflow-hidden rounded-full bg-paper-3"
                role="meter"
                aria-label={`${pollutant.name}: ${valueLabel}, air quality ${band} on local scale`}
                aria-valuemin={0}
                aria-valuemax={pollutant.scale}
                aria-valuenow={value}
                aria-valuetext={valueLabel}
              >
                <span
                  className="pointer-events-none absolute top-0 z-[1] h-full w-px bg-ink/15"
                  style={{ left: `${goodTick}%` }}
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute top-0 z-[1] h-full w-px bg-ink/15"
                  style={{ left: `${fairTick}%` }}
                  aria-hidden
                />
                <div
                  className="relative z-0 h-full rounded-full bg-ink/50"
                  style={{
                    width: value > 0 ? `max(${fillPct}%, 2px)` : '0',
                  }}
                />
              </div>
              <p className="sr-only">
                {pollutant.name} {valueLabel}, within the {band} range for this pollutant
              </p>
            </li>
          )
        })}
      </ul>

      <div className="mt-5 flex items-start gap-3 border-t border-line pt-4">
        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
        <p className="text-[12px] leading-relaxed text-ink-muted">
          OpenWeather air-quality index for this coordinate. Values are indicative; use local advisories
          when air quality is poor.
        </p>
      </div>
    </section>
  )
}
