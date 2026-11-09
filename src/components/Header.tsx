'use client'

export function Header({ timeLabel }: { timeLabel: string }) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <p className="text-[11px] font-medium tracking-[0.28em] text-ink">ATMOS / 01</p>
      <p className="text-[11px] tracking-[0.18em] text-ink-muted">{timeLabel}</p>
    </header>
  )
}
