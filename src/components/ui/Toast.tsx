import { useEffect, type ReactNode } from 'react'
import { cx } from './cx'

export type ToastItem = {
  id: string
  title: ReactNode
  description?: ReactNode
  tone?: 'default' | 'success' | 'info' | 'warning'
}

type ToastProps = ToastItem & {
  onDismiss: (id: string) => void
  duration?: number
}

export function Toast({ id, title, description, tone = 'default', onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return
    const timer = window.setTimeout(() => onDismiss(id), duration)
    return () => window.clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div className={cx('mc-ui-toast', tone !== 'default' && `mc-ui-toast--${tone}`)}>
      <div className="mc-ui-toast__body">
        <span className="mc-ui-toast__title">{title}</span>
        {description ? <span>{description}</span> : null}
      </div>
      <button
        type="button"
        className="mc-ui-toast__close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        <span aria-hidden="true">{'\u00d7'}</span>
      </button>
    </div>
  )
}

type ToastRegionProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  duration?: number
}

/** Polite live region that announces and stacks toasts. */
export function ToastRegion({ toasts, onDismiss, duration }: ToastRegionProps) {
  return (
    <div className="mc-ui-toast-region" role="status" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} duration={duration} />
      ))}
    </div>
  )
}
