import { useState, useEffect, memo } from 'react'
import clsx from 'clsx'
import './style.css'

export type CardSideInfo = {
  text?: string | null,
  lang?: string | null,
  association?: string | null,
}

export type RollbackData = {
  isBackSide: boolean
  faceSide: CardSideInfo,
  backSide: CardSideInfo,
}
export type onRollCallback = (data: RollbackData) => void

function Card(
  { faceSide, backSide, back = false, onRoll }:
  {
    back?: boolean
    faceSide: CardSideInfo,
    backSide: CardSideInfo,
    onRoll?: onRollCallback
  }
) {
  const [isBackSideVisible, setBackSideVisible] = useState(back)

  useEffect(() => {
    if (onRoll) {
      onRoll({ faceSide, backSide, isBackSide: isBackSideVisible })
    }
  }, [onRoll, faceSide, backSide, isBackSideVisible])

  return (
    <div
      className="card w-72 h-96 group cursor-pointer select-none"
      onClick={() => {
        setBackSideVisible((prevState) => {
          return !prevState
        })
      }}
    >
      <div
        className={clsx('card__inner relative w-full h-full transition-colors', {
          ['card__inner_back']: isBackSideVisible
        })}
      >
        <div className="card__front absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 border border-gray-500/50 bg-gray-900/90">
          <p className="text-gray-500 group-hover:text-gray-400 transition-colors font-semibold text-xl text-center">
            {faceSide.text}
          </p>
        </div>
        <div
          className="card__back absolute w-full h-full flex flex-col gap-4 items-center justify-center p-6 border border-gray-500/10 bg-gray-900/80">
          <p
            className="text-gray-600 group-hover:text-gray-500 transition-colors font-semibold text-xl text-center">
            {backSide.text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default memo(Card)
