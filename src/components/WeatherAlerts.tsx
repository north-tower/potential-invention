'use client'

import { AlertData } from '@/types/weather'
import { format } from 'date-fns'
import { ShieldCheck } from 'lucide-react'

interface WeatherAlertsProps {
  alerts: AlertData[]
  locationName: string
}

type Severity = 'high' | 'medium' | 'low'

function alertSeverity(event: string): Severity {
  const eventLower = event.toLowerCase()
  if (eventLower.includes('warning') || eventLower.includes('severe')) return 'high'
  if (eventLower.includes('watch') || eventLower.includes('advisory')) return 'medium'
  return 'low'
}

const severityLabel: Record<Severity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const severityWeight: Record<Severity, string> = {
  high: 'font-semibold',
  medium: 'font-medium',
  low: 'font-normal',
}

function statusPill(activeCount: number) {
  return (
    <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-ink-muted">
      {activeCount === 0 ? 'None active' : `${activeCount} active`}
    </span>
  )
}

export function WeatherAlerts({ alerts, locationName }: WeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <section className="bento-panel">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
            <h3 className="atmos-label shrink-0">Weather alerts</h3>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden />
              <span>No active alerts for {locationName}.</span>
            </span>
          </div>
          {statusPill(0)}
        </div>
      </section>
    )
  }

  return (
    <section className="bento-panel">
      <div className="bento-card-header mb-4">
        <h3 className="atmos-label">Weather alerts</h3>
        {statusPill(alerts.length)}
      </div>

      <ul className="divide-y divide-line">
        {alerts.map((alert, index) => {
          const severity = alertSeverity(alert.event)
          const start = format(new Date(alert.start * 1000), 'MMM d, h:mm a')
          const end = format(new Date(alert.end * 1000), 'MMM d, h:mm a')
          return (
            <li key={`${alert.event}-${alert.start}-${index}`} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[14px] font-medium text-ink">{alert.event}</h4>
                  <p className="mt-1 text-[12px] text-ink-muted">{alert.sender_name}</p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-ink-faint">
                    {start}
                    <span className="text-ink-muted"> – </span>
                    {end}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-paper ${severityWeight[severity]}`}
                >
                  {severityLabel[severity]}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
