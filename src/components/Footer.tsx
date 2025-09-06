'use client'

import { 
  Github, 
  ExternalLink, 
  Heart, 
  Code, 
  Zap, 
  Globe, 
  Cloud, 
  Database,
  Palette,
  Smartphone,
  Monitor,
  Laptop,
  Coffee,
  Star,
  ArrowUp
} from 'lucide-react'
import { useState, useEffect } from 'react'

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const technologies = [
    { name: 'Next.js 14', icon: <Zap className="h-5 w-5" />, color: 'text-black dark:text-white' },
    { name: 'TypeScript', icon: <Code className="h-5 w-5" />, color: 'text-blue-600 dark:text-blue-400' },
    { name: 'Tailwind CSS', icon: <Palette className="h-5 w-5" />, color: 'text-cyan-500 dark:text-cyan-400' },
    { name: 'React', icon: <Globe className="h-5 w-5" />, color: 'text-blue-400 dark:text-blue-300' },
    { name: 'Lucide Icons', icon: <Heart className="h-5 w-5" />, color: 'text-pink-500 dark:text-pink-400' },
    { name: 'OpenWeather API', icon: <Cloud className="h-5 w-5" />, color: 'text-orange-500 dark:text-orange-400' },
    { name: 'Vercel', icon: <Database className="h-5 w-5" />, color: 'text-gray-600 dark:text-gray-300' }
  ]

  const features = [
    'Real-time Weather Data',
    '5-Day Forecast',
    'Air Quality Monitoring',
    'Weather Alerts',
    'Interactive Maps',
    'Dark/Light Mode',
    'Responsive Design',
    'Geolocation Support'
  ]

  const quickLinks = [
    { name: 'GitHub Repository', href: '#', icon: <Github className="h-4 w-4" /> },
    { name: 'Live Demo', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
    { name: 'Portfolio', href: '#', icon: <Monitor className="h-4 w-4" /> },
    { name: 'Contact', href: '#', icon: <Heart className="h-4 w-4" /> }
  ]

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <footer className="relative mt-20 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-900 dark:text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-500/5 to-pink-500/5 dark:from-yellow-500/10 dark:to-pink-500/10 blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
              {/* Project Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <Cloud className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tiempo Aplicación</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-200">Modern Weather App</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  A beautiful, modern weather application built with cutting-edge technologies. 
                  Featuring real-time data, interactive maps, and stunning UI/UX design.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Coffee className="h-4 w-4" />
                  <span>Built with passion and attention to detail</span>
                </div>
              </div>

              {/* Technologies */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Code className="h-5 w-5" />
                  <span>Technologies Used</span>
                </h4>
                <div className="space-y-3">
                  {technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="group flex items-center space-x-3 rounded-lg bg-white/60 dark:bg-white/5 p-3 transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/10 hover:scale-105 border border-gray-200/50 dark:border-white/10"
                    >
                      <div className={tech.color}>
                        {tech.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Star className="h-5 w-5" />
                  <span>Key Features</span>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2 text-gray-900 dark:text-white">
                  <ExternalLink className="h-5 w-5" />
                  <span>Quick Links</span>
                </h4>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="group flex items-center space-x-3 rounded-lg bg-white/60 dark:bg-white/5 p-3 transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/10 hover:scale-105 border border-gray-200/50 dark:border-white/10"
                    >
                      <div className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
                        {link.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 gap-8 rounded-2xl bg-white/60 dark:bg-white/5 p-8 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Free Tier</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">6+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Data Sources</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Day Forecast</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Locations</div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-16 border-t border-gray-200 dark:border-white/10 pt-8">
              <div className="flex flex-col items-center justify-between space-y-6 lg:flex-row lg:space-y-0">
                <div className="text-center lg:text-left">
                  <p className="text-gray-600 dark:text-gray-300">
                    © 2024 Tiempo Aplicación. Built with{' '}
                    <Heart className="inline h-4 w-4 text-red-500" />{' '}
                    for the developer community.
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Powered by OpenWeatherMap API • Deployed on Vercel
                  </p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile Ready</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Laptop className="h-4 w-4" />
                    <span>Desktop Optimized</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Monitor className="h-4 w-4" />
                    <span>Responsive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}