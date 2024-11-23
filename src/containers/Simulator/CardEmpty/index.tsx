import { ReactNode, CSSProperties } from 'react'
import clsx from 'clsx'

export default function CardEmpty(
  { children, style, className = '', onClick, active = false }:
  { children?: ReactNode, className?: string, style?: CSSProperties, onClick?: () => void, active?: boolean }
) {
  return (
    <div
      style={style}
      onClick={onClick}
      className={clsx('flex flex-col w-72 h-96 gap-4 items-center justify-center text-center p-6 border', {
        ['bg-gray-800 border-gray-300']: active,
        ['bg-gray-900 border-gray-600']: !active,
        [className]: className
      })}
    >
      {children}
    </div>
  )
}
