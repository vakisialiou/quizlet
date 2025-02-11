import { CardStatus } from '@containers/Simulator/CardAggregator/types'
import SVGError from '@public/svg/error.svg'
import { TermData } from '@entities/Term'
import { ReactNode } from 'react'
import clsx from 'clsx'

export default function CardError(
  {
    term,
    status,
    inverted,
    children,
    className = ''
  }:
  {
    term: TermData
    inverted: boolean
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
      <div className="flex gap-1 flex-col items-center text-xs font-bold leading-none">
        {status === CardStatus.success &&
          <div className="text-green-800 uppercase">
            Success
          </div>
        }

        {status === CardStatus.error &&
          <div className="text-red-700 uppercase">
            <SVGError
              width={16}
              height={16}
            />
          </div>
        }

        {status === CardStatus.error &&
          <div className="text-gray-500 line-clamp-2 text-center">
            {inverted ? term.question : term.answer}
          </div>
        }
      </div>

      {children}
    </div>
  )
}
