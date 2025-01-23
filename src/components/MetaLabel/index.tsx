import {BaseSyntheticEvent, ReactNode} from 'react'
import clsx from 'clsx'

export enum MetaLabelVariant {
  gray = 'gray',
  green = 'green',
  amber = 'amber',
  blue = 'blue',
  sky = 'sky',
  red = 'red',
}

export enum MetaLabelSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  none = 'none'
}

export default function MetaLabel(
  {
    hover,
    press,
    onClick,
    children,
    className = '',
    disabled = false,
    size = MetaLabelSize.xs,
    variant = MetaLabelVariant.gray
  }:
  {
    hover?: boolean
    press?: boolean
    className?: string
    children: ReactNode
    disabled?: boolean
    size?: MetaLabelSize
    variant?: MetaLabelVariant
    onClick?: (e: BaseSyntheticEvent) => void
  }
) {

  return (
    <div
      onClick={onClick}
      className={clsx('flex items-center justify-center rounded-full select-none text-nowrap transition-all', {
        [className]: className,
        ['bg-gray-700 text-gray-300']: !disabled && variant === MetaLabelVariant.gray,
        ['bg-gray-700/50 text-gray-300/50']: disabled && variant === MetaLabelVariant.gray,

        ['bg-green-700 text-gray-300']: !disabled && variant === MetaLabelVariant.green,
        ['bg-green-700/50 text-gray-300/50']: disabled && variant === MetaLabelVariant.green,

        ['bg-amber-700 text-gray-300']: !disabled && variant === MetaLabelVariant.amber,
        ['bg-amber-700/50 text-gray-300/50']: disabled && variant === MetaLabelVariant.amber,

        ['bg-blue-700 text-gray-300']: !disabled && variant === MetaLabelVariant.blue,
        ['bg-blue-700/50 text-gray-300/50']: disabled && variant === MetaLabelVariant.blue,

        ['bg-sky-700 text-gray-300']: !disabled && variant === MetaLabelVariant.sky,
        ['bg-sky-700/50 text-gray-300/50']: disabled && variant === MetaLabelVariant.sky,

        ['bg-red-800 text-gray-300']: !disabled && variant === MetaLabelVariant.red,
        ['bg-red-800/50 text-gray-300/50']: disabled && variant === MetaLabelVariant.red,

        ['cursor-pointer']: !disabled && hover,
        ['hover:opacity-90']: !disabled && hover,
        ['active:opacity-80']: !disabled && press,

        ['min-w-4 h-4 text-[10px]']: size === MetaLabelSize.xs,
        ['min-w-6 h-6 text-xs']: size === MetaLabelSize.sm,
        ['min-w-8 h-8 text-sm']: size === MetaLabelSize.md,
      })}
    >
      {children}
    </div>
  )
}
