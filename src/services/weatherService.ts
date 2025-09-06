import axios from 'axios'
import { WeatherData, ForecastData, AirQualityData, AlertData, LocationData, UVIndexData } from '@/types/weather'

export class WeatherService {
  private apiKey: string
  private baseUrl = 'https://api.openweathermap.org/data/2.5'
  private oneCallUrl = 'https://api.openweathermap.org/data/3.0/onecall'
  private geoUrl = 'https://api.openweathermap.org/geo/1.0'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('OpenWeather API key is not configured')
    }
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Location "${location}" not found`)
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key')
        }
        throw new Error(`Weather service error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to fetch weather data')
    }
  }

  async getForecast(location: string): Promise<ForecastData> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Forecast service error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to fetch forecast data')
    }
  }

  async getAirQuality(location: string): Promise<AirQualityData | null> {
    try {
      // First get coordinates
      const coords = await this.getCoordinates(location)
      
      const response = await axios.get(`${this.baseUrl}/air_pollution`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey
        }
      })
      return response.data
    } catch (error) {
      console.warn('Air quality data not available:', error)
      return null
    }
  }

  async getWeatherAlerts(location: string): Promise<AlertData[]> {
    try {
      // First get coordinates
      const coords = await this.getCoordinates(location)
      
      // Try One Call API 3.0 first (requires paid subscription)
      try {
        const response = await axios.get(`${this.oneCallUrl}`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: this.apiKey,
            exclude: 'minutely,hourly,daily'
          }
        })
        return response.data.alerts || []
      } catch (oneCallError) {
        // Fallback to 2.5 API (deprecated but still works for alerts)
        const response = await axios.get(`${this.baseUrl}/onecall`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: this.apiKey,
            exclude: 'minutely,hourly,daily'
          }
        })
        return response.data.alerts || []
      }
    } catch (error) {
      console.warn('Weather alerts not available (requires paid subscription):', error)
      return []
    }
  }

  async getUVIndex(location: string): Promise<UVIndexData | null> {
    try {
      const coords = await this.getCoordinates(location)
      
      const response = await axios.get(`${this.baseUrl}/uvi`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey
        }
      })
      return response.data
    } catch (error) {
      console.warn('UV index data not available:', error)
      return null
    }
  }

  async searchLocations(query: string): Promise<LocationData[]> {
    try {
      const response = await axios.get(`${this.geoUrl}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey
        }
      })
      return response.data
    } catch (error) {
      console.warn('Location search failed:', error)
      return []
    }
  }

  async getLocationFromCoords(lat: number, lon: number): Promise<string> {
    try {
      const response = await axios.get(`${this.geoUrl}/reverse`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      })
      const data = response.data[0]
      return `${data.name}, ${data.country}`
    } catch (error) {
      throw new Error('Failed to get location from coordinates')
    }
  }

  private async getCoordinates(location: string): Promise<{ lat: number; lon: number }> {
    try {
      const response = await axios.get(`${this.geoUrl}/direct`, {
        params: {
          q: location,
          limit: 1,
          appid: this.apiKey
        }
      })
      
      if (response.data.length === 0) {
        throw new Error(`Location "${location}" not found`)
      }
      
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Location service error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to get coordinates')
    }
  }

  getWeatherIconUrl(iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`
  }

  getWeatherBackground(weatherMain: string): string {
    const backgrounds = {
      'Clear': 'sunny-gradient',
      'Clouds': 'cloudy-gradient',
      'Rain': 'rainy-gradient',
      'Drizzle': 'rainy-gradient',
      'Thunderstorm': 'rainy-gradient',
      'Snow': 'snowy-gradient',
      'Mist': 'cloudy-gradient',
      'Fog': 'cloudy-gradient',
      'Haze': 'cloudy-gradient',
      'Dust': 'cloudy-gradient',
      'Sand': 'cloudy-gradient',
      'Ash': 'cloudy-gradient',
      'Squall': 'rainy-gradient',
      'Tornado': 'rainy-gradient'
    }
    
    return backgrounds[weatherMain as keyof typeof backgrounds] || 'weather-gradient'
  }

  getAirQualityIndex(aqi: number): { level: string; color: string; description: string } {
    const levels = [
      { level: 'Good', color: 'text-green-600', description: 'Air quality is satisfactory' },
      { level: 'Fair', color: 'text-yellow-600', description: 'Air quality is acceptable' },
      { level: 'Moderate', color: 'text-orange-600', description: 'Sensitive people may experience minor breathing discomfort' },
      { level: 'Poor', color: 'text-red-600', description: 'Everyone may begin to experience health effects' },
      { level: 'Very Poor', color: 'text-purple-600', description: 'Health warnings of emergency conditions' }
    ]
    
    return levels[Math.min(aqi - 1, 4)] || levels[0]
  }
}

