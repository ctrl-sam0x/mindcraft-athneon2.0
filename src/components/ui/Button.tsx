import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'sm'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'mc-ui-button',
        `mc-ui-button--${variant}`,
        size === 'sm' && 'mc-ui-button--sm',
        fullWidth && 'mc-ui-button--full',
        className
      )}
      {...props}
    />
  )
}
