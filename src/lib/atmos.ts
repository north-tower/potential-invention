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

export function editorialHeadline(main: string, description: string) {
  const key = main.toLowerCase()
  if (key === 'rain' || key === 'drizzle') return 'Rain, in its approach.'
  if (key === 'thunderstorm') return 'Storm, close at hand.'
  if (key === 'snow') return 'Snow, in its approach.'
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

export function rainRateInHr(data: WeatherData) {
  const mm = data.rain?.['1h'] ?? (data.rain?.['3h'] ? data.rain['3h'] / 3 : 0)
  return mmToIn(mm)
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

export function nextShowerCopy(current: WeatherData, next: ForecastItem | null) {
  const rainingNow = Boolean(
    (current.rain?.['1h'] && current.rain['1h'] > 0) ||
      (current.rain?.['3h'] && current.rain['3h'] > 0)
  )
  if (rainingNow) {
    return 'A small band is moving across the area. Expect a brief, passing shower.'
  }
  if (!next) {
    return 'No shower is showing in the next hours.'
  }
  const hours = Math.max(0, Math.round((next.dt - current.dt) / 3600))
  if (hours <= 2) {
    return 'A small band is drifting toward you. Expect a brief, passing shower.'
  }
  if (hours <= 8) {
    return 'Showers look likely later. Keep a window in mind.'
  }
  return 'A band is still a way off. The next hours stay mostly dry.'
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
