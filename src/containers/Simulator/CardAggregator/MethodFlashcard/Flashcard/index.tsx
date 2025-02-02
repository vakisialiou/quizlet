import Signature from '@containers/Simulator/CardAggregator/Signature'
import CardText from '@containers/Simulator/CardAggregator/CardText'
import { BaseSyntheticEvent } from 'react'
import { TermData } from '@entities/Term'
import clsx from 'clsx'
import './style.css'

export default function Flashcard(
  {
    term,
    onClick,
    inverted,
    signature,
    isBackSide,
    className = '',
  }:
  {
    term: TermData
    inverted: boolean
    isBackSide: boolean
    className?: string,
    signature: string | null,
    onClick?: (e: BaseSyntheticEvent) => void,
  }
) {
  return (
    <div
      onClick={onClick}
      className={clsx('card group cursor-pointer select-none', {
        [className]: className
      })}
    >
      <div
        className={clsx('card__inner relative w-full h-full transition-colors rounded border border-gray-500/50 bg-gray-500/10 shadow-inner shadow-gray-500/20', {
          ['card__inner_back']: isBackSide
        })}
      >
        <div
          className="card__front absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 rounded"
        >
          <CardText
            term={term}
            className="mt-2"
            inverted={inverted}
          />

          <Signature
            inverted={inverted}
            signature={signature}
            className="absolute right-0 top-0"
          />

        </div>
        <div
          className="card__back absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 rounded"
        >
          <p
            className="text-gray-600 group-hover:text-gray-500 transition-colors font-semibold text-xl text-center"
          >
            {inverted ? term.question : term.answer}
          </p>

          {term.association &&
            <div
              className="text-gray-500 text-xs text-center text-white/25 font-bold line-clamp-3 h-[48px]"
            >
              {term.association}
            </div>
          }

          <Signature
            inverted={inverted}
            signature={signature}
            className="absolute right-0 top-0"
          />

        </div>
      </div>
    </div>
  )
}
