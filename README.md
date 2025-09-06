# Tiempo Aplicación - Modern Weather App

A beautiful, modern weather application built with Next.js, TypeScript, and Tailwind CSS. Features detailed weather forecasts, air quality monitoring, weather maps, and real-time alerts.

## ✨ Features

- **Current Weather**: Real-time weather data with beautiful UI
- **5-Day Forecast**: Detailed hourly and daily forecasts
- **Air Quality Monitoring**: AQI and pollutant concentration data
- **Weather Alerts**: Real-time weather warnings and advisories
- **Interactive Maps**: Weather visualization with multiple layers
- **Search & Geolocation**: Find weather for any location worldwide
- **Dark Mode**: Beautiful dark/light theme switching
- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Smooth animations and micro-interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Tiempo-Aplicacion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Maps**: Leaflet (optional)
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📱 Features Overview

### Weather Search
- Smart search with autocomplete suggestions
- Geolocation support
- Search history and favorites

### Current Weather
- Real-time temperature and conditions
- Feels-like temperature
- Wind speed and direction
- Humidity and pressure
- Visibility
- Sunrise/sunset times
- Air quality index

### 5-Day Forecast
- Daily weather overview
- Hourly breakdown
- Temperature highs and lows
- Weather conditions
- Wind patterns

### Air Quality
- Air Quality Index (AQI)
- Pollutant concentrations (PM2.5, PM10, NO₂, O₃, SO₂, CO)
- Health recommendations
- Color-coded severity levels

### Weather Alerts
- Real-time weather warnings
- Severity classification
- Detailed descriptions
- Safety recommendations

### Interactive Maps
- Weather visualization
- Multiple map layers
- Temperature overlays
- Precipitation maps

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design
- **Dark Mode**: Automatic system theme detection
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized loading and caching

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

### Customization

- **Colors**: Modify `tailwind.config.js`
- **Components**: Update components in `src/components/`
- **API**: Extend `src/services/weatherService.ts`
- **Types**: Add types in `src/types/weather.ts`

## 📊 API Usage

This app uses the OpenWeatherMap API with the following endpoints:

### ✅ **Free Tier Available (No Credit Card Required):**
- **Current Weather API** - Real-time weather data
- **5-Day Weather Forecast API** - 3-hour forecasts for 5 days
- **Air Pollution API** - Air quality and pollutant data
- **Geocoding API** - Location search and coordinates
- **UV Index API** - UV radiation data

### ⚠️ **Paid Tier Required:**
- **One Call API 3.0** - Weather alerts (1,000 free calls/day with credit card)
- **Weather Maps** - Interactive map tiles

### 📈 **Free Tier Limits:**
- 60 API calls per minute
- 1,000,000 calls per month
- All core weather features included

**Note:** Weather alerts require a paid subscription, but the app gracefully handles this by showing a message when alerts aren't available.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the amazing framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Enjoy your new modern weather app! 🌤️**