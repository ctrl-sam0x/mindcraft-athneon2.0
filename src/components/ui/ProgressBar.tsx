import { useId } from 'react'
import { cx } from './cx'

type ProgressBarProps = {
  label: string
  value: number
  max?: number
  valueText?: string
  showLabel?: boolean
  tone?: 'primary' | 'success' | 'info'
  className?: string
}

export function ProgressBar({
  label,
  value,
  max = 100,
  valueText,
  showLabel = true,
  tone = 'primary',
  className,
}: ProgressBarProps) {
  const id = useId()
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0
  const text = valueText ?? `${percent}%`

  return (
    <div className={cx('mc-ui-progress', tone !== 'primary' && `mc-ui-progress--${tone}`, className)}>
      {showLabel ? (
        <div className="mc-ui-progress__header">
          <span id={`${id}-label`}>{label}</span>
          <span className="mc-ui-progress__value">{text}</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-labelledby={showLabel ? `${id}-label` : undefined}
        aria-label={showLabel ? undefined : label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={text}
        className="mc-ui-progress__track"
      >
        <div className="mc-ui-progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
