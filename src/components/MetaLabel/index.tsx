import { ReactNode } from 'react'
import clsx from 'clsx'

export enum MetaLabelVariant {
  gray = 'gray',
  green = 'green'
}

export default function MetaLabel(
  { children, variant = MetaLabelVariant.gray }:
  { children: ReactNode, variant?: MetaLabelVariant }
) {

  return (
    <div
      className={clsx('flex items-center rounded-full px-4 py-1 text-xs select-none text-nowrap', {
        ['bg-gray-700']: variant === MetaLabelVariant.gray,
        ['bg-green-700']: variant === MetaLabelVariant.green,
      })}
    >
      {children}
    </div>
  )
}
