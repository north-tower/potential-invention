import type { AirQualityData } from '@/types/weather'

/** OpenWeather air_pollution components are µg/m³; `scale` drives the bar fill toward a indicative ceiling. */
export const POLLUTANT_SPECS = [
  {
    key: 'pm2_5' as const,
    name: 'PM2.5',
    unit: 'µg/m³',
    scale: 75,
    thresholds: { good: 12, fair: 35.4 },
  },
  {
    key: 'pm10' as const,
    name: 'PM10',
    unit: 'µg/m³',
    scale: 150,
    thresholds: { good: 54, fair: 154 },
  },
  {
    key: 'no2' as const,
    name: 'NO₂',
    unit: 'µg/m³',
    scale: 200,
    thresholds: { good: 40, fair: 100 },
  },
  {
    key: 'o3' as const,
    name: 'O₃',
    unit: 'µg/m³',
    scale: 180,
    thresholds: { good: 60, fair: 100 },
  },
  {
    key: 'so2' as const,
    name: 'SO₂',
    unit: 'µg/m³',
    scale: 150,
    thresholds: { good: 20, fair: 80 },
  },
  {
    key: 'co' as const,
    name: 'CO',
    unit: 'µg/m³',
    scale: 10_000,
    thresholds: { good: 4_400, fair: 9_400 },
  },
] as const

export type PollutantKey = (typeof POLLUTANT_SPECS)[number]['key']

export function pollutantValue(
  components: AirQualityData['list'][0]['components'],
  key: PollutantKey
) {
  return components[key]
}

export function formatPollutantValue(value: number, key: PollutantKey) {
  const spec = POLLUTANT_SPECS.find((p) => p.key === key)!
  return `${value.toFixed(1)} ${spec.unit}`
}
