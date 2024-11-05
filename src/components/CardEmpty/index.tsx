import { ReactNode } from 'react'
import clsx from 'clsx'

export default function CardEmpty({ children, style, className = '' }: { children?: ReactNode, className?: string, style?: {} }) {
  return (
    <div
      style={style}
      className={clsx('flex flex-col w-72 h-96 gap-4 items-center justify-center p-6 border border-gray-600 rounded bg-gray-900', {
        [className]: className
      })}
    >
      {children}
    </div>
  )
}
