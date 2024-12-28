import { ReactNode } from 'react'
import clsx from 'clsx'

export enum MetaLabelVariant {
  gray = 'gray',
  green = 'green',
  amber = 'amber',
  blue = 'blue',
  sky = 'sky',
}

export default function MetaLabel(
  {
    children,
    disabled = false,
    variant = MetaLabelVariant.gray
  }:
  {
    children: ReactNode
    disabled?: boolean
    variant?: MetaLabelVariant
  }
) {

  return (
    <div
      className={clsx('flex items-center rounded-full px-4 h-4 text-[10px] select-none text-nowrap', {
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
      })}
    >
      {children}
    </div>
  )
}
