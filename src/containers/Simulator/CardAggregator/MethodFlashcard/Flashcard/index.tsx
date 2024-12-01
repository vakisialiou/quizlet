import { BaseSyntheticEvent } from 'react'
import clsx from 'clsx'
import './style.css'

export type CardSideInfo = {
  text?: string | null,
  lang?: string | null,
  signature: string | null
  association?: string | null,
}

export default function Flashcard(
  {
    onClick,
    isBackSide,
    className = '',
    faceSide,
    backSide,
  }:
  {
    className?: string,
    isBackSide: boolean
    faceSide: CardSideInfo,
    backSide: CardSideInfo,
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
        <div className="card__front absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 rounded">
          <p
            className="text-gray-500 group-hover:text-gray-400 transition-colors font-semibold text-xl text-center"
          >
            {faceSide.text}
          </p>

          {faceSide.signature &&
            <div className="absolute left-3 top-3 text-gray-700/50 uppercase font-bold text-[10px]">
              {faceSide.signature}
            </div>
          }
        </div>
        <div
          className="card__back absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 rounded"
        >
          <p
            className="text-gray-600 group-hover:text-gray-500 transition-colors font-semibold text-xl text-center"
          >
            {backSide.text}
          </p>

          {backSide.signature &&
            <div className="absolute right-3 top-3 text-gray-700/50 uppercase font-bold text-[10px]">
              {backSide.signature}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
