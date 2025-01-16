import { ReactNode } from 'react'
import clsx from 'clsx'

export default function Clamp(
  {
    rows,
    title,
    children,
    className = ''
  }:
  {
    rows: number
    children: string
    title?: ReactNode
    className?: string
  }
) {
  return (
    <div
      className={clsx('flex flex-col gap-1', {
        [className]: className
      })}
    >
      {title}

      <div
        className={clsx('whitespace-pre-line', {
          [`line-clamp-1`]: rows === 1,
          [`line-clamp-2`]: rows === 2,
          [`line-clamp-3`]: rows === 3,
          [`line-clamp-4`]: rows === 4,
          [`line-clamp-5`]: rows === 5,
          [`line-clamp-6`]: rows === 6,
        })}
      >
        {children}
      </div>
    </div>
  )
}
