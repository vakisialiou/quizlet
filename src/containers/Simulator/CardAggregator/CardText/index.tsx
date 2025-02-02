import { TermData } from '@entities/Term'
import clsx from 'clsx'

export default function CardText(
  {
    term,
    inverted,
    className = '',
  }:
  {
    term: TermData
    inverted: boolean
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
        className="text-gray-500 text-lg text-center font-bold line-clamp-1"
      >
        {inverted ? term.answer : term.question}
      </div>

      {term.association &&
        <div
          className="text-gray-500 text-xs text-center text-white/25 font-bold line-clamp-3 h-[48px]"
        >
          {term.association}
        </div>
      }
    </div>
  )
}
