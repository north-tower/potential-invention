import { glyphKind, GlyphKind } from '@/lib/atmos'
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Snowflake, Sun } from 'lucide-react'

const icons: Record<GlyphKind, typeof Cloud> = {
  clear: Sun,
  partly: CloudSun,
  cloud: Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  storm: CloudLightning,
  snow: Snowflake,
  fog: CloudFog,
}

export function WeatherGlyph({
  main,
  description = '',
  icon = '',
  className = 'h-6 w-6',
}: {
  main: string
  description?: string
  icon?: string
  className?: string
}) {
  const Icon = icons[glyphKind(main, description, icon)]
  return <Icon className={className} strokeWidth={1.4} aria-hidden />
}
