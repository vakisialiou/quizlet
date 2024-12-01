import { ReactNode, CSSProperties } from 'react'
import clsx from 'clsx'

export default function CardEmpty(
  {
    children,
    style,
    className = '',
    classNameContent = '',
    onClick,
    active = false
  }:
  {
    children?: ReactNode,
    className?: string,
    classNameContent?: string,
    style?: CSSProperties,
    onClick?: () => void,
    active?: boolean
  }
) {
  return (
    <div
      className={clsx('bg-black', {
        [className]: className
      })}
    >
      <div
        style={style}
        onClick={onClick}
        className={clsx('flex flex-col w-72 h-96 gap-4 items-center justify-center text-center rounded border border-gray-500/50 bg-gray-500/10 shadow-inner shadow-gray-500/20 select-none', {
          ['border-gray-500']: active,
          ['border-gray-700']: !active,
          [classNameContent]: classNameContent
        })}
      >
        {children}
      </div>
    </div>
  )
}
