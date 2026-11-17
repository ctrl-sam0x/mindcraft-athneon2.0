import type { HTMLAttributes } from 'react'
import { cx } from './cx'

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: 'default' | 'hero' | 'muted'
  interactive?: boolean
  as?: 'div' | 'section' | 'article' | 'li'
}

export function Card({
  variant = 'default',
  interactive = false,
  as: Tag = 'div',
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cx(
        'mc-ui-card',
        variant !== 'default' && `mc-ui-card--${variant}`,
        interactive && 'mc-ui-card--interactive',
        className
      )}
      {...props}
    />
  )
}
