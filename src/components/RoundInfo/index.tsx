import { ReactNode } from 'react'
import clsx from 'clsx'

export enum RoundInfoVariant {
  default = 'default',
  warning = 'warning',
  danger = 'danger'
}

export default function RoundInfo(
  {
    title,
    value,
    className = '',
    variant = RoundInfoVariant.default,
  }:
  {
    title?: string
    className?: string
    value?: ReactNode | string | number
    variant?: RoundInfoVariant
  }
) {
  return (
    <div
      className={clsx('flex rounded-full items-center justify-center bg-gray-500/10 w-20 h-20 shadow-sm shadow-gray-400', {
        [className]: className
      })}
    >
      <div className="flex flex-col w-full h-full items-center justify-center border border-white/10 rounded-full shadow-inner shadow-white/10">
        {title &&
          <span className="uppercase text-gray-600 font-bold text-[10px] mt-2">
            {title}
          </span>
        }

        {value !== undefined &&
          <span
            className={clsx('text-sm font-bold font-mono', {
              ['text-white/50']: variant === RoundInfoVariant.default,
              ['text-amber-600']: variant === RoundInfoVariant.danger,
              ['text-red-800']: variant === RoundInfoVariant.warning,
            })}
          >
            {value}
          </span>
        }
      </div>
    </div>
  )
}
