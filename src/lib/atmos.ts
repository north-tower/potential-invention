import { ForecastData, ForecastItem, WeatherData } from '@/types/weather'

export type Unit = 'C' | 'F'

export function cityDate(timezoneOffsetSeconds: number, unixSeconds?: number) {
  const utcMillis =
    (unixSeconds != null ? unixSeconds * 1000 : Date.now()) +
    new Date().getTimezoneOffset() * 60_000
  return new Date(utcMillis + timezoneOffsetSeconds * 1000)
}

export function formatClock(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatWeekday(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
}

export function formatDayShort(date: Date, now: Date) {
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (sameDay) return 'Today'
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function toDisplayTemp(celsius: number, unit: Unit) {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius
  return Math.round(value)
}

export function msToKmh(ms: number) {
  return Math.round(ms * 3.6)
}

export function mmToIn(mm: number) {
  return mm / 25.4
}

export function windCompass(degrees: number) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

export function formatHemisphere(lat: number, lon: number) {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lon).toFixed(2)}° ${ew}`
}

export function countryLabel(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

export function conditionTitle(description: string) {
  if (!description) return ''
  return description.charAt(0).toUpperCase() + description.slice(1)
}

const HOUR_SEC = 3600

export function isRainingNow(current: WeatherData) {
  const mm1h = current.rain?.['1h'] ?? 0
  const mm3h = current.rain?.['3h'] ?? 0
  if (mm1h > 0 || mm3h > 0) return true
  const main = current.weather[0]?.main.toLowerCase() ?? ''
  return main === 'rain' || main === 'drizzle' || main === 'thunderstorm'
}

function hourIsWet(item: ForecastItem) {
  const rainMm = item.rain?.['3h'] ?? 0
  return rainMm > 0.05 || (item.pop ?? 0) >= 0.35
}

function dryHeadline(main: string, description: string) {
  const key = main.toLowerCase()
  if (key === 'thunderstorm') return 'Storm, close at hand.'
  if (key === 'snow') return 'Snow, held light.'
  if (key === 'clear') return 'Clear, for the hour.'
  if (key === 'clouds') {
    if (description.includes('few') || description.includes('scattered')) {
      return 'Cloud, held light.'
    }
    return 'Cloud, in the lower air.'
  }
  if (key === 'mist' || key === 'fog' || key === 'haze') return 'Fog, held low.'
  return `${conditionTitle(description)}.`
}

export function headlineFor(current: WeatherData, hourly: ForecastItem[]) {
  const main = current.weather[0]?.main ?? ''
  const description = current.weather[0]?.description ?? ''
  const key = main.toLowerCase()

  if (isRainingNow(current)) {
    if (key === 'thunderstorm') return 'Storm, close at hand.'
    const within12h = hourly.filter(
      (item) => item.dt >= current.dt && item.dt <= current.dt + 12 * HOUR_SEC
    )
    const firstDry = within12h.find((item) => !hourIsWet(item))
    if (!firstDry) return 'Rain, settled in.'
    const hoursUntilDry = (firstDry.dt - current.dt) / HOUR_SEC
    if (hoursUntilDry <= 4) return 'Rain, easing soon.'
    return 'Rain, settled in.'
  }

  const upcoming = hourly.filter((item) => item.dt > current.dt)
  const rainAhead = upcoming.find((item) => hourIsWet(item))
  if (rainAhead && rainAhead.dt <= current.dt + 12 * HOUR_SEC) {
    if (key === 'rain' || key === 'drizzle') return 'Rain, in its approach.'
    if (key === 'snow') return 'Snow, in its approach.'
    if (key === 'thunderstorm') return 'Storm, close at hand.'
    return 'Rain, in its approach.'
  }

  return dryHeadline(main, description)
}

/** @deprecated Use headlineFor(current, forecast.list) */
export function editorialHeadline(main: string, description: string) {
  return dryHeadline(main, description)
}

export function rainRateInHr(data: WeatherData) {
  const mm = data.rain?.['1h'] ?? (data.rain?.['3h'] ? data.rain['3h'] / 3 : 0)
  return mmToIn(mm)
}

/** Rain-rate legend: log scale from 0.01 to 0.25 in/hr; labels are evenly spaced along the track. */
export const RAIN_RATE_LEGEND_MIN_IN = 0.01
export const RAIN_RATE_LEGEND_MAX_IN = 0.25
export const RAIN_RATE_LEGEND_STOPS = [0.01, 0.05, 0.1, 0.25] as const

export function rainRateLegendFraction(rateInHr: number): number {
  if (rateInHr <= 0) return 0
  if (rateInHr >= RAIN_RATE_LEGEND_MAX_IN) return 1
  const rate = Math.max(rateInHr, RAIN_RATE_LEGEND_MIN_IN)
  const logMin = Math.log10(RAIN_RATE_LEGEND_MIN_IN)
  const logMax = Math.log10(RAIN_RATE_LEGEND_MAX_IN)
  return (Math.log10(rate) - logMin) / (logMax - logMin)
}

export function nextPrecip(forecast: ForecastData | null, nowUnix: number) {
  if (!forecast) return null
  const upcoming = forecast.list.find((item) => {
    if (item.dt < nowUnix - 60 * 10) return false
    const raining = Boolean(item.rain?.['3h'] && item.rain['3h'] > 0.1)
    const likely = (item.pop ?? 0) >= 0.3
    return raining || likely
  })
  return upcoming ?? null
}

export type ShowerPanel = {
  title: string
  timeNote: string | null
  body: string
}

function forecastNext12h(current: WeatherData, hourly: ForecastItem[]) {
  return hourly.filter(
    (item) => item.dt > current.dt && item.dt <= current.dt + 12 * HOUR_SEC
  )
}

export function showerPanel(current: WeatherData, hourly: ForecastItem[]): ShowerPanel {
  const next12 = forecastNext12h(current, hourly)

  if (isRainingNow(current)) {
    const firstDry = next12.find((item) => !hourIsWet(item))
    const allWet = next12.length > 0 && next12.every(hourIsWet)

    if (!firstDry || allWet) {
      const through =
        next12.length > 0
          ? formatClock(cityDate(current.timezone, next12[next12.length - 1].dt))
          : null
      return {
        title: 'Rain continuing',
        timeNote: through ? `through ${through}` : null,
        body: through
          ? 'Precipitation stays in the picture through the next stretch of the day.'
          : 'No change in the next 12 hours.',
      }
    }

    const easingAt = formatClock(cityDate(current.timezone, firstDry.dt))
    return {
      title: 'Rain easing',
      timeNote: `around ${easingAt}`,
      body: 'Rates should taper as this band moves off. Brief pockets may linger.',
    }
  }

  const next = nextPrecip({ list: hourly } as ForecastData, current.dt)
  if (!next) {
    return {
      title: 'Next shower',
      timeNote: 'None due',
      body: 'No shower is showing in the next hours.',
    }
  }

  const nextTime = formatClock(cityDate(current.timezone, next.dt))
  const hours = Math.max(0, Math.round((next.dt - current.dt) / HOUR_SEC))
  let body = 'A band is still a way off. The next hours stay mostly dry.'
  if (hours <= 2) {
    body = 'A small band is drifting toward you. Expect a brief, passing shower.'
  } else if (hours <= 8) {
    body = 'Showers look likely later. Keep a window in mind.'
  }

  return {
    title: 'Next shower',
    timeNote: `~ ${nextTime}`,
    body,
  }
}

/** @deprecated Use showerPanel */
export function nextShowerCopy(current: WeatherData, next: ForecastItem | null) {
  return showerPanel(current, next ? [next] : []).body
}

export type GlyphKind =
  | 'clear'
  | 'partly'
  | 'cloud'
  | 'rain'
  | 'drizzle'
  | 'storm'
  | 'snow'
  | 'fog'

export function glyphKind(main: string, description = '', icon = ''): GlyphKind {
  const key = main.toLowerCase()
  const desc = description.toLowerCase()
  if (key === 'clear' || icon.startsWith('01')) return 'clear'
  if (key === 'thunderstorm') return 'storm'
  if (key === 'snow') return 'snow'
  if (key === 'drizzle') return 'drizzle'
  if (key === 'rain') return 'rain'
  if (key === 'mist' || key === 'fog' || key === 'haze' || key === 'smoke') return 'fog'
  if (desc.includes('few') || desc.includes('scattered') || desc.includes('broken') || icon.startsWith('02')) {
    return 'partly'
  }
  return 'cloud'
}

export function todayHiLo(current: WeatherData, forecast: ForecastData | null) {
  if (!forecast) return null
  const now = cityDate(current.timezone, current.dt)
  const days = dailySummaries(forecast, now, current.timezone)
  if (days.length === 0) return null
  return { min: days[0].min, max: days[0].max }
}

export function dailySummaries(forecast: ForecastData, now: Date, timezone: number) {
  const groups = new Map<string, ForecastItem[]>()
  for (const item of forecast.list) {
    const date = cityDate(timezone, item.dt)
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    const list = groups.get(key) ?? []
    list.push(item)
    groups.set(key, list)
  }

  return Array.from(groups.entries())
    .slice(0, 5)
    .map(([, items]) => {
      const temps = items.map((i) => i.main.temp)
      const midday =
        items.find((i) => {
          const hour = cityDate(timezone, i.dt).getHours()
          return hour >= 11 && hour <= 15
        }) ?? items[Math.floor(items.length / 2)]
      return {
        date: cityDate(timezone, items[0].dt),
        min: Math.min(...temps),
        max: Math.max(...temps),
        item: midday,
      }
    })
    .map((day) => ({
      ...day,
      label: formatDayShort(day.date, now),
    }))
}

export function hourlySlots(current: WeatherData, forecast: ForecastData | null) {
  const nowSlot = {
    dt: current.dt,
    label: 'Now',
    temp: current.main.temp,
    main: current.weather[0].main,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    pop: current.rain ? 0.4 : 0,
  }

  const upcoming = (forecast?.list ?? []).slice(0, 7).map((item) => ({
    dt: item.dt,
    label: cityDate(current.timezone, item.dt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    }),
    temp: item.main.temp,
    main: item.weather[0].main,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    pop: item.pop ?? 0,
  }))

  return [nowSlot, ...upcoming]
}

const AQI_LEVELS = [
  { level: 'Good', description: 'Air quality is satisfactory' },
  { level: 'Fair', description: 'Air quality is acceptable for most people' },
  { level: 'Moderate', description: 'Sensitive groups may notice mild effects' },
  { level: 'Poor', description: 'Everyone may begin to notice health effects' },
  { level: 'Very poor', description: 'Consider limiting time outdoors' },
] as const

export function aqiInfo(aqi: number) {
  return AQI_LEVELS[Math.min(Math.max(aqi, 1), 5) - 1] ?? AQI_LEVELS[0]
}

export function aqiBarFraction(aqi: number) {
  return Math.min(Math.max(aqi, 1), 5) / 5
}

export function cloudAdjustedUv(clearSkyUvi: number, cloudCoverPercent: number) {
  const clouds = Math.min(Math.max(cloudCoverPercent, 0), 100) / 100
  return clearSkyUvi * (1 - 0.75 * clouds ** 3.4)
}

export function uvBand(value: number) {
  if (value < 3) return { label: 'Low', note: 'Minimal protection needed' }
  if (value < 6) return { label: 'Moderate', note: 'Seek shade around midday' }
  if (value < 8) return { label: 'High', note: 'Protection recommended' }
  if (value < 11) return { label: 'Very high', note: 'Extra protection advised' }
  return { label: 'Extreme', note: 'Avoid midday sun if possible' }
}

export function latLonToWorld(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom
  const x = ((lon + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  return { x, y }
}
