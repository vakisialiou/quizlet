import { TermData } from '@entities/Term'
import clsx from 'clsx'

export default function CardText(
  {
    term,
    inverted,
    rowsText = 2,
    rowsTitle = 2,
    className = ''
  }:
  {
    term: TermData
    inverted: boolean
    rowsText?: number
    rowsTitle?: number
    className?: string;
  }
) {
  return (
    <div
      className={clsx('flex flex-col w-full gap-2 items-center', {
        [className]: className
      })}
    >
      <div
        className={clsx('text-white/75 text-xl text-center font-bold', {
          ['line-clamp-1']: rowsTitle === 1,
          ['line-clamp-2']: rowsTitle === 2,
          ['line-clamp-3']: rowsTitle === 3
        })}
      >
        {inverted ? term.answer : term.question}
      </div>

      {term.association &&
        <div
          className={clsx('text-xs text-center text-white/50 font-bold', {
            ['line-clamp-1']: rowsText === 1,
            ['line-clamp-2']: rowsText === 2,
            ['line-clamp-3']: rowsText === 3
          })}
        >
          {term.association}
        </div>
      }
    </div>
  )
}
