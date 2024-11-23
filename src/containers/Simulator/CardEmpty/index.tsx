import { ReactNode, CSSProperties } from 'react'
import clsx from 'clsx'

export default function CardEmpty({ children, style, className = '' }: { children?: ReactNode, className?: string, style?: CSSProperties }) {
  return (
    <div
      style={style}
      className={clsx('flex flex-col w-72 h-96 gap-4 items-center justify-center text-center p-6 border border-gray-600 bg-gray-900', {
        [className]: className
      })}
    >
      {children}
    </div>
  )
}
