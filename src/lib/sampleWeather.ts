import { ForecastData, WeatherData } from '@/types/weather'

export const sampleWeather: WeatherData = {
  id: 5391959,
  name: 'San Francisco',
  country: 'US',
  coord: { lat: 37.7749, lon: -122.4194 },
  weather: [{ id: 701, main: 'Clouds', description: 'low cloud, light drizzle', icon: '04d' }],
  main: {
    temp: 16,
    feels_like: 14,
    temp_min: 12,
    temp_max: 18,
    pressure: 1016,
    humidity: 82,
  },
  wind: { speed: 3.9, deg: 315 },
  clouds: { all: 90 },
  rain: { '1h': 1.02 },
  visibility: 8000,
  sys: { country: 'US', sunrise: 1731160800, sunset: 1731198000 },
  timezone: -28800,
  dt: Math.floor(Date.now() / 1000),
}

const hour = 3600
const now = Math.floor(Date.now() / 1000)

export const sampleForecast: ForecastData = {
  city: {
    id: 5391959,
    name: 'San Francisco',
    country: 'US',
    coord: { lat: 37.7749, lon: -122.4194 },
    timezone: -28800,
  },
  list: [
    { dt: now + hour, main: { temp: 17, feels_like: 15, temp_min: 14, temp_max: 17, pressure: 1016, humidity: 80 }, weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }], wind: { speed: 3.2, deg: 300 }, clouds: { all: 40 }, pop: 0.1, dt_txt: '' },
    { dt: now + hour * 2, main: { temp: 18, feels_like: 16, temp_min: 15, temp_max: 18, pressure: 1016, humidity: 74 }, weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }], wind: { speed: 3.1, deg: 300 }, clouds: { all: 30 }, pop: 0.1, dt_txt: '' },
    { dt: now + hour * 3, main: { temp: 18, feels_like: 16, temp_min: 15, temp_max: 18, pressure: 1015, humidity: 72 }, weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }], wind: { speed: 2.8, deg: 290 }, clouds: { all: 10 }, pop: 0.05, dt_txt: '' },
    { dt: now + hour * 4, main: { temp: 17, feels_like: 15, temp_min: 14, temp_max: 17, pressure: 1015, humidity: 76 }, weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }], wind: { speed: 3.4, deg: 280 }, clouds: { all: 50 }, pop: 0.15, dt_txt: '' },
    { dt: now + hour * 5, main: { temp: 16, feels_like: 14, temp_min: 13, temp_max: 16, pressure: 1014, humidity: 82 }, weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }], wind: { speed: 4.1, deg: 270 }, clouds: { all: 80 }, rain: { '3h': 1.2 }, pop: 0.3, dt_txt: '' },
    { dt: now + hour * 6, main: { temp: 15, feels_like: 13, temp_min: 12, temp_max: 15, pressure: 1014, humidity: 86 }, weather: [{ id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' }], wind: { speed: 4.4, deg: 260 }, clouds: { all: 90 }, rain: { '3h': 2.4 }, pop: 0.35, dt_txt: '' },
    { dt: now + hour * 24, main: { temp: 17, feels_like: 15, temp_min: 11, temp_max: 19, pressure: 1016, humidity: 70 }, weather: [{ id: 801, main: 'Clouds', description: 'clearing', icon: '02d' }], wind: { speed: 3.0, deg: 300 }, clouds: { all: 40 }, pop: 0.1, dt_txt: '' },
    { dt: now + hour * 48, main: { temp: 15, feels_like: 13, temp_min: 10, temp_max: 16, pressure: 1012, humidity: 84 }, weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }], wind: { speed: 4.8, deg: 220 }, clouds: { all: 85 }, rain: { '3h': 2.1 }, pop: 0.55, dt_txt: '' },
    { dt: now + hour * 72, main: { temp: 16, feels_like: 14, temp_min: 11, temp_max: 17, pressure: 1015, humidity: 72 }, weather: [{ id: 803, main: 'Clouds', description: 'cloudy', icon: '04d' }], wind: { speed: 3.3, deg: 250 }, clouds: { all: 70 }, pop: 0.2, dt_txt: '' },
    { dt: now + hour * 96, main: { temp: 18, feels_like: 16, temp_min: 12, temp_max: 20, pressure: 1017, humidity: 64 }, weather: [{ id: 801, main: 'Clouds', description: 'partly cloudy', icon: '02d' }], wind: { speed: 2.6, deg: 280 }, clouds: { all: 35 }, pop: 0.1, dt_txt: '' },
  ],
}
