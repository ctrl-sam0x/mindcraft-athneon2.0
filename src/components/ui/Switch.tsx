import { useId, type ReactNode } from 'react'
import { cx } from './cx'

type SwitchProps = {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SwitchProps) {
  const id = useId()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      aria-describedby={description ? `${id}-description` : undefined}
      disabled={disabled}
      className={cx('mc-ui-switch', className)}
      onClick={() => onCheckedChange(!checked)}
    >
      <span className="mc-ui-switch__text">
        <span id={`${id}-label`} className="mc-ui-switch__label">
          {label}
        </span>
        {description ? (
          <span id={`${id}-description`} className="mc-ui-switch__description">
            {description}
          </span>
        ) : null}
      </span>
      <span className="mc-ui-switch__track" aria-hidden="true">
        <span className="mc-ui-switch__thumb" />
      </span>
    </button>
  )
}
