'use client'

import { Sun, Moon, Monitor, Cloud } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function Header() {
  const { theme, setTheme } = useTheme()

  const themeButtons = [
    { key: 'light', icon: Sun, label: 'Light mode' },
    { key: 'dark', icon: Moon, label: 'Dark mode' },
    { key: 'system', icon: Monitor, label: 'System mode' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/50 dark:bg-gray-900/70 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg ring-1 ring-blue-500/20 sm:h-10 sm:w-10">
              <Cloud className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-sm"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                Tiempo
              </h1>
              <p className="hidden text-xs text-gray-600 dark:text-gray-400 sm:block sm:text-sm">
                Weather Intelligence
              </p>
            </div>
          </div>

          {/* Theme Toggle Section */}
          <div className="flex items-center">
            {/* Desktop Theme Buttons */}
            <div className="hidden items-center space-x-1 rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80 sm:flex">
              {themeButtons.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`group relative flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-all duration-200 ${
                    theme === key
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:text-blue-400 dark:ring-gray-600'
                      : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  }`}
                  title={label}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                  {theme === key && (
                    <div className="absolute inset-0 rounded-lg bg-blue-500/10 dark:bg-blue-400/10"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Theme Dropdown */}
            <div className="relative sm:hidden">
              <div className="flex items-center space-x-1 rounded-lg bg-gray-100/80 p-1 dark:bg-gray-800/80">
                {themeButtons.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`flex items-center justify-center rounded-md p-1.5 transition-all duration-200 ${
                      theme === key
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                    }`}
                    title={label}
                    aria-label={label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}