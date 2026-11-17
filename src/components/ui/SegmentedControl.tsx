import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'

export type SegmentOption<T extends string> = {
  value: T
  label: ReactNode
}

function nextIndex(event: KeyboardEvent, current: number, count: number) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') return (current + 1) % count
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') return (current - 1 + count) % count
  if (event.key === 'Home') return 0
  if (event.key === 'End') return count - 1
  return null
}

type SegmentedControlProps<T extends string> = {
  label: string
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Single choice between a few options (radio-group semantics). */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  return (
    <div role="radiogroup" aria-label={label} className={cx('mc-ui-segmented', className)}>
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(node) => {
            refs.current[index] = node
          }}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={index === selectedIndex ? 0 : -1}
          className="mc-ui-segmented__option"
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => {
            const target = nextIndex(event, index, options.length)
            if (target === null) return
            event.preventDefault()
            onChange(options[target].value)
            refs.current[target]?.focus()
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

type TabsProps<T extends string> = SegmentedControlProps<T> & {
  renderPanel: (value: T) => ReactNode
}

/** Switches between panels of content (tablist semantics). */
export function Tabs<T extends string>({
  label,
  options,
  value,
  onChange,
  renderPanel,
  className,
}: TabsProps<T>) {
  const baseId = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="mc-ui-segmented">
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            id={`${baseId}-tab-${option.value}`}
            type="button"
            role="tab"
            aria-selected={option.value === value}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === selectedIndex ? 0 : -1}
            className="mc-ui-segmented__option"
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              const target = nextIndex(event, index, options.length)
              if (target === null) return
              event.preventDefault()
              onChange(options[target].value)
              refs.current[target]?.focus()
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        className="mc-ui-tabpanel"
      >
        {renderPanel(value)}
      </div>
    </div>
  )
}
