'use client'

import { AlertData } from '@/types/weather'
import { format } from 'date-fns'
import { AlertTriangle, Clock } from 'lucide-react'

interface WeatherAlertsProps {
  alerts: AlertData[]
}

function alertSeverity(event: string) {
  const eventLower = event.toLowerCase()
  if (eventLower.includes('warning') || eventLower.includes('severe')) return 'high'
  if (eventLower.includes('watch') || eventLower.includes('advisory')) return 'medium'
  return 'low'
}

export function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  return (
    <section className="rounded-atmos border border-line bg-snow px-5 py-5 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="atmos-label">Weather alerts</h3>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-ink-muted">
          {alerts.length > 0 ? `${alerts.length} active` : 'None active'}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-paper px-4 py-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-ink-faint" strokeWidth={1.25} />
          <p className="text-[14px] text-ink">No weather alerts for this location.</p>
          <p className="mt-2 max-w-[42ch] mx-auto text-[12px] leading-relaxed text-ink-muted">
            Government-issued alerts appear here when your OpenWeather plan includes One Call data.
            Current conditions, forecast, and air quality remain available on the free tier.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert, index) => {
            const severity = alertSeverity(alert.event)
            return (
              <li key={index} className="rounded-xl border border-line bg-paper px-4 py-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="text-[15px] font-medium text-ink">{alert.event}</h4>
                  <span className="atmos-label shrink-0">{severity}</span>
                </div>
                <p className="text-[13px] leading-relaxed text-ink-soft">{alert.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    Start {format(new Date(alert.start * 1000), 'MMM d, h:mm a')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    End {format(new Date(alert.end * 1000), 'MMM d, h:mm a')}
                  </span>
                </div>
                {alert.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {alert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line bg-snow px-2 py-0.5 text-[10px] text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[10px] text-ink-faint">Issued by {alert.sender_name}</p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
