export function LoadingSpinner() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16" aria-live="polite" aria-busy="true">
      <div>
        <div className="mb-6 flex justify-between">
          <div className="h-3 w-24 rounded bg-paper-3" />
          <div className="h-3 w-28 rounded bg-paper-3" />
        </div>
        <div className="h-[280px] animate-pulse rounded-atmos bg-card/90" />
        <div className="mt-10 flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 flex-1 rounded-[18px] bg-paper-2" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-3 w-28 rounded bg-paper-3" />
        <div className="h-10 w-64 rounded bg-paper-3" />
        <div className="h-[320px] rounded-sm bg-paper-2" />
      </div>
      <span className="sr-only">Loading weather</span>
    </div>
  )
}

export function WeatherCardSkeleton() {
  return <LoadingSpinner />
}

export function ForecastSkeleton() {
  return <LoadingSpinner />
}
