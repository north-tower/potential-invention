import { describe, expect, it } from 'vitest'
import type { ForecastItem, WeatherData } from '@/types/weather'
import {
  cloudAdjustedUv,
  headlineFor,
  isRainingNow,
  rainRateLegendFraction,
  showerPanel,
  todayHiLo,
  uvBand,
} from '@/lib/atmos'
import { sampleForecast } from '@/lib/sampleWeather'

const baseNow = 1_700_000_000

function current(partial: Partial<WeatherData> & Pick<WeatherData, 'weather'>): WeatherData {
  return {
    id: 1,
    name: 'Test',
    country: 'US',
    coord: { lat: 0, lon: 0 },
    main: {
      temp: 18,
      feels_like: 17,
      temp_min: 12,
      temp_max: 22,
      pressure: 1013,
      humidity: 60,
    },
    wind: { speed: 3, deg: 180 },
    clouds: { all: 25 },
    visibility: 10_000,
    sys: { country: 'US', sunrise: baseNow, sunset: baseNow + 40_000 },
    timezone: 0,
    dt: baseNow,
    ...partial,
  }
}

function hourItem(dt: number, pop: number, rain3h?: number): ForecastItem {
  return {
    dt,
    main: {
      temp: 17,
      feels_like: 16,
      temp_min: 15,
      temp_max: 18,
      pressure: 1013,
      humidity: 70,
    },
    weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
    wind: { speed: 3, deg: 200 },
    clouds: { all: 80 },
    pop,
    rain: rain3h != null ? { '3h': rain3h } : undefined,
    dt_txt: '',
  }
}

describe('headlineFor', () => {
  it('uses a calm line when conditions are dry', () => {
    const cur = current({
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    })
    expect(headlineFor(cur, [])).toBe('Clear, for the hour.')
  })

  it('signals approaching rain when not raining yet', () => {
    const cur = current({
      weather: [{ id: 801, main: 'Clouds', description: 'broken clouds', icon: '04d' }],
    })
    const hourly = [hourItem(baseNow + 7200, 0.5, 0.4)]
    expect(headlineFor(cur, hourly)).toBe('Rain, in its approach.')
  })

  it('signals easing soon when rain is active and clears within a few hours', () => {
    const cur = current({
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
      rain: { '1h': 0.8 },
    })
    const hourly = [
      hourItem(baseNow + 3600, 0.4, 0.2),
      hourItem(baseNow + 7200, 0.05, 0),
    ]
    expect(headlineFor(cur, hourly)).toBe('Rain, easing soon.')
  })

  it('signals settled rain when showers persist', () => {
    const cur = current({
      weather: [{ id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' }],
      rain: { '1h': 2.1 },
    })
    const hourly = [
      hourItem(baseNow + 3600, 0.6, 1.2),
      hourItem(baseNow + 7200, 0.55, 1.0),
      hourItem(baseNow + 10_800, 0.5, 0.8),
    ]
    expect(headlineFor(cur, hourly)).toBe('Rain, settled in.')
  })
})

describe('showerPanel', () => {
  it('does not show a next-shower time while it is already raining', () => {
    const cur = current({
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
      rain: { '1h': 1.0 },
    })
    const panel = showerPanel(cur, [hourItem(baseNow + 3600, 0.45, 0.3)])
    expect(panel.title).not.toBe('Next shower')
    expect(panel.timeNote).not.toMatch(/^~\s/)
  })

  it('shows next shower timing when dry', () => {
    const cur = current({
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
    })
    const panel = showerPanel(cur, [hourItem(baseNow + 7200, 0.5, 0.6)])
    expect(panel.title).toBe('Next shower')
    expect(panel.timeNote).toMatch(/^~\s/)
  })
})

describe('isRainingNow', () => {
  it('detects active precipitation from rain totals', () => {
    expect(isRainingNow(current({ weather: [{ id: 500, main: 'Rain', description: '', icon: '10d' }], rain: { '1h': 0.2 } }))).toBe(true)
    expect(isRainingNow(current({ weather: [{ id: 800, main: 'Clear', description: '', icon: '01d' }] }))).toBe(false)
  })
})

describe('rainRateLegendFraction', () => {
  it('maps log-scale endpoints', () => {
    expect(rainRateLegendFraction(0)).toBe(0)
    expect(rainRateLegendFraction(0.01)).toBeCloseTo(0, 5)
    expect(rainRateLegendFraction(0.25)).toBe(1)
    expect(rainRateLegendFraction(0.05)).toBeCloseTo(0.5, 2)
  })
})

describe('cloudAdjustedUv', () => {
  it('scales UV down with cloud cover and keeps band in sync', () => {
    const adjusted = cloudAdjustedUv(13.4, 90)
    expect(adjusted).toBeLessThan(13.4)
    expect(uvBand(adjusted).label).toBe(uvBand(Math.floor(adjusted * 10) / 10).label)
    expect(adjusted).toBeCloseTo(13.4 * (1 - 0.75 * 0.9 ** 3.4), 1)
  })
})

describe('todayHiLo', () => {
  it('matches the first daily row min and max', () => {
    const cur = sampleForecast.city
      ? current({
          weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
          timezone: sampleForecast.city.timezone,
          dt: sampleForecast.list[0].dt - 100,
        })
      : current({ weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }] })

    const hiLo = todayHiLo(
      { ...cur, timezone: sampleForecast.city.timezone, dt: sampleForecast.list[0].dt },
      sampleForecast
    )
    expect(hiLo).not.toBeNull()
    const temps = sampleForecast.list.map((i) => i.main.temp)
    expect(hiLo!.min).toBe(Math.min(...temps.slice(0, 6)))
    expect(hiLo!.max).toBe(Math.max(...temps.slice(0, 6)))
  })
})
