import type { HTMLAttributes } from 'react'
import { cx } from './cx'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'alert'
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span className={cx('mc-ui-badge', `mc-ui-badge--${tone}`, className)} {...props} />
  )
}
