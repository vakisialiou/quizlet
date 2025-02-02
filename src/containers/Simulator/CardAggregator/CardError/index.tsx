import { CardStatus } from '@containers/Simulator/CardAggregator/types'
import { ReactNode } from 'react'
import clsx from 'clsx'

export default function CardError(
  {
    status,
    children,
    className = ''
  }:
  {
    children?: ReactNode
    className?: string
    status: CardStatus
  }
) {
  return (
    <div
      className={clsx('flex flex-col items-center gap-2', {
        [className]: className
      })}
    >
      <div className="flex items-center text-xs font-bold leading-none uppercase">
        {status === CardStatus.success &&
          <div className="text-green-800">
            Success
          </div>
        }

        {status === CardStatus.error &&
          <div className="text-amber-600">
            Error
          </div>
        }
      </div>

      {children}
    </div>
  )
}
