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
  { children, variant = MetaLabelVariant.gray }:
  { children: ReactNode, variant?: MetaLabelVariant }
) {

  return (
    <div
      className={clsx('flex items-center rounded-full px-4 h-4 text-[10px] select-none text-nowrap', {
        ['bg-gray-700']: variant === MetaLabelVariant.gray,
        ['bg-green-700']: variant === MetaLabelVariant.green,
        ['bg-amber-700']: variant === MetaLabelVariant.amber,
        ['bg-blue-700']: variant === MetaLabelVariant.blue,
        ['bg-sky-700']: variant === MetaLabelVariant.sky,
      })}
    >
      {children}
    </div>
  )
}
