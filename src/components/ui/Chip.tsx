import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
}

export function Chip({
  selected = false,
  onSelectedChange,
  onClick,
  className,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx('mc-ui-chip', className)}
      onClick={(event) => {
        onClick?.(event)
        onSelectedChange?.(!selected)
      }}
      {...props}
    />
  )
}
