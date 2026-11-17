import type { ReactNode } from 'react'
import { cx } from './cx'

type EmptyStateProps = {
  title: string
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  headingLevel?: 'h2' | 'h3' | 'h4'
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel: Heading = 'h3',
  className,
}: EmptyStateProps) {
  return (
    <div className={cx('mc-ui-empty', className)}>
      {icon ? (
        <div className="mc-ui-empty__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Heading className="mc-ui-empty__title">{title}</Heading>
      {description ? <p className="mc-ui-empty__description">{description}</p> : null}
      {action ? <div className="mc-ui-empty__action">{action}</div> : null}
    </div>
  )
}
