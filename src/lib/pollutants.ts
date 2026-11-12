import type { AirQualityData } from '@/types/weather'

/** OpenWeather air_pollution components are µg/m³; `scale` drives the bar fill toward a indicative ceiling. */
export const POLLUTANT_SPECS = [
  { key: 'pm2_5' as const, name: 'PM2.5', unit: 'µg/m³', scale: 35 },
  { key: 'pm10' as const, name: 'PM10', unit: 'µg/m³', scale: 50 },
  { key: 'no2' as const, name: 'NO₂', unit: 'µg/m³', scale: 200 },
  { key: 'o3' as const, name: 'O₃', unit: 'µg/m³', scale: 180 },
  { key: 'so2' as const, name: 'SO₂', unit: 'µg/m³', scale: 150 },
  { key: 'co' as const, name: 'CO', unit: 'µg/m³', scale: 10_000 },
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
