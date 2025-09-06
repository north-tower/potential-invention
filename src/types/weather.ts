export interface WeatherData {
  id: number
  name: string
  country: string
  coord: {
    lat: number
    lon: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  rain?: {
    '1h'?: number
    '3h'?: number
  }
  snow?: {
    '1h'?: number
    '3h'?: number
  }
  visibility: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  dt: number
}

export interface ForecastData {
  city: {
    id: number
    name: string
    country: string
    coord: {
      lat: number
      lon: number
    }
    timezone: number
  }
  list: ForecastItem[]
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  rain?: {
    '3h'?: number
  }
  snow?: {
    '3h'?: number
  }
  dt_txt: string
}

export interface AirQualityData {
  coord: {
    lat: number
    lon: number
  }
  list: {
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
    dt: number
  }[]
}

export interface AlertData {
  sender_name: string
  event: string
  start: number
  end: number
  description: string
  tags: string[]
}

export interface LocationData {
  name: string
  local_names?: {
    [key: string]: string
  }
  lat: number
  lon: number
  country: string
  state?: string
}

export interface UVIndexData {
  lat: number
  lon: number
  date_iso: string
  date: number
  value: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherStats {
  temperature: {
    current: number
    feels_like: number
    min: number
    max: number
  }
  wind: {
    speed: number
    direction: number
    gust?: number
  }
  humidity: number
  pressure: number
  visibility: number
  uv_index?: number
  air_quality?: number
}

