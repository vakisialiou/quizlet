import { ReactNode } from 'react'
import clsx from 'clsx'

export default function Signature(
  {
    children,
    signature,
    className = '',
  }:
  {
    children?: ReactNode
    className?: string
    signature: string | null
  }
) {
  return (
    <div
      className={clsx('flex w-full items-center justify-between py-2 px-3 text-white/25 uppercase font-bold text-[10px]', {
        [className]: className
      })}
    >
      {signature &&
        <span>{signature}</span>
      }

      {children}
    </div>
  )
}
