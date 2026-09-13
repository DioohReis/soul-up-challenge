type ProgressBarProps = {
  label: string
  value: number
  max?: number
  className: string
  indicatorClassName?: string
}

export function ProgressBar({
  label,
  value,
  max = 100,
  className,
  indicatorClassName,
}: ProgressBarProps) {
  const maximum = Number.isFinite(max) && max > 0 ? max : 100
  const current = Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0
  const percentage = (current / maximum) * 100

  return (
    <div
      className={className}
      role="progressbar"
      aria-label={label}
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={maximum}
    >
      <span
        className={indicatorClassName}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
