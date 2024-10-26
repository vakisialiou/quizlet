import { ReactNode } from 'react'
import clsx from 'clsx'

enum Variant {
  Gray700 = 'bg-gray-700',
}

export default function MetaLabel(
  { children, variant = Variant.Gray700 }:
  { children: ReactNode, variant?: Variant }
) {

  return (
    <div
      className={clsx('flex items-center rounded-full px-4 py-1 text-xs select-none text-nowrap', {
        [variant]: variant,
      })}
    >
      {children}
    </div>
  )
}
